import { CallAgent } from '@azure/communication-calling';
import { AzureDetails } from './Input';
import {
  createAzureCommunicationCallAdapterFromClient,
  CallAdapter,
  AzureCommunicationCallAdapterOptions,
  CallAdapterLocator,
  StatefulCallClient,
  CallAdapterState,
  toFlatCommunicationIdentifier,
} from '@azure/communication-react';
import { createClients } from './clients';

export const createAdapter = async (azureDetails: AzureDetails) => {
  const { callClient, callAgent } = await createClients(azureDetails);
  const adapter = await createProxyAdapter(callClient, callAgent, {
    BotMri: azureDetails.botMri,
  });
  return { adapter, callClient, callAgent };
};

/**
 * A wrapper around createAzureCommunicationCallAdapter where this instead returns the proxy adapter.
 * The args are the same as createAzureCommunicationCallAdapter.
 */
export const createProxyAdapter = async (
  callClient: StatefulCallClient,
  callAgent: CallAgent,
  locator: CallAdapterLocator,
  options?: AzureCommunicationCallAdapterOptions
): Promise<CallAdapter> => {
  const adapter = await createAzureCommunicationCallAdapterFromClient(
    callClient,
    callAgent,
    locator,
    options
  );
  return new Proxy(adapter, new ProxyAdapter());
};

/**
 * Adapter that alters the scalingMode property when creating video streams.
 * This is a proxy adapter that wraps a base adapter.
 * For all functions it calls the base adapter except those explicitly overridden (currently just `createStreamView`).
 * For `createStreamView`, it alters the `scalingMode` property to `Fit` instead of `Crop`.
 */
class ProxyAdapter implements ProxyHandler<CallAdapter> {
  public get<P extends keyof CallAdapter>(
    target: CallAdapter,
    prop: P
  ): unknown {
    switch (prop) {
      case 'getState': {
        const augmentedState: CallAdapterState = target.getState();
        const call = augmentedState.call;
        if (!call) {
          return () => augmentedState;
        }
        const remoteParticipant = Object.values(call.remoteParticipants).at(0);
        if (!remoteParticipant) {
          return () => augmentedState;
        }
        const key = toFlatCommunicationIdentifier(remoteParticipant.identifier);
        return () => ({
          ...augmentedState,
          call: {
            ...augmentedState.call,
            remoteParticipants: {
              ...call.remoteParticipants,
              [key]: {
                ...remoteParticipant,
                isSpeaking: true,
              },
            },
          },
        });
      }
      default:
        return Reflect.get(target, prop);
    }
  }
}

import { Call, CallState as CallStatus } from '@azure/communication-calling';
import {
  CallAgentProvider,
  CallClientProvider,
  CallClientState,
  CallProvider,
  DeclarativeCallAgent,
  StatefulCallClient,
  useSelector,
} from '@azure/communication-react';
import { Spinner } from '@fluentui/react';
import { useState } from 'react';
import { AzureDetails } from './Input';
import { ConfigurationPage } from './ConfigurationPage';
import { ActiveCallPage } from './ActiveCallPage';
import { CallEndedPage } from './CallEndedPage';

export const ComponentsScreen = (props: {
  callClient: StatefulCallClient;
  callAgent: DeclarativeCallAgent;
  azureDetails: AzureDetails;
}): JSX.Element => {
  const [call, setCall] = useState<Call>();

  return (
    <CallClientProvider callClient={props.callClient}>
      <CallAgentProvider callAgent={props.callAgent}>
        {!call ? (
          <ConfigurationPage
            setCall={setCall}
            locator={{ botMri: props.azureDetails.botMri }}
          />
        ) : (
          <CallProvider call={call}>
            <Calling />
          </CallProvider>
        )}
      </CallAgentProvider>
    </CallClientProvider>
  );
};

export const Calling = (): JSX.Element => {
  const callStatus = useSelector(callStatusSelector);
  const hasCallEnded = useSelector(hasCallEndedSelector);
  switch (callStatus) {
    case 'EarlyMedia':
    case 'Connecting':
    case 'Ringing':
    case 'InLobby':
      return <ConnectingPage />;
    case 'Connected':
    case 'LocalHold':
    case 'RemoteHold':
      return <ActiveCallPage />;
    case 'Disconnecting':
    case 'Disconnected':
      return <CallEndedPage />;
    case 'None':
    case undefined:
      return hasCallEnded ? <CallEndedPage /> : <ConnectingPage />;
  }
};

export const ConnectingPage = (): JSX.Element => {
  return <Spinner label="Connecting" />;
};

const callStatusSelector = (
  state: CallClientState,
  { callId }: { callId: string }
): CallStatus => {
  return state.calls[callId]?.state;
};

const hasCallEndedSelector = (state: CallClientState): boolean => {
  return Object.keys(state.callsEnded ?? {}).length > 0;
};

import { AzureDetails } from './Input';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { createStatefulCallClient } from '@azure/communication-react';

export const createClients = async (azureDetails: AzureDetails) => {
  const callClient = createStatefulCallClient({
    userId: { communicationUserId: azureDetails.userId },
  });
  const credential = new AzureCommunicationTokenCredential(
    azureDetails.userToken
  );
  const callAgent = await callClient.createCallAgent(credential);

  return { callClient, callAgent };
};

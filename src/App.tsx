import { useState } from 'react';

import { AzureDetails, CollectAzureDetails } from './Input';
import { initializeIcons, registerIcons, Spinner } from '@fluentui/react';
import {
  DeclarativeCallAgent,
  DEFAULT_COMPONENT_ICONS,
  StatefulCallClient,
} from '@azure/communication-react';
import { createClients } from './clients';
import { ComponentsScreen } from './ComponentsScreen';

initializeIcons();
registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

function App() {
  const [azureDetails, setAzureDetails] = useState<AzureDetails>();
  const [error, setError] = useState<string>();
  const [clients, setClients] = useState<{
    callClient: StatefulCallClient;
    callAgent: DeclarativeCallAgent;
  }>();

  if (error) {
    return <>Error: {error}</>;
  }

  if (!azureDetails) {
    return (
      <CollectAzureDetails
        callback={(azureDetails) => {
          setAzureDetails(azureDetails);
          (async () => {
            try {
              const clients = await createClients(azureDetails);
              setClients(clients);
            } catch (e) {
              console.error(e);
              setError((e as Error).message);
            }
          })();
        }}
      />
    );
  }
  if (!clients) {
    return <Spinner label="Initializing" />;
  }
  if (clients) {
    return (
      <ComponentsScreen
        azureDetails={azureDetails}
        callClient={clients.callClient}
        callAgent={clients.callAgent}
      />
    );
  }

  return <>Error {error}</>;
}

export default App;

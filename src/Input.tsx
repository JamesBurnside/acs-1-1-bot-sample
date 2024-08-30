import { PrimaryButton, Stack, TextField } from '@fluentui/react';
import { useState } from 'react';
import { getLocalStorageItem, setLocalStorageItem } from './localStorage';

export interface AzureDetails {
  userId: string;
  userToken: string;
  botMri: string;
}

export const CollectAzureDetails = (props: {
  callback: (details: AzureDetails) => void;
}) => {
  const [userId, setUserId] = useState<string | undefined>(
    getLocalStorageItem<string>('userId')
  );
  const [token, setToken] = useState<string | undefined>(
    getLocalStorageItem<string>('token')
  );
  const [botMri, setBotMri] = useState<string | undefined>(
    getLocalStorageItem<string>('botMri') ??
      '8:echo123'
  );

  return (
    <Stack tokens={{ childrenGap: '0.5rem' }}>
      <TextField
        label="UserId"
        onChange={(_, newValue) => {
          setUserId(newValue);
          setLocalStorageItem('userId', newValue);
        }}
        defaultValue={userId}
        required
        styles={{ root: { width: '20rem' } }}
      />
      <TextField
        label="Token"
        onChange={(_, newValue) => {
          setToken(newValue);
          setLocalStorageItem('token', newValue);
        }}
        defaultValue={token}
        required
        styles={{ root: { width: '20rem' } }}
      />
      <TextField
        label="Bot MRI"
        defaultValue={botMri}
        onChange={(_, newValue) => {
          setBotMri(newValue);
          setLocalStorageItem('botMri', newValue);
        }}
        required
        styles={{ root: { width: '20rem' } }}
      />
      <br />
      <PrimaryButton
        disabled={!userId || !token}
        onClick={() => {
          userId &&
            token &&
            botMri &&
            props.callback({
              userId,
              userToken: token,
              botMri,
            });
        }}
      >
        Join call
      </PrimaryButton>
    </Stack>
  );
};

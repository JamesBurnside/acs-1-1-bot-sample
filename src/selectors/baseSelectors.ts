import {
  CallClientState,
  CallingBaseSelectorProps,
  CaptionsInfo,
  RemoteParticipantState,
  toFlatCommunicationIdentifier,
} from '@azure/communication-react';

export const getIdentifier = (state: CallClientState): string =>
  toFlatCommunicationIdentifier(state.userId);

export const getRemoteParticipants = (
  state: CallClientState,
  props: CallingBaseSelectorProps
):
  | {
      [keys: string]: RemoteParticipantState;
    }
  | undefined => {
  return state.calls[props.callId]?.remoteParticipants;
};

export const getCaptions = (
  state: CallClientState,
  props: CallingBaseSelectorProps
): CaptionsInfo[] | undefined => {
  return state.calls[props.callId]?.captionsFeature.captions;
};

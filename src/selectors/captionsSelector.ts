import {
  CallClientState,
  CallingBaseSelectorProps,
  CaptionsInfo,
  toFlatCommunicationIdentifier,
} from '@azure/communication-react';
import * as reselect from 'reselect';
import {
  getCaptions,
  getIdentifier,
} from './baseSelectors';

export type CaptionsSelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  captions: CaptionData[];
};

export interface CaptionData {
  captionText: string;
  userId: string;
  isSelf: boolean;
}

export const captionsSelector: CaptionsSelector = reselect.createSelector(
  [getCaptions, getIdentifier],
  (captions, selfId) => {
    const captionsInfo = captions?.map((c) => {
      const userId = getCaptionsSpeakerIdentifier(c);
      return {
        captionText: c.captionText ?? '',
        userId,
        isSelf: userId === selfId,
      };
    });
    return {
      captions: captionsInfo ?? [],
    };
  }
);

const getCaptionsSpeakerIdentifier = (captions: CaptionsInfo): string => {
  return captions.speaker.identifier
    ? toFlatCommunicationIdentifier(captions.speaker.identifier)
    : '';
};

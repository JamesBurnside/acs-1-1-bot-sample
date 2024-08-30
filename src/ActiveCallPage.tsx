import {
  CollectionUpdatedEvent,
  RemoteAudioStream,
  Volume,
} from "@azure/communication-calling";
import {
  EndCallButton,
  MicrophoneButton,
  NotificationStack,
  useCall,
  usePropsFor,
  useTheme
} from "@azure/communication-react";
import { Image, keyframes, memoizeFunction, mergeStyles, Stack } from "@fluentui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import copilot from "./assets/copilot.svg";
import { Captions } from "./Captions";

// Number from 0 to 100 of when we consider the remote participant to be speaking based on volume level
const IS_SPEAKING_VOLUME_THRESHOLD = 2.5;

export const ActiveCallPage = (): JSX.Element => {
  const currentRemoteAudioLevel = useRemoteAudioVolume();
  return (
    <Stack verticalFill styles={{ root: { maxHeight: "35rem" } }} tokens={{ childrenGap: '1rem' }}>
      <Notifications />

      <Stack.Item disableShrink>
        <BotLogo speakingVolume={currentRemoteAudioLevel} />
      </Stack.Item>

      <Captions />

      <Stack.Item disableShrink>
        <CallControls />
      </Stack.Item>
    </Stack>
  );
};

const BotLogo = (props: { speakingVolume: number }) => {
  // Convert the raw currentRemoteAudioLevel value to a visual REM value
  // Clamp to 20 to prevent the border getting huge.
  // Divide by 16 to convert to a nice REM value
  // let remoteAudioSpeakingBorderREM = Math.min(props.speakingVolume, 20) / 16;

  const isRemoteParticipantSpeaking =
    props.speakingVolume >= IS_SPEAKING_VOLUME_THRESHOLD;

  // Remove tapering values to indicate more quickly copilot has stopped speaking
  // const TAPER_THRESHOLD = 0.5;
  // remoteAudioSpeakingBorderREM =
  //   remoteAudioSpeakingBorderREM < TAPER_THRESHOLD
  //     ? 0
  //     : remoteAudioSpeakingBorderREM;


  return (
    <div
      key="bot"
      style={{
        margin: "1rem auto",
        position: "relative",
      }}
      className={isRemoteParticipantSpeaking ? pulsingAudioClassname : pulsingDefaults}
    >
      {/* Show the copilot logo as the avatar */}
      <Image
        src={copilot}
        styles={{
          image: {
            height: "8rem",
            padding: "1rem",
            margin: "auto",
            borderRadius: "50%",
          },
        }}
      />
    </div>
  );
};

const Notifications = () => {
  const notificationProps = usePropsFor(NotificationStack);

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: "100",
        marginTop: "1rem",
      }}
    >
      <NotificationStack {...notificationProps} />
    </div>
  );
};

const CallControls = () => {
  const theme = useTheme();
  const microphoneButtonProps = usePropsFor(MicrophoneButton);
  const endCallButtonProps = usePropsFor(EndCallButton);

  return (
    <div
      style={{
        borderRadius: theme.effects.roundedCorner6,
        boxShadow: theme.effects.elevation16,
        width: "fit-content",
        margin: "1rem auto",
      }}
    >
      <MicrophoneButton
        {...microphoneButtonProps}
        enableDeviceSelectionMenu={true}
      />
      <EndCallButton
        {...endCallButtonProps}
        styles={{
          root: {
            borderBottomRightRadius: theme.effects.roundedCorner6,
            borderTopRightRadius: theme.effects.roundedCorner6,
          },
        }}
      />
    </div>
  );
};

const useRemoteAudioVolume = (): number => {
  const remoteAudio = useRef<Volume>();
  const [currentRemoteAudioLevel, setCurrentRemoteAudioLevel] =
    useState<number>(0);
  const updateRemoteVolumeLevel = useCallback(async () => {
    console.log("remoteAudio.current?.level", remoteAudio.current?.level);
    setCurrentRemoteAudioLevel(remoteAudio.current?.level ?? 0);
  }, []);

  const call = useCall();

  // subscribeToRemoteAudio - this assumes only one remoteAudioStream will be received
  useEffect(() => {
    const onRemoteAudioStreamUpdated: CollectionUpdatedEvent<
      RemoteAudioStream
    > = (ev) => {
      ev.added.forEach(async (remoteAudioStream: RemoteAudioStream) => {
        remoteAudio.current = await remoteAudioStream.getVolume();
        updateRemoteVolumeLevel();
        remoteAudio.current?.on("levelChanged", updateRemoteVolumeLevel);
      });

      ev.removed.forEach(() => {
        if (remoteAudio.current) {
          remoteAudio.current?.off("levelChanged", updateRemoteVolumeLevel);
        }
      });
    };
    call?.on("remoteAudioStreamsUpdated", onRemoteAudioStreamUpdated);
    return () =>
      call?.off("remoteAudioStreamsUpdated", onRemoteAudioStreamUpdated);
  }, [call, updateRemoteVolumeLevel]);

  return currentRemoteAudioLevel;
};

const pulseFrames = memoizeFunction(() =>
  keyframes({
    '0%': { transform: 'scale(1)', opacity: 1 },
    '50%': { transform: 'scale(1.1)', opacity: '0.6' },
    // '50%': { transform: 'scale(var(--scale))', opacity: 'var(--opacity)' },
    '100%': { transform: 'scale(1)', opacity: 1 }
  })
);

const pulsingDefaults = mergeStyles({
  height: '10rem',
  width: '10rem',
  aspectRatio: '1 / 1',
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  padding: '1rem',
  '::before': {
    content: '""',
    width: '100%',
    height: '100%',
    border: '0.25rem solid transparent',
    borderRadius: '50%',
    position: 'absolute',
  }
});

const pulsingAudioClassname = mergeStyles({
  height: '10rem',
  width: '10rem',
  aspectRatio: '1 / 1',
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  padding: '1rem',
  '::before': {
    content: '""',
    width: '100%',
    height: '100%',
    border: '0.25rem solid rgba(7, 127, 171, 0.7)',
    borderRadius: '50%',
    position: 'absolute',
    animationName: pulseFrames(),
    animationDuration: '1.5s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'ease-in-out'
  }
});
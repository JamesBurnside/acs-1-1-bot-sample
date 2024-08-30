import {
  Call,
  EnvironmentInfo,
  Features,
  GroupCallLocator,
} from "@azure/communication-calling";
import {
  CallClientState,
  DeclarativeCallAgent,
  DevicesButton,
  useCallAgent,
  useDeviceManager,
  usePropsFor,
  useSelector,
} from "@azure/communication-react";
import {
  Dropdown,
  ITheme,
  mergeStyles,
  PrimaryButton,
  Stack,
  Text,
  useTheme,
} from "@fluentui/react";
import { useEffect } from "react";

export const ConfigurationPage = (props: {
  locator: GroupCallLocator;
  setCall: (call: Call) => void;
}): JSX.Element => {
  const theme = useTheme();
  const callAgent = useCallAgent() as DeclarativeCallAgent;
  const deviceManager = useDeviceManager();

  useEffect(() => {
    deviceManager?.askDevicePermission({
      audio: true,
      video: false,
    });
  }, [deviceManager]);

  const audioProps = usePropsFor(DevicesButton);

  return (
    <Stack>
      <Text as="h2" variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
        Choose your local audio setup
      </Text>
      <Stack
        className={selectionContainerStyle(theme, isSafari())}
        tokens={{ childrenGap: "1rem" }}
      >
        <Dropdown
          label="Microphone"
          selectedKey={audioProps.selectedMicrophone?.id}
          options={audioProps.microphones.map((microphone) => ({
            key: microphone.id,
            text: microphone.name,
          }))}
          onChange={(_, newOption) => {
            const microphoneId = newOption?.key as string | undefined;
            const microphone = audioProps.microphones.find(
              (mic) => mic.id === microphoneId
            );
            microphone && deviceManager?.selectMicrophone(microphone);
          }}
        />
        <Dropdown
          label="Speaker"
          selectedKey={audioProps.selectedSpeaker?.id}
          options={audioProps.speakers.map((speaker) => ({
            key: speaker.id,
            text: speaker.name,
          }))}
          onChange={(_, newOption) => {
            const speakerId = newOption?.key as string | undefined;
            const speaker = audioProps.speakers.find(
              (speaker) => speaker.id === speakerId
            );
            speaker && deviceManager?.selectSpeaker(speaker);
          }}
        />
      </Stack>
      <br />
      <PrimaryButton
        onClick={() => {
          // const call = callAgent?.join(props.locator);
          try {
            const call = callAgent?.startCall([
              {
                id: "8:echo123",
              },
            ]);
            props.setCall(call);
          } catch (e) {
            console.error(e);
          }
        }}
      >
        Join Call
      </PrimaryButton>
    </Stack>
  );
};

export const selectionContainerStyle = (
  theme: ITheme,
  noSpeakerDropdownShown?: boolean
): string =>
  mergeStyles({
    width: "20rem",
    minHeight: noSpeakerDropdownShown ? "auto" : `5rem`,
    padding: "1rem",
    borderRadius: theme.effects.roundedCorner6,
    border: `0.0625rem solid ${theme.palette.neutralLight}`,
    overflow: "hidden", // do not let child background overflow the curved corners
    boxShadow: theme.effects.elevation4,
  });

const isSafari = (): boolean | undefined => {
  const environmentInfo = useSelector(environmentInfoSelector);
  return environmentInfo?.environment.browser.toLowerCase() === "safari";
};

const environmentInfoSelector = (
  state: CallClientState
): EnvironmentInfo | undefined => {
  return state.environmentInfo;
};

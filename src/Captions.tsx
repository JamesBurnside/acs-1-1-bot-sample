import { useCall, useSelector } from "@azure/communication-react";
import { captionsSelector } from "./selectors/captionsSelector";
import { CaptionData } from "./selectors/captionsSelector";
import {
  IStyle,
  ITextStyles,
  mergeStyles,
  Spinner,
  Stack,
  Text,
} from "@fluentui/react";
import { useEffect, useRef } from "react";
import { Features } from "@azure/communication-calling";

export const Captions = (): JSX.Element => {
  const { captions } = useSelector(captionsSelector);

  const call = useCall();
  const captionsStarted = useRef(false);
  useEffect(() => {
    if (!captionsStarted.current && call) {
      call?.feature(Features.Captions).captions.startCaptions();
      captionsStarted.current = true;
    }

    return () => {
      captionsStarted.current = false;
    };
  }, [call]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [captions]);

  return (
    <Stack.Item grow className="captions-thread-container">
      {(!captionsStarted.current || captions.length === 0) && (
        <Spinner label="Starting captions" />
      )}
      {captions.map((caption, i) => (
        <Caption key={`caption-${i}`} caption={caption} />
      ))}
      <div ref={messagesEndRef} />
    </Stack.Item>
  );
};

const Caption = (props: { caption: CaptionData }): JSX.Element => {
  const containerStyles = mergeStyles(
    props.caption.isSelf ? userStyles : botStyles
  );

  return (
    <div className={containerStyles + " caption"}>
      <CaptionMessage {...props.caption} />
    </div>
  );
};

const CaptionMessage = (props: { captionText: string }): JSX.Element => {
  return <Text styles={captionsMessageTextStyles}>{props.captionText}</Text>;
};

const botStyles: IStyle = {
  fontWeight: 600,
};

const userStyles: IStyle = {
  fontWeight: 400,
};

const captionsMessageTextStyles: ITextStyles = {
  root: {
    fontWeight: "inherit",
  },
};

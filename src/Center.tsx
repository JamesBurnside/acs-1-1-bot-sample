import { Stack } from '@fluentui/react';

export const Center = (props: { children: JSX.Element }) => {
  return (
    <Stack
      verticalFill
      styles={{
        root: {
          height: '100vh',
          width: '100vw',
        },
      }}
      horizontalAlign="center"
      verticalAlign="center"
    >
      {props.children}
    </Stack>
  );
};

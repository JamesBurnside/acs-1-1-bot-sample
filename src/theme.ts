import { IPalette, IPartialTheme } from '@fluentui/react';

const PowerVirtualAgentGrayscalePalette: Partial<IPalette> = {
  black: '#000', // Black
  neutralDark: '#201f1e', // Gray 190
  neutralPrimary: '#323130', // Gray 160
  neutralPrimaryAlt: '#3b3a39', // Gray 150
  neutralSecondary: '#605e5c', //  Gray 130
  neutralSecondaryAlt: '#8a8886', //  Gray 110
  neutralTertiary: '#a19f9d', //  Gray 90
  neutralTertiaryAlt: '#c8c6c4', //  Gray 60
  neutralQuaternary: '#d2d0ce', //  Gray 50
  neutralQuaternaryAlt: '#e1dfdd', // Gray 40
  neutralLight: '#edebe9', // Gray 30
  neutralLighter: '#f3f2f1', // Gray 20
  neutralLighterAlt: '#faf9f8', // Gray 10
  white: '#fff', // White
};

export const CopilotStudioTheme: IPartialTheme = ((): IPartialTheme => {
  const palette = {
    themeDarker: '#044760', // Shade 30
    themeDark: '#056182', // Shade 20
    themeDarkAlt: '#06729a', // Shade 10
    themePrimary: '#077fab', // Primary
    themeSecondary: '#1c8cb5', // Secondary Tint 10
    themeTertiary: '#57adcd', // Tertiary
    themeLight: '#a4d4e6', // Tint 30
    themeLighter: '#cce8f2', // Tint 40
    themeLighterAlt: '#f2f9fc', // Tint 50
    purple: '#672367', // Purple
    blue: '#118DFF', // Blue
    green: '#6BB700', // Green
    magenta: '#D98FD9', // Magenta
    teal: '#73E3DF', // Teal
    purpleLight: '#F0E9F0', // Purple Light
    blueLight: '#E7F4FF', // Blue Light
    greenLight: '#F0F8E6', // Green light
    ...PowerVirtualAgentGrayscalePalette,
  };
  return {
    palette,
  };
})();

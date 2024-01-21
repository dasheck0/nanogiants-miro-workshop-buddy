export interface ColorMap {
  100: string;
  500: string;
  600: string;
  700: string;
}

export interface ColorTheme {
  primary: ColorMap;
  secondary: ColorMap;
  black: string;
  white: string;
  background: string;
  panel: string;
  danger: string;
}

export interface Theme {
  colors: ColorTheme;
}

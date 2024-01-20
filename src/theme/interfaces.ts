export interface ColorMap {
  100: string;
  500: string;
  700: string;
}

export interface ColorTheme {
  primary: ColorMap;
  accent: ColorMap;
  black: string;
  white: string;
  background: string;
  panel: string;
}

export interface Theme {
  colors: ColorTheme;
}

export interface ColorPalette {
  textColor: string;
  secondaryTextColor: string;
  primaryColor: string;
  panelColor: string;
}

export interface DimensionPalette {
  framePadding: number;
  itemGap: number;
  stickySize: number;
  baseTextSize: number;
  frameGap: number;
}

export const defaultPalette: ColorPalette = {
  textColor: '#545275',
  secondaryTextColor: '#090031',
  primaryColor: '#dddce3',
  panelColor: '#ffffff',
};

export const defaultDimensions: DimensionPalette = {
  framePadding: 25,
  itemGap: 10,
  stickySize: 25,
  baseTextSize: 10,
  frameGap: 75,
};

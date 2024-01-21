import { Frame, Text } from '@mirohq/websdk-types';
import { Position } from '../dtos/miro.dto';
import { defaultDimensions, defaultPalette } from '../theme/palette';

export const useTextItems = () => {
  const createHeading = async (
    text: string,
    position: Position,
    width: number,
    parent: Frame,
    textAlign: 'center' | 'right' | 'left' = 'left',
  ): Promise<Text> => {
    return createText(text, position, width, 2, parent, textAlign);
  };

  const createSubHeading = async (
    text: string,
    position: Position,
    width: number,
    parent: Frame,
    textAlign: 'center' | 'right' | 'left' = 'left',
  ): Promise<Text> => {
    return createText(text, position, width, 1.5, parent, textAlign);
  };

  const createBody = async (
    text: string,
    position: Position,
    width: number,
    parent: Frame,
    textAlign: 'center' | 'right' | 'left' = 'left',
  ): Promise<Text> => {
    return createText(text, position, width, 1, parent, textAlign);
  };

  const createHint = async (
    text: string,
    position: Position,
    width: number,
    parent: Frame,
    textAlign: 'center' | 'right' | 'left' = 'left',
  ): Promise<Text> => {
    return createText(text, position, width, 0.75, parent, textAlign);
  };

  const createText = async (
    text: string,
    position: Position,
    width: number,
    fontSizeMultiplier: number,
    parent: Frame,
    textAlign: 'center' | 'right' | 'left',
  ): Promise<Text> => {
    const title = await miro.board.createText({
      x: position.x - parent.width / 2 + width / 2,
      y: position.y + (defaultDimensions.baseTextSize * fontSizeMultiplier) / 2 - parent.height / 2,
      width,
      content: text,
      style: {
        fontSize: defaultDimensions.baseTextSize * fontSizeMultiplier,
        color: defaultPalette.textColor,
        textAlign,
      },
    });

    await parent.add(title);
    return title;
  };

  return {
    createHeading,
    createSubHeading,
    createBody,
    createHint,
  };
};

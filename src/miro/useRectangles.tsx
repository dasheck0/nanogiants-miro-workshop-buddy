import { Frame, Shape } from '@mirohq/websdk-types';
import { Position } from '../dtos/miro.dto';
import { defaultPalette } from '../theme/palette';

export const useRectangles = () => {
  const createRectangle = async (position: Position, width: number, height: number, parent: Frame): Promise<Shape> => {
    const rectangle = await miro.board.createShape({
      x: position.x - parent.width / 2 + width / 2,
      y: position.y - parent.height / 2 + height / 2,
      width,
      height,
      style: {
        fillColor: defaultPalette.panelColor,
        borderWidth: 0,
        borderColor: defaultPalette.panelColor,
      },
    });

    await parent.add(rectangle);
    return rectangle;
  };

  return {
    createRectangle,
  };
};

import { Frame } from '@mirohq/websdk-types';
import { Position, WorkshopFrame } from '../dtos/miro.dto';
import { defaultDimensions, defaultPalette } from '../theme/palette';

export const useFrames = () => {
  const createFrame = async (
    origin: Position,
    existingFrames: WorkshopFrame[],
    title: string,
    width: number,
    height: number,
  ): Promise<Frame> => {
    const position = calculateOriginForNewFrame(0, origin, existingFrames);

    const frame = await miro.board.createFrame({
      title,
      x: position.x,
      y: position.y,
      width,
      height,
      style: {
        fillColor: defaultPalette.primaryColor,
      },
    });

    return frame;
  };

  const calculateOriginForNewFrame = (desiredRowIndex: number, origin: Position, frames: WorkshopFrame[]): Position => {
    console.log('existing feame', frames);

    if (frames.length === 0) {
      return origin;
    }

    const framesInRow = frames.filter(frame => frame.rowIndex === desiredRowIndex);
    const frameAtMostRight = framesInRow.reduce((prev, current) => (prev.frame.x > current.frame.x ? prev : current));

    if (frameAtMostRight) {
      return {
        x: frameAtMostRight.frame.x + frameAtMostRight.frame.width + defaultDimensions.frameGap,
        y: frameAtMostRight.frame.y,
      };
    } else {
      const framesAbove = frames.filter(frame => frame.rowIndex === desiredRowIndex - 1);
      const y = framesAbove[0]?.frame.y + framesAbove[0]?.frame.height + defaultDimensions.frameGap || origin.y;

      return {
        x: origin.x,
        y,
      };
    }
  };

  return {
    createFrame,
  };
};

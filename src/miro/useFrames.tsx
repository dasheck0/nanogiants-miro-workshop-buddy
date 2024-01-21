import { Frame } from '@mirohq/websdk-types';
import { Position } from '../dtos/miro.dto';
import { LocalStorageStore } from '../store';
import { defaultDimensions, defaultPalette } from '../theme/palette';

export const useFrames = () => {
  const createFrame = async (rowIndex: number, origin: Position, title: string, width: number, height: number): Promise<Frame> => {
    const position = await calculateOriginForNewFrame(rowIndex, origin);

    const frame = await miro.board.createFrame({
      title,
      x: position.x + width / 2,
      y: position.y,
      width,
      height,
      style: {
        fillColor: defaultPalette.primaryColor,
      },
    });

    return frame;
  };

  const calculateOriginForNewFrame = async (desiredRowIndex: number, origin: Position): Promise<Position> => {
    const boardStorage = LocalStorageStore.getInstance().get('boardStorage');

    const frames2: Frame[] = (await miro.board.experimental.get({ id: Object.keys(boardStorage) })) as Frame[];

    if (frames2.length === 0) {
      return origin;
    }

    const allFramesInDesiredRow = frames2.filter(frame => boardStorage[frame.id] === desiredRowIndex);

    if (allFramesInDesiredRow.length === 0) {
      // is there a frame above?
      const framesAbove = frames2
        .filter(frame => boardStorage[frame.id] < desiredRowIndex)
        .sort((a, b) => {
          // return the ones that are closest to the desiredRowIndex. The bigger the y coordinate the closer to the desired row index.
          return b.y - a.y;
        });
      console.log('framesAbove', framesAbove);

      const y = framesAbove[0]?.y + framesAbove[0]?.height + defaultDimensions.frameGap || origin.y;

      console.log('y', y);

      return {
        x: origin.x,
        y,
      };
    } else {
      const frameAtMostRight = allFramesInDesiredRow.reduce((prev, current) => (prev.x > current.x ? prev : current));
      console.log('frameAtMostRight', frameAtMostRight);

      if (frameAtMostRight) {
        const r = {
          x: frameAtMostRight.x + frameAtMostRight.width / 2 + defaultDimensions.frameGap,
          y: frameAtMostRight.y,
        };
        console.log('r', r);
        return r;
      } else {
        return origin;
      }
    }
  };

  return {
    createFrame,
  };
};

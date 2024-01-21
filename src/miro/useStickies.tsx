import { Frame, StickyNote, StickyNoteColor } from '@mirohq/websdk-types';
import { Position } from '../dtos/miro.dto';
import { defaultDimensions } from '../theme/palette';

export const useStickies = () => {
  const createStickyPool = async (position: Position, columnCount: number, availableHeight: number, parent: Frame) => {
    const stickyItemGap = defaultDimensions.itemGap / 2;

    const numberOfStickiesForHeight = Math.floor(availableHeight / (defaultDimensions.stickySize + stickyItemGap));
    const result: StickyNote[] = [];

    for (let column = 0; column < columnCount; column++) {
      for (let row = 0; row < numberOfStickiesForHeight; row++) {
        const index = column * numberOfStickiesForHeight + row;

        const sticky = await miro.board.createStickyNote({
          content: '',
          x: position.x + column * (defaultDimensions.stickySize + stickyItemGap) - parent.width / 2 + defaultDimensions.stickySize / 2,
          y: position.y + row * (defaultDimensions.stickySize + stickyItemGap) - parent.height / 2 + defaultDimensions.stickySize / 2,
          width: defaultDimensions.stickySize,
          style: {
            fillColor: sampleStickyNoteColor(index),
          },
        });

        await parent.add(sticky);
        result.push(sticky);
      }
    }

    return result;
  };

  const sampleStickyNoteColor = (index?: number): StickyNoteColor => {
    const availableColors = [
      StickyNoteColor.Gray,
      StickyNoteColor.LightYellow,
      StickyNoteColor.Yellow,
      StickyNoteColor.Orange,
      StickyNoteColor.LightGreen,
      StickyNoteColor.Green,
      StickyNoteColor.DarkGreen,
      StickyNoteColor.Cyan,
      StickyNoteColor.LightPink,
      StickyNoteColor.Pink,
      StickyNoteColor.Violet,
      StickyNoteColor.Red,
      StickyNoteColor.LightBlue,
      StickyNoteColor.Blue,
      StickyNoteColor.DarkBlue,
      StickyNoteColor.Black,
    ];

    if (index && index > availableColors.length) {
      return StickyNoteColor.LightYellow;
    }

    const sampledIndex = index ?? Math.floor(Math.random() * availableColors.length);
    return availableColors[sampledIndex];
  };

  const estimateWidthOfStickyPool = (columnCount: number) => {
    return columnCount * (defaultDimensions.stickySize + defaultDimensions.itemGap / 2);
  };

  return {
    createStickyPool,
    sampleStickyNoteColor,
    estimateWidthOfStickyPool,
  };
};

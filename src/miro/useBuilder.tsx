import { Frame, StickyNote, StickyNoteColor, Text } from '@mirohq/websdk-types';
import { useEffect, useState } from 'react';
import { LocalStorageStore } from '../store';
import { defaultDimensions, defaultPalette } from '../theme/palette';

export interface WorkshopFrame {
  frame: Frame;
  rowIndex: number;
}

interface Position {
  x: number;
  y: number;
}

export const useBuilder = () => {
  const [frames, setFrames] = useState<WorkshopFrame[]>([]);
  const [origin, setOrigin] = useState<Position>({ x: 0, y: 0 });

  useEffect(() => {
    if (frames.length > 0) {
      LocalStorageStore.getInstance().set(
        'frames',
        frames.map(frame => ({ id: frame.frame.id, rowIndex: frame.rowIndex })),
      );
    }
  }, [frames]);

  useEffect(() => {
    loadFrames()
      .then(foundFrames => setFrames(foundFrames))
      .catch(error => console.log(error));
  }, []);

  const loadFrames = async (): Promise<WorkshopFrame[]> => {
    return new Promise(async (resolve, reject) => {
      const framesFromStore = LocalStorageStore.getInstance().get('frames');
      const result: WorkshopFrame[] = [];

      await Promise.all(
        framesFromStore.map(async frame => {
          try {
            const actualFrame: Frame = (await miro.board.getById(frame.id)) as Frame;
            result.push({
              frame: actualFrame,
              rowIndex: frame.rowIndex,
            });
          } catch (error) {
            console.log(error);
          }
        }),
      );

      console.log('found frames', result);

      resolve(result);
    });
  };

  const addFrame = (frame: Frame, rowIndex: number) => {
    setFrames([...frames, { frame, rowIndex }]);
  };

  const calculateOriginForNewFrame = (desiredRowIndex: number): Position => {
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

  const createAgendaItemFrame = async ({
    title,
    description,
    duration,
    desiredOutcome,
  }: {
    title: string;
    description: string;
    duration: string;
    desiredOutcome: string;
  }) => {
    const position = calculateOriginForNewFrame(0);
    const width = 300;

    const frame = await miro.board.createFrame({
      title,
      x: position.x,
      y: position.y,
      width,
      height: width,
      style: {
        fillColor: defaultPalette.primaryColor,
      },
    });

    const paddedX = position.x + defaultDimensions.framePadding;
    const paddedY = position.y + defaultDimensions.framePadding;

    const headingItem = await createHeading(title, { x: paddedX, y: paddedY }, width - 2 * defaultDimensions.framePadding, frame);
    const descriptionItem = await createBody(
      description,
      { x: paddedX, y: headingItem.y + headingItem.height + defaultDimensions.itemGap },
      width - 2 * defaultDimensions.framePadding,
      frame,
    );

    const goalSubheadingItem = await createSubHeading(
      'Goals',
      { x: paddedX, y: descriptionItem.y + descriptionItem.height + defaultDimensions.itemGap },
      width - 2 * defaultDimensions.framePadding,
      frame,
    );

    const goalItem = await createBody(
      desiredOutcome,
      { x: paddedX, y: goalSubheadingItem.y + goalSubheadingItem.height + defaultDimensions.itemGap },
      width - 2 * defaultDimensions.framePadding,
      frame,
    );

    const durationItem = await createBody(
      `${duration} minutes`,
      { x: position.x + defaultDimensions.framePadding / 2, y: position.y + defaultDimensions.framePadding / 2 },
      width - defaultDimensions.framePadding,
      frame,
      'right',
    );

    const stickies = await createStickyPool(
      { x: position.x + defaultDimensions.framePadding / 2, y: durationItem.y + durationItem.height + defaultDimensions.itemGap },
      2,
      frame.height - durationItem.height - defaultDimensions.framePadding,
      frame,
    );

    await miro.board.sync(frame);
    await miro.board.viewport.zoomTo(frame);

    addFrame(frame, 0);
  };

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

  const createStickyPool = async (position: Position, columnCount: number, availableHeight: number, parent: Frame) => {
    const numberOfStickiesForHeight = Math.floor(availableHeight / (defaultDimensions.stickySize + defaultDimensions.itemGap));
    const result: StickyNote[] = [];

    for (let column = 0; column < columnCount; column++) {
      for (let row = 0; row < numberOfStickiesForHeight; row++) {
        const index = column * numberOfStickiesForHeight + row;

        const sticky = await miro.board.createStickyNote({
          content: '',
          x:
            position.x +
            column * (defaultDimensions.stickySize + defaultDimensions.itemGap) -
            parent.width / 2 +
            defaultDimensions.stickySize / 2,
          y:
            position.y +
            row * (defaultDimensions.stickySize + defaultDimensions.itemGap) -
            parent.height / 2 +
            defaultDimensions.stickySize / 2,
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

  return {
    createAgendaItemFrame,
  };
};

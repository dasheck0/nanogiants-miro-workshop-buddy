import { Frame } from '@mirohq/websdk-types';
import { useEffect, useState } from 'react';
import { Position, WorkshopFrame } from '../dtos/miro.dto';
import { LocalStorageStore } from '../store';
import { defaultDimensions } from '../theme/palette';
import { useFrames } from './useFrames';
import { useStickies } from './useStickies';
import { useTextItems } from './useTextItems';

export const useBuilder = () => {
  const [frames, setFrames] = useState<WorkshopFrame[]>([]);
  const [origin, setOrigin] = useState<Position>({ x: 0, y: 0 });

  const { createStickyPool } = useStickies();
  const { createHeading, createSubHeading, createBody } = useTextItems();
  const { createFrame } = useFrames();

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
    const frame = await createFrame(origin, frames, title, 300, 300);
    const position = { x: frame.x, y: frame.y };
    const width = frame.width;

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

  return {
    createAgendaItemFrame,
  };
};

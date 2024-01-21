import { Frame } from '@mirohq/websdk-types';
import { useEffect, useState } from 'react';
import { BoardStorage, Position } from '../dtos/miro.dto';
import { LocalStorageStore } from '../store';
import { defaultDimensions } from '../theme/palette';
import { useFrames } from './useFrames';
import { useRectangles } from './useRectangles';
import { useStickies } from './useStickies';
import { useTextItems } from './useTextItems';

export const useBuilder = () => {
  console.log('MyComponent rendered');

  const [boardStorage, setBoardStorage] = useState<BoardStorage>(LocalStorageStore.getInstance().get('boardStorage') ?? {});
  const [origin, setOrigin] = useState<Position>({ x: 0, y: 0 });

  const { createStickyPool, estimateWidthOfStickyPool } = useStickies();
  const { createHeading, createSubHeading, createBody, createHint } = useTextItems();
  const { createFrame } = useFrames();
  const { createRectangle } = useRectangles();

  useEffect(() => {
    LocalStorageStore.getInstance().set('boardStorage', boardStorage);
  }, [boardStorage]);

  const addFrame = (frame: Frame, rowIndex: number) => {
    const newBoardStorage = { ...boardStorage };
    newBoardStorage[frame.id] = rowIndex;
    setBoardStorage(newBoardStorage);
  };

  const createAgendaItemFrame = async ({
    rowIndex,
    title,
    description,
    duration,
    desiredOutcome,
  }: {
    rowIndex: number;
    title: string;
    description: string;
    duration: string;
    desiredOutcome: string;
  }) => {
    const frame = await createFrame(rowIndex, origin, title, 300, 300);
    const position = { x: frame.x, y: frame.y };
    const width = frame.width;

    const paddedX = position.x + defaultDimensions.framePadding;
    const paddedY = position.y + defaultDimensions.framePadding;

    const headingItem = await createHeading(title, { x: paddedX, y: paddedY }, width - 2 * defaultDimensions.framePadding, frame);
    const descriptionItem = await createBody(
      description,
      { x: paddedX, y: position.y + headingItem.y + headingItem.height + defaultDimensions.itemGap },
      width - 2 * defaultDimensions.framePadding,
      frame,
    );

    const goalSubheadingItem = await createSubHeading(
      'Goals',
      { x: paddedX, y: position.y + descriptionItem.y + descriptionItem.height + defaultDimensions.itemGap },
      width - 2 * defaultDimensions.framePadding,
      frame,
    );

    const goalItem = await createBody(
      desiredOutcome,
      { x: paddedX, y: position.y + goalSubheadingItem.y + goalSubheadingItem.height + defaultDimensions.itemGap },
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

    await miro.board.sync(frame);
    await miro.board.viewport.zoomTo(frame);

    addFrame(frame, rowIndex);
  };

  const createTwoPaneItemFrame = async ({
    rowIndex,
    title,
    description,
    duration,
    leftPaneTitle,
    leftPaneDescription,
    rightPaneTitle,
    rightPaneDescription,
  }: {
    rowIndex: number;
    title: string;
    description: string;
    duration: string;
    leftPaneTitle: string;
    leftPaneDescription: string;
    rightPaneTitle: string;
    rightPaneDescription: string;
  }) => {
    const frame = await createFrame(rowIndex, origin, title, 750, 300);
    const position = { x: frame.x, y: frame.y };
    const width = frame.width;

    const paddedX = position.x + defaultDimensions.framePadding;
    const paddedY = position.y + defaultDimensions.framePadding;

    const headingItem = await createHeading(title, { x: paddedX, y: paddedY }, width - 2 * defaultDimensions.framePadding, frame);
    const descriptionItem = await createBody(
      description,
      { x: paddedX, y: position.y + headingItem.y + headingItem.height + defaultDimensions.itemGap },
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

    const paneHeight =
      frame.height - descriptionItem.height - defaultDimensions.framePadding * 2 - headingItem.height - defaultDimensions.itemGap * 2;
    const estimatedWidthOfStickyPool = estimateWidthOfStickyPool(2);
    const widthOfOnePaneWithSpaceForStickyPool =
      (width - 2 * defaultDimensions.framePadding - estimatedWidthOfStickyPool - 2 * defaultDimensions.itemGap) / 2;

    const leftPane = await createRectangle(
      {
        x: paddedX,
        y: position.y + descriptionItem.y + descriptionItem.height + defaultDimensions.itemGap,
      },
      widthOfOnePaneWithSpaceForStickyPool,
      paneHeight,
      frame,
    );

    const leftPaneHeadingItem = await createBody(
      leftPaneTitle,
      {
        x: position.x + leftPane.x + defaultDimensions.framePadding / 2 - leftPane.width / 2,
        y: position.y + leftPane.y + defaultDimensions.framePadding / 2 - leftPane.height / 2,
      },
      leftPane.width - defaultDimensions.framePadding,
      frame,
    );

    const leftPaneDescriptionItem = await createHint(
      leftPaneDescription,
      {
        x: position.x + leftPane.x + defaultDimensions.framePadding / 2 - leftPane.width / 2,
        y: position.y + leftPaneHeadingItem.y + leftPaneHeadingItem.height + defaultDimensions.itemGap,
      },
      leftPane.width - defaultDimensions.framePadding,
      frame,
    );

    const rightPane = await createRectangle(
      {
        x: position.x + leftPane.x + leftPane.width + defaultDimensions.itemGap - widthOfOnePaneWithSpaceForStickyPool / 2,
        y: position.y + descriptionItem.y + descriptionItem.height + defaultDimensions.itemGap,
      },
      widthOfOnePaneWithSpaceForStickyPool,
      paneHeight,
      frame,
    );

    const rightPaneHeadingItem = await createBody(
      rightPaneTitle,
      {
        x: position.x + rightPane.x + defaultDimensions.framePadding / 2 - rightPane.width / 2,
        y: position.y + rightPane.y + defaultDimensions.framePadding / 2 - rightPane.height / 2,
      },
      rightPane.width - defaultDimensions.framePadding,
      frame,
    );

    const rightPaneDescriptionItem = await createHint(
      rightPaneDescription,
      {
        x: position.x + rightPane.x + defaultDimensions.framePadding / 2 - rightPane.width / 2,
        y: position.y + rightPaneHeadingItem.y + rightPaneHeadingItem.height + defaultDimensions.itemGap,
      },
      rightPane.width - defaultDimensions.framePadding,
      frame,
    );

    const stickyPool = await createStickyPool(
      {
        x: position.x + width - defaultDimensions.framePadding * 2 - estimatedWidthOfStickyPool / 2,
        y: position.y + descriptionItem.y + descriptionItem.height + defaultDimensions.itemGap,
      },
      2,
      paneHeight,
      frame,
    );

    await miro.board.sync(frame);
    await miro.board.viewport.zoomTo(frame);

    addFrame(frame, rowIndex);
  };

  const createSinglePaneItemFrame = async ({
    rowIndex,
    title,
    description,
    duration,
    paneTitle,
    paneDescription,
  }: {
    rowIndex: number;
    title: string;
    description: string;
    duration: string;
    paneTitle: string;
    paneDescription: string;
  }) => {
    const frame = await createFrame(rowIndex, origin, title, 600, 300);
    const position = { x: frame.x, y: frame.y };
    const width = frame.width;

    const paddedX = position.x + defaultDimensions.framePadding;
    const paddedY = position.y + defaultDimensions.framePadding;

    const headingItem = await createHeading(title, { x: paddedX, y: paddedY }, width - 2 * defaultDimensions.framePadding, frame);
    const descriptionItem = await createBody(
      description,
      { x: paddedX, y: position.y + headingItem.y + headingItem.height + defaultDimensions.itemGap },
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

    const paneHeight =
      frame.height - descriptionItem.height - defaultDimensions.framePadding * 2 - headingItem.height - defaultDimensions.itemGap * 2;
    const estimatedWidthOfStickyPool = estimateWidthOfStickyPool(2);
    const widthOfOnePaneWithSpaceForStickyPool =
      width - 2 * defaultDimensions.framePadding - estimatedWidthOfStickyPool - defaultDimensions.itemGap;

    const pane = await createRectangle(
      {
        x: paddedX,
        y: position.y + descriptionItem.y + descriptionItem.height + defaultDimensions.itemGap,
      },
      widthOfOnePaneWithSpaceForStickyPool,
      paneHeight,
      frame,
    );

    const paneHeadingItem = await createBody(
      paneTitle,
      {
        x: position.x + pane.x + defaultDimensions.framePadding / 2 - pane.width / 2,
        y: position.y + pane.y + defaultDimensions.framePadding / 2 - pane.height / 2,
      },
      pane.width - defaultDimensions.framePadding,
      frame,
    );

    const paneDescriptionItem = await createHint(
      paneDescription,
      {
        x: position.x + pane.x + defaultDimensions.framePadding / 2 - pane.width / 2,
        y: position.y + paneHeadingItem.y + paneHeadingItem.height + defaultDimensions.itemGap,
      },
      pane.width - defaultDimensions.framePadding,
      frame,
    );

    const stickyPool = await createStickyPool(
      {
        x: position.x + width - defaultDimensions.framePadding * 2 - estimatedWidthOfStickyPool / 2,
        y: position.y + descriptionItem.y + descriptionItem.height + defaultDimensions.itemGap,
      },
      2,
      paneHeight,
      frame,
    );

    await miro.board.sync(frame);
    await miro.board.viewport.zoomTo(frame);

    addFrame(frame, rowIndex);
  };

  return {
    createAgendaItemFrame,
    createTwoPaneItemFrame,
    createSinglePaneItemFrame,
  };
};

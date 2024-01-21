import { Frame } from '@mirohq/websdk-types';

export interface Position {
  x: number;
  y: number;
}

export interface WorkshopFrame {
  frame: Frame;
  rowIndex: number;
}

export interface BoardStorage {
  [key: string]: number;
}

import { VirtualizerOptions } from "../useVirtualizer";

export interface VirtualizerEvent {
  range: { startIndex: number; endIndex: number };
  getVirtualIndexes: () => number[];
  options: VirtualizerOptions;
  scrollOffset: number;
  getTotalSize: () => number;
  getSize: () => number;
  calculateRange: () => { startIndex: number; endIndex: number };
  getScrollOffset: () => number;
}

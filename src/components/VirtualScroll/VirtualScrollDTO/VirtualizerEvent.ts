import { VirtualItem } from "@tanstack/react-virtual";
import { VirtualizerOptions } from "../useVirtualizer";

export interface VirtualizerEvent {
  range: { startIndex: number; endIndex: number };
  getVirtualItems: () => VirtualItem[];
  getVirtualIndexes: () => number[];
  options: VirtualizerOptions;
  scrollOffset: number;
  getTotalSize: () => number;
  getSize: () => number;
  calculateRange: () => { startIndex: number; endIndex: number };
  getScrollOffset: () => number;
}

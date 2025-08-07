export default class MeterConstants {
  // Start configuration
  public static startLevel: number = 12;

  // Levels
  public static minLevel: number = 2;
  public static maxLevel: number = 12;

  public static earliestYearLevel1And2: number = 250000; // 250 000 to be safe because Date can be minimun of ~271.000
  public static earliestYearRestLevels: number = 15000000000; // 15 bil

  // Zoom options
  public static minZoomValue: number = 20; // 100/20 = 5 elements when all the way zoomed out on level
  public static maxZoomValue: number = 100; //100% of the screen
  public static smallerLinesValue: number = 70;
  public static zoomStep: number = 3; //1,2,5,10,25 possible steps
  // public static debounceWheelMilliseconds: number = 5;

  // Slide effect options
  public static minTimeElapsedForSlidingEffect: number = 600;
  public static slidingInertiaDumping: number = 0.9;
  public static slidingCutoff: number = 0.15;
  public static velocityMultiplier: number = 10;

  // Presentation Later options
  public static eventWidth: number = 34;

  // ChunkElementSize
  public static cacheOffsetChunkLength: number = 1000000;
}

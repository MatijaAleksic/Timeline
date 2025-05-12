export default class MeterConstants {
  // Levels

  public static minLevel: number = 2;
  public static maxLevel: number = 13;

  public static earliestYearLevel1: number = 300;
  public static earliestYearLevel2: number = 3000; // 3k
  public static earliestYearLevel3: number = 3000; // 3k
  public static earliestYearLevel4: number = 30000; // 30k
  public static earliestYearLevel5: number = 300000; // 300k
  public static earliestYearLevel6: number = 3000000; // 3 mil
  public static earliestYearLevel7: number = 30000000; // 30 mil
  public static earliestYearLevel8: number = 300000000; // 300 mil
  public static earliestYearLevel9: number = 3000000000; // 3 bil
  public static earliestYearLevel10: number = 15000000000; // 15 bil
  public static earliestYearLevel11: number = 15000000000; // 15 bil
  public static earliestYearLevel12: number = 15000000000; // 15 bil
  public static earliestYearRestLevels: number = 15000000000; // 15 bil

  // Zoom options
  public static minZoomValue: number = 25;
  public static maxZoomValue: number = 250;
  public static smallerLinesValue: number = 100;
  public static zoomStep: number = 10;

  // Slide effect options
  public static minTimeElapsedForSlidingEffect: number = 600;
  public static slidingInertiaDumping: number = 0.9;
  public static slidingCutoff: number = 0.1;
  public static debounceWheelMilliseconds: number = 20;
  public static velocityMultiplier: number = 10;
}

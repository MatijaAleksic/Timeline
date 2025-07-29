export default class MeterConstants {
  // Start configuration
  public static startLevel: number = 3;
  public static startZoomValue: number = 100;

  // Levels
  public static minLevel: number = 2;
  public static maxLevel: number = 12;

  public static earliestYearLevel1: number = 300; //300 (Days)
  public static earliestYearLevel2: number = 3000; // 3k (Months)
  public static earliestYearLevel3: number = 3000; // 3k (Year)
  public static earliestYearLevel4: number = 30000; // 30k (10 Years)
  public static earliestYearLevel5: number = 300000; // 300k (100 Years)
  public static earliestYearLevel6: number = 3000000; // 3 mil (1k Years)
  public static earliestYearLevel7: number = 30000000; // 30 mil (10k Years)
  public static earliestYearLevel8: number = 300000000; // 300 mil (100k Years)
  public static earliestYearLevel9: number = 3000000000; // 3 bil (1mil Years)
  public static earliestYearLevel10: number = 15000000000; // 15 bil (10mil Years)
  public static earliestYearLevel11: number = 15000000000; // 15 bil (100mil Years)
  public static earliestYearLevel12: number = 15000000000; // 15 bil (1bil Years)
  public static earliestYearRestLevels: number = 15000000000; // 15 bil

  // Zoom options
  public static minZoomValue: number = 30;
  public static maxZoomValue: number = 250;
  public static smallerLinesValue: number = 150;
  public static zoomStep: number = 10;
  // public static debounceWheelMilliseconds: number = 5;

  // Slide effect options
  public static minTimeElapsedForSlidingEffect: number = 600;
  public static slidingInertiaDumping: number = 0.9;
  public static slidingCutoff: number = 0.1;
  public static velocityMultiplier: number = 10;

  // Presentation Later options
  public static eventWidth: number = 34;
}

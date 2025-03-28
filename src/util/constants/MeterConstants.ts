export default class MeterContants {
  // Zoom options
  public static minZoomPercentageValue: number = 40;
  public static maxZoomPercentageValue: number = 620;
  public static zoomStep: number = 40;

  // Slide effect options
  public static minTimeElapsedForSlidingEffect: number = 600;
  public static slidingInertiaDumping: number = 0.9;
  public static slidingCutoff: number = 0.1;
  public static debounceWheelMilliseconds: number = 15;
  public static velocityMultiplier: number = 10;
}

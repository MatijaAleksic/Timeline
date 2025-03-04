export default class MeterContants {
  // Zoom options
  public static minZoomPercentageValue: number = 20;
  public static maxZoomPercentageValue: number = 620;
  public static zoomStep: number = 15;

  // Slide effect options
  public static minTimeElapsedForSlidingEffect: number = 500;
  public static slidingInertiaDumping: number = 0.92;
  public static slidingCutoff: number = 0.1;
  public static debounceWheelMilliseconds: number = 20;
  public static velocityMultiplier: number = 10;
}

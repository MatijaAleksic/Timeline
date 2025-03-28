export default class MeterContants {
  // Zoom options
  public static minZoomValue: number = 25;
  public static maxZoomValue: number = 750;
  public static zoomStep: number = 25;

  // Slide effect options
  public static minTimeElapsedForSlidingEffect: number = 600;
  public static slidingInertiaDumping: number = 0.9;
  public static slidingCutoff: number = 0.1;
  public static debounceWheelMilliseconds: number = 15;
  public static velocityMultiplier: number = 10;
}

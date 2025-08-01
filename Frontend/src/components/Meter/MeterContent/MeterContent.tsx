import ScreenDimentionsConstants from "@/util/constants/ScreenDimentionsConstants";
import MeterDay from "../MeterDay";
import MeterMonth from "../MeterMonth";
import MeterYear from "../MeterYear";
import ScreenDimensionsConstants from "@/util/constants/ScreenDimentionsConstants";

interface IProps {
  level: number;
  element: Date | number;
  elementWidth: number;
  zoomValue: number;
  screenWidth: number;
}

const MeterContent: React.FunctionComponent<IProps> = ({
  level,
  element,
  elementWidth,
  zoomValue,
  screenWidth,
}: IProps) => {
  const shouldDrawSubLines =
    screenWidth > ScreenDimensionsConstants.minLaptopWidth;

  return (
    <>
      {/* TODO: Might not be computationally possible because there are alot of values here, try but the chances are low */}
      {/* {level === 1 && (
        <MeterDay
          date={element as Date}
          width={elementWidth}
          zoomValue={zoomValue}
        />
      )} */}
      {level === 2 && (
        <MeterMonth
          date={element as Date}
          width={elementWidth}
          zoomValue={zoomValue}
          shouldDrawSubLines={shouldDrawSubLines}
        />
      )}
      {level > 2 && (
        <MeterYear
          year={element as number}
          level={level}
          width={elementWidth}
          zoomValue={zoomValue}
          shouldDrawSubLines={shouldDrawSubLines}
        />
      )}
    </>
  );
};

export default MeterContent;

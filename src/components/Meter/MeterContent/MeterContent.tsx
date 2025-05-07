import MeterDay from "../MeterDay";
import MeterMonth from "../MeterMonth";
import MeterYear from "../MeterYear";

interface IProps {
  level: number;
  element: Date | number;
  elementWidth: number;
  zoomValue: number;
}

const MeterContent: React.FunctionComponent<IProps> = ({
  level,
  element,
  elementWidth,
  zoomValue,
}: IProps) => {
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
        />
      )}
      {level > 2 && (
        <MeterYear
          year={element as number}
          level={level - 2}
          width={elementWidth}
          zoomValue={zoomValue}
        />
      )}
    </>
  );
};

export default MeterContent;

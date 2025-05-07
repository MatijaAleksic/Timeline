import { getMonth } from "date-fns";
import MeterLine from "../MeterLine/MeterLine";
import styles from "./MeterYear.module.scss";
import MeterConstants from "@/util/constants/MeterConstants";
import DateHelper from "@/util/helper/DateHelper";
import MeterService from "@/util/service/MeterService";

interface IProps {
  year: number;
  level: number;
  width: number;
  zoomValue: number;
}

const MeterYear: React.FunctionComponent<IProps> = ({
  year,
  level,
  width,
  zoomValue,
  ...props
}) => {
  const yearMultiplier: number = MeterService.getYearMultiplier(level - 1);
  const subLines = Array.from({ length: level === 3 ? 12 : 10 }, (_, i) => {
    return {
      index: i,
      label:
        level === 3 ? DateHelper.getMonthName(i) : year + i * yearMultiplier,
    };
  });
  const subLevelLines = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div
      className={styles.yearMonthContainer}
      {...props}
      style={{ width: `${width}px` }}
    >
      {subLines.map((element, index) => {
        return (
          <div key={index} className={styles.subLinesContainer}>
            <MeterLine
              displayValue={
                index === 0 ? year.toString() : (element.label as string)
              }
              isLarger={index === 0}
            />
            {zoomValue > MeterConstants.smallerLinesValue && (
              <div className={styles.subLevelLinesContainer}>
                {subLevelLines.map((_, index) => (
                  <div key={index} className={styles.line} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MeterYear;

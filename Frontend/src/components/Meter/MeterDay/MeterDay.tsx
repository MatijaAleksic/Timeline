import { format, isFirstDayOfMonth, setHours } from "date-fns";
import MeterLine from "../MeterLine/MeterLine";
import styles from "./MeterDay.module.scss";
import MeterConstants from "@/util/constants/MeterConstants";

interface IProps {
  date: Date;
  width: number;
  zoomValue: number;
}

const MeterDay: React.FunctionComponent<IProps> = ({
  date,
  width,
  zoomValue,
  ...props
}) => {
  if (!date) return;

  // Create an array of hours (0 to 23)
  const hours = Array.from({ length: 24 }, (_, i) => {
    return setHours(date, i);
  });

  return (
    <div
      className={styles.dayContainer}
      {...props}
      style={{ width: `${width}px` }}
    >
      <div className={styles.backgroundYear}>
        {date.getFullYear() < 0
          ? `${format(date, "-yyyy")} BC`
          : format(date, "yyyy")}
      </div>
      {hours.map((hour, index) => {
        return (
          <div key={index} className={styles.hoursContainer}>
            <MeterLine
              displayValue={
                hour.getHours() === 0
                  ? format(hour, "d MMM")
                  : format(hour, "h a")
              }
              isLarger={hour.getHours() === 0}
            />
          </div>
        );
      })}
    </div>
  );
};

export default MeterDay;

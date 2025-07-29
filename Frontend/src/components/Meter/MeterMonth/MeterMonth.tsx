import { eachDayOfInterval, format, isFirstDayOfMonth } from "date-fns";
import MeterLine from "../MeterLine/MeterLine";
import styles from "./MeterMonth.module.scss";
// import MeterConstants from "@/util/constants/MeterConstants";

interface IProps {
  date: Date;
  width: number;
  zoomValue: number;
}

const MeterMonth: React.FunctionComponent<IProps> = ({
  date,
  width,
  zoomValue,
  ...props
}) => {
  if (!date) return;

  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const days = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  // const hours = Array.from({ length: 24 }, (_, i) => i + 1);

  return (
    <div
      className={styles.monthDaysContainer}
      {...props}
      style={{ width: `${width}px` }}
    >
      <div className={styles.backgroundYear}>
        {date.getFullYear() < 0
          ? `${firstDayOfMonth.getFullYear()} BC`
          : firstDayOfMonth.getFullYear()}
      </div>
      {days.map((day, index) => {
        return (
          <div key={index} className={styles.daysContainer}>
            <MeterLine
              displayValue={
                isFirstDayOfMonth(day)
                  ? day.getMonth() === 0
                    ? date.getFullYear() < 0
                      ? `${day.getFullYear()} BC`
                      : `${day.getFullYear()}`
                    : format(day, "d MMM")
                  : format(day, "d")
              }
              isLarger={isFirstDayOfMonth(day)}
            />
            {/* {zoomValue > MeterConstants.smallerLinesValue && (
              <div className={styles.hoursContainer}>
                {hours.map((_, index) => (
                  <div key={index} className={styles.hour} />
                ))}
              </div>
            )} */}
          </div>
        );
      })}
    </div>
  );
};

export default MeterMonth;

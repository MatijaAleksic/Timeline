import { eachDayOfInterval, format } from "date-fns";
import MeterLine from "../MeterLine/MeterLine";
import styles from "./MeterMonth.module.scss";

interface IProps {
  date: Date;
  widthPercentage: number;
}

const MeterMonth: React.FunctionComponent<IProps> = ({
  date,
  widthPercentage,
  ...props
}) => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const days = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  const baseValue = 100;
  const calculatedWidth = (widthPercentage / 100) * baseValue;

  return (
    <div
      className={styles.monthDaysContainer}
      {...props}
      style={{ width: `${calculatedWidth}vw` }}
    >
      {days.map((day, index) => {
        return <MeterLine key={index} displayValue={format(day, "d LLLLL")} />; //LLLLL
      })}
    </div>
  );
};

export default MeterMonth;

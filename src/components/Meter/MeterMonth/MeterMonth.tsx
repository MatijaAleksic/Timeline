import { eachDayOfInterval, format } from "date-fns";
import MeterLine from "../MeterLine/MeterLine";
import styles from "./MeterMonth.module.scss";

interface IProps {
  date: Date;
  width: number;
}

const MeterMonth: React.FunctionComponent<IProps> = ({
  date,
  width,
  ...props
}) => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const days = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  return (
    <div
      className={styles.monthDaysContainer}
      {...props}
      style={{ width: `${width}px` }}
    >
      {days.map((day, index) => {
        return <MeterLine key={index} displayValue={format(day, "d LLLLL")} />; //LLLLL
      })}
    </div>
  );
};

export default MeterMonth;

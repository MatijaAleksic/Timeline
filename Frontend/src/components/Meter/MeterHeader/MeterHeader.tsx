import styles from "./MeterHeader.module.scss";
import { format } from "date-fns";

interface IProps {
  handlePreviousMonth: () => void;
  handleNextMonth: () => void;
  date: Date;
}

const MeterHeader: React.FunctionComponent<IProps> = ({
  handlePreviousMonth,
  handleNextMonth,
  date,
}: IProps) => {
  return (
    <div className={styles.meterNavigationWrapper}>
      <button className={styles.navigationButton} onClick={handlePreviousMonth}>
        Previous
      </button>
      <div className={styles.navigationYearContainer}>
        {format(date, "yyyy MMMM")}
      </div>
      <button className={styles.navigationButton} onClick={handleNextMonth}>
        Next
      </button>
    </div>
  );
};

export default MeterHeader;

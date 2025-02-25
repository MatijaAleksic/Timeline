"use client";

import { addMonths, eachDayOfInterval, format, setMonth } from "date-fns";
import styles from "./meter.module.scss";
import { useState } from "react";

function Meter() {
  const [date, setDate] = useState<Date>(new Date());

  //   const months = Array.from({ length: 12 }, (_, i) =>
  //     format(setMonth(new Date(), i), " yyyy MMMM")
  //   );
  // Get first day and last day of the selected month
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const days = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  const handlePreviousMonth = () => {
    setDate(addMonths(date, -1));
  };

  const handleNextMonth = () => {
    setDate(addMonths(date, 1));
  };

  return (
    <div className={styles.meterWrapper}>
      <div className={styles.meterNavigationWrapper}>
        <button
          className={styles.navigationButton}
          onClick={handlePreviousMonth}
        >
          Previous
        </button>
        <div className={styles.navigationYearContainer}>
          {format(date, "yyyy MMMM")}
        </div>
        <button className={styles.navigationButton} onClick={handleNextMonth}>
          Next
        </button>
      </div>
      <div className={styles.meterComponent}>
        {days.map((day, index) => {
          return <div key={index}>{format(day, "d")}</div>;
        })}
      </div>
    </div>
  );
}

export default Meter;

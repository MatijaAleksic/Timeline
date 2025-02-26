import styles from "./MeterLine.module.scss";

interface IProps {
  displayValue: string;
}

const MeterLine: React.FunctionComponent<IProps> = ({ displayValue }) => {
  return (
    <div className={styles.meterLineContainer}>
      <div className={styles.meterLineDisplayValueContainer}>
        <div className={styles.meterLineDisplayValue}>{displayValue}</div>
      </div>
      <div className={styles.meterLine} />
    </div>
  );
};

export default MeterLine;

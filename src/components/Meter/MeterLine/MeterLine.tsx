import styles from "./MeterLine.module.scss";

interface IProps {
  displayValue: string;
  isLarger: boolean;
}

const MeterLine: React.FunctionComponent<IProps> = ({
  displayValue,
  isLarger = false,
}) => {
  return (
    <div className={styles.meterLineContainer}>
      <div className={styles.meterLineDisplayValueContainer}>
        <div className={styles.meterLineDisplayValue}>{displayValue}</div>
      </div>
      <div className={styles.lineContainer}>
        <div
          className={isLarger ? styles.meterLineLarge : styles.meterLineNormal}
        />
      </div>
    </div>
  );
};

export default MeterLine;

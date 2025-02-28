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
        <div
          className={
            isLarger
              ? styles.meterLineDisplayValueLarge
              : styles.meterLineDisplayValueNormal
          }
        >
          {displayValue}
        </div>
      </div>
      <div
        className={isLarger ? styles.meterLineLarge : styles.meterLineNormal}
      />
    </div>
  );
};

export default MeterLine;

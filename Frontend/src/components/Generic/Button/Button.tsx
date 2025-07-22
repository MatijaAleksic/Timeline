import styles from "./Button.module.scss";

interface IProps {
  label: string;
  onClickCallback: () => void;
}

const Button: React.FC<IProps> = ({ label, onClickCallback }) => {
  return (
    <button onClick={onClickCallback} className={styles.button}>
      {label}
    </button>
  );
};

export default Button;

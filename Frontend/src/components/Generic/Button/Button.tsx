import { ButtonType } from "@/util/enums/ButtonType";
import styles from "./Button.module.scss";

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  buttonType?: ButtonType;
  onClickCallback?: () => void;
}

const Button: React.FC<IProps> = ({
  label,
  buttonType = ButtonType.PRIMARY,
  onClickCallback,
  ...rest
}) => {
  let buttonColorTypeClass = styles.primary;
  if (buttonType === ButtonType.WARN) buttonColorTypeClass = styles.warn;
  else if (buttonType === ButtonType.HOT) buttonColorTypeClass = styles.hot;

  return (
    <button
      onClick={onClickCallback}
      className={`${styles.button} ${buttonColorTypeClass}`}
      {...rest}
    >
      {label}
    </button>
  );
};

export default Button;

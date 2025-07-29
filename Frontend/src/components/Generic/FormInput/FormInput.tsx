import { FieldError } from "react-hook-form";
import styles from "./FormInput.module.scss";
import { useId } from "react";

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string;
  label?: string;
  error?: FieldError | undefined;
}

const FormInput: React.FunctionComponent<IProps> = ({
  type = "text",
  label,
  error,
  ...rest
}) => {
  const id = useId();
  return (
    <div className={styles.formInputContainer}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input id={id} type={type} className={styles.input} {...rest} />
      {error && <p style={{ color: "red" }}>{error.message}</p>}
    </div>
  );
};

export default FormInput;

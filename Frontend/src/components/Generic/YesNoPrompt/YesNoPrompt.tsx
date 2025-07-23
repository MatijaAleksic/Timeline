import { ButtonType } from "@/util/enums/ButtonType";
import Button from "../Button/Button";
import styles from "./YesNoPrompt.module.scss";

interface IProps {
  answerCallback: (decision: boolean) => void;
}

const YesNoPrompt: React.FC<IProps> = ({ answerCallback }) => {
  return (
    <div className={styles.yesNoPromptContainer}>
      <div className={styles.header}>
        Are you sure that you want to continue with this action?
      </div>
      <div className={styles.buttonsContainer}>
        <div className={styles.buttonContainer}>
          <Button
            buttonType={ButtonType.HOT}
            label="Yes"
            onClickCallback={() => answerCallback(true)}
          />
        </div>
        <div className={styles.buttonContainer}>
          <Button label="No" onClickCallback={() => answerCallback(false)} />
        </div>
      </div>
    </div>
  );
};

export default YesNoPrompt;

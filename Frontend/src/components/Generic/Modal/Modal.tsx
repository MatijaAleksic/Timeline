import styles from "./Modal.module.scss";

interface IProps {
  width: number;
  height: number;
  toggleModal: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<IProps> = ({ width, height, toggleModal, children }) => {
  return (
    <>
      <div className={styles.modalOverlay}></div>
      <div
        className={styles.modalContainer}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <div className={styles.modalHeader}>
          <div className={styles.closeButton} onClick={toggleModal} />
        </div>
        <div className={styles.modalContent}>{children}</div>
      </div>
    </>
  );
};

export default Modal;

import { FunctionComponent } from "react";
import styles from "./Footer.module.scss";

const Footer: FunctionComponent = ({}) => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div>Copyright. Matija™ All rights reserved</div>
        <div className={styles.right}>
          <a href="" className={styles.footerLinks}>
            Terms of service
          </a>
          <a href="" className={styles.footerLinks}>
            Privacy policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

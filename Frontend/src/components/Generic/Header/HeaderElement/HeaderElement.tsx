"use client";

import { FunctionComponent } from "react";
import styles from "./HeaderElement.module.scss";

interface IProps {
  route: string;
  label: string;
  navigateToRoute: (route: string) => void;
}
const HeaderElement: FunctionComponent<IProps> = ({
  route,
  label,
  navigateToRoute,
}) => {
  return (
    <div
      onClick={() => navigateToRoute(route)}
      className={styles.headerElement}
    >
      {label}
    </div>
  );
};
export default HeaderElement;

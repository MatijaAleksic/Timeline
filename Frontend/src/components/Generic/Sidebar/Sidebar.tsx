"use client";

import { FunctionComponent } from "react";
import Image from "next/image";
import styles from "./Sidebar.module.scss";

interface IProps {}

const Sidebar: FunctionComponent<IProps> = ({}) => {
  const handleOnClick = () => {
    alert("Button clicked");
  };

  return (
    <button onClick={handleOnClick} className={styles.sidebarButton}>
      <Image
        alt="dropdownArrow"
        src="/svg/sidebar.svg"
        width={32}
        height={32}
      />
    </button>
  );
};
export default Sidebar;

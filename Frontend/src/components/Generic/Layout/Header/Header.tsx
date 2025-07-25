"use client";

import { FunctionComponent } from "react";
import styles from "./Header.module.scss";
import { useRouter } from "next/navigation";
import Routes from "@/util/constants/Routes";
import HeaderElement from "./HeaderElement/HeaderElement";

const Header: FunctionComponent = ({}) => {
  const router = useRouter();

  const navigateToRoute = (route: string) => {
    router.push(route);
  };

  return (
    <div className={styles.header}>
      <HeaderElement
        label="Home"
        route={Routes.HOME}
        navigateToRoute={navigateToRoute}
      />
      <HeaderElement
        label="Events"
        route={Routes.EVENTS}
        navigateToRoute={navigateToRoute}
      />
      <HeaderElement
        label="Periods"
        route={Routes.PERIODS}
        navigateToRoute={navigateToRoute}
      />
    </div>
  );
};
export default Header;

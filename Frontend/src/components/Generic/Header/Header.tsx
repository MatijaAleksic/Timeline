"use client";

import { FunctionComponent } from "react";
import styles from "./Header.module.scss";
import { useRouter } from "next/navigation";
import Routes from "@/util/constants/Routes";
import HeaderElement from "./HeaderElement/HeaderElement";

interface IProps {}

const Header: FunctionComponent<IProps> = ({}) => {
  const router = useRouter();

  const navigateToRoute = (route: string) => {
    console.log("route", route);

    router.push(route);
  };

  return (
    <div className={styles.header}>
      <HeaderElement
        label="Home"
        route={Routes.home}
        navigateToRoute={navigateToRoute}
      />
      <HeaderElement
        label="Events"
        route={Routes.events}
        navigateToRoute={navigateToRoute}
      />
      <HeaderElement
        label="Periods"
        route={Routes.periods}
        navigateToRoute={navigateToRoute}
      />
    </div>
  );
};
export default Header;

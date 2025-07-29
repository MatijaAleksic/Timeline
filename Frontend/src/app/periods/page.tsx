import { PeriodDTO, PeriodTableDTO } from "@/api/DTO";
import { PeriodApi } from "@/api/interfaces/period"; // use your alias or relative path
import PeriodTable from "@/components/Table/PeriodTable/PeriodTable";
import type { Metadata } from "next";
import styles from "./page.module.scss";
import TableConstants, {
  TableSortDirection,
} from "@/util/constants/TableConstants";
import { PeriodTableHeadersSort } from "@/util/constants/PeriodConstant";

export const metadata: Metadata = {
  title: "Periods",
  description: "Periods of the timeline",
};

export default async function PeriodsPage() {
  let periodTableDTO: PeriodTableDTO = { periods: [], totalCount: 0 };
  try {
    periodTableDTO = await PeriodApi.GetPeriods(
      1,
      TableConstants.defaultPageSize,
      "",
      PeriodTableHeadersSort.TITLE,
      TableSortDirection.ASC
    );
  } catch {
  }


  return (
    <div className={styles.tableWrapper}>
      <PeriodTable initialPeriodTableDTO={periodTableDTO} />
    </div>
  );
}

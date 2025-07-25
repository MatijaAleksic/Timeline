import styles from "./TableHeader.module.scss";
import { TableSortDirection } from "@/util/constants/TableConstants";
import Image from "next/image";
import SortUp from "./../../../../../public/svg/sort-up.svg";
import SortDown from "./../../../../../public/svg/sort-down.svg";

interface IProps {
  label: string;
  sortColumn: string;
  currentSortColumn: string;
  currentSortDirection: TableSortDirection;
  handleSort: (sortColumn: string) => void;
}

const TableHeader: React.FC<IProps> = ({
  label,
  sortColumn,
  currentSortColumn,
  currentSortDirection,
  handleSort,
}) => {
  return (
    <th onClick={() => handleSort(sortColumn)}>
      <div className={styles.tableHeaderContainer}>
        <span>{label}</span>
        <span className={styles.sortDirection}>
          <Image
            src={SortUp}
            alt="Sort up"
            width={20}
            height={20}
            style={{
              display:
                currentSortColumn === sortColumn &&
                currentSortDirection === TableSortDirection.ASC
                  ? "inline"
                  : "none",
            }}
          />
          <Image
            src={SortDown}
            alt="Sort down"
            width={20}
            height={20}
            style={{
              display:
                currentSortColumn === sortColumn &&
                currentSortDirection === TableSortDirection.DESC
                  ? "inline"
                  : "none",
            }}
          />
        </span>
      </div>
    </th>
  );
};

export default TableHeader;

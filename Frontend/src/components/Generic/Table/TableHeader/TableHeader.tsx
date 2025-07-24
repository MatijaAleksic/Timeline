import styles from "./TableHeader.module.scss";
import { TableSortDirection } from "@/util/constants/TableConstants";
import Image from "next/image";

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
          {currentSortColumn === sortColumn ? (
            currentSortDirection === TableSortDirection.ASC ? (
              <Image
                src="/svg/sort-up.svg"
                alt="Sort up"
                width={20}
                height={20}
              />
            ) : (
              <Image
                src="/svg/sort-down.svg"
                alt="Sort up"
                width={20}
                height={20}
              />
            )
          ) : (
            <></>
          )}
        </span>
      </div>
    </th>
  );
};

export default TableHeader;

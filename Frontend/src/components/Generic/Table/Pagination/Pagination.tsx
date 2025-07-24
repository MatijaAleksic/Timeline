import { Dispatch, SetStateAction } from "react";
import styles from "./Pagination.module.scss";

interface IProps {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  setPageIndex: Dispatch<SetStateAction<number>>;
  paginationFunctionCallback: (pageNumber: number) => void;
}

const Pagination: React.FunctionComponent<IProps> = ({
  pageIndex,
  pageSize,
  totalCount,
  setPageIndex,
  paginationFunctionCallback,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  const numbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePreviousClicked = () => {
    if (pageIndex <= 1) return;
    const newPage = pageIndex - 1;
    setPageIndex(newPage);
    paginationFunctionCallback(newPage);
  };

  const handleNextClicked = () => {
    if (pageIndex >= totalPages) return;
    const newPage = pageIndex + 1;
    setPageIndex(newPage);
    paginationFunctionCallback(newPage);
  };

  const handlePageOnClick = (pageNumber: number) => {
    if (pageNumber === pageIndex) return;
    setPageIndex(pageNumber);
    paginationFunctionCallback(pageNumber);
  };

  if (totalPages === 0) return null;

  return (
    <div className={styles.pagination}>
      <div
        onClick={handlePreviousClicked}
        className={pageIndex === 1 ? styles.disabled : ""}
        aria-disabled={pageIndex === 1}
      >
        &laquo;
      </div>

      {numbers.map((number) => (
        <div
          key={number}
          className={number === pageIndex ? styles.active : ""}
          onClick={() => handlePageOnClick(number)}
        >
          {number}
        </div>
      ))}

      <div
        onClick={handleNextClicked}
        className={pageIndex === totalPages ? styles.disabled : ""}
        aria-disabled={pageIndex === totalPages}
      >
        &raquo;
      </div>
    </div>
  );
};

export default Pagination;

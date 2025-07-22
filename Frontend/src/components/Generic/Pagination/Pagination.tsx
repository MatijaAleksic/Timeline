import { useState } from "react";
import styles from "./Pagination.module.scss";

interface IProps {
  paginationFunctionCallback: (pageNumber: number) => void;
}

const Pagination: React.FC<IProps> = ({ paginationFunctionCallback }) => {
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(5);

  const numbers = Array.from({ length: 10 }, (_, index) => {
    return index;
  });

  const handlePreviousClicked = () => {
    if (currentPageNumber === 1) return;
    setCurrentPageNumber(currentPageNumber - 1);
    paginationFunctionCallback(currentPageNumber - 1);
  };
  const handleNextClicked = () => {
    if (currentPageNumber === numbers.length) return;
    setCurrentPageNumber(currentPageNumber + 1);
    paginationFunctionCallback(currentPageNumber + 1);
  };
  const handlePageOnClick = (pageNumber: number) => {
    setCurrentPageNumber(pageNumber);
    paginationFunctionCallback(pageNumber);
  };

  return (
    <div className={styles.pagination}>
      <div onClick={handlePreviousClicked}>&laquo;</div>
      {numbers.map((number, index) => (
        <div
          className={number === currentPageNumber ? styles.active : ""}
          onClick={() => handlePageOnClick(number)}
          key={index}
        >
          {number}
        </div>
      ))}
      <div onClick={handleNextClicked}>&raquo;</div>
    </div>
  );
};

export default Pagination;

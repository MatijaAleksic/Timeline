import { useState, useEffect } from "react";
import styles from "./SearchInput.module.scss";

interface IProps {
  searchFunctionCallback: (searchText: string) => void;
  debounceMs?: number;
}

const SearchInput: React.FC<IProps> = ({
  searchFunctionCallback,
  debounceMs = 400,
}) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      searchFunctionCallback(inputValue);
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, searchFunctionCallback, debounceMs]);

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="Search..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;

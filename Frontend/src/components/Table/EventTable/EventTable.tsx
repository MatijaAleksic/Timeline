"use client";
import { FunctionComponent } from "react";
import styles from "./EventTable.module.scss";
import { EventDTO } from "@/api/DTO/EventDTO";
import SearchInput from "@/components/Generic/SearchInput/SearchInput";
import Pagination from "@/components/Generic/Pagination/Pagination";

interface IProps {
  initialEvents: EventDTO[];
}

const EventTable: FunctionComponent<IProps> = ({ initialEvents }) => {
  const searchFunctionCallback = (searchString: string) => {
    console.log("searchString", searchString);
  };

  const paginationFunctionCallback = (pageNumber: number) => {
    console.log("pageNumber", pageNumber);
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.searchContainer}>
        <SearchInput searchFunctionCallback={searchFunctionCallback} />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Level</th>
            <th>Year</th>
            <th>Month</th>
            <th>Day</th>
          </tr>
        </thead>
        <tbody>
          {initialEvents.map((event: EventDTO, index: number) => (
            <tr key={index}>
              <td>{event.id}</td>
              <td>{event.title}</td>
              <td>{event.level}</td>
              <td>{event.year}</td>
              <td>{event.month}</td>
              <td>{event.day}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.paginationContainer}>
        <Pagination paginationFunctionCallback={paginationFunctionCallback} />
      </div>
    </div>
  );
};

export default EventTable;

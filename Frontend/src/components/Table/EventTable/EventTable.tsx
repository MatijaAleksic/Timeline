"use client";
import { FunctionComponent, useState } from "react";
import styles from "./EventTable.module.scss";
import { EventDTO } from "@/api/DTO/EventDTO";
import SearchInput from "@/components/Generic/SearchInput/SearchInput";
import Pagination from "@/components/Generic/Pagination/Pagination";
import Button from "@/components/Generic/Button/Button";
import Modal from "@/components/Generic/Modal/Modal";

interface IProps {
  initialEvents: EventDTO[];
}

const EventTable: FunctionComponent<IProps> = ({ initialEvents }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const searchFunctionCallback = (searchString: string) => {
    console.log("searchString", searchString);
  };

  const paginationFunctionCallback = (pageNumber: number) => {
    console.log("pageNumber", pageNumber);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <div className={styles.searchContainer}>
          <SearchInput searchFunctionCallback={searchFunctionCallback} />
        </div>
        <div className={styles.buttonContainer}>
          <Button label="Create new event" onClickCallback={toggleModal} />
        </div>
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

      {isModalOpen && (
        <Modal height={700} width={600} toggleModal={toggleModal}>
          <button>Hello</button>
        </Modal>
      )}
    </div>
  );
};

export default EventTable;

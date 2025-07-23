"use client";

import { FunctionComponent, useEffect, useState } from "react";
import styles from "./EventTable.module.scss";
import { EventDTO } from "@/api/DTO/EventDTO";
import SearchInput from "@/components/Generic/SearchInput/SearchInput";
import Pagination from "@/components/Generic/Pagination/Pagination";
import Button from "@/components/Generic/Button/Button";
import Modal from "@/components/Generic/Modal/Modal";
import EventForm from "@/components/Forms/EventForm/EventForm";
import { ButtonType } from "@/util/enums/ButtonType";
import { EventApi } from "@/api/interfaces/event";
import YesNoPrompt from "@/components/Generic/YesNoPrompt/YesNoPrompt";
import { EventTableDTO } from "@/api/DTO";
import TableConstants from "@/util/constants/TableConstants";

interface IProps {
  initialEventTableDTO: EventTableDTO;
}

const EventTable: FunctionComponent<IProps> = ({ initialEventTableDTO }) => {
  const [isEventModalOpen, setIsEventModalOpen] = useState<boolean>(false);
  const [isYesNoModalOpen, setIsYesNoModalOpen] = useState<boolean>(false);
  const [events, setEvents] = useState<EventDTO[]>(
    initialEventTableDTO.events || []
  );
  const [selectedEvent, setSelectedEvent] = useState<EventDTO | undefined>(
    undefined
  );
  const [eventIdToDelete, setEventIdToDelete] = useState<string | undefined>(
    undefined
  );
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize] = useState<number>(TableConstants.defaultPageSize);
  const [totalCount, setTotalCount] = useState<number>(
    initialEventTableDTO.totalCount
  );
  const [searchString, setSearchString] = useState<string>("");

  useEffect(() => {
    fetchEvents();
  }, [pageIndex, pageSize, searchString]);

  const fetchEvents = async () => {
    var eventTableDTO: EventTableDTO = await EventApi.GetEvents(
      pageIndex,
      pageSize,
      searchString
    );
    setTotalCount(eventTableDTO.totalCount);
    setEvents(eventTableDTO.events);
  };

  const searchFunctionCallback = async (searchString: string) => {
    setSearchString(searchString);
  };

  const paginationFunctionCallback = async (pageIndex: number) => {
    setPageIndex(pageIndex);
  };

  const toggleEventModal = () => {
    setIsEventModalOpen(!isEventModalOpen);
  };

  const toggleYesNoModal = () => {
    setIsYesNoModalOpen(!isYesNoModalOpen);
  };

  const createButtonClicked = () => {
    setSelectedEvent(undefined);
    toggleEventModal();
  };

  const editButtonClicked = (event: EventDTO) => {
    setSelectedEvent(event);
    toggleEventModal();
  };

  const deleteButtonClicked = (eventId: string) => {
    setEventIdToDelete(eventId);
    setIsYesNoModalOpen(true);
  };

  const yesNoPromptAnswer = async (decision: boolean) => {
    if (decision && eventIdToDelete) {
      try {
        await EventApi.DeleteEvent(eventIdToDelete);
        setEvents(events.filter((ev) => ev.id !== eventIdToDelete));
      } catch (error: any) {
        console.log(error);
      }
    }
    setEventIdToDelete(undefined);
    setIsYesNoModalOpen(false);
  };

  const modifiedEventCallback = (event: EventDTO) => {
    const foundEvent = events.find((ev) => ev.id === event.id);
    if (foundEvent) {
      setEvents(
        events.map((ev) => {
          if (ev.id === event.id) {
            return event;
          }
          return ev;
        })
      );
      return;
    }
    setEvents([...events, event]);
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <div className={styles.searchContainer}>
          <SearchInput
            searchFunctionCallback={searchFunctionCallback}
            searchString={searchString}
          />
        </div>
        <div className={styles.buttonContainer}>
          <Button
            label="Create new event"
            onClickCallback={createButtonClicked}
          />
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            {/* <th>Id</th> */}
            <th>Title</th>
            <th>Level</th>
            <th>Year</th>
            <th>Month</th>
            <th>Day</th>
            <th style={{ border: "none" }}></th>
            <th style={{ border: "none" }}></th>
          </tr>
        </thead>
        <tbody>
          {events.map((event: EventDTO, index: number) => (
            <tr key={index}>
              {/* <td>{event.id}</td> */}
              <td>{event.title}</td>
              <td>{event.level}</td>
              <td>{event.year}</td>
              <td>{event.month}</td>
              <td>{event.day}</td>
              <td>
                <div className={styles.centerButton}>
                  <div className={styles.tableButtonContainer}>
                    <Button
                      buttonType={ButtonType.PRIMARY}
                      onClickCallback={() => editButtonClicked(event)}
                      label="Edit"
                    />
                  </div>
                </div>
              </td>
              <td>
                <div className={styles.centerButton}>
                  <div className={styles.tableButtonContainer}>
                    <Button
                      buttonType={ButtonType.HOT}
                      onClickCallback={() => deleteButtonClicked(event.id)}
                      label="Delete"
                    />
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.paginationContainer}>
        <Pagination
          paginationFunctionCallback={paginationFunctionCallback}
          pageIndex={pageIndex}
          totalCount={totalCount}
          pageSize={pageSize}
          setPageIndex={setPageIndex}
        />
      </div>

      {isEventModalOpen && (
        <Modal width={400} toggleModal={toggleEventModal}>
          <EventForm
            event={selectedEvent}
            modifiedEventCallback={modifiedEventCallback}
            toggleModal={toggleEventModal}
          />
        </Modal>
      )}

      {isYesNoModalOpen && (
        <Modal width={500} toggleModal={toggleYesNoModal}>
          <YesNoPrompt answerCallback={yesNoPromptAnswer} />
        </Modal>
      )}
    </div>
  );
};

export default EventTable;

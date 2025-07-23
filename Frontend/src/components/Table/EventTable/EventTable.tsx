"use client";

import { FunctionComponent, useState } from "react";
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

interface IProps {
  initialEvents: EventDTO[];
}

const EventTable: FunctionComponent<IProps> = ({ initialEvents }) => {
  const [isEventModalOpen, setIsEventModalOpen] = useState<boolean>(false);
  const [isYesNoModalOpen, setIsYesNoModalOpen] = useState<boolean>(false);
  const [events, setEvents] = useState<EventDTO[]>(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState<EventDTO | undefined>(
    undefined
  );
  const [eventIdToDelete, setEventIdToDelete] = useState<string | undefined>(
    undefined
  );

  const searchFunctionCallback = (searchString: string) => {
    if (searchString !== "") {
      console.log("searchString", searchString);
    }
  };

  const paginationFunctionCallback = (pageNumber: number) => {
    console.log("pageNumber", pageNumber);
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
          <SearchInput searchFunctionCallback={searchFunctionCallback} />
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
        <Pagination paginationFunctionCallback={paginationFunctionCallback} />
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

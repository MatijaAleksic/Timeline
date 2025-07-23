import { EventDTO, EventTableDTO } from "@/api/DTO";
import { EventApi } from "@/api/interfaces/event"; // use your alias or relative path
import EventTable from "@/components/Table/EventTable/EventTable";
import type { Metadata } from "next";
import styles from "./page.module.scss";
import TableConstants from "@/util/constants/TableConstants";

export const metadata: Metadata = {
  title: "Events",
  description: "Events of the timeline",
};

export default async function EventsPage() {
  var eventTableDTO: EventTableDTO = await EventApi.GetEvents(
    1,
    TableConstants.defaultPageSize,
    ""
  );

  return (
    <div className={styles.tableWrapper}>
      <EventTable initialEventTableDTO={eventTableDTO} />
    </div>
  );
}

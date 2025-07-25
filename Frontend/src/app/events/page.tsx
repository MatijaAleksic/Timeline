import { EventDTO, EventTableDTO } from "@/api/DTO";
import { EventApi } from "@/api/interfaces/event"; // use your alias or relative path
import EventTable from "@/components/Table/EventTable/EventTable";
import type { Metadata } from "next";
import styles from "./page.module.scss";
import TableConstants, {
  TableSortDirection,
} from "@/util/constants/TableConstants";
import { EventTableHeadersSort } from "@/util/constants/EventConstants";

export const metadata: Metadata = {
  title: "Events",
  description: "Events of the timeline",
};

export default async function EventsPage() {
  const eventTableDTO: EventTableDTO = await EventApi.GetEvents(
    1,
    TableConstants.defaultPageSize,
    "",
    EventTableHeadersSort.TITLE,
    TableSortDirection.ASC
  );

  return (
    <div className={styles.tableWrapper}>
      <EventTable initialEventTableDTO={eventTableDTO} />
    </div>
  );
}

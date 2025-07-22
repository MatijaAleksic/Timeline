import { EventDTO } from "@/api/DTO";
import { EventApi } from "@/api/interfaces/event"; // use your alias or relative path
import EventTable from "@/components/Table/EventTable/EventTable";
import type { Metadata } from "next";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "Events",
  description: "Events of the timeline",
};

export default async function EventsPage() {
  var events: EventDTO[] = await EventApi.GetEvents();

  return (
    <div className={styles.tableWrapper}>
      <EventTable initialEvents={events} />
    </div>
  );
}

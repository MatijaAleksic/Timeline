import EventTable from "@/components/Table/EventTable/EventTable";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description: "Events of the timeline",
};

function EventsPage() {
  return <EventTable />;
}

export default EventsPage;

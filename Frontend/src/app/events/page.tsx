import { EventDTO } from "@/api/DTO";
import { EventApi } from "@/api/interfaces/event"; // use your alias or relative path
import EventTable from "@/components/Table/EventTable/EventTable";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description: "Events of the timeline",
};

export default async function EventsPage() {
  try {
    var events: EventDTO[] = await EventApi.GetEvents();
    console.log("events", events);
  } catch (error) {
    console.error("Failed to fetch events", error);
  }

  return <EventTable />;
}

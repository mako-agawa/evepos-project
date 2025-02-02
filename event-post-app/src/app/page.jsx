"use client";

import { useAtom } from "jotai";
import { pageModeAtom } from "@/atoms/authAtom";

import EventIndex from "@/components/events/EventIndex";

import EventSchedule from "@/components/events/EventSchedule";
import EventArchive from "@/components/events/EventArchive";
import EventSearch from "@/components/events/EventSearch";


export default function Events() {
  const [pageMode] = useAtom(pageModeAtom);

  return (
    <div className="flex flex-col items-center py-8">
      {pageMode === "index" && <EventIndex />}
      {pageMode === "schedule" && <EventSchedule />}
      {pageMode === "schedule" && <EventArchive />}
      {pageMode === "search" && <EventSearch />}
      
      
    </div>
  );
}
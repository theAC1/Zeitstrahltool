"use client";

import { useTimelineState } from "../../context/timeline/TimelineContext";
import { Timeline } from "./Timeline";

export function TimelineContainer() {
  const { timeline } = useTimelineState();
  return <Timeline timeline={timeline} />;
}

import type { Timeline } from "../types/timeline";
import { TimelineSchema } from "../types/timeline";

const raw: Timeline = {
  id: "mvp",
  title: "Statischer MVP Slice",
  description: "Hardcoded Timeline Daten fuer den MVP",
  events: [
    { id: "e1", year: -44, title: "Caesar ermordet", description: "Iden des Maerz" },
    { id: "e2", year: 476, title: "Westroemisches Reich", description: "Traditionelles Ende" },
    { id: "e3", year: 1492, title: "Kolumbus", description: "Ankunft in der Karibik" },
    { id: "e4", year: 1789, title: "Franzoesische Revolution" },
    { id: "e5", year: 1989, title: "Mauerfall" },
  ],
  epochs: [],
  metadata: {
    language: "de",
    version: "0.1.0",
  },
};

export const sampleTimeline: Timeline = TimelineSchema.parse(raw);

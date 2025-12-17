import type { Timeline } from "../types/timeline";
import { TimelineSchema } from "../types/timeline";

const raw = {
  id: "t1",
  title: "Beispiel Zeitstrahl",
  description: "MVP Sample Daten fuer Timeline UI.",
  axis: {
    // Demo: grobe Marker, passend fuer grosse Zeitraeume
    tickStep: 500,
    // Optional: min/max koennten wir spaeter setzen, aktuell datengetrieben
    // minYear: -1000,
    // maxYear: 2500,
  },
  epochs: [],
  events: [
    { id: "e1", year: -44, title: "Caesar ermordet", description: "Iden des Maerz" },
    { id: "e2", year: 476, title: "Westroemisches Reich", description: "Traditionelles Ende" },
    { id: "e3", year: 1492, title: "Kolumbus", description: "Ankunft in der Karibik" },
    { id: "e4", year: 1789, title: "Franzoesische Revolution" },
    { id: "e5", year: 1989, title: "Mauerfall" },
  ],
} satisfies Timeline;

export const sampleTimeline = TimelineSchema.parse(raw);

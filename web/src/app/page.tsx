import { Timeline } from "../components/timeline/Timeline";
import { sampleTimeline } from "../data/sampleTimeline";

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-2 text-2xl font-semibold">Zeitstrahltool</h1>
      <p className="mb-6 text-gray-700">
        MVP Start: Statische Timeline mit Beispiel-Events.
      </p>

      <Timeline timeline={sampleTimeline} />
    </main>
  );
}

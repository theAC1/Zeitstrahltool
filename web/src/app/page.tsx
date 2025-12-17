import { TimelineProvider } from "../context/timeline/TimelineContext";
import { TimelineContainer } from "../components/timeline/TimelineContainer";

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-2 text-2xl font-semibold">Zeitstrahltool</h1>
      <p className="mb-6 text-gray-700">
        MVP Start: Statischer Timeline Slice (SVG) mit typisiertem Domain Modell.
      </p>

      <TimelineProvider>
        <TimelineContainer />
      </TimelineProvider>
    </main>
  );
}

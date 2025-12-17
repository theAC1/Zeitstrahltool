import { Timeline } from "@/components/timeline/Timeline";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-2 text-2xl font-semibold">Zeitstrahltool</h1>
      <p className="mb-6 text-gray-600">
        MVP Start: Statische Timeline mit Beispiel-Events.
      </p>
      <Timeline />
    </main>
  );
}

import { TimelineControls } from "../components/timeline/TimelineControls";
import { TimelineView } from "../components/timeline/TimelineView";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-2xl font-semibold text-gray-900">Timeline Tool</h1>
        <p className="mb-6 text-sm text-gray-700">
          MVP slice. SVG timeline plus controls. Multi timelines, persistence, JSON export/import.
        </p>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="lg:col-span-4">
            <div className="sticky top-6">
              <TimelineControls />
            </div>
          </section>

          <section className="lg:col-span-8">
            <TimelineView />
          </section>
        </div>
      </div>
    </main>
  );
}

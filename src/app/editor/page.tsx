import Link from 'next/link';

export const metadata = {
  title: 'Editor',
  description: 'Zeitstrahl Editor - Erstellen Sie interaktive Zeitstrahlen',
};

export default function EditorPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Editor Header */}
      <header className="flex h-14 items-center justify-between border-b bg-background px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <svg
              className="h-6 w-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Zeitstrahl</span>
          </Link>
          <span className="text-muted-foreground">|</span>
          <span className="text-sm text-muted-foreground">Neuer Zeitstrahl</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-md border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
            type="button"
          >
            Speichern
          </button>
          <button
            className="rounded-md border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
            type="button"
          >
            Exportieren
          </button>
        </div>
      </header>

      {/* Editor Main Area */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-muted/30 p-4">
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-medium">Werkzeuge</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  className="flex flex-col items-center rounded-md border bg-background p-3 text-xs transition-colors hover:bg-accent"
                  type="button"
                >
                  <svg
                    className="mb-1 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Ereignis
                </button>
                <button
                  className="flex flex-col items-center rounded-md border bg-background p-3 text-xs transition-colors hover:bg-accent"
                  type="button"
                >
                  <svg
                    className="mb-1 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  </svg>
                  Epoche
                </button>
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-medium">Kategorien</h3>
              <p className="text-xs text-muted-foreground">
                Noch keine Kategorien definiert.
              </p>
            </div>
          </div>
        </aside>

        {/* Timeline Canvas Area */}
        <main className="flex flex-1 flex-col">
          {/* Timeline Placeholder */}
          <div className="flex flex-1 items-center justify-center bg-muted/20">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <svg
                  className="h-8 w-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="mb-2 text-xl font-semibold">Timeline-Editor</h2>
              <p className="mb-4 max-w-md text-muted-foreground">
                Der interaktive Timeline-Editor wird hier angezeigt.
                Fügen Sie Ereignisse und Epochen hinzu, um Ihren Zeitstrahl zu erstellen.
              </p>
              <p className="text-sm text-muted-foreground">
                🚧 In Entwicklung - Milestone 2
              </p>
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center justify-center gap-2 border-t bg-background p-2">
            <button
              className="rounded-md border p-1.5 transition-colors hover:bg-accent"
              type="button"
              aria-label="Verkleinern"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="min-w-[4rem] text-center text-sm">100%</span>
            <button
              className="rounded-md border p-1.5 transition-colors hover:bg-accent"
              type="button"
              aria-label="Vergrößern"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
            <button
              className="ml-2 rounded-md border px-2 py-1 text-xs transition-colors hover:bg-accent"
              type="button"
            >
              Einpassen
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

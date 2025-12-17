"use client";

import { useMemo, useState } from "react";
import { useTimelineDispatch, useTimelineState } from "../../context/timeline/TimelineContext";
import { TimelineEventSchema } from "../../types/timeline";

function nextAutoId(existingIds: string[]): string {
  const used = new Set(existingIds);

  // Prefer e<number> sequence if present
  let max = 0;
  for (const id of existingIds) {
    const m = /^e(\d+)$/.exec(id);
    if (m) {
      const n = Number(m[1]);
      if (Number.isFinite(n) && n > max) max = n;
    }
  }

  // Next after max, ensure unique
  for (let i = max + 1; i < max + 10000; i += 1) {
    const candidate = `e${i}`;
    if (!used.has(candidate)) return candidate;
  }

  // Fallback, still ensure unique
  let fallback = `e${Date.now()}`;
  while (used.has(fallback)) fallback = `e${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  return fallback;
}

export function TimelineControls() {
  const { timeline } = useTimelineState();
  const dispatch = useTimelineDispatch();

  const [timelineTitleDraft, setTimelineTitleDraft] = useState("");
  const [isTitleDirty, setIsTitleDirty] = useState(false);

  const existingIds = useMemo(() => timeline.events.map(e => e.id), [timeline.events]);
  const nextIdPreview = useMemo(() => nextAutoId(existingIds), [existingIds]);

  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [editTitleById, setEditTitleById] = useState<Record<string, string>>({});
  const [editYearById, setEditYearById] = useState<Record<string, string>>({});
  const [editDescriptionById, setEditDescriptionById] = useState<Record<string, string>>({});

  const timelineTitleValue = isTitleDirty ? timelineTitleDraft : timeline.title;

  function onSaveTimelineTitle() {
    const next = timelineTitleValue.trim();
    if (!next) {
      setError("Timeline Titel darf nicht leer sein.");
      return;
    }
    setError(null);

    dispatch({ type: "timeline/updateTitle", payload: { title: next } });

    setIsTitleDirty(false);
    setTimelineTitleDraft("");
  }

  function onResetTimeline() {
    dispatch({ type: "timeline/reset" });
    setError(null);

    setIsTitleDirty(false);
    setTimelineTitleDraft("");

    setEditTitleById({});
    setEditYearById({});
    setEditDescriptionById({});

    setTitle("");
    setYear("");
    setDescription("");
  }

  function onAddEvent(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();
    const trimmedYear = year.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle || !trimmedYear) {
      setError("Bitte title und year ausfuellen.");
      return;
    }

    const parsedYear = Number(trimmedYear);
    if (!Number.isFinite(parsedYear) || !Number.isInteger(parsedYear)) {
      setError("Year muss eine ganze Zahl sein (zB 2000 oder -44).");
      return;
    }

    const newId = nextAutoId(existingIds);

    const candidate = {
      id: newId,
      title: trimmedTitle,
      year: parsedYear,
      description: trimmedDescription ? trimmedDescription : undefined,
    };

    const result = TimelineEventSchema.safeParse(candidate);
    if (!result.success) {
      setError("Ungueltige Eingabe. Bitte Werte pruefen.");
      return;
    }

    dispatch({ type: "event/add", payload: result.data });

    setTitle("");
    setYear("");
    setDescription("");
  }

  function onDeleteEvent(eventId: string) {
    dispatch({ type: "event/delete", payload: { id: eventId } });

    setEditTitleById(prev => {
      const next = { ...prev };
      delete next[eventId];
      return next;
    });

    setEditYearById(prev => {
      const next = { ...prev };
      delete next[eventId];
      return next;
    });

    setEditDescriptionById(prev => {
      const next = { ...prev };
      delete next[eventId];
      return next;
    });
  }

  function startEditTitle(eventId: string, currentTitle: string) {
    setEditTitleById(prev =>
      Object.prototype.hasOwnProperty.call(prev, eventId) ? prev : { ...prev, [eventId]: currentTitle },
    );
  }

  function startEditYear(eventId: string, currentYear: string) {
    setEditYearById(prev =>
      Object.prototype.hasOwnProperty.call(prev, eventId) ? prev : { ...prev, [eventId]: currentYear },
    );
  }

  function startEditDescription(eventId: string, currentDescription: string) {
    setEditDescriptionById(prev =>
      Object.prototype.hasOwnProperty.call(prev, eventId) ? prev : { ...prev, [eventId]: currentDescription },
    );
  }

  function onSave(eventId: string) {
    const current = timeline.events.find(ev => ev.id === eventId);
    if (!current) return;

    const nextTitle = (editTitleById[eventId] ?? current.title).trim();
    const nextYearStr =
      (editYearById[eventId] ??
        (typeof current.year === "number" ? String(current.year) : "")).trim();

    const nextDescRaw = Object.prototype.hasOwnProperty.call(editDescriptionById, eventId)
      ? editDescriptionById[eventId]
      : (current.description ?? "");
    const nextDescTrimmed = nextDescRaw.trim();
    const nextDescription = nextDescTrimmed ? nextDescTrimmed : undefined;

    if (!nextTitle) {
      setError("Title darf nicht leer sein.");
      return;
    }

    const parsedYear = Number(nextYearStr);
    if (!Number.isFinite(parsedYear) || !Number.isInteger(parsedYear)) {
      setError("Year muss eine ganze Zahl sein (zB 2000 oder -44).");
      return;
    }

    setError(null);

    const candidate = {
      ...current,
      title: nextTitle,
      year: parsedYear,
      description: nextDescription,
      startYear: undefined,
      endYear: undefined,
    };

    const result = TimelineEventSchema.safeParse(candidate);
    if (!result.success) {
      setError("Ungueltige Werte. Bitte pruefen.");
      return;
    }

    dispatch({ type: "event/update", payload: result.data });

    setEditTitleById(prev => {
      const next = { ...prev };
      delete next[eventId];
      return next;
    });

    setEditYearById(prev => {
      const next = { ...prev };
      delete next[eventId];
      return next;
    });

    setEditDescriptionById(prev => {
      const next = { ...prev };
      delete next[eventId];
      return next;
    });
  }

  function formatYear(ev: { year?: number; startYear?: number; endYear?: number }) {
    if (typeof ev.year === "number") return String(ev.year);
    if (typeof ev.startYear === "number" && typeof ev.endYear === "number") return `${ev.startYear} bis ${ev.endYear}`;
    return "";
  }

  return (
    <div className="mb-4 rounded-md border p-3">
      <div className="mb-3 flex flex-wrap items-end gap-2">
        <div className="flex flex-col">
          <label className="text-xs text-gray-600" htmlFor="tl-title">Timeline Titel</label>
          <input
            id="tl-title"
            className="w-80 rounded-md border px-2 py-1 text-sm"
            value={timelineTitleValue}
            onChange={e => {
              setIsTitleDirty(true);
              setTimelineTitleDraft(e.target.value);
            }}
          />
        </div>

        <button
          type="button"
          className="cursor-pointer rounded-md border px-3 py-2 text-sm"
          onClick={onSaveTimelineTitle}
        >
          Save Titel
        </button>

        <button
          type="button"
          className="cursor-pointer rounded-md border px-3 py-2 text-sm"
          onClick={onResetTimeline}
        >
          Reset Timeline
        </button>

        <span className="text-sm text-gray-600">
          Reset setzt auf Default zurueck und schreibt LocalStorage neu.
        </span>

        {error ? <div className="w-full text-sm text-red-600">{error}</div> : null}
      </div>

      <form onSubmit={onAddEvent} className="flex flex-wrap items-end gap-2">
        <div className="flex flex-col">
          <label className="text-xs text-gray-600">id (auto)</label>
          <div className="w-44 rounded-md border bg-gray-50 px-2 py-1 text-sm font-mono text-gray-700">
            {nextIdPreview}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-gray-600" htmlFor="ev-title">title</label>
          <input
            id="ev-title"
            className="w-64 rounded-md border px-2 py-1 text-sm"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Neues Ereignis"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-gray-600" htmlFor="ev-year">year</label>
          <input
            id="ev-year"
            className="w-28 rounded-md border px-2 py-1 text-sm"
            value={year}
            onChange={e => setYear(e.target.value)}
            placeholder="2000"
            inputMode="numeric"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-gray-600" htmlFor="ev-desc">description</label>
          <input
            id="ev-desc"
            className="w-80 rounded-md border px-2 py-1 text-sm"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Optional"
          />
        </div>

        <button
          type="submit"
          className="cursor-pointer rounded-md border px-3 py-2 text-sm"
        >
          Add Event
        </button>
      </form>

      <div className="mt-4 border-t pt-3">
        <div className="mb-2 text-sm font-medium">Events</div>

        <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
          {timeline.events.map(ev => {
            const isEditingTitle = Object.prototype.hasOwnProperty.call(editTitleById, ev.id);
            const isEditingYear = Object.prototype.hasOwnProperty.call(editYearById, ev.id);
            const isEditingDesc = Object.prototype.hasOwnProperty.call(editDescriptionById, ev.id);

            const editTitleValue = editTitleById[ev.id] ?? "";
            const editYearValue = editYearById[ev.id] ?? "";
            const editDescValue = editDescriptionById[ev.id] ?? "";

            const currentYearStr = typeof ev.year === "number" ? String(ev.year) : "";
            const currentDescStr = ev.description ?? "";

            return (
              <div key={ev.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border px-2 py-2">
                <div className="min-w-0">
                  <div className="text-sm">
                    <span className="font-mono">{ev.id}</span>{" "}
                    <span className="text-gray-600">({formatYear(ev)})</span>{" "}
                    <span className="font-medium">{ev.title}</span>
                  </div>

                  {ev.description ? <div className="text-xs text-gray-600">{ev.description}</div> : null}

                  <div className="mt-2 flex flex-wrap items-end gap-2">
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-600" htmlFor={`edit-title-${ev.id}`}>title</label>
                      <input
                        id={`edit-title-${ev.id}`}
                        className="w-64 rounded-md border px-2 py-1 text-sm"
                        value={isEditingTitle ? editTitleValue : ev.title}
                        onChange={e => setEditTitleById(prev => ({ ...prev, [ev.id]: e.target.value }))}
                        onFocus={() => startEditTitle(ev.id, ev.title)}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs text-gray-600" htmlFor={`edit-year-${ev.id}`}>year</label>
                      <input
                        id={`edit-year-${ev.id}`}
                        className="w-28 rounded-md border px-2 py-1 text-sm"
                        value={isEditingYear ? editYearValue : currentYearStr}
                        onChange={e => setEditYearById(prev => ({ ...prev, [ev.id]: e.target.value }))}
                        onFocus={() => startEditYear(ev.id, currentYearStr)}
                        inputMode="numeric"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs text-gray-600" htmlFor={`edit-desc-${ev.id}`}>description</label>
                      <input
                        id={`edit-desc-${ev.id}`}
                        className="w-80 rounded-md border px-2 py-1 text-sm"
                        value={isEditingDesc ? editDescValue : currentDescStr}
                        onChange={e => setEditDescriptionById(prev => ({ ...prev, [ev.id]: e.target.value }))}
                        onFocus={() => startEditDescription(ev.id, currentDescStr)}
                        placeholder="Optional"
                      />
                    </div>

                    <button
                      type="button"
                      className="cursor-pointer rounded-md border px-3 py-2 text-sm"
                      onClick={() => onSave(ev.id)}
                    >
                      Save
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="cursor-pointer rounded-md border px-3 py-2 text-sm"
                  onClick={() => onDeleteEvent(ev.id)}
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

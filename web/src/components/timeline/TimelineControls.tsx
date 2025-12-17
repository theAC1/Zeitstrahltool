"use client";

import { useState } from "react";
import { useTimelineDispatch, useTimelineState } from "../../context/timeline/TimelineContext";
import { TimelineEventSchema } from "../../types/timeline";

export function TimelineControls() {
  const { timeline } = useTimelineState();
  const dispatch = useTimelineDispatch();

  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [editTitleById, setEditTitleById] = useState<Record<string, string>>({});
  const [editYearById, setEditYearById] = useState<Record<string, string>>({});

  function onAddEvent(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedId = id.trim();
    const trimmedTitle = title.trim();
    const trimmedYear = year.trim();

    if (!trimmedId || !trimmedTitle || !trimmedYear) {
      setError("Bitte id, title und year ausfuellen.");
      return;
    }

    const parsedYear = Number(trimmedYear);
    if (!Number.isFinite(parsedYear) || !Number.isInteger(parsedYear)) {
      setError("Year muss eine ganze Zahl sein (zB 2000 oder -44).");
      return;
    }

    const candidate = {
      id: trimmedId,
      title: trimmedTitle,
      year: parsedYear,
    };

    const result = TimelineEventSchema.safeParse(candidate);
    if (!result.success) {
      setError("Ungueltige Eingabe. Bitte Werte pruefen.");
      return;
    }

    const exists = timeline.events.some(ev => ev.id === result.data.id);
    if (exists) {
      setError("Diese id existiert bereits. Bitte eine andere id verwenden.");
      return;
    }

    dispatch({
      type: "timeline/replace",
      payload: {
        ...timeline,
        events: [...timeline.events, result.data],
      },
    });

    setId("");
    setTitle("");
    setYear("");
  }

  function onDeleteEvent(eventId: string) {
    dispatch({
      type: "timeline/replace",
      payload: {
        ...timeline,
        events: timeline.events.filter(ev => ev.id !== eventId),
      },
    });

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
  }

  function startEditTitle(eventId: string, currentTitle: string) {
    setEditTitleById(prev => (Object.prototype.hasOwnProperty.call(prev, eventId) ? prev : { ...prev, [eventId]: currentTitle }));
  }

  function startEditYear(eventId: string, currentYear: string) {
    setEditYearById(prev => (Object.prototype.hasOwnProperty.call(prev, eventId) ? prev : { ...prev, [eventId]: currentYear }));
  }

  function onSave(eventId: string) {
    const current = timeline.events.find(ev => ev.id === eventId);
    if (!current) return;

    const nextTitle = (editTitleById[eventId] ?? current.title).trim();
    const nextYearStr =
      (editYearById[eventId] ??
        (typeof current.year === "number" ? String(current.year) : "")).trim();

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
      startYear: undefined,
      endYear: undefined,
    };


    const result = TimelineEventSchema.safeParse(candidate);
    if (!result.success) {
      setError("Ungueltige Werte. Bitte pruefen.");
      return;
    }

    dispatch({
      type: "timeline/replace",
      payload: {
        ...timeline,
        events: timeline.events.map(ev => (ev.id === eventId ? result.data : ev)),
      },
    });

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
  }

  function formatYear(ev: { year?: number; startYear?: number; endYear?: number }) {
    if (typeof ev.year === "number") return String(ev.year);
    if (typeof ev.startYear === "number" && typeof ev.endYear === "number") return `${ev.startYear} bis ${ev.endYear}`;
    return "";
  }

  return (
    <div className="mb-4 rounded-md border p-3">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="cursor-pointer rounded-md border px-3 py-2 text-sm"
          onClick={() => dispatch({ type: "timeline/reset" })}
        >
          Reset Timeline
        </button>
        <span className="text-sm text-gray-600">
          Reset setzt auf Default zurueck und schreibt LocalStorage neu.
        </span>
      </div>

      <form onSubmit={onAddEvent} className="flex flex-wrap items-end gap-2">
        <div className="flex flex-col">
          <label className="text-xs text-gray-600" htmlFor="ev-id">id</label>
          <input
            id="ev-id"
            className="w-44 rounded-md border px-2 py-1 text-sm"
            value={id}
            onChange={e => setId(e.target.value)}
            placeholder="e6"
          />
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

        <button
          type="submit"
          className="cursor-pointer rounded-md border px-3 py-2 text-sm"
        >
          Add Event
        </button>

        {error ? <div className="w-full text-sm text-red-600">{error}</div> : null}
      </form>

      <div className="mt-4 border-t pt-3">
        <div className="mb-2 text-sm font-medium">Events</div>

        <div className="flex flex-col gap-2">
          {timeline.events.map(ev => {
            const isEditingTitle = Object.prototype.hasOwnProperty.call(editTitleById, ev.id);
            const isEditingYear = Object.prototype.hasOwnProperty.call(editYearById, ev.id);

            const editTitleValue = editTitleById[ev.id] ?? "";
            const editYearValue = editYearById[ev.id] ?? "";

            const currentYearStr = typeof ev.year === "number" ? String(ev.year) : "";

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

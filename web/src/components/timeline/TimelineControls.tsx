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

  function onAddEvent(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsedYear = Number(year);

    const candidate = {
      id: id.trim(),
      title: title.trim(),
      year: parsedYear,
    };

    const result = TimelineEventSchema.safeParse(candidate);
    if (!result.success) {
      setError("Ungueltige Eingabe. Bitte id, title und ein gueltiges Jahr setzen.");
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
    </div>
  );
}

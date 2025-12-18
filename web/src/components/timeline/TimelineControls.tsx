"use client";

import { useMemo, useState } from "react";
import type { Timeline, TimelineAxis } from "../../types/timeline";
import { useTimelineDispatch, useTimelineState } from "../../context/timeline/TimelineContext";
import { TimelineEventSchema } from "../../types/timeline";

function nextAutoId(existingIds: string[]): string {
  const used = new Set(existingIds);

  let max = 0;
  for (const id of existingIds) {
    const m = /^e(\d+)$/.exec(id);
    if (m) {
      const n = Number(m[1]);
      if (Number.isFinite(n) && n > max) max = n;
    }
  }

  for (let i = max + 1; i < max + 10000; i += 1) {
    const candidate = `e${i}`;
    if (!used.has(candidate)) return candidate;
  }

  let fallback = `e${Date.now()}`;
  while (used.has(fallback)) fallback = `e${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  return fallback;
}

function parseOptionalInt(raw: string): number | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  const n = Number(trimmed);
  if (!Number.isFinite(n) || !Number.isInteger(n)) return NaN;
  return n;
}

function axisKey(axis?: TimelineAxis) {
  return JSON.stringify({
    tickStep: typeof axis?.tickStep === "number" ? axis.tickStep : null,
    targetTickCount: typeof axis?.targetTickCount === "number" ? axis.targetTickCount : null,
    minYear: typeof axis?.minYear === "number" ? axis.minYear : null,
    maxYear: typeof axis?.maxYear === "number" ? axis.maxYear : null,
  });
}

function cloneTimeline(base: Timeline): Timeline {
  const suffix = new Date().toISOString().replace(/[:.]/g, "").slice(0, 15);
  const newId = `${base.id}-copy-${suffix}`;
  return {
    ...base,
    id: newId,
    title: `${base.title} (Copy)`,
    axis: undefined,
  };
}

function AxisControls(props: {
  axis?: TimelineAxis;
  onSaveAxis: (axis?: TimelineAxis) => void;
  setError: (msg: string | null) => void;
}) {
  const { axis, onSaveAxis, setError } = props;

  const [tickStepInput, setTickStepInput] = useState(
    typeof axis?.tickStep === "number" ? String(axis.tickStep) : "",
  );
  const [targetTickCountInput, setTargetTickCountInput] = useState(
    typeof axis?.targetTickCount === "number" ? String(axis.targetTickCount) : "",
  );
  const [minYearInput, setMinYearInput] = useState(
    typeof axis?.minYear === "number" ? String(axis.minYear) : "",
  );
  const [maxYearInput, setMaxYearInput] = useState(
    typeof axis?.maxYear === "number" ? String(axis.maxYear) : "",
  );

  function onSave() {
    setError(null);

    const tickStep = parseOptionalInt(tickStepInput);
    if (Number.isNaN(tickStep)) {
      setError("tickStep muss eine ganze Zahl sein oder leer (auto).");
      return;
    }
    if (typeof tickStep === "number" && tickStep <= 0) {
      setError("tickStep muss groesser als 0 sein.");
      return;
    }

    const targetTickCount = parseOptionalInt(targetTickCountInput);
    if (Number.isNaN(targetTickCount)) {
      setError("targetTickCount muss eine ganze Zahl sein oder leer (auto).");
      return;
    }
    if (typeof targetTickCount === "number" && (targetTickCount < 2 || targetTickCount > 50)) {
      setError("targetTickCount muss zwischen 2 und 50 liegen.");
      return;
    }

    const minYear = parseOptionalInt(minYearInput);
    if (Number.isNaN(minYear)) {
      setError("minYear muss eine ganze Zahl sein oder leer (auto).");
      return;
    }

    const maxYear = parseOptionalInt(maxYearInput);
    if (Number.isNaN(maxYear)) {
      setError("maxYear muss eine ganze Zahl sein oder leer (auto).");
      return;
    }

    if (typeof minYear === "number" && typeof maxYear === "number" && maxYear < minYear) {
      setError("maxYear muss groesser oder gleich minYear sein.");
      return;
    }

    const nextAxis: TimelineAxis = {
      ...(typeof tickStep === "number" ? { tickStep } : {}),
      ...(typeof targetTickCount === "number" ? { targetTickCount } : {}),
      ...(typeof minYear === "number" ? { minYear } : {}),
      ...(typeof maxYear === "number" ? { maxYear } : {}),
    };

    const axisToStore = Object.keys(nextAxis).length ? nextAxis : undefined;
    onSaveAxis(axisToStore);
  }

  return (
    <div className="mb-3 rounded-md border p-2">
      <div className="mb-2 text-sm font-medium">Axis (Massstab)</div>

      <div className="mb-2 text-xs text-gray-600">
        tickStep hat Prioritaet. Wenn tickStep gesetzt ist, wird targetTickCount ignoriert. minYear/maxYear setzen den sichtbaren Bereich.
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <div className="flex flex-col">
          <label className="text-xs text-gray-600" htmlFor="axis-tickStep">tickStep (leer = auto)</label>
          <input
            id="axis-tickStep"
            className="w-44 rounded-md border px-2 py-1 text-sm"
            value={tickStepInput}
            onChange={e => setTickStepInput(e.target.value)}
            placeholder="zB 500"
            inputMode="numeric"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-gray-600" htmlFor="axis-targetTickCount">
            targetTickCount (nur wenn tickStep leer)
          </label>
          <input
            id="axis-targetTickCount"
            className="w-44 rounded-md border px-2 py-1 text-sm"
            value={targetTickCountInput}
            onChange={e => setTargetTickCountInput(e.target.value)}
            placeholder="zB 6"
            inputMode="numeric"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-gray-600" htmlFor="axis-minYear">minYear (leer = daten)</label>
          <input
            id="axis-minYear"
            className="w-44 rounded-md border px-2 py-1 text-sm"
            value={minYearInput}
            onChange={e => setMinYearInput(e.target.value)}
            placeholder="zB 0"
            inputMode="numeric"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-gray-600" htmlFor="axis-maxYear">maxYear (leer = daten)</label>
          <input
            id="axis-maxYear"
            className="w-44 rounded-md border px-2 py-1 text-sm"
            value={maxYearInput}
            onChange={e => setMaxYearInput(e.target.value)}
            placeholder="zB 1000"
            inputMode="numeric"
          />
        </div>

        <button
          type="button"
          className="cursor-pointer rounded-md border px-3 py-2 text-sm"
          onClick={onSave}
        >
          Save Axis
        </button>
      </div>
    </div>
  );
}

export function TimelineControls() {
  const { timeline, timelines, activeTimelineId } = useTimelineState();
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
          <label className="text-xs text-gray-600" htmlFor="tl-select">Aktiver Zeitstrahl</label>
          <select
            id="tl-select"
            className="w-80 rounded-md border px-2 py-2 text-sm"
            value={activeTimelineId}
            onChange={(e) => {
              dispatch({ type: "timeline/select", payload: { id: e.target.value } });
              setError(null);
              setIsTitleDirty(false);
              setTimelineTitleDraft("");
              setEditTitleById({});
              setEditYearById({});
              setEditDescriptionById({});
            }}
          >
            {timelines.map(t => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.id})
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="cursor-pointer rounded-md border px-3 py-2 text-sm"
          onClick={() => {
            const cloned = cloneTimeline(timeline);
            dispatch({ type: "timeline/add", payload: { timeline: cloned } });
            setError(null);
            setIsTitleDirty(false);
            setTimelineTitleDraft("");
            setEditTitleById({});
            setEditYearById({});
            setEditDescriptionById({});
          }}
        >
          Duplizieren
        </button>

        <button
          type="button"
          disabled={timelines.length <= 1}
          aria-disabled={timelines.length <= 1}
          className={timelines.length <= 1 ? "rounded-md border px-3 py-2 text-sm opacity-50" : "cursor-pointer rounded-md border px-3 py-2 text-sm"}
          onClick={() => {
            dispatch({ type: "timeline/delete", payload: { id: activeTimelineId } });
            setError(null);
            setIsTitleDirty(false);
            setTimelineTitleDraft("");
            setEditTitleById({});
            setEditYearById({});
            setEditDescriptionById({});
          }}
        >
          Timeline loeschen
        </button>
      </div>

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

      <AxisControls
        key={axisKey(timeline.axis)}
        axis={timeline.axis}
        setError={setError}
        onSaveAxis={(axisToStore) => {
          dispatch({ type: "timeline/updateAxis", payload: { axis: axisToStore } });
        }}
      />

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

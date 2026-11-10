"use client";

import { useMemo, useState } from "react";
import type { Timeline, TimelineAxis, Epoch } from "../../types/timeline";
import { useTimelineDispatch, useTimelineState, useTimelineHistory } from "../../context/timeline/TimelineContext";
import { TimelineEventSchema, TimelineSchema, EpochSchema } from "../../types/timeline";
import { UI } from "./uiText";
import { Button, Input, Label, Card } from "./ui-components";
import {
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Copy,
  FileJson,
  Settings,
  Calendar,
  Type,
  AlignLeft,
  ChevronDown,
  ChevronUp,
  Download,
  Image as ImageIcon,
  Undo2,
  Redo2,
  FileImage,
  Palette,
  Clock,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { exportAsPng, exportAsSvg, exportAsPdf, getTimelineElement } from "../../lib/export";

// Default colors for epochs
const EPOCH_COLOR_PRESETS = [
  "#fef3c7", // amber-100
  "#dbeafe", // blue-100
  "#dcfce7", // green-100
  "#fce7f3", // pink-100
  "#f3e8ff", // purple-100
  "#fed7aa", // orange-100
  "#cffafe", // cyan-100
  "#fef9c3", // yellow-100
];

function nextAutoId(existingIds: string[], prefix: string = "e"): string {
  const used = new Set(existingIds);
  const regex = new RegExp(`^${prefix}(\\d+)$`);
  let max = 0;
  for (const id of existingIds) {
    const m = regex.exec(id);
    if (m) {
      const n = Number(m[1]);
      if (Number.isFinite(n) && n > max) max = n;
    }
  }
  for (let i = max + 1; i < max + 10000; i += 1) {
    const candidate = `${prefix}${i}`;
    if (!used.has(candidate)) return candidate;
  }
  return `${prefix}${Date.now()}`;
}

function createTimelineId(prefix: string = "tl"): string {
  const suffix = new Date().toISOString().replace(/[:.]/g, "").slice(0, 15);
  return `${prefix}-${suffix}`;
}

function parseOptionalInt(raw: string): number | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  const n = Number(trimmed);
  if (!Number.isFinite(n) || !Number.isInteger(n)) return NaN;
  return n;
}

function AxisControls(props: {
  axis?: TimelineAxis;
  onSaveAxis: (axis?: TimelineAxis) => void;
  setError: (msg: string | null) => void;
}) {
  const { axis, onSaveAxis, setError } = props;
  const [isOpen, setIsOpen] = useState(false);

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
    if (Number.isNaN(tickStep)) return setError(UI.axis.errors.tickStepIntOrEmpty);
    if (typeof tickStep === "number" && tickStep <= 0) return setError(UI.axis.errors.tickStepGtZero);

    const targetTickCount = parseOptionalInt(targetTickCountInput);
    if (Number.isNaN(targetTickCount)) return setError(UI.axis.errors.targetTickCountIntOrEmpty);
    if (typeof targetTickCount === "number" && (targetTickCount < 2 || targetTickCount > 50)) {
      return setError(UI.axis.errors.targetTickCountRange);
    }

    const minYear = parseOptionalInt(minYearInput);
    if (Number.isNaN(minYear)) return setError(UI.axis.errors.minYearIntOrEmpty);

    const maxYear = parseOptionalInt(maxYearInput);
    if (Number.isNaN(maxYear)) return setError(UI.axis.errors.maxYearIntOrEmpty);

    if (typeof minYear === "number" && typeof maxYear === "number" && maxYear < minYear) {
      return setError(UI.axis.errors.maxYearGteMinYear);
    }

    const nextAxis: TimelineAxis = {
      ...(typeof tickStep === "number" ? { tickStep } : {}),
      ...(typeof targetTickCount === "number" ? { targetTickCount } : {}),
      ...(typeof minYear === "number" ? { minYear } : {}),
      ...(typeof maxYear === "number" ? { maxYear } : {}),
    };

    onSaveAxis(Object.keys(nextAxis).length ? nextAxis : undefined);
  }

  return (
    <Card className="p-4 mb-4">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-2 font-medium text-gray-900">
          <Settings className="w-4 h-4" />
          {UI.axis.title}
        </div>
        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="axis-tickStep">{UI.axis.tickStepLabel}</Label>
                <Input
                  id="axis-tickStep"
                  value={tickStepInput}
                  onChange={e => setTickStepInput(e.target.value)}
                  placeholder="e.g. 500"
                  inputMode="numeric"
                />
              </div>
              <div>
                <Label htmlFor="axis-targetTickCount">{UI.axis.targetTickCountLabel}</Label>
                <Input
                  id="axis-targetTickCount"
                  value={targetTickCountInput}
                  onChange={e => setTargetTickCountInput(e.target.value)}
                  placeholder="e.g. 6"
                  inputMode="numeric"
                />
              </div>
              <div>
                <Label htmlFor="axis-minYear">{UI.axis.minYearLabel}</Label>
                <Input
                  id="axis-minYear"
                  value={minYearInput}
                  onChange={e => setMinYearInput(e.target.value)}
                  placeholder="e.g. 0"
                  inputMode="numeric"
                />
              </div>
              <div>
                <Label htmlFor="axis-maxYear">{UI.axis.maxYearLabel}</Label>
                <Input
                  id="axis-maxYear"
                  value={maxYearInput}
                  onChange={e => setMaxYearInput(e.target.value)}
                  placeholder="e.g. 1000"
                  inputMode="numeric"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={onSave} size="sm">
                Apply Axis Settings
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export function TimelineControls() {
  const { timeline, timelines, activeTimelineId, canUndo, canRedo } = useTimelineState();
  const dispatch = useTimelineDispatch();
  const { undo, redo } = useTimelineHistory();
  const [timelineTitleDraft, setTimelineTitleDraft] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPng = async () => {
    const element = getTimelineElement();
    if (!element || isExporting) return;

    setIsExporting(true);
    try {
      await exportAsPng(element, `${timeline.title || "timeline"}-${new Date().toISOString().slice(0, 10)}.png`);
    } catch (err) {
      console.error("PNG Export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportSvg = async () => {
    const element = getTimelineElement();
    if (!element || isExporting) return;

    setIsExporting(true);
    try {
      await exportAsSvg(element, `${timeline.title || "timeline"}-${new Date().toISOString().slice(0, 10)}.svg`);
    } catch (err) {
      console.error("SVG Export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdf = async () => {
    const element = getTimelineElement();
    if (!element || isExporting) return;

    setIsExporting(true);
    try {
      await exportAsPdf(
        element,
        `${timeline.title || "timeline"}-${new Date().toISOString().slice(0, 10)}.pdf`,
        { title: timeline.title || "Timeline" }
      );
    } catch (err) {
      console.error("PDF Export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };
  const [isTitleDirty, setIsTitleDirty] = useState(false);

  // Event state
  const existingEventIds = useMemo(() => timeline.events.map(e => e.id), [timeline.events]);
  const nextEventIdPreview = useMemo(() => nextAutoId(existingEventIds, "e"), [existingEventIds]);

  const [eventTitle, setEventTitle] = useState("");
  const [eventYear, setEventYear] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Event edit state
  const [eventEditState, setEventEditState] = useState<Record<string, { title?: string, year?: string, desc?: string }>>({});

  // Epoch state
  const existingEpochIds = useMemo(() => timeline.epochs.map(e => e.id), [timeline.epochs]);
  const nextEpochIdPreview = useMemo(() => nextAutoId(existingEpochIds, "ep"), [existingEpochIds]);

  const [epochTitle, setEpochTitle] = useState("");
  const [epochStartYear, setEpochStartYear] = useState("");
  const [epochEndYear, setEpochEndYear] = useState("");
  const [epochColor, setEpochColor] = useState(EPOCH_COLOR_PRESETS[0]);
  const [epochDescription, setEpochDescription] = useState("");

  // Epoch edit state
  const [epochEditState, setEpochEditState] = useState<Record<string, {
    title?: string,
    startYear?: string,
    endYear?: string,
    color?: string,
    desc?: string
  }>>({});

  function onSaveTimelineTitle() {
    setError(null);
    const next = timelineTitleDraft.trim();
    if (!next) return setError(UI.timeline.titleEmpty);
    dispatch({ type: "timeline/updateTitle", payload: { title: next } });
    setIsTitleDirty(false);
  }

  // ===== EVENT HANDLERS =====
  function onAddEvent(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmedTitle = eventTitle.trim();
    const trimmedYear = eventYear.trim();

    if (!trimmedTitle || !trimmedYear) return setError(UI.events.errors.fillTitleYear);

    const parsedYear = Number(trimmedYear);
    if (!Number.isFinite(parsedYear) || !Number.isInteger(parsedYear)) return setError(UI.events.errors.yearInteger);

    const newId = nextAutoId(existingEventIds, "e");
    const candidate = {
      id: newId,
      title: trimmedTitle,
      year: parsedYear,
      description: eventDescription.trim() || undefined,
    };

    const result = TimelineEventSchema.safeParse(candidate);
    if (!result.success) return setError(UI.events.errors.invalidInput);

    dispatch({ type: "event/add", payload: result.data });
    setEventTitle("");
    setEventYear("");
    setEventDescription("");
  }

  function updateEventEditState(id: string, field: 'title' | 'year' | 'desc', value: string) {
    setEventEditState(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  }

  function saveEvent(ev: { id: string, title: string, year?: number | string, description?: string }) {
    const edits = eventEditState[ev.id] || {};
    const nextTitle = (edits.title ?? ev.title).trim();
    const nextYearStr = (edits.year ?? String(ev.year)).trim();
    const nextDesc = (edits.desc ?? ev.description ?? "").trim();

    if (!nextTitle) return setError(UI.events.errors.titleEmpty);

    const parsedYear = Number(nextYearStr);
    if (!Number.isFinite(parsedYear)) return setError(UI.events.errors.yearInteger);

    dispatch({
      type: "event/update",
      payload: {
        id: ev.id,
        title: nextTitle,
        year: parsedYear,
        description: nextDesc || undefined
      }
    });

    // Clear edit state for this event
    const nextState = { ...eventEditState };
    delete nextState[ev.id];
    setEventEditState(nextState);
  }

  // ===== EPOCH HANDLERS =====
  function onAddEpoch(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmedTitle = epochTitle.trim();
    const trimmedStartYear = epochStartYear.trim();
    const trimmedEndYear = epochEndYear.trim();

    if (!trimmedTitle) return setError("Epoch title is required.");
    if (!trimmedStartYear || !trimmedEndYear) return setError("Start and end year are required.");

    const parsedStartYear = Number(trimmedStartYear);
    const parsedEndYear = Number(trimmedEndYear);

    if (!Number.isFinite(parsedStartYear) || !Number.isInteger(parsedStartYear)) {
      return setError("Start year must be an integer.");
    }
    if (!Number.isFinite(parsedEndYear) || !Number.isInteger(parsedEndYear)) {
      return setError("End year must be an integer.");
    }
    if (parsedEndYear < parsedStartYear) {
      return setError("End year must be greater than or equal to start year.");
    }

    const newId = nextAutoId(existingEpochIds, "ep");
    const candidate: Epoch = {
      id: newId,
      title: trimmedTitle,
      startYear: parsedStartYear,
      endYear: parsedEndYear,
      color: epochColor,
      description: epochDescription.trim() || undefined,
    };

    const result = EpochSchema.safeParse(candidate);
    if (!result.success) return setError("Invalid epoch data.");

    dispatch({ type: "epoch/add", payload: result.data });
    setEpochTitle("");
    setEpochStartYear("");
    setEpochEndYear("");
    setEpochColor(EPOCH_COLOR_PRESETS[(existingEpochIds.length + 1) % EPOCH_COLOR_PRESETS.length]);
    setEpochDescription("");
  }

  function updateEpochEditState(id: string, field: 'title' | 'startYear' | 'endYear' | 'color' | 'desc', value: string) {
    setEpochEditState(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  }

  function saveEpoch(ep: Epoch) {
    const edits = epochEditState[ep.id] || {};
    const nextTitle = (edits.title ?? ep.title).trim();
    const nextStartYearStr = (edits.startYear ?? String(ep.startYear)).trim();
    const nextEndYearStr = (edits.endYear ?? String(ep.endYear)).trim();
    const nextColor = edits.color ?? ep.color ?? EPOCH_COLOR_PRESETS[0];
    const nextDesc = (edits.desc ?? ep.description ?? "").trim();

    if (!nextTitle) return setError("Epoch title is required.");

    const parsedStartYear = Number(nextStartYearStr);
    const parsedEndYear = Number(nextEndYearStr);

    if (!Number.isFinite(parsedStartYear)) return setError("Start year must be a valid number.");
    if (!Number.isFinite(parsedEndYear)) return setError("End year must be a valid number.");
    if (parsedEndYear < parsedStartYear) return setError("End year must be >= start year.");

    dispatch({
      type: "epoch/update",
      payload: {
        id: ep.id,
        title: nextTitle,
        startYear: parsedStartYear,
        endYear: parsedEndYear,
        color: nextColor,
        description: nextDesc || undefined
      }
    });

    // Clear edit state for this epoch
    const nextState = { ...epochEditState };
    delete nextState[ep.id];
    setEpochEditState(nextState);
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">

      {/* Header Controls */}
      <Card className="p-4 bg-gray-50/50">
        <div className="flex flex-col gap-5">
          {/* Top Row: Timeline Selection & Title */}
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="w-full md:w-1/3">
              <Label htmlFor="tl-select">{UI.timeline.activeLabel}</Label>
              <select
                id="tl-select"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={activeTimelineId}
                onChange={(e) => dispatch({ type: "timeline/select", payload: { id: e.target.value } })}
              >
                {timelines.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
              </select>
            </div>

            <div className="flex-1 flex gap-2 items-end">
              <div className="flex-1">
                <Label htmlFor="tl-title">{UI.timeline.titleLabel}</Label>
                <Input
                  id="tl-title"
                  value={isTitleDirty ? timelineTitleDraft : timeline.title}
                  onChange={e => { setIsTitleDirty(true); setTimelineTitleDraft(e.target.value); }}
                />
              </div>
              {isTitleDirty && (
                <Button onClick={onSaveTimelineTitle} variant="primary" size="icon">
                  <Save className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Bottom Row: Actions */}
          <div className="flex flex-wrap gap-2 justify-end items-center pt-3 border-t border-gray-200" role="toolbar" aria-label="Timeline actions">
            {/* Undo/Redo */}
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm mr-2" role="group" aria-label="History controls">
              <Button
                variant="ghost"
                size="icon"
                onClick={undo}
                disabled={!canUndo}
                title="Undo (Ctrl+Z)"
                aria-label="Undo last action"
                className="disabled:opacity-40"
              >
                <Undo2 className="w-4 h-4" aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={redo}
                disabled={!canRedo}
                title="Redo (Ctrl+Y)"
                aria-label="Redo last undone action"
                className="disabled:opacity-40"
              >
                <Redo2 className="w-4 h-4" aria-hidden="true" />
              </Button>
            </div>

            <Button variant="secondary" size="md" title={UI.timeline.duplicate} className="flex items-center gap-2" onClick={() => dispatch({ type: "timeline/add", payload: { timeline: { ...timeline, id: createTimelineId(), title: `${timeline.title} (Copy)` } } })}>
              <Copy className="w-4 h-4" />
              <span className="hidden sm:inline">Duplicate</span>
            </Button>
            <Button variant="secondary" size="md" title={UI.timeline.reset} className="flex items-center gap-2" onClick={() => dispatch({ type: "timeline/reset" })}>
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
            <Button variant="danger" size="md" title={UI.timeline.delete} className="flex items-center gap-2" disabled={timelines.length <= 1} onClick={() => dispatch({ type: "timeline/delete", payload: { id: activeTimelineId } })}>
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Delete</span>
            </Button>

            <div className="w-px h-6 bg-gray-300 mx-2 hidden md:block"></div>

            {/* Export Buttons */}
            <Button
              variant="secondary"
              size="md"
              onClick={handleExportSvg}
              disabled={isExporting}
              className="flex items-center gap-2"
              title="Export as SVG"
              aria-label="Export timeline as SVG"
            >
              <FileImage className="w-4 h-4" />
              SVG
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={handleExportPdf}
              disabled={isExporting}
              className="flex items-center gap-2"
              title="Export as PDF"
              aria-label="Export timeline as PDF"
            >
              <Download className="w-4 h-4" />
              PDF
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleExportPng}
              disabled={isExporting}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
              aria-label="Export timeline as PNG"
            >
              <ImageIcon className="w-4 h-4" />
              {isExporting ? "Exporting..." : "PNG"}
            </Button>
          </div>
        </div>
        {error && <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded border border-red-100">{error}</div>}
      </Card>

      <AxisControls axis={timeline.axis} setError={setError} onSaveAxis={(a) => dispatch({ type: "timeline/updateAxis", payload: { axis: a } })} />

      {/* Add Event Form */}
      <Card className="p-5 border-blue-100 shadow-md">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <div className="bg-blue-100 p-1.5 rounded-md text-blue-600">
            <Plus className="w-5 h-5" />
          </div>
          Add New Event
          <span className="text-xs font-normal text-gray-400 ml-2">(Single point in time)</span>
        </h3>
        <form onSubmit={onAddEvent} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-2">
            <Label>ID</Label>
            <div className="px-3 py-2 bg-gray-100 text-gray-500 rounded-md text-sm font-mono border border-transparent">
              {nextEventIdPreview}
            </div>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="ev-year">Year</Label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400" />
              <Input id="ev-year" className="pl-9" placeholder="2024" value={eventYear} onChange={e => setEventYear(e.target.value)} />
            </div>
          </div>
          <div className="md:col-span-3">
            <Label htmlFor="ev-title">Title</Label>
            <div className="relative">
              <Type className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400" />
              <Input id="ev-title" className="pl-9" placeholder="Event Title" value={eventTitle} onChange={e => setEventTitle(e.target.value)} />
            </div>
          </div>
          <div className="md:col-span-3">
            <Label htmlFor="ev-desc">Description</Label>
            <div className="relative">
              <AlignLeft className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400" />
              <Input id="ev-desc" className="pl-9" placeholder="Optional details..." value={eventDescription} onChange={e => setEventDescription(e.target.value)} />
            </div>
          </div>
          <div className="md:col-span-2">
            <Button type="submit" className="w-full">Add Event</Button>
          </div>
        </form>
      </Card>

      {/* Add Epoch Form */}
      <Card className="p-5 border-amber-200 shadow-md bg-amber-50/30">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <div className="bg-amber-100 p-1.5 rounded-md text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
          Add New Epoch
          <span className="text-xs font-normal text-gray-400 ml-2">(Time span / Era)</span>
        </h3>
        <form onSubmit={onAddEpoch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-1">
            <Label>ID</Label>
            <div className="px-3 py-2 bg-gray-100 text-gray-500 rounded-md text-sm font-mono border border-transparent">
              {nextEpochIdPreview}
            </div>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="ep-start">Start Year</Label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400" />
              <Input id="ep-start" className="pl-9" placeholder="1900" value={epochStartYear} onChange={e => setEpochStartYear(e.target.value)} />
            </div>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="ep-end">End Year</Label>
            <div className="relative">
              <ArrowRight className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400" />
              <Input id="ep-end" className="pl-9" placeholder="2000" value={epochEndYear} onChange={e => setEpochEndYear(e.target.value)} />
            </div>
          </div>
          <div className="md:col-span-3">
            <Label htmlFor="ep-title">Title</Label>
            <div className="relative">
              <Type className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400" />
              <Input id="ep-title" className="pl-9" placeholder="Era Name" value={epochTitle} onChange={e => setEpochTitle(e.target.value)} />
            </div>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="ep-color">Color</Label>
            <div className="flex gap-1 items-center">
              <input
                type="color"
                id="ep-color"
                value={epochColor}
                onChange={e => setEpochColor(e.target.value)}
                className="w-10 h-9 rounded border border-gray-300 cursor-pointer"
              />
              <div className="flex gap-0.5">
                {EPOCH_COLOR_PRESETS.slice(0, 4).map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setEpochColor(color)}
                    className={`w-6 h-6 rounded border-2 transition-all ${epochColor === color ? 'border-gray-600 scale-110' : 'border-transparent hover:border-gray-300'}`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">Add Epoch</Button>
          </div>
        </form>
      </Card>

      {/* Event List */}
      <div className="space-y-3">
        <h3 className="font-medium text-gray-500 text-sm uppercase tracking-wider pl-1">
          Timeline Events ({timeline.events.length})
        </h3>
        <div className="grid gap-3">
          <AnimatePresence initial={false}>
            {timeline.events.map(ev => {
              const edits = eventEditState[ev.id] || {};

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={ev.id}
                >
                  <Card className="p-3 flex flex-col md:flex-row gap-3 md:items-center group hover:border-blue-300 transition-colors">
                    <div className="flex items-center gap-3 min-w-[80px]">
                      <span className="font-mono text-xs text-gray-400 select-none pb-0.5 border-b border-transparent group-hover:border-gray-200">{ev.id}</span>
                      <Input
                        className="w-20 font-mono text-center font-bold text-blue-600 bg-blue-50/50 border-transparent focus:bg-white transition-all"
                        value={edits.year ?? ev.year}
                        onChange={e => updateEventEditState(ev.id, 'year', e.target.value)}
                        onBlur={() => saveEvent(ev)}
                      />
                    </div>

                    <div className="flex-1 grid md:grid-cols-2 gap-3">
                      <Input
                        className="font-medium border-transparent focus:bg-gray-50 -ml-2 px-2"
                        value={edits.title ?? ev.title}
                        onChange={e => updateEventEditState(ev.id, 'title', e.target.value)}
                        onBlur={() => saveEvent(ev)}
                      />
                      <Input
                        className="text-gray-500 text-sm border-transparent focus:bg-gray-50 -ml-2 px-2"
                        placeholder="No description"
                        value={edits.desc ?? ev.description ?? ""}
                        onChange={e => updateEventEditState(ev.id, 'desc', e.target.value)}
                        onBlur={() => saveEvent(ev)}
                      />
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => dispatch({ type: "event/delete", payload: { id: ev.id } })}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {timeline.events.length === 0 && (
            <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
              No events yet. Add one above!
            </div>
          )}
        </div>
      </div>

      {/* Epoch List */}
      <div className="space-y-3">
        <h3 className="font-medium text-amber-600 text-sm uppercase tracking-wider pl-1">
          Timeline Epochs ({timeline.epochs.length})
        </h3>
        <div className="grid gap-3">
          <AnimatePresence initial={false}>
            {timeline.epochs.map(ep => {
              const edits = epochEditState[ep.id] || {};
              const currentColor = edits.color ?? ep.color ?? EPOCH_COLOR_PRESETS[0];

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={ep.id}
                >
                  <Card
                    className="p-3 flex flex-col md:flex-row gap-3 md:items-center group hover:border-amber-300 transition-colors"
                    style={{ borderLeftWidth: '4px', borderLeftColor: currentColor }}
                  >
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <span className="font-mono text-xs text-gray-400 select-none">{ep.id}</span>
                      <input
                        type="color"
                        value={currentColor}
                        onChange={e => updateEpochEditState(ep.id, 'color', e.target.value)}
                        onBlur={() => saveEpoch(ep)}
                        className="w-6 h-6 rounded border border-gray-300 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center gap-2 min-w-[180px]">
                      <Input
                        className="w-20 font-mono text-center font-bold text-amber-700 bg-amber-50/50 border-transparent focus:bg-white transition-all"
                        value={edits.startYear ?? ep.startYear}
                        onChange={e => updateEpochEditState(ep.id, 'startYear', e.target.value)}
                        onBlur={() => saveEpoch(ep)}
                      />
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <Input
                        className="w-20 font-mono text-center font-bold text-amber-700 bg-amber-50/50 border-transparent focus:bg-white transition-all"
                        value={edits.endYear ?? ep.endYear}
                        onChange={e => updateEpochEditState(ep.id, 'endYear', e.target.value)}
                        onBlur={() => saveEpoch(ep)}
                      />
                    </div>

                    <div className="flex-1">
                      <Input
                        className="font-medium border-transparent focus:bg-gray-50 -ml-2 px-2"
                        value={edits.title ?? ep.title}
                        onChange={e => updateEpochEditState(ep.id, 'title', e.target.value)}
                        onBlur={() => saveEpoch(ep)}
                      />
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => dispatch({ type: "epoch/delete", payload: { id: ep.id } })}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {timeline.epochs.length === 0 && (
            <div className="text-center py-10 text-amber-400 border-2 border-dashed border-amber-200 rounded-lg bg-amber-50/30">
              No epochs yet. Add time periods above!
            </div>
          )}
        </div>
      </div>

    </div>
  );
}


import { ChangeEvent, useRef } from "react";
import { CalendarInterface } from "../Countdown.types";
import clsx from "clsx";
import { Holiday } from "@/features/Countdown";
import { ICSImportResponse } from "./ControlPanel.types";
import { ICSImportSource, ImportedHoliday } from "@/features/Countdown/CalendarReducer.types";

type ControlPanelProps = {
    calendarInterface: CalendarInterface;
}

export function ControlPanel({ calendarInterface }: ControlPanelProps) {
    const uiState = calendarInterface.state.uiState;
    const extractDate = (selectedDate: number) => selectedDate ? new Date(selectedDate).toISOString().split('T')[0] : "";

    const icsUrlRef = useRef<HTMLInputElement | null>(null);

    function onDateSelect(e: ChangeEvent<HTMLInputElement>, idx: number) {
        const dateString = e.currentTarget.value + "T00:00:00";
        const timestamp = new Date(dateString).getTime();
        console.log(e.currentTarget.value, dateString, timestamp)
        if (isNaN(timestamp)) return;

        calendarInterface.dispatch.uiDispatch({ type: "onDateAdjust", payload: [idx, timestamp], commit: false })
    }

    function commitDate(e: React.FocusEvent<HTMLInputElement>, idx: number) {
        calendarInterface.dispatch.uiDispatch({ type: "onDateAdjust", payload: [idx, uiState.selectedDates[idx] ], commit: true });
        console.log("blur");
    }

    function mainButtonLabel() {
        if (!uiState.selectedDates.length) return "Select Date";
        if (!uiState.pendingLabel.length) return "Enter Label"
        if (uiState.editHolidaySelection && !uiState.isEditActive) return "Delete";
        if (uiState.isEditActive) return "Save Edit";
        return uiState.selectionIntent === "target" ? "Set Target" : "Save Holiday";
    }

    function isMainButtonDisabled() {
        return !uiState.selectedDates.length || !uiState.pendingLabel.trim().length;
    }

    function secondaryButtonLabel() {
        return uiState.isEditActive ? "Cancel" : "Edit";
    }

    function handleSave() {
        if (uiState.selectedDates.length === 1 && uiState.selectionIntent === "target") {
            calendarInterface.dispatch.calendarDispatch({ type: "SET_TARGET", label: uiState.pendingLabel, date: uiState.selectedDates[0] });
            calendarInterface.dispatch.uiDispatch({ type: "resetForm" });
        } else if (uiState.editHolidaySelection && !uiState.isEditActive) {
            calendarInterface.dispatch.calendarDispatch({ type: "REMOVE_HOLIDAY", payload: uiState.editHolidaySelection });
            calendarInterface.dispatch.uiDispatch({ type: "resetForm" });
        } else if (uiState.isEditActive) {
            const existingHoliday = calendarInterface.state.calendarState.holidays.find(h => h.id === uiState.editHolidaySelection)!;
            const basePayload = {
                ...existingHoliday,
                id: uiState.editHolidaySelection!,
                label: uiState.pendingLabel,
                isSchoolDay: uiState.isSchoolHoliday,
                dates: uiState.selectedDates.sort(),
                isShared: false,
            } as Holiday;

            const hasConflictingChange =
                (existingHoliday as ImportedHoliday).hasConflictingChange ||
                existingHoliday.dates[0] !== uiState.selectedDates[0] ||
                existingHoliday.dates[1] !== uiState.selectedDates[1];

            const hasChange =
                (existingHoliday as ImportedHoliday).hasChange ||
                hasConflictingChange ||
                existingHoliday.isSchoolDay !== uiState.isSchoolHoliday ||
                existingHoliday.label !== uiState.pendingLabel;
            
            const keep = hasChange;

            const payload = (existingHoliday as ImportedHoliday).sourceId ? {
                ...basePayload,
                hasChange,
                hasConflictingChange,
                keep,
            } as ImportedHoliday : basePayload;

            calendarInterface.dispatch.calendarDispatch({ type: "UPDATE_HOLIDAY", payload });
            calendarInterface.dispatch.uiDispatch({ type: "toggleEdit" });
        } else if (uiState.selectedDates.length && uiState.selectionIntent === "holiday") {
            calendarInterface.dispatch.calendarDispatch({
                type: "ADD_HOLIDAY",
                payload: {
                    id: crypto.randomUUID(),
                    label: uiState.pendingLabel,
                    isSchoolDay: uiState.isSchoolHoliday,
                    dates: uiState.selectedDates,
                    isShared: false,
                }
            });
            calendarInterface.dispatch.uiDispatch({ type: "resetForm" });
        }
    }

    function secondaryClick() {
        calendarInterface.dispatch.uiDispatch({ type: "toggleEdit" });
    }

    function handleHolidaySelection(h: Holiday) {
        if (uiState.editHolidaySelection) calendarInterface.dispatch.uiDispatch({ type: "showHoliday", payload: "" });
        else calendarInterface.dispatch.uiDispatch({ type: "showHoliday", payload: h.id });
    }

    async function icsButton() {
        const { icsUrl } = uiState;
        calendarInterface.dispatch.uiDispatch({ type: "onIcsUrlChange", payload: "" });
        const icsDataRes = await fetch(`/api/countdown/fetchIcs?icsUrl=${icsUrl}`);
        const icsData = await icsDataRes.json() as ICSImportResponse;

        const { version, calName, events, tzOffset } = icsData;

        const encodedText = new TextEncoder().encode(`${calName}|${icsUrl}`);
        const digest = await crypto.subtle.digest("SHA-256", encodedText);
        const hash = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');

        const existingImportSource = calendarInterface.state.calendarState.importedSources?.find(s => s.id === hash);
        const sourceId = hash + (!existingImportSource ? "" : (
            confirm(`This appears to be a duplicate of an existing source.  Press 'OK' to add it anyway.  Press 'Cancel' to refresh the existing source instead.`) ?
                Date.now() : ""
        ));

        const tzRelOffsetMs = (new Date().getTimezoneOffset() - tzOffset) * 60_000;
        const schoolHolidays: ImportedHoliday[] = events.map(e => ({
            id: e.uid,
            label: e.label,
            dates: [ e.start, e.end ].map(v => v + tzRelOffsetMs),
            isSchoolDay: e.label.toLowerCase().includes("closed"),
            isShared: false,
            sourceId,
            keep: false,
            hasChange: false,
            hasConflictingChange: false,
        }));

        let [ added, ignored, retained, updated, overwritten, conflictsPending ] = [ 0, 0, 0, 0, 0, 0 ];
        const [ adds, updates ] = [ [], [] ] as ImportedHoliday[][];
        const conflicts: [ImportedHoliday, ImportedHoliday][] = [];

        if (existingImportSource?.id !== sourceId) {
            adds.push(...schoolHolidays);
            added += adds.length;
        } else {
            const existingBySourceAndId = new Map(
                calendarInterface.state.calendarState.holidays.map(h => [`${(h as ImportedHoliday).sourceId ?? `USER`}|${h.id}`, h])
            );

            adds.push(...schoolHolidays
                .filter(h =>
                    !existingBySourceAndId.has(`${h.sourceId}|${h.id}`)
                )
            );
            added += adds.length;

            schoolHolidays.forEach(h => {
                const existingHoliday = existingBySourceAndId.get(`${h.sourceId}|${h.id}`) as ImportedHoliday;
                if (!existingHoliday) return;

                if (
                    h.dates[0] === existingHoliday.dates[0] &&
                    h.dates[1] === existingHoliday.dates[1] &&
                    h.label === existingHoliday.label &&
                    h.isSchoolDay === existingHoliday.isSchoolDay
                ) { // no changes
                    ignored++;
                    return;
                }

                if (!existingHoliday.hasChange) { // there are changes, we didn't make any of them
                    updated++;
                    updates.push(h);
                    return;
                }

                if (!existingHoliday.keep) { // there are changes, we made them, but we don't want to keep them
                    overwritten++;
                    updates.push(h);
                    return;
                }

                if (!existingHoliday.hasConflictingChange) { // there are changes, we made them, but they're not important
                    retained++;
                    return false;
                }

                conflictsPending++;
                conflicts.push([ h, existingHoliday ]);
            });
        }

        adds.forEach(e => calendarInterface.dispatch.calendarDispatch({ type: "ADD_HOLIDAY", payload: e }));
        updates.forEach(e => calendarInterface.dispatch.calendarDispatch({ type: "UPDATE_HOLIDAY", payload: e }))

        const importSource: ICSImportSource = {
            id: sourceId,
            name: calName,
            url: icsUrl,
            importedAt: Date.now(),
            conflictsPending: conflicts,
            importSummary: {
                added,
                ignored,
                retained,
                updated,
                overwritten,
                conflictsPending,
            },
        };

        calendarInterface.dispatch.calendarDispatch({ type: "UPDATE_SOURCE", payload: importSource });
        console.log(importSource.importSummary, importSource.conflictsPending);
    }

    return (
        <div className="flex flex-col h-full gap-2">
            <div className="panel flex flex-col gap-2">
                <div
                    className={
                        clsx(
                            "panel-title",
                            "flex",
                            "items-center",
                            "relative",
                            "pt-6.5",
                            !uiState.isShowIcsUrl ? "pb-6.5" : "pb-6",
                            "mb-0",
                            "-m-3",
                            "p-3",
                            "bg-linear-to-br",
                            "from-gray-50",
                            uiState.selectionIntent === "holiday" ? "to-cyan-200" : "to-green-200"
                        )
                    }
                >
                    { !uiState.isShowIcsUrl && uiState.selectionIntent === "holiday" && <span className="flex-1">Edit Calendar Events</span> }
                    { !uiState.isShowIcsUrl &&  uiState.selectionIntent === "target" && <span
                        className="flex-1"
                    >
                        {calendarInterface.state.calendarState.targetDate ? `Modify` : `Set`} Countdown Target
                    </span> }
                    { uiState.isShowIcsUrl && <span className="flex-1">Import ICS Event Data</span> }
                    <button onClick={() => calendarInterface.dispatch.uiDispatch({ type: "toggleIcsUrl" })} className="btn btn-icon">{uiState.isShowIcsUrl ? `❌` : `🌐`}</button>
                </div>
                { uiState.isShowIcsUrl && <div>
                    <label className="relative label flex flex-col gap-1">
                        <span>Enter the URL of an ICS calendar file to import:</span>
                        <input
                            ref={icsUrlRef}
                            className="input pr-7"
                            value={uiState.icsUrl}
                            onChange={e => calendarInterface.dispatch.uiDispatch({ type: "onIcsUrlChange", payload: e.currentTarget.value })}
                        />

                        <button
                            onClick={() => icsButton()}
                            className="absolute cursor-pointer text-lg hover:bg-gray-100 right-2 top-10 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-500"
                        >📥</button>
                    </label>
                </div> }
                { !uiState.isShowIcsUrl && <div className="">
                    <div>
                        <label className="flex flex-col gap-1 label">
                            { uiState.selectionIntent === "target" && <span>What are you counting down to?</span> }
                            { uiState.selectionIntent === "holiday" && <span>Enter a label for a holiday:</span> }
                            <input
                                className="input"
                                disabled={!!uiState.editHolidaySelection && !uiState.isEditActive}
                                value={uiState.pendingLabel}
                                onChange={e =>
                                    calendarInterface.dispatch.uiDispatch({ type: "onPendingLabelChange", payload: e.currentTarget.value })
                                }
                            />
                        </label>
                    </div>
                    <div className="flex gap-1 mb-2">
                        <label className="flex flex-col gap-1 label min-w-0 flex-1">
                            { uiState.selectionIntent === "target" && <span>When is it?<br/>(You can also choose on the calendar)</span> }
                            { uiState.selectionIntent === "holiday" && <span>When does it start?<br/>(You can also choose on the calendar)</span> }
                            <input
                                className="input flex-1 min-w-0"
                                type="date"
                                disabled={!!uiState.editHolidaySelection && !uiState.isEditActive}
                                value={extractDate(uiState.selectedDates[0])}
                                onChange={e => onDateSelect(e, 0)}
                            />
                        </label>
                    </div>
                    <div className="flex gap-1 mb-2">
                        <label className={clsx((!uiState.selectedDates.length || uiState.selectionIntent === "target") && "invisible", "flex flex-col gap-1 label min-w-0 flex-1")}>
                            <span>When does it end?<br/>(Leave it blank it's only one day)</span>
                            <input
                                type="date"
                                disabled={!!uiState.editHolidaySelection && !uiState.isEditActive}
                                className="input flex-1 min-w-0"
                                value={extractDate(uiState.selectedDates[1])}
                                onChange={e => onDateSelect(e, 1)}
                            />
                        </label>
                    </div>
                    <div className="flex p-2 justify-center">
                        <label className={clsx(uiState.selectionIntent === "target" && "invisible", "flex items-center gap-2 label")}>
                            <input
                                id="isSchoolHoliday"
                                type="checkbox"
                                disabled={!!uiState.editHolidaySelection && !uiState.isEditActive}
                                checked={uiState.isSchoolHoliday}
                                onChange={() => calendarInterface.isSchoolHolidayToggle()}
                            />
                            <span>Do <strong>NOT</strong> include these days in the countdown!</span>
                        </label>
                        { false && <label className="flex items-center gap-2 label">
                            <input id="isSharedHoliday" type="checkbox" />
                            Shared Holiday
                        </label> }
                    </div>
                    <div className="flex gap-4">
                        <button
                            className={clsx("flex-1 btn", uiState.editHolidaySelection && !uiState.isEditActive ? "btn-danger" : "btn-primary")}
                            onClick={() => handleSave()}
                            disabled={isMainButtonDisabled()}
                        >{mainButtonLabel()}</button>
                        {uiState.editHolidaySelection && <button
                            className="flex-1 btn"
                            onClick={() => secondaryClick()}
                        >{secondaryButtonLabel()}</button>}
                    </div>
                </div> }
            </div>
            <div className="panel flex flex-col flex-1 min-h-0">
                { (!uiState.selectedSourceId.length || !uiState.isShowIcsUrl) && <div className="panel-title p-2">Existing {uiState.isShowIcsUrl ? `Imports` : `Holidays`}</div> }
                { !!uiState.selectedSourceId.length && uiState.isShowIcsUrl && (
                    <div className="panel-title flex items-center">
                        <button
                            onClick={() => calendarInterface.dispatch.uiDispatch({ type: "selectSource", id: "" })}
                            className="btn btn-icon mr-2"
                        >🔙</button>
                        {calendarInterface.state.calendarState.importedSources.find(s => s.id === uiState.selectedSourceId)!.name}
                    </div>
                )}
                {
                    !uiState.isShowIcsUrl && calendarInterface.state.calendarState.holidays.filter(h =>
                        uiState.selectedDates.length && uiState.selectionIntent === "holiday" &&
                        h.dates.at(0)! <= uiState.selectedDates.at(-1)! &&
                        h.dates.at(-1)! >= uiState.selectedDates.at(0)!
                    ).map(h => (<button className="text-left list-row" onClick={() => handleHolidaySelection(h)} key={h.id}>{h.label}</button>))
                }
                {
                    uiState.isShowIcsUrl && uiState.selectedSourceId === "" && calendarInterface.state.calendarState.importedSources?.map(s => (
                        <div className="list-row text-xs flex gap-1" key={s.id}>
                            <span>{s.name}</span>
                            <div className="ml-auto flex flex-col gap-1">
                                <button className="btn btn-icon w-2 h-2 text-xs">👁️</button>
                                <button
                                    className="btn btn-icon w-2 h-2 text-xs"
                                    onClick={() => calendarInterface.dispatch.uiDispatch({ type: "selectSource", id: s.id })}
                                >🖊️</button>
                            </div>
                            <div className="flex flex-col gap-1">
                                <button className="btn btn-icon w-2 h-2 text-xs">🔄️</button>
                                <button
                                    className="btn btn-icon w-2 h-2 text-xs"
                                    onClick={() => calendarInterface.dispatch.calendarDispatch({ type: "REMOVE_SOURCE", id: s.id })}
                                >❌</button>
                            </div>
                        </div>
                    ))
                }
                {
                    uiState.isShowIcsUrl && uiState.selectedSourceId !== "" && <div className="flex-1 min-h-0 overflow-auto">
                        { calendarInterface.state.calendarState.holidays.filter((h): h is ImportedHoliday =>
                            (h as ImportedHoliday).sourceId === uiState.selectedSourceId
                        ).map(h => (
                            <div
                                className={clsx(
                                    "btn btn-ghost w-full text-left text-xs cursor-pointer",
                                    (h.hasChange && "bg-purple-100 border-purple-500")
                                )}
                                onClick={() => calendarInterface.dispatch.calendarDispatch({ type: "SET_VIEW_DATE", payload: h.dates[0] })}
                                key={h.id}
                            >
                                <button
                                    className="text-xl mr-2"
                                    onClick={(e) => { e.stopPropagation(); calendarInterface.dispatch.calendarDispatch({ type: "TOGGLE_LOCK_HOLIDAY", id: h.id }); return false }}
                                >{h.keep ? `🔒` : `🔓`}</button>
                                <span className={h.isSchoolDay ? "font-bold" : "italic"}>{h.label}</span>
                            </div>
                        )) }
                    </div>
                }
            </div>
        </div>
    );
}
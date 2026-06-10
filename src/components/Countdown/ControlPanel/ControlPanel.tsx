import { ChangeEvent, useRef } from "react";
import { CalendarInterface } from "../Countdown.types";
import clsx from "clsx";
import { Holiday } from "@/features/Countdown";

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
            calendarInterface.dispatch.calendarDispatch({
                type: "UPDATE_HOLIDAY",
                payload: {
                    id: uiState.editHolidaySelection!,
                    label: uiState.pendingLabel,
                    isSchoolDay: uiState.isSchoolHoliday,
                    dates: uiState.selectedDates.sort(),
                    isShared: false
                }
            });
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
        if (!uiState.isShowIcsUrl) {
            calendarInterface.dispatch.uiDispatch({ type: "toggleIcsUrl" });
            requestAnimationFrame(() => icsUrlRef.current?.focus());
            return;
        }

        const icsDataRes = await fetch(`/api/countdown/fetchIcs?icsUrl=${uiState.icsUrl}`);
        const icsData = await icsDataRes.json() as {
            tzOffset: number;
            events: {
                label: string;
                start: number;
                end: number;
                uid: string;
            }[]
        };
        const { events, tzOffset } = icsData;
        const tzOffsetMs = (new Date().getTimezoneOffset() - tzOffset) * 60_000
        const schoolHolidays = events.filter(e => e.label.toLowerCase().includes("closed"))
            .map(e => ({ id: e.uid, label: e.label, dates: [ e.start+tzOffsetMs, e.end+tzOffsetMs ], isSchoolDay: true, isShared: false }));
        schoolHolidays.forEach(e => calendarInterface.dispatch.calendarDispatch({ type: "ADD_HOLIDAY", payload: e as Holiday }))
        calendarInterface.dispatch.uiDispatch({ type: "toggleIcsUrl" });
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
                            "pb-6.5",
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
                    { uiState.selectionIntent === "target" && <span className="flex-1">{calendarInterface.state.calendarState.targetDate ? `Modify` : `Set`} Countdown Target</span> }
                    { uiState.isShowIcsUrl && <>
                        <input
                            ref={icsUrlRef}
                            className="input mr-2"
                            value={uiState.icsUrl}
                            onChange={e => calendarInterface.dispatch.uiDispatch({ type: "onIcsUrlChange", payload: e.currentTarget.value })}
                        />

                        <button
                            onClick={() => calendarInterface.dispatch.uiDispatch({ type: "toggleIcsUrl" })}
                            className="absolute right-12 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-500"
                        >❌</button>
                    </> }
                    <button onClick={() => icsButton()} className="btn btn-icon">🌐</button>
                </div>
                <div className="">
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
            </div>
            <div className="panel flex flex-col flex-1">
                <div className="panel-title">Existing Holidays</div>
                {
                    calendarInterface.state.calendarState.holidays.filter(h =>
                        uiState.selectedDates.length && uiState.selectionIntent === "holiday" &&
                        h.dates.at(0)! <= uiState.selectedDates.at(-1)! &&
                        h.dates.at(-1)! >= uiState.selectedDates.at(0)!
                    ).map(h => (<button className="text-left list-row" onClick={() => handleHolidaySelection(h)} key={h.id}>{h.label}</button>))
                }
            </div>
        </div>
    );
}
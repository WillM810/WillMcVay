"use client";

import clsx from "clsx";

import { ChangeEvent } from "react";

import { CalendarCell, CalendarProps } from "./Calendar.types";

import styles from "./Calendar.module.css";
import { ImportedHoliday } from "@/features/Countdown/CalendarReducer.types";

export function Calendar({ calendarInterface, countdownArray }: CalendarProps) {
    const calendarState = calendarInterface.state.calendarState;
    const calendarDispatch = calendarInterface.dispatch.calendarDispatch;

    function getCalendarGrid(viewDate: number) {
        const base = new Date(viewDate);

        const [year, month] = [base.getFullYear(), base.getMonth()];

        const firstOfMonth = new Date(year, month, 1);
        const startDay = firstOfMonth.getDay();

        const gridStart = new Date(firstOfMonth);
        gridStart.setDate(firstOfMonth.getDate() - startDay);

        const cells: CalendarCell[] = [];

        for (let i = 0; i < 42; i++) {
            const d = new Date(gridStart);
            d.setDate(gridStart.getDate() + i);

            cells.push({
                date: d.getTime(),
                day: d.getDate(),
                inCurrentMonth: d.getMonth() === month
            });
        }

        return cells;
    }

    function setViewDate(e: ChangeEvent<HTMLInputElement>) {
        const value = e.currentTarget.value+"-01T00:00:00";
        calendarInterface.dispatch.calendarDispatch({ type: "SET_VIEW_DATE", payload: new Date(value).getTime() });
    }

    function populateViewDate() {
        return new Date(calendarState.viewDate).toISOString().match(/\d{4}-\d{2}/)?.[0];
    }

    function showMonthTransition(cell: CalendarCell, cellIdx: number, cells: CalendarCell[]) {
        return cell.inCurrentMonth || (cell.day > 1 && !cells[cellIdx + 1]?.inCurrentMonth) ?
            "" : new Date(cell.date).toLocaleDateString("en-us", { month: "short" })
    }

    function isInSelectedRange(date: number) {
        const range = calendarInterface.state.uiState.selectedDates.map(d => d ? new Date(d) : undefined);

        if (calendarInterface.state.uiState.selectionIntent === "target") return false;

        return (range[0] && range[0].getTime() <= date && range[1] && range[1].getTime() >= date) || (range[0] && range[0].getTime() === date);
    }

    function isSelectedTarget(date: number) {
        const range = calendarInterface.state.uiState.selectedDates.map(d => d ? new Date(d) : undefined);
        return range[0] && range[0].getTime() === date && calendarInterface.state.uiState.selectionIntent === "target";
    }

    function isToday(date: number) {
        return new Date(date).toLocaleDateString() === new Date().toLocaleDateString();
    }

    function adjMonth(dir: number) {
        const current = new Date(calendarState.viewDate);
        current.setMonth(current.getMonth() + dir)
        return current.toLocaleDateString("en-us", { month: "long" });
    }

    return (
        <div className={clsx("panel", styles.container)}>
            <div className={clsx(styles.header, "flex")}>
                <div className="flex justify-between items-center flex-1">
                    <button className="btn btn-icon text-2xl" onClick={() => calendarDispatch({ type: "STEP_VIEW_MONTH", payload: -12 })}>⏮️</button>
                    <span className="ml-4 mr-auto text-sm italic text-gray-400">{ new Date(calendarState.viewDate).getFullYear() - 1 }</span>
                    <span className="ml-auto mr-4 text-sm italic text-gray-400">{ adjMonth(-1) }</span>
                    <button className="btn btn-icon text-2xl" onClick={() => calendarDispatch({ type: "STEP_VIEW_MONTH", payload: -1 })}>◀️</button>
                </div>

                <div className={clsx("panel", styles.monthDisplay)}>
                    <button className="btn btn-ghost mr-4 border-gray-200" onClick={() => calendarDispatch({ type: "SET_VIEW_DATE", payload: Date.now() })}>🔄️ Today</button>
                    <input className="input w-min" type="month" value={populateViewDate()} onChange={setViewDate} />
                </div>

                <div className="flex justify-between items-center flex-1">
                    <button className="btn btn-icon text-2xl" onClick={() => calendarDispatch({ type: "STEP_VIEW_MONTH", payload: 1 })}>▶️</button>
                    <span className="ml-4 mr-auto text-sm italic text-gray-400">{ adjMonth(1) }</span>
                    <span className="ml-auto mr-4 text-sm italic text-gray-400">{ new Date(calendarState.viewDate).getFullYear() + 1 }</span>
                    <button className="btn btn-icon text-2xl" onClick={() => calendarDispatch({ type: "STEP_VIEW_MONTH", payload: 12 })}>⏭️</button>
                </div>
            </div>

            <div className={styles.weekdayHeader}>
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
            </div>

            <div className={styles.grid}>
                {getCalendarGrid(calendarState.viewDate).map((c, i, a) => (
                    <div
                        key={c.date}
                        className={
                            clsx(
                                styles.cell,
                                isSelectedTarget(c.date) ? "bg-green-100" :
                                isInSelectedRange(c.date) ? "bg-cyan-100" :
                                isToday(c.date) ? "bg-pink-100" :
                                c.date < Date.now() ? "bg-gray-50" :
                                "",
                            )
                        }
                        onClick={() => calendarInterface.dispatch.uiDispatch({ type: "onDateSelect", payload: c.date })}
                    >
                        { c.date === calendarState.targetDate && ( <img
                            src="./circle-c.png"
                            className={styles.targetRing}
                            alt=""
                        /> )}
                        <span className={styles.countdownNumber}>
                            {countdownArray.find(ct => ct.date === new Date(c.date).toLocaleDateString())?.days}
                        </span>
                        <span className={clsx(styles.dayNumber, !c.inCurrentMonth && styles.notThisMonth)}>
                            { c.day } { showMonthTransition(c, i, a) }
                        </span>

                        <div className={styles.cellContent}>
                            {
                                calendarState.holidays
                                    .filter(h =>
                                        (h.dates.length === 1 && h.dates[0] === c.date) ||
                                        (h.dates.length === 2 && [...h.dates, c.date].sort()[1] === c.date)
                                    )?.map(h => (
                                        <div
                                            className={clsx(!h.isSchoolDay ? "italic" : "font-bold")}
                                            key={`${(h as ImportedHoliday).sourceId ?? 'USER'}|${h.id}`}
                                        >
                                            {h.label}
                                        </div>
                                    ))
                            }
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
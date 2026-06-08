"use client";

import { useEffect, useState } from "react";

import { useCalendar, CountdownStorageProvider } from "@/features/Countdown";
import { getUserApi } from "@/features/Countdown/userApi";

import { CalendarList } from "./CalendarList";
import { Titlebar } from "./Titlebar";
import { Calendar } from "./Calendar";
import { ControlPanel } from "./ControlPanel";

import styles from "./Countdown.module.css";
import clsx from "clsx";

export function Countdown() {
    const userApi = getUserApi();

    const calendarInterface = useCalendar();
    const [ result, setResult ] = useState(-1);

    const calendarState = calendarInterface.state.calendarState;

    useEffect(() => {
        const persistedData = CountdownStorageProvider.load();
        if (persistedData) userApi.userDispatch({ type: "HYDRATE_USER", state: persistedData });
    }, []);

    useEffect(() => {
        CountdownStorageProvider.save(userApi.userState);
    }, [ userApi.userState ]);

    useEffect(() => {
        const currentCalendar = userApi.getActiveCalendar();
        if (!currentCalendar) return;

        calendarInterface.dispatch.uiDispatch({ type: "resetForm" });
        calendarInterface.dispatch.calendarDispatch({ type: "HYDRATE", payload: { ...currentCalendar, viewDate: Date.now() }});
    }, [ userApi.userState.activeCalendarId ]);

    useEffect(() => {
        setResult(countdown()[0].days);
        if (userApi.userState.activeCalendarId) userApi.userDispatch({ type: "SAVE_CALENDAR_UPDATE", calendar: calendarState })
    }, [ calendarState ]);

    function countdown() {
        const countdownArray = [];
        for (let countdownDays = 0, currentDayOffest = 0; calendarState.targetDate - ((currentDayOffest - 1) * 86400000) > Date.now(); currentDayOffest++) {
            const currentCheck = calendarState.targetDate - (currentDayOffest * 86400000);
            const currentDate = new Date(currentCheck);
            
            if (calendarState.countHolidays && calendarState.countWeekends) { // count every day, doesn't matter if it's a holiday
                countdownArray.unshift({ date: new Date(currentCheck).toLocaleDateString(), days: countdownDays++ }); continue;
            }
            
            if (calendarState.countHolidays && currentDate.getDay() !== 0 && currentDate.getDay() !== 6) { // count holidays, it isn't a weekend, doesn't matter if it's a holiday
                countdownArray.unshift({ date: new Date(currentCheck).toLocaleDateString(), days: countdownDays++ }); continue;
            }
            
            if (!calendarState.countWeekends && (currentDate.getDay() === 0 || currentDate.getDay() === 6)) { // don't count weekends, it is one, doesn't matter if it's a holiday
                countdownArray.unshift({ date: new Date(currentCheck).toLocaleDateString(), days: countdownDays }); continue;
            }
            
            if (
                !calendarState.countHolidays &&
                calendarState.holidays.find(h =>
                    h.isSchoolDay && 
                    ((h.dates.length === 1 && h.dates[0] === currentCheck) ||
                    (h.dates.length === 2 && [ ...h.dates, currentCheck ].sort()[1] === currentCheck))
                )
            ) { countdownArray.unshift({ date: new Date(currentCheck).toLocaleDateString(), days: countdownDays }); continue; }
            
            countdownArray.unshift({ date: new Date(currentCheck).toLocaleDateString(), days: countdownDays++ });
        }

        if (!countdownArray.length) countdownArray.unshift({ date: new Date(0).toLocaleDateString(), days: 0 });
        return countdownArray;
    }

    function confirmDeleteAll() {
        if (!confirm("EVERYTHING!?")) return;
        userApi.userDispatch({ type: "DELETE_ALL" });
    }

    return (
        <div className={styles.layout}>
            <div className={clsx("mb-2", styles.header)}>
                { userApi.userState.activeCalendarId === calendarState.id ?
                    <Titlebar title={calendarState.title} target={calendarState.targetDate} result={result} calendarInterface={calendarInterface} userApi={userApi} /> :
                    <div className={styles.header}>Countdown Calendars!</div>
                }
            </div>

            <div className={clsx("gap-2", styles.main)}>
                <div className={styles.calendar}>
                    { userApi.userState.activeCalendarId === calendarState.id ?
                        <Calendar calendarInterface={calendarInterface} countdownArray={countdown()} /> :
                        <CalendarList userApi={userApi} />
                    }
                </div>

                <div className={styles.sidebar}>
                    { userApi.userState.activeCalendarId === calendarState.id ?
                        <ControlPanel calendarInterface={calendarInterface} /> :
                        <div className="p-2 flex flex-col gap-2">
                            <button className="btn btn-primary" onClick={() => userApi.userDispatch({ type: "CREATE_CALENDAR" })}>Create New Calendar</button>
                            <button className="btn btn-danger" onClick={() => confirmDeleteAll()}>Delete EVERYTHING</button>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}
"use client";

import { useMemo, useReducer, useRef } from "react"
import { calendarReducer, defaultCalendarFactory } from "./CalendarReducer"
import { initialUiState, uiReducerFactory } from "./UiReducer";
import { CalendarInterface } from "@/components/Countdown/Countdown.types";

export function useCalendar() {
    const defaultCalendar = useMemo(() => defaultCalendarFactory(), []);
    const [ calendarState, calendarDispatch ] = useReducer(calendarReducer, defaultCalendar);

    const calendarStateRef = useRef(calendarState);
    calendarStateRef.current = calendarState;
    const uiReducer = useMemo(() => uiReducerFactory(calendarStateRef), []);

    const [ uiState, uiDispatch ] = useReducer(uiReducer, initialUiState);

    return {
        state: { calendarState, uiState },
        dispatch : { calendarDispatch, uiDispatch },
        isSchoolHolidayToggle: () => uiDispatch({ type: "isSchoolHolidayToggle" }),
    } as CalendarInterface;
}
"use client";

import { CalendarAction, CalendarState, NewCalendarDraft } from "./CalendarReducer.types";

export const defaultCalendarFactory = () => ({
    id: crypto.randomUUID(),
    title: "Pfartz",
    viewDate: Date.now(),
    targetDate: undefined,
    holidays: [],
    countWeekends: false,
    countHolidays: false,
}) as NewCalendarDraft;

export function calendarReducer(
    state: CalendarState,
    action: CalendarAction
): CalendarState {
    switch (action.type) {
        case "HYDRATE": {
            return action.payload;
        }
        case "SET_VIEW_DATE": {
            return { ...state, viewDate: action.payload };
        }
        case "STEP_VIEW_MONTH": {
            const d = new Date(state.viewDate);
            d.setMonth(d.getMonth() + action.payload);
            return { ...state, viewDate: d.getTime() };
        }
        case "SET_TARGET_DATE": {
            return { ...state, targetDate: action.payload };
        }
        case "SET_TARGET": {
            return { ...state, title: action.label.trim() || state.title, targetDate: action.date };
        }
        case "ADD_HOLIDAY": {
            return { ...state, holidays: [ ...state.holidays, action.payload ] };
        }
        case "REMOVE_HOLIDAY": {
            return { ...state, holidays: state.holidays.filter(h => h.id !== action.payload) }
        }
        case "UPDATE_HOLIDAY": {
            return { ...state, holidays: state.holidays.map(h => h.id === action.payload.id ? action.payload : h)}
        }
        case "TOGGLE_WEEKENDS": {
            return { ...state, countWeekends: !state.countWeekends };
        }
        case "TOGGLE_HOLIDAYS": {
            return { ...state, countHolidays: !state.countHolidays };
        }
        default: {
            return state;
        }
    }
}
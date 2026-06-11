"use client";

import { CalendarAction, CalendarState, ImportedHoliday, NewCalendarDraft } from "./CalendarReducer.types";

export const defaultCalendarFactory = () => ({
    id: crypto.randomUUID(),
    title: "Pfartz",
    viewDate: Date.now(),
    targetDate: undefined,
    holidays: [],
    countWeekends: false,
    countHolidays: false,
    importedSources: [],
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
            return { ...state, holidays: state.holidays.filter(h => h.id !== action.payload) };
        }
        case "UPDATE_HOLIDAY": {
            return { ...state, holidays: state.holidays.map(h => h.id === action.payload.id ? action.payload : h) };
        }
        case "TOGGLE_LOCK_HOLIDAY": {
            return { ...state, holidays: state.holidays.map(h => h.id === action.id ? { ...h, keep: !(h as ImportedHoliday).keep } : h) };
        }
        case "TOGGLE_WEEKENDS": {
            return { ...state, countWeekends: !state.countWeekends };
        }
        case "TOGGLE_HOLIDAYS": {
            return { ...state, countHolidays: !state.countHolidays };
        }
        case "UPDATE_SOURCE": {
            return {
                ...state,
                importedSources: [
                    ...state.importedSources?.filter(s => s.id !== action.payload.id),
                    action.payload,
                ].sort((a, b) => a.importedAt - b.importedAt)
            };
        }
        case "REMOVE_SOURCE": {
            const holidays = state.holidays.filter(h => (h as ImportedHoliday).sourceId !== action.id || (h as ImportedHoliday).keep)
                .map(h => (h as ImportedHoliday).sourceId === action.id && (h as ImportedHoliday).keep ? { ...h, sourceId: "USER" } : h);

            return {
                ...state,
                holidays,
                importedSources: state.importedSources.filter(s => s.id !== action.id)
            };
        }
        default: {
            return state;
        }
    }
}
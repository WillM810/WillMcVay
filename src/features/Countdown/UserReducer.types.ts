import { CalendarState } from "./CalendarReducer.types";

export type UserState = {
    version: number;
    activeCalendarId: string;
    calendars: CalendarState[];
}

export type UserAction =
    | { type: "CREATE_CALENDAR" }
    | { type: "DELETE_CALENDAR", id: string }
    | { type: "SET_ACTIVE_CALENDAR", id: string }
    | { type: "CLEAR_ACTIVE_CALENDAR" }
    | { type: "HYDRATE_USER", state: UserState }
    | { type: "SAVE_CALENDAR_UPDATE", calendar: CalendarState }
    | { type: "DELETE_ALL" };
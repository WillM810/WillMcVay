import { defaultCalendarFactory } from "./CalendarReducer";
import { CountdownStorageProvider } from "./CountdownStorageProvider";
import { UserAction, UserState } from "./UserReducer.types";

export const defaultUserState: UserState = {
    version: 1,
    activeCalendarId: "",
    calendars: [],
}

export function userReducer(
    state: UserState,
    action: UserAction
): UserState {
    switch (action.type) {
        case "HYDRATE_USER": {
            return action.state;
        }
        case "CREATE_CALENDAR": {
            const newCalendar = defaultCalendarFactory()
            return {
                ...state,
                activeCalendarId: newCalendar.id,
                calendars: [...state.calendars, newCalendar].sort((a, b) => a.targetDate - b.targetDate)
            };
        }
        case "SET_ACTIVE_CALENDAR": {
            return {
                ...state,
                activeCalendarId: action.id
            };
        }
        case "CLEAR_ACTIVE_CALENDAR": {
            return {
                ...state,
                activeCalendarId: ""
            };
        }
        case "SAVE_CALENDAR_UPDATE": {
            const calendars = [ ...state.calendars.filter(c => c.id !== action.calendar.id), action.calendar ].sort((a, b) => a.targetDate - b.targetDate)
            return {
                ...state,
                calendars
            };
        }
        case "DELETE_CALENDAR": {
            const activeCalendarId = state.activeCalendarId === action.id ? "" : state.activeCalendarId;
            return {
                ...state,
                activeCalendarId,
                calendars: state.calendars.filter(c => c.id !== action.id).sort((a, b) => a.targetDate - b.targetDate)
            };
        }
        case "DELETE_ALL": {
            if (!confirm("EVERYTHING!?")) return state;
            CountdownStorageProvider.clear();
            return { ...defaultUserState }
        }
        default: {
            return state;
        }
    }
}
import { ActionDispatch, useReducer } from "react";
import { UserAction, UserState } from "./UserReducer.types"
import { defaultUserState, userReducer } from "./UserReducer";
import { CalendarState } from "./CalendarReducer.types";

export type UserAPI = {
    userState: UserState;
    userDispatch: ActionDispatch<[action: UserAction]>;
    getActiveCalendar: () => CalendarState | undefined;
}

export function getUserApi(initialUserState: UserState = defaultUserState): UserAPI {
    const [ userState, userDispatch ] = useReducer(userReducer, initialUserState);
    return {
        userState, userDispatch,
        getActiveCalendar() {
            return userState.calendars.find(c => c.id === userState.activeCalendarId);
        },
    };
}
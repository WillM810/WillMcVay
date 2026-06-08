import { CalendarAction, CalendarActionUI, CalendarState, CalendarStateUI } from "@/features/Countdown"
import { ActionDispatch } from "react";

export type CalendarInterface = {
    state: {
        calendarState: CalendarState;
        uiState: CalendarStateUI;
    };

    dispatch: {
        calendarDispatch: ActionDispatch<[action:CalendarAction]>;
        uiDispatch: ActionDispatch<[action:CalendarActionUI]>;
    };

    isSchoolHolidayToggle: () => void;
};
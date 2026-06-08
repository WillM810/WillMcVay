export type Holiday = {
    id: string;
    label: string;
    dates: number[];
    isSchoolDay: boolean;
    isShared: boolean;
}

export type CalendarState = {
    id: string;
    title: string;

    targetDate: number;
    viewDate: number;

    holidays: Holiday[];

    countWeekends: boolean;
    countHolidays: boolean;
}

export type CalendarAction = 
    | { type: "SET_VIEW_DATE", payload: number }
    | { type: "STEP_VIEW_MONTH", payload: number }

    | { type: "SET_TARGET_DATE", payload: number }
    | { type: "SET_TARGET", date: number, label: string }

    | { type: "ADD_HOLIDAY", payload: Holiday }
    | { type: "REMOVE_HOLIDAY", payload: string }
    | { type: "UPDATE_HOLIDAY", payload: Holiday }
    
    | { type: "TOGGLE_WEEKENDS" }
    | { type: "TOGGLE_HOLIDAYS" }
    
    | { type: "HYDRATE", payload: CalendarState };
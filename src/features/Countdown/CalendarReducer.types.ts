export type Holiday = {
    id: string;
    label: string;
    dates: number[];
    isSchoolDay: boolean;
    isShared: boolean;
}

export type ImportedHoliday = Holiday & {
    sourceId: string;
    keep: boolean;
    hasChange: boolean;
    hasConflictingChange: boolean;
};

export type ICSImportSource = {
    id: string;
    name: string;
    url: string;
    importedAt: number;
    importSummary: {
        added: number;
        ignored: number;
        retained: number;
        updated: number;
        overwritten: number;
        conflictsPending: number;
    };
    conflictsPending: [ ImportedHoliday, ImportedHoliday ][];
}

export type CalendarState = {
    id: string;
    title: string;

    targetDate: number;
    viewDate: number;

    holidays: (Holiday | ImportedHoliday)[];

    countWeekends: boolean;
    countHolidays: boolean;

    importedSources: ICSImportSource[];
}

export type NewCalendarDraft =
    & Omit<CalendarState, "targetDate">
    & Partial<Pick<CalendarState, "targetDate">>;

export type CalendarAction = 
    | { type: "SET_VIEW_DATE", payload: number }
    | { type: "STEP_VIEW_MONTH", payload: number }

    | { type: "SET_TARGET_DATE", payload: number }
    | { type: "SET_TARGET", date: number, label: string }

    | { type: "ADD_HOLIDAY", payload: Holiday }
    | { type: "REMOVE_HOLIDAY", payload: string }
    | { type: "UPDATE_HOLIDAY", payload: Holiday }
    | { type: "TOGGLE_LOCK_HOLIDAY", id: string }
    
    | { type: "TOGGLE_WEEKENDS" }
    | { type: "TOGGLE_HOLIDAYS" }
    
    | { type: "HYDRATE", payload: CalendarState }

    | { type: "UPDATE_SOURCE", payload: ICSImportSource }
    | { type: "REMOVE_SOURCE", id: string };
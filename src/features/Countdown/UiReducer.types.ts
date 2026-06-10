export type CalendarStateUI = {
    selectionIntent: "holiday" | "target";
    pendingLabel: string;
    lastPendingLabel: string;
    selectedDates: number[];
    isSchoolHoliday: boolean;
    editHolidaySelection: string | null;
    isEditActive: boolean;
    isEditDatesDirty: boolean;
    isShowIcsUrl: boolean;
    icsUrl: string;
};

export type CalendarActionUI =
    | { type: "onPendingLabelChange", payload: string }
    | { type: "onDateSelect", payload: number }
    | { type: "onDateAdjust", payload: [ number, number ], commit: boolean }
    | { type: "isSchoolHolidayToggle" }
    | { type: "showHoliday", payload: string }
    | { type: "toggleEdit" }
    | { type: "toggleIcsUrl" }
    | { type: "onIcsUrlChange", payload: string }
    | { type: "resetForm" }
    | { type: "setTargetMode", payload: boolean };
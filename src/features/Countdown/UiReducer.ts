import { RefObject } from "react";
import type { CalendarActionUI, CalendarStateUI } from "./UiReducer.types";
import { CalendarState } from "./CalendarReducer.types";

export const initialUiState: CalendarStateUI = {
    selectionIntent: "holiday",
    pendingLabel: "",
    lastPendingLabel: "",
    selectedDates: [],
    isSchoolHoliday: true,
    editHolidaySelection: null,
    isEditActive: false,
    isEditDatesDirty: false,
    isShowIcsUrl: false,
    icsUrl: "",
};

export function uiReducerFactory(calendarStateRef: RefObject<CalendarState>) {
    return (
        state: CalendarStateUI,
        action: CalendarActionUI
    ): CalendarStateUI => {
        switch (action.type) {
            case "onDateSelect": {
                const isEditDatesDirty = true;
                const editHolidaySelection = state.isEditActive ? state.editHolidaySelection : "";
                const selectionIntent: typeof state["selectionIntent"] =
                    state.selectedDates.length === 1 && !state.isEditActive && state.selectedDates[0] === action.payload && state.selectionIntent === "holiday" ?
                        "target" : "holiday";

                const lastPendingLabel = selectionIntent === "target" ? state.pendingLabel : state.lastPendingLabel;
                const pendingLabel = selectionIntent === "target" ? calendarStateRef.current.title :
                    state.selectionIntent === "target" || state.editHolidaySelection !== editHolidaySelection ? state.lastPendingLabel :
                        state.pendingLabel;

                const nextStateBase = {
                    ...state,
                    selectionIntent,
                    editHolidaySelection,
                    pendingLabel,
                    lastPendingLabel,
                    isEditDatesDirty,
                };

                if (!state.selectedDates.length || state.selectedDates.length === 2) {
                    return { ...nextStateBase, selectedDates: [ action.payload ] };
                }

                const onlySelectedDate = state.selectedDates[0];
                if (onlySelectedDate === action.payload) {
                    if (state.selectionIntent === "target") {
                        return { ...nextStateBase, selectedDates: [] };
                    }

                    if (state.isEditActive) {
                        const originalHoliday = calendarStateRef.current.holidays.find(h => h.id === state.editHolidaySelection)!;
                        return {
                            ...nextStateBase,
                            selectedDates: [ ...originalHoliday.dates ],
                            isEditDatesDirty: onlySelectedDate === originalHoliday.dates[0]
                        };
                    }

                    return nextStateBase;
                }

                if (!state.isEditDatesDirty && state.isEditActive ) return {
                    ...nextStateBase,
                    selectedDates: [ action.payload ]
                };

                return { ...nextStateBase, selectedDates: [ action.payload, state.selectedDates[0] ].sort() };
            }
            case "onDateAdjust": {
                const [index, newDate] = action.payload;
                if (!state.selectedDates.length) return { ...state, selectedDates: [newDate] };

                const selectedDates = index ?
                    (state.selectedDates[0] < newDate ? [state.selectedDates[0], newDate] : [newDate, state.selectedDates[0]]) :
                    (state.selectedDates[1] > newDate ? [newDate, state.selectedDates[1]] : [state.selectedDates[1], newDate]);
                if (selectedDates[0] === selectedDates[1]) selectedDates.pop();

                return { ...state, selectedDates };
            }
            case "showHoliday": {
                if (!action.payload) return { ...state, pendingLabel: state.lastPendingLabel, isSchoolHoliday: true, editHolidaySelection: "" };

                const holiday = calendarStateRef.current.holidays.find(h => h.id === action.payload)!;
                return {
                    ...state,
                    pendingLabel: holiday.label,
                    selectedDates: [...holiday.dates],
                    isSchoolHoliday: holiday.isSchoolDay,
                    editHolidaySelection: action.payload,
                    lastPendingLabel: state.pendingLabel
                };
            }
            case "toggleEdit": {
                if (!state.isEditActive) return { ...state, isEditActive: true };

                const originalHoliday = calendarStateRef.current.holidays.find(h => h.id === state.editHolidaySelection)!;
                return {
                    ...state,
                    pendingLabel: originalHoliday.label,
                    isSchoolHoliday: originalHoliday.isSchoolDay,
                    selectedDates: [...originalHoliday.dates],
                    isEditActive: false,
                    isEditDatesDirty: false,
                };
            }
            case "onPendingLabelChange": {
                return { ...state, pendingLabel: action.payload };
            }
            case "isSchoolHolidayToggle": {
                return { ...state, isSchoolHoliday: !state.isSchoolHoliday };
            }
            case "toggleIcsUrl": {
                return { ...state, isShowIcsUrl: !state.isShowIcsUrl };
            }
            case "onIcsUrlChange": {
                return { ...state, icsUrl: action.payload };
            }
            case "resetForm": {
                return { ...initialUiState };
            }
            default: {
                return state;
            }
        }
    }
}
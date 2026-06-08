import { CalendarAction, CalendarState } from "@/features/Countdown/CalendarReducer.types"
import { ActionDispatch } from "react";
import { CalendarInterface } from "../Countdown.types";

export type CalendarProps = {
    calendarInterface: CalendarInterface;
    countdownArray: { date: string, days: number }[];
};

export type CalendarCell = {
    date: number;
    day: number;
    inCurrentMonth: boolean;
}
import { CalendarInterface } from "../Countdown.types";
import { UserAPI } from "@/features/Countdown/userApi";

export type TitlebarProps = {
    title: string;
    target: number;
    result: number;
    calendarInterface: CalendarInterface;
    userApi: UserAPI;
};
import { CalendarState } from "@/features/Countdown";
import { UserAPI } from "@/features/Countdown/userApi";
import { useEffect, useState } from "react";

type CalendarListProps = {
    userApi: UserAPI;
    today: string;
    countdownHook: (s: CalendarState) => { date: string, days: number }[]
}

export function CalendarList({ userApi, today, countdownHook }: CalendarListProps) {
    const [countdowns, setCountdowns] = useState([] as number[]);

    useEffect(() => {
        setCountdowns(userApi.userState.calendars.map(c => countdownHook(c)[0].days));
    }, [ today, userApi ]);

    return (<div className="flex flex-col p-2 gap-1">
        { userApi.userState.calendars.map((c, i) => (
            <div key={c.id} className="flex items-center border rounded-2xl p-2">
                <div
                    className="flex-1 flex"
                ><span className="flex-1 ml-5">{c.title} - {new Date(c.targetDate).toLocaleDateString()}</span><span className="ml-auto mr-10 italic">{countdowns[i]} days</span></div>
                <div className="flex flex-col gap-1">
                    <button className="btn btn-icon-danger ml-auto" onClick={() => userApi.userDispatch({ type: "SET_ACTIVE_CALENDAR", id: c.id })}>🖋️</button>
                    <button className="btn btn-icon-danger ml-auto" onClick={() => userApi.userDispatch({ type: "DELETE_CALENDAR", id: c.id })}>✖️</button>
                </div>
            </div>
        )) }
        { userApi.userState.calendars.length === 0 && <span className="italic ml-10 mt-4">Create a <strong>New Countdown</strong> to get started!</span>}
    </div>);
}
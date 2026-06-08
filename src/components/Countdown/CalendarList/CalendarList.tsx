import { UserAPI } from "@/features/Countdown/userApi";

type CalendarListProps = {
    userApi: UserAPI;
}

export function CalendarList({ userApi }: CalendarListProps) {
    return (<div className="flex flex-col p-2 gap-1">
        { userApi.userState.calendars.map(c => (
            <div key={c.id} className="flex">
                <button
                    className="btn btn-ghost flex-1 text-left"
                    onClick={() => userApi.userDispatch({ type: "SET_ACTIVE_CALENDAR", id: c.id })}
                >{c.title} - {new Date(c.targetDate).toLocaleDateString()}</button>
                <button className="btn btn-icon-danger ml-auto" onClick={() => userApi.userDispatch({ type: "DELETE_CALENDAR", id: c.id })}>X</button>
            </div>
        )) }
    </div>);
}
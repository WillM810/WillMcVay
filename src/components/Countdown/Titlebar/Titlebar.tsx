import { TitlebarProps } from "./Titlebar.types";

export function Titlebar({ title, target, result, calendarInterface, userApi }: TitlebarProps) {
    return (
        <header className="flex items-center w-full">
            <button className="btn-icon" onClick={() => userApi.userDispatch({ type: "CLEAR_ACTIVE_CALENDAR" })}>{'<'}</button>
            <div className="flex-1 text-2xl font-bold ml-2">
                {title}
            </div>
            <div className="flex-1 text-2xl font-bold text-center">
                ({new Date(target).toLocaleDateString()})
            </div>
            { result >= 0 ? <div className="mr-10 text-xl font-bold">{result} days remaining</div> : <></>}
            <div className="ml-auto flex flex-col items-start">
                <label className="flex items-center gap-2 label">
                    <input
                        type="checkbox"
                        checked={calendarInterface.state.calendarState.countWeekends}
                        onChange={() =>
                            calendarInterface.dispatch.calendarDispatch({ type: "TOGGLE_WEEKENDS" })
                        }
                    />
                    Count Weekends
                </label>

                <label className="flex items-center gap-2 label">
                    <input
                        type="checkbox"
                        checked={calendarInterface.state.calendarState.countHolidays}
                        onChange={() =>
                            calendarInterface.dispatch.calendarDispatch({ type: "TOGGLE_HOLIDAYS" })
                        }
                    />
                    Count Holidays
                </label>
            </div>
        </header>
    );
}
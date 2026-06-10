import { TitlebarProps } from "./Titlebar.types";

export function Titlebar({ title, target, result, calendarInterface, userApi }: TitlebarProps) {
    return (
        <header className="flex items-center w-full">
            <button className="btn-icon" onClick={() => calendarInterface.dispatch.uiDispatch({ type: "setTargetMode", payload: true })}>🖋️</button>
            <div className="text-2xl font-bold ml-2">
                {title}
            </div>
            <div className="flex-1 text-2xl font-bold ml-4">
                ({ typeof(target) !== "undefined" ? new Date(target).toLocaleDateString() : `Select a Target` })
            </div>
            { typeof(target) !== "undefined" && <div className="mr-10 text-xl font-bold">{result} days remaining</div> }
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
            <button className="btn btn-ghost ml-10" onClick={() => userApi.userDispatch({ type: "CLEAR_ACTIVE_CALENDAR" })}>
                <span><span className="text-2xl">🔙</span> to Countdown List</span>
            </button>
        </header>
    );
}
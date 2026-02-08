import { SetStateAction } from "react";

type LockCheckBoxProps = {
    value: boolean[];
    setValue: (value: SetStateAction<boolean[]>) => void;
    isDisabled: boolean;
    toggleIdx: number;
}

export default function LockCheckBox(props: LockCheckBoxProps) {
    const { value, setValue, isDisabled, toggleIdx } = props;
    return (
        <label className="cursor-pointer text-center">
            <input
                checked={value[toggleIdx / 2]}
                onChange={() => setValue(p => p.map((v, id) => id === toggleIdx / 2 ? !v : v))}
                disabled={isDisabled}
                type="checkbox"
                className="peer sr-only focus-visible:outline-none"
            />
            <svg className="h-6 w-6 hidden peer-checked:block text-white mx-auto" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 14V16M8.11972 5.02477C8.55509 3.28699 10.1272 2 12 2C14.2091 2 16 3.79086 16 6V9M7 21H17C18.1046 21 19 20.1046 19 19V11C19 9.89543 18.1046 9 17 9H7C5.89543 9 5 9.89543 5 11V19C5 20.1046 5.89543 21 7 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <svg className="h-6 w-6 block peer-checked:hidden mx-auto" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 14C13 13.4477 12.5523 13 12 13C11.4477 13 11 13.4477 11 14V16C11 16.5523 11.4477 17 12 17C12.5523 17 13 16.5523 13 16V14Z" fill="currentColor"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M7 8.12037C5.3161 8.53217 4 9.95979 4 11.7692V17.3077C4 19.973 6.31545 22 9 22H15C17.6846 22 20 19.973 20 17.3077V11.7692C20 9.95979 18.6839 8.53217 17 8.12037V7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7V8.12037ZM15 7V8H9V7C9 6.64936 9.06015 6.31278 9.17071 6C9.58254 4.83481 10.6938 4 12 4C13.3062 4 14.4175 4.83481 14.8293 6C14.9398 6.31278 15 6.64936 15 7ZM6 11.7692C6 10.866 6.81856 10 8 10H16C17.1814 10 18 10.866 18 11.7692V17.3077C18 18.7208 16.7337 20 15 20H9C7.26627 20 6 18.7208 6 17.3077V11.7692Z" fill="currentColor"/>
            </svg>
        </label>
    );
}
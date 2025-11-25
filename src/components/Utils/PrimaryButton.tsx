type PrimaryButtonProps = {
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
};

export default function PrimaryButton(props: PrimaryButtonProps) {
    return (
        <button
            onClick={props.onClick}
            disabled={props.disabled}
            className="
        px-4
        py-2
        bg-blue-600
        text-white
        rounded-lg
        shadow-md
        hover:bg-blue-700
        focus:outline-none
        focus:ring-2
        focus:ring-blue-400
        focus:ring-opacity-75
        disabled:bg-gray-300
        disabled:cursor-not-allowed
        disabled:text-gray-600
        transition-colors
      "
        >
            {!props.disabled ? props.children : "..."}
        </button>
    );
}

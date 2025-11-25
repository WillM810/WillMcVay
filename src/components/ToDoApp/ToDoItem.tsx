import { ToDo } from "./ToDoApp";
import type { Dispatch, SetStateAction } from "react";

type ToDoItemProps = {
    todo: ToDo;
    setTodos: Dispatch<SetStateAction<ToDo[]>>;
};

export default function ToDoItem({ todo, setTodos }: ToDoItemProps) {
    return (
        <li key={todo.id}>
            <input
                type="checkbox"
                checked={todo.done}
                onChange={() =>
                    setTodos((curr) =>
                        curr.map((i) =>
                            i.id === todo.id ? { ...i, done: !i.done } : i,
                        ),
                    )
                }
            />{" "}
            <span className={todo.done ? "line-through text-green-500" : ""}>
                {todo.text}
            </span>{" "}
            <button
                onClick={() => {
                    setTodos((current) =>
                        current.filter((v, i) => v.id !== todo.id),
                    );
                }}
            >
                X
            </button>
        </li>
    );
}

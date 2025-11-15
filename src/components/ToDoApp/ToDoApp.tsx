"use client";

import { useState } from "react";
import ToDoItem from "./ToDoItem";

export type ToDo = {
  done: boolean;
  text: string;
  id: number;
};

export default function ToDoApp() {
  const [todos, setTodos] = useState([] as ToDo[]);
  const [newTodo, setNewTodo] = useState("");

  const onNewTodoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  };

  const handleSubmit = () => {
    setTodos([...todos, { done: false, text: newTodo, id: todos.length }]);
  };

  return (
    <div className="p-10">
      <h1>ToDo App</h1>
      <div>
        <input type="text" placeholder="New ToDo" id="new-todo-input" onChange={e => onNewTodoChange(e)} value={newTodo} />
        <button onClick={handleSubmit}>Add ToDo</button>
        <ul>
          {todos.map((todo, index) => (
            <ToDoItem key={todo.id} todo={todo} setTodos={setTodos} />
          ))}
        </ul>
      </div>
    </div>
  );
}
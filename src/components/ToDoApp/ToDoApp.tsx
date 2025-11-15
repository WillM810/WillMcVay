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
      <h1 className="font-bold text-2xl mb-2">To Do List</h1>
      <div>
        <input
          type="text"
          className="w-3xl mr-4 border-b border-gray-300 focus:border-blue-500 focus:outline-none py-2"
          placeholder="New To Do"
          id="new-todo-input"
          onChange={e => onNewTodoChange(e)}
          value={newTodo}
        />
        <button
          onClick={handleSubmit}
          className="
            px-4
            py-2
            bg-blue-600
            text-white
            font-bold
            text-3xl
            rounded-lg
            shadow-md
            hover:bg-blue-700
            focus:outline-none
            focus:ring-2
            focus:ring-blue-400
            focus:ring-opacity-75
            transition-colors
          "
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
        </button>
        <ul>
          {todos.map((todo, index) => (
            <ToDoItem key={todo.id} todo={todo} setTodos={setTodos} />
          ))}
        </ul>
      </div>
    </div>
  );
}
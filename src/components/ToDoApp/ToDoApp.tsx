"use client";

import { useState } from "react";
import ToDoItem from "./ToDoItem";
import TextInput from "../Utils/TextInput";
import PrimaryButton from "../Utils/PrimaryButton";

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
      <div className="flex justify-between items-center mb-6">
        <TextInput
          id="new-todo-input"
          placeholder="New To Do"
          value={newTodo}
          onChange={(e) => onNewTodoChange(e)}
        />
        <PrimaryButton
          onClick={handleSubmit}
          disabled={newTodo.trim().length === 0}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
        </PrimaryButton>
      </div>
      <ul>
        {todos.map((todo, index) => (
          <ToDoItem key={todo.id} todo={todo} setTodos={setTodos} />
        ))}
      </ul>
    </div>
  );
}
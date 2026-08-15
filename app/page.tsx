"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Circle, Minus, Plus, X } from "lucide-react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

type Filter = "all" | "active" | "completed";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("todos");
    if (saved) {
      try {
        setTodos(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse todos from localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos, isMounted]);

  const addTodo = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const newTodo: Todo = {
      id: Date.now(),
      text: trimmed,
      completed: false,
    };
    setTodos([newTodo, ...todos]);
    setInput("");
    inputRef.current?.focus();
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((t) => !t.completed));
  };

  const filtered = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  const itemClassName = (completed: boolean) =>
    `group flex items-center gap-3 p-4 rounded-xl border transition-all ${
      completed
        ? "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md"
    }`;

  const textClassName = (completed: boolean) =>
    `flex-1 text-left transition ${
      completed
        ? "line-through text-slate-500 dark:text-slate-400"
        : "text-slate-800 dark:text-slate-200"
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Todo
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Stay focused, stay organized</p>
        </header>

        <form onSubmit={(e) => { e.preventDefault(); addTodo(); }} className="flex gap-3 mb-6">
          <input
            ref={inputRef}
            type="text"
            placeholder="What needs to be done?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Plus className="w-5 h-5" />
          </button>
        </form>

        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            {(["all", "active", "completed"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition ${
                  filter === f
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          {todos.length > 0 && completedCount > 0 && (
            <button
              onClick={clearCompleted}
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-red-500 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear {completedCount}
            </button>
          )}
        </div>

        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              {filter === "all" && "No tasks yet. Add one above!"}
              {filter === "active" && "No active tasks."}
              {filter === "completed" && "No completed tasks."}
            </div>
          ) : (
            filtered.map((todo) => (
              <div key={todo.id} className={itemClassName(todo.completed)}>
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className="flex-shrink-0 text-blue-500 hover:text-blue-700"
                >
                  {todo.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                </button>
                <span className={textClassName(todo.completed)}>{todo.text}</span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {todos.length > 0 && (
          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400 text-center">
            {activeCount} active, {completedCount} completed
          </p>
        )}
      </div>
    </div>
  );
}

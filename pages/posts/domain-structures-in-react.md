---
title: Domain Structures In React
date: 2025/08/09
description: How I organize my React applications in 2025.
tag: web development, personal, react, javascript
author: Me
---

# Building a React App with Domain Structures: A Todo App Example

I've seen FAR too many `./components` folders in React apps that just scroll.... and scroll... as well as redundant (or sometimes non-existant) api layers, service layers, all of it. It's mad frustrating. 

I want to discuss a strategy/pattern I use with all of my apps to formalize these problems in React apps. This pattern has helped me IMMENSLY when working on larger codebases or transferring to new ones. A lot of this was inspired by [BlitzJS](https://blitzjs.com/docs/file-structure). PLEASE read their documentation on file structures as well; it is very good.

Before worrying about tooling, **structuring your app around domains** can save you a bunch of time later. It can also make transferring to a codebase easier for you and others. Instead of digging through a huge directory, just look for the domain you are working on and start working. 

In this post, I'm going to walk through setting up a **domain-driven structure** for a simple Todo app.

I'll cover:

- Why domain-based folders are better than feature dumping grounds
- What goes into a domains folder
- Using **barrel files** to simplify imports and clean up exports


## 1. What is a Domain Structure?

Instead of structuring your app purely by "type" (e.g., `components/`, `hooks/`, `services/`), you group everything by **business domain**.

For a Todo app, domains could be:

```
src
├── todos
├── auth
├── users        // users is separate from auth; auth is JUST auth logic
├── core         // will cover this in another post but things such as a 'useViewport' hook, 'DashboardShell' component, for example
├── lib         // Things such as a wrapped httpClient if using something like axios. Axios being a lib that we WRAP to abstract from our codebase
└── integrations // things such as initializing a firebase instance
```

Each domain contains *everything* related to that part of the app; mutations, queries, components, utils, and more.


## 2. Starting with a `todos` Domain

Let’s create the `todos` domain with this structure:
```
src
└── todos
  ├── mutations
  │   ├── addTodo.ts
  │   ├── deleteTodo.ts
  │   ├── toggleTodo.ts
  │   └── index.ts        // barrel file
  ├── queries
  │   ├── getTodos.ts
  │   ├── getTodoById.ts
  │   └── index.ts        // barrel file
  ├── hooks
  │   ├── useTodos.tsx
  │   ├── useTodo.tsx
  │   └── index.ts        // barrel file
  ├── components
  │   ├── index.ts
  │   ├── TodoList.tsx
  │   └── TodoItem.tsx
  ├── utils
  │   ├── formatTodoDate.ts
  │   └── index.ts
  ├── types.ts
  └── index.ts        // Domains export file
```
The purpose of the top level `index.ts` is to act as the gatekeeper for the domain. Sometimes you have utils you DONT want to export, use the `index.ts` to control what directories get exported.


## 3. Mutations: Changing Data in the Domain

In our `mutations/` directory, each file will contain a function that modifies data for that domain. Normally *POST*, *PUT*, *PATCH*, or *DELETE* methods but if you aren't using HTTP, it could be any action that changes state.

**Example: `addTodo.ts`**

```ts
import { Todo } from "../types";

export async function addTodo(title: string): Promise<Todo | null> {
  try {
    const response = await fetch("http://localhost:3000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, completed: false })
    });

    if (!response.ok) {
      throw new Error("Failed to add todo");
    }

    const newTodo: Todo = await response.json();
    return newTodo;
  } catch (error) {
    console.error("Error adding todo:", error);
    return null;
  }
}
```

One thing to notice this import is relative to the domain (since it's inside our todos domain). In our main code we would use an alias like `@/todos`


### Barrel File for Mutations

A **barrel file** (`index.ts`) re-exports everything so we can import them easily:

```ts
// src/todos/mutations/index.ts
export * from "./addTodo";
export * from "./deleteTodo";
export * from "./toggleTodo";
```

Now in any part of the app:

```ts
import { addTodo, toggleTodo } from "@/todos";
```

## 4. Queries: Fetching Data in the Domain

Queries handle *reading* data for the domain. Normally *GET* methods but the same principle applies as mentioned above.

**Example: `getTodos.ts`**

```ts
import { Todo } from "../types";

export async function getTodos(): Promise<Todo[]> {
  try {
    const response = await fetch("http://localhost:3000/todos");
    if (!response.ok) {
      throw new Error("Failed to fetch todos");
    }
    const todos: Todo[] = await response.json();
    return todos;
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
}
```


### Barrel File for Queries

```ts
// src/todos/queries/index.ts
export * from "./getTodos";
export * from "./getTodoById";
```


## 5. Why do this?

Using a domain structure in your React app has several benefits.

Starting with domains:

- Makes scaling easier (scaling in this sense I mean adding new features or changing a feature)
- Reduces spaghetti imports
- Improves testability
- Helps new developers find related code quickly
- Encourages separation of concerns
- Simplifies refactoring
- Facilitates moving to a monorepo in the future
  - When you *do* move to a monorepo, each domain can become its own package with minimal refactoring.

- Allows for simpler testing/mocking
  - imagine the case where you need to mock the fetch client. Now you can just mock that mutation and test your components without worrying about the actual implementation


## 6. Putting It All Together

**Example usage inside `App.tsx`:**

```tsx
import React, { useState } from "react";
import { addTodo, getTodos } from "@/todos";
import type { Todo } from "@/todos";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const handleAdd = async () => {
    try {
      const newTodo = await addTodo("Learn domain structures");
      if (newTodo) {
        setTodos(prev => [...prev, newTodo]);
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  return (
    <div>
      <button onClick={handleAdd}>Add Todo</button>
      <ul>
        {getTodos(todos).map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}
```


**Final Thoughts:**  

Doing this will make your life a LOT easier. It is easy to implement and really makes writing the code straightforward. Need to add a new todo feature like adding an update todo?

Great, simply make a mutation, component, and export. It's that easy. I really like using this pattern to organize my code. In my next post I will talk about using 'standardized' components like a dashboard shell or something that doesn't fit into a domain. 


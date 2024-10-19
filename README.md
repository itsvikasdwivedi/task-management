# Task Management App

This is a Task Management App built using **Next.js**. The app allows users to manage their tasks with features like adding, editing, deleting, completing tasks, and searching through tasks. It also uses **Server-Side Rendering (SSR)** for initial task loading and **local storage** for persisting tasks between sessions.

# Version Used

- Next.js: 14.2.15

# Technologies Used
- Next.js
- React (with Hooks)
- CSS Modules
- Local Storage API

## Features and Functions

- **Add New Task**:
   - **Function**: `addTask`
   - Implements adding a new task with a title, description, and priority (high, medium, low).
   
- **Edit Task**:
   - **Function**: `saveEdit`
   - Implements editing of an existing task's title, description, and priority.
   
- **Delete Task**:
   - **Function**: `deleteTask`
   - Implements deleting a task from the list.
   
- **Mark Task as Completed**:
   - **Function**: `toggleComplete`
   - Implements toggling a task’s completed/pending status.
   
- **Search Tasks**:
   - **Function**: `handleSearch`
   - Implements searching through tasks by title or description.

- **Sort Tasks by Priority and Completion**:
   - **Function**: Inline sorting logic in `filteredAndSortedTasks`
   - Implements dynamic sorting of tasks by priority (high, medium, low) and placing completed tasks at the bottom.

## Server-Side Rendering (SSR) and Local Storage Management

- **SSR (Server-Side Rendering)**:
   - The app uses **getServerSideProps** to load the initial task list from an array during the server-side rendering phase. This ensures that tasks are available on the first page load, even before JavaScript runs in the browser.

- **Local Storage**:
   - After the initial SSR data is loaded, tasks are stored and managed in **local storage** on the client side. When users add, edit, or delete tasks, these changes are saved to local storage, so the task list persists between page reloads.

   - The app checks for tasks in local storage on every page load. If tasks exist, it loads them; otherwise, it defaults to the SSR-provided tasks.

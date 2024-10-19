import { useState, useEffect, useMemo } from 'react';
import { initialTasks, generateId } from '../data/tasks';
import styles from '../styles/Home.module.css';

export default function Home({ initialTasksProp }) {
  // State declarations
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' });
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Effect for initial data loading
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks));
      } catch (error) {
        console.error('Failed to parse tasks from localStorage:', error);
      }
    } else {
      setTasks(initialTasksProp);
    }
    setIsLoading(false);
  }, [initialTasksProp]);

  // Effect for saving tasks to local storage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks, isLoading]);

  // Function to add a new task
  const addTask = () => {
    if (newTask.title.trim() === '') {
      alert('Task title cannot be empty');
      return;
    }
    setTasks(prevTasks => [
      ...prevTasks,
      { ...newTask, id: generateId(), completed: false }
    ]);
    setNewTask({ title: '', description: '', priority: 'medium' });
  };

  // Function to delete a task
  const deleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    }
  };

  // Function to toggle a task's completed status
  const toggleComplete = (id) => {
    setTasks(prevTasks => prevTasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Function to start editing a task
  const startEditing = (task) => {
    if (task.completed) {
      alert("You can't edit a completed task");
      return;
    }
    setEditingTask({ ...task });
  };

  // Function to save changes to an edited task
  const saveEdit = () => {
    setTasks(prevTasks => prevTasks.map(task =>
      task.id === editingTask.id ? editingTask : task
    ));
    setEditingTask(null);
  };

  // Function to cancel editing without saving changes
  const cancelEdit = () => {
    setEditingTask(null);
  };

  // Function to handle changes in the search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Memoize filtered and sorted tasks
  const filteredAndSortedTasks = useMemo(() => {
    return tasks
      .filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
  }, [tasks, searchTerm]);

  // Show loading state while initial data is being fetched
  if (isLoading) {
    return <div classname={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Task Management App</h1>

      {/* Form to add new tasks */}
      <div className={styles.addTask}>
        <input
          type="text"
          placeholder="Task title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Task description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <select
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* Search input */}
      <div className={styles.search}>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Task list */}
      <ul className={styles.taskList}>
        {filteredAndSortedTasks.map(task => (
          <li key={task.id} className={`${styles.task} ${styles[task.priority]} ${task.completed ? styles.completed : ''}`}>
            {editingTask && editingTask.id === task.id ? (
              // Editing mode
              <div className={styles.editTask}>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                />
                <input
                  type="text"
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                />
                <select
                  value={editingTask.priority}
                  onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <button onClick={saveEdit}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </div>
            ) : (
              // Display mode
              <>
                <div className={styles.taskContent}>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <span className={styles.priority}>{task.priority}</span>
                </div>
                <div className={styles.taskActions}>
                  <button onClick={() => toggleComplete(task.id)} aria-label={task.completed ? 'Undo task' : 'Complete task'}>
                    {task.completed ? 'Undo' : 'Complete'}
                  </button>
                  <button onClick={() => startEditing(task)}>Edit</button>
                  <button onClick={() => deleteTask(task.id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Server-side rendering function
export async function getServerSideProps() {
  return {
    props: {
      initialTasksProp: initialTasks,
    },
  };
}

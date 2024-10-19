let currentId = 0;

export const generateId = () => {
  return currentId++;
};

export const initialTasks = [
    { id: 1, title: 'Complete project proposal', description: 'Write and submit the project proposal by Friday', priority: 'high', completed: false },
    { id: 2, title: 'Buy groceries', description: 'Get milk, eggs, and bread', priority: 'medium', completed: false },
    { id: 3, title: 'Go for a run', description: '30-minute jog in the park', priority: 'low', completed: false },
  ];
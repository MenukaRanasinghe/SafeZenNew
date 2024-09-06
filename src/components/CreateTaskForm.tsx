import React, { useState, useEffect } from 'react';

interface CreateTaskFormProps {
  onSubmit: (task: Task) => void;
  initialTask: Task;
}

interface Task {
  id: number;
  name: string;
  description: string;
  deadline: string;
  status: string;
}

export default function CreateTaskForm({ onSubmit, initialTask }: CreateTaskFormProps) {
  const [task, setTask] = useState<Task>(initialTask);

  useEffect(() => {
    setTask(initialTask);
  }, [initialTask]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTask(prevTask => ({ ...prevTask, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(task);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block">Task Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={task.name}
          onChange={handleChange}
          className="border rounded p-2 w-full"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block">Description:</label>
        <input
          type="text"
          id="description"
          name="description"
          value={task.description}
          onChange={handleChange}
          className="border rounded p-2 w-full"
          required
        />
      </div>
      <div>
        <label htmlFor="deadline" className="block">Deadline:</label>
        <input
          type="date"
          id="deadline"
          name="deadline"
          value={task.deadline}
          onChange={handleChange}
          className="border rounded p-2 w-full"
          required
        />
      </div>
      <div>
        <label htmlFor="status" className="block">Status:</label>
        <select
          id="status"
          name="status"
          value={task.status}
          onChange={handleChange}
          className="border rounded p-2 w-full"
        >
          <option value="Not Assigned">Not Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
    </form>
  );
}

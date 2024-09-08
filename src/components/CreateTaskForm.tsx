import React, { useState } from 'react';

interface CreateTaskFormProps {
  onSubmit: (task: { name: string; description: string; deadline: string; status: string }) => void;
  initialTask: { name: string; description: string; deadline: string; status: string };
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ onSubmit, initialTask }) => {
  const [name, setName] = useState(initialTask.name);
  const [description, setDescription] = useState(initialTask.description);
  const [deadline, setDeadline] = useState(initialTask.deadline);
  const [status, setStatus] = useState(initialTask.status);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      onSubmit({ name, description, deadline, status });
      setSuccess('Task created successfully');
      setError('');
      setName('');
      setDescription('');
      setDeadline('');
      setStatus('Not Assigned');
    } catch (error) {
      setError('Error creating task');
      setSuccess('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border px-2 py-1 rounded w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="border px-2 py-1 rounded w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Deadline</label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
          className="border px-2 py-1 rounded w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        >
          <option value="Not Assigned">Not Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Save Task
      </button>
      {success && <p className="text-green-500">{success}</p>}
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default CreateTaskForm;

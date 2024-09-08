import { useState, useEffect } from 'react';
import { Task } from '@/types';

type CreateTaskFormProps = {
    onSubmit: (task: Task) => void;
    task?: Task;
};

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ onSubmit, task }) => {
    const [name, setName] = useState(task?.name || '');
    const [description, setDescription] = useState(task?.description || '');
    const [deadline, setDeadline] = useState(task?.deadline || '');
    const [status, setStatus] = useState(task?.status || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !description || !deadline || !status) return;
        onSubmit({ id: task?.id || 0, name, description, deadline, status });
    };

    useEffect(() => {
        if (task) {
            setName(task.name);
            setDescription(task.description);
            setDeadline(task.deadline);
            setStatus(task.status);
        }
    }, [task]);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Task Name"
                className="border px-4 py-2 w-full"
            />
            <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Description"
                className="border px-4 py-2 w-full"
            />
            <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                placeholder="Deadline"
                className="border px-4 py-2 w-full"
            />
            <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="border px-4 py-2 w-full"
            >
                <option value="Not Assigned">Not Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
            </select>
            <button type="submit" className="px-4 py-2 bg-[#3742fa] text-white rounded">
                {task ? 'Update Task' : 'Create Task'}
            </button>
        </form>
    );
};

export default CreateTaskForm;

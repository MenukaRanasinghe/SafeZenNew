'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import CreateTaskForm from '@/components/CreateTaskForm';
import { Task } from '@/types';

export default function LeaderTasksPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showAssignDropdown, setShowAssignDropdown] = useState<number | null>(null);
    const [currentTask, setCurrentTask] = useState<Task | null>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<number | null>(null);

    useEffect(() => {
        async function fetchTasks() {
            try {
                const res = await fetch('/api/tasks');
                if (!res.ok) throw new Error('Failed to fetch tasks');
                const data = await res.json();
                setTasks(data.tasks || []);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            } finally {
                setLoading(false);
            }
        }

        async function fetchUsers() {
            try {
                const res = await fetch('/api/users');
                if (!res.ok) throw new Error('Failed to fetch users');
                const data = await res.json();
                setUsers(data.users || []);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }

        fetchTasks();
        fetchUsers();
    }, []);

    useEffect(() => {
        if (status === 'loading') return;
        if (!session) {
            router.push('/auth/signin');
        } else if (session.user.role !== 'Leader') {
            router.push('/');
        }
    }, [session, status, router]);

    const handleCreateTask = async (task: Task) => {
        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task),
            });

            if (!res.ok) {
                const error = await res.text();
                throw new Error(`Failed to create task: ${error}`);
            }

            const data = await res.json();
            setTasks(prevTasks => [...prevTasks, data.task]);
        } catch (error) {
            console.error('Error creating task:', error);
        } finally {
            setShowCreateForm(false);
        }
    };

    const handleEditTask = async (task: Task) => {
        try {
            const res = await fetch(`/api/tasks?id=${task.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task),
            });
            if (!res.ok) throw new Error('Failed to update task');
            const data = await res.json();
            setTasks(prevTasks =>
                prevTasks.map(t => t.id === task.id ? data.task : t)
            );
        } catch (error) {
            console.error('Error updating task:', error);
        } finally {
            setShowEditForm(false);
            setCurrentTask(null);
        }
    };

    const handleDeleteTask = async (id: number) => {
        try {
            const res = await fetch(`/api/tasks?id=${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete task');
            setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleAssignTask = async () => {
        if (currentTask && selectedUser) {
            try {
                const res = await fetch('/api/assign-task', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        taskId: currentTask.id,
                        userId: selectedUser,
                    }),
                });
                if (!res.ok) {
                    const error = await res.text();
                    throw new Error(`Failed to assign task: ${error}`);
                }
                const data = await res.json();
                setTasks(prevTasks =>
                    prevTasks.map(task =>
                        task.id === currentTask.id ? { ...task, status: 'In Progress' } : task
                    )
                );
                setShowAssignDropdown(null);
                setSelectedUser(null);
            } catch (error) {
                console.error('Error assigning task:', error);
            }
        }
    };

    const openAssignDropdown = (task: Task) => {
        setCurrentTask(task);
        setShowAssignDropdown(task.id);
    };

    if (status === 'loading' || loading) {
        return <div>Loading...</div>;
    }

    return (
        <DashboardLayout>
            <div className="p-6 space-y-4">
                <h1 className="text-2xl font-semibold">Leader Dashboard</h1><br />

                <button
                    onClick={() => setShowCreateForm(true)}
                    className="px-4 py-2 bg-[#3742fa] text-white rounded"
                >
                    Create Task
                </button>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm border-x-gray-400">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">ID</th>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Description</th>
                                <th className="px-4 py-2">Deadline</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.length ? (
                                tasks.map(task => (
                                    <tr key={task.id}>
                                        <td className="border px-4 py-2">{task.id}</td>
                                        <td className="border px-4 py-2">{task.name}</td>
                                        <td className="border px-4 py-2">{task.description}</td>
                                        <td className="border px-4 py-2">{task.deadline}</td>
                                        <td className="border px-4 py-2">{task.status}</td>
                                        <td className="border px-4 py-2">
                                            <button
                                                onClick={() => openEditForm(task)}
                                                className="text-blue-500 ml-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTask(task.id)}
                                                className="text-red-500 ml-4"
                                            >
                                                Delete
                                            </button>
                                            {task.status === 'Not Assigned' ? (
                                                <div className="relative inline-block">
                                                    <button
                                                        onClick={() => openAssignDropdown(task)}
                                                        className="text-green-500 ml-4"
                                                    >
                                                        Assign
                                                    </button>
                                                    {showAssignDropdown === task.id && (
                                                        <div className="absolute bg-white border rounded shadow-lg mt-2">
                                                            <select
                                                                onChange={(e) => setSelectedUser(Number(e.target.value))}
                                                                className="block w-full p-2 border rounded"
                                                            >
                                                                <option value="">Select User</option>
                                                                {users.map(user => (
                                                                    <option key={user.id} value={user.id}>
                                                                        {user.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <button
                                                                onClick={handleAssignTask}
                                                                className="px-4 py-2 bg-[#3742fa] text-white rounded mt-2"
                                                            >
                                                                Assign
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : null}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center px-4 py-2">No tasks available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {showCreateForm && <CreateTaskForm onSubmit={handleCreateTask} />}
                {showEditForm && currentTask && (
                    <CreateTaskForm task={currentTask} onSubmit={handleEditTask} />
                )}
            </div>
        </DashboardLayout>
    );
}

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
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

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

    fetchTasks();
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
      if (!res.ok) throw new Error('Failed to create task');
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
      setTasks(prevTasks =>
        prevTasks.map(t => t.id === task.id ? task : t)
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

  const openEditForm = (task: Task) => {
    setCurrentTask(task);
    setShowEditForm(true);
  };

  if (status === 'loading' || loading) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Leader Dashboard</h1><br></br>

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
                        className="text-blue-500 hover:underline mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="border px-4 py-2 text-center">No tasks found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showCreateForm && (
          <CreateTaskForm
            onSubmit={handleCreateTask}
            initialTask={{ id: 0, name: '', description: '', deadline: '', status: 'Not Assigned' }}
          />
        )}

        {showEditForm && currentTask && (
          <CreateTaskForm
            onSubmit={handleEditTask}
            initialTask={currentTask}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

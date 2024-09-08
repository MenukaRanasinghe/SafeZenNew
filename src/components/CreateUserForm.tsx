import React, { useState } from 'react';
import axios from 'axios';

const CreateUserForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Member');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/register', { email, password, role });
      setSuccess(response.data.message);
      setError('');
      setEmail('');
      setRole('Member');
      setPassword('');
    } catch (error) {
      setError('Error creating user');
      setSuccess('');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border px-2 py-1 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border px-2 py-1 rounded w-full"
          >
            <option value="Admin">Admin</option>
            <option value="Leader">Leader</option>
            <option value="Member">Member</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border px-2 py-1 rounded w-full"
          />
        </div>
        <button type="submit" className="bg-[#3742fa] text-white px-4 py-2 rounded">
          Create User
        </button>
      </form>
      {success && <p className="text-green-500">{success}</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default CreateUserForm;

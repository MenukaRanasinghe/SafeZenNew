import React, { useState } from 'react';

interface CreateUserFormProps {
  onSubmit: (email: string, role: string) => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Member');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, role);
  };

  return (
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
      <button type="submit" className="bg-[#3742fa] text-white px-4 py-2 rounded">
        Create User
      </button>
    </form>
  );
};

export default CreateUserForm;

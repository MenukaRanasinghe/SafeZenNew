import React, { ReactNode } from 'react';

interface ModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
  initialTask: any;
  children: ReactNode;
}

export default function Modal({ onClose, onSave, initialTask, children }: ModalProps) {
  const handleSave = () => {
    if (typeof onSave === 'function') {
      onSave(initialTask);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-lg max-w-sm w-full">
        <div className="mb-4">
          {children}
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-black rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

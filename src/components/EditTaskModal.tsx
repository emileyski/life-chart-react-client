import React, { useState, useEffect } from 'react';

interface EditTaskModalProps {
  open: boolean;
  onClose: () => void;
  task: {
    id: string;
    title: string;
    priority: 'low' | 'medium' | 'high' | 'highest';
    score: number;
    isCompleted: boolean;
    isPositive: boolean;
  } | null;
  onSubmit: (updatedTask: {
    id: string;
    title: string;
    priority: string;
    score: number;
    isCompleted: boolean;
    isPositive: boolean;
  }) => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  open,
  onClose,
  task,
  onSubmit,
}) => {
  const [updatedTask, setUpdatedTask] = useState(task);

  useEffect(() => {
    setUpdatedTask(task); // Синхронизируем данные при изменении task
  }, [task]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedTask((prev) => ({
      ...prev,
      [name]: name === 'score' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (updatedTask) {
      onSubmit(updatedTask);
    }
  };

  if (!open || !updatedTask) return null; // Если модалка не открыта, ничего не рендерим

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[400px]">
        <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={updatedTask.title}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              name="priority"
              value={updatedTask.priority}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="highest">Highest</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Score
            </label>
            <input
              type="number"
              name="score"
              value={updatedTask.score}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Completed
            </label>
            <input
              type="checkbox"
              name="isCompleted"
              checked={updatedTask.isCompleted}
              onChange={(e) =>
                handleInputChange({
                  target: { name: 'isCompleted', value: e.target.checked },
                } as any)
              }
              className="mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Positive
            </label>
            <input
              type="checkbox"
              name="isPositive"
              checked={updatedTask.isPositive}
              onChange={(e) =>
                handleInputChange({
                  target: { name: 'isPositive', value: e.target.checked },
                } as any)
              }
              className="mt-1"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;

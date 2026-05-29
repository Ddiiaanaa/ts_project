import React, { useState, useEffect } from 'react';
import { type Task } from '../../types/Task';

interface TaskFormProps {
  initialData?: Task | null; 
  onClose: () => void;
  onSave: (task: Task) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ initialData, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [hasReminder, setHasReminder] = useState(true);
  const [reminderDays, setReminderDays] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setDueDate(initialData.dueDate);
      setPriority(initialData.priority);
      setHasReminder(initialData.hasReminder);
    }
  }, [initialData]);

const handleSave = () => {
    if (!title.trim()) return alert('Введіть назву завдання');
    
    const task: Task = {
      id: initialData ? initialData.id : Date.now().toString(),
      title,
      description,
      status: initialData ? initialData.status : 'Todo',
      priority,
      dueDate,
      hasReminder,
      reminderDays, 
      createdAt: initialData?.createdAt || new Date().toLocaleDateString('uk-UA'), // Зберігаємо дату створення
    };
    onSave(task);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center z-50">
      <div className="bg-[#e4f0f5] p-8 w-[600px] shadow-lg relative">
        <h2 className="text-center text-[#82aec1] text-xl font-medium mb-6">
          {initialData ? 'Редагування завдання' : 'Створення завдання'}
        </h2>
        
        <div className="flex gap-8">
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Назва завдання:</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-white w-48 px-2 py-1 outline-none" />
            </div>
            <div className="flex items-start justify-between">
              <label className="text-sm text-gray-700">Опис:</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="bg-white w-48 h-20 px-2 py-1 outline-none resize-none"></textarea>
            </div>
            <div className="flex items-center justify-between mt-2">
              <label className="text-sm text-gray-700">Пріоритетність:</label>
              <div className="flex-1 flex gap-3">
                {['High', 'Medium', 'Low'].map(level => (
                  <button key={level} onClick={() => setPriority(level as any)}
                    className={`bg-white px-2 py-1 text-sm text-gray-700 shadow-sm ${priority === level ? 'ring-2 ring-[#6b9db1]' : ''}`}>
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Виконати до:</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-32 px-2 py-1 outline-none text-xs" />
            </div>
            <div className="flex items-center justify-between mt-7">
              <label className="text-gray-800 text-sm w-1/2">Ввімкнути нагадування?:</label>
              <div className="flex-1 flex gap-4">
                <button onClick={() => setHasReminder(true)} className={`bg-white px-4 py-1 text-sm text-gray-700 shadow-sm ${hasReminder ? 'ring-2 ring-[#6b9db1]' : ''}`}>Так</button>
                <button onClick={() => setHasReminder(false)} className={`bg-white px-5 py-1 text-sm text-gray-700 shadow-sm ${!hasReminder ? 'ring-2 ring-[#6b9db1]' : ''}`}>Ні</button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <button onClick={handleSave} className="bg-[#6b9db1] text-white px-6 py-2 shadow hover:bg-[#58899c]">Зберегти</button>
          <button onClick={onClose} className="bg-gray-300 text-gray-700 px-6 py-2 shadow hover:bg-gray-400">Скасувати</button>
        </div>
      </div>
    </div>
  );
};
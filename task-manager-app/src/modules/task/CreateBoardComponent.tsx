import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoards } from '../shared/hooks/useBoards';

export const CreateBoardComponent: React.FC = () => {
  const navigate = useNavigate();
  const { addBoard } = useBoards();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  
  const [hue, setHue] = useState(210);
  const [lightness, setLightness] = useState(50);
  const [dueDate, setDueDate] = useState('');
  const [hasReminder, setHasReminder] = useState(true);
  const [reminderDays, setReminderDays] = useState('');

  const finalColor = `hsl(${hue}, 100%, ${lightness}%)`;

  const handleSave = () => {
    if (!title.trim()) {
      alert('Будь ласка, введіть назву дошки');
      return;
    }

    const newBoard = {
      id: Date.now().toString(),
      title,
      description,
      priority,
      color: finalColor, 
      dueDate,
      hasReminder,
      reminderDays,
      createdAt: new Date().toLocaleDateString('uk-UA'),
    };

    addBoard(newBoard);
    navigate('/boards');
  };

  return (
    <div className="flex justify-center items-center py-12 px-4">
      <div className="bg-[#e4f0f5] w-full max-w-4xl shadow-md border border-gray-200">
        
        <div className="bg-[#e5e7eb] py-4 text-center">
          <h2 className="text-[#6b9db1] text-xl font-medium">Створення дошки</h2> 
        </div>

        <div className="p-10 grid grid-cols-2 gap-12">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <label className="text-gray-800 text-sm font-medium w-1/3">Назва дошки:</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                className="bg-white flex-1 px-3 py-1.5 outline-none border border-transparent focus:border-[#6b9db1]" />
            </div>
            
            <div className="flex items-start justify-between">
              <label className="text-gray-800 text-sm font-medium w-1/3 mt-1">Опис:</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                className="bg-white flex-1 h-20 px-3 py-1.5 outline-none resize-none border border-transparent focus:border-[#6b9db1]"></textarea>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-gray-800 text-sm font-medium w-1/3">Пріоритетність:</label>
              <div className="flex-1 flex gap-3">
                {['Low', 'Medium', 'High'].map(level => (
                  <button key={level} onClick={() => setPriority(level)}
                    className={`bg-white px-4 py-1 text-sm text-gray-700 shadow-sm ${priority === level ? 'ring-2 ring-[#6b9db1]' : ''}`}>
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-start justify-between mt-2">
              <label className="text-gray-800 text-sm font-medium w-1/3 mt-1">Колір дошки:</label>
              <div className="flex-1 flex items-center gap-4">
                
                <div className="flex flex-col gap-3 flex-1">
                  <input type="range" min="0" max="360" value={hue} onChange={(e) => setHue(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none outline-none cursor-pointer"
                    style={{ background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)' }} />
                  
                  <input type="range" min="0" max="100" value={lightness} onChange={(e) => setLightness(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none outline-none cursor-pointer border border-gray-300"
                    style={{ background: `linear-gradient(to right, #000, hsl(${hue}, 100%, 50%), #fff)` }} />
                </div>

                <div 
                  className="w-10 h-10 rounded shadow-sm border border-gray-300 flex-shrink-0"
                  style={{ backgroundColor: finalColor }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between">
              <label className="text-gray-800 text-sm font-medium w-1/3 mt-1">Виконати до:</label>
              <div className="flex-1 bg-white p-2">
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                  className="w-full outline-none text-gray-700 cursor-pointer" />
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <label className="text-gray-800 text-sm font-medium w-1/3">Ввімкнути<br/>нагадування?:</label>
              <div className="flex-1 flex gap-3">
                <button onClick={() => setHasReminder(true)}
                  className={`bg-white px-6 py-1 text-sm text-gray-700 shadow-sm ${hasReminder ? 'ring-2 ring-[#6b9db1]' : ''}`}>Так</button>
                <button onClick={() => setHasReminder(false)}
                  className={`bg-white px-6 py-1 text-sm text-gray-700 shadow-sm ${!hasReminder ? 'ring-2 ring-[#6b9db1]' : ''}`}>Ні</button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <label className={`text-sm font-medium w-1/3 ${hasReminder ? 'text-gray-800' : 'text-gray-400'}`}>Частота<br/>нагадування:</label>
              <div className={`flex-1 flex items-center gap-2 ${hasReminder ? 'text-gray-700' : 'text-gray-400'}`}>
                <span>Кожні</span>
                <input type="number" min="1" disabled={!hasReminder} value={reminderDays} onChange={(e) => setReminderDays(e.target.value)}
                  className="w-12 h-8 px-2 outline-none text-center bg-white disabled:bg-transparent disabled:border disabled:border-gray-300" />
                <span>дні</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pb-8 flex justify-center mt-4">
          <button onClick={handleSave} className="bg-[#6b9db1] text-white px-10 py-2 shadow-md hover:bg-[#58899c] transition-colors">
            Зберегти
          </button>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTaskManager } from '../shared/hooks/useTaskManager';
import { useBoards } from '../shared/hooks/useBoards';
import { type Task } from '../../types/Task';
import { Settings2, Search } from 'lucide-react';
import { TaskForm } from './TaskForm';

const TaskCard: React.FC<{ task: Task, onDelete: (id: string) => void, onEdit: (task: Task) => void, onMove: (id: string, status: string) => void }> = ({ task, onDelete, onEdit, onMove }) => {
  const [showMenu, setShowMenu] = useState(false);
  const getDynamicStyle = () => {
    let r, g, b;
    if (task.status === 'Todo') { r = 248; g = 113; b = 113; }
    else if (task.status === 'InProgress') { r = 250; g = 204; b = 21; }
    else { r = 74; g = 222; b = 128; }
    let a = 0.6;
    if (task.priority === 'Low') a = 0.3;
    else if (task.priority === 'High') a = 0.9;
    return { backgroundColor: `rgba(${r}, ${g}, ${b}, ${a})` };
  };

  return (
    <div draggable onDragStart={(e) => e.dataTransfer.setData('taskId', task.id)} onContextMenu={(e) => { e.preventDefault(); setShowMenu(true); }} onMouseLeave={() => setShowMenu(false)} style={getDynamicStyle()} className="p-4 mb-3 shadow-sm cursor-grab active:cursor-grabbing relative border border-gray-300/30">
      <h4 className="text-gray-800 text-sm font-medium mb-1 drop-shadow-sm">{task.title}</h4>
      {task.description && <p className="text-gray-700 text-xs mb-2 italic line-clamp-3 leading-snug opacity-90">{task.description}</p>}
      {task.status !== 'Done' && <p className="text-gray-800 text-xs mb-1 font-medium drop-shadow-sm">пріоритет {task.priority.toLowerCase()}</p>}
      <p className="text-gray-700 text-xs drop-shadow-sm">{task.dueDate}</p>
      {showMenu && (
        <div className="absolute top-1/2 left-2/3 w-36 bg-white py-1 text-xs shadow-xl border border-gray-200 z-50 rounded">
          <div className="relative group/submenu">
            <p className="hover:bg-gray-100 p-2 cursor-pointer flex justify-between">Перемістити в... <span>▶</span></p>
            <div className="hidden group-hover/submenu:block absolute left-full top-0 w-32 bg-white border shadow-lg rounded">
              {task.status !== 'Todo' && <p onClick={() => { onMove(task.id, 'Todo'); setShowMenu(false); }} className="p-2 hover:bg-gray-100 cursor-pointer">До виконання</p>}
              {task.status !== 'InProgress' && <p onClick={() => { onMove(task.id, 'InProgress'); setShowMenu(false); }} className="p-2 hover:bg-gray-100 cursor-pointer">В процесі</p>}
              {task.status !== 'Done' && <p onClick={() => { onMove(task.id, 'Done'); setShowMenu(false); }} className="p-2 hover:bg-gray-100 cursor-pointer">Виконано</p>}
            </div>
          </div>
          <p onClick={() => { onEdit(task); setShowMenu(false); }} className="hover:bg-gray-100 p-2 cursor-pointer">Редагувати</p>
          <p onClick={() => { onDelete(task.id); setShowMenu(false); }} className="hover:bg-red-50 text-red-600 p-2 cursor-pointer font-medium">Видалити</p>
        </div>
      )}
    </div>
  );
};

export const BoardComponent: React.FC<{ defaultBoardId?: string, defaultTitle?: string }> = ({ defaultBoardId, defaultTitle }) => {
  const { id } = useParams(); 
  const boardId = id || defaultBoardId || 'default';
  
  const { tasks, addTask, updateTask, updateTaskStatus, deleteTask } = useTaskManager(boardId);
  const { boards } = useBoards();
  const boardTitle = defaultTitle || boards.find(b => b.id === id)?.title || 'Назва дошки';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) updateTaskStatus(taskId, newStatus);
  };

  const renderColumn = (title: string, status: string) => {
    const priorityWeight: Record<string, number> = { 'High': 3, 'Medium': 2, 'Low': 1 };
    
    const columnTasks = tasks
      .filter(t => t.status === status)
      .filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter(t => priorityFilter === 'All' || t.priority === priorityFilter)
      .sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);

    return (
      <div className="flex-1 px-4" onDragOver={e => e.preventDefault()} onDrop={(e) => handleDrop(e, status)}>
        <h3 className="text-center text-gray-700 font-medium mb-4">{title}</h3>
        <div className="bg-[#e4f0f5] p-4 min-h-[400px] shadow-inner rounded border border-gray-200">
          {columnTasks.map(task => (
            <TaskCard key={task.id} task={task} onDelete={deleteTask} onEdit={(t) => { setEditingTask(t); setIsModalOpen(true); }} onMove={updateTaskStatus} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto mt-6">
      <div className="flex flex-col md:flex-row justify-between items-center px-4 mb-8 gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg text-gray-800 font-medium">{boardTitle}</h2>
          <Settings2 className="w-5 h-5 text-gray-600 cursor-pointer" />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" placeholder="Пошук завдань..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 border border-gray-300 rounded outline-none focus:ring-2 ring-[#6b9db1] text-sm w-40" 
            />
          </div>
          <select 
            value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
            className="border border-gray-300 px-3 py-1.5 rounded outline-none focus:ring-2 ring-[#6b9db1] text-sm cursor-pointer"
          >
            <option value="All">Всі</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <button onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
            className="bg-[#6b9db1] text-white px-5 py-1.5 text-sm shadow hover:bg-[#58899c] transition-colors rounded">
            Додати завдання
          </button>
        </div>
      </div>
      
      <div className="flex justify-between gap-4">
        {renderColumn('До виконання', 'Todo')}
        {renderColumn('В процесі', 'InProgress')}
        {renderColumn('Виконано', 'Done')}
      </div>

      {isModalOpen && (
        <TaskForm initialData={editingTask} onClose={() => setIsModalOpen(false)} onSave={(task) => { if (editingTask) updateTask(task); else addTask(task); }} />
      )}
    </div>
  );
};
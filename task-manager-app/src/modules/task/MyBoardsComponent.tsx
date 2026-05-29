import React, { useState } from 'react';
import { useBoards } from '../shared/hooks/useBoards';
import { Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyBoardsComponent: React.FC = () => {
  const { boards } = useBoards();
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const filteredBoards = boards.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'All' || b.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="p-10 max-w-6xl mx-auto mt-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b pb-4 gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">Мої дошки</h2>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" placeholder="Знайти дошку..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 ring-[#6b9db1] text-sm" 
            />
          </div>
          <select 
            value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg outline-none focus:ring-2 ring-[#6b9db1] text-sm cursor-pointer"
          >
            <option value="All">Всі пріоритети</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <Link to="/create-board" className="aspect-square border-2 border-dashed border-[#78a8bc] rounded-xl flex flex-col items-center justify-center text-[#78a8bc] hover:bg-[#f0f6f8] transition-colors cursor-pointer">
          <Plus className="w-12 h-12 mb-2" />
          <span className="font-medium">Нова дошка</span>
        </Link>

        {filteredBoards.map((board) => (
          <Link 
            to={`/boards/${board.id}`} key={board.id} 
            className="aspect-square rounded-xl shadow-md flex flex-col justify-between p-5 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden text-white"
            style={{ backgroundColor: board.color }} 
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none"></div>
            <div className="relative z-10 drop-shadow-md">
              <h3 className="text-xl font-bold truncate mb-1">{board.title}</h3>
              <p className="text-sm line-clamp-2">{board.description}</p>
            </div>
            <div className="relative z-10 flex justify-between items-end text-xs font-medium drop-shadow-md">
              <span className="bg-black/30 backdrop-blur-sm px-2 py-1 rounded">Пріоритет: {board.priority}</span>
              <span>{board.createdAt}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
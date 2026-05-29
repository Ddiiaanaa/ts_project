import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../shared/hooks/useAuth';
import { useBoards } from '../shared/hooks/useBoards';

export const ProfileComponent: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { boards } = useBoards();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="bg-white border border-gray-200 shadow-md p-8 flex flex-col md:flex-row gap-8 items-start">
        
        <div className="w-32 h-32 bg-[#6b9db1] rounded-full flex justify-center items-center text-white text-5xl font-bold shadow-inner">
          {currentUser.name.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 w-full">
          <div className="flex justify-between items-start mb-6 border-b pb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-1">{currentUser.name}</h2>
              <p className="text-gray-500">{currentUser.email}</p>
            </div>
            <button onClick={handleLogout} className="border-2 border-red-400 text-red-500 hover:bg-red-50 font-medium px-4 py-1 transition-colors">
              Вийти з акаунту
            </button>
          </div>

          <div className="flex flex-col gap-4 text-gray-700">
            <p><strong>Про себе:</strong> {currentUser.bio}</p>
            <p><strong>Дата реєстрації:</strong> {currentUser.registeredAt}</p>
            
            <div className="mt-4 bg-[#e4f0f5] p-4 border border-[#94c5d6]">
              <h3 className="font-semibold text-gray-800 mb-2">Статистика активності</h3>
              <p>Кількість створених дошок: <span className="font-bold text-[#58899c]">{boards.length}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { Link } from 'react-router-dom';
import homeImg from '../home_img.jpg';

export const HomeComponent: React.FC = () => {
  return (
    <div className="w-full h-full py-24 px-10">
      <div className="max-w-5xl mx-auto flex justify-between items-start gap-20">
        
        <div className="flex flex-col gap-12 w-1/3">
          <Link to="/create-board" className="bg-[#e4f0f5] text-center text-gray-800 text-xl py-8 shadow-sm hover:shadow-md transition-all">
            Створити дошку
          </Link>
          <Link to="/boards" className="bg-[#e4f0f5] text-center text-gray-800 text-xl py-8 shadow-sm hover:shadow-md transition-all">
            Мої дошки
          </Link>
          <Link to="/chores" className="bg-[#e4f0f5] text-center text-gray-800 text-xl py-8 shadow-sm hover:shadow-md transition-all">
            Домашні справи
          </Link>
        </div>
        
        <div className="w-2/3 flex justify-center pl-16 ">
          <img 
            src={homeImg} 
            alt="Стікери Kanban-desk" 
            className="max-w-[450px] object-contain drop-shadow-lg rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};

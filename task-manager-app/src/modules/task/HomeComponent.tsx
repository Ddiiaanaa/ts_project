import React from 'react';
import { Link } from 'react-router-dom';

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
            src="images/home_img.jpg" 
            alt="Стікери" 
            className="max-w-[450px] object-contain "
            onError={(e) => {
              e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/512/2996/2996118.png';
              e.currentTarget.className = "max-w-[300px] opacity-70";
            }}
          />
        </div>

      </div>
    </div>
  );
};
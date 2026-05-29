import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../shared/hooks/useAuth';

export const AuthComponent: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let success = false;
    
    if (isLogin) {
      success = login(email, password);
    } else {
      if (!name.trim()) return alert("Введіть ім'я");
      success = register(name, email, password);
    }

    if (success) navigate('/home');
  };

  return (
    <div className="flex justify-center items-center py-20 px-4">
      <div className="bg-[#e4f0f5] p-10 w-full max-w-md shadow-lg border border-gray-200">
        <h2 className="text-center text-[#58899c] text-2xl font-bold mb-8">
          {isLogin ? 'Вхід в систему' : 'Реєстрація'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {!isLogin && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Ваше ім'я</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} 
                className="px-3 py-2 outline-none focus:ring-2 ring-[#6b9db1]" placeholder="Іван Франко" />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Електронна пошта</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} 
              className="px-3 py-2 outline-none focus:ring-2 ring-[#6b9db1]" placeholder="example@mail.com" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Пароль</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} 
              className="px-3 py-2 outline-none focus:ring-2 ring-[#6b9db1]" placeholder="••••••••" />
          </div>

          <button type="submit" className="bg-[#6b9db1] text-white py-2.5 mt-4 shadow-md hover:bg-[#58899c] font-medium transition-colors">
            {isLogin ? 'Увійти' : 'Створити акаунт'}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-600">
          {isLogin ? 'Ще немає акаунту? ' : 'Вже зареєстровані? '}
          <span onClick={() => setIsLogin(!isLogin)} className="text-[#58899c] font-semibold cursor-pointer hover:underline">
            {isLogin ? 'Зареєструватись' : 'Увійти'}
          </span>
        </div>
      </div>
    </div>
  );
};
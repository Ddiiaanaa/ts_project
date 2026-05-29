import React from 'react';
import { HashRouter, Routes, Route, Link, Navigate } from 'react-router-dom';import { Bell, User, BookOpen } from 'lucide-react';
import { BoardComponent } from './modules/task/BoardComponent';
import { HomeComponent } from './modules/task/HomeComponent';
import { CreateBoardComponent } from './modules/task/CreateBoardComponent';
import { MyBoardsComponent } from './modules/task/MyBoardsComponent';
import { AuthComponent } from './modules/auth/AuthComponent';
import { ProfileComponent } from './modules/auth/ProfileComponent';
import { ProtectedRoute } from './modules/routing/ProtectedRoute';
import { useAuth } from './modules/shared/hooks/useAuth';
import { CalendarComponent } from './modules/calendar/CalendarComponent';
import { useState } from 'react'; 
import { useNotifications } from './modules/shared/hooks/useNotifications'; 

const AppHeader: React.FC = () => {
  const { currentUser } = useAuth();
  
  const { notifications, dismiss, dismissAll } = useNotifications();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  return (
    <header className="bg-[#94c5d6] h-14 flex items-center justify-between px-6 z-40 relative">
      <Link to="/" className="bg-white border border-black p-1 flex items-center justify-center hover:bg-gray-100 transition-colors">
        <BookOpen className="w-6 h-6 text-black" />
      </Link>
      
      <nav className="flex gap-4">
        <Link to="/calendar" className="bg-[#78a8bc] text-white px-5 py-1 text-sm shadow-sm hover:bg-[#6594a8] transition-colors">Календар</Link>
        <Link to="/create-board" className="bg-[#5c9eb8] text-white px-5 py-1 text-sm shadow-sm border border-[#3d85a3] hover:bg-[#4a8ba5] transition-colors">Створення дошки</Link>
        <Link to="/boards" className="bg-[#78a8bc] text-white px-5 py-1 text-sm shadow-sm hover:bg-[#6594a8] transition-colors">Мої дошки</Link>
        <Link to="/chores" className="bg-[#78a8bc] text-white px-5 py-1 text-sm shadow-sm hover:bg-[#6594a8] transition-colors">Домашні справи</Link>
      </nav>

      <div className="flex items-center gap-3">
        
        <div className="relative">
          <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="bg-white border border-black p-1 flex items-center justify-center hover:bg-gray-100 transition-colors relative">
            <Bell className="w-5 h-5 text-black" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute top-full right-0 mt-3 w-80 bg-white shadow-2xl border border-gray-200 rounded-lg overflow-hidden flex flex-col z-50">
              <div className="bg-[#6b9db1] px-4 py-3 flex justify-between items-center text-white">
                <h3 className="font-semibold text-sm">Ваші сповіщення</h3>
                {unreadCount > 0 && (
                  <button onClick={dismissAll} className="text-xs hover:underline opacity-90">Прочитати всі</button>
                )}
              </div>
              
              <div className="max-h-96 overflow-y-auto p-2 flex flex-col gap-2">
                {notifications.length === 0 || notifications.every(n => n.isRead) ? (
                  <p className="text-center text-gray-500 text-sm py-6">У вас немає нових сповіщень.</p>
                ) : (
                  notifications.filter(n => !n.isRead).map(n => (
                    <div key={n.id} className="p-3 rounded border bg-blue-50/50 border-blue-100 relative group">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-gray-800 text-sm pr-6 leading-tight">{n.title}</h4>
                        <button onClick={() => dismiss(n.id)} className="text-gray-400 hover:text-red-500 absolute top-2 right-2 transition-colors">
                          ✕
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{n.message}</p>
                      <span className="text-[10px] text-gray-400 mt-2 block">{n.date}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <Link to={currentUser ? "/profile" : "/auth"} className="bg-white border border-black p-1 flex items-center justify-center hover:bg-gray-100 transition-colors">
          <User className="w-5 h-5 text-black" />
        </Link>
      </div>
    </header>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col font-sans bg-white border border-gray-300">
        <AppHeader />

        <main className="flex-grow bg-[#f8fcfd]">
          <Routes>
            <Route path="/auth" element={<AuthComponent />} />
            
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomeComponent />} />

            <Route path="/profile" element={<ProtectedRoute><ProfileComponent /></ProtectedRoute>} />
            <Route path="/chores" element={<ProtectedRoute><BoardComponent defaultBoardId="chores" defaultTitle="Мої домашні справи" /></ProtectedRoute>} />
            <Route path="/create-board" element={<ProtectedRoute><CreateBoardComponent /></ProtectedRoute>} />
            <Route path="/boards" element={<ProtectedRoute><MyBoardsComponent /></ProtectedRoute>} />
            <Route path="/boards/:id" element={<ProtectedRoute><BoardComponent /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><CalendarComponent /></ProtectedRoute>} />
          </Routes>
        </main>

        <footer className="bg-[#94c5d6] h-12 w-full mt-auto flex items-center justify-center shadow-inner">
          <span className="text-white font-medium text-sm tracking-widest uppercase">Kanban-desk</span>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
import { useState, useEffect } from 'react';
import { type Task } from '../../../types/Task';
import { useAuth } from './useAuth';

export const useTaskManager = (boardId: string) => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);

  const storageKey = currentUser ? `tasks_${currentUser.id}_${boardId}` : null;

  useEffect(() => {
    if (!storageKey) {
      setTasks([]);
      return;
    }
    const savedTasks = localStorage.getItem(storageKey);
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    else setTasks([]); 
  }, [storageKey]);

  const saveToStorage = (updatedTasks: Task[]) => {
    if (!storageKey) return;
    setTasks(updatedTasks);
    localStorage.setItem(storageKey, JSON.stringify(updatedTasks));
    
    window.dispatchEvent(new Event('tasks_updated'));
  };

  const addTask = (newTask: Task) => saveToStorage([...tasks, newTask]);

  const updateTaskStatus = (taskId: string, newStatus: string) => {
    const updated = tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus as any } : task
    );
    saveToStorage(updated);
  };

  const updateTask = (updatedTask: Task) => {
    const updated = tasks.map(task => task.id === updatedTask.id ? updatedTask : task);
    saveToStorage(updated);
  };

  const deleteTask = (taskId: string) => {
    const updated = tasks.filter(task => task.id !== taskId);
    saveToStorage(updated);
  };

  return { tasks, addTask, updateTaskStatus, updateTask, deleteTask };
};
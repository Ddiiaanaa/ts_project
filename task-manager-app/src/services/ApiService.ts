import axios from 'axios';
import { type Task } from '../types/Task';

const BASE_URL = '/api/tasks.json'; 

export const ApiService = {
  fetchTasks: async (): Promise<Task[]> => {
    try {
      const response = await axios.get<Task[]>(BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Помилка при завантаженні завдань:', error);
      return [];
    }
  },

  saveTask: async (task: Task): Promise<boolean> => {
    console.log('Дані відправлено на бекенд:', task);
    return true; 
  },

  deleteTask: async (taskId: string): Promise<boolean> => {
    console.log('Запит на видалення:', taskId);
    return true;
  }
};
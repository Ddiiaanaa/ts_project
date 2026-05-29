import { useState, useEffect } from 'react';
import { useAuth } from './useAuth'; 

export interface Board {
  id: string;
  title: string;
  description: string;
  priority: string;
  color: string;
  dueDate: string;
  hasReminder: boolean;
  reminderDays: string;
  createdAt: string;
}

export const useBoards = () => {
  const { currentUser } = useAuth();
  const [boards, setBoards] = useState<Board[]>([]);

  const storageKey = currentUser ? `boards_${currentUser.id}` : null;

  useEffect(() => {
    if (!storageKey) {
      setBoards([]);
      return;
    }

    const savedBoards = localStorage.getItem(storageKey);
    if (savedBoards) {
      setBoards(JSON.parse(savedBoards));
    } else {
      setBoards([]); 
    }
  }, [storageKey]); 

  const addBoard = (newBoard: Board) => {
    if (!storageKey) return;
    
    const updatedBoards = [...boards, newBoard];
    setBoards(updatedBoards);
    localStorage.setItem(storageKey, JSON.stringify(updatedBoards));
  };

  return { boards, addBoard };
};
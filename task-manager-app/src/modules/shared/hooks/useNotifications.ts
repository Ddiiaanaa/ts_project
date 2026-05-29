import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useBoards } from './useBoards';

const parseDateStr = (dateStr?: string) => {
  if (!dateStr) return null;
  if (dateStr.includes('.')) {
    const [d, m, y] = dateStr.split('.');
    return new Date(Number(y), Number(m) - 1, Number(d));
  }
  if (dateStr.includes('-')) {
    const [y, m, d] = dateStr.split('-');
    return new Date(Number(y), Number(m) - 1, Number(d));
  }
  return new Date(dateStr);
};

export const useNotifications = () => {
  const { currentUser } = useAuth();
  const { boards } = useBoards();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);

  const checkNotifications = useCallback(() => {
    if (!currentUser) return;
    
    const dismissedIds = JSON.parse(localStorage.getItem(`dismissed_${currentUser.id}`) || '[]');
    setDismissed(dismissedIds);

    const generated: any[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const checkReminders = (item: any, type: string, boardName: string = '') => {
      if (item.dueDate && item.status !== 'Done') {
        const due = parseDateStr(item.dueDate);
        if (due) {
          due.setHours(0, 0, 0, 0);
          const diffTime = due.getTime() - today.getTime();
          const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); 
          
          if (diffDays === 1) {
            generated.push({
              id: `${type}_due_${item.id}`,
              title: `Дедлайн завтра!`,
              message: `${type === 'board' ? 'Дошка' : 'Завдання'} "${item.title}" ${boardName} має бути виконано завтра.`,
              date: today.toLocaleDateString('uk-UA'),
              isRead: dismissedIds.includes(`${type}_due_${item.id}`)
            });
          }
        }
      }

      if (item.hasReminder && item.reminderDays && item.status !== 'Done') {
        const created = parseDateStr(item.createdAt || item.dueDate); 
        const freq = parseInt(item.reminderDays);
        
        if (created && freq > 0) {
          created.setHours(0, 0, 0, 0);
          const diffTime = today.getTime() - created.getTime();
          const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays > 0 && diffDays % freq === 0) {
            generated.push({
              id: `${type}_remind_${item.id}_${diffDays}`,
              title: `Періодичне нагадування`,
              message: `Пора перевірити ${type === 'board' ? 'дошку' : 'завдання'} "${item.title}" ${boardName}.`,
              date: today.toLocaleDateString('uk-UA'),
              isRead: dismissedIds.includes(`${type}_remind_${item.id}_${diffDays}`)
            });
          }
        }
      }
    };

    boards.forEach(b => {
      checkReminders(b, 'board');
      const tasks = JSON.parse(localStorage.getItem(`tasks_${currentUser.id}_${b.id}`) || '[]');
      tasks.forEach((t: any) => checkReminders(t, 'task', `(${b.title})`));
    });

    const chores = JSON.parse(localStorage.getItem(`tasks_${currentUser.id}_chores`) || '[]');
    chores.forEach((t: any) => checkReminders(t, 'task', `(Домашні справи)`));

    setNotifications(generated.reverse());
  }, [currentUser, boards]);

  useEffect(() => {
    checkNotifications();
    window.addEventListener('tasks_updated', checkNotifications);
    return () => window.removeEventListener('tasks_updated', checkNotifications);
  }, [checkNotifications]);

  const dismiss = (id: string) => {
    if (!currentUser) return;
    const updated = [...dismissed, id];
    setDismissed(updated);
    localStorage.setItem(`dismissed_${currentUser.id}`, JSON.stringify(updated));
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const dismissAll = () => {
    if (!currentUser) return;
    const newDismissed = [...dismissed, ...notifications.filter(n => !n.isRead).map(n => n.id)];
    setDismissed(newDismissed);
    localStorage.setItem(`dismissed_${currentUser.id}`, JSON.stringify(newDismissed));
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return { notifications, dismiss, dismissAll };
};
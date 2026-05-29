import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import multiMonthPlugin from '@fullcalendar/multimonth';
import ukLocale from '@fullcalendar/core/locales/uk';
import { useAuth } from '../shared/hooks/useAuth';
import { useBoards } from '../shared/hooks/useBoards';
import { useNavigate } from 'react-router-dom';

export const CalendarComponent: React.FC = () => {
  const { currentUser } = useAuth();
  const { boards } = useBoards();
  const [events, setEvents] = useState<any[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;
    
    try {
      const allEvents: any[] = [];

      const parseDate = (dateStr?: string) => {
        if (!dateStr) return null;
        if (dateStr.includes('.')) {
          const parts = dateStr.split('.');
          if (parts.length === 3) {
            const [d, m, y] = parts;
            return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
          }
        }
        return dateStr;
      };

      boards.forEach(b => {
        if (b.createdAt) {
          const start = parseDate(b.createdAt);
          if (start) {
            allEvents.push({
              id: `board_create_${b.id}`,
              title: `Створено: ${b.title || 'Без назви'}`,
              start,
              backgroundColor: b.color || '#6b9db1',
              borderColor: b.color || '#6b9db1',
              extendedProps: { priority: b.priority || 'Medium', type: 'board', boardId: b.id }
            });
          }
        }

        if (b.dueDate) {
          const start = parseDate(b.dueDate);
          if (start) {
            allEvents.push({
              id: `board_due_${b.id}`,
              title: `Дедлайн: ${b.title || 'Без назви'}`,
              start,
              backgroundColor: b.color || '#6b9db1',
              borderColor: '#ef4444',
              extendedProps: { priority: b.priority || 'Medium', type: 'board', boardId: b.id }
            });
          }
        }

        const tasksRaw = localStorage.getItem(`tasks_${currentUser.id}_${b.id}`);
        if (tasksRaw) {
          const tasks = JSON.parse(tasksRaw);
          if (Array.isArray(tasks)) {
            tasks.forEach((t: any) => {
              if (t && t.dueDate) {
                const start = parseDate(t.dueDate);
                if (start) {
                  allEvents.push({
                    id: `task_${t.id}`,
                    title: t.title || 'Без назви',
                    start,
                    backgroundColor: b.color || '#6b9db1',
                    borderColor: 'rgba(0,0,0,0.2)',
                    extendedProps: { priority: t.priority || 'Medium', type: 'task', boardTitle: b.title, boardId: b.id }
                  });
                }
              }
            });
          }
        }
      });

      const choresRaw = localStorage.getItem(`tasks_${currentUser.id}_chores`);
      if (choresRaw) {
        const choresTasks = JSON.parse(choresRaw);
        if (Array.isArray(choresTasks)) {
          choresTasks.forEach((t: any) => {
            if (t && t.dueDate) {
              const start = parseDate(t.dueDate);
              if (start) {
                allEvents.push({
                  id: `chore_${t.id}`,
                  title: t.title || 'Без назви',
                  start,
                  backgroundColor: '#94c5d6',
                  borderColor: '#5c9eb8',
                  extendedProps: { priority: t.priority || 'Medium', type: 'chore' }
                });
              }
            }
          });
        }
      }

      setEvents(allEvents);
    } catch (error) {
      console.error("Помилка парсингу даних для календаря:", error);
    }
  }, [currentUser, boards]);

  const filteredEvents = events.filter(ev => {
    const evTitle = ev.title || '';
    const matchesSearch = evTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'All' || ev.extendedProps?.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const renderEventContent = (eventInfo: any) => {
    const { event } = eventInfo;
    const type = event.extendedProps.type;

    return (
      <div className="flex items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap px-1 w-full text-xs cursor-pointer hover:opacity-80 transition-opacity">
        {eventInfo.timeText && <span className="font-semibold shrink-0">{eventInfo.timeText}</span>}
        {type === 'chore' && <i className="font-serif italic font-medium shrink-0 opacity-90">Д. с.</i>}
        <span className="truncate" title={event.title}>{event.title}</span>
        {type === 'task' && <span className="opacity-75 text-[10px] shrink-0 font-medium">({event.extendedProps.boardTitle})</span>}
      </div>
    );
  };

  const handleEventClick = (clickInfo: any) => {
    const props = clickInfo.event.extendedProps;
    if (props.type === 'chore') {
      navigate('/chores');
    } else if ((props.type === 'task' || props.type === 'board') && props.boardId) {
      navigate(`/boards/${props.boardId}`);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto mt-6 bg-white shadow-sm border border-gray-200 rounded-xl mb-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b pb-4 gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">Календар подій</h2>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Пошук події..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg outline-none focus:ring-2 ring-[#6b9db1] flex-1 text-sm" 
          />
          <select 
            value={priorityFilter} 
            onChange={e => setPriorityFilter(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg outline-none focus:ring-2 ring-[#6b9db1] text-sm cursor-pointer"
          >
            <option value="All">Всі пріоритети</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>
      
      <div className="font-sans text-sm">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, multiMonthPlugin]}
          initialView="dayGridMonth"
          locales={[ukLocale]}
          locale="uk"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={filteredEvents}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          height="auto"
          eventTimeFormat={{ hour: '2-digit', minute: '2-digit', meridiem: false }}
        />
      </div>
    </div>
  );
};
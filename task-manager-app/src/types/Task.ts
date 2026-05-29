export type StatusEnum = 'Todo' | 'InProgress' | 'Done';
export type PriorityEnum = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: StatusEnum;
  priority: PriorityEnum;
  dueDate: string; 
  hasReminder: boolean;
  reminderDays?: string; 
  createdAt?: string; 
}
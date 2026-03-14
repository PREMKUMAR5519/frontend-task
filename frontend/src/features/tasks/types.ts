export type TaskStatus = 'backlog' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  tags: string[];
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  tags: string; // comma-separated, parsed on submit
}

export type SortField = 'createdAt' | 'updatedAt' | 'priority';
export type SortDirection = 'asc' | 'desc';

export interface TaskFilters {
  search: string;
  statuses: TaskStatus[];
  priority: TaskPriority | '';
}

export interface TaskSort {
  field: SortField;
  direction: SortDirection;
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  'backlog': 'Backlog',
  'in-progress': 'In Progress',
  'done': 'Done',
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const STATUSES: TaskStatus[] = ['backlog', 'in-progress', 'done'];
export const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];

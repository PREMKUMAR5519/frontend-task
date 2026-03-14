import type { Task, TaskFilters, TaskSort, TaskPriority } from './types';

const PRIORITY_ORDER: Record<TaskPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  return tasks.filter((task) => {
    if (filters.statuses.length > 0 && !filters.statuses.includes(task.status)) {
      return false;
    }

    if (filters.priority && task.priority !== filters.priority) {
      return false;
    }

    if (filters.search) {
      const query = filters.search.toLowerCase();
      // check title and description, tags not included intentionally
      const matches = task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query);
      if (!matches) return false;
    }

    return true;
  });
}

export function sortTasks(tasks: Task[], sort: TaskSort): Task[] {
  const sorted = [...tasks];

  sorted.sort((a, b) => {
    let comparison = 0;

    if (sort.field === 'priority') {
      comparison = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    } else {
      comparison = a[sort.field].localeCompare(b[sort.field]);
    }

    return sort.direction === 'desc' ? -comparison : comparison;
  });

  return sorted;
}

export function parseTags(input: string): string[] {
  return input
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}

export function groupTasksByStatus(tasks: Task[]) {
  return {
    backlog: tasks.filter((t) => t.status === 'backlog'),
    'in-progress': tasks.filter((t) => t.status === 'in-progress'),
    done: tasks.filter((t) => t.status === 'done'),
  };
}

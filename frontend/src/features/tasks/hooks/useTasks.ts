import { useState, useCallback, useEffect } from 'react';
import { nanoid } from 'nanoid';
import type { Task, TaskFormData, TaskStatus } from '../types';
import { loadTasks, saveTasks } from '../storage';
import { parseTags } from '../helpers';

interface UseTasksReturn {
  tasks: Task[];
  migrated: boolean;
  storageError: string | null;
  addTask: (data: TaskFormData) => void;
  updateTask: (id: string, data: TaskFormData) => void;
  changeStatus: (id: string, status: TaskStatus) => void;
  deleteTask: (id: string) => void;
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [migrated, setMigrated] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    const result = loadTasks();
    setMigrated(result.migrated);
    setStorageError(result.error);

    if (result.hasStoredData) {
      setTasks(result.tasks);
      return;
    }

    if (result.error) {
      return;
    }
  }, []);

  // persist after every mutation and surface failures rather than swallowing them
  const persist = useCallback((updated: Task[]) => {
    const success = saveTasks(updated);
    setStorageError(
      success ? null : 'Changes could not be saved. Local storage may be full or unavailable.',
    );
  }, []);

  const addTask = useCallback(
    (data: TaskFormData) => {
      const now = new Date().toISOString();
      const task: Task = {
        id: nanoid(),
        title: data.title.trim(),
        description: data.description.trim(),
        status: data.status,
        priority: data.priority,
        assignee: data.assignee.trim(),
        tags: parseTags(data.tags),
        createdAt: now,
        updatedAt: now,
      };

      setTasks((prev) => {
        const next = [task, ...prev];
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const updateTask = useCallback(
    (id: string, data: TaskFormData) => {
      setTasks((prev) => {
        const next = prev.map((t) =>
          t.id === id
            ? {
                ...t,
                title: data.title.trim(),
                description: data.description.trim(),
                status: data.status,
                priority: data.priority,
                assignee: data.assignee.trim(),
                tags: parseTags(data.tags),
                updatedAt: new Date().toISOString(),
              }
            : t,
        );
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const changeStatus = useCallback(
    (id: string, status: TaskStatus) => {
      setTasks((prev) => {
        const next = prev.map((t) =>
          t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t,
        );
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => {
        const next = prev.filter((t) => t.id !== id);
        persist(next);
        return next;
      });
    },
    [persist],
  );

  return { tasks, migrated, storageError, addTask, updateTask, changeStatus, deleteTask };
}

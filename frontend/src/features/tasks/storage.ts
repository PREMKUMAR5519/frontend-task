import type { Task } from './types';
import { migrateData, CURRENT_SCHEMA_VERSION, type StorageData } from './migrations';

const STORAGE_KEY = 'workflow-board-data';

interface LoadResult {
  tasks: Task[];
  migrated: boolean;
  hasStoredData: boolean;
  error: string | null;
}

// localStorage can throw in private browsing or when storage is blocked
export function loadTasks(): LoadResult {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { tasks: [], migrated: false, hasStoredData: false, error: null };
    }

    const parsed = JSON.parse(raw);
    const { data, migrated } = migrateData(parsed);
    const migrationSaved = migrated ? saveTasks(data.tasks as Task[]) : true;

    return {
      tasks: data.tasks as Task[],
      migrated,
      hasStoredData: true,
      error: migrationSaved
        ? null
        : 'Saved tasks were loaded, but the upgraded storage format could not be persisted.',
    };
  } catch (e) {
    console.warn('Failed to load tasks from localStorage', e);
    return {
      tasks: [],
      migrated: false,
      hasStoredData: false,
      error: 'Saved tasks could not be loaded. Local storage may be blocked or corrupted.',
    };
  }
}

export function saveTasks(tasks: Task[]): boolean {
  try {
    const data: StorageData = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      tasks,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    console.warn('Failed to save tasks to localStorage');
    return false;
  }
}

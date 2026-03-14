export const CURRENT_SCHEMA_VERSION = 2;

interface StorageDataV1 {
  schemaVersion: 1;
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    assignee: string;
    createdAt: string;
  }>;
}

interface StorageDataV2 {
  schemaVersion: 2;
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    assignee: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
  }>;
}

export type StorageData = StorageDataV2;

// returns migrated flag so the caller can show a toast if anything changed
export function migrateData(raw: unknown): { data: StorageData; migrated: boolean } {
  if (!raw || typeof raw !== 'object') {
    return { data: { schemaVersion: CURRENT_SCHEMA_VERSION, tasks: [] }, migrated: false };
  }

  const obj = raw as Record<string, unknown>;
  const version = obj.schemaVersion as number | undefined;

  // v1 didn't have tags or updatedAt, backfill both
  if (version === 1) {
    const old = raw as StorageDataV1;
    const upgraded: StorageDataV2 = {
      schemaVersion: 2,
      tasks: old.tasks.map((t) => ({
        ...t,
        tags: [],
        updatedAt: t.createdAt,
      })),
    };
    return { data: upgraded, migrated: true };
  }

  if (version === 2) {
    return { data: raw as StorageDataV2, migrated: false };
  }

  // unrecognized version, safer to start fresh
  return { data: { schemaVersion: CURRENT_SCHEMA_VERSION, tasks: [] }, migrated: false };
}

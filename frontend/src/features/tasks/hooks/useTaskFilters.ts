import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { TaskFilters, TaskSort, TaskStatus, TaskPriority, SortField, SortDirection } from '../types';
import { STATUSES, PRIORITIES } from '../types';

const DEFAULT_SORT: TaskSort = { field: 'updatedAt', direction: 'desc' };

export function useTaskFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: TaskFilters = useMemo(() => {
    const statusParam = searchParams.get('status');
    const statuses = statusParam
      ? statusParam.split(',').filter((s): s is TaskStatus => STATUSES.includes(s as TaskStatus))
      : [];

    const priorityParam = searchParams.get('priority') || '';
    const priority = PRIORITIES.includes(priorityParam as TaskPriority)
      ? (priorityParam as TaskPriority)
      : '';

    return {
      search: searchParams.get('q') || '',
      statuses,
      priority,
    };
  }, [searchParams]);

  const sort: TaskSort = useMemo(() => {
    const field = searchParams.get('sortBy') as SortField | null;
    const direction = searchParams.get('sortDir') as SortDirection | null;

    return {
      field: field && ['createdAt', 'updatedAt', 'priority'].includes(field) ? field : DEFAULT_SORT.field,
      direction: direction === 'asc' || direction === 'desc' ? direction : DEFAULT_SORT.direction,
    };
  }, [searchParams]);

  const setFilters = useCallback(
    (updates: Partial<TaskFilters>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);

        if ('search' in updates) {
          if (updates.search) next.set('q', updates.search);
          else next.delete('q');
        }

        if ('statuses' in updates) {
          if (updates.statuses && updates.statuses.length > 0) {
            next.set('status', updates.statuses.join(','));
          } else {
            next.delete('status');
          }
        }

        if ('priority' in updates) {
          if (updates.priority) next.set('priority', updates.priority);
          else next.delete('priority');
        }

        return next;
      }, { replace: true });
    },
    [setSearchParams],
  );

  const setSort = useCallback(
    (field: SortField) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        const currentField = next.get('sortBy') || DEFAULT_SORT.field;
        const currentDir = next.get('sortDir') || DEFAULT_SORT.direction;

        if (currentField === field) {
          // same field clicked again, flip direction
          next.set('sortDir', currentDir === 'desc' ? 'asc' : 'desc');
        } else {
          next.set('sortBy', field);
          next.set('sortDir', 'desc');
        }

        return next;
      }, { replace: true });
    },
    [setSearchParams],
  );

  const clearFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const hasActiveFilters = filters.search !== '' || filters.statuses.length > 0 || filters.priority !== '';

  return { filters, sort, setFilters, setSort, clearFilters, hasActiveFilters };
}

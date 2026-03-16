import type { TaskFilters as Filters, TaskStatus, TaskPriority, TaskSort, SortField } from '../../types';
import { STATUS_LABELS, STATUSES, PRIORITIES, PRIORITY_LABELS } from '../../types';
import { Button, Select } from '../../../../components/ui';
import './TaskFilters.scss';

interface TaskFiltersProps {
  filters: Filters;
  sort: TaskSort;
  hasActiveFilters: boolean;
  onFilterChange: (updates: Partial<Filters>) => void;
  onSortChange: (field: SortField) => void;
  onClear: () => void;
}

const SORT_OPTIONS: { field: SortField; label: string }[] = [
  { field: 'updatedAt', label: 'Updated' },
  { field: 'createdAt', label: 'Created' },
  { field: 'priority', label: 'Priority' },
];

export function TaskFilters({
  filters,
  sort,
  hasActiveFilters,
  onFilterChange,
  onSortChange,
  onClear,
}: TaskFiltersProps) {
  const toggleStatus = (status: TaskStatus) => {
    const next = filters.statuses.includes(status)
      ? filters.statuses.filter((currentStatus) => currentStatus !== status)
      : [...filters.statuses, status];
    onFilterChange({ statuses: next });
  };

  return (
    <div className="task-filters">
      <div className="task-filters__row">
        <div className="task-filters__group">
          <span className="task-filters__label">Status</span>
          <div className="task-filters__chips">
            {STATUSES.map((status) => (
              <button
                key={status}
                className={`task-filters__chip ${filters.statuses.includes(status) ? 'task-filters__chip--active' : ''}`}
                onClick={() => toggleStatus(status)}
                type="button"
              >
                {STATUS_LABELS[status]}
              </button>
            ))}
          </div>
        </div>

        <div className="task-filters__group">
          <Select
            label="Priority"
            options={PRIORITIES.map((p) => ({ value: p, label: PRIORITY_LABELS[p] }))}
            value={filters.priority}
            onChange={(value) => onFilterChange({ priority: value as TaskPriority | '' })}
            placeholder="All"
            className="task-filters__priority-select"
          />
        </div>

        <div className="task-filters__group">
          <span className="task-filters__label">Sort by</span>
          <div className="task-filters__sort-group">
            {SORT_OPTIONS.map(({ field, label }) => (
              <button
                key={field}
                className={`task-filters__sort-button ${sort.field === field ? 'task-filters__sort-button--active' : ''}`}
                onClick={() => onSortChange(field)}
                type="button"
                aria-pressed={sort.field === field}
                aria-label={
                  sort.field === field
                    ? `Sort by ${label}, ${sort.direction}ending`
                    : `Sort by ${label}`
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}

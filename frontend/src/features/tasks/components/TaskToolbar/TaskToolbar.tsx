import { Button } from '../../../../components/ui';
import './TaskToolbar.scss';

interface TaskToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onCreateTask: () => void;
}

export function TaskToolbar({ search, onSearchChange, onCreateTask }: TaskToolbarProps) {
  // handler pulled out so it's easier to add debounce here later if needed
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className="task-toolbar">
      <div className="task-toolbar__search-wrap">
        <span className="task-toolbar__search-icon" aria-hidden="true">
          <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8.75 14.1667C11.7415 14.1667 14.1667 11.7415 14.1667 8.75C14.1667 5.75846 11.7415 3.33333 8.75 3.33333C5.75846 3.33333 3.33334 5.75846 3.33334 8.75C3.33334 11.7415 5.75846 14.1667 8.75 14.1667Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16.6667 16.6667L12.8333 12.8333"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <input
          type="search"
          className="task-toolbar__search-input"
          placeholder="Search"
          value={search}
          onChange={handleSearch}
          aria-label="Search tasks"
        />
      </div>

      <Button onClick={onCreateTask} size="lg" className="task-toolbar__create-button">
        <span className="task-toolbar__create-icon" aria-hidden="true">
          +
        </span>
        Create
      </Button>
    </div>
  );
}

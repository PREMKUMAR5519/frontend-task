import { useDroppable } from '@dnd-kit/core';
import type { Task, TaskStatus } from '../../types';
import { STATUS_LABELS } from '../../types';
import { TaskCard } from '../TaskCard/TaskCard';
import './TaskColumn.scss';

interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

export function TaskColumn({ status, tasks, onEditTask, onStatusChange }: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${status}`,
    data: { status },
  });

  const listClassName = ['task-column__list', isOver ? 'task-column__list--drop-target' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className="task-column">
      <div className="task-column__header">
        <h2 className="task-column__title">{STATUS_LABELS[status]}</h2>
        <span className="task-column__count">{tasks.length}</span>
      </div>

      <div ref={setNodeRef} className={listClassName}>
        {tasks.length === 0 ? (
          <p className="task-column__empty">{isOver ? 'Drop here' : 'No tasks'}</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
}

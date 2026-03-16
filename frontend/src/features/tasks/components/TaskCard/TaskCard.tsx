import type { ButtonHTMLAttributes, CSSProperties, Ref } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useDraggable } from '@dnd-kit/core';
import type { Task, TaskStatus } from '../../types';
import { STATUS_LABELS, STATUSES } from '../../types';
import { Badge, Button, Card } from '../../../../components/ui';
import './TaskCard.scss';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  interactive?: boolean;
}

interface TaskCardContentProps {
  task: Task;
  onEdit: (task: Task) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  cardClassName?: string;
  cardStyle?: CSSProperties;
  dragHandleRef?: Ref<HTMLButtonElement>;
  dragHandleProps?: ButtonHTMLAttributes<HTMLButtonElement>;
  onCardClick?: () => void;
  controlsDisabled?: boolean;
}

const priorityVariant = {
  low: 'priority-low' as const,
  medium: 'priority-medium' as const,
  high: 'priority-high' as const,
};

function TaskCardContent({
  task,
  onEdit,
  onStatusChange,
  cardClassName,
  cardStyle,
  dragHandleRef,
  dragHandleProps,
  onCardClick,
  controlsDisabled = false,
}: TaskCardContentProps) {
  const timeAgo = formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true });

  return (
    <Card className={cardClassName} style={cardStyle} onClick={onCardClick}>
      <div className="task-card__header">
        <div className="task-card__header-main">
          <button
            ref={dragHandleRef}
            type="button"
            className="task-card__drag-handle"
            aria-label={`Drag ${task.title}`}
            onClick={(e) => e.stopPropagation()}
            disabled={controlsDisabled}
            {...dragHandleProps}
          >
            <span className="task-card__drag-dot" />
            <span className="task-card__drag-dot" />
            <span className="task-card__drag-dot" />
            <span className="task-card__drag-dot" />
            <span className="task-card__drag-dot" />
            <span className="task-card__drag-dot" />
          </button>
          <h3 className="task-card__title">{task.title}</h3>
        </div>

        <Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge>
      </div>

      {task.assignee && <p className="task-card__assignee">{task.assignee}</p>}

      {task.tags.length > 0 && (
        <div className="task-card__tags">
          {task.tags.map((tag) => (
            <Badge key={tag} variant="default">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <div className="task-card__footer">
        <span className="task-card__time">Updated {timeAgo}</span>

        <div className="task-card__actions">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label={`Edit ${task.title}`}
            disabled={controlsDisabled}
          >
            Edit
          </Button>

          <select
            className="task-card__status-select"
            value={task.status}
            onChange={(e) => {
              e.stopPropagation();
              onStatusChange(task.id, e.target.value as TaskStatus);
            }}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label={`Change status for ${task.title}`}
            disabled={controlsDisabled}
          >
            {STATUSES.map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {STATUS_LABELS[statusOption]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Card>
  );
}

function InteractiveTaskCard({ task, onEdit, onStatusChange }: Omit<TaskCardProps, 'interactive'>) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  });

  const wrapperClassName = [
    'task-card__wrapper',
    isDragging ? 'task-card__wrapper--dragging' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const cardClassName = [
    'task-card',
    isDragging ? 'task-card--dragging-placeholder' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={setNodeRef} className={wrapperClassName}>
      <TaskCardContent
        task={task}
        onEdit={onEdit}
        onStatusChange={onStatusChange}
        cardClassName={cardClassName}
        onCardClick={() => {
          if (!isDragging) onEdit(task);
        }}
        dragHandleRef={setActivatorNodeRef}
        dragHandleProps={{
          ...attributes,
          ...listeners,
        }}
      />
    </div>
  );
}

function StaticTaskCard({ task, onEdit, onStatusChange }: Omit<TaskCardProps, 'interactive'>) {
  return (
    <TaskCardContent
      task={task}
      onEdit={onEdit}
      onStatusChange={onStatusChange}
      cardClassName="task-card task-card--overlay"
      controlsDisabled
    />
  );
}

export function TaskCard({
  task,
  onEdit,
  onStatusChange,
  interactive = true,
}: TaskCardProps) {
  if (!interactive) {
    return <StaticTaskCard task={task} onEdit={onEdit} onStatusChange={onStatusChange} />;
  }

  return <InteractiveTaskCard task={task} onEdit={onEdit} onStatusChange={onStatusChange} />;
}

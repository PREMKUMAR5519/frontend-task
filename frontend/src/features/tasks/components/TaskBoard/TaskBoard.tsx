import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { useState } from 'react';
import type { Task, TaskStatus } from '../../types';
import { STATUSES } from '../../types';
import { groupTasksByStatus } from '../../helpers';
import { TaskColumn } from '../TaskColumn/TaskColumn';
import { TaskCard } from '../TaskCard/TaskCard';
import './TaskBoard.scss';

const DELETE_DROP_ID = 'delete-zone';

interface TaskBoardProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDeleteTask: (task: Task) => void;
}

function DeleteDropZone() {
  const { setNodeRef, isOver } = useDroppable({
    id: DELETE_DROP_ID,
    data: { action: 'delete' },
  });

  return (
    <div
      ref={setNodeRef}
      className={isOver ? 'task-board__delete-zone task-board__delete-zone--active' : 'task-board__delete-zone'}
    >
      <span className="task-board__delete-title">
        Delete
      </span>
    </div>
  );
}

export function TaskBoard({ tasks, onEditTask, onStatusChange, onDeleteTask }: TaskBoardProps) {
  const grouped = groupTasksByStatus(tasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = event.active.data.current?.task as Task | undefined;
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const draggedTask = active.data.current?.task as Task | undefined;

    setActiveTask(null);

    if (!over || !draggedTask) return;

    if (over.id === DELETE_DROP_ID) {
      if (window.confirm(`Delete "${draggedTask.title}"? This cannot be undone.`)) {
        onDeleteTask(draggedTask);
      }
      return;
    }

    const taskId = active.id as string;
    const targetStatus = over.data.current?.status as TaskStatus | undefined;
    if (!targetStatus) return;

    if (draggedTask.status !== targetStatus) {
      onStatusChange(taskId, targetStatus);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="task-board">
        {STATUSES.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={grouped[status]}
            onEditTask={onEditTask}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
      {activeTask ? <DeleteDropZone /> : null}

      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <div className="task-board__overlay">
            <TaskCard
              task={activeTask}
              onEdit={() => { }}
              onStatusChange={() => { }}
              interactive={false}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

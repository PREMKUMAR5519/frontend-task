import { useState, useMemo, useEffect } from 'react';
import './BoardPage.scss';

import type { Task, TaskFormData } from '../../types';
import { useTasks } from '../../hooks/useTasks';
import { useTaskFilters } from '../../hooks/useTaskFilters';
import { filterTasks, sortTasks } from '../../helpers';
import { Modal, ToastContainer, useToast } from '../../../../components/ui';
import { TaskToolbar } from '../TaskToolbar/TaskToolbar';
import { TaskFilters } from '../TaskFilters/TaskFilters';
import { TaskBoard } from './TaskBoard';
import { TaskForm } from '../TaskForm/TaskForm';

export function BoardPage() {
  const { tasks, migrated, storageError, addTask, updateTask, changeStatus, deleteTask } = useTasks();
  const { filters, sort, setFilters, setSort, clearFilters, hasActiveFilters } = useTaskFilters();
  const { addToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [isFormDirty, setIsFormDirty] = useState(false);

  useEffect(() => {
    if (migrated) {
      addToast('Data migrated to the latest version.', 'info');
    }
  }, [migrated, addToast]);

  useEffect(() => {
    if (storageError) {
      addToast(storageError, 'error');
    }
  }, [storageError, addToast]);

  const processedTasks = useMemo(() => {
    const filtered = filterTasks(tasks, filters);
    return sortTasks(filtered, sort);
  }, [tasks, filters, sort]);

  const openCreateModal = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(undefined);
    setIsFormDirty(false);
  };

  const requestCloseModal = () => {
    if (isFormDirty && !window.confirm('You have unsaved changes. Discard them?')) {
      return;
    }

    closeModal();
  };

  const handleSubmit = (data: TaskFormData) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
      addToast('Task updated.', 'success');
    } else {
      addTask(data);
      addToast('Task created.', 'success');
    }
    closeModal();
  };

  const handleDelete = () => {
    if (editingTask && window.confirm('Delete this task? This cannot be undone.')) {
      deleteTask(editingTask.id);
      addToast('Task deleted.', 'info');
      closeModal();
    }
  };

  const noTasksAtAll = tasks.length === 0;
  const hasBlockingStorageError = !!storageError && noTasksAtAll;
  const filtersHideAll = !noTasksAtAll && processedTasks.length === 0 && hasActiveFilters;

  return (
    <div className="task-board-page">
      <TaskToolbar
        search={filters.search}
        onSearchChange={(value) => setFilters({ search: value })}
        onCreateTask={openCreateModal}
      />

      <TaskFilters
        filters={filters}
        sort={sort}
        hasActiveFilters={hasActiveFilters}
        onFilterChange={setFilters}
        onSortChange={setSort}
        onClear={clearFilters}
      />

      {storageError && !hasBlockingStorageError ? (
        <div className="task-board-page__storage-notice" role="alert">
          {storageError}
        </div>
      ) : null}

      {hasBlockingStorageError ? (
        <div className="task-board-page__error-state" role="alert">
          <p className="task-board-page__error-text">Storage unavailable</p>
          <p className="task-board-page__error-hint">
            This browser blocked access to local storage. Enable storage and refresh to use the
            board.
          </p>
        </div>
      ) : noTasksAtAll ? (
        <div className="task-board-page__empty-state">
          <p className="task-board-page__empty-text">No tasks yet</p>
          <p className="task-board-page__empty-hint">Create your first task to get started.</p>
        </div>
      ) : filtersHideAll ? (
        <div className="task-board-page__empty-state">
          <p className="task-board-page__empty-text">No matching tasks</p>
          <p className="task-board-page__empty-hint">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <TaskBoard
          tasks={processedTasks}
          onEditTask={openEditModal}
          onStatusChange={changeStatus}
          onDeleteTask={(task) => {
            deleteTask(task.id);
            addToast(`Deleted "${task.title}".`, 'info');
          }}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={requestCloseModal}
        title={editingTask ? 'Edit Task' : 'New Task'}
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleSubmit}
          onCancel={requestCloseModal}
          onDelete={editingTask ? handleDelete : undefined}
          onDirtyChange={setIsFormDirty}
        />
      </Modal>

      <ToastContainer />
    </div>
  );
}

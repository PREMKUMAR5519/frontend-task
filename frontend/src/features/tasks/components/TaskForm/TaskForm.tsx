import { useState, useEffect } from 'react';
import type { Task, TaskFormData } from '../../types';
import { STATUSES, PRIORITIES, STATUS_LABELS, PRIORITY_LABELS } from '../../types';
import { validateTaskForm, hasErrors, type FormErrors } from '../../validation';
import { useBeforeUnloadWarning } from '../../../../hooks/useBeforeUnloadWarning';
import { Button, TextInput, TextArea, Select } from '../../../../components/ui';
import './TaskForm.scss';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  onDelete?: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
}

const EMPTY_FORM: TaskFormData = {
  title: '',
  description: '',
  status: 'backlog',
  priority: 'medium',
  assignee: '',
  tags: '',
};

function taskToFormData(task: Task): TaskFormData {
  return {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    assignee: task.assignee,
    tags: task.tags.join(', '),
  };
}

export function TaskForm({ task, onSubmit, onCancel, onDelete, onDirtyChange }: TaskFormProps) {
  const isEditing = !!task;
  const [form, setForm] = useState<TaskFormData>(task ? taskToFormData(task) : EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isDirty, setIsDirty] = useState(false);

  useBeforeUnloadWarning(isDirty);

  useEffect(() => {
    setForm(task ? taskToFormData(task) : EMPTY_FORM);
    setErrors({});
    setIsDirty(false);
  }, [task]);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const handleChange = (field: keyof TaskFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);

    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateTaskForm(form);

    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(form);
    setIsDirty(false);
  };

  const statusOptions = STATUSES.map((status) => ({ value: status, label: STATUS_LABELS[status] }));
  const priorityOptions = PRIORITIES.map((priority) => ({
    value: priority,
    label: PRIORITY_LABELS[priority],
  }));

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <TextInput
        label="Title"
        value={form.title}
        onChange={(e) => handleChange('title', e.target.value)}
        error={errors.title}
        placeholder="What needs to be done?"
        autoFocus
      />

      <TextArea
        label="Description"
        value={form.description}
        onChange={(e) => handleChange('description', e.target.value)}
        error={errors.description}
        placeholder="Add some details..."
      />

      <div className="task-form__row">
        <Select
          label="Status"
          options={statusOptions}
          value={form.status}
          onChange={(value) => handleChange('status', value)}
          error={errors.status}
        />

        <Select
          label="Priority"
          options={priorityOptions}
          value={form.priority}
          onChange={(value) => handleChange('priority', value)}
          error={errors.priority}
        />
      </div>

      <TextInput
        label="Assignee"
        value={form.assignee}
        onChange={(e) => handleChange('assignee', e.target.value)}
        error={errors.assignee}
        placeholder="Who's working on this?"
      />

      <TextInput
        label="Tags"
        value={form.tags}
        onChange={(e) => handleChange('tags', e.target.value)}
        placeholder="e.g. bug, frontend, urgent"
      />

      <div className="task-form__actions">
        <div className="task-form__left-actions">
          {isEditing && onDelete && (
            <Button type="button" variant="destructive" size="sm" onClick={onDelete}>
              Delete
            </Button>
          )}
        </div>
        <div className="task-form__right-actions">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </div>
    </form>
  );
}

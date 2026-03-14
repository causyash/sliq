import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import TaskColumn from './TaskColumn';
import TaskCard from './TaskCard';
import { createPortal } from 'react-dom';

const KanbanBoard = ({ tasks, onTaskUpdate, onTaskClick, onAddTask }) => {
  const [columns, setColumns] = useState({
    todo: [],
    in_progress: [],
    review: [],
    done: [],
  });
  const [activeTask, setActiveTask] = useState(null);

  useEffect(() => {
    const newColumns = {
      todo: tasks.filter(t => t.status === 'todo'),
      in_progress: tasks.filter(t => t.status === 'in_progress'),
      review: tasks.filter(t => t.status === 'review'),
      done: tasks.filter(t => t.status === 'done'),
    };
    setColumns(newColumns);
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const onDragStart = (event) => {
    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task);
    }
  };

  const onDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setColumns((prev) => {
        const activeColumn = active.data.current.task.status;
        const overColumn = over.data.current.task.status;

        if (activeColumn !== overColumn) {
          const activeItems = [...prev[activeColumn]];
          const overItems = [...prev[overColumn]];

          const activeIndex = activeItems.findIndex(i => i._id === activeId);
          const overIndex = overItems.findIndex(i => i._id === overId);

          const [movedItem] = activeItems.splice(activeIndex, 1);
          movedItem.status = overColumn;
          overItems.splice(overIndex, 0, movedItem);

          return { ...prev, [activeColumn]: activeItems, [overColumn]: overItems };
        }

        return prev;
      });
    }

    // Dropping a Task over a Column
    const isOverAColumn = !isOverATask;
    if (isActiveATask && isOverAColumn) {
      setColumns((prev) => {
        const activeColumn = active.data.current.task.status;
        const overColumn = overId;

        if (activeColumn !== overColumn) {
          const activeItems = [...prev[activeColumn]];
          const overItems = [...prev[overColumn]];

          const activeIndex = activeItems.findIndex(i => i._id === activeId);
          const [movedItem] = activeItems.splice(activeIndex, 1);
          movedItem.status = overColumn;
          overItems.push(movedItem);

          return { ...prev, [activeColumn]: activeItems, [overColumn]: overItems };
        }

        return prev;
      });
    }
  };

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    const activeTaskData = active.data.current.task;
    const overStatus = over.data.current?.task?.status || over.id;

    if (activeTaskData.status !== overStatus) {
      onTaskUpdate(activeId, { status: overStatus });
    }

    setActiveTask(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-8 min-h-[600px]">
        <TaskColumn id="todo" title="To Do" tasks={columns.todo} onTaskClick={onTaskClick} onAddTask={() => onAddTask('todo')} />
        <TaskColumn id="in_progress" title="In Progress" tasks={columns.in_progress} onTaskClick={onTaskClick} onAddTask={() => onAddTask('in_progress')} />
        <TaskColumn id="review" title="Review" tasks={columns.review} onTaskClick={onTaskClick} onAddTask={() => onAddTask('review')} />
        <TaskColumn id="done" title="Done" tasks={columns.done} onTaskClick={onTaskClick} onAddTask={() => onAddTask('done')} />
      </div>

      {createPortal(
        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};

export default KanbanBoard;

import React, { useState } from 'react';
import Header from './Header';
import Task from './Task';
import AddTaskModal, { CreateTaskDto } from './AddTaskModal';
import {
  useCreateTaskMutation,
  useGetTasksQuery,
  useUpdateTaskMutation,
} from '../state/api/tasksApi';
import { Skeleton } from '@mui/material'; // Импортируем Skeleton из MUI
import EditTaskModal from './EditTaskModal';

const Home = () => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const { data, isLoading } = useGetTasksQuery({ timeRange: 'max' });

  const handleAddTask = (data: CreateTaskDto) => {
    createTask(data);
    // handleCloseModal();
  };
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const [openEditModal, setOpenEditModal] = useState(false);
  const handleCloseEditModal = () => setOpenEditModal(false);

  // Сохранить изменения в задаче
  const handleSaveTask = async (updatedTask: any) => {
    console.log('Updated Task:', updatedTask);
    // Здесь нужно вызвать API для сохранения данных или обновления состояния
    setOpenEditModal(false);
    await updateTask(updatedTask);
  };
  const handleEditTask = (taskId: string) => {
    const task = data?.find((task) => task.id === taskId);
    setSelectedTask(task);
    setOpenEditModal(true);
  };
  return (
    <>
      <Header />
      <div className="container mx-auto h-[calc(100vh-64px)] pt-[55px]">
        <div className="flex justify-between gap-14">
          <div className="w-[1120px] bg-[#2C3659] p-6 rounded-lg h-[calc(100vh-174px)]">
            <h1 className="text-4xl font-bold text-gray-800">
              Welcome to the Home Page
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Consequatur tenetur voluptatem, magnam sunt earum quas molestias
              maxime? Facilis excepturi iusto deserunt amet, eaque officiis
              laboriosam, ullam expedita, minus esse libero.
            </p>
          </div>
          <div className="w-[550px] h-[calc(100vh-174px)] rounded-lg overflow-auto bg-[#2C3659] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Tasks</h2>
              <button
                className="px-4 py-2 bg-[#FF0000] text-white rounded-lg"
                onClick={handleOpenModal}
              >
                Add Task
              </button>
            </div>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(10)].map((_, index) => (
                  <Skeleton
                    key={index}
                    variant="rectangular"
                    width="100%"
                    height={48}
                  />
                ))}
              </div>
            ) : (
              data?.map((task) => (
                <Task
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  isCompleted={task.isCompleted}
                  priority={task.priority}
                  score={task.points}
                  isPositive={task.type === 'positive'}
                  onClick={() => handleEditTask(task.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* AddTaskModal */}
      <AddTaskModal
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={handleAddTask}
      />

      {/* Модалка для редактирования задачи */}
      <EditTaskModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        task={selectedTask}
        onSubmit={handleSaveTask}
      />
    </>
  );
};

export default Home;

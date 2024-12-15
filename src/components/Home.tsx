import React, { useState } from 'react';
import Header from './Header';
import Task from './Task';
import AddTaskModal, { CreateTaskDto } from './AddTaskModal';
import {
  Task as ITask,
  useCreateTaskMutation,
  useGetTasksQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from '../state/api/tasksApi';
import { Skeleton } from '@mui/material'; // Импортируем Skeleton из MUI
import EditTaskModal from './EditTaskModal';
import LifeChart from './LifeChart';
import {
  ChartData,
  chartTimeRanges,
  useGetChartDataQuery,
} from '../state/api/chartApi';

interface TaskHistoryCardProps {
  tasks: ITask[];
  date: string;
  clickHandler: () => void;
}

interface TasksByDay {
  day: string; // Дата в формате YYYY-MM-DD
  tasks: ITask[]; // Массив задач, сгруппированных по дню
}

const TaskHistoryCard: React.FC<TaskHistoryCardProps> = ({
  tasks,
  date,
  clickHandler,
}) => {
  return (
    <div className="bg-[#2C3659] p-4 rounded-lg shadow-xl shadow-[#202842] mb-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-lg font-bold text-white">{date}</span>
        <span className="text-lg font-bold text-white">
          {tasks.length} tasks
        </span>
      </div>
      {tasks.map((task) => (
        <Task
          createdAt={task.createdAt}
          onClick={clickHandler}
          key={task.id}
          id={task.id}
          title={task.title}
          isCompleted={task.isCompleted}
          priority={task.priority}
          score={task.points}
          isPositive={task.type === 'positive'}
        />
      ))}
    </div>
  );
};

const Home = () => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [timeRange, setTimeRange] = useState<'max' | 'today'>('today');
  const { data: tasksList, isLoading } = useGetTasksQuery({ timeRange });
  const [chartTimeRange, setChartTimeRange] =
    useState<chartTimeRanges>('7 days');
  const {
    data: chartData,
    isLoading: isLoadingChart,
    refetch: refetchChartData,
  } = useGetChartDataQuery(chartTimeRange) as {
    data: ChartData[];
    isLoading: boolean;
    refetch: () => void;
  };
  const tasksByDay: TasksByDay[] | undefined = tasksList?.reduce<TasksByDay[]>(
    (acc, task) => {
      const day = task.createdAt.split('T')[0]; // Получаем дату без времени (YYYY-MM-DD)

      // Проверяем, есть ли уже такая дата в аккумуляторе
      const existingDay = acc.find((entry) => entry.day === day);
      if (existingDay) {
        existingDay.tasks.push(task); // Добавляем задачу в существующий объект
      } else {
        acc.push({ day, tasks: [task] }); // Создаем новый объект для этой даты
      }

      return acc;
    },
    []
  );
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
    const task = tasksList?.find((task) => task.id === taskId);
    setSelectedTask(task);
    setOpenEditModal(true);
  };
  return (
    <>
      <Header />
      <div className="container mx-auto h-[calc(100vh-64px)] pt-[55px]">
        <div className="flex justify-between gap-14">
          <div className="w-[1120px] bg-[#2C3659] rounded-lg h-[calc(100vh-174px)]">
            <div className="flex items-center h-[40px] bg-[#28304D] rounded-lg mb-6">
              {['7 days', 'this week', '30 days', 'this month', 'max'].map(
                (range) => (
                  <button
                    key={range}
                    className={`${
                      chartTimeRange === range
                        ? 'bg-[#2C3659] text-white'
                        : 'bg-[#28304D] text-[#B0BAC9]'
                    } px-4 py-2`}
                    onClick={() => {
                      setChartTimeRange(range as chartTimeRanges);
                      refetchChartData();
                    }}
                  >
                    {range}
                  </button>
                )
              )}
            </div>
            <LifeChart chartData={chartData} isLoading={isLoadingChart} />
          </div>
          <div className="w-[550px] h-[calc(100vh-174px)] rounded-lg overflow-auto bg-[#2C3659] p-6 scrollbar-thin scrollbar-thumb-scrollbarThumb scrollbar-track-scrollbarTrack">
            <div className="flex items-center justify-between mb-4 gap-4">
              <button
                className="bg-[#28304D] h-[48px] px-4 py-2 rounded-lg text-white w-[50%]"
                onClick={handleOpenModal}
              >
                New Task
              </button>

              <button
                className="bg-[#28304D] h-[48px] px-4 py-2 rounded-lg text-white w-[50%]"
                onClick={() => {
                  setTimeRange((r: string) =>
                    r === 'today' ? 'max' : 'today'
                  );
                }}
              >
                {timeRange === 'max' ? 'Today' : 'Task History'}
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
              <>
                {timeRange === 'max' ? (
                  tasksByDay?.map((task) => (
                    <TaskHistoryCard
                      key={task.day}
                      date={task.day}
                      tasks={task.tasks}
                      clickHandler={() => handleEditTask(task.tasks[0].id)}
                    />
                  ))
                ) : tasksList?.length ? (
                  <TaskHistoryCard
                    key={tasksList[0].createdAt}
                    date={tasksList[0].createdAt.split('T')[0]}
                    tasks={tasksList}
                    clickHandler={() => handleEditTask(tasksList[0].id)}
                  />
                ) : (
                  <div className="text-center text-white bg-[#28304D] p-6 rounded-lg shadow-xl shadow-[#202842] mb-5">
                    <p>No tasks available.</p>
                    <p>
                      Click{' '}
                      <span
                        className="text-white underline"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setTimeRange('max')}
                      >
                        here
                      </span>{' '}
                      to view task history or{' '}
                      <span
                        className="text-white underline"
                        style={{ cursor: 'pointer' }}
                        onClick={handleOpenModal}
                      >
                        here
                      </span>{' '}
                      to add a new task.
                    </p>
                  </div>
                )}
              </>
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
        deleteTask={() => {
          deleteTask(selectedTask?.id);
          handleCloseEditModal();
        }}
        open={openEditModal}
        onClose={handleCloseEditModal}
        task={selectedTask}
        onSubmit={handleSaveTask}
      />
    </>
  );
};

export default Home;

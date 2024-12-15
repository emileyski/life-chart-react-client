import React from 'react';
import Checkbox from './Checkbox';
import { useChangeTaskStatusMutation } from '../state/api/tasksApi';
import EditIcon from '@mui/icons-material/Edit'; // Импорт иконки

interface TaskProps {
  id: string;
  title: string;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high' | 'highest';
  score: number;
  createdAt: string;
  isPositive: boolean;
  onClick: () => void; // Обработчик для клика по задаче
}

const Task: React.FC<TaskProps> = ({
  id,
  title,
  isCompleted,
  priority,
  score,
  createdAt,
  isPositive,
  onClick,
}) => {
  const pointColor = isPositive ? 'bg-[#31DF01]' : 'bg-[#FF0000]';
  const scoreText = isCompleted
    ? isPositive
      ? `+${score}`
      : `-${score}`
    : `${score}`;

  const [changeTaskStatus] = useChangeTaskStatusMutation();
  const determineIsTaskFromPast = (createdAt: string): boolean => {
    const taskDate = new Date(createdAt); // Дата задачи
    const todayStart = new Date(); // Текущая дата
    todayStart.setHours(0, 0, 0, 0); // Устанавливаем начало дня (00:00)

    return taskDate < todayStart; // true, если задача создана до сегодняшнего дня
  };
  const determineTypeAndChecked = ({
    isPositive,
    isCompleted,
    createdAt,
  }: {
    isPositive: boolean;
    isCompleted: boolean;
    createdAt: string;
  }): {
    type: 'positive' | 'negative' | undefined;
    checked: boolean;
  } => {
    // Проверяем, является ли задача старой (вчера или раньше)
    const isTaskFromPast = determineIsTaskFromPast(createdAt);

    // Определяем состояние "checked"
    const checked = isTaskFromPast || isCompleted;

    // Определяем тип задачи
    const type =
      (isCompleted || isTaskFromPast) && !(!isPositive && !isCompleted)
        ? 'positive'
        : isTaskFromPast && !isCompleted
        ? 'negative'
        : undefined;

    return { type, checked };
  };

  return (
    <div className="flex items-center justify-between bg-[#28304D] p-3 mb-4">
      <div className="flex items-center">
        <img
          src={`./priorities/${priority}.svg`}
          alt={`${priority} priority`}
          className="w-4 h-4 mr-2"
        />
        <span className="text-[16px] font-sans text-[#ffffff] mr-2">
          {title}
        </span>
        <div
          className={`h-[10px] w-[10px] rounded-full ${pointColor} mr-2`}
        ></div>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`text-[16px] mr-2 ${
            isCompleted
              ? isPositive
                ? 'text-[#31DF01]'
                : 'text-[#FF0000]'
              : 'text-[#ffffff]'
          }`}
        >
          {scoreText}
        </span>
        <Checkbox
          {...determineTypeAndChecked({ isPositive, isCompleted, createdAt })}
          onChange={async () => {
            // let newIsCompleted = null;

            // if (typeof isCompleted !== 'boolean') {
            //   newIsCompleted = isPositive ? true : false;
            // }

            // await changeTaskStatus({
            //   id,
            //   isCompleted: !newIsCompleted,
            // }).unwrap();

            await changeTaskStatus({
              id,
              isCompleted: !isCompleted,
            }).unwrap();
          }}
        />
        {/* иконка карандаша если она есть в mui*/}
        <EditIcon className="text-white cursor-pointer" onClick={onClick} />
      </div>
    </div>
  );
};

export default Task;

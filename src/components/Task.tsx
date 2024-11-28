import React from 'react';
import Checkbox from './Checkbox';

interface TaskProps {
  id: string;
  title: string;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high' | 'highest';
  score: number;
  isPositive: boolean;
  onClick: () => void; // Обработчик для клика по задаче
}

const Task: React.FC<TaskProps> = ({
  id,
  title,
  isCompleted,
  priority,
  score,
  isPositive,
  onClick,
}) => {
  const pointColor = isPositive ? 'bg-[#31DF01]' : 'bg-[#FF0000]';
  const scoreText = isCompleted
    ? isPositive
      ? `+${score}`
      : `-${score}`
    : `${score}`;

  return (
    <div
      className="flex items-center justify-between bg-[#28304D] p-3 mb-4 cursor-pointer"
      onClick={onClick} // Когда кликаем на задачу, передаем обработчик
    >
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
      <div className="flex items-center">
        <span
          className={`text-[16px] mr-3 ${
            isCompleted
              ? isPositive
                ? 'text-[#31DF01]'
                : 'text-[#FF0000]'
              : 'text-[#ffffff]'
          }`}
        >
          {scoreText}
        </span>
        <Checkbox checked={isCompleted} onChange={() => {}} />
      </div>
    </div>
  );
};

export default Task;

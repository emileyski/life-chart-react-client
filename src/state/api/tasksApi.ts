import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../store'; // Импортируй тип состояния
import { baseQueryWithReauth } from './authApi';

export interface Task {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  points: number;
  priority: 'low' | 'medium' | 'high' | 'highest';
  type: 'positive' | 'negative';
  isCompleted: boolean;
  isRegular: boolean;
  userId: string;
}

interface CreateTaskDto {
  title: string;
  description: string;
  points: number;
  priority: 'low' | 'medium' | 'high' | 'highest';
  type: 'positive' | 'negative';
  isRegular: boolean;
}

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Task'],
  endpoints: (builder) => ({
    getTask: builder.query<Task, { id: string }>({
      query: ({ id }) => ({
        url: `task/${id}`, // Запрос на получение задачи по ID
        method: 'GET',
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        // },
      }),
      providesTags: (result, error, { id }) => [{ type: 'Task', id }],
    }),
    getTasks: builder.query<Task[], { timeRange: 'today' | 'max' }>({
      query: ({ timeRange }) => ({
        url: `task?timeRange=${timeRange}`,
        method: 'GET',
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        // },
      }),
      providesTags: ['Task'],
    }),
    createTask: builder.mutation<Task, CreateTaskDto>({
      query: (data) => ({
        url: 'task',
        method: 'POST',
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        // },
        body: data,
      }),
      invalidatesTags: ['Task'],
    }),
    updateTask: builder.mutation<Task, Partial<Task>>({
      query: (data) => ({
        url: `task/${data.id}`, // Используем ID задачи
        method: 'PATCH',
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        // },
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Task', id }],
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          // Дождемся выполнения мутации
          const { data: updatedTask } = await queryFulfilled;

          // Сделаем запрос для получения полной задачи
          const { data: fullTask } = await dispatch(
            tasksApi.endpoints.getTask.initiate({ id: updatedTask.id })
          );

          // Обновляем данные в кэше для списка задач
          dispatch(
            tasksApi.util.updateQueryData(
              'getTasks',
              { timeRange: 'max' },
              (draft) => {
                const taskIndex = draft.findIndex(
                  (task) => fullTask && task.id === fullTask.id
                );
                if (taskIndex !== -1) {
                  if (fullTask) {
                    draft[taskIndex] = fullTask; // Заменяем задачу на полную версию
                  }
                }
              }
            )
          );
        } catch (error) {
          console.error('Error updating task in cache:', error);
        }
      },
    }),

    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `task/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task'],
    }),
    changeTaskStatus: builder.mutation<
      Task,
      { id: string; isCompleted: boolean }
    >({
      query: ({ id, isCompleted }) => ({
        url: `task/change-status/${id}`,
        method: 'POST',
        body: { isCompleted },
      }),
      // После успешного выполнения запроса обновляем кэш
      async onQueryStarted({ id, isCompleted }, { dispatch, queryFulfilled }) {
        try {
          // Дождёмся выполнения запроса
          const { data } = await queryFulfilled;

          // Обновляем список задач в кэше
          dispatch(
            tasksApi.util.updateQueryData(
              'getTasks',
              { timeRange: 'max' }, // или другой используемый фильтр
              (draft) => {
                const task = draft.find((t) => t.id === id);
                if (task) {
                  task.isCompleted = isCompleted;
                }
              }
            )
          );

          dispatch(
            tasksApi.util.updateQueryData(
              'getTasks',
              { timeRange: 'today' }, // или другой используемый фильтр
              (draft) => {
                const task = draft.find((t) => t.id === id);
                if (task) {
                  task.isCompleted = isCompleted;
                }
              }
            )
          );
        } catch (error) {
          console.error('Failed to update task status in cache:', error);
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Task', id }],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useGetTaskQuery, // Хук для получения одной задачи
  useDeleteTaskMutation,
  useChangeTaskStatusMutation,
} = tasksApi;

import { setLoading, logout, setAuthorized } from './state/authSlice';
import { authApi } from './state/api/authApi';
import { AppDispatch } from './store';

export const initializeAuth = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true)); // Устанавливаем состояние загрузки
  // debugger;
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (!accessToken || !refreshToken) {
    dispatch(logout()); // Выход, если токены отсутствуют
    dispatch(setLoading(false));

    localStorage.removeItem('accessToken'); // Удаляем токены из localStorage
    localStorage.removeItem('refreshToken');
    return;
  }

  try {
    const response = await dispatch(
      authApi.endpoints.refreshToken.initiate(refreshToken)
    ).unwrap();

    localStorage.setItem('accessToken', response.accessToken); // Обновляем токены
    localStorage.setItem('refreshToken', response.refreshToken);

    dispatch(setAuthorized(true)); // Обновляем состояние авторизации
  } catch (error) {
    dispatch(logout()); // Если обновить токены не удалось, выходим
  } finally {
    dispatch(setLoading(false)); // Снимаем состояние загрузки
  }
};

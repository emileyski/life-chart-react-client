import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeAuth } from './initializeAuth';
import { AppRouter } from './AppRouter';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // initializeAuth()(dispatch);
    async function initialize() {
      await initializeAuth()(dispatch);
    }

    initialize();
  }, [dispatch]);

  return <AppRouter />;
};

export default App;

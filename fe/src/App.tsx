import React from 'react';
import { useSelector } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import { CssBaseline, CssVarsProvider, LinearProgress } from '@mui/joy';

import './App.css';
import { GlobalState } from './store/index.store';
import { theme } from './utilities/customTheme';
import router from './routes/index.route';
import ToastContainer from './components/UI/ToastContainer';

const App: React.FC = () => {
  const showLoader = useSelector((state: GlobalState) => state.ui.showLoader);

  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      {showLoader && (
        <LinearProgress
          className='linear-progress-bar'
          variant='soft'
          size='sm'
        />
      )}
      <ToastContainer />
      <RouterProvider router={router} />
    </CssVarsProvider>
  );
};

export default App;

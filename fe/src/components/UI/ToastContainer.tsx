import { useColorScheme } from '@mui/joy';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer as Toast } from 'react-toastify';

const ToastContainer: React.FC = () => {
  const { mode } = useColorScheme();

  return (
    <Toast
      position='top-right'
      autoClose={8000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={mode === 'dark' ? 'dark' : 'light'}
    />
  );
};

export default ToastContainer;

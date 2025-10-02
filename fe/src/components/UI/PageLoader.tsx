import { Box, CircularProgress } from '@mui/joy';

const PageLoader: React.FC = () => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        height: '80vh',
        padding: '0.25rem 0rem',
      }}
    >
      <CircularProgress sx={{ margin: 'auto' }} />
    </Box>
  );
};

export default PageLoader;

import { Box } from '@mui/joy';

import Error from '../../components/Error/Error';
import notFound from '../../assets/images/not-found.svg';
import { constants } from '../../constants/index.constants';
import { ColorSchemeToggle } from '../../components/UI/ColorSchemeToggle';

const Error404Page: React.FC = () => {
  return (
    <>
      <Box sx={{ position: 'fixed', right: 16, top: 16 }}>
        <ColorSchemeToggle />
      </Box>
      <Error
        title='404!'
        message={constants.texts.errorMessages.notFoundError}
        image={notFound}
        actionURL='/'
        showAction={true}
        actionText='Back Home Page'
      />
    </>
  );
};

export default Error404Page;

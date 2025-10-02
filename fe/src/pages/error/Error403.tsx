import { Box } from '@mui/joy';

import forbidden from '../../assets/images/forbidden.svg';
import Error from '../../components/Error/Error';
import { ColorSchemeToggle } from '../../components/UI/ColorSchemeToggle';
import { constants } from '../../constants/index.constants';

const Error403Page: React.FC = () => {
  return (
    <>
      <Box sx={{ position: 'fixed', right: 16, top: 16 }}>
        <ColorSchemeToggle />
      </Box>
      <Error
        title='403!'
        message={constants.texts.errorMessages.forbiddenError}
        image={forbidden}
        actionURL='/sign-in'
        showAction={true}
        actionText='Back Home Page'
      />
    </>
  );
};

export default Error403Page;

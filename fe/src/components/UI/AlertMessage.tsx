import * as React from 'react';

import Alert, { AlertProps } from '@mui/joy/Alert';

const AlertMessage = React.forwardRef<HTMLDivElement, AlertProps>(
  function AlertMessage(props, refs) {
    return <Alert sx={{ mt: 1 }} variant='soft' {...props} />;
  }
);

export default AlertMessage;

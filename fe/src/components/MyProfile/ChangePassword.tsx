import {
  Box,
  Button,
  Card,
  CardActions,
  CardOverflow,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
  Typography,
} from '@mui/joy';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { IFieldError } from '../../interfaces/forms.interface';
import { uiActions } from '../../store/slices/ui.slice';
import { changePassword } from '../../services/user.service';
import { constants } from '../../constants/index.constants';
import { toast } from 'react-toastify';
import { InfoOutlined } from '@mui/icons-material';

const ChangePassword: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<IFieldError[]>();
  const [passwords, setPasswords] = useState<{
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }>({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  useEffect(() => {
    if (isLoading) {
      dispatch(uiActions.addLoader());
    } else {
      dispatch(uiActions.removeLoader());
    }
  }, [dispatch, isLoading]);

  const discardAllChanges = () => {
    setPasswords({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    });
    setFormErrors([]);
  };

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords((passwords) => ({
      ...passwords,
      [event.target.name]: event.target.value,
    }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setFormErrors([]);
    setIsLoading(true);

    const response = await changePassword(
      passwords.currentPassword,
      passwords.newPassword,
      passwords.confirmNewPassword
    );

    if (
      response.statusCode === constants.api.httpStatusCodes.unprocessableEntity
    ) {
      setFormErrors(response.fromErrors?.fields);
    } else if (response.statusCode === constants.api.httpStatusCodes.ok) {
      toast.success('Password has been changed successfully.');
    } else {
      toast.error(response.message);
    }

    setIsLoading(false);
  };

  const currentPasswordError = formErrors?.find(
    (error) => error.name === 'currentPassword' && error.showOnElement
  );

  const newPasswordError = formErrors?.find(
    (error) => error.name === 'newPassword' && error.showOnElement
  );

  const confirmNewPasswordError = formErrors?.find(
    (error) => error.name === 'confirmNewPassword' && error.showOnElement
  );

  return (
    <Stack
      spacing={4}
      sx={{
        display: 'flex',
        maxWidth: { xs: '100%', md: '1000px' },
        mx: { xs: 'auto', md: 'auto' },
        px: { xs: 2, md: 4 },
        py: { xs: 2, md: 3 },
      }}
    >
      <Card>
        <Box sx={{ mb: 1 }}>
          <Typography level='title-md'>Change Password</Typography>
        </Box>
        <Divider />
        <Stack direction='row' spacing={3} sx={{ display: 'flex', my: 1 }}>
          <Stack spacing={2} sx={{ flexGrow: 1 }}>
            <Stack
              sx={{
                display: 'flex',
                flexDirection: { md: 'row', xs: 'column' },
                gap: 3,
              }}
            >
              <FormControl sx={{ flexGrow: 1 }} error={!!currentPasswordError}>
                <FormLabel>Current Password</FormLabel>
                <Input
                  size='sm'
                  type='password'
                  name='currentPassword'
                  value={passwords.currentPassword}
                  onChange={changeHandler}
                />
                {!!currentPasswordError && (
                  <FormHelperText>
                    <InfoOutlined />
                    {currentPasswordError?.error}
                  </FormHelperText>
                )}
              </FormControl>
            </Stack>
            <Stack
              sx={{
                display: 'flex',
                flexDirection: { md: 'row', xs: 'column' },
                gap: 3,
              }}
            >
              <FormControl sx={{ flexGrow: 1 }} error={!!newPasswordError}>
                <FormLabel>New Password</FormLabel>
                <Input
                  size='sm'
                  type='password'
                  name='newPassword'
                  value={passwords.newPassword}
                  slotProps={{
                    input: {
                      maxLength: 20,
                    },
                  }}
                  onChange={changeHandler}
                />
                <FormHelperText>
                  Make sure it's a secure password and stored in a safe place.
                </FormHelperText>
                {!!newPasswordError && (
                  <FormHelperText>
                    <InfoOutlined />
                    {newPasswordError?.error}
                  </FormHelperText>
                )}
              </FormControl>
            </Stack>
            <Stack
              sx={{
                display: 'flex',
                flexDirection: { md: 'row', xs: 'column' },
                gap: 3,
              }}
            >
              <FormControl
                sx={{ flexGrow: 1 }}
                error={!!confirmNewPasswordError}
              >
                <FormLabel>Confirm New Password</FormLabel>
                <Input
                  size='sm'
                  type='password'
                  name='confirmNewPassword'
                  value={passwords.confirmNewPassword}
                  slotProps={{
                    input: {
                      maxLength: 20,
                    },
                  }}
                  onChange={changeHandler}
                />
                {!!confirmNewPasswordError && (
                  <FormHelperText>
                    <InfoOutlined />
                    {confirmNewPasswordError?.error}
                  </FormHelperText>
                )}
              </FormControl>
            </Stack>
          </Stack>
        </Stack>
        <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
          <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
            <Button
              size='sm'
              variant='outlined'
              color='neutral'
              onClick={discardAllChanges}
            >
              Discard
            </Button>
            <Button size='sm' variant='solid' onClick={onSubmit}>
              Change Password
            </Button>
          </CardActions>
        </CardOverflow>
      </Card>
    </Stack>
  );
};

export default ChangePassword;

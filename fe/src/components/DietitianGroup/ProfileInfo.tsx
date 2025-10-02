import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

import {
  Button,
  Card,
  CardActions,
  CardOverflow,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
} from '@mui/joy';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded';
import PermPhoneMsgRoundedIcon from '@mui/icons-material/PermPhoneMsgRounded';
import { InfoOutlined } from '@mui/icons-material';
import { toast } from 'react-toastify';

import { IDietitianGroupProfile } from '../../interfaces/dietitianGroup.interface';
import { IFieldError } from '../../interfaces/forms.interface';
import { uiActions } from '../../store/slices/ui.slice';
import {
  getDietitianGroupProfile,
  updateDietitianGroupProfile,
} from '../../services/dietitianGroup.service';
import { constants } from '../../constants/index.constants';

const ProfileInfo: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [dietitianGroupProfile, setDietitianGroupProfile] =
    useState<IDietitianGroupProfile>({
      name: '',
      code: '',
      tagLine: '',
      email: '',
      contactNumber: '',
      whatsAppNumber: undefined,
    });

  const [initialDietitianGroupProfile, setInitialDietitianGroupProfile] =
    useState<IDietitianGroupProfile>({
      name: '',
      code: '',
      tagLine: '',
      email: '',
      contactNumber: '',
      whatsAppNumber: undefined,
    });

  const [formErrors, setFormErrors] = useState<IFieldError[]>();

  useEffect(() => {
    if (isLoading) {
      dispatch(uiActions.addLoader());
    } else {
      dispatch(uiActions.removeLoader());
    }
  }, [dispatch, isLoading]);

  useEffect(() => {
    const fetchDietitianGroupProfile = async () => {
      setIsLoading(true);

      const response = await getDietitianGroupProfile();

      if (response.statusCode === constants.api.httpStatusCodes.ok) {
        const profile = response.payload;
        if (profile) {
          setDietitianGroupProfile(profile);
          setInitialDietitianGroupProfile(profile);
        }
      }

      setIsLoading(false);
    };

    fetchDietitianGroupProfile();
  }, []);

  const discardAllChanges = () => {
    setDietitianGroupProfile(initialDietitianGroupProfile);
    setFormErrors([]);
  };

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDietitianGroupProfile((profile) => ({
      ...profile,
      [event.target.name]: event.target.value,
    }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setFormErrors([]);
    setIsLoading(true);

    const response = await updateDietitianGroupProfile(dietitianGroupProfile);

    if (
      response.statusCode === constants.api.httpStatusCodes.unprocessableEntity
    ) {
      setFormErrors(response.fromErrors?.fields);
    } else if (response.statusCode === constants.api.httpStatusCodes.ok) {
      setInitialDietitianGroupProfile(dietitianGroupProfile);
      toast.success('Profile info updated successfully.');
    } else {
      toast.error(response.message);
    }

    setIsLoading(false);
  };

  const emailError = formErrors?.find(
    (error) => error.name === 'email' && error.showOnElement
  );

  const contactNumberError = formErrors?.find(
    (error) => error.name === 'contactNumber' && error.showOnElement
  );

  const whatsAppNumberError = formErrors?.find(
    (error) => error.name === 'whatsAppNumber' && error.showOnElement
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
        <Stack direction='row' spacing={3} sx={{ display: 'flex', my: 1 }}>
          <Stack spacing={2} sx={{ flexGrow: 1 }}>
            <Stack
              sx={{
                display: 'flex',
                flexDirection: { md: 'row', xs: 'column' },
                gap: 2,
              }}
            >
              <FormControl sx={{ flex: 1 }}>
                <FormLabel>Name</FormLabel>
                <Input size='sm' disabled value={dietitianGroupProfile.name} />
              </FormControl>
              <FormControl sx={{ flex: 1 }}>
                <FormLabel>Code</FormLabel>
                <Input size='sm' disabled value={dietitianGroupProfile.code} />
              </FormControl>
            </Stack>
            <Stack
              sx={{
                display: 'flex',
                flexDirection: { md: 'row', xs: 'column' },
                gap: 2,
              }}
            >
              <FormControl sx={{ flex: 1 }}>
                <FormLabel>Tag Line</FormLabel>
                <Input
                  size='sm'
                  type='text'
                  name='tagLine'
                  slotProps={{
                    input: {
                      maxLength: 127,
                    },
                  }}
                  value={dietitianGroupProfile.tagLine || ''}
                  onChange={changeHandler}
                />
              </FormControl>
              <FormControl error={!!emailError} sx={{ flex: 1 }}>
                <FormLabel>Email Address</FormLabel>
                <Input
                  name='email'
                  size='sm'
                  type='email'
                  startDecorator={<EmailRoundedIcon />}
                  slotProps={{
                    input: {
                      maxLength: 100,
                    },
                  }}
                  value={dietitianGroupProfile.email || ''}
                  onChange={changeHandler}
                  sx={{ maxWidth: '100%' }}
                />
                {!!emailError && (
                  <FormHelperText>
                    <InfoOutlined />
                    {emailError?.error}
                  </FormHelperText>
                )}
              </FormControl>
            </Stack>
            <Stack
              sx={{
                display: 'flex',
                flexDirection: { md: 'row', xs: 'column' },
                gap: 2,
              }}
            >
              <FormControl sx={{ flex: 1 }} error={!!contactNumberError}>
                <FormLabel>Contact Number</FormLabel>
                <Input
                  name='contactNumber'
                  size='sm'
                  type='tel'
                  placeholder='+91 12345 67890'
                  startDecorator={<LocalPhoneRoundedIcon />}
                  value={dietitianGroupProfile.contactNumber || ''}
                  onChange={changeHandler}
                  slotProps={{
                    input: {
                      maxLength: 15,
                    },
                  }}
                />
                {!!contactNumberError && (
                  <FormHelperText>
                    <InfoOutlined />
                    {contactNumberError?.error}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl sx={{ flex: 1 }} error={!!whatsAppNumberError}>
                <FormLabel>WhatsApp Number</FormLabel>
                <Input
                  name='whatsAppNumber'
                  size='sm'
                  type='tel'
                  placeholder='+91 12345 67890'
                  startDecorator={<PermPhoneMsgRoundedIcon />}
                  value={dietitianGroupProfile.whatsAppNumber || ''}
                  onChange={changeHandler}
                  slotProps={{
                    input: {
                      maxLength: 15,
                    },
                  }}
                />
                {!!whatsAppNumberError && (
                  <FormHelperText>
                    <InfoOutlined />
                    {whatsAppNumberError?.error}
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
              Save Changes
            </Button>
          </CardActions>
        </CardOverflow>
      </Card>
    </Stack>
  );
};

export default ProfileInfo;

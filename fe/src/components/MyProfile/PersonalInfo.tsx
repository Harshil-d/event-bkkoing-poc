import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  Button,
  Card,
  CardActions,
  CardOverflow,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Option,
  Select,
  Stack,
} from '@mui/joy';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import { InfoOutlined } from '@mui/icons-material';
import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded';
import PermPhoneMsgRoundedIcon from '@mui/icons-material/PermPhoneMsgRounded';
import { toast } from 'react-toastify';

import { ILookupItem } from '../../interfaces/lookup.interface';
import { uiActions } from '../../store/slices/ui.slice';
import { getGenderList } from '../../services/lookup.service';
import { constants } from '../../constants/index.constants';
import {
  getUserProfile,
  updateUserPersonalInfo,
} from '../../services/user.service';
import { IUserProfile } from '../../interfaces/user.interface';
import { IFieldError } from '../../interfaces/forms.interface';

const PersonalInfo: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [genders, setGenders] = useState<ILookupItem[]>([]);
  const [userDetails, setUserDetails] = useState<IUserProfile>({
    userName: '',
    email: '',
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    dob: '',
    contactNumber: '',
    whatsAppNumber: undefined,
    role: '',
    organizationName: '',
  });
  const [initialUserDetails, setInitialUserDetails] = useState<IUserProfile>({
    userName: '',
    email: '',
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    dob: '',
    contactNumber: '',
    whatsAppNumber: '',
    role: '',
    organizationName: '',
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
    const fetchGenders = async () => {
      setIsLoading(true);

      const response = await getGenderList();

      if (response.statusCode === constants.api.httpStatusCodes.ok) {
        const genders = response.payload || [];
        setGenders(genders);

        return genders;
      }

      setIsLoading(false);
    };

    const fetchUserProfile = async (genders: ILookupItem[]) => {
      setIsLoading(true);

      const response = await getUserProfile();

      if (response.statusCode === constants.api.httpStatusCodes.ok) {
        const profile = response.payload;
        if (profile) {
          setUserDetails(profile);
          setInitialUserDetails(profile);
        } else {
          const profile = {
            userName: '',
            email: '',
            firstName: '',
            middleName: '',
            lastName: '',
            gender: genders[0]?.value || '',
            dob: '',
            contactNumber: '',
            whatsAppNumber: '',
            role: '',
            organizationName: '',
          };
          setUserDetails(profile);
          setInitialUserDetails(profile);
        }
      }

      setIsLoading(false);
    };

    const fetchData = async () => {
      const genders = await fetchGenders();
      await fetchUserProfile(genders || []);
    };

    fetchData();
  }, []);

  const discardAllChanges = () => {
    setUserDetails(initialUserDetails);
    setFormErrors([]);
  };

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails((user) => ({
      ...user,
      [event.target.name]: event.target.value,
    }));
  };

  const handleGenderChange = (_: any, value: any) => {
    setUserDetails((user) => ({
      ...user,
      gender: value,
    }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setFormErrors([]);
    setIsLoading(true);

    const response = await updateUserPersonalInfo(userDetails);

    if (
      response.statusCode === constants.api.httpStatusCodes.unprocessableEntity
    ) {
      setFormErrors(response.fromErrors?.fields);
    } else if (response.statusCode === constants.api.httpStatusCodes.ok) {
      setInitialUserDetails(userDetails);
      toast.success('Personal info updated successfully.');
    } else {
      toast.error(response.message);
    }

    setIsLoading(false);
  };

  const firstNameError = formErrors?.find(
    (error) => error.name === 'firstName' && error.showOnElement
  );

  const dobError = formErrors?.find(
    (error) => error.name === 'dob' && error.showOnElement
  );

  const contactNumberError = formErrors?.find(
    (error) => error.name === 'contactNumber' && error.showOnElement
  );

  const whatsAppNumberError = formErrors?.find(
    (error) => error.name === 'whatsAppNumber' && error.showOnElement
  );

  const emailError = formErrors?.find(
    (error) => error.name === 'email' && error.showOnElement
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
        <Stack spacing={2} sx={{ flexGrow: 1 }}>
          <Stack spacing={1}>
            <FormLabel>Name</FormLabel>
            <Stack
              sx={{
                display: 'flex',
                flexDirection: { lg: 'row', xs: 'column' },
                gap: 2,
              }}
            >
              <FormControl sx={{ flex: 1 }} error={!!firstNameError}>
                <Input
                  name='firstName'
                  size='sm'
                  placeholder='First name'
                  value={userDetails.firstName || ''}
                  onChange={changeHandler}
                  slotProps={{
                    input: {
                      maxLength: 40,
                    },
                  }}
                />
                {!!firstNameError && (
                  <FormHelperText>
                    <InfoOutlined />
                    {firstNameError?.error}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl sx={{ flex: 1 }}>
                <Input
                  name='middleName'
                  size='sm'
                  placeholder='Middle name'
                  value={userDetails.middleName || ''}
                  onChange={changeHandler}
                  slotProps={{
                    input: {
                      maxLength: 40,
                    },
                  }}
                />
              </FormControl>
              <FormControl sx={{ flex: 1 }}>
                <Input
                  name='lastName'
                  size='sm'
                  placeholder='Last name'
                  value={userDetails.lastName || ''}
                  onChange={changeHandler}
                  slotProps={{
                    input: {
                      maxLength: 40,
                    },
                  }}
                />
              </FormControl>
            </Stack>
          </Stack>
          <Stack
            sx={{
              display: 'flex',
              flexDirection: { md: 'row', xs: 'column' },
              gap: 2,
            }}
          >
            <FormControl sx={{ flex: 1 }}>
              <FormLabel>Gender</FormLabel>
              <Select
                name='gender'
                size='sm'
                value={userDetails.gender || ''}
                onChange={handleGenderChange}
              >
                {genders.map((gender, index) => (
                  <Option key={index} value={gender.value}>
                    {gender.text}
                  </Option>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ flex: 1 }} error={!!dobError}>
              <FormLabel>Date of Birth</FormLabel>
              <Input
                name='dob'
                size='sm'
                type='date'
                placeholder='Date of Birth'
                value={userDetails.dob || ''}
                sx={{ flexGrow: 1 }}
                onChange={changeHandler}
              />
              {!!dobError && (
                <FormHelperText>
                  <InfoOutlined />
                  {dobError?.error}
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
                value={userDetails.contactNumber || ''}
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
                value={userDetails.whatsAppNumber || ''}
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
          <Stack>
            <FormControl error={!!emailError}>
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
                value={userDetails.email || ''}
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

export default PersonalInfo;

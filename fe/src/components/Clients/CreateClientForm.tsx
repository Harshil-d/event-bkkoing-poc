import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  Button,
  Card,
  CardActions,
  CardOverflow,
  Checkbox,
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
import { IFieldError } from '../../interfaces/forms.interface';
import { IDietitianListItem } from '../../interfaces/dietitian.interface';
import { getAllDietitianList } from '../../services/dietitian.service';
import {
  IClientListItem,
  IClientPersonalDetails,
} from '../../interfaces/client.interface';
import { createClient, getAllClientList } from '../../services/client.service';
import { useNavigate } from 'react-router-dom';

const CreateClientForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [genders, setGenders] = useState<ILookupItem[]>([]);
  const [dietitians, setDietitians] = useState<IDietitianListItem[]>([]);
  const [clients, setClients] = useState<IClientListItem[]>([]);
  const [clientDetails, setClientDetails] = useState<IClientPersonalDetails>({
    email: '',
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    dob: '',
    contactNumber: '',
    whatsAppNumber: '',
    occupation: '',
    linkedClientId: 0,
    referredByClientId: 0,
    dietitianId: 0,
    isActive: true,
  });
  const [initialClientDetails] = useState<IClientPersonalDetails>({
    email: '',
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    dob: '',
    contactNumber: '',
    whatsAppNumber: '',
    occupation: '',
    linkedClientId: 0,
    referredByClientId: 0,
    dietitianId: 0,
    isActive: true,
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
      const response = await getGenderList();

      if (response.statusCode === constants.api.httpStatusCodes.ok) {
        setGenders(response.payload || []);
      }
    };

    const fetchAllDietitianList = async () => {
      const response = await getAllDietitianList();

      if (response.statusCode === constants.api.httpStatusCodes.ok) {
        setDietitians(response.payload || []);
      }
    };

    const fetchAllClientList = async () => {
      const response = await getAllClientList();

      if (response.statusCode === constants.api.httpStatusCodes.ok) {
        setClients(response.payload || []);
      }
    };

    const fetchAllData = async () => {
      setIsLoading(true);

      await Promise.all([
        fetchGenders(),
        fetchAllDietitianList(),
        fetchAllClientList(),
      ]);

      setIsLoading(false);
    };

    fetchAllData();
  }, []);

  const discardAllChanges = () => {
    setClientDetails(initialClientDetails);
    setFormErrors([]);
  };

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClientDetails((user) => ({
      ...user,
      [event.target.name]: event.target.value,
    }));
  };

  const handleIsActiveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClientDetails((user) => ({
      ...user,
      [event.target.name]: event.target.checked,
    }));
  };

  const handleGenderChange = (_: any, value: any) => {
    setClientDetails((user) => ({
      ...user,
      gender: value,
    }));
  };

  const handleDietitianChange = (_: any, value: any) => {
    setClientDetails((user) => ({
      ...user,
      dietitianId: value,
    }));
  };

  const handleLinkedClientChange = (_: any, value: any) => {
    setClientDetails((user) => ({
      ...user,
      linkedClientId: value,
    }));
  };

  const handleReferredByClientChange = (_: any, value: any) => {
    setClientDetails((user) => ({
      ...user,
      referredByClientId: value,
    }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setFormErrors([]);
    setIsLoading(true);

    const response = await createClient(clientDetails);

    if (
      response.statusCode === constants.api.httpStatusCodes.unprocessableEntity
    ) {
      setFormErrors(response.fromErrors?.fields);
    } else if (response.statusCode === constants.api.httpStatusCodes.created) {
      const id = response.payload?.id;
      toast.success('Client created successfully.');
      navigate(`/clients/${id}`);
    } else {
      toast.error(response.message);
    }

    setIsLoading(false);
  };

  const firstNameError = formErrors?.find(
    (error) => error.name === 'firstName' && error.showOnElement
  );

  const genderError = formErrors?.find(
    (error) => error.name === 'gender' && error.showOnElement
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

  const dietitianIdError = formErrors?.find(
    (error) => error.name === 'dietitianId' && error.showOnElement
  );

  const occupationError = formErrors?.find(
    (error) => error.name === 'occupation' && error.showOnElement
  );

  return (
    <Stack
      spacing={4}
      sx={{
        display: 'flex',
        maxWidth: { xs: '100%', md: '1000px' },
        width: { xs: '100%', md: 'auto' },
        mx: { xs: 'auto', md: 'auto' },
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
                  value={clientDetails.firstName || ''}
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
                  value={clientDetails.middleName || ''}
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
                  value={clientDetails.lastName || ''}
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
            <FormControl sx={{ flex: 1 }} error={!!genderError}>
              <FormLabel>Gender</FormLabel>
              <Select
                name='gender'
                size='sm'
                value={clientDetails.gender || ''}
                onChange={handleGenderChange}
              >
                {genders.map((gender, index) => (
                  <Option key={index} value={gender.value}>
                    {gender.text}
                  </Option>
                ))}
              </Select>
              {!!genderError && (
                <FormHelperText>
                  <InfoOutlined />
                  {genderError?.error}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl sx={{ flex: 1 }} error={!!dobError}>
              <FormLabel>Date of Birth</FormLabel>
              <Input
                name='dob'
                size='sm'
                type='date'
                placeholder='Date of Birth'
                value={clientDetails.dob || ''}
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
                value={clientDetails.contactNumber || ''}
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
                value={clientDetails.whatsAppNumber || ''}
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
          <Stack
            sx={{
              display: 'flex',
              flexDirection: { md: 'row', xs: 'column' },
              gap: 2,
            }}
          >
            <FormControl sx={{ flex: 1 }} error={!!emailError}>
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
                value={clientDetails.email || ''}
                onChange={changeHandler}
              />
              {!!emailError && (
                <FormHelperText>
                  <InfoOutlined />
                  {emailError?.error}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl sx={{ flex: 1 }} error={!!occupationError}>
              <FormLabel>Occupation</FormLabel>
              <Input
                name='occupation'
                size='sm'
                type='text'
                slotProps={{
                  input: {
                    maxLength: 100,
                  },
                }}
                value={clientDetails.occupation || ''}
                onChange={changeHandler}
              />
              {!!occupationError && (
                <FormHelperText>
                  <InfoOutlined />
                  {occupationError?.error}
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
            <FormControl size='sm' sx={{ flex: 1 }} error={!!dietitianIdError}>
              <FormLabel>Dietitian</FormLabel>
              <Select
                size='sm'
                name='dietitian'
                slotProps={{
                  button: { sx: { whiteSpace: 'nowrap' } },
                }}
                value={clientDetails.dietitianId}
                onChange={handleDietitianChange}
              >
                {dietitians.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {`${item.firstName} ${item.lastName}`.trim()}
                  </Option>
                ))}
              </Select>
              {!!dietitianIdError && (
                <FormHelperText>
                  <InfoOutlined />
                  {dietitianIdError?.error}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl size='sm' sx={{ flex: 1 }}>
              <FormLabel>Linked Client</FormLabel>
              <Select
                size='sm'
                name='linkedClientId'
                slotProps={{
                  button: { sx: { whiteSpace: 'nowrap' } },
                }}
                value={clientDetails.linkedClientId}
                onChange={handleLinkedClientChange}
              >
                <Option key={0} value={0}></Option>
                {clients.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {`${item.firstName} ${item.lastName}`.trim()}
                  </Option>
                ))}
              </Select>
            </FormControl>
            <FormControl size='sm' sx={{ flex: 1 }}>
              <FormLabel>Referred By Client</FormLabel>
              <Select
                size='sm'
                name='referredByClientId'
                slotProps={{
                  button: { sx: { whiteSpace: 'nowrap' } },
                }}
                value={clientDetails.referredByClientId}
                onChange={handleReferredByClientChange}
              >
                <Option key={0} value={0}></Option>
                {clients.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {`${item.firstName} ${item.lastName}`.trim()}
                  </Option>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Stack
            sx={{
              display: 'flex',
              flexDirection: { md: 'row', xs: 'column' },
              gap: 2,
            }}
          >
            <FormControl size='sm' sx={{ flex: 1 }}>
              <Checkbox
                name='isActive'
                label='Is Client Active?'
                checked={clientDetails.isActive}
                onChange={handleIsActiveChange}
              />
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
            <Button
              size='sm'
              variant='solid'
              onClick={onSubmit}
              loading={isLoading}
            >
              Create Client
            </Button>
          </CardActions>
        </CardOverflow>
      </Card>
    </Stack>
  );
};

export default CreateClientForm;

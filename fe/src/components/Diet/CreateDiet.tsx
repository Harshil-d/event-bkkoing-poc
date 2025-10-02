import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import Stack from '@mui/joy/Stack';
import {
  Divider,
  FormHelperText,
  ModalClose,
  Option,
  Select,
  Textarea,
} from '@mui/joy';

import { IClientListItem } from '../../interfaces/client.interface';
import { uiActions } from '../../store/slices/ui.slice';
import { getAllClientList } from '../../services/client.service';
import { constants } from '../../constants/index.constants';
import { ILookupItem } from '../../interfaces/lookup.interface';
import {
  getDietaryHabitsList,
  getDietPreferencesList,
} from '../../services/lookup.service';
import { IDiet } from '../../interfaces/diet.interface';
import { IFieldError } from '../../interfaces/forms.interface';
import { createDiet } from '../../services/diet.service';
import { toast } from 'react-toastify';
import { InfoOutlined } from '@mui/icons-material';

export interface ICreateDietProps {
  open: boolean;
  setOpen(open: boolean): void;
}

const CreateDiet: React.FC<ICreateDietProps> = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<IClientListItem[]>([]);
  const [dietPreferences, setDietPreferences] = useState<ILookupItem[]>([]);
  const [dietaryHabits, setDietaryHabits] = useState<ILookupItem[]>([]);
  const [data, setData] = useState<IDiet>({
    clientId: 0,
    dietPreference: '',
    dietaryHabit: '',
    notes: '',
    startDate: '',
    endDate: '',
  });
  const [initialData, setInitialData] = useState<IDiet>({
    clientId: 0,
    dietPreference: '',
    dietaryHabit: '',
    notes: '',
    startDate: '',
    endDate: '',
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
    const fetchAllClientList = async () => {
      const response = await getAllClientList();

      if (response.statusCode === constants.api.httpStatusCodes.ok) {
        setClients(response.payload || []);
      }
    };

    const fetchDietPreferencesList = async () => {
      const response = await getDietPreferencesList();

      if (response.statusCode === constants.api.httpStatusCodes.ok) {
        setDietPreferences(response.payload || []);
      }
    };

    const fetchDietaryHabitsList = async () => {
      const response = await getDietaryHabitsList();

      if (response.statusCode === constants.api.httpStatusCodes.ok) {
        setDietaryHabits(response.payload || []);
      }
    };

    fetchAllClientList();
    fetchDietPreferencesList();
    fetchDietaryHabitsList();
  }, []);

  const discardAllChanges = () => {
    setData(initialData);
    setFormErrors([]);
  };

  const changeHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setData((diet) => ({
      ...diet,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSelectChange = (name: string, value: any) => {
    setData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setFormErrors([]);
    setIsLoading(true);

    const response = await createDiet(data);

    if (
      response.statusCode === constants.api.httpStatusCodes.unprocessableEntity
    ) {
      setFormErrors(response.fromErrors?.fields);
    } else if (response.statusCode === constants.api.httpStatusCodes.created) {
      toast.success('Dietary created successfully.');
      setData({
        clientId: 0,
        dietPreference: '',
        dietaryHabit: '',
        notes: '',
        startDate: '',
        endDate: '',
      });
      setInitialData({
        clientId: 0,
        dietPreference: '',
        dietaryHabit: '',
        notes: '',
        startDate: '',
        endDate: '',
      });
    } else {
      toast.error(response.message);
    }

    setIsLoading(false);
  };

  const clientIdError = formErrors?.find(
    (error) => error.name === 'clientId' && error.showOnElement
  );

  const dietPreferenceError = formErrors?.find(
    (error) => error.name === 'dietPreference' && error.showOnElement
  );

  const dietaryHabitError = formErrors?.find(
    (error) => error.name === 'dietaryHabit' && error.showOnElement
  );

  const startDateError = formErrors?.find(
    (error) => error.name === 'startDate' && error.showOnElement
  );

  const endDateError = formErrors?.find(
    (error) => error.name === 'endDate' && error.showOnElement
  );

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog
        size={'sm'}
        sx={{
          width: '50%',
        }}
      >
        <Stack
          sx={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '4px',
            paddingBottom: '10px',
          }}
        >
          <DialogTitle>Create new diet</DialogTitle>
          <ModalClose variant='outlined' sx={{ top: 'auto', right: '14px' }} />
        </Stack>
        <Divider sx={{ mb: 1.5 }} />
        <Stack
          sx={{
            display: 'flex',
            flexDirection: { md: 'row', xs: 'column' },
            gap: 2,
          }}
        >
          <FormControl sx={{ flex: 1 }} error={!!clientIdError}>
            <FormLabel>Client</FormLabel>
            <Select
              size='sm'
              name='clientId'
              slotProps={{
                button: { sx: { whiteSpace: 'nowrap' } },
              }}
              value={data.clientId}
              onChange={(_: any, value: any) =>
                handleSelectChange('clientId', value)
              }
            >
              {clients.map((item) => (
                <Option key={item.id} value={item.id}>
                  {`${item.firstName} ${item.lastName}`.trim()}
                </Option>
              ))}
            </Select>
            {!!clientIdError && (
              <FormHelperText>
                <InfoOutlined />
                {clientIdError?.error}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl sx={{ flex: 1 }} error={!!dietPreferenceError}>
            <FormLabel>Diet Preference</FormLabel>
            <Select
              size='sm'
              name='dietPreference'
              slotProps={{
                button: { sx: { whiteSpace: 'nowrap' } },
              }}
              value={data.dietPreference}
              onChange={(_: any, value: any) =>
                handleSelectChange('dietPreference', value)
              }
            >
              {dietPreferences.map((item) => (
                <Option key={item.value} value={item.value}>
                  {item.text}
                </Option>
              ))}
            </Select>
            {!!dietPreferenceError && (
              <FormHelperText>
                <InfoOutlined />
                {dietPreferenceError?.error}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl sx={{ flex: 1 }} error={!!dietaryHabitError}>
            <FormLabel>Dietary Habit</FormLabel>
            <Select
              size='sm'
              name='dietaryHabit'
              slotProps={{
                button: { sx: { whiteSpace: 'nowrap' } },
              }}
              value={data.dietaryHabit}
              onChange={(_: any, value: any) =>
                handleSelectChange('dietaryHabit', value)
              }
            >
              {dietaryHabits.map((item) => (
                <Option key={item.value} value={item.value}>
                  {item.text}
                </Option>
              ))}
            </Select>
            {!!dietaryHabitError && (
              <FormHelperText>
                <InfoOutlined />
                {dietaryHabitError?.error}
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
          <FormControl sx={{ flex: 1 }} error={!!startDateError}>
            <FormLabel>Start Date</FormLabel>
            <Input
              name='startDate'
              size='sm'
              type='date'
              placeholder='Start Date'
              value={data.startDate}
              onChange={changeHandler}
            />
            {!!startDateError && (
              <FormHelperText>
                <InfoOutlined />
                {startDateError?.error}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl sx={{ flex: 1 }} error={!!endDateError}>
            <FormLabel>End Date</FormLabel>
            <Input
              name='endDate'
              size='sm'
              type='date'
              placeholder='End Date'
              value={
                data.dietPreference === 'DAILY' ? data.startDate : data.endDate
              }
              disabled={data.dietPreference === 'DAILY'}
              onChange={changeHandler}
            />
            {!!endDateError && (
              <FormHelperText>
                <InfoOutlined />
                {endDateError?.error}
              </FormHelperText>
            )}
          </FormControl>
        </Stack>
        <Stack
          sx={{
            display: 'flex',
            flexDirection: { md: 'column', xs: 'column' },
            gap: 2,
          }}
        >
          <FormControl sx={{ flex: 2 }}>
            <FormLabel>Notes</FormLabel>
            <Textarea
              name='notes'
              minRows={3}
              slotProps={{
                textarea: {
                  maxLength: 511,
                },
              }}
              value={data.notes}
              onChange={changeHandler}
            />
          </FormControl>
        </Stack>
        <Divider sx={{ mt: 1.5 }} />
        <Stack
          sx={{
            display: 'flex',
            flexDirection: { md: 'row', xs: 'column' },
            gap: 2,
            mt: 1,
            justifyContent: 'flex-end',
          }}
        >
          <FormControl size='sm'>
            <Button
              size='sm'
              variant='outlined'
              color='neutral'
              loading={isLoading}
              onClick={discardAllChanges}
            >
              Discard
            </Button>
          </FormControl>
          <FormControl size='sm'>
            <Button
              size='sm'
              type='submit'
              loading={isLoading}
              onClick={onSubmit}
            >
              Create
            </Button>
          </FormControl>
        </Stack>
      </ModalDialog>
    </Modal>
  );
};

export default CreateDiet;

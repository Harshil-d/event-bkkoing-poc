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
  Option,
  Select,
  Stack,
  Textarea,
} from '@mui/joy';
import { InfoOutlined } from '@mui/icons-material';
import { toast } from 'react-toastify';

import { uiActions } from '../../store/slices/ui.slice';
import { constants } from '../../constants/index.constants';
import { IFieldError } from '../../interfaces/forms.interface';
import {
  ICity,
  ICountry,
  ILookupItem,
  IState,
} from '../../interfaces/lookup.interface';
import { IAddress } from '../../interfaces/address.interface';
import {
  getAllergiesList,
  getCityList,
  getCountryList,
  getDietaryHabitsList,
  getFoodIntolerancesList,
  getNutritionalDeficienciesList,
  getStateList,
  getWaterIntakesList,
} from '../../services/lookup.service';
import {
  getClientAddress,
  getClientDietaryHistory,
  updateClientAddress,
  updateClientDietaryHistory,
} from '../../services/client.service';
import { IClientDietaryHistory } from '../../interfaces/client.interface';
import { formatToHHMM } from '../../utilities/dateTime.utility';

export interface IClientDietaryHistoryProps {
  id: number;
}

const ClientDietaryHistory: React.FC<IClientDietaryHistoryProps> = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [dietaryHabits, setDietaryHabits] = useState<ILookupItem[]>([]);
  const [allergies, setAllergies] = useState<ILookupItem[]>([]);
  const [foodIntolerances, setFoodIntolerances] = useState<ILookupItem[]>([]);
  const [nutritionalDeficiencies, setNutritionalDeficiencies] = useState<
    ILookupItem[]
  >([]);
  const [waterIntakes, setWaterIntakes] = useState<ILookupItem[]>([]);
  const [data, setData] = useState<IClientDietaryHistory>({
    wakeupTime: '',
    sleepTime: '',
    dietaryHabit: '',
    favoriteFoods: '',
    dislikedFoods: '',
    allergies: [],
    foodIntolerances: [],
    nutritionalDeficiencies: [],
    waterIntake: '',
    otherInformations: '',
  });
  const [initialData, setInitialData] = useState<IClientDietaryHistory>({
    wakeupTime: '',
    sleepTime: '',
    dietaryHabit: '',
    favoriteFoods: '',
    dislikedFoods: '',
    allergies: [],
    foodIntolerances: [],
    nutritionalDeficiencies: [],
    waterIntake: '',
    otherInformations: '',
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
    const fetchDietaryHabitsList = async () => {
      setIsLoading(true);

      const response = await getDietaryHabitsList();

      if (response.statusCode === constants.api.httpStatusCodes.ok) {
        const lookups = response.payload || [];
        setDietaryHabits(lookups);
      }

      setIsLoading(false);
    };

    const fetchAllergiesList = async () => {
      setIsLoading(true);

      const response = await getAllergiesList();

      if (response.statusCode === constants.api.httpStatusCodes.ok) {
        const lookups = response.payload || [];
        setAllergies(lookups);
      }

      setIsLoading(false);
    };

    const fetchFoodIntolerancesList = async () => {
      setIsLoading(true);

      const response = await getFoodIntolerancesList();

      if (response.statusCode === constants.api.httpStatusCodes.ok) {
        const lookups = response.payload || [];
        setFoodIntolerances(lookups);
      }

      setIsLoading(false);
    };

    const fetchNutritionalDeficienciesList = async () => {
      setIsLoading(true);

      const response = await getNutritionalDeficienciesList();

      if (response.statusCode === constants.api.httpStatusCodes.ok) {
        const lookups = response.payload || [];
        setNutritionalDeficiencies(lookups);
      }

      setIsLoading(false);
    };

    const fetchWaterIntakesList = async () => {
      setIsLoading(true);

      const response = await getWaterIntakesList();

      if (response.statusCode === constants.api.httpStatusCodes.ok) {
        const lookups = response.payload || [];
        setWaterIntakes(lookups);
      }

      setIsLoading(false);
    };

    const fetchClientDietaryHistory = async () => {
      setIsLoading(true);

      const response = await getClientDietaryHistory(props.id);

      if (response.statusCode === constants.api.httpStatusCodes.ok) {
        const data = response.payload;
        if (data) {
          setData({
            ...data,
            wakeupTime: data.wakeupTime?.substring(0, 5) || '',
            sleepTime: data.sleepTime?.substring(0, 5) || '',
          });
          setInitialData({
            ...data,
            wakeupTime: data.wakeupTime?.substring(0, 5) || '',
            sleepTime: data.sleepTime?.substring(0, 5) || '',
          });
        }
      }

      setIsLoading(false);
    };

    fetchDietaryHabitsList();
    fetchAllergiesList();
    fetchFoodIntolerancesList();
    fetchNutritionalDeficienciesList();
    fetchWaterIntakesList();
    fetchClientDietaryHistory();
  }, [props.id]);

  const discardAllChanges = () => {
    setData(initialData);
    setFormErrors([]);
  };

  const changeHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setData((data) => ({
      ...data,
      [event.target.name]: event.target.value,
    }));
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setData((data) => ({
      ...data,
      [event.target.name]: ['wakeupTime', 'sleepTime'].includes(
        event.target.name
      )
        ? formatToHHMM(event.target.value)
        : event.target.value,
    }));
  };

  const handleSelectChange = (name: string, value: any) => {
    setData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const handleKeyDown = (event: any) => {
    if (event.key === 'Tab') {
      event.target.blur();
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setFormErrors([]);
    setIsLoading(true);

    const response = await updateClientDietaryHistory(props.id, data);

    if (
      response.statusCode === constants.api.httpStatusCodes.unprocessableEntity
    ) {
      setFormErrors(response.fromErrors?.fields);
    } else if (response.statusCode === constants.api.httpStatusCodes.ok) {
      setInitialData(data);
      toast.success('Dietary History updated successfully.');
    } else {
      toast.error(response.message);
    }

    setIsLoading(false);
  };

  const wakeupTimeError = formErrors?.find(
    (error) => error.name === 'wakeupTime' && error.showOnElement
  );

  const sleepTimeError = formErrors?.find(
    (error) => error.name === 'sleepTime' && error.showOnElement
  );

  const dietaryHabitError = formErrors?.find(
    (error) => error.name === 'dietaryHabit' && error.showOnElement
  );

  const allergyError = formErrors?.find(
    (error) => error.name === 'allergy' && error.showOnElement
  );

  const foodIntolerancesError = formErrors?.find(
    (error) => error.name === 'foodIntolerances' && error.showOnElement
  );

  const nutritionalDeficienciesError = formErrors?.find(
    (error) => error.name === 'nutritionalDeficiencies' && error.showOnElement
  );

  const waterIntakeError = formErrors?.find(
    (error) => error.name === 'waterIntake' && error.showOnElement
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
          <Stack
            sx={{
              display: 'flex',
              flexDirection: { md: 'row', xs: 'column' },
              gap: 2,
            }}
          >
            <FormControl sx={{ flex: 1 }} error={!!wakeupTimeError}>
              <FormLabel>Wake Up Time</FormLabel>
              <Input
                size='sm'
                name='wakeupTime'
                value={data.wakeupTime || ''}
                placeholder='HH:MM'
                onChange={changeHandler}
                onBlur={handleBlur}
                slotProps={{
                  input: {
                    maxLength: 5,
                  },
                }}
              />
              {!!wakeupTimeError && (
                <FormHelperText>
                  <InfoOutlined />
                  {wakeupTimeError?.error}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl sx={{ flex: 1 }} error={!!sleepTimeError}>
              <FormLabel>Sleep Time</FormLabel>
              <Input
                size='sm'
                name='sleepTime'
                value={data.sleepTime || ''}
                placeholder='HH:MM'
                onChange={changeHandler}
                onBlur={handleBlur}
                slotProps={{
                  input: {
                    maxLength: 5,
                  },
                }}
              />
              {!!sleepTimeError && (
                <FormHelperText>
                  <InfoOutlined />
                  {sleepTimeError?.error}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl sx={{ flex: 1 }} error={!!dietaryHabitError}>
              <FormLabel>Dietary Habit</FormLabel>
              <Select
                name='dietaryHabit'
                size='sm'
                onChange={(_: any, value: any) =>
                  handleSelectChange('dietaryHabit', value)
                }
                value={data.dietaryHabit}
              >
                {dietaryHabits.map((item, index) => (
                  <Option key={index} value={item.value}>
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
            <FormControl sx={{ flex: 1 }} error={!!allergyError}>
              <FormLabel>Allergy</FormLabel>
              <Select
                name='allergies'
                size='sm'
                multiple
                onChange={(_: any, value: any) =>
                  handleSelectChange('allergies', value)
                }
                onKeyDown={handleKeyDown}
                value={data.allergies}
              >
                {allergies.map((item, index) => (
                  <Option key={index} value={item.value}>
                    {item.text}
                  </Option>
                ))}
              </Select>
              {!!allergyError && (
                <FormHelperText>
                  <InfoOutlined />
                  {allergyError?.error}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl sx={{ flex: 1 }} error={!!foodIntolerancesError}>
              <FormLabel>Food Intolerance</FormLabel>
              <Select
                name='foodIntolerances'
                size='sm'
                multiple
                onChange={(_: any, value: any) =>
                  handleSelectChange('foodIntolerances', value)
                }
                onKeyDown={handleKeyDown}
                value={data.foodIntolerances}
              >
                {foodIntolerances.map((item, index) => (
                  <Option key={index} value={item.value}>
                    {item.text}
                  </Option>
                ))}
              </Select>
              {!!foodIntolerancesError && (
                <FormHelperText>
                  <InfoOutlined />
                  {foodIntolerancesError?.error}
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
            <FormControl
              sx={{ flex: 1 }}
              error={!!nutritionalDeficienciesError}
            >
              <FormLabel>Nutritional Deficiency</FormLabel>
              <Select
                name='nutritionalDeficiencies'
                size='sm'
                multiple
                onChange={(_: any, value: any) =>
                  handleSelectChange('nutritionalDeficiencies', value)
                }
                onKeyDown={handleKeyDown}
                value={data.nutritionalDeficiencies}
              >
                {nutritionalDeficiencies.map((item, index) => (
                  <Option key={index} value={item.value}>
                    {item.text}
                  </Option>
                ))}
              </Select>
              {!!nutritionalDeficienciesError && (
                <FormHelperText>
                  <InfoOutlined />
                  {nutritionalDeficienciesError?.error}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl sx={{ flex: 1 }} error={!!waterIntakeError}>
              <FormLabel>Water Intake</FormLabel>
              <Select
                name='waterIntake'
                size='sm'
                onChange={(_: any, value: any) =>
                  handleSelectChange('waterIntake', value)
                }
                value={data.waterIntake}
              >
                {waterIntakes.map((item, index) => (
                  <Option key={index} value={item.value}>
                    {item.text}
                  </Option>
                ))}
              </Select>
              {!!waterIntakeError && (
                <FormHelperText>
                  <InfoOutlined />
                  {waterIntakeError?.error}
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
            <FormControl size='sm' sx={{ flex: 1 }}>
              <FormLabel>Favorite Foods</FormLabel>
              <Textarea
                name='favoriteFoods'
                minRows={3}
                value={data.favoriteFoods || ''}
                onChange={changeHandler}
                slotProps={{
                  textarea: {
                    maxLength: 255,
                  },
                }}
              />
            </FormControl>
            <FormControl size='sm' sx={{ flex: 1 }}>
              <FormLabel>Disliked Foods</FormLabel>
              <Textarea
                name='dislikedFoods'
                minRows={3}
                value={data.dislikedFoods || ''}
                onChange={changeHandler}
                slotProps={{
                  textarea: {
                    maxLength: 255,
                  },
                }}
              />
            </FormControl>
            <FormControl size='sm' sx={{ flex: 1 }}>
              <FormLabel>Other Information</FormLabel>
              <Textarea
                name='otherInformations'
                minRows={3}
                value={data.otherInformations || ''}
                onChange={changeHandler}
                slotProps={{
                  textarea: {
                    maxLength: 255,
                  },
                }}
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
            <Button size='sm' variant='solid' onClick={onSubmit}>
              Save Changes
            </Button>
          </CardActions>
        </CardOverflow>
      </Card>
    </Stack>
  );
};

export default ClientDietaryHistory;

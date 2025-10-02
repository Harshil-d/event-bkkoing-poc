import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

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
  Textarea,
} from '@mui/joy';
import { InfoOutlined } from '@mui/icons-material';
import { toast } from 'react-toastify';

import { uiActions } from '../../store/slices/ui.slice';
import { constants } from '../../constants/index.constants';
import { IFieldError } from '../../interfaces/forms.interface';
import { ILookupItem } from '../../interfaces/lookup.interface';
import {
  getBowelMovementList,
  getMaritalStatusList,
  getSleepQualityList,
} from '../../services/lookup.service';
import {
  getClientPersonalSocialInfo,
  updateClientPersonalSocialInfo,
} from '../../services/client.service';
import { IClientPersonalSocialInformation } from '../../interfaces/client.interface';

export interface IClientPersonalSocialInfoProps {
  id: number;
}

const ClientPersonalSocialInfo: React.FC<IClientPersonalSocialInfoProps> = (
  props
) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [maritalStatuses, setMaritalStatuses] = useState<ILookupItem[]>([]);
  const [bowelMovements, setBowelMovements] = useState<ILookupItem[]>([]);
  const [sleepQualities, setSleepQualities] = useState<ILookupItem[]>([]);
  const [data, setData] = useState<IClientPersonalSocialInformation>({
    bowelMovement: '',
    bowelMovementsNotes: '',
    sleepQuality: '',
    sleepQualityNotes: '',
    smoker: false,
    smokerNotes: '',
    alcoholConsumption: false,
    alcoholConsumptionNotes: '',
    maritalStatus: '',
    maritalStatusNotes: '',
    physicalActivity: '',
    lifestyleFactors: '',
    otherInformations: '',
  });
  const [initialData, setInitialData] =
    useState<IClientPersonalSocialInformation>({
      bowelMovement: '',
      bowelMovementsNotes: '',
      sleepQuality: '',
      sleepQualityNotes: '',
      smoker: false,
      smokerNotes: '',
      alcoholConsumption: false,
      alcoholConsumptionNotes: '',
      maritalStatus: '',
      maritalStatusNotes: '',
      physicalActivity: '',
      lifestyleFactors: '',
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
    const fetchMaritalStatusList = async () => {
      setIsLoading(true);

      const response = await getMaritalStatusList();

      if (response.statusCode === constants.api.httpStatusCodes.ok) {
        const maritalStatuses = response.payload || [];
        setMaritalStatuses(maritalStatuses);
      }

      setIsLoading(false);
    };

    const fetchBowelMovementList = async () => {
      setIsLoading(true);

      const response = await getBowelMovementList();

      if (response.statusCode === constants.api.httpStatusCodes.ok) {
        const bowelMovements = response.payload || [];
        setBowelMovements(bowelMovements);
      }

      setIsLoading(false);
    };

    const fetchSleepQualityList = async () => {
      setIsLoading(true);

      const response = await getSleepQualityList();

      if (response.statusCode === constants.api.httpStatusCodes.ok) {
        const sleepQualities = response.payload || [];
        setSleepQualities(sleepQualities);
      }

      setIsLoading(false);
    };

    const fetchClientPersonalSocialInfo = async () => {
      setIsLoading(true);

      const response = await getClientPersonalSocialInfo(props.id);

      if (response.statusCode === constants.api.httpStatusCodes.ok) {
        const result = response.payload || {
          bowelMovement: '',
          bowelMovementsNotes: '',
          sleepQuality: '',
          sleepQualityNotes: '',
          smoker: false,
          smokerNotes: '',
          alcoholConsumption: false,
          alcoholConsumptionNotes: '',
          maritalStatus: '',
          maritalStatusNotes: '',
          physicalActivity: '',
          lifestyleFactors: '',
          otherInformations: '',
        };
        setData(result);
        setInitialData(result);
      }

      setIsLoading(false);
    };

    fetchMaritalStatusList();
    fetchBowelMovementList();
    fetchSleepQualityList();
    fetchClientPersonalSocialInfo();
  }, [props.id]);

  const discardAllChanges = () => {
    setData(initialData);
    setFormErrors([]);
  };

  const changeHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setData((address) => ({
      ...address,
      [event.target.name]: event.target.value,
    }));
  };

  const handleMaritalStatusChange = (_: any, value: any) => {
    setData((data) => ({
      ...data,
      maritalStatus: value,
    }));
  };

  const handleBowelMovementChange = (_: any, value: any) => {
    setData((data) => {
      return {
        ...data,
        bowelMovement: value,
      };
    });
  };

  const handleSleepQualityChange = (_: any, value: any) => {
    setData((data) => ({
      ...data,
      sleepQuality: value,
    }));
  };

  const handleCheckBoxCheckChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setData((data) => ({
      ...data,
      [event.target.name]: event.target.checked,
    }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setFormErrors([]);
    setIsLoading(true);

    const response = await updateClientPersonalSocialInfo(props.id, data);

    if (
      response.statusCode === constants.api.httpStatusCodes.unprocessableEntity
    ) {
      setFormErrors(response.fromErrors?.fields);
    } else if (response.statusCode === constants.api.httpStatusCodes.ok) {
      setInitialData(data);
      toast.success('Personal & Social Information updated successfully.');
    } else {
      toast.error(response.message);
    }

    setIsLoading(false);
  };

  const maritalStatusError = formErrors?.find(
    (error) => error.name === 'maritalStatus' && error.showOnElement
  );

  const bowelMovementError = formErrors?.find(
    (error) => error.name === 'bowelMovement' && error.showOnElement
  );

  const sleepQualityError = formErrors?.find(
    (error) => error.name === 'sleepQuality' && error.showOnElement
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
            <FormControl sx={{ flex: 1 }} error={!!maritalStatusError}>
              <FormLabel>Marital Status</FormLabel>
              <Select
                name='maritalStatus'
                size='sm'
                onChange={handleMaritalStatusChange}
                value={data.maritalStatus || ''}
              >
                {maritalStatuses.map((item, index) => (
                  <Option key={index} value={item.value}>
                    {item.text}
                  </Option>
                ))}
              </Select>
              {!!maritalStatusError && (
                <FormHelperText>
                  <InfoOutlined />
                  {maritalStatusError.error}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl sx={{ flex: 2 }}>
              <FormLabel>Marital Status Notes</FormLabel>
              <Input
                size='sm'
                name='maritalStatusNotes'
                value={data.maritalStatusNotes || ''}
                onChange={changeHandler}
                slotProps={{
                  input: {
                    maxLength: 100,
                  },
                }}
              />
            </FormControl>
          </Stack>
          <Stack
            sx={{
              display: 'flex',
              flexDirection: { md: 'row', xs: 'column' },
              gap: 2,
            }}
          >
            <FormControl sx={{ flex: 1 }} error={!!bowelMovementError}>
              <FormLabel>Bowel Movement</FormLabel>
              <Select
                name='bowelMovement'
                size='sm'
                onChange={handleBowelMovementChange}
                value={data.bowelMovement || ''}
              >
                {bowelMovements.map((item, index) => (
                  <Option key={index} value={item.value}>
                    {item.text}
                  </Option>
                ))}
              </Select>
              {!!bowelMovementError && (
                <FormHelperText>
                  <InfoOutlined />
                  {bowelMovementError.error}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl sx={{ flex: 2 }}>
              <FormLabel>Bowel Movement Notes</FormLabel>
              <Input
                size='sm'
                name='bowelMovementsNotes'
                value={data.bowelMovementsNotes || ''}
                onChange={changeHandler}
                slotProps={{
                  input: {
                    maxLength: 100,
                  },
                }}
              />
            </FormControl>
          </Stack>
          <Stack
            sx={{
              display: 'flex',
              flexDirection: { md: 'row', xs: 'column' },
              gap: 2,
            }}
          >
            <FormControl sx={{ flex: 1 }} error={!!sleepQualityError}>
              <FormLabel>Sleep Quality</FormLabel>
              <Select
                name='sleepQuality'
                size='sm'
                onChange={handleSleepQualityChange}
                value={data.sleepQuality || ''}
              >
                {sleepQualities.map((item, index) => (
                  <Option key={index} value={item.value}>
                    {item.text}
                  </Option>
                ))}
              </Select>
              {!!sleepQualityError && (
                <FormHelperText>
                  <InfoOutlined />
                  {sleepQualityError.error}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl sx={{ flex: 2 }}>
              <FormLabel>Sleep Quality Notes</FormLabel>
              <Input
                size='sm'
                name='sleepQualityNotes'
                value={data.sleepQualityNotes || ''}
                onChange={changeHandler}
                slotProps={{
                  input: {
                    maxLength: 100,
                  },
                }}
              />
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
              <FormLabel>Physical Activity</FormLabel>
              <Textarea
                name='physicalActivity'
                minRows={3}
                slotProps={{
                  textarea: {
                    maxLength: 511,
                  },
                }}
                value={data.physicalActivity || ''}
                onChange={changeHandler}
              />
            </FormControl>
            <FormControl size='sm' sx={{ flex: 1 }}>
              <FormLabel>Lifestyle Factors</FormLabel>
              <Textarea
                name='lifestyleFactors'
                minRows={3}
                slotProps={{
                  textarea: {
                    maxLength: 511,
                  },
                }}
                value={data.lifestyleFactors || ''}
                onChange={changeHandler}
              />
            </FormControl>
            <FormControl size='sm' sx={{ flex: 1 }}>
              <FormLabel>Other Information</FormLabel>
              <Textarea
                name='otherInformations'
                minRows={3}
                slotProps={{
                  textarea: {
                    maxLength: 511,
                  },
                }}
                value={data.otherInformations || ''}
                onChange={changeHandler}
              />
            </FormControl>
          </Stack>
          <Stack
            sx={{
              display: 'flex',
              flexDirection: { md: 'row', xs: 'column' },
              gap: 2,
            }}
          >
            <Stack
              sx={{
                display: 'flex',
                flexDirection: { md: 'column', xs: 'column' },
                gap: 2,
                flex: 1,
              }}
            >
              <FormControl size='sm' sx={{ flex: 1 }}>
                <Checkbox
                  name='smoker'
                  label='Smoker?'
                  checked={data.smoker}
                  onChange={handleCheckBoxCheckChange}
                />
              </FormControl>
              <FormControl size='sm' sx={{ flex: 1 }}>
                <Textarea
                  name='smokerNotes'
                  minRows={3}
                  placeholder='Notes (Smoking)'
                  slotProps={{
                    textarea: {
                      maxLength: 100,
                    },
                  }}
                  value={data.smokerNotes || ''}
                  onChange={changeHandler}
                />
              </FormControl>
            </Stack>
            <Stack
              sx={{
                display: 'flex',
                flexDirection: { md: 'column', xs: 'column' },
                gap: 2,
                flex: 1,
              }}
            >
              <FormControl size='sm' sx={{ flex: 1 }}>
                <Checkbox
                  name='alcoholConsumption'
                  label='Alcohol?'
                  checked={data.alcoholConsumption}
                  onChange={handleCheckBoxCheckChange}
                />
              </FormControl>
              <FormControl size='sm' sx={{ flex: 1 }}>
                <Textarea
                  name='alcoholConsumptionNotes'
                  minRows={3}
                  placeholder='Notes (Alcohol)'
                  slotProps={{
                    textarea: {
                      maxLength: 100,
                    },
                  }}
                  value={data.alcoholConsumptionNotes || ''}
                  onChange={changeHandler}
                />
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

export default ClientPersonalSocialInfo;

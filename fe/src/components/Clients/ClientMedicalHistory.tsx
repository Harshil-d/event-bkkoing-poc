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
import {
  ICity,
  ICountry,
  ILookupItem,
  IState,
} from '../../interfaces/lookup.interface';
import { IAddress } from '../../interfaces/address.interface';
import {
  getCityList,
  getCountryList,
  getDiseasesList,
  getStateList,
} from '../../services/lookup.service';
import {
  getClientAddress,
  getClientMedicalHistory,
  updateClientAddress,
  updateMedicalHistory,
} from '../../services/client.service';
import { IClientMedicalHistory } from '../../interfaces/client.interface';

export interface IClientMedicalHistoryProps {
  id: number;
}

const ClientMedicalHistory: React.FC<IClientMedicalHistoryProps> = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [diseases, setDiseases] = useState<ILookupItem[]>([]);
  const [data, setData] = useState<IClientMedicalHistory>({
    disease: [],
    diseaseNotes: '',
    medication: '',
    personalHistory: '',
    familyHistory: '',
    otherInformations: '',
  });
  const [initialData, setInitialData] = useState<IClientMedicalHistory>({
    disease: [],
    diseaseNotes: '',
    medication: '',
    personalHistory: '',
    familyHistory: '',
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
    const fetchDiseasesList = async () => {
      setIsLoading(true);

      const response = await getDiseasesList();

      if (response.statusCode === constants.api.httpStatusCodes.ok) {
        const diseases = response.payload || [];
        setDiseases(diseases);
      }

      setIsLoading(false);
    };

    const fetchClientMedicalHistory = async () => {
      setIsLoading(true);

      const response = await getClientMedicalHistory(props.id);

      if (response.statusCode === constants.api.httpStatusCodes.ok) {
        const result = response.payload || {
          disease: [],
          diseaseNotes: '',
          medication: '',
          personalHistory: '',
          familyHistory: '',
          otherInformations: '',
        };
        setData(result);
        setInitialData(result);
      }

      setIsLoading(false);
    };

    fetchDiseasesList();
    fetchClientMedicalHistory();
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

  const handleDiseasesChange = (_: any, value: any) => {
    setData((data) => ({
      ...data,
      disease: value,
    }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setFormErrors([]);
    setIsLoading(true);

    const response = await updateMedicalHistory(props.id, data);

    if (
      response.statusCode === constants.api.httpStatusCodes.unprocessableEntity
    ) {
      setFormErrors(response.fromErrors?.fields);
    } else if (response.statusCode === constants.api.httpStatusCodes.ok) {
      setInitialData(data);
      toast.success('Medical History updated successfully.');
    } else {
      toast.error(response.message);
    }

    setIsLoading(false);
  };

  const diseaseError = formErrors?.find(
    (error) => error.name === 'disease' && error.showOnElement
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
              flexDirection: { md: 'column', xs: 'column' },
              gap: 2,
            }}
          >
            <FormControl sx={{ flex: 1 }} error={!!diseaseError}>
              <FormLabel>Disease</FormLabel>
              <Select
                name='disease'
                size='sm'
                multiple
                onChange={handleDiseasesChange}
                value={data.disease}
              >
                {diseases.map((item, index) => (
                  <Option key={index} value={item.value}>
                    {item.text}
                  </Option>
                ))}
              </Select>
              {!!diseaseError && (
                <FormHelperText>
                  <InfoOutlined />
                  {diseaseError?.error}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl sx={{ flex: 2 }}>
              <Textarea
                name='diseaseNotes'
                placeholder='Disease Notes'
                minRows={3}
                value={data.diseaseNotes || ''}
                onChange={changeHandler}
                slotProps={{
                  textarea: {
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
              <FormLabel>Medication</FormLabel>
              <Textarea
                name='medication'
                minRows={3}
                value={data.medication || ''}
                onChange={changeHandler}
                slotProps={{
                  textarea: {
                    maxLength: 255,
                  },
                }}
              />
            </FormControl>
            <FormControl size='sm' sx={{ flex: 1 }}>
              <FormLabel>Personal History</FormLabel>
              <Textarea
                name='personalHistory'
                minRows={3}
                value={data.personalHistory || ''}
                onChange={changeHandler}
                slotProps={{
                  textarea: {
                    maxLength: 255,
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
              <FormLabel>Family History</FormLabel>
              <Textarea
                name='familyHistory'
                minRows={3}
                value={data.familyHistory || ''}
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

export default ClientMedicalHistory;

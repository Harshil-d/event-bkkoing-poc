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
} from '@mui/joy';
import { InfoOutlined } from '@mui/icons-material';
import { toast } from 'react-toastify';

import { uiActions } from '../../store/slices/ui.slice';
import { constants } from '../../constants/index.constants';
import { IFieldError } from '../../interfaces/forms.interface';
import { ICity, ICountry, IState } from '../../interfaces/lookup.interface';
import { IAddress } from '../../interfaces/address.interface';
import {
  getCityList,
  getCountryList,
  getStateList,
} from '../../services/lookup.service';
import { getUserAddress, updateUserAddress } from '../../services/user.service';

const Address: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [address, setAddress] = useState<IAddress>({
    houseNumber: '',
    streetAddress: '',
    locality: '',
    landmark: '',
    cityId: 0,
    stateId: 0,
    pinCode: '',
    countryId: 0,
  });
  const [initialAddress, setInitialAddress] = useState<IAddress>({
    houseNumber: '',
    streetAddress: '',
    locality: '',
    landmark: '',
    cityId: 0,
    stateId: 0,
    pinCode: '',
    countryId: 0,
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
    const fetchCountries = async () => {
      setIsLoading(true);

      const response = await getCountryList();

      if (response.statusCode === constants.api.httpStatusCodes.ok) {
        const countries = response.payload || [];
        setCountries(countries);
        return countries;
      }

      setIsLoading(false);
    };

    const fetchAddress = async () => {
      setIsLoading(true);

      const response = await getUserAddress();

      if (response.statusCode === constants.api.httpStatusCodes.ok) {
        const address = response.payload;
        if (address) {
          setAddress(address);
          setInitialAddress(address);
        }
      }

      setIsLoading(false);
    };

    fetchCountries();
    fetchAddress();
  }, []);

  const countryId = address.countryId;

  useEffect(() => {
    const fetchStates = async (countryId: number) => {
      if (!(countryId > 0)) {
        setStates([]);
        return;
      }

      setIsLoading(true);

      const response = await getStateList(countryId);

      if (response.statusCode === constants.api.httpStatusCodes.ok) {
        const states = response.payload || [];
        setStates(states);
      }

      setIsLoading(false);
    };

    fetchStates(countryId);
  }, [countryId]);

  const stateId = address.stateId;

  useEffect(() => {
    const fetchCities = async (stateId: number) => {
      if (!(stateId > 0)) {
        setCities([]);
        return;
      }

      setIsLoading(true);

      const response = await getCityList(stateId);

      if (response.statusCode === constants.api.httpStatusCodes.ok) {
        const cities = response.payload || [];
        setCities(cities);
      }

      setIsLoading(false);
    };

    fetchCities(stateId);
  }, [stateId]);

  const discardAllChanges = () => {
    setAddress(initialAddress);
    setFormErrors([]);
  };

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress((address) => ({
      ...address,
      [event.target.name]: event.target.value,
    }));
  };

  const handleCountryChange = (_: any, value: any) => {
    setAddress((address) => ({
      ...address,
      countryId: value,
      stateId: 0,
    }));
  };

  const handleStateChange = (_: any, value: any) => {
    setAddress((address) => {
      return {
        ...address,
        stateId: value,
        cityId: 0,
      };
    });
  };

  const handleCityChange = (_: any, value: any) => {
    setAddress((address) => ({
      ...address,
      cityId: value,
    }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setFormErrors([]);
    setIsLoading(true);

    const response = await updateUserAddress(address);

    if (
      response.statusCode === constants.api.httpStatusCodes.unprocessableEntity
    ) {
      setFormErrors(response.fromErrors?.fields);
    } else if (response.statusCode === constants.api.httpStatusCodes.ok) {
      setInitialAddress(address);
      toast.success('Address updated successfully.');
    } else {
      toast.error(response.message);
    }

    setIsLoading(false);
  };

  const streetAddressError = formErrors?.find(
    (error) => error.name === 'streetAddress' && error.showOnElement
  );

  const localityError = formErrors?.find(
    (error) => error.name === 'locality' && error.showOnElement
  );

  const cityIdError = formErrors?.find(
    (error) => error.name === 'cityId' && error.showOnElement
  );

  const stateIdError = formErrors?.find(
    (error) => error.name === 'stateId' && error.showOnElement
  );

  const countryIdError = formErrors?.find(
    (error) => error.name === 'countryId' && error.showOnElement
  );

  const pinCodeError = formErrors?.find(
    (error) => error.name === 'pinCode' && error.showOnElement
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
            <FormControl>
              <FormLabel>House Number</FormLabel>
              <Input
                size='sm'
                name='houseNumber'
                value={address.houseNumber || ''}
                onChange={changeHandler}
                slotProps={{
                  input: {
                    maxLength: 10,
                  },
                }}
              />
            </FormControl>
            <FormControl sx={{ flexGrow: 1 }} error={!!streetAddressError}>
              <FormLabel>Street</FormLabel>
              <Input
                size='sm'
                name='streetAddress'
                value={address.streetAddress || ''}
                onChange={changeHandler}
                slotProps={{
                  input: {
                    maxLength: 255,
                  },
                }}
              />
              {!!streetAddressError && (
                <FormHelperText>
                  <InfoOutlined />
                  {streetAddressError?.error}
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
            <FormControl sx={{ flex: 1 }} error={!!localityError}>
              <FormLabel>Locality</FormLabel>
              <Input
                size='sm'
                name='locality'
                value={address.locality || ''}
                onChange={changeHandler}
                slotProps={{
                  input: {
                    maxLength: 100,
                  },
                }}
              />
              {!!localityError && (
                <FormHelperText>
                  <InfoOutlined />
                  {localityError?.error}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl sx={{ flex: 1 }}>
              <FormLabel>Landmark</FormLabel>
              <Input
                size='sm'
                name='landmark'
                value={address.landmark || ''}
                onChange={changeHandler}
                slotProps={{
                  input: {
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
            <FormControl sx={{ flex: 1 }} error={!!countryIdError}>
              <FormLabel>Country</FormLabel>
              <Select
                name='countryId'
                size='sm'
                onChange={handleCountryChange}
                value={address.countryId || 0}
              >
                {countries.map((country, index) => (
                  <Option key={index} value={country.id}>
                    {country.name}
                  </Option>
                ))}
              </Select>
              {!!countryIdError && (
                <FormHelperText>
                  <InfoOutlined />
                  {countryIdError?.error}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl sx={{ flex: 1 }} error={!!stateIdError}>
              <FormLabel>State</FormLabel>
              <Select
                name='stateId'
                size='sm'
                onChange={handleStateChange}
                value={address.stateId || 0}
              >
                {states.map((state, index) => (
                  <Option key={index} value={state.id}>
                    {state.name}
                  </Option>
                ))}
              </Select>
              {!!stateIdError && (
                <FormHelperText>
                  <InfoOutlined />
                  {stateIdError?.error}
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
            <FormControl sx={{ flex: 1 }} error={!!cityIdError}>
              <FormLabel>City</FormLabel>
              <Select
                name='cityId'
                size='sm'
                onChange={handleCityChange}
                value={address.cityId || 0}
              >
                {cities.map((city, index) => (
                  <Option key={index} value={city.id}>
                    {city.name}
                  </Option>
                ))}
              </Select>
              {!!cityIdError && (
                <FormHelperText>
                  <InfoOutlined />
                  {cityIdError?.error}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl sx={{ flex: 1 }} error={!!pinCodeError}>
              <FormLabel>Pin Code</FormLabel>
              <Input
                size='sm'
                name='pinCode'
                value={address.pinCode || ''}
                onChange={changeHandler}
                slotProps={{
                  input: {
                    maxLength: 10,
                  },
                }}
              />
              {!!pinCodeError && (
                <FormHelperText>
                  <InfoOutlined />
                  {pinCodeError?.error}
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

export default Address;

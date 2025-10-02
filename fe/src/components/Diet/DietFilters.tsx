import { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Option,
  Select,
  Sheet,
  Stack,
  Typography,
} from '@mui/joy';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import { ILookupItem } from '../../interfaces/lookup.interface';
import {
  getDietaryHabitsList,
  getDietPreferencesList,
} from '../../services/lookup.service';
import { constants } from '../../constants/index.constants';
import { getAllDietitianList } from '../../services/dietitian.service';
import { IDietitianListItem } from '../../interfaces/dietitian.interface';

export interface IDietFiltersProps {
  onSubmit(
    value: string,
    startDate: string,
    endDate: string,
    dietitianId: number,
    dietPreference: string,
    dietaryHabit: string
  ): void;
}

export interface IDietFilters {
  value: string;
  startDate: string;
  endDate: string;
  dietitianId: number;
  dietPreference: string;
  dietaryHabit: string;
}

const DietFilters: React.FC<IDietFiltersProps> = (props) => {
  const [open, setOpen] = useState(false);
  const [dietitians, setDietitians] = useState<IDietitianListItem[]>([]);
  const [dietPreferences, setDietPreferences] = useState<ILookupItem[]>([]);
  const [dietaryHabits, setDietaryHabits] = useState<ILookupItem[]>([]);

  const initialFilters = {
    value: '',
    startDate: '',
    endDate: '',
    dietitianId: 0,
    dietPreference: 'all',
    dietaryHabit: 'all',
  };

  const [filters, setFilters] = useState<IDietFilters>(initialFilters);

  useEffect(() => {
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

    const fetchAllDietitianList = async () => {
      const response = await getAllDietitianList();

      if (response.statusCode === constants.api.httpStatusCodes.ok) {
        setDietitians(response.payload || []);
      }
    };

    fetchDietPreferencesList();
    fetchDietaryHabitsList();
    fetchAllDietitianList();
  }, []);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((filters) => ({
      ...filters,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSelectChange = (name: string, value: any) => {
    setFilters((filters) => ({
      ...filters,
      [name]: value,
    }));
  };

  const onSubmit = () => {
    props.onSubmit(
      filters.value,
      filters.startDate,
      filters.endDate,
      filters.dietitianId,
      filters.dietPreference,
      filters.dietaryHabit
    );
    setOpen(false);
  };

  const renderFilters = () => (
    <Stack
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column' },
        gap: 2,
        width: '100%',
      }}
    >
      <Stack
        sx={{
          display: 'flex',
          flexDirection: { md: 'row', xs: 'column' },
          gap: 2,
        }}
      >
        <FormControl sx={{ flex: 2.5 }} size='sm'>
          <FormLabel>Search for client</FormLabel>
          <Input
            size='sm'
            placeholder='Search'
            name='value'
            value={filters.value}
            startDecorator={<SearchIcon />}
            onChange={changeHandler}
          />
        </FormControl>
        <FormControl size='sm' sx={{ flex: 1 }}>
          <FormLabel>Start Date</FormLabel>
          <Input
            name='startDate'
            size='sm'
            type='date'
            placeholder='Start Date'
            onChange={changeHandler}
          />
        </FormControl>
        <FormControl size='sm' sx={{ flex: 1 }}>
          <FormLabel>End Date</FormLabel>
          <Input
            name='endDate'
            size='sm'
            type='date'
            placeholder='End Date'
            onChange={changeHandler}
          />
        </FormControl>
      </Stack>
      <Stack
        sx={{
          display: 'flex',
          flexDirection: { md: 'row', xs: 'column' },
          gap: 2,
          alignItems: 'flex-end',
        }}
      >
        <FormControl size='sm' sx={{ flex: 1 }}>
          <FormLabel>Dietitian</FormLabel>
          <Select
            size='sm'
            name='dietitianId'
            placeholder='Filter by dietitian'
            slotProps={{
              button: { sx: { whiteSpace: 'nowrap', minWidth: '120px' } },
            }}
            value={filters.dietitianId}
            onChange={(_: any, value: any) =>
              handleSelectChange('dietitianId', value)
            }
          >
            <Option value={0}>All</Option>
            {dietitians.map((item) => (
              <Option key={item.id} value={item.id}>
                {`${item.firstName} ${item.lastName}`.trim()}
              </Option>
            ))}
          </Select>
        </FormControl>
        <FormControl size='sm' sx={{ flex: 1 }}>
          <FormLabel>Diet Preference</FormLabel>
          <Select
            size='sm'
            name='dietPreference'
            placeholder='Filter by diet preferences'
            slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
            value={filters.dietPreference}
            onChange={(_: any, value: any) =>
              handleSelectChange('dietPreference', value)
            }
          >
            <Option value={'all'}>All</Option>
            {dietPreferences.map((item) => (
              <Option key={item.value} value={item.value}>
                {item.text}
              </Option>
            ))}
          </Select>
        </FormControl>
        <FormControl size='sm' sx={{ flex: 1 }}>
          <FormLabel>Dietary Habit</FormLabel>
          <Select
            size='sm'
            name='dietaryHabit'
            placeholder='Filter by dietary habit'
            slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
            value={filters.dietaryHabit}
            onChange={(_: any, value: any) =>
              handleSelectChange('dietaryHabit', value)
            }
          >
            <Option value={'all'}>All</Option>
            {dietaryHabits.map((item) => (
              <Option key={item.value} value={item.value}>
                {item.text}
              </Option>
            ))}
          </Select>
        </FormControl>
        <FormControl size='sm' sx={{ flex: 1 }}>
          <Button
            color='primary'
            startDecorator={<SearchIcon />}
            sx={{ minWidth: '106px', minHeight: '32px' }}
            onClick={onSubmit}
            variant='outlined'
          >
            Search
          </Button>
        </FormControl>
      </Stack>
    </Stack>
  );

  return (
    <>
      <Box
        sx={{
          display: { xs: 'flex', sm: 'none' },
          gap: 1,
          justifyContent: 'space-between',
        }}
      >
        <Typography id='filter-modal' level='h4'>
          Search for client
        </Typography>
        <IconButton
          size='sm'
          variant='outlined'
          color='neutral'
          onClick={() => setOpen(true)}
        >
          <FilterAltIcon />
        </IconButton>
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog aria-labelledby='filter-modal'>
            <ModalClose />
            <Typography id='filter-modal' level='h2'>
              Filters
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Sheet sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {renderFilters()}
              <Button
                color='primary'
                startDecorator={<SearchIcon />}
                onClick={onSubmit}
              >
                Search
              </Button>
            </Sheet>
          </ModalDialog>
        </Modal>
      </Box>
      <Box
        sx={{
          borderRadius: 'sm',
          display: { xs: 'none', sm: 'flex' },
          flexWrap: 'wrap',
          gap: 1.5,
          '& > *': {
            minWidth: { xs: '120px', md: '160px' },
          },
          alignItems: 'flex-end',
        }}
      >
        {renderFilters()}
      </Box>
    </>
  );
};

export default DietFilters;

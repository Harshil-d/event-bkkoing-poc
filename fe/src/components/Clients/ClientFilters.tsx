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
  Typography,
} from '@mui/joy';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import { ILookupItem } from '../../interfaces/lookup.interface';
import { getGenderList } from '../../services/lookup.service';
import { constants } from '../../constants/index.constants';
import { getAllDietitianList } from '../../services/dietitian.service';
import { IDietitianListItem } from '../../interfaces/dietitian.interface';

export interface IClientFiltersProps {
  onSubmit(
    value: string,
    dietitian: number,
    status: string,
    gender: string
  ): void;
}

export interface IFilters {
  value: string;
  dietitian: number;
  status: string;
  gender: string;
}

const ClientFilters: React.FC<IClientFiltersProps> = (props) => {
  const [open, setOpen] = useState(false);
  const [genders, setGenders] = useState<ILookupItem[]>([]);
  const [dietitians, setDietitians] = useState<IDietitianListItem[]>([]);

  const initialFilters = {
    value: '',
    dietitian: 0,
    status: 'all',
    gender: 'all',
  };

  const [filters, setFilters] = useState<IFilters>(initialFilters);

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

    fetchGenders();
    fetchAllDietitianList();
  }, []);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((filters) => ({
      ...filters,
      [event.target.name]: event.target.value,
    }));
  };

  const handleDietitianChange = (_: any, value: any) => {
    setFilters((filters) => ({
      ...filters,
      dietitian: value,
    }));
  };

  const handleStatusChange = (_: any, value: any) => {
    setFilters((filters) => ({
      ...filters,
      status: value,
    }));
  };

  const handleGenderChange = (_: any, value: any) => {
    setFilters((filters) => ({
      ...filters,
      gender: value,
    }));
  };

  const onSubmit = () => {
    props.onSubmit(
      filters.value,
      filters.dietitian,
      filters.status,
      filters.gender
    );
    setOpen(false);
  };

  const renderFilters = () => (
    <>
      <FormControl sx={{ flex: 1 }} size='sm'>
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
      <FormControl size='sm' sx={{ flexGrow: 0.5 }}>
        <FormLabel>Dietitian</FormLabel>
        <Select
          size='sm'
          name='dietitian'
          placeholder='Filter by dietitian'
          slotProps={{
            button: { sx: { whiteSpace: 'nowrap', minWidth: '120px' } },
          }}
          value={filters.dietitian}
          onChange={handleDietitianChange}
        >
          <Option value={0}>All</Option>
          {dietitians.map((item) => (
            <Option key={item.id} value={item.id}>
              {`${item.firstName} ${item.lastName}`.trim()}
            </Option>
          ))}
        </Select>
      </FormControl>
      <FormControl size='sm'>
        <FormLabel>Status</FormLabel>
        <Select
          size='sm'
          name='status'
          placeholder='Filter by status'
          slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
          value={filters.status}
          onChange={handleStatusChange}
        >
          <Option value='all'>All</Option>
          <Option value='active'>Active</Option>
          <Option value='inactive'>Inactive</Option>
        </Select>
      </FormControl>
      <FormControl size='sm'>
        <FormLabel>Gender</FormLabel>
        <Select
          size='sm'
          name='gender'
          placeholder='Filter by gender'
          slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
          value={filters.gender}
          onChange={handleGenderChange}
        >
          <Option value='all'>All</Option>
          {genders.map((gender) => (
            <Option key={gender.value} value={gender.value}>
              {gender.text}
            </Option>
          ))}
        </Select>
      </FormControl>
    </>
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
        <Button
          color='primary'
          startDecorator={<SearchIcon />}
          sx={{ minWidth: '106px', minHeight: '32px' }}
          onClick={onSubmit}
          variant='outlined'
        >
          Search
        </Button>
      </Box>
    </>
  );
};

export default ClientFilters;

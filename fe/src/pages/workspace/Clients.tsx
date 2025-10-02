import { useDispatch } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Breadcrumbs, Button, Link, Stack, Typography } from '@mui/joy';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

import ClientList from '../../components/Clients/ClientList';
import ClientTable from '../../components/Clients/ClientTable';
import { IClientSummary } from '../../interfaces/client.interface';
import { searchClients } from '../../services/client.service';
import { constants } from '../../constants/index.constants';
import { uiActions } from '../../store/slices/ui.slice';
import ClientFilters from '../../components/Clients/ClientFilters';

export interface IFilters {
  value: string;
  dietitian: number;
  status: string;
  gender: string;
}

const ClientsPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<IClientSummary[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8;

  const initialFilters = useMemo(
    () => ({
      value: '',
      dietitian: 0,
      status: 'all',
      gender: 'all',
    }),
    []
  );

  const [filters, setFilters] = useState<IFilters>(initialFilters);

  const fetchClients = async (
    { value, dietitian, status, gender }: IFilters,
    currentPage: number = 1
  ) => {
    setIsLoading(true);

    const response = await searchClients(
      value,
      dietitian,
      status,
      gender,
      currentPage,
      pageSize
    );

    if (response.statusCode === constants.api.httpStatusCodes.ok) {
      setClients(response.payload?.clients || []);
      setTotalRecords(response.payload?.totalRecords || 0);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchClients(initialFilters);
  }, [initialFilters]);

  useEffect(() => {
    if (isLoading) {
      dispatch(uiActions.addLoader());
    } else {
      dispatch(uiActions.removeLoader());
    }
  }, [dispatch, isLoading]);

  const submitFiltersHandler = (
    value: string,
    dietitian: number,
    status: string,
    gender: string
  ): void => {
    if (!value) {
      value = '';
    }
    if (dietitian === undefined || dietitian === null) {
      dietitian = 0;
    }
    if (!status) {
      status = 'all';
    }
    if (!gender) {
      gender = 'all';
    }
    setFilters({
      value,
      dietitian,
      status,
      gender,
    });
    setCurrentPage(1);

    fetchClients({ value, dietitian, status, gender });
  };

  const changePageHandler = (page: number) => {
    if (currentPage === page) {
      return;
    }
    setCurrentPage(page);
    fetchClients(filters, page);
  };

  const createClientHandler = () => {
    navigate('/clients/create');
  };

  return (
    <Box sx={{ flex: 1, width: '100%' }}>
      <Box
        sx={{
          position: 'sticky',
          top: { sm: -100, md: -110 },
          bgcolor: 'background.body',
        }}
      >
        <Box sx={{ px: { xs: 2, md: 6 } }}>
          <Breadcrumbs
            size='sm'
            aria-label='breadcrumbs'
            separator={<ChevronRightRoundedIcon />}
            sx={{ pl: 0 }}
          >
            <Link underline='none' color='neutral' href='/' aria-label='Home'>
              <HomeRoundedIcon />
            </Link>
            <Typography color='primary' sx={{ fontWeight: 500, fontSize: 12 }}>
              Clients
            </Typography>
          </Breadcrumbs>
          <Box
            sx={{
              display: 'flex',
              mt: 1,
              mb: 2,
              gap: 1,
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'start', sm: 'center' },
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            <Typography level='h2' component='h1'>
              Clients
            </Typography>
            <Button
              color='primary'
              startDecorator={<AddRoundedIcon />}
              size='sm'
              onClick={createClientHandler}
            >
              Create Client
            </Button>
          </Box>
        </Box>
        <Stack
          sx={{
            display: 'flex',
            px: { xs: 2, md: 6 },
          }}
        >
          <ClientFilters onSubmit={submitFiltersHandler} />
          <ClientList
            clients={clients}
            totalRecords={totalRecords}
            pageSize={pageSize}
            currentPage={currentPage}
            isLoading={isLoading}
            onPageChange={changePageHandler}
          />
          <ClientTable
            clients={clients}
            totalRecords={totalRecords}
            pageSize={pageSize}
            currentPage={currentPage}
            isLoading={isLoading}
            onPageChange={changePageHandler}
          />
        </Stack>
      </Box>
    </Box>
  );
};

export default ClientsPage;

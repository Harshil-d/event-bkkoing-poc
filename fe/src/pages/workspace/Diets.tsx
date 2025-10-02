import { useDispatch } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Breadcrumbs, Button, Link, Stack, Typography } from '@mui/joy';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

import ClientList from '../../components/Clients/ClientList';
import ClientTable from '../../components/Clients/ClientTable';
import { constants } from '../../constants/index.constants';
import { uiActions } from '../../store/slices/ui.slice';
import DietFilters, { IDietFilters } from '../../components/Diet/DietFilters';
import CreateDiet from '../../components/Diet/CreateDiet';
import { IDietItemSummary } from '../../interfaces/diet.interface';
import { searchDiets } from '../../services/diet.service';
import DietTable from '../../components/Diet/DietTable';

const DietsPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [diets, setDiets] = useState<IDietItemSummary[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showCreateDietModal, setShowCreateDietModal] =
    useState<boolean>(false);
  const pageSize = 6;

  const initialFilters = useMemo(
    () => ({
      value: '',
      startDate: '',
      endDate: '',
      dietitianId: 0,
      dietPreference: 'all',
      dietaryHabit: 'all',
    }),
    []
  );

  const [filters, setFilters] = useState<IDietFilters>(initialFilters);

  const fetchDiets = async (
    {
      value,
      startDate,
      endDate,
      dietitianId,
      dietPreference,
      dietaryHabit,
    }: IDietFilters,
    currentPage: number = 1
  ) => {
    setIsLoading(true);

    const response = await searchDiets(
      value,
      startDate,
      endDate,
      dietitianId,
      dietPreference,
      dietaryHabit,
      currentPage,
      pageSize
    );

    if (response.statusCode === constants.api.httpStatusCodes.ok) {
      setDiets(response.payload?.diets || []);
      setTotalRecords(response.payload?.totalRecords || 0);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchDiets(initialFilters);
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
    startDate: string,
    endDate: string,
    dietitianId: number,
    dietPreference: string,
    dietaryHabit: string
  ): void => {
    if (!value) {
      value = '';
    }
    if (dietitianId === undefined || dietitianId === null) {
      dietitianId = 0;
    }
    if (!dietPreference) {
      dietPreference = 'all';
    }
    if (!dietaryHabit) {
      dietaryHabit = 'all';
    }
    setFilters({
      value,
      startDate,
      endDate,
      dietitianId,
      dietPreference,
      dietaryHabit,
    });
    setCurrentPage(1);

    fetchDiets({
      value,
      startDate,
      endDate,
      dietitianId,
      dietPreference,
      dietaryHabit,
    });
  };

  const changePageHandler = (page: number) => {
    if (currentPage === page) {
      return;
    }
    setCurrentPage(page);
    fetchDiets(filters, page);
  };

  const createDietHandler = () => {
    setShowCreateDietModal(true);
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
              Diets
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
              Diets
            </Typography>
            <Button
              color='primary'
              startDecorator={<AddRoundedIcon />}
              size='sm'
              onClick={createDietHandler}
            >
              Create Diet
            </Button>
          </Box>
        </Box>
        <Stack
          sx={{
            display: 'flex',
            px: { xs: 2, md: 6 },
          }}
        >
          <CreateDiet
            open={showCreateDietModal}
            setOpen={setShowCreateDietModal}
          />
          <DietFilters onSubmit={submitFiltersHandler} />
          {/* <ClientList
            clients={diets}
            totalRecords={totalRecords}
            pageSize={pageSize}
            currentPage={currentPage}
            isLoading={isLoading}
            onPageChange={changePageHandler}
          /> */}
          <DietTable
            diets={diets}
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

export default DietsPage;

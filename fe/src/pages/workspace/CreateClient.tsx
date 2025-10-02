import { Box, Breadcrumbs, Link, Stack, Typography } from '@mui/joy';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import CreateClientForm from '../../components/Clients/CreateClientForm';

const CreateClientsPage: React.FC = () => {
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
            <Link
              underline='none'
              color='neutral'
              href='/clients'
              aria-label='Home'
            >
              Clients
            </Link>
            <Typography color='primary' sx={{ fontWeight: 500, fontSize: 12 }}>
              Create Client
            </Typography>
          </Breadcrumbs>
          <Typography level='h2' component='h1'>
            Create Client
          </Typography>
        </Box>
        <Stack
          sx={{
            display: 'flex',
            px: { xs: 2, md: 6 },
          }}
        >
          <CreateClientForm />
        </Stack>
      </Box>
    </Box>
  );
};

export default CreateClientsPage;

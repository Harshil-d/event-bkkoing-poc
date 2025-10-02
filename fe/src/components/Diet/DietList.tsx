import {
  Avatar,
  Box,
  IconButton,
  List,
  ListDivider,
  ListItem,
  ListItemContent,
  ListItemDecorator,
  Typography,
} from '@mui/joy';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

import { IClientSummary } from '../../interfaces/client.interface';
import { formatContactNumber } from '../../utilities/formatter.utility';
import { formatDate } from '../../utilities/dateTime.utility';
import ClientItemMenu from '../Clients/ClientItemMenu';
import ClientStatusChip from '../Clients/ClientStatusChip';
import ClientGenderChip from '../Clients/ClientGenderChip';

export interface IClientListProps {
  clients: IClientSummary[];
  totalRecords: number;
  pageSize: number;
  currentPage: number;
  isLoading: boolean;
  onPageChange(page: number): void;
}

const ClientList: React.FC<IClientListProps> = (props) => {
  const totalPages = Math.ceil(props.totalRecords / props.pageSize);

  return (
    <Box
      sx={{
        borderRadius: 'sm',
        display: { xs: 'flex', sm: 'none' },
        flexWrap: 'wrap',
        gap: 1.5,
        '& > *': {
          minWidth: { xs: '120px', md: '160px' },
        },
        py: 3,
      }}
    >
      {props.clients.length ? (
        props.clients.map((row) => (
          <List key={row.id} size='sm' sx={{ '--ListItem-paddingX': 0 }}>
            <ListItem
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
              }}
            >
              <ListItemContent
                sx={{ display: 'flex', gap: 2, alignItems: 'start' }}
              >
                <ListItemDecorator>
                  <Avatar size='sm'>{row.firstName.substring(0, 1)}</Avatar>
                </ListItemDecorator>
                <div>
                  <Typography gutterBottom sx={{ fontWeight: 600 }}>
                    {`${row.firstName} ${row.lastName}`.trim()}
                  </Typography>
                  <Typography level='body-xs' gutterBottom>
                    {row.email}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 0.5,
                    }}
                  >
                    <Typography level='body-xs'>
                      {formatDate(row.dob)}
                    </Typography>
                    <Typography level='body-xs'>&bull;</Typography>
                    <Typography level='body-xs'>
                      {formatContactNumber(row.contactNumber)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Typography level='body-xs'>
                      Managed by {row.dietitian}
                    </Typography>
                    <ClientItemMenu id={row.id} />
                  </Box>
                </div>
              </ListItemContent>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: 1,
                  mb: 1,
                }}
              >
                <ClientStatusChip status={row.isActive} />
                <ClientGenderChip gender={row.gender} />
              </Box>
            </ListItem>
            <ListDivider />
          </List>
        ))
      ) : (
        <Box sx={{ margin: 'auto' }}>
          <Typography level='title-sm' sx={{ textAlign: 'center' }}>
            {!props.isLoading ? 'No records available' : 'Loading...'}
          </Typography>
        </Box>
      )}
      <Box
        className='Pagination-mobile'
        sx={{
          display: { xs: 'flex', md: 'none' },
          alignItems: 'center',
          py: 2,
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <IconButton
          aria-label='previous page'
          variant='outlined'
          color='neutral'
          size='sm'
          disabled={props.currentPage === 1 || totalPages === 0}
          onClick={() => props.onPageChange(props.currentPage - 1)}
        >
          <KeyboardArrowLeftIcon />
        </IconButton>
        <Typography level='body-sm' sx={{ mx: 'auto' }}>
          Page {totalPages ? props.currentPage : 0} of {totalPages}
        </Typography>
        <IconButton
          aria-label='next page'
          variant='outlined'
          color='neutral'
          size='sm'
          disabled={props.currentPage === totalPages || totalPages === 0}
          onClick={() => props.onPageChange(props.currentPage + 1)}
        >
          <KeyboardArrowRightIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ClientList;

import { Avatar, Box, Button, Sheet, Table, Typography } from '@mui/joy';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import IconButton, { iconButtonClasses } from '@mui/joy/IconButton';

import { formatDate } from '../../utilities/dateTime.utility';
import { formatContactNumber } from '../../utilities/formatter.utility';
import { IDietItemSummary } from '../../interfaces/diet.interface';
import ClientItemMenu from '../Clients/ClientItemMenu';

export interface IDietTableProps {
  diets: IDietItemSummary[];
  totalRecords: number;
  pageSize: number;
  currentPage: number;
  isLoading: boolean;
  onPageChange(page: number): void;
}

const DietTable: React.FC<IDietTableProps> = (props) => {
  const totalPages = Math.ceil(props.totalRecords / props.pageSize);
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <Box
      sx={{
        borderRadius: 'sm',
        display: { xs: 'none', sm: 'flex' },
        flexWrap: 'wrap',
        gap: 1.5,
        '& > *': {
          minWidth: { xs: '120px', md: '160px' },
        },
        py: 2,
      }}
    >
      <Sheet
        className='OrderTableContainer'
        variant='outlined'
        sx={{
          display: { xs: 'none', sm: 'initial' },
          width: '100%',
          borderRadius: 'sm',
          flexShrink: 1,
          overflow: 'auto',
          minHeight: 0,
        }}
      >
        <Table
          aria-labelledby='tableTitle'
          stickyHeader
          hoverRow
          sx={{
            '--TableCell-headBackground':
              'var(--joy-palette-background-level1)',
            '--Table-headerUnderlineThickness': '1px',
            '--TableRow-hoverBackground':
              'var(--joy-palette-background-level1)',
            '--TableCell-paddingY': '4px',
            '--TableCell-paddingX': '8px',
          }}
        >
          <thead>
            <tr>
              <th style={{ width: 240, padding: '12px 6px' }}>Client</th>
              <th style={{ width: 100, padding: '12px 6px' }}>Date</th>
              <th style={{ width: 140, padding: '12px 6px' }}>Date of Birth</th>
              <th style={{ width: 140, padding: '12px 6px' }}>
                Contact Number
              </th>
              <th style={{ width: 160, padding: '12px 6px' }}>Dietitian</th>
              <th style={{ width: 140, padding: '12px 6px' }}> </th>
            </tr>
          </thead>
          {props.diets.length ? (
            <tbody>
              {props.diets.map((row) => (
                <tr key={row.id}>
                  <td>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Avatar size='sm'>{row.client.substring(0, 1)}</Avatar>
                      <div>
                        <Typography level='body-xs'>{row.client}</Typography>
                        <Typography level='body-xs'>{row.email}</Typography>
                      </div>
                    </Box>
                  </td>
                  <td>
                    <div>
                      <Typography level='body-xs'>
                        {row.startDate === row.endDate
                          ? formatDate(row.startDate)
                          : `${formatDate(row.startDate)} - ${formatDate(
                              row.endDate
                            )}`}
                      </Typography>
                    </div>
                  </td>
                  <td>
                    <Typography level='body-xs'>{row.dietaryHabit}</Typography>
                  </td>
                  <td>
                    <Typography level='body-xs'>
                      {row.dietPreference}
                    </Typography>
                  </td>
                  <td>
                    <Typography level='body-xs'>{row.dietitian}</Typography>
                  </td>
                  <td>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <ClientItemMenu id={row.id} />
                    </Box>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan={7} align='center'>
                  <Typography level='title-sm'>
                    {!props.isLoading ? 'No records available' : 'Loading...'}
                  </Typography>
                </td>
              </tr>
            </tbody>
          )}
        </Table>
      </Sheet>
      <Box
        sx={{
          pt: 2,
          gap: 1,
          [`& .${iconButtonClasses.root}`]: { borderRadius: '50%' },
          display: {
            xs: 'none',
            md: 'flex',
          },
          width: '100%',
        }}
      >
        <Button
          size='sm'
          variant='outlined'
          color='neutral'
          startDecorator={<KeyboardArrowLeftIcon />}
          disabled={props.currentPage === 1 || totalPages === 0}
          onClick={() => props.onPageChange(props.currentPage - 1)}
        >
          Previous
        </Button>

        <Box sx={{ flex: 1 }} />
        {pages.map((page) => (
          <IconButton
            key={page}
            size='sm'
            variant={props.currentPage === page ? 'outlined' : 'soft'}
            color='neutral'
            disabled={page === props.currentPage}
            onClick={() => props.onPageChange(page)}
          >
            {page}
          </IconButton>
        ))}
        <Box sx={{ flex: 1 }} />
        <Button
          size='sm'
          variant='outlined'
          color='neutral'
          endDecorator={<KeyboardArrowRightIcon />}
          disabled={props.currentPage === totalPages || totalPages === 0}
          onClick={() => props.onPageChange(props.currentPage + 1)}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default DietTable;

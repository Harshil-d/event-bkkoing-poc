import { Chip, ColorPaletteProp } from '@mui/joy';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';

export interface IClientStatusChipProps {
  status: boolean;
}

const ClientStatusChip: React.FC<IClientStatusChipProps> = ({ status }) => {
  return (
    <Chip
      variant='soft'
      size='sm'
      startDecorator={
        {
          active: <CheckRoundedIcon />,
          inactive: <RemoveCircleOutlineRoundedIcon />,
        }[status ? 'active' : 'inactive']
      }
      color={
        {
          active: 'success',
          inactive: 'danger',
        }[status ? 'active' : 'inactive'] as ColorPaletteProp
      }
    >
      {status ? 'Active' : 'Inactive'}
    </Chip>
  );
};

export default ClientStatusChip;

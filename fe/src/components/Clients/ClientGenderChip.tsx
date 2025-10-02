import { Chip, useColorScheme } from '@mui/joy';
import { toTitleCase } from '../../utilities/formatter.utility';
import MaleRoundedIcon from '@mui/icons-material/MaleRounded';
import FemaleRoundedIcon from '@mui/icons-material/FemaleRounded';
import TransgenderRoundedIcon from '@mui/icons-material/TransgenderRounded';

export interface IClientGenderChipProps {
  gender: string;
}

const ClientGenderChip: React.FC<IClientGenderChipProps> = ({ gender }) => {
  const { mode } = useColorScheme();

  return (
    <Chip
      variant='soft'
      size='sm'
      startDecorator={
        {
          MALE: <MaleRoundedIcon />,
          FEMALE: <FemaleRoundedIcon />,
          OTHER: <TransgenderRoundedIcon />,
        }[gender]
      }
      sx={{
        backgroundColor: {
          MALE: mode === 'dark' ? '#1E3A5F' : '#ADD8E6',
          FEMALE: mode === 'dark' ? '#8B3A62' : '#FFB6C1',
          OTHER: mode === 'dark' ? '#4B0082' : '#E6E6FA',
        }[gender],
        color: {
          MALE: mode === 'dark' ? '#00FFFF' : '#003366',
          FEMALE: mode === 'dark' ? '#FF6EC7' : '#C71585',
          OTHER: mode === 'dark' ? '#8F00FF' : '#4B0082',
        }[gender],
      }}
    >
      {toTitleCase(gender)}
    </Chip>
  );
};

export default ClientGenderChip;

import { Dropdown, Menu, MenuButton, MenuItem } from '@mui/joy';
import IconButton from '@mui/joy/IconButton';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useNavigate } from 'react-router-dom';

export interface IClientItemMenuProps {
  id: number;
}

const ClientItemMenu: React.FC<IClientItemMenuProps> = (props) => {
  const navigate = useNavigate();

  const editClientHandler = () => {
    navigate(`/clients/${props.id}`);
  };

  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{
          root: {
            variant: 'plain',
            color: 'neutral',
            size: 'sm',
          },
        }}
      >
        <MoreHorizRoundedIcon />
      </MenuButton>
      <Menu size='sm' sx={{ minWidth: 140 }}>
        <MenuItem onClick={editClientHandler}>
          <EditRoundedIcon />
          Edit
        </MenuItem>
      </Menu>
    </Dropdown>
  );
};

export default ClientItemMenu;

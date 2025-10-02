import { NavLink } from 'react-router-dom';

import {
  ListItem,
  ListItemButton,
  ListItemContent,
  Typography,
} from '@mui/joy';
import { closeSidebar } from '../../utilities/sidebar.utility';

export interface ISidebarLinkProps {
  text: string;
  path: string;
  children: React.ReactNode;
}

const SidebarLink: React.FC<ISidebarLinkProps> = (props) => {
  return (
    <NavLink
      to={props.path}
      title={props.text}
      style={{ textDecoration: 'none' }}
      onClick={() => closeSidebar()}
    >
      {({ isActive }) => (
        <ListItem>
          <ListItemButton selected={isActive}>
            {props.children}
            <ListItemContent>
              <Typography level='title-sm'>{props.text}</Typography>
            </ListItemContent>
          </ListItemButton>
        </ListItem>
      )}
    </NavLink>
  );
};

export default SidebarLink;

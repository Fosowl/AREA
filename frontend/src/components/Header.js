import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AddLinkIcon from '@mui/icons-material/AddLink';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { NavLink } from "react-router-dom";
import { Colors } from 'Theme';

export default function Header(props) {
  const { page } = props;

  function getTitle(page_name) {
    if (page_name == "add_widget") {
      return "Add a widget";
    } else if (page_name == "dashboard") {
      return "AREA Dashboard";
    } else if (page_name == "profile") {
      return "Profile";
    } else if (page_name == "settings") {
      return "Settings";
    } else if (page_name == "update_widget") {
      return "Update your widget";
    }
  }
  
  let title = getTitle(page);
  let back_toggled = page == "dashboard" ? false : true;

  return (
    <Box sx={{ flexGrow: 1 }} style={{ marginBottom: 50, width: '100%' }}>
      <AppBar style={{ backgroundColor: Colors.primary }} position="static">
        <Toolbar>
          {!back_toggled && (
            <NavLink exact to={{ pathname: '/settings' }}
                     style={{ color: Colors.white, borderRadius: '50px' }}>
              <AddLinkIcon style={{fontSize: 45}}/>
            </NavLink>
          )}
          {back_toggled && (
            <NavLink exact to={{ pathname: '/home' }}
                     style={{ color: Colors.white, borderRadius: '50px' }}>
              <ArrowBackIosNewIcon style={{fontSize: 45}}/>
            </NavLink>
          )}
          <NavLink exact to={{pathname: '/home'}}
                   style={{ color: Colors.white, flex: 1 }}>
            <Typography
              component="h2" variant="h4" color={Colors.white} align="center"
              noWrap sx={{ flex: 1 }}
            >
              {title}
            </Typography>
          </NavLink>
          <NavLink exact to={{ pathname: '/profile' }}
                   style={{ color: Colors.white, borderRadius: '50px' }}>
            <PersonOutlineIcon style={{fontSize: 45}}/>
          </NavLink>
        </Toolbar>
      </AppBar>
     </Box>
  );
}
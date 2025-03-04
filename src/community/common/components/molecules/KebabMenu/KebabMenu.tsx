import { Box, Typography, useTheme } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { FC, MouseEvent, ReactNode, useState } from "react";

import Icon from "~community/common/components/atoms/Icon/Icon";
import { IconName } from "~community/common/types/IconTypes";
import { MenuItemTypes } from "~community/common/types/MoleculeTypes";

import styles from "./styles";

interface KebabMenuProps {
  id: string | number;
  menuItems: MenuItemTypes[];
  icon?: ReactNode;
  ariaLabel?: string;
  menuAlign?: {
    anchorOrigin?: { vertical: "top" | "bottom"; horizontal: "left" | "right" }; // TODO: Use enum
    transformOrigin?: {
      vertical: "top" | "bottom"; // TODO: Use enum
      horizontal: "left" | "right"; // TODO: Use enum
    };
  };
  customStyles?: {
    wrapper?: object;
    menuIcon?: object;
    menu?: object;
    menuItem?: object;
    menuItemText?: object;
  };
}

const KebabMenu: FC<KebabMenuProps> = ({
  menuItems,
  icon = <Icon name={IconName.THREE_DOTS_ICON} />,
  ariaLabel = "menu button",
  menuAlign = {
    anchorOrigin: { vertical: "top", horizontal: "left" },
    transformOrigin: { vertical: "top", horizontal: "left" }
  },
  customStyles = {}
}) => {
  const theme = useTheme();
  const classes = styles(theme);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleMenuBtnClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (
    _event: MouseEvent<HTMLElement>,
    item: MenuItemTypes
  ) => {
    item?.onClickHandler();
    setAnchorEl(null);
  };

  return (
    <Box sx={{ ...classes.wrapper, ...customStyles.wrapper }}>
      <Box
        onClick={handleMenuBtnClick}
        sx={{ ...classes.menuIcon, ...customStyles.menuIcon }}
        aria-label={ariaLabel}
        role="button"
      >
        {icon}
      </Box>
      <Box>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={menuAlign.anchorOrigin}
          transformOrigin={menuAlign.transformOrigin}
          sx={{ ...classes.menu, ...customStyles.menu }}
        >
          {menuItems?.map((item: MenuItemTypes) => (
            <MenuItem
              key={item?.id}
              sx={{
                ...classes.menuItem,
                ...customStyles.menuItem,
                color: item?.color ?? theme.palette.common.black
              }}
              onClick={(event) => handleMenuItemClick(event, item)}
              disabled={item?.isDisabled}
            >
              {item?.icon && <Box>{item?.icon}</Box>}
              <Typography
                sx={{ ...classes.menuItemText, ...customStyles.menuItemText }}
              >
                {item?.text}
              </Typography>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Box>
  );
};

export default KebabMenu;

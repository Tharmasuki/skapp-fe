import { Stack } from "@mui/material";
import { type Theme, useTheme } from "@mui/material/styles";
import { Box, type SxProps } from "@mui/system";
import { JSX, MouseEvent, useCallback, useState } from "react";

import DropDownArrow from "~community/common/assets/Icons/DropdownArrow";
import Button from "~community/common/components/atoms/Button/Button";
import IconButton from "~community/common/components/atoms/IconButton/IconButton";
import Popper from "~community/common/components/molecules/Popper/Popper";
import {
  ButtonSizes,
  ButtonStyle
} from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { MenuTypes } from "~community/common/types/MoleculeTypes";
import { SelectedFiltersTypes } from "~community/leave/types/LeaveUtilizationTypes";

const buttonStyles = {
  borderRadius: "64px",
  padding: "4px 8px",
  width: "fit-content",
  fontSize: "12px",
  margin: "2px",
  lineHeight: "16px"
};

type Props = {
  toggle: SelectedFiltersTypes;
  onClick: (i: string) => void;
  colors?: Record<string, string>;
  maxTypeToShow?: number;
  styles?: SxProps;
  isGraph?: boolean;
};

const LeaveTypeBreakdownButtons = ({
  onClick,
  toggle,
  colors,
  maxTypeToShow = 3,
  styles,
  isGraph = false
}: Props): JSX.Element => {
  const theme: Theme = useTheme();

  const maxLeaveTypeToShow = maxTypeToShow;
  const [open, setOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const count = toggle
    ? Object.values(toggle).filter((value) => value).length
    : null;
  const translateText = useTranslator("commonComponents", "multiTeamSelector");

  const colorIndicator = (color: string): JSX.Element => {
    return (
      <Box
        sx={{
          backgroundColor: color,
          height: "8px",
          width: "8px"
        }}
      ></Box>
    );
  };

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const renderButtons = useCallback(
    (filterTypesArray: SelectedFiltersTypes) => {
      return Object.keys(filterTypesArray).map((filterType) => {
        return (
          <Button
            key={filterType}
            isFullWidth={false}
            startIcon={!isGraph ? null : colorIndicator(colors[filterType])}
            label={filterType}
            onClick={() => onClick(filterType)}
            buttonStyle={
              toggle[filterType] ? ButtonStyle.SECONDARY : ButtonStyle.TERTIARY
            }
            size={ButtonSizes.SMALL}
            styles={{
              ...buttonStyles,
              backgroundColor: toggle[filterType]
                ? null
                : theme.palette.grey[100],
              color: theme.palette.grey[900]
            }}
          />
        );
      });
    },
    [colors, onClick, theme.palette.grey, toggle, isGraph]
  );

  const renderTypes = useCallback(() => {
    if (toggle) {
      return (
        <>
          <Box display={"flex"}>
            {renderButtons(
              Object.fromEntries(
                Object.entries(toggle).slice(0, maxLeaveTypeToShow)
              ),
              0
            )}

            {Object.keys(toggle).length > maxLeaveTypeToShow && (
              <>
                <IconButton
                  text={`+ ${count - maxLeaveTypeToShow} ${translateText(["selected"])}`}
                  icon={<DropDownArrow />}
                  buttonStyles={{
                    bgcolor:
                      count > maxLeaveTypeToShow
                        ? theme.palette.secondary.main
                        : theme.palette.common.white,
                    p: "2px 10px",
                    marginX: "2px",
                    border:
                      count > maxLeaveTypeToShow
                        ? `1px solid ${theme.palette.secondary.dark}`
                        : null
                  }}
                  isTextPermenent={count > maxLeaveTypeToShow}
                  onClick={(e: MouseEvent<HTMLElement>) => handleClick(e)}
                />

                <Popper
                  anchorEl={anchorEl}
                  open={open}
                  position={"bottom-end"}
                  id={"show more types"}
                  menuType={MenuTypes.GRAPH}
                  timeout={300}
                  handleClose={() => {
                    setOpen((previousOpen) => !previousOpen);
                  }}
                >
                  <Box
                    sx={{
                      borderRadius: "12px",
                      padding: "4px",
                      width: "fit-content",
                      maxWidth: "300px",
                      backgroundColor: theme.palette.grey[200],
                      height: "fit-content"
                    }}
                  >
                    {renderButtons(
                      Object.fromEntries(
                        Object.entries(toggle).slice(maxLeaveTypeToShow)
                      ),
                      maxLeaveTypeToShow
                    )}
                  </Box>
                </Popper>
              </>
            )}
          </Box>
        </>
      );
    }
  }, [
    toggle,
    renderButtons,
    maxLeaveTypeToShow,
    count,
    theme.palette.secondary.main,
    theme.palette.secondary.dark,
    theme.palette.common.white,
    theme.palette.grey,
    anchorEl,
    open
  ]);

  return (
    <Stack
      direction={"row"}
      sx={{
        borderRadius: "58px",
        width: "auto",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: theme.palette.grey[200],
        padding: "4px",
        ...styles
      }}
    >
      {renderTypes()}
    </Stack>
  );
};

export default LeaveTypeBreakdownButtons;

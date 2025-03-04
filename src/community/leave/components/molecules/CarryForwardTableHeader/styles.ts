import { Theme } from "@mui/material/styles";

import { ZIndexEnums } from "~community/common/enums/CommonEnums";

export const carryForwardTableHeaderStyles = (theme: Theme) => ({
  headerContainer: {
    width: "max-content",
    height: "4.3rem",
    alignItems: "center",
    justifyContent: "center",
    background: theme.palette.grey[100],
    borderWidth: "0.063rem 0rem",
    borderStyle: "solid",
    borderRadius: "0.5rem",
    borderColor: theme.palette.grey[500],
    borderTopStyle: "none",
    position: "relative",
    [theme.breakpoints.down("xl")]: {
      width: "max-content"
    }
  },
  stickyColumn: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1.1,
    padding: "0.5rem 1rem",
    minWidth: "15rem",
    background: theme.palette.grey[100],
    position: "sticky",
    left: 0,
    zIndex: ZIndexEnums.LEVEL_2,
    [theme.breakpoints.down("lg")]: {
      flex: 0.5,
      minWidth: "10rem"
    },
    height: "100%",
    borderRightColor: theme.palette.grey[500]
  },
  columnText: {
    letterSpacing: "0.03em",
    color: theme.palette.text.secondary
  },
  headerCell: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    minWidth: "8.5rem",
    zIndex: ZIndexEnums.DEFAULT,
    borderRadius: "0.5rem"
  },
  headerDateText: {
    letterSpacing: "0.03em",
    color: theme.palette.text.secondary,
    whiteSpace: "nowrap",
    textAlign: "center",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  emojiChipContainer: {
    pr: "0.25rem",
    borderColor: theme.palette.grey[500]
  },
  emojiTitle: {
    fontSize: "0.625rem"
  }
});

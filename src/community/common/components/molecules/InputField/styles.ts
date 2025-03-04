import { type Theme } from "@mui/material";

import { StyleProps } from "~community/common/types/CommonTypes";

const styles = (theme: Theme): StyleProps => ({
  labelWrapper: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between"
  },
  tooltipWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  requiredSpan: {
    color: "red"
  },
  defaultInputStyles: {
    mt: "0.5rem",
    height: "3rem",
    borderRadius: "0.5rem",
    overflow: "hidden",
    display: "flex",
    color: theme.palette.text.secondary,
    "&& input:-webkit-autofill": {
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: theme.palette.grey[700]
    }
  },
  multiValueOuterBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    flexWrap: "wrap",
    width: "100%",
    justifyContent: "space-between"
  },
  multiValueBasicChip: {
    py: "0.5rem",
    px: "1rem",
    mx: "0.25rem"
  },
  defaultInputBaseStyles: {
    flex: 1,
    color: theme.palette.grey[700],
    fontSize: "1rem",
    fontWeight: 400,
    "&& .MuiInputBase-input": {
      p: "0.7813rem 1rem",
      "&.Mui-disabled": {
        WebkitTextFillColor: theme.palette.grey[600]
      }
    },
    "&& .MuiInputAdornment-root": {
      margin: "0.5rem"
    },
    "&& input::-ms-reveal": {
      display: "none"
    },
    "&& .MuiInputBase-input::placeholder": {
      color: theme.palette.grey[600],
      opacity: 1
    }
  },
  defaultHelperTextStyles: {
    mt: "0.5rem",
    lineHeight: "1rem"
  },
  errorTypography: {
    color: theme.palette.error.contrastText,
    lineHeight: "1rem"
  }
});

export default styles;

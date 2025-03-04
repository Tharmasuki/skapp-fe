import { Box, Theme, Typography, useTheme } from "@mui/material";
import { FC } from "react";

interface Props {
  label: string;
  text: string | undefined;
  id?: string;
  isDisabled?: boolean;
  setInputText?: (value: string) => void;
  error?: boolean;
  errorMessage?: string;
  isForAForm?: boolean;
  setInputTextAndKey?: (label: string, value: string) => void;
  ariaLabel?: string;
  isReadOnly?: boolean;
}

const LeaveStatusPopupColumn: FC<Props> = ({
  label,
  text,
  id,
  isDisabled,
  setInputText,
  error,
  errorMessage,
  isForAForm = false,
  setInputTextAndKey,
  ariaLabel,
  isReadOnly = false
}) => {
  const theme: Theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Typography
        variant="body1"
        sx={{
          marginBottom: "0.75rem",
          color: error ? theme.palette.error.contrastText : "black"
        }}
        aria-hidden={true}
      >
        {label}
      </Typography>
      <textarea
        id={id}
        readOnly={isReadOnly}
        style={{
          maxWidth: "100%",
          width: "100%",
          minWidth: "100%",
          maxHeight: "5rem",
          height: "5rem",
          minHeight: "5rem",
          background: error
            ? theme.palette.error.light
            : theme.palette.grey[100],
          borderRadius: "8px",
          border: error
            ? `${theme.palette.error.contrastText} 1px solid`
            : "none",
          outline: "none",
          padding: 12,
          fontFamily: "Poppins",
          fontStyle: "normal",
          fontWeight: "400",
          fontSize: " 16px",
          resize: "none"
        }}
        value={text}
        onChange={
          isForAForm
            ? (e) => setInputTextAndKey?.(label, e.target.value)
            : (e) => setInputText?.(e.target.value)
        }
        disabled={isDisabled ?? false}
        aria-label={ariaLabel}
        aria-invalid={!!error}
        aria-readonly={isReadOnly}
      />
      {error && (
        <Typography
          id={`${id ?? ""}-error`}
          variant="body2"
          sx={{ color: theme.palette.error.contrastText }}
          component="p"
          aria-atomic={true}
          aria-live="polite"
        >
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
};

export default LeaveStatusPopupColumn;

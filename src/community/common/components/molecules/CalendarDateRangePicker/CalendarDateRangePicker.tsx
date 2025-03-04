import { Stack, Theme, Typography, useTheme } from "@mui/material";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DateTime } from "luxon";
import { FC, useEffect } from "react";

import PickersDay from "~community/common/components/molecules/CalendarDateRangePickersDay/CalendarDateRangePickersDay";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import {
  handleDateChange,
  handleDateValidation,
  isNotAWorkingDate
} from "~community/common/utils/calendarDateRangePickerUtils";
import {
  formatDateTimeWithOrdinalIndicator,
  getCurrentDateAtMidnight
} from "~community/common/utils/dateTimeUtils";
import { LeaveDurationTypes } from "~community/leave/enums/LeaveTypeEnums";
import { MyLeaveRequestPayloadType } from "~community/leave/types/MyRequests";
import { Holiday } from "~community/people/types/HolidayTypes";

import styles from "./styles";

interface Props {
  selectedDates: DateTime[];
  setSelectedDates: (dates: DateTime[]) => void;
  setSelectedMonth: (month: number) => void;
  error?: string | undefined;
  allowedDuration: LeaveDurationTypes;
  minDate: Date;
  maxDate: Date;
  isRangePicker?: boolean;
  workingDays: string[];
  myLeaveRequests: MyLeaveRequestPayloadType[] | undefined;
  allHolidays: Holiday[] | undefined;
}

const CalendarDateRangePicker: FC<Props> = ({
  selectedDates,
  setSelectedDates,
  setSelectedMonth,
  error,
  allowedDuration,
  minDate,
  maxDate,
  isRangePicker = true,
  workingDays = [],
  myLeaveRequests,
  allHolidays
}) => {
  const theme: Theme = useTheme();
  const classes = styles(theme);

  const translateText = useTranslator(
    "commonComponents",
    "calendarDataRangePicker"
  );

  const { setToastMessage } = useToast();

  useEffect(() => {
    handleDateValidation({
      allowedDuration,
      selectedDates,
      myLeaveRequests,
      setToastMessage,
      translateText,
      allHolidays
    });
  }, [selectedDates]);

  const onDayClick = (date: DateTime<boolean>) => {
    handleDateChange({
      date,
      isRangePicker,
      selectedDates,
      setSelectedDates
    });
  };

  return (
    <Stack sx={classes.wrapper}>
      <Typography variant="body1" sx={error ? classes.error : {}}>
        {translateText(["label"])} &nbsp;
        <Typography component="span" variant="body1" sx={classes.asterisk}>
          *
        </Typography>
      </Typography>
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <StaticDatePicker
          sx={classes.staticDatePicker}
          displayStaticWrapperAs="desktop"
          value={
            selectedDates.length > 0
              ? selectedDates[selectedDates.length - 1]
              : getCurrentDateAtMidnight()
          }
          slots={{
            day: (props) =>
              PickersDay({
                pickerDaysProps: props,
                selectedDates,
                onDayClick,
                isRangePicker,
                myLeaveRequests,
                workingDays,
                allHolidays
              })
          }}
          slotProps={{
            leftArrowIcon: {
              sx: classes.leftArrowIcon
            },
            rightArrowIcon: {
              sx: classes.rightArrowIcon
            }
          }}
          minDate={minDate ? DateTime.fromJSDate(minDate) : undefined}
          maxDate={maxDate ? DateTime.fromJSDate(maxDate) : undefined}
          onMonthChange={(date: DateTime) => setSelectedMonth(date?.month)}
          shouldDisableDate={(date) => isNotAWorkingDate({ date, workingDays })}
        />
      </LocalizationProvider>
      <Stack sx={classes.fieldsWrapper}>
        <Typography component="div" variant="body1" sx={classes.field}>
          {selectedDates.length > 0
            ? formatDateTimeWithOrdinalIndicator(selectedDates[0])
            : translateText(["startDate"])}
        </Typography>
        <Typography component="div" variant="body1" sx={classes.field}>
          {selectedDates.length > 1
            ? formatDateTimeWithOrdinalIndicator(selectedDates[1])
            : translateText(["endDate"])}
        </Typography>
      </Stack>
      {!!error && (
        <Typography variant="caption" sx={classes.error}>
          {error}
        </Typography>
      )}
    </Stack>
  );
};

export default CalendarDateRangePicker;

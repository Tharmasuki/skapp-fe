import { Stack, Typography } from "@mui/material";
import { type Theme, useTheme } from "@mui/material/styles";

import { useAddManualTimeEntry } from "~community/attendance/api/AttendanceEmployeeApi";
import { durationSelector } from "~community/attendance/constants/constants";
import { EmployeeTimesheetModalTypes } from "~community/attendance/enums/timesheetEnums";
import { useAttendanceStore } from "~community/attendance/store/attendanceStore";
import {
  convertToUtc,
  getCurrentTimeZone
} from "~community/attendance/utils/TimeUtils";
import Button from "~community/common/components/atoms/Button/Button";
import BasicChip from "~community/common/components/atoms/Chips/BasicChip/BasicChip";
import IconChip from "~community/common/components/atoms/Chips/IconChip.tsx/IconChip";
import { ButtonStyle, ToastType } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { IconName } from "~community/common/types/IconTypes";
import { convertDateToFormat } from "~community/common/utils/dateTimeUtils";

interface Props {
  fromDateTime: string;
  toDateTime: string;
}

const HolidayEntryConfirmation = ({ fromDateTime, toDateTime }: Props) => {
  const theme: Theme = useTheme();
  const translateText = useTranslator("attendanceModule", "timesheet");
  const { setToastMessage } = useToast();
  const {
    timeAvailabilityForPeriod,
    setIsEmployeeTimesheetModalOpen,
    setEmployeeTimesheetModalType
  } = useAttendanceStore((state) => state);

  const onSuccess = () => {
    setToastMessage({
      open: true,
      title: translateText(["addTimeEntrySuccessTitle"]),
      description: translateText(["addTimeEntrySuccessDes"]),
      toastType: ToastType.SUCCESS
    });
  };

  const onError = () => {
    setToastMessage({
      open: true,
      title: translateText(["addTimeEntryErrorTitle"]),
      description: translateText(["addTimeEntryErrorDes"]),
      toastType: ToastType.ERROR
    });
  };

  const { mutate: manualEntryMutate } = useAddManualTimeEntry(
    onSuccess,
    onError
  );

  const handleSubmit = () => {
    manualEntryMutate({
      startTime: convertToUtc(fromDateTime) as string,
      endTime: convertToUtc(toDateTime) as string,
      zoneId: getCurrentTimeZone()
    });
    setIsEmployeeTimesheetModalOpen(false);
  };

  return (
    <>
      <Typography variant="body1" sx={{ py: "1rem" }}>
        {translateText(["holidayConfirmationModalDes"])}
      </Typography>
      <Stack
        display={"flex"}
        direction={"row"}
        justifyContent={"flex-start"}
        alignItems={"center"}
        gap={"1rem"}
        sx={{ pb: "1rem" }}
      >
        <Typography variant="body1">
          {translateText(["durationLabel"])}
        </Typography>
        <BasicChip
          label={
            durationSelector[
              timeAvailabilityForPeriod?.holiday?.[0]?.holidayDuration
            ]
          }
          chipStyles={{ background: theme.palette.grey[100] }}
        />
        <BasicChip
          label={convertDateToFormat(
            new Date(timeAvailabilityForPeriod?.date),
            "dd LLL yyyy"
          )}
          chipStyles={{
            background: theme.palette.grey[100],
            "& .MuiChip-label": {
              maxWidth: undefined
            }
          }}
        />
      </Stack>
      <Stack
        display={"flex"}
        direction={"row"}
        justifyContent={"flex-start"}
        alignItems={"center"}
        gap={"1rem"}
      >
        <Typography variant="body1">
          {translateText(["holidayTypeLabel"])}
        </Typography>
        <IconChip
          label={"Holiday"}
          icon={"1f3d6-fe0f"}
          chipStyles={{
            backgroundColor: theme.palette.grey[100]
          }}
          isTruncated={false}
        />
      </Stack>
      <Button
        label={translateText(["confirmBtnTxt"])}
        styles={{
          mt: "1rem"
        }}
        buttonStyle={ButtonStyle.PRIMARY}
        endIcon={IconName.CHECK_ICON}
        onClick={handleSubmit}
      />
      <Button
        label={translateText(["cancelBtnTxt"])}
        styles={{
          mt: "1rem"
        }}
        buttonStyle={ButtonStyle.TERTIARY}
        endIcon={IconName.CLOSE_ICON}
        onClick={() => {
          setIsEmployeeTimesheetModalOpen(true);
          setEmployeeTimesheetModalType(
            EmployeeTimesheetModalTypes.ADD_TIME_ENTRY
          );
        }}
      />
    </>
  );
};

export default HolidayEntryConfirmation;

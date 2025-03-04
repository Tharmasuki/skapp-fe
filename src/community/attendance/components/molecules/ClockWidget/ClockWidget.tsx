import { Stack } from "@mui/material";
import { type NextRouter, useRouter } from "next/router";
import { JSX, useEffect, useMemo } from "react";

import {
  useGetEmployeeLeaveStatus,
  useGetEmployeeStatus
} from "~community/attendance/api/AttendanceApi";
import { useGetTodaysTimeRequestAvailability } from "~community/attendance/api/AttendanceEmployeeApi";
import ClockInButton from "~community/attendance/components/molecules/ClockInButton/ClockInButton";
import Timer from "~community/attendance/components/molecules/Timer/Timer";
import { useAttendanceStore } from "~community/attendance/store/attendanceStore";
import { AttendanceSlotType } from "~community/attendance/types/attendanceTypes";
import Tooltip from "~community/common/components/atoms/Tooltip/Tooltip";
import { TooltipPlacement } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useDefaultCapacity } from "~community/configurations/api/timeConfigurationApi";
import { DefaultDayCapacityType } from "~community/configurations/types/TimeConfigurationsTypes";

import styles from "./styles";

const ClockWidget = (): JSX.Element => {
  const router: NextRouter = useRouter();
  const { attendanceParams } = useAttendanceStore((state) => state);
  const status = attendanceParams.slotType;
  const classes = styles();

  const { refetch: getEmployeeStatusRefetch } = useGetEmployeeStatus();
  const { data: timeConfigData } = useDefaultCapacity();
  const { refetch: refetchLeaveStatusData } = useGetEmployeeLeaveStatus(
    timeConfigData?.[0] as DefaultDayCapacityType
  );

  const {
    data: isTimeRequestAvailableToday,
    isLoading: isAvailabilityLoading
  } = useGetTodaysTimeRequestAvailability();

  const translateText = useTranslator("attendanceModule", "timeWidget");

  const isDisabled = useMemo(
    () =>
      status === AttendanceSlotType.END ||
      status === AttendanceSlotType.HOLIDAY ||
      status === AttendanceSlotType.NON_WORKING_DAY ||
      status === AttendanceSlotType.LEAVE_DAY ||
      isTimeRequestAvailableToday ||
      isAvailabilityLoading,
    [status, isTimeRequestAvailableToday, isAvailabilityLoading]
  );

  const title = useMemo(() => {
    if (!isDisabled) return "";

    switch (status) {
      case AttendanceSlotType.END:
        return translateText(["youHaveAlreadyLoggedTime"]);
      case AttendanceSlotType.HOLIDAY:
        return translateText(["notAllowedToClockInOnHolidaysTooltip"]);
      case AttendanceSlotType.NON_WORKING_DAY:
        return translateText(["notAllowedToClockInOnNonWorkingDaysTooltip"]);
      case AttendanceSlotType.LEAVE_DAY:
        return translateText(["notAllowedToClockInOnLeaveDaysTooltip"]);
      default:
        return "";
    }
  }, [isDisabled, status, translateText]);

  useEffect(() => {
    void getEmployeeStatusRefetch();
    void refetchLeaveStatusData();
  }, [router, getEmployeeStatusRefetch, refetchLeaveStatusData]);

  return (
    <Tooltip id="play-button" title={title} placement={TooltipPlacement.BOTTOM}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        component="div"
        sx={classes.container}
        tabIndex={0}
        aria-label="Clock Widget"
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          component="div"
          sx={classes.timerContainer(isDisabled)}
          tabIndex={0}
        >
          <Timer />
          <ClockInButton disabled={isDisabled} />
        </Stack>
      </Stack>
    </Tooltip>
  );
};

export default ClockWidget;

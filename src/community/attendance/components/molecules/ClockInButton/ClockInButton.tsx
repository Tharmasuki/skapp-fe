import { JSX, useMemo } from "react";

import { useUpdateEmployeeStatus } from "~community/attendance/api/AttendanceApi";
import { useAttendanceStore } from "~community/attendance/store/attendanceStore";
import { AttendanceSlotType } from "~community/attendance/types/attendanceTypes";
import Button from "~community/common/components/atoms/Button/Button";
import {
  ButtonSizes,
  ButtonStyle
} from "~community/common/enums/ComponentEnums";
import {
  MediaQueries,
  useMediaQuery
} from "~community/common/hooks/useMediaQuery";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";

interface Props {
  disabled?: boolean;
}

const ClockInButton = ({ disabled }: Props): JSX.Element => {
  const {
    attendanceParams,
    attendanceLeaveStatus,
    setSlotType,
    setIsAttendanceModalOpen
  } = useAttendanceStore((state) => state);

  const status = attendanceParams.slotType;

  const translateText = useTranslator("attendanceModule", "timeWidget");

  const isBelow600 = useMediaQuery()(MediaQueries.BELOW_600);

  const { isPending, mutate } = useUpdateEmployeeStatus();

  const isClockedIn = useMemo(() => {
    return (
      status === AttendanceSlotType.READY ||
      status === AttendanceSlotType.END ||
      status === AttendanceSlotType.LEAVE_DAY ||
      status === AttendanceSlotType.HOLIDAY ||
      status === AttendanceSlotType.NON_WORKING_DAY
    );
  }, [status]);

  const onClick = () => {
    if (status === AttendanceSlotType.READY && !attendanceLeaveStatus.onLeave) {
      mutate(setSlotType(AttendanceSlotType.START));
    } else {
      setIsAttendanceModalOpen(true);
    }
  };

  return (
    <Button
      buttonStyle={ButtonStyle.PRIMARY}
      size={isBelow600 ? ButtonSizes.SMALL : ButtonSizes.MEDIUM}
      label={
        isBelow600
          ? ""
          : isClockedIn
            ? translateText(["clockIn"])
            : translateText(["clockOut"])
      }
      endIcon={IconName.TIMER_ICON}
      isFullWidth={false}
      onClick={onClick}
      isLoading={isPending}
      disabled={disabled}
      dataTestId={isClockedIn ? "clock-in-button" : "clock-out-button"}
    />
  );
};

export default ClockInButton;

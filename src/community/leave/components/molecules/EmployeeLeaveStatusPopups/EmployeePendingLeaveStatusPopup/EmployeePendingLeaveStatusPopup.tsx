import { Box } from "@mui/material";
import { Dispatch, FC, SetStateAction, useEffect } from "react";

import { DAY_MONTH_YEAR_FORMAT } from "~community/attendance/constants/constants";
import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import { ButtonStyle, ToastType } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { IconName } from "~community/common/types/IconTypes";
import { convertDateToFormat } from "~community/common/utils/dateTimeUtils";
import {
  useCheckLeaveAlreadyNudged,
  useNudgeManager
} from "~community/leave/api/MyRequestApi";
import StatusPopupColumn from "~community/leave/components/molecules/StatusPopupColumn/StatusPopupColumn";
import StatusPopupRow from "~community/leave/components/molecules/StatusPopupRow/StatusPopupRow";
import { useLeaveStore } from "~community/leave/store/store";
import { EmployeeLeaveStatusPopupTypes } from "~community/leave/types/EmployeeLeaveRequestTypes";
import { LeaveStatusTypes } from "~community/leave/types/LeaveTypes";
import {
  getStartEndDate,
  handleDurationDay,
  handleLeaveStatus,
  leaveStatusIconSelector
} from "~community/leave/utils/leaveRequest/LeaveRequestUtils";

interface Props {
  setPopupType: Dispatch<SetStateAction<string>>;
}

const EmployeePendingLeaveStatusPopup: FC<Props> = ({ setPopupType }) => {
  const { employeeLeaveRequestData } = useLeaveStore((state) => state);
  const { setToastMessage } = useToast();
  const { mutate: nudgeManager, isSuccess, isError } = useNudgeManager();
  const translateText = useTranslator("leaveModule", "myRequests");

  useEffect(() => {
    if (isSuccess) {
      setPopupType(LeaveStatusTypes.SUPERVISOR_NUDGED);
      setToastMessage({
        open: true,
        title: translateText(["myLeaveRequests", "nudgeSuccessTitle"]),
        description: translateText([
          "myLeaveRequests",
          "nudgeSuccessDescription"
        ]),
        toastType: ToastType.SUCCESS
      });
    }
    if (isError) {
      setToastMessage({
        open: true,
        title: translateText(["myLeaveRequests", "nudgeErrorTitle"]),
        description: translateText([
          "myLeaveRequests",
          "nudgeErrorDescription"
        ]),
        toastType: ToastType.ERROR
      });
    }
  }, [isSuccess, isError]);

  const { data: nudgeLog } = useCheckLeaveAlreadyNudged(
    employeeLeaveRequestData.leaveRequestId
  );

  const handleNudgeButton = (id: number): void => {
    const data = {
      id
    };
    nudgeManager(data);
  };

  const handleCancelButton = (): void => {
    setPopupType(EmployeeLeaveStatusPopupTypes.CANCEL_REQUEST_POPUP);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        marginBottom: "0.375rem",
        marginTop: "1rem",
        gap: "1.25rem"
      }}
    >
      <>
        <StatusPopupRow
          label={translateText(["myLeaveRequests", "type"])}
          iconName={employeeLeaveRequestData?.leaveType.name}
          icon={employeeLeaveRequestData?.leaveType.emojiCode}
        />
        <StatusPopupRow
          label={translateText(["myLeaveRequests", "status"])}
          iconName={handleLeaveStatus(employeeLeaveRequestData.status)}
          icon={leaveStatusIconSelector(employeeLeaveRequestData.status)}
        />
        <StatusPopupRow
          label={translateText(["myLeaveRequests", "duration"])}
          durationByDays={handleDurationDay(
            employeeLeaveRequestData.durationDays,
            employeeLeaveRequestData.leaveState,
            translateText
          )}
          durationDate={getStartEndDate(
            employeeLeaveRequestData.startDate,
            employeeLeaveRequestData.endDate
          )}
        />
        <StatusPopupRow
          label={translateText(["myLeaveRequests", "dateApplied"])}
          durationDate={convertDateToFormat(
            new Date(employeeLeaveRequestData.createdDate ?? ""),
            DAY_MONTH_YEAR_FORMAT
          )}
        />
        <StatusPopupRow
          label={translateText(["myLeaveRequests", "recipient"])}
          isRecipient={true}
          styles={{ alignItems: "flex-start" }}
          textStyles={{ mt: "0.75rem" }}
          reviewer={employeeLeaveRequestData.reviewer ?? undefined}
        />
      </>

      <StatusPopupColumn
        label={translateText(["myLeaveRequests", "reason"])}
        text={employeeLeaveRequestData.requestDesc}
        isDisabled={true}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }}
      >
        <Button
          label={translateText(["myLeaveRequests", "nudgeSupervisorBtn"])}
          endIcon={IconName.NUDGE_BELL_ICON}
          buttonStyle={ButtonStyle.SECONDARY}
          onClick={() =>
            handleNudgeButton(employeeLeaveRequestData.leaveRequestId)
          }
          disabled={nudgeLog?.isNudge == false}
        />

        <Button
          label={translateText(["myLeaveRequests", "cancelLeaveRequestBtn"])}
          endIcon={<Icon name={IconName.REQUEST_CANCEL_CROSS_ICON} />}
          buttonStyle={ButtonStyle.ERROR}
          onClick={handleCancelButton}
        />
      </Box>
    </Box>
  );
};

export default EmployeePendingLeaveStatusPopup;

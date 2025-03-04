import { Box, Stack } from "@mui/material";
import { Theme, useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import React from "react";

import Button from "~community/common/components/atoms/Button/Button";
import BasicChip from "~community/common/components/atoms/Chips/BasicChip/BasicChip";
import IconChip from "~community/common/components/atoms/Chips/IconChip.tsx/IconChip";
import Icon from "~community/common/components/atoms/Icon/Icon";
import AvatarChip from "~community/common/components/molecules/AvatarChip/AvatarChip";
import Table from "~community/common/components/molecules/Table/Table";
import {
  ButtonSizes,
  ButtonStyle,
  ButtonTypes
} from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { IconName } from "~community/common/types/IconTypes";
import { getEmoji } from "~community/common/utils/commonUtil";
import {
  useGetPendingLeaveRequests,
  useUpdateLeaveRequest
} from "~community/leave/api/LeaveApi";
import {
  LEAVE_REQUESTS_URL,
  LeaveRequest,
  PendingLeaveEnum
} from "~community/leave/types/PendingLeaves";

import {
  stackStyles,
  tableContainerStyles,
  tableHeaderCellStyles,
  tableHeaderRowStyles,
  tableWrapperStyles
} from "./styles";

interface Props {
  searchTerm?: string;
}
interface TableHeader {
  id: string;
  label: string;
}

const PendingLeaveRequestTable: React.FC<Props> = ({ searchTerm }) => {
  const translateText = useTranslator("leaveModule", "pendingRequests");
  const theme: Theme = useTheme();
  const router = useRouter();

  const navigateToLeaveRequests = () => {
    router.push(LEAVE_REQUESTS_URL);
  };

  const { toastMessage, setToastMessage } = useToast();

  const tableHeaders: TableHeader[] = [
    { id: "employee", label: translateText(["employeeHeader"]) },
    { id: "leaveDuration", label: translateText(["leaveDurationHeader"]) },
    { id: "leaveType", label: translateText(["leaveTypeHeader"]) },
    { id: "actions", label: "" }
  ];

  const { data, refetch } = useGetPendingLeaveRequests(searchTerm || "");

  const updateLeaveRequest = useUpdateLeaveRequest;

  const handleLeaveRequestApproval = async (leaveRequestId: number) => {
    try {
      await updateLeaveRequest({
        leaveRequestId,
        status: PendingLeaveEnum.APPROVED
      });
      setToastMessage({
        open: true,
        toastType: "success",
        title: translateText(["RequestApproveTitle"]),
        description: translateText(["RequestApproveDescription"]),
        isIcon: true
      });
      await refetch();
    } catch (error) {
      setToastMessage({
        open: true,
        toastType: "error",
        title: translateText(["RequestApproveFailTitle"]),
        description: translateText(["RequestApproveFailDescription"]),
        isIcon: true
      });
    }
  };

  const handleLeaveRequestDecline = async (leaveRequestId: number) => {
    try {
      await updateLeaveRequest({
        leaveRequestId,
        status: PendingLeaveEnum.DENIED
      });
      setToastMessage({
        open: true,
        toastType: "success",
        title: translateText(["RequestDeclineTitle"]),
        description: translateText(["RequestDeclineDescription"]),
        isIcon: true
      });
      await refetch();
    } catch (error) {
      setToastMessage({
        open: true,
        toastType: "error",
        title: translateText(["RequestDeclineFailTitle"]),
        description: translateText(["RequestDeclineFailDescription"]),
        isIcon: true
      });
    }
  };

  const leaveRequests = data || [];

  const tableRows = leaveRequests.map((request: LeaveRequest) => ({
    id: request.leaveRequestId,
    employee: (
      <Box width="100%">
        <AvatarChip
          firstName={request.employee.firstName}
          lastName={request.employee.lastName}
          avatarUrl={request.employee.authPic || ""}
          chipStyles={{ maxWidth: "fit-content" }}
        />
      </Box>
    ),
    leaveDuration: (
      <Box sx={{ color: "black" }}>
        {request.startDate} to {request.endDate}
        <BasicChip
          label={`${request.durationDays} ${
            request.durationDays === 1
              ? translateText(["day"])
              : translateText(["days"])
          }`}
          chipStyles={{ ml: 2 }}
        />
      </Box>
    ),
    leaveType: (
      <IconChip
        icon={getEmoji(request.leaveType.emojiCode)}
        label={`${getEmoji(request.leaveType.emojiCode)} ${request.leaveType.name}`}
      />
    ),
    actions: (
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ overflowX: "auto", alignItems: "center" }}
      >
        <Button
          label={translateText(["declineBtn"])}
          buttonStyle={ButtonStyle.TERTIARY}
          endIcon={<Icon name={IconName.CLOSE_ICON} />}
          onClick={() => handleLeaveRequestDecline(request.leaveRequestId)}
          type={ButtonTypes.RESET}
          size={ButtonSizes.MEDIUM}
        />
        <Button
          label={translateText(["approveBtn"])}
          buttonStyle={ButtonStyle.SECONDARY}
          endIcon={<Icon name={IconName.CHECK_ICON} />}
          onClick={() => handleLeaveRequestApproval(request.leaveRequestId)}
          type={ButtonTypes.SUBMIT}
          size={ButtonSizes.MEDIUM}
        />
      </Stack>
    )
  }));

  return (
    <Box>
      <Table
        tableHeaders={tableHeaders}
        tableRows={tableRows}
        tableHeaderRowStyles={tableHeaderRowStyles(theme)}
        tableHeaderCellStyles={tableHeaderCellStyles(theme)}
        tableContainerStyles={tableContainerStyles(theme)}
        isPaginationEnabled={false}
        tableWrapperStyles={tableWrapperStyles}
      />
      <Stack direction="row" justifyContent="flex-end" sx={stackStyles(theme)}>
        <Button
          label={translateText(["viewRequestBtn"])}
          buttonStyle={ButtonStyle.TERTIARY}
          endIcon={<Icon name={IconName.RIGHT_ARROW_ICON} />}
          onClick={navigateToLeaveRequests}
          size={ButtonSizes.MEDIUM}
        />
      </Stack>
    </Box>
  );
};

export default PendingLeaveRequestTable;

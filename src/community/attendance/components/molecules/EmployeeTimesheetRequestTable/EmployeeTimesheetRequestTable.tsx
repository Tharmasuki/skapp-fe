import { Box, Typography } from "@mui/material";
import { type Theme, useTheme } from "@mui/material/styles";
import { ChangeEvent, FC, JSX } from "react";

import { useCancelTimeRequest } from "~community/attendance/api/AttendanceEmployeeApi";
import TimesheetRequestsFilters from "~community/attendance/components/molecules/TimesheetRequestsFilters/TimesheetRequestsFilters";
import {
  TimeSheetRequestStates,
  TimeSheetRequestTypes
} from "~community/attendance/enums/timesheetEnums";
import { useAttendanceStore } from "~community/attendance/store/attendanceStore";
import {
  TimeRequestDataResponseType,
  TimeRequestDataType
} from "~community/attendance/types/timeSheetTypes";
import { formatDuration } from "~community/attendance/utils/TimeUtils";
import IconChip from "~community/common/components/atoms/Chips/IconChip.tsx/IconChip";
import Icon from "~community/common/components/atoms/Icon/Icon";
import KebabMenu from "~community/common/components/molecules/KebabMenu/KebabMenu";
import Table from "~community/common/components/molecules/Table/Table";
import { ToastType } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { IconName } from "~community/common/types/IconTypes";
import { formatDateWithOrdinalIndicator } from "~community/common/utils/dateTimeUtils";

import styles from "./styles";

interface Props {
  requestData?: TimeRequestDataResponseType;
  isRequestLoading?: boolean;
  totalHours?: number;
}

const EmployeeTimesheetRequestTable: FC<Props> = ({
  requestData,
  isRequestLoading,
  totalHours = 8
}) => {
  const theme: Theme = useTheme();
  const { setToastMessage } = useToast();
  const translateText = useTranslator("attendanceModule", "timesheet");
  const classes = styles(theme);

  const {
    employeeTimesheetRequestParams,
    setEmployeeTimesheetRequestPagination
  } = useAttendanceStore((state) => state);

  const onSuccess = () => {
    setToastMessage({
      open: true,
      title: translateText(["cancelSuccessTitle"]),
      description: translateText(["cancelSuccessDes"]),
      toastType: ToastType.SUCCESS
    });
  };

  const onError = () => {
    setToastMessage({
      open: true,
      title: translateText(["cancelFailTitle"]),
      description: translateText(["cancelFailDes"]),
      toastType: ToastType.ERROR
    });
  };

  const getKebabMenuOptions = (timeRequestId: number) => [
    {
      id: timeRequestId,
      text: translateText(["cancelBtnTxt"]),
      icon: <Icon name={IconName.CLOSE_ICON} />,
      onClickHandler: () => {
        cancelMutate({
          id: timeRequestId,
          status: TimeSheetRequestStates?.PENDING
        });
      },
      isDisabled: false
    }
  ];

  const { mutate: cancelMutate } = useCancelTimeRequest(onSuccess, onError);

  const requestTypeSelector = (status: string): JSX.Element => {
    switch (status) {
      case TimeSheetRequestStates.PENDING:
        return <Icon name={IconName.PENDING_STATUS_ICON} />;
      case TimeSheetRequestStates.APPROVED:
        return <Icon name={IconName.APPROVED_STATUS_ICON} />;
      case TimeSheetRequestStates.DENIED:
        return <Icon name={IconName.DENIED_STATUS_ICON} />;
      case TimeSheetRequestStates.CANCELLED:
        return <Icon name={IconName.CANCELLED_STATUS_ICON} />;
      default:
        return <></>;
    }
  };

  const columns = [
    { field: "date", headerName: translateText(["dateHeaderTxt"]) },
    { field: "from", headerName: translateText(["fromHeaderTxt"]) },
    { field: "to", headerName: translateText(["toHeaderTxt"]) },
    {
      field: "workedHours",
      headerName: translateText(["workedHourHeaderTxt"])
    },
    { field: "status", headerName: translateText(["statusHeaderTxt"]) }
  ];

  const tableHeaders = columns.map((col) => ({
    id: col.field,
    label: col.headerName
  }));
  const transformToTableRows = () => {
    return requestData?.items.map((timesheetRequest: TimeRequestDataType) => ({
      id: timesheetRequest.timeRequestId,
      date: (
        <Box sx={classes.boxDateContainer}>
          <Typography variant="body2" sx={classes.textDateStyles}>
            {formatDateWithOrdinalIndicator(
              new Date(timesheetRequest?.date ?? "")
            ).slice(0, 8)}
          </Typography>
        </Box>
      ),
      from: (
        <Box sx={classes.outerBoxWrapper}>
          <Box sx={classes.innerBoxWrapper}>
            {timesheetRequest?.initialClockIn &&
              timesheetRequest.requestType ===
                TimeSheetRequestTypes.EDIT_RECORD_REQUEST && (
                <Typography
                  variant="body2"
                  sx={classes.startTimeTextStyles(timesheetRequest)}
                >
                  {timesheetRequest?.initialClockIn}
                </Typography>
              )}
            {timesheetRequest?.requestedStartTime &&
              timesheetRequest?.requestedStartTime !==
                timesheetRequest?.initialClockIn && (
                <Typography variant="body2" sx={classes.errorTextStyles}>
                  {timesheetRequest?.requestedStartTime}
                </Typography>
              )}
          </Box>
        </Box>
      ),
      to: (
        <Box sx={classes.outerBoxWrapper}>
          <Box sx={classes.innerBoxWrapper}>
            {timesheetRequest?.initialClockOut &&
              timesheetRequest.requestType ===
                TimeSheetRequestTypes.EDIT_RECORD_REQUEST && (
                <Typography
                  variant="body2"
                  sx={classes.endTimeTextStyles(timesheetRequest)}
                >
                  {timesheetRequest?.initialClockOut}
                </Typography>
              )}
            {timesheetRequest?.requestedEndTime &&
              timesheetRequest?.requestedEndTime !==
                timesheetRequest?.initialClockOut && (
                <Typography variant="body2" sx={classes.errorTextStyles}>
                  {timesheetRequest?.requestedEndTime}
                </Typography>
              )}
          </Box>
        </Box>
      ),
      workedHours: (
        <Box sx={classes.workHoursBoxStyle}>
          <Typography
            variant="body2"
            sx={classes.workHoursTextStyle(timesheetRequest, totalHours)}
          >
            {formatDuration(timesheetRequest?.workHours)}
          </Typography>
        </Box>
      ),
      status: (
        <Box sx={classes.statusOuterBoxStyles}>
          <IconChip
            label={timesheetRequest?.status?.toLowerCase()}
            icon={requestTypeSelector(timesheetRequest?.status)}
            chipStyles={classes.iconChipStyles}
            isResponsive={true}
            isTruncated={false}
            mediumScreenWidth={1024}
          />
          <Box sx={classes.kebabMenuBoxStyle}>
            {timesheetRequest?.status === TimeSheetRequestStates.PENDING && (
              <KebabMenu
                id={timesheetRequest?.employee?.employeeId ?? 0}
                menuItems={getKebabMenuOptions(timesheetRequest.timeRequestId)}
              />
            )}
          </Box>
        </Box>
      )
    }));
  };

  return (
    <>
      <Typography variant="h2" mb={"1.5rem"}>
        {translateText(["requestTableEmployeeTitle"])}
      </Typography>
      <TimesheetRequestsFilters />
      <Table
        tableHeaders={tableHeaders}
        tableContainerStyles={classes.tableContainerStyles}
        tableHeaderCellStyles={classes.tableHeaderStyles}
        tableRows={transformToTableRows() || []}
        isPaginationEnabled={true}
        isLoading={isRequestLoading}
        skeletonRows={3}
        emptyDataTitle={translateText(["emptyRequestTitle"])}
        emptyDataDescription={translateText(["emptyRequestDesEmployee"])}
        totalPages={requestData?.totalPages}
        currentPage={employeeTimesheetRequestParams?.page}
        onPaginationChange={(_event: ChangeEvent<unknown>, value: number) => {
          setEmployeeTimesheetRequestPagination(value - 1);
        }}
      />
    </>
  );
};

export default EmployeeTimesheetRequestTable;

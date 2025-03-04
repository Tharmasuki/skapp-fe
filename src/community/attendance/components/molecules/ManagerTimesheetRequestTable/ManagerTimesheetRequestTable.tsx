import { Box, Typography } from "@mui/material";
import { type Theme, useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { ChangeEvent, FC, JSX } from "react";

import { useCancelTimeRequest } from "~community/attendance/api/AttendanceEmployeeApi";
import { DEFAULT_TOTAL_HOURS } from "~community/attendance/constants/constants";
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
import CheckIcon from "~community/common/assets/Icons/CheckIcon";
import CloseIcon from "~community/common/assets/Icons/CloseIcon";
import RightArrowIcon from "~community/common/assets/Icons/RightArrowIcon";
import Button from "~community/common/components/atoms/Button/Button";
import IconChip from "~community/common/components/atoms/Chips/IconChip.tsx/IconChip";
import Icon from "~community/common/components/atoms/Icon/Icon";
import AvatarChip from "~community/common/components/molecules/AvatarChip/AvatarChip";
import KebabMenu from "~community/common/components/molecules/KebabMenu/KebabMenu";
import Table from "~community/common/components/molecules/Table/Table";
import ROUTES from "~community/common/constants/routes";
import { ButtonStyle, ToastType } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { IconName } from "~community/common/types/IconTypes";
import { formatDateWithOrdinalIndicator } from "~community/common/utils/dateTimeUtils";
import { concatStrings } from "~community/people/utils/jobFamilyUtils/commonUtils";

import TimesheetRequestsFilters from "../TimesheetRequestsFilters/TimesheetRequestsFilters";
import styles from "./styles";

interface Props {
  requestData?: TimeRequestDataResponseType;
  isRequestLoading?: boolean;
  totalHours?: number;
  hasFullList?: boolean;
  approveTimesheetRequest: (timeRequestId: number, name: string) => void;
  declineTimesheetRequest: (timeRequestId: number, name: string) => void;
  isApproveDenyLoading: boolean;
}

const ManagerTimesheetRequestTable: FC<Props> = ({
  requestData,
  isRequestLoading,
  totalHours = DEFAULT_TOTAL_HOURS,
  hasFullList = false,
  approveTimesheetRequest,
  declineTimesheetRequest,
  isApproveDenyLoading
}) => {
  const theme: Theme = useTheme();
  const { setToastMessage } = useToast();
  const translateText = useTranslator("attendanceModule", "timesheet");
  const classes = styles(theme);
  const router = useRouter();

  const {
    employeeTimesheetRequestParams,
    setTimesheetRequestPagination,
    resetTimesheetRequestParams
  } = useAttendanceStore((state) => state);

  const onSuccess = () => {
    setToastMessage({
      open: true,
      title: translateText(["cancelSuccessTitle"]),
      description: translateText(["cancelSuccessDes"]),
      toastType: ToastType.SUCCESS
    });
  };

  const tableData = hasFullList
    ? requestData?.items
    : requestData?.items.filter(
        (item) => item.status === TimeSheetRequestStates.PENDING
      );

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
    { field: "name", headerName: translateText(["nameHeaderTxt"]) },
    { field: "date", headerName: translateText(["dateHeaderTxt"]) },
    { field: "from", headerName: translateText(["fromHeaderTxt"]) },
    { field: "to", headerName: translateText(["toHeaderTxt"]) },
    {
      field: "workedHours",
      headerName: translateText(["workedHourHeaderTxt"])
    },
    { field: "status", headerName: "" }
  ];

  const tableHeaders = columns.map((col) => ({
    id: col.field,
    label: col.headerName
  }));
  const transformToTableRows = () => {
    return tableData?.map((timesheetRequest: TimeRequestDataType) => ({
      id: timesheetRequest.timeRequestId,
      name: (
        <AvatarChip
          firstName={timesheetRequest?.employee?.firstName ?? ""}
          lastName={timesheetRequest?.employee?.lastName ?? ""}
          avatarUrl={timesheetRequest?.employee?.authPic as string}
          isResponsiveLayout={true}
          chipStyles={{
            maxWidth: "15.625rem"
          }}
        />
      ),
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
      status:
        timesheetRequest?.status === TimeSheetRequestStates.PENDING ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              maxWidth: "auto",
              gap: "0.5rem"
            }}
          >
            <Box
              sx={{
                height: "3rem",
                width: "3rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.palette.grey[100],
                borderRadius: "1.5rem",
                ":hover": theme.palette.grey[200],
                pointerEvents: isApproveDenyLoading ? "none" : "auto"
              }}
              onClick={() => {
                declineTimesheetRequest(
                  timesheetRequest?.timeRequestId,
                  concatStrings([
                    timesheetRequest?.employee?.firstName as string,
                    timesheetRequest?.employee?.lastName as string
                  ])
                );
              }}
            >
              <CloseIcon fill={"black"} />
            </Box>
            <Box
              sx={{
                height: "3rem",
                width: "3rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.palette.secondary.main,
                borderRadius: "1.5rem",
                border: "0.0625rem solid",
                borderColor: theme.palette.secondary.dark,
                cursor: "pointer",
                ":hover": {
                  transition: "box-shadow 0.3s ease",
                  border: "0.125rem solid",
                  borderColor: theme.palette.primary.dark
                },
                pointerEvents: isApproveDenyLoading ? "none" : "auto"
              }}
              onClick={() => {
                approveTimesheetRequest(
                  timesheetRequest?.timeRequestId,
                  concatStrings([
                    timesheetRequest?.employee?.firstName as string,
                    timesheetRequest?.employee?.lastName as string
                  ])
                );
              }}
            >
              <CheckIcon fill={theme.palette.primary.dark} />
            </Box>
          </Box>
        ) : (
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
                  menuItems={getKebabMenuOptions(
                    timesheetRequest.timeRequestId
                  )}
                />
              )}
            </Box>
          </Box>
        )
    }));
  };

  return (
    <>
      {!hasFullList && (
        <Typography variant="h2" my={"1.5rem"}>
          {translateText(["requestTableManagerTitle"])}
        </Typography>
      )}
      {hasFullList && <TimesheetRequestsFilters isManager={true} />}
      <Table
        tableHeaders={tableHeaders}
        tableContainerStyles={classes.tableContainerStyles}
        tableHeaderCellStyles={classes.tableHeaderStyles}
        tableRows={transformToTableRows() || []}
        isPaginationEnabled={hasFullList}
        isLoading={isRequestLoading}
        skeletonRows={3}
        emptyDataTitle={translateText(["emptyRequestTitle"])}
        emptyDataDescription={translateText(["emptyRequestDesEmployee"])}
        totalPages={requestData?.totalPages}
        currentPage={employeeTimesheetRequestParams?.page}
        onPaginationChange={(_event: ChangeEvent<unknown>, value: number) => {
          setTimesheetRequestPagination(value);
        }}
      />
      {!hasFullList && (
        <Button
          buttonStyle={ButtonStyle.TERTIARY}
          label={translateText(["viewFullBtnTxt"])}
          endIcon={<RightArrowIcon />}
          isFullWidth={false}
          styles={{
            fontSize: "0.75rem",
            fontWeight: 400,
            mt: "1rem"
          }}
          onClick={async () => {
            resetTimesheetRequestParams();
            await router.push(ROUTES.TIMESHEET.TIMESHEET_REQUESTS);
          }}
        />
      )}
    </>
  );
};

export default ManagerTimesheetRequestTable;

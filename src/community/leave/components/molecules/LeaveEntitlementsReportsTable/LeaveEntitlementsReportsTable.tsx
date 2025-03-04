import {
  Box,
  Divider,
  Stack,
  Theme,
  Typography,
  useTheme
} from "@mui/material";
import {
  ChangeEvent,
  FC,
  MouseEvent,
  useEffect,
  useMemo,
  useState
} from "react";

import TableHeaderFill from "~community/attendance/components/molecules/TimesheetTableHeader/TableHeaderFill";
import TImesheetTableRowFill from "~community/attendance/components/molecules/TimesheetTableRow/TImesheetTableRowFill";
import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import Pagination from "~community/common/components/atoms/Pagination/Pagination";
import Dropdown from "~community/common/components/molecules/Dropdown/Dropdown";
import FilterButton from "~community/common/components/molecules/FilterButton/FilterButton";
import TableEmptyScreen from "~community/common/components/molecules/TableEmptyScreen/TableEmptyScreen";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useCommonStore } from "~community/common/stores/commonStore";
import { IconName } from "~community/common/types/IconTypes";
import { getRecentYearsInStrings } from "~community/common/utils/dateTimeUtils";
import {
  useGetEmployeeLeaveReport,
  useGetEmployeeLeaveReportCSV
} from "~community/leave/api/LeaveReportApi";
import { useGetLeaveTypes } from "~community/leave/api/LeaveTypesApi";
import { SheetType } from "~community/leave/enums/LeaveReportEnums";
import { useLeaveStore } from "~community/leave/store/store";
import { ReportTableRowDataType } from "~community/leave/types/LeaveReportTypes";
import { downloadDataAsCSV } from "~community/leave/utils/leaveReport/exportReportUtils";

import LeaveReportsTableHeader from "../LeaveReportTableHeader/LeaveReportTableHeader";
import LeaveReportsTableRow from "../LeaveReportTableRow/LeaveReportTableRow";
import { styles } from "./styles";

const LeaveEntitlementsReportsTable: FC = () => {
  const theme: Theme = useTheme();
  const classes = styles(theme);

  const { data: leaveTypes } = useGetLeaveTypes();
  const { isDrawerToggled } = useCommonStore((state) => ({
    isDrawerToggled: state.isDrawerExpanded
  }));

  const translateText = useTranslator("leaveModule", "leaveReports");

  const {
    reportsParams,
    reportsFilter,
    reportsFilterOrder,
    setReportsParams,
    setReportsFilter,
    setReportsFilterOrder,
    setReportsFilterOrderIds,
    setReportsPagination,
    resetReportsParams,
    resetReportsFilter,
    resetReportsFilterOrder,
    resetReportsFilterOrderIds
  } = useLeaveStore();

  const [headerLabels, setHeaderLabels] = useState<string[]>([]);
  const [selectedLeaveTypes, setSelectedLeaveTypes] = useState<string[]>(
    reportsFilter.leaveType || []
  );

  const years = getRecentYearsInStrings();

  const leaveTypeButtons = useMemo(() => {
    return Array.isArray(leaveTypes)
      ? leaveTypes
          .filter((leaveType) => leaveType?.isActive)
          .map((leaveType) => ({
            id: leaveType?.typeId?.toString(),
            text: leaveType?.name
          }))
      : [];
  }, [leaveTypes]);

  const handleYearClick = (event: MouseEvent<HTMLElement>): void => {
    setReportsParams("year", event.currentTarget.innerText);
  };

  const handleLeaveTypeFilter = (leaveType: { id: string; text: string }) => {
    const updatedTypes = selectedLeaveTypes.includes(leaveType.text)
      ? selectedLeaveTypes.filter((type) => type !== leaveType.text)
      : [...selectedLeaveTypes, leaveType.text];

    setSelectedLeaveTypes(updatedTypes);

    const updatedTypeIds = leaveTypeButtons
      .filter((button) => updatedTypes.includes(button.text))
      .map((button) => button.id);

    setReportsFilter("leaveType", updatedTypeIds);
    setReportsFilterOrderIds(updatedTypeIds);
  };

  const handleRemoveFilters = (leaveType: { id: string; text: string }) => {
    const updatedTypes = selectedLeaveTypes.includes(leaveType.text)
      ? selectedLeaveTypes.filter((type) => type !== leaveType.text)
      : [...selectedLeaveTypes, leaveType.text];

    setSelectedLeaveTypes(updatedTypes);

    const updatedTypeIds = leaveTypeButtons
      .filter((button) => updatedTypes.includes(button.text))
      .map((button) => button.id);

    setReportsFilter("leaveType", updatedTypeIds);
    setReportsFilterOrder(updatedTypes);
    setReportsFilterOrderIds(updatedTypeIds);

    if (updatedTypes.length !== 0) {
      setReportsParams("leaveTypeId", updatedTypeIds);
    } else {
      setReportsParams("leaveTypeId", "-1");
    }
  };

  const handleApplyFilters = () => {
    if (selectedLeaveTypes.length === 1) {
      const selectedTypeId = leaveTypeButtons.find(
        (button) => button.text === selectedLeaveTypes[0]
      )?.id;
      setReportsParams("leaveTypeId", selectedTypeId || selectedLeaveTypes[0]);
      setReportsFilterOrder(selectedLeaveTypes);
    } else {
      const selectedTypeIds = selectedLeaveTypes
        .map(
          (type) => leaveTypeButtons.find((button) => button.text === type)?.id
        )
        .filter(Boolean);
      setReportsParams("leaveTypeId", selectedTypeIds);
      setReportsFilterOrder(selectedLeaveTypes);
    }
    setReportsParams("page", 0);
  };

  const handleResetFilters = (): void => {
    setSelectedLeaveTypes([]);
    resetReportsParams();
    resetReportsFilter();
    resetReportsFilterOrder();
    resetReportsFilterOrderIds();
  };

  const reportData = useGetEmployeeLeaveReport(
    reportsParams.year,
    reportsParams.leaveTypeId,
    reportsParams.teamId,
    reportsParams.page,
    reportsParams.size,
    reportsParams.sortKey,
    reportsParams.sortOrder
  );

  useEffect(() => {
    if (reportsFilterOrder?.length === 0) {
      const sortedLeaveTypes = leaveTypeButtons
        ?.slice()
        .sort((a: any, b: any) => a.id - b.id);
      setHeaderLabels(
        sortedLeaveTypes?.map((leaveType: any) => leaveType.text)
      );
      setReportsFilterOrderIds(
        sortedLeaveTypes?.map((leaveType: any) => leaveType.id)
      );
    } else {
      setHeaderLabels(reportsFilterOrder);
      setReportsFilterOrderIds(reportsFilter.leaveType);
    }
  }, [
    reportsFilter,
    leaveTypes,
    reportsFilterOrder,
    leaveTypeButtons,
    setReportsFilterOrderIds
  ]);

  useEffect(() => {
    return () => {
      resetReportsParams();
      resetReportsFilter();
      resetReportsFilterOrder();
      resetReportsFilterOrderIds();
    };
  }, [
    resetReportsFilter,
    resetReportsFilterOrder,
    resetReportsFilterOrderIds,
    resetReportsParams
  ]);

  const CSVdata = useGetEmployeeLeaveReportCSV(
    reportsParams.year,
    reportsParams.leaveTypeId,
    reportsParams.teamId,
    headerLabels,
    []
  );

  const downloadCSV = (reportType: SheetType) => {
    if (CSVdata) {
      downloadDataAsCSV(CSVdata, headerLabels, reportType);
    }
  };

  return (
    <>
      <Stack sx={classes.headerStack}>
        <Box>
          <Dropdown
            onItemClick={handleYearClick}
            selectedItem={reportsParams.year}
            title={reportsParams.year}
            items={years}
          />
        </Box>
        <Box>
          <FilterButton
            handleApplyBtnClick={handleApplyFilters}
            handleResetBtnClick={handleResetFilters}
            selectedFilters={selectedLeaveTypes.map((type) => ({
              filter: [type],
              handleFilterDelete: () => {
                handleRemoveFilters({
                  id:
                    leaveTypeButtons.find((btn) => btn.text === type)?.id || "",
                  text: type
                });
              }
            }))}
            position={"bottom-end"}
            id={"filter-types"}
            isResetBtnDisabled={selectedLeaveTypes.length === 0}
          >
            <Typography variant="h5">
              {translateText(["filterPopperLeaveTypeTitle"])}
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {leaveTypeButtons.map((leaveType) => (
                <Button
                  key={leaveType.id}
                  isFullWidth={false}
                  label={leaveType.text}
                  buttonStyle={
                    selectedLeaveTypes.includes(leaveType.text)
                      ? ButtonStyle.SECONDARY
                      : ButtonStyle.TERTIARY
                  }
                  onClick={() => handleLeaveTypeFilter(leaveType)}
                  startIcon={
                    selectedLeaveTypes.includes(leaveType.text) ? (
                      <Icon name={IconName.CHECK_CIRCLE_ICON} />
                    ) : undefined
                  }
                  styles={classes.filterButton}
                />
              ))}
            </Box>
          </FilterButton>
        </Box>
      </Stack>
      <Stack sx={classes.stackContainer}>
        {reportData?.items?.length === 0 ? (
          <Box sx={classes.emptyScreenContainer}>
            <TableEmptyScreen
              title={translateText(["emptyScreenTitle"])}
              description={translateText(["emptyScreenDescription"])}
            />
          </Box>
        ) : (
          <>
            {!isDrawerToggled ? (
              <LeaveReportsTableHeader headerLabels={headerLabels} />
            ) : (
              <Box sx={classes.boxContainer}>
                <LeaveReportsTableHeader headerLabels={headerLabels} />
              </Box>
            )}
            <TableHeaderFill />
            {reportData?.items?.map(
              (employee: ReportTableRowDataType, index: number) => (
                <>
                  {!isDrawerToggled ? (
                    <>
                      <TImesheetTableRowFill
                        noOfRows={reportData.items.length}
                      />
                      <LeaveReportsTableRow
                        key={index}
                        employee={{
                          employeeId: employee?.employeeId,
                          firstName: employee?.firstName,
                          lastName: employee?.lastName,
                          avatarUrl: employee?.authPic
                        }}
                        allocations={employee.leaveEntitlementReportDtos}
                      />
                    </>
                  ) : (
                    <Box sx={classes.boxContainer}>
                      <TImesheetTableRowFill
                        noOfRows={reportData.items.length}
                      />
                      <LeaveReportsTableRow
                        key={index}
                        employee={{
                          employeeId: employee?.employeeId,
                          firstName: employee?.firstName,
                          lastName: employee?.lastName,
                          avatarUrl: employee?.authPic
                        }}
                        allocations={employee.leaveEntitlementReportDtos}
                      />
                    </Box>
                  )}
                </>
              )
            )}
          </>
        )}
      </Stack>
      <Stack sx={classes.paginationContainer}>
        <Divider sx={classes.divider} />
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Pagination
            totalPages={reportData?.totalPages ?? 0}
            currentPage={reportsParams.page}
            onChange={(_event: ChangeEvent<unknown>, value: number) =>
              setReportsPagination(value - 1)
            }
          />
          <Button
            buttonStyle={ButtonStyle.TERTIARY_OUTLINED}
            label={translateText(["exportBtnTxt"])}
            endIcon={<Icon name={IconName.DOWNLOAD_ICON} />}
            isFullWidth={false}
            styles={classes.buttonStyles}
            onClick={() => downloadCSV(SheetType.LeaveAllocation)}
          />
        </Stack>
      </Stack>
    </>
  );
};

export default LeaveEntitlementsReportsTable;

import { Box, Stack, Theme, Typography, useTheme } from "@mui/material";
import { ChangeEvent, FC, MouseEvent, useEffect, useState } from "react";

import FilterIcon from "~community/common/assets/Icons/FilterIcon";
import IconChip from "~community/common/components/atoms/Chips/IconChip.tsx/IconChip";
import IconButton from "~community/common/components/atoms/IconButton/IconButton";
import DateRangePicker from "~community/common/components/molecules/DateRangePicker/DateRangePicker";
import Table from "~community/common/components/molecules/Table/Table";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { FilterButtonTypes } from "~community/common/types/CommonTypes";
import { MenuTypes } from "~community/common/types/MoleculeTypes";
import {
  convertDateToFormat,
  formatDateWithOrdinalIndicator,
  getDateForPeriod
} from "~community/common/utils/dateTimeUtils";
import { useGetEmployeeLeaveHistory } from "~community/leave/api/LeaveAnalyticsApi";
import { useLeaveStore } from "~community/leave/store/store";
import {
  LeaveHistoryDataTypes,
  LeaveHistoryRawType
} from "~community/leave/types/AnalyticsTypes";
import { LeaveType } from "~community/leave/types/CustomLeaveAllocationTypes";
import {
  downloadDataAsCSV,
  formatDateRange
} from "~community/leave/utils/LeaveAnalyticsUtils";
import { getLeaveRequestStatus } from "~community/leave/utils/LeavePreprocessors";
import {
  removeFiltersByLabel,
  requestTypeSelector,
  requestedLeaveTypesPreProcessor
} from "~community/leave/utils/LeaveRequestFilterActions";
import ShowSelectedFilters from "~community/people/components/molecules/ShowSelectedFilters/ShowSelectedFilters";

import LeaveRequestMenu from "../LeaveRequestMenu/LeaveRequestMenu";

interface Props {
  employeeId: number;
  leaveTypesList: LeaveType[];
  employeeLastName?: string;
  employeeFirstName?: string;
}
const UserLeaveHistory: FC<Props> = ({
  employeeId,
  leaveTypesList,
  employeeLastName,
  employeeFirstName
}) => {
  const theme: Theme = useTheme();

  const translateText = useTranslator(
    "peopleModule",
    "individualLeaveAnalytics"
  );

  const {
    resetLeaveRequestParams,
    leaveRequestsFilter,
    leaveRequestFilterOrder,
    setLeaveRequestFilterOrder,
    setLeaveRequestsFilter,
    setLeaveRequestParams
  } = useLeaveStore((state) => state);

  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filterEl, setFilterEl] = useState<null | HTMLElement>(null);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [filterArray, setFilterArray] = useState<string[]>([]);
  const [leaveTypeButtons, setLeaveTypeButtons] = useState<FilterButtonTypes[]>(
    []
  );
  const [employeeLeaveHistoryData, setEmployeeLeaveHistoryData] =
    useState<LeaveHistoryDataTypes>({
      currentPage: 0,
      items: [],
      totalItems: 0,
      totalPages: 0
    });

  const filterBeOpen: boolean = filterOpen && Boolean(filterEl);
  const filterId = filterBeOpen ? "filter-popper" : undefined;

  const { data: leaveHistory, isLoading } = useGetEmployeeLeaveHistory(
    employeeId,
    selectedDates,
    leaveRequestsFilter.status,
    leaveRequestsFilter.type,
    currentPage,
    6,
    false
  );

  const { data: exportHistoryData } = useGetEmployeeLeaveHistory(
    employeeId,
    selectedDates,
    leaveRequestsFilter.status,
    leaveRequestsFilter.type,
    0,
    6,
    true
  );

  const columns = [
    {
      field: "leavePeriod",
      headerName: translateText(["tableHeaders", "leavePeriod"])
    },
    {
      field: "durationDays",
      headerName: translateText(["tableHeaders", "days"])
    },
    { field: "type", headerName: translateText(["tableHeaders", "type"]) },
    {
      field: "dateRequested",
      headerName: translateText(["tableHeaders", "dateRequested"])
    },
    {
      field: "status",
      headerName: translateText(["tableHeaders", "status"])
    },
    {
      field: "reason",
      headerName: translateText(["tableHeaders", "reason"])
    }
  ];

  const tableHeaders = columns.map((col) => ({
    id: col.field,
    label: col.headerName
  }));

  const transformToTableRows = () => {
    return employeeLeaveHistoryData?.items?.map(
      (leaveData: LeaveHistoryRawType) => ({
        id: leaveData.leaveRequestId,
        leavePeriod: (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              flex: 1.5,
              mr: 0,
              [theme.breakpoints.down("xl")]: {
                flex: 1.8
              },
              [theme.breakpoints.down("lg")]: {
                flex: 1.5
              },
              [theme.breakpoints.down("md")]: {
                flex: 2
              }
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                [theme.breakpoints.down("xl")]: {
                  width: "100%"
                }
              }}
            >
              {formatDateRange(
                new Date(leaveData.startDate),
                new Date(leaveData.endDate),
                false,
                leaveData.durationDays
              )}
            </Typography>
          </Box>
        ),
        durationDays: (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
              justifyContent: "flex-start",
              [theme.breakpoints.down("xl")]: {
                minWidth: "4rem",
                flex: 0.5
              },
              [theme.breakpoints.down("lg")]: {
                minWidth: "auto"
              }
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary
              }}
            >
              {leaveData.durationDays}
            </Typography>
          </Box>
        ),
        type: (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              flex: 1,
              marginRight: "1.25rem",
              width: "6.25rem",
              [theme.breakpoints.down("xl")]: {
                marginRight: ".2rem"
              }
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                [theme.breakpoints.down("lg")]: {
                  fontSize: 12
                }
              }}
            >
              <IconChip
                icon={leaveData.leaveType.emojiCode}
                label={leaveData.leaveType.name}
                isResponsive
                chipStyles={{
                  color: "common.black",
                  height: "2.25rem",
                  gap: "0rem",
                  px: "0.625rem",
                  [theme.breakpoints.down("lg")]: {
                    px: "1.25rem"
                  }
                }}
              />
            </Typography>
          </Box>
        ),
        dateRequested: (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
              justifyContent: "flex-start",
              marginRight: "1.25rem",
              [theme.breakpoints.down("xl")]: {
                flex: 1.3,
                marginRight: ".2rem",
                minWidth: "auto"
              }
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                textAlign: "center"
              }}
            >
              {formatDateWithOrdinalIndicator(new Date(leaveData.createdDate))}
            </Typography>
          </Box>
        ),
        status: (
          <IconChip
            label={leaveData.status.toLowerCase()}
            icon={requestTypeSelector(getLeaveRequestStatus(leaveData.status))}
            isResponsive={true}
            chipStyles={{
              alignSelf: "flex-end",
              [`@media (max-width: 81.25rem)`]: {
                marginRight: "2.25rem",
                padding: "1rem"
              }
            }}
            isTruncated={!theme.breakpoints.up("xl")}
          />
        ),
        reason: (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
              justifyContent: "flex-start",
              minWidth: "5.3125rem",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              [theme.breakpoints.down("lg")]: {
                display: "none"
              }
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                width: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
            >
              {leaveData.requestDesc ? leaveData.requestDesc : "-"}
            </Typography>
          </Box>
        )
      })
    );
  };

  const removeFilters = (label?: string) => {
    removeFiltersByLabel(
      leaveRequestsFilter,
      setLeaveRequestFilterOrder,
      setLeaveRequestsFilter,
      setLeaveRequestParams,
      leaveTypeButtons,
      filterArray,
      setFilterArray,
      label
    );
  };

  const handleFilterClick = (event: MouseEvent<HTMLElement>): void => {
    setFilterEl(event.currentTarget);
    setFilterOpen((previousOpen) => !previousOpen);
  };

  const handleFilterClose = (): void => {
    setFilterEl(null);
    setFilterOpen(false);
  };

  const onClickReset = () => {
    resetLeaveRequestParams();
    setFilterArray([]);
    setSelectedDates([]);
  };

  const renderDateRange = () => {
    return (
      <Stack sx={{ flexDirection: "row", alignItems: "center" }}>
        <Typography
          variant="body2"
          sx={{
            px: "1.25rem"
          }}
        >
          Date:
        </Typography>
        <DateRangePicker
          selectedDates={selectedDates}
          setSelectedDates={setSelectedDates}
        />
      </Stack>
    );
  };

  const renderFilterBy = () => {
    return (
      <Box>
        <Stack direction="row" alignItems="center" gap={0.5}>
          {filterArray.length > 0 && <Typography>Filter :</Typography>}
          <ShowSelectedFilters
            filterOptions={leaveRequestFilterOrder}
            onDeleteIcon={removeFilters}
          />
          <IconButton
            icon={<FilterIcon />}
            onClick={handleFilterClick}
            buttonStyles={{
              border: "0.0625rem solid",
              borderColor: "grey.500",
              bgcolor: theme.palette.grey[100],
              p: "0.625rem 1.25rem",
              transition: "0.2s ease",
              "&:hover": {
                boxShadow: `inset 0 0 0 0.125rem ${theme.palette.grey[500]}`
              }
            }}
            aria-describedby={filterId}
            dataProps={{
              "aria-label":
                "Filter: Pressing enter on this button opens a menu where you can choose to filter by leave status, leave type and date."
            }}
          />
        </Stack>
        <LeaveRequestMenu
          anchorEl={filterEl}
          handleClose={handleFilterClose}
          position="bottom-end"
          menuType={MenuTypes.FILTER}
          id={filterId}
          open={filterOpen}
          leaveTypeButtons={requestedLeaveTypesPreProcessor(leaveTypesList)}
          onReset={onClickReset}
        />
      </Box>
    );
  };

  useEffect(() => {
    if (leaveHistory && !isLoading) {
      setEmployeeLeaveHistoryData(leaveHistory);
    }
  }, [leaveHistory, isLoading]);

  useEffect(() => {
    if (leaveTypesList) {
      setLeaveTypeButtons(requestedLeaveTypesPreProcessor(leaveTypesList));
    }
  }, [leaveTypesList]);

  useEffect(() => {
    setFilterArray(leaveRequestFilterOrder);
    setLeaveRequestParams("size", "6");
    const startDate = getDateForPeriod("year", "start");
    const endDate = getDateForPeriod("year", "end");

    const selectedStartDate = selectedDates[0]
      ? convertDateToFormat(selectedDates[0], "yyyy-MM-dd")
      : startDate;
    const selectedEndDate = selectedDates[1]
      ? convertDateToFormat(selectedDates[1], "yyyy-MM-dd")
      : endDate;

    setLeaveRequestParams("startDate", selectedStartDate);
    setLeaveRequestParams("endDate", selectedEndDate);
  }, [leaveRequestFilterOrder, selectedDates, setLeaveRequestParams]);

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          mb: "0.75rem"
        }}
      >
        Leave History
      </Typography>

      <Table
        tableHeaders={tableHeaders}
        tableRows={transformToTableRows()}
        actionRowOneLeftButton={renderDateRange()}
        actionRowOneRightButton={renderFilterBy()}
        skeletonRows={5}
        isLoading={isLoading}
        totalPages={employeeLeaveHistoryData.totalPages}
        currentPage={employeeLeaveHistoryData.currentPage}
        onPaginationChange={(_event: ChangeEvent<unknown>, value: number) =>
          setCurrentPage(value - 1)
        }
        emptyDataDescription={
          filterArray.length > 0
            ? translateText(["tableHeaders.emptyHistoryForFiltersDes"])
            : translateText(["tableHeaders.emptyHistoryDes"])
        }
        emptyDataTitle={
          filterArray.length > 0
            ? translateText(["tableHeaders.emptyHistoryForFiltersTitle"])
            : translateText(["tableHeaders.emptyHistoryTitle"])
        }
        exportButtonText={translateText(["tableHeaders.exportReport"])}
        onExportButtonClick={async () => {
          downloadDataAsCSV(
            {
              data: exportHistoryData?.items
            },
            `${employeeFirstName ?? ""}-${employeeLastName ?? ""}`
          );
        }}
      />
    </Box>
  );
};

export default UserLeaveHistory;

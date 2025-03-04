import { type Theme, useTheme } from "@mui/material/styles";

import { MultipleTooltipFormatterParams } from "~community/common/types/EchartTypes";
import { LeaveTypeBreakDownReturnTypes } from "~community/leave/types/LeaveUtilizationTypes";

import LeaveTypeBreakdownTooltip from "./LeaveTypeBreakdownTooltip";

export const useLeaveUtilizationChartOptions = (
  datasets: LeaveTypeBreakDownReturnTypes,
  toggle: Record<string, boolean>,
  monthsArray: string[]
) => {
  const theme: Theme = useTheme();

  const isDataAvailable = datasets?.data
    ?.map((data) => data?.data)
    .flat()
    .some((data) => data !== 0);

  return {
    grid: {
      top: "15%",
      bottom: "10%",
      right: "2%",
      left: "5%"
    },
    itemStyle: {
      borderRadius: [6, 6, 0, 0] // Set border radius for each corner of the bar
    },
    tooltip: {
      trigger: "axis",
      padding: [4, 12],
      borderRadius: 12,
      borderColor: "transparent",
      formatter: (params: MultipleTooltipFormatterParams) => {
        return LeaveTypeBreakdownTooltip(params);
      },
      axisPointer: {
        type: "shadow"
      }
    },
    legend: {
      show: false,
      data: datasets?.labels,
      selected: toggle
    },
    barGap: 0.2,
    barMaxWidth: "25px",
    xAxis: {
      type: "category",
      data: monthsArray,
      axisLine: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: theme.palette.common.black,
        fontSize: 13,
        fontFamily: "Poppins"
      }
    },
    yAxis: {
      minInterval: isDataAvailable ? 1 : 0.5,
      axisLine: {
        show: false,
        lineStyle: {
          color: theme.palette.grey.A400,
          opacity: 0.5
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: theme.palette.common.black,
          opacity: 0.15
        }
      },
      axisLabel: {
        inside: true,
        margin: -40,
        color: theme.palette.common.black,
        fontSize: 12,
        fontFamily: "Poppins"
      }
    },
    series: datasets?.data
  };
};

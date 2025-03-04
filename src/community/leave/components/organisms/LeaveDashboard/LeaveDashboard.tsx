import { TrendingUp } from "@mui/icons-material";
import { Box, Chip, Stack, Theme, Typography, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DateTime } from "luxon";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { JSX, useEffect, useState } from "react";

import AnalyticCard from "~community/common/components/molecules/AnalyticCard/AnalyticCard";
import TeamSelector from "~community/common/components/molecules/TeamSelector/TeamSelector";
import ROUTES from "~community/common/constants/routes";
import { DATE_FORMAT } from "~community/common/constants/timeConstants";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { AdminTypes } from "~community/common/types/AuthTypes";
import {
  useGetAbsenceRate,
  useGetAvailability,
  useGetLeaveTypeBreakdownChartData,
  useGetPendingLeavesData
} from "~community/leave/api/LeaveDashboard";
import { useLeaveStore } from "~community/leave/store/store";

import AvailabilityCalendarWidget from "../../molecules/AvailabilityCalendar/AvailabilityCalendarWidget";
import AvailableChip from "../../molecules/LeaveDashboardChips/AvailableChip";
import AwayChip from "../../molecules/LeaveDashboardChips/AwayChip";
import HolidayChip from "../../molecules/LeaveDashboardChips/HolidayChip";
import LeaveTypeBreakdownChart from "../../molecules/LeaveUtilizationGraph/LeaveTypeBreakdownChart";
import styles from "./styles";

const LeaveDashboard = (): JSX.Element => {
  const translateText = useTranslator("leaveModule", "dashboard");
  const [teamId, setTeamId] = useState<string | number>("");
  const [teamName, setTeamName] = useState<string>(translateText(["all"]));
  const [isFetchingEnabled, setIsFetchingEnabled] = useState<boolean>(false);
  const { data } = useSession();
  const theme: Theme = useTheme();
  const classes = styles(theme);
  const router = useRouter();
  const {
    viewedPendingLeaveCount,
    setViewedPendingLeaveCount,
    pendingLeaveCount,
    setPendingLeaveCount
  } = useLeaveStore((state) => state);

  const { data: todaysAvailability } = useGetAvailability(
    teamId,
    DateTime.now().toFormat(DATE_FORMAT),
    isFetchingEnabled
  );
  const { data: pendingLeaves } = useGetPendingLeavesData(teamId);

  const { data: absenceRate } = useGetAbsenceRate(teamId, isFetchingEnabled);
  const {
    isLoading,
    error,
    data: datasets
  } = useGetLeaveTypeBreakdownChartData(teamId);

  const newPendingRequests =
    pendingLeaves?.[0]?.items?.length - viewedPendingLeaveCount;

  useEffect(() => {
    if (data) setIsFetchingEnabled(true);
  }, [data, teamId]);

  const resourceDetails = () => {
    if (todaysAvailability[0]?.holidayResponseDtos?.length > 0) {
      return (
        <HolidayChip
          text={todaysAvailability[0]?.holidayResponseDtos[0]?.name}
        />
      );
    }
    if (
      todaysAvailability[0]?.adminOnLeaveDto?.onlineCount > 0 ||
      todaysAvailability[0]?.adminOnLeaveDto?.onLeaveCount > 0
    ) {
      if (todaysAvailability[0]?.adminOnLeaveDto?.onLeaveCount === 0) {
        return (
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", pt: 1 }}>
            <AvailableChip text={translateText(["allAvailable"])} />
          </Box>
        );
      } else if (todaysAvailability[0]?.adminOnLeaveDto?.onlineCount === 0) {
        return (
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", pt: 1 }}>
            <AwayChip text={translateText(["allAway"])} />
          </Box>
        );
      } else {
        return (
          <Box sx={{ display: "flex", gap: 1 }}>
            {todaysAvailability[0]?.adminOnLeaveDto?.onlineCount > 0 && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography sx={classes.analytic}>
                  {todaysAvailability[0]?.adminOnLeaveDto?.onlineCount}
                </Typography>
                <AvailableChip text={translateText(["available"])} />
              </Box>
            )}

            {todaysAvailability[0]?.adminOnLeaveDto?.onLeaveCount > 0 && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography sx={classes.analytic}>
                  {todaysAvailability[0]?.adminOnLeaveDto?.onLeaveCount ?? "-"}
                </Typography>
                <AwayChip text={translateText(["away"])} />
              </Box>
            )}
          </Box>
        );
      }
    } else {
      return <Typography sx={classes.analytic}>{"-"}</Typography>;
    }
  };

  return (
    <Box>
      <Box sx={classes.container}>
        <Box sx={classes.header}>
          <Typography style={{ textTransform: "uppercase" }}>
            {` ${translateText(["records"])} ${
              teamId === -1 ? translateText(["all"]) : `${teamName}`
            }`}
          </Typography>
          <TeamSelector
            setTeamId={setTeamId}
            setTeamName={setTeamName}
            moduleAdminType={AdminTypes.LEAVE_ADMIN}
          />
        </Box>
        <Grid container spacing={1}>
          <Grid sx={{ width: { xs: "100%", md: "32.5%" } }}>
            <AnalyticCard title={translateText(["todayAvailability"]) ?? ""}>
              {todaysAvailability && resourceDetails()}
            </AnalyticCard>
          </Grid>
          <Grid sx={{ width: { xs: "100%", md: "32.5%" } }}>
            <AnalyticCard
              title={translateText(["pendingLeaves"]) ?? ""}
              isExpandable={
                pendingLeaves?.[0]?.items?.length > 0 ? true : false
              }
              onExpand={() => {
                setPendingLeaveCount(pendingLeaves?.[0]?.items?.length),
                  setViewedPendingLeaveCount(pendingLeaves?.[0]?.items?.length),
                  router.replace(ROUTES.LEAVE.LEAVE_PENDING);
              }}
            >
              {pendingLeaves?.[0]?.items?.length > 0 ? (
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Typography sx={classes.analytic}>
                    {pendingLeaves?.[0]?.items?.length}
                  </Typography>
                  {newPendingRequests > 0 && (
                    <Stack
                      sx={{
                        flexDirection: "row",
                        gap: 1,
                        alignItems: "center",
                        backgroundColor: theme.palette.amber.mid,
                        padding: "0.25rem .75rem",
                        borderRadius: 10,
                        height: "2rem"
                      }}
                    >
                      <Typography
                        sx={{ color: theme.palette.amber.chipText }}
                        variant="caption"
                      >
                        {`${newPendingRequests} ${translateText(["newRequest"])}`}
                      </Typography>
                    </Stack>
                  )}
                </div>
              ) : (
                <Typography sx={classes.analytic}>{"-"}</Typography>
              )}
            </AnalyticCard>
          </Grid>

          <Grid sx={{ width: { xs: "100%", md: "32.5%" } }}>
            <AnalyticCard title={translateText(["absenceRate"]) ?? ""}>
              {absenceRate?.[0] ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Typography sx={classes.analytic}>
                    {`${String(absenceRate[0]?.currentAbsenceRate?.toFixed(1))} %`}
                  </Typography>
                  <Chip
                    icon={
                      <TrendingUp
                        style={{
                          color:
                            absenceRate[0]?.monthBeforeAbsenceRate >= 0
                              ? theme.palette.greens.midDark
                              : theme.palette.error.contrastText
                        }}
                      />
                    }
                    label={`${absenceRate[0]?.monthBeforeAbsenceRate?.toFixed(
                      0
                    )}% ${translateText(["trend"])}`}
                    sx={{
                      color:
                        absenceRate[0]?.monthBeforeAbsenceRate >= 0
                          ? theme.palette.greens.midDark
                          : theme.palette.error.contrastText,
                      backgroundColor:
                        absenceRate[0]?.monthBeforeAbsenceRate >= 0
                          ? theme.palette.greens.lightBackground
                          : theme.palette.error.light,
                      [theme.breakpoints.down("md")]: {
                        fontSize: "0.625rem",
                        lineHeight: "0.625rem"
                      },
                      ml: 1,
                      fontSize: "0.75rem"
                    }}
                  />
                </div>
              ) : (
                <Typography sx={classes.analytic}>{"-"}</Typography>
              )}
            </AnalyticCard>
          </Grid>
        </Grid>
        <AvailabilityCalendarWidget teams={teamId} />
        <LeaveTypeBreakdownChart
          datasets={datasets}
          isLoading={isLoading}
          error={error}
        />
      </Box>
    </Box>
  );
};

export default LeaveDashboard;

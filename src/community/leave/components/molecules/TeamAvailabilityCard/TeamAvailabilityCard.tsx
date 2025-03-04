import { Chip, Stack, Theme, Typography, useTheme } from "@mui/material";
import { useMemo } from "react";

import Icon from "~community/common/components/atoms/Icon/Icon";
import AvatarGroupWithLabel from "~community/common/components/molecules/AvatarGroupWithLabel/AvatarGroupWithLabel";
import Dropdown from "~community/common/components/molecules/Dropdown/Dropdown";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { StyleProps } from "~community/common/types/CommonTypes";
import { IconName } from "~community/common/types/IconTypes";
import { mergeSx } from "~community/common/utils/commonUtil";
import { MyRequestModalEnums } from "~community/leave/enums/MyRequestEnums";
import { useLeaveStore } from "~community/leave/store/store";
import { ResourceAvailabilityPayload } from "~community/leave/types/MyRequests";
import {
  getAvailabilityInfo,
  getEmployeesWithLeaveRequests,
  getTeamAvailabilityData,
  getTotalLeaveCount
} from "~community/leave/utils/myRequests/teamAvailabilityCardUtils";
import { TeamNamesType } from "~community/people/types/TeamTypes";

import styles from "./styles";

interface Props {
  teams: TeamNamesType[] | undefined;
  resourceAvailability: ResourceAvailabilityPayload[] | undefined;
}

const TeamAvailabilityCard = ({ teams, resourceAvailability }: Props) => {
  const theme: Theme = useTheme();
  const classes = styles(theme);

  const translateText = useTranslator(
    "leaveModule",
    "myRequests",
    "teamAvailabilityCard"
  );

  const {
    selectedDates,
    selectedTeam,
    setSelectedTeam,
    setTeamAvailabilityData,
    setMyLeaveRequestModalType
  } = useLeaveStore();

  const cardData = useMemo(() => {
    const teamAvailabilityData = getTeamAvailabilityData({
      selectedDates,
      resourceAvailability
    });

    setTeamAvailabilityData(teamAvailabilityData);

    return teamAvailabilityData;
  }, [selectedDates, resourceAvailability, setTeamAvailabilityData]);

  const totalLeaveCount = useMemo(
    () => getTotalLeaveCount(cardData),
    [cardData]
  );

  const totalAvailableCount = useMemo(() => {
    if (
      selectedDates.length === 1 ||
      (selectedDates.length === 2 && totalLeaveCount === 0)
    ) {
      return cardData?.[0]?.availableCount;
    }
  }, [cardData, selectedDates, totalLeaveCount]);

  return (
    <Stack
      sx={mergeSx([
        classes.wrapper,
        {
          backgroundColor: totalLeaveCount
            ? theme.palette.grey[100]
            : theme.palette.greens.lightTertiary,
          border: totalLeaveCount
            ? `0.0625rem solid ${theme.palette.grey[500]}`
            : `0.0625rem solid ${theme.palette.greens.darkBoarder}`
        }
      ])}
    >
      <Stack sx={classes.rowOne}>
        <Typography variant="h3">{translateText(["title"])}</Typography>
        <Dropdown
          title={selectedTeam?.teamName ?? translateText(["dropDownLabel"])}
          displayKey="teamName"
          items={teams ?? []}
          onItemClick={(_event, item) => setSelectedTeam(item)}
          selectedItem={selectedTeam as TeamNamesType}
          position="bottom-end"
          wrapperStyles={classes.wrapperStyles as StyleProps}
          dropdownBtnStyles={classes.dropdownBtnStyles as StyleProps}
        />
      </Stack>
      <Stack sx={classes.rowTwo}>
        <Typography variant="body2">
          {getAvailabilityInfo({
            selectedDates,
            cardData,
            translateText
          })}
        </Typography>
      </Stack>
      <Stack sx={classes.rowThree}>
        <Stack sx={classes.leftContent}>
          {totalAvailableCount ? (
            <>
              <Typography variant="h2">{totalAvailableCount}</Typography>
              <Chip
                label={translateText(["available"])}
                size="small"
                sx={classes.chip}
              />
            </>
          ) : (
            <></>
          )}
          <AvatarGroupWithLabel
            avatars={getEmployeesWithLeaveRequests(cardData)}
            max={5}
            label={translateText(["away"])}
            componentStyles={classes.componentStyles}
          />
        </Stack>
        {totalLeaveCount !== 0 ? (
          <Stack
            sx={classes.rightContent}
            onClick={() =>
              setMyLeaveRequestModalType(MyRequestModalEnums.TEAM_AVAILABILITY)
            }
          >
            <Typography variant="caption">
              {translateText(["viewDetails"])}
            </Typography>
            <Icon name={IconName.RIGHT_ARROW_ICON} />
          </Stack>
        ) : (
          <></>
        )}
      </Stack>
    </Stack>
  );
};

export default TeamAvailabilityCard;

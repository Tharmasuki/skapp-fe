import { Stack, Typography, useTheme } from "@mui/material";
import { Dispatch, SetStateAction, useMemo } from "react";

import BasicChip from "~community/common/components/atoms/Chips/BasicChip/BasicChip";
import { useMediaQuery } from "~community/common/hooks/useMediaQuery";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { PeopleFilterHeadings } from "~community/people/types/CommonTypes";

const FilterTypeSection = ({
  selected,
  setSelected
}: {
  selected: PeopleFilterHeadings;
  setSelected: Dispatch<SetStateAction<PeopleFilterHeadings>>;
}) => {
  const theme = useTheme();
  const translateText = useTranslator("peopleModule", "peoples.filters");

  const queryMatches = useMediaQuery();
  const isSmallScreen = queryMatches(`(max-width: 1150px)`);

  const filters = useMemo(
    () => [
      {
        label: translateText(["demographics"]),
        value: PeopleFilterHeadings.DEMOGRAPICS
      },
      {
        label: translateText(["employements"]),
        value: PeopleFilterHeadings.EMPLOYMENTS
      },
      {
        label: translateText(["jobFamilies"]),
        value: PeopleFilterHeadings.JOB_FAMILIES
      },
      {
        label: translateText(["teams"]),
        value: PeopleFilterHeadings.TEAMS
      },
      {
        label: translateText(["userRoles"]),
        value: PeopleFilterHeadings.USER_ROLES
      }
    ],
    [translateText]
  );

  return (
    <Stack sx={{ paddingRight: isSmallScreen ? 1 : 3 }}>
      <Typography
        variant={isSmallScreen ? "caption" : "body2"}
        sx={{
          fontWeight: "600",
          marginBottom: 2
        }}
      >
        {translateText(["filters"])}
      </Typography>

      <Stack flexDirection="column">
        {filters.map((filter) => (
          <BasicChip
            key={filter.value}
            label={filter.label}
            onClick={() => setSelected(filter.value)}
            chipStyles={{
              ".MuiChip-root": {
                textAlign: "left",
                justifyContent: "flex-start"
              },
              display: "flex",
              textAlign: "left",
              justifyContent: "flex-start",
              backgroundColor:
                selected === filter.value
                  ? theme.palette.secondary.main
                  : "common.white",
              color:
                selected === filter.value
                  ? theme.palette.primary.dark
                  : "black",
              padding: "0.75rem 1rem",
              borderRadius: 3,
              marginBottom: 2,
              fontSize: isSmallScreen ? "0.75rem" : "0.875rem"
            }}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default FilterTypeSection;

import { Stack, Typography, useTheme } from "@mui/material";

import IconChip from "~community/common/components/atoms/Chips/IconChip.tsx/IconChip";
import Icon from "~community/common/components/atoms/Icon/Icon";
import { useMediaQuery } from "~community/common/hooks/useMediaQuery";
import { IconName } from "~community/common/types/IconTypes";

const EmployeeFilterSection = ({
  title,
  data,
  filterKey,
  currentFilter,
  handleFilterChange
}: {
  title: string;
  data: { label: string; value: string }[];
  filterKey: string;
  currentFilter: string[];
  handleFilterChange: (
    value: string,
    filterKey: string,
    currentFilter: string[]
  ) => void;
}) => {
  const theme = useTheme();

  const queryMatches = useMediaQuery();
  const isSmallScreen = queryMatches(`(max-width: 1150px)`);
  return (
    <Stack sx={{ marginBottom: 2 }}>
      <Typography
        variant={isSmallScreen ? "caption" : "body2"}
        sx={{
          fontWeight: "600",
          marginBottom: 2
        }}
      >
        {title}
      </Typography>
      <Stack flexDirection="row" sx={{ gap: 0.5, flexWrap: "wrap" }}>
        {data.map((item, index) => (
          <Stack key={index}>
            <IconChip
              label={item.label}
              onClick={() =>
                handleFilterChange(item.value, filterKey, currentFilter)
              }
              icon={
                currentFilter.includes(item.value) ? (
                  <Icon
                    name={IconName.SELECTED_ICON}
                    fill={theme.palette.primary.dark}
                  />
                ) : undefined
              }
              chipStyles={{
                backgroundColor: currentFilter.includes(item.value)
                  ? theme.palette.secondary.main
                  : theme.palette.grey[100],
                color: currentFilter.includes(item.value)
                  ? theme.palette.primary.dark
                  : "black",
                padding: "8px 12px",
                fontSize: isSmallScreen ? "0.75rem" : "0.875rem",
                border: currentFilter.includes(item.value)
                  ? `1px solid ${theme.palette.primary.dark}`
                  : "none"
              }}
            />
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default EmployeeFilterSection;

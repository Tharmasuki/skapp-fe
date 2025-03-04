import {
  Box,
  Chip,
  Divider,
  List,
  Stack,
  Typography,
  useTheme
} from "@mui/material";
import {
  Dispatch,
  JSX,
  MouseEvent,
  SetStateAction,
  useEffect,
  useState
} from "react";

import {
  ClockInSummaryFilterTypes,
  ClockInSummaryTypes
} from "~community/attendance/enums/dashboardEnums";
import CloseIcon from "~community/common/assets/Icons/CloseIcon";
import FilterIcon from "~community/common/assets/Icons/FilterIcon";
import Button from "~community/common/components/atoms/Button/Button";
import styles from "~community/common/components/molecules/FilterButton/styles";
import Popper from "~community/common/components/molecules/Popper/Popper";
import {
  ButtonSizes,
  ButtonStyle
} from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { PopperAndTooltipPositionTypes } from "~community/common/types/MoleculeTypes";

import BasicChip from "../../atoms/Chips/BasicChip/BasicChip";
import IconChip from "../../atoms/Chips/IconChip.tsx/IconChip";
import Icon from "../../atoms/Icon/Icon";

interface FilterPanelProps {
  filterTypes: {
    [key: string]:
      | {
          label: string;
          value: string | number | ClockInSummaryTypes;
        }[]
      | undefined;
  };
  onApplyFilters: (selectedFilters: {
    [key: string]: (string | number)[];
  }) => void;
  onResetFilters: () => void;
  id?: string;
  position?: PopperAndTooltipPositionTypes;
  selectedFilters: { [key: string]: (string | number)[] };
  setSelectedFilters: Dispatch<
    SetStateAction<{ [key: string]: (string | number)[] }>
  >;
}

const FilterButton = ({
  id,
  position,
  filterTypes,
  onApplyFilters,
  onResetFilters,
  selectedFilters,
  setSelectedFilters
}: FilterPanelProps): JSX.Element => {
  const theme = useTheme();
  const classes = styles(theme);

  const translateText = useTranslator("commonComponents", "advanceFilter");

  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const [isPopperOpen, setIsPopperOpen] = useState<boolean>(false);
  const [selectedFilterType, setSelectedFilterType] = useState<string | null>(
    ClockInSummaryFilterTypes.CLOCK_INS
  );
  const [appliedFilters, setAppliedFilters] = useState<{
    [key: string]: (string | number)[];
  }>(selectedFilters);
  const visibleFilterCount = 2;
  const handleFilterTypeClick = (filterType: string) => {
    setSelectedFilterType(filterType);
  };

  useEffect(() => {
    setAppliedFilters(selectedFilters);
  }, [selectedFilters]);

  const handleChipClick = (filterType: string, value: string | number) => {
    setAppliedFilters((prev) => {
      const values = prev[filterType] || [];
      const newValues = values.includes(value)
        ? values.filter((v) => v !== value)
        : [...values, value];
      return { ...prev, [filterType]: newValues };
    });
  };

  const handleRemoveSelected = (filterType: string, value: string | number) => {
    setSelectedFilters((prev) => {
      const values = prev[filterType].filter((v) => v !== value);
      return { ...prev, [filterType]: values };
    });
  };

  const handleApplyFilters = () => {
    onApplyFilters(appliedFilters);
    setIsPopperOpen(false);
  };

  const handleResetFilters = () => {
    setAppliedFilters({});
    onResetFilters();
    setIsPopperOpen(false);
    setSelectedFilterType(ClockInSummaryFilterTypes.CLOCK_INS);
  };

  const handleFilterBtnClick = (event: MouseEvent<HTMLElement>): void => {
    setAnchorElement(event.currentTarget);
    setIsPopperOpen((prevState) => !prevState);
  };

  return (
    <Stack sx={classes.wrapper}>
      <Stack sx={classes.container}>
        {Object.entries(selectedFilters)
          ?.flatMap(([filterType, values]) =>
            values?.map((value) => {
              const label = filterTypes[filterType]?.find(
                (item) => item.value === value
              )?.label;
              return { filterType, value, label };
            })
          )
          ?.slice(0, visibleFilterCount)
          ?.map(({ filterType, value, label }) => (
            <Chip
              key={value}
              label={label}
              sx={classes.filterItem}
              onDelete={() => handleRemoveSelected(filterType, value)}
              deleteIcon={
                <Box>
                  <CloseIcon fill={theme.palette.text.blackText} />
                </Box>
              }
            />
          ))}

        {Object.values(selectedFilters).reduce(
          (total, array) => total + array.length,
          0
        ) > visibleFilterCount && (
          <BasicChip
            label={`+${String(Object.values(selectedFilters).reduce((total, array) => total + array.length, 0) - visibleFilterCount)}`}
            chipStyles={{
              backgroundColor: theme.palette.grey[100],
              border: "0.0625rem solid",
              borderColor: "grey.500",
              textTransform: "capitalize",
              color: "common.black",
              px: "1rem",
              py: "0.4375rem",
              lineHeight: "1.0625rem"
            }}
          />
        )}
        <Button
          buttonStyle={ButtonStyle.TERTIARY}
          label={translateText(["placeholder"])}
          endIcon={<FilterIcon />}
          styles={classes.filterBtn}
          onClick={(event: MouseEvent<HTMLElement>) =>
            handleFilterBtnClick(event)
          }
        />
      </Stack>

      <Popper
        anchorEl={anchorElement}
        open={isPopperOpen}
        position={position ?? "bottom-end"}
        id={id}
        handleClose={() => setIsPopperOpen(false)}
        containerStyles={classes.popperContainer2}
      >
        <Box sx={{ background: theme.palette.text.whiteText, p: 2 }}>
          <Box display="flex" gap={2} p={2}>
            {/* Column 1: Filter Types */}
            <Box
              flex={1}
              sx={{
                borderRight: `1px solid ${theme.palette.grey[500]}`,
                paddingRight: "1rem"
              }}
            >
              <Typography variant="h4">
                {translateText(["placeholder"])}
              </Typography>
              <List>
                {Object.keys(filterTypes).map((filterType) => (
                  <Box
                    key={filterType}
                    onClick={() => handleFilterTypeClick(filterType)}
                    sx={{
                      backgroundColor:
                        filterType === selectedFilterType
                          ? theme.palette.secondary.main
                          : "transparent",
                      borderRadius: "12px",
                      mb: 1,
                      p: 1.5,
                      color:
                        filterType === selectedFilterType
                          ? theme.palette.primary.dark
                          : theme.typography.allVariants,
                      cursor: "pointer"
                    }}
                  >
                    <Typography>{filterType}</Typography>
                  </Box>
                ))}
              </List>
            </Box>

            {/* Column 2: Filter Values as Chips */}
            <Box
              flex={2}
              sx={{
                borderRight: `1px solid ${theme.palette.grey[500]}`,
                paddingRight: "1rem"
              }}
            >
              <Typography variant="h4">{selectedFilterType}</Typography>
              <Box
                display="flex"
                flexWrap="wrap"
                gap={1}
                sx={{ p: ".5rem 0rem" }}
              >
                {selectedFilterType &&
                  filterTypes[selectedFilterType]?.map(({ label, value }) => (
                    <IconChip
                      key={value}
                      label={label}
                      icon={
                        appliedFilters[selectedFilterType]?.includes(value) ? (
                          <Icon
                            name={IconName.SELECTED_ICON}
                            fill={theme.palette.primary.dark}
                          />
                        ) : undefined
                      }
                      chipStyles={{
                        backgroundColor: appliedFilters[
                          selectedFilterType
                        ]?.includes(value)
                          ? theme.palette.secondary.main
                          : "default",
                        padding: "8px 12px",
                        color: appliedFilters[selectedFilterType]?.includes(
                          value
                        )
                          ? theme.palette.primary.dark
                          : "default",
                        border: `1px solid ${appliedFilters[selectedFilterType]?.includes(value) ? theme.palette.secondary.dark : "transparent"}`
                      }}
                      onClick={() => handleChipClick(selectedFilterType, value)}
                      isTruncated={false}
                    />
                  ))}
              </Box>
            </Box>

            {/* Column 3: Selected Filters */}
            <Box flex={2}>
              {Object.values(appliedFilters).every(
                (arr) => arr.length === 0
              ) ? (
                <Typography
                  variant="h4"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  {translateText(["noSelectedFilters"])}
                </Typography>
              ) : (
                <Typography
                  sx={{ color: theme.palette.text.secondary }}
                  variant="h4"
                >{`${Object.values(appliedFilters).reduce((total, array) => total + array.length, 0)} ${translateText(["selected"])} `}</Typography>
              )}
              {Object.entries(appliedFilters).map(([filterType, values]) =>
                values.length > 0 ? (
                  <Box key={filterType} mt={1}>
                    <Typography
                      sx={{ color: theme.palette.text.secondary }}
                      variant="h4"
                    >
                      {filterType}
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1} my={1}>
                      {values.map((value) => {
                        const label = filterTypes[filterType]?.find(
                          (item) => item.value === value
                        )?.label;
                        return (
                          <IconChip
                            key={value}
                            label={label}
                            icon={
                              <Icon
                                name={IconName.SELECTED_ICON}
                                fill={theme.palette.primary.dark}
                              />
                            }
                            chipStyles={{
                              backgroundColor: theme.palette.secondary.main,
                              padding: "8px 12px",
                              color: theme.palette.primary.dark,
                              border: `1px solid ${theme.palette.secondary.dark}`
                            }}
                            isTruncated={false}
                          />
                        );
                      })}
                    </Box>
                  </Box>
                ) : null
              )}
            </Box>
          </Box>

          {/* Apply and Reset Buttons */}
          <Divider />
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="end"
            mt={2}
            gap={1}
          >
            <Button
              buttonStyle={ButtonStyle.PRIMARY}
              onClick={handleApplyFilters}
              label={translateText(["applyBtn"])}
              isFullWidth={false}
              size={ButtonSizes.MEDIUM}
            />
            <Button
              buttonStyle={ButtonStyle.SECONDARY}
              onClick={handleResetFilters}
              label={translateText(["resetBtn"])}
              isFullWidth={false}
              size={ButtonSizes.MEDIUM}
            />
          </Box>
        </Box>
      </Popper>
    </Stack>
  );
};

export default FilterButton;

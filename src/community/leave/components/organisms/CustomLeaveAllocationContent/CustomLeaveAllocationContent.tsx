import {
  Box,
  Container,
  Stack,
  Theme,
  Typography,
  useTheme
} from "@mui/material";
import { FC, useEffect, useState } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import SearchBox from "~community/common/components/molecules/SearchBox/SearchBox";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import CustomLeaveAllocationsTable from "~community/leave/components/molecules/CustomLeaveAllocationsTable/CustomLeaveAllocationsTable";
import CustomLeaveModalController from "~community/leave/components/organisms/CustomLeaveModalController/CustomLeaveModalController";
import { useLeaveStore } from "~community/leave/store/store";
import { CustomLeaveAllocationModalTypes } from "~community/leave/types/CustomLeaveAllocationTypes";

import styles from "./styles";

const CustomLeaveAllocationContent: FC = () => {
  const theme: Theme = useTheme();
  const classes = styles(theme);

  const translateText = useTranslator("leaveModule", "customLeave");
  const {
    setCustomLeaveAllocationModalType,
    setIsLeaveAllocationModalOpen,
    customLeaveAllocations
  } = useLeaveStore((state) => state);

  const [customLeaveAllocationSearchTerm, setCustomLeaveAllocationSearchTerm] =
    useState<string | undefined>(undefined);
  const [showAddButton, setShowAddButton] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [hasFilteredData, setHasFilteredData] = useState(true);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [hasEmptyFilterResults, setHasEmptyFilterResults] = useState(false);

  useEffect(() => {
    const hasData = customLeaveAllocations && customLeaveAllocations.length > 0;
    const hasSearchTerm =
      customLeaveAllocationSearchTerm !== undefined &&
      customLeaveAllocationSearchTerm.trim() !== "";

    if (hasEmptyFilterResults) {
      setShowSearchBox(true);
      setShowAddButton(false);
      return;
    }

    if (!hasData && !hasSearchTerm && !isFilterActive) {
      setShowSearchBox(false);
      setShowAddButton(true);
      return;
    }

    setShowSearchBox(true);
    setShowAddButton(!hasData);
    setHasFilteredData(hasData);
  }, [
    customLeaveAllocations,
    customLeaveAllocationSearchTerm,
    isFilterActive,
    hasEmptyFilterResults,
    customLeaveAllocations.length > 0
  ]);

  const handleAddAllocation = () => {
    setIsLeaveAllocationModalOpen(true);
    setCustomLeaveAllocationModalType(
      CustomLeaveAllocationModalTypes.ADD_LEAVE_ALLOCATION
    );
  };

  const handleSearchTermChange = (term: string) => {
    setCustomLeaveAllocationSearchTerm(term);
    setIsFilterActive(true);
  };

  return (
    <Container disableGutters maxWidth={false}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Stack direction="row" alignItems="center" sx={{ flex: 1 }}>
          <Typography sx={classes.titleText} variant="h1">
            {translateText(["CustomLeaveAllocationsSectionTitle"])}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          sx={{ flex: 1, justifyContent: "flex-end" }}
        >
          {!showAddButton && (
            <Button
              buttonStyle={ButtonStyle.PRIMARY}
              label={translateText(["addLeaveAllocationBtn"])}
              endIcon={<Icon name={IconName.ADD_ICON} />}
              styles={{
                ...classes.primaryButtonStyles,
                minWidth: "auto",
                padding: "0.5rem 1rem"
              }}
              onClick={handleAddAllocation}
            />
          )}
        </Stack>
      </Stack>

      <Box>
        {showSearchBox && (
          <SearchBox
            value={customLeaveAllocationSearchTerm}
            setSearchTerm={handleSearchTermChange}
            placeHolder={translateText([
              "CustomLeaveAllocationsSectionSearchBarPlaceholder"
            ])}
          />
        )}
        <Box sx={{ marginTop: 2 }}>
          <CustomLeaveAllocationsTable
            searchTerm={customLeaveAllocationSearchTerm}
            setHasFilteredData={setHasFilteredData}
            setHasEmptyFilterResults={setHasEmptyFilterResults}
          />
        </Box>
        <CustomLeaveModalController />
      </Box>
    </Container>
  );
};

export default CustomLeaveAllocationContent;

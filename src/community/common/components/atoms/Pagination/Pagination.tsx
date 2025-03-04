import {
  Pagination as MuiPagination,
  PaginationItem,
  type PaginationRenderItemParams,
  useTheme
} from "@mui/material";
import { type SxProps } from "@mui/system";
import { ChangeEvent, JSX } from "react";

import { useMediaQuery } from "~community/common/hooks/useMediaQuery";
import { mergeSx } from "~community/common/utils/commonUtil";

import styles from "./styles";

interface Props {
  totalPages?: number;
  onChange: (event: ChangeEvent<unknown>, value: number) => void;
  currentPage: number;
  paginationStyles?: SxProps;
  isDisabled?: boolean;
  isNumbersVisible?: boolean;
}

const Pagination = ({
  totalPages = 1,
  onChange,
  currentPage,
  paginationStyles,
  isDisabled = false,
  isNumbersVisible = true
}: Props): JSX.Element => {
  const queryMatches = useMediaQuery();
  const isBelow1280 = queryMatches(1280);

  const theme = useTheme();
  const classes = styles(theme);

  const renderPaginationItem = (item: PaginationRenderItemParams) =>
    item.type === "page" ? null : <PaginationItem {...item} />;

  return (
    <MuiPagination
      count={totalPages}
      variant="outlined"
      boundaryCount={isBelow1280 ? 0 : 1}
      onChange={onChange}
      size={isBelow1280 ? "small" : "medium"}
      page={currentPage + 1}
      shape="rounded"
      disabled={isDisabled}
      renderItem={isNumbersVisible ? undefined : renderPaginationItem}
      sx={mergeSx([classes.pagination, paginationStyles])}
    />
  );
};

export default Pagination;

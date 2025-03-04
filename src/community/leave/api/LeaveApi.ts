import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";
import { rejects } from "assert";
import { AxiosResponse } from "axios";

import {
  CustomLeavesTypes,
  SortKeyTypes,
  SortOrderTypes
} from "~community/common/types/CommonTypes";
import authFetch from "~community/common/utils/axiosInterceptor";
import {
  formatDateToISOString,
  getYearStartAndEndDates
} from "~community/common/utils/dateTimeUtils";
import { leaveEndPoints } from "~community/leave/api/utils/ApiEndpoints";
import {
  leaveQueryKeys,
  leaveTypeQueryKeys
} from "~community/leave/api/utils/QueryKeys";

import { leaveRequestPreProcessor } from "../actions/LeaveRequestPreprocessor";
import { useLeaveStore } from "../store/store";
import { LeaveTypeType } from "../types/AddLeaveTypes";
import { CustomLeaveAllocationType } from "../types/CustomLeaveAllocationTypes";
import { leaveRequestRowDataTypes } from "../types/LeaveRequestTypes";
import { LeaveCycleStartEndDatesType } from "../types/LeaveTypes";
import { LeaveRequest } from "../types/PendingLeaves";
import { leaveRequestDataPreProcessor } from "../utils/LeavePreprocessors";

const createCustomLeave = async (
  newEntitlementData: CustomLeaveAllocationType
): Promise<void> => {
  const { end: endOfYearDate } = getYearStartAndEndDates(
    new Date().getFullYear()
  );

  if (!newEntitlementData.validFromDate) {
    newEntitlementData.validFromDate = formatDateToISOString(new Date());
  }
  if (!newEntitlementData.validToDate) {
    newEntitlementData.validToDate = endOfYearDate ?? undefined;
  }

  const { name, ...EntitlementData } = newEntitlementData;

  return await authFetch.post(
    leaveEndPoints.GET_CUSTOM_LEAVES,
    EntitlementData
  );
};

const updateCustomLeave = async (
  updatedEntitlement: CustomLeaveAllocationType
): Promise<void> => {
  const { entitlementId, name, ...rest } = updatedEntitlement;
  return await authFetch.patch(
    leaveEndPoints.UPDATE_CUSTOM_LEAVE(entitlementId),
    rest
  );
};

const deleteCustomLeave = async (entitlementId: number): Promise<void> => {
  return await authFetch.delete(
    leaveEndPoints.UPDATE_CUSTOM_LEAVE(entitlementId)
  );
};

export const useDeleteLeaveAllocation = (): UseMutationResult<
  unknown,
  unknown,
  number,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCustomLeave,
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: leaveQueryKeys.CUSTOM_LEAVES()
        })
        .catch(rejects);
    }
  });
};

export const useUpdateLeaveAllocation = (): UseMutationResult<
  unknown,
  unknown,
  CustomLeaveAllocationType,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCustomLeave,
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: leaveQueryKeys.CUSTOM_LEAVES()
        })
        .catch(rejects);
    }
  });
};

export const useCreateLeaveAllocation = (
  onSuccess: () => void,
  onError: () => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCustomLeave,
    onSuccess: () => {
      onSuccess();
      queryClient
        .invalidateQueries({ queryKey: leaveQueryKeys.CUSTOM_LEAVES() })
        .catch(rejects);
    },
    onError: () => {
      onError();
    }
  });
};

export const useGetCustomLeaves = (
  page: number,
  size: number,
  keyword?: string,
  year?: number,
  selectedLeaveTypes?: string
): UseQueryResult<CustomLeavesTypes> => {
  return useQuery({
    queryKey: leaveQueryKeys.CUSTOM_LEAVES(
      page,
      size,
      keyword,
      year,
      selectedLeaveTypes
    ),
    queryFn: async () => {
      const params: any = {
        page,
        size,
        sortOrder: SortOrderTypes.ASC,
        keyword,
        sortKey: SortKeyTypes.CREATION_DATE,
        year,
        leaveTypeId: selectedLeaveTypes
      };

      const results = await authFetch.get(leaveEndPoints.GET_CUSTOM_LEAVES, {
        params
      });
      return results?.data?.results[0];
    }
  });
};
export const useGetLeaveCycle = () => {
  return useQuery({
    queryKey: [leaveQueryKeys.LEAVE_CYCLE],
    queryFn: async () => {
      const result = await authFetch.get(leaveEndPoints.GET_LEAVE_CYCLE);

      return result.data.results[0] as LeaveCycleStartEndDatesType;
    }
  });
};

export const useGetPendingLeaveRequests = (
  searchKeyword: string
): UseQueryResult<LeaveRequest[]> => {
  return useQuery<LeaveRequest[]>({
    queryKey: [leaveQueryKeys.PENDING_LEAVES, searchKeyword],
    queryFn: async () => {
      const result = await authFetch.get(leaveEndPoints.PENDING_LEAVES, {
        params: { searchKeyword }
      });
      return result.data.results;
    }
  });
};

export const useUpdateLeaveRequest = (data: {
  leaveRequestId: number;
  status: string | "";
  reviewerComment?: string | "";
}): Promise<AxiosResponse> => {
  return authFetch.patch(
    leaveEndPoints.UPDATE_LEAVE_REQUEST(data.leaveRequestId),
    {
      status: data.status,
      reviewerComment: data.reviewerComment
    }
  );
};

export const useGetLeaveTypes = (
  filterByInUse?: boolean,
  isCarryForward?: boolean
): UseQueryResult<LeaveTypeType[]> => {
  const params = {
    filterByInUse,
    isCarryForward
  };

  return useQuery({
    queryKey: leaveTypeQueryKeys.LEAVE_TYPES(params),
    queryFn: async () => {
      const result = await authFetch.get(leaveEndPoints.GET_LEAVE_TYPES, {
        params
      });
      return (result?.data?.results ?? []) as LeaveTypeType[];
    }
  });
};

export const useGetCarryForwardLeaveTypes = (
  leaveTypes: number[],
  page?: number,
  size?: number,
  year?: number
) => {
  return useQuery({
    queryKey: leaveTypeQueryKeys.CARRY_FORWARD_LEAVE_TYPES(
      leaveTypes,
      page,
      size,
      year
    ),
    queryFn: async () => {
      const url = leaveEndPoints.CARRY_FORWARD_LEAVE_TYPES;
      const result = await authFetch.get(url, {
        params: {
          page,
          size,
          sortOrder: SortOrderTypes.ASC,
          year,
          leaveTypes: leaveTypes.join(",")
        }
      });
      return result.data.results[0].items ?? [];
    }
  });
};

export const useGetUseCarryForwardLeaveEntitlements = (
  selectedleaveTypes: number[]
) => {
  const carryForwardPaginationParams = useLeaveStore(
    (state) => state.carryForwardPagination
  );
  const { page, year, size } = carryForwardPaginationParams;

  return useQuery({
    enabled: false,
    queryKey: leaveTypeQueryKeys.CARRY_FORWARD_LEAVE_TYPES({
      leaveTypes: selectedleaveTypes,
      page,
      size,
      year
    }),
    queryFn: async () => {
      const url = leaveEndPoints.CARRY_FORWARD_LEAVE_TYPES;
      const leaveData = await authFetch.get(url, {
        params: {
          page: page,
          size: size,
          leaveTypes: selectedleaveTypes.join(","),
          year: new Date().getFullYear(),
          sortOrder: SortOrderTypes.ASC,
          sortKey: SortKeyTypes.NAME
        }
      });
      return leaveData?.data?.results[0];
    }
  });
};

export const useLeaveCarryForward = (
  onSuccess: () => void,
  onError: () => void
) => {
  return useMutation({
    mutationFn: async (leaveTypes: number[]) => {
      const result = authFetch.post(leaveEndPoints.CARRY_FORWARD_LEAVE_TYPES, {
        leaveTypes: leaveTypes,
        cycleStartYear: new Date().getFullYear() + 1
      });
      return result;
    },
    onSuccess,
    onError
  });
};

export const useGetManagerAssignedLeaveRequests = () => {
  const params = useLeaveStore((state) => state.leaveRequestParams);

  return useQuery({
    queryKey: ["managerAssignedLeaves", { sortKey: params }],
    queryFn: async () => {
      const url: string = `${leaveEndPoints.MANAGER_LEAVES}?sortOrder=${
        params.sortKey === "startDate" ? "ASC" : "DESC"
      }`;
      return await authFetch.get(url, { params });
    },
    select: (data) => {
      return leaveRequestPreProcessor(data?.data?.results[0]);
    }
  });
};

const fetchLeaveRequest = async ({
  queryKey
}: {
  queryKey: (string | number | boolean)[];
}): Promise<leaveRequestRowDataTypes> => {
  const id: number = queryKey[1] as number;
  const url: string = leaveEndPoints.GET_LEAVE_BY_ID(id);
  const result = await authFetch.get(url);
  return leaveRequestDataPreProcessor(result?.data?.results[0]);
};

export const useGetLeaveRequestData = (leaveId: number) => {
  return useQuery({
    queryKey: ["manager-leave-request-data", leaveId],
    queryFn: fetchLeaveRequest,
    enabled: false
  });
};

export const useHandelLeaves = (
  onSuccess?: () => void,
  onError?: () => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: useUpdateLeaveRequest,
    onSuccess: () => {
      if (onSuccess) {
        onSuccess?.();
      }
      queryClient
        .invalidateQueries({
          queryKey: ["managerAssignedLeaves"]
        })
        .catch(rejects);
    },
    onError: () => {
      onError?.();
    }
  });
};

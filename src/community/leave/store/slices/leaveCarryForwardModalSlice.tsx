import { SetType } from "~community/common/types/storeTypes";
import { LeaveCarryForwardModalTypes } from "~community/leave/types/LeaveCarryForwardTypes";
import { LeaveCarryForwardModalSliceType } from "~community/leave/types/SliceTypes";

export const leaveCarryForwardModalSlice = (
  set: SetType<LeaveCarryForwardModalSliceType>
): LeaveCarryForwardModalSliceType => ({
  isLeaveCarryForwardModalOpen: false,
  leaveCarryForwardModalType: LeaveCarryForwardModalTypes.NONE,
  setIsLeaveCarryForwardModalOpen: (status: boolean) =>
    set((state) => ({ ...state, isLeaveCarryForwardModalOpen: status })),
  setLeaveCarryForwardModalType: (modalType: LeaveCarryForwardModalTypes) =>
    set((state) => ({ ...state, leaveCarryForwardModalType: modalType }))
});

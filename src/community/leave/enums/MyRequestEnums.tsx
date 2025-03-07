export enum MyRequestModalEnums {
  LEAVE_TYPE_SELECTION = "LEAVE_TYPE_SELECTION",
  APPLY_LEAVE = "APPLY_LEAVE",
  TEAM_AVAILABILITY = "TEAM_AVAILABILITY",
  ADD_ATTACHMENT = "ADD_ATTACHMENT",
  NONE = "NONE"
}

export enum LeaveStatusEnums {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  CANCELLED = "CANCELLED",
  DENIED = "DENIED"
}

export enum ApplyLeaveToastEnums {
  APPLY_LEAVE_ERROR = "APPLY_LEAVE_ERROR",
  APPLY_LEAVE_SUCCESS = "APPLY_LEAVE_SUCCESS",
  LEAVE_ERROR_LEAVE_ENTITLEMENT_NOT_SUFFICIENT = "LEAVE_ERROR_LEAVE_ENTITLEMENT_NOT_SUFFICIENT",
  LEAVE_ERROR_LEAVE_ENTITLEMENT_NOT_APPLICABLE = "LEAVE_ERROR_LEAVE_ENTITLEMENT_NOT_APPLICABLE"
}

import { EntitlementsDtoType } from "~community/common/types/BulkUploadTypes";
import { EntitlementYears } from "~community/leave/types/LeaveTypes";
import { EmployeeEntitlementsDetailType } from "~community/people/types/AddNewResourceTypes";
import {
  EntitlementDetails,
  EntitlementInfo
} from "~community/people/types/EmployeeBulkUpload";

export const processEnitlementPayload = (
  requiredYear: EntitlementYears,
  employeeNumber: string,
  employeeName: string,
  email: string,
  employeeEntitlementsDetails: EmployeeEntitlementsDetailType[]
): EntitlementInfo => {
  const year =
    requiredYear === EntitlementYears.CURRENT
      ? new Date().getFullYear()?.toString()
      : (new Date().getFullYear() + 1).toString();

  const entitlements: EntitlementsDtoType[] = processEntitlementDetails(
    employeeEntitlementsDetails,
    year
  );

  const employeeDetails: EntitlementDetails = {
    employeeName,
    email,
    entitlements: entitlements
  };

  const payload: EntitlementInfo = {
    year,
    entitlementDetailsList: [employeeDetails]
  };

  return payload;
};

const processEntitlementDetails = (
  employeeEntitlementsDetails: EmployeeEntitlementsDetailType[],
  year: string
): EntitlementsDtoType[] => {
  return employeeEntitlementsDetails?.reduce((acc, entitlement) => {
    if (entitlement?.year?.toString() === year) {
      const entitlementDetails = {
        leaveTypeId: entitlement?.leaveType,
        name: entitlement?.leaveName,
        totalDaysAllocated: entitlement?.numDays,
        effectiveFrom: entitlement?.effectiveFrom,
        effectiveTo: entitlement?.expirationDate
      };

      acc.push(entitlementDetails);
    }

    return [...acc];
  }, []);
};

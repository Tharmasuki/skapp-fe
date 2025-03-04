import { Stack } from "@mui/material";
import { useSession } from "next-auth/react";

import { useTranslator } from "~community/common/hooks/useTranslator";
import { EmployeeTypes } from "~community/common/types/AuthTypes";
import { usePeopleStore } from "~community/people/store/store";
import { Role } from "~community/people/types/EmployeeTypes";

import EmployeeFilterSection from "../EmployeeFilterSection/EmployeeFilterSection";

const UserRolesSection = () => {
  const translateText = useTranslator(
    "peopleModule",
    "peoples.filters.userRolesFilters"
  );

  const { employeeDataFilter, setEmployeeDataFilter } = usePeopleStore(
    (state) => state
  );

  const { data: sessionData } = useSession();

  const peopleRoles = [
    { label: translateText(["admin"]), value: Role.PEOPLE_ADMIN },
    { label: translateText(["manager"]), value: Role.PEOPLE_MANAGER },
    { label: translateText(["employee"]), value: Role.PEOPLE_EMPLOYEE }
  ];

  const attendanceRoles = [
    { label: translateText(["admin"]), value: Role.ATTENDANCE_ADMIN },
    {
      label: translateText(["manager"]),
      value: Role.ATTENDANCE_MANAGER
    },
    {
      label: translateText(["employee"]),
      value: Role.ATTENDANCE_EMPLOYEE
    }
  ];

  const leaveRoles = [
    { label: translateText(["admin"]), value: Role.LEAVE_ADMIN },
    { label: translateText(["manager"]), value: Role.LEAVE_MANAGER },
    { label: translateText(["employee"]), value: Role.LEAVE_EMPLOYEE }
  ];

  const filterData = [
    ...(sessionData?.user?.roles?.includes(EmployeeTypes.ATTENDANCE_EMPLOYEE)
      ? [
          {
            title: translateText(["attendanceModule"]),
            filterKey: "permission",
            roles: attendanceRoles
          }
        ]
      : []),
    ...(sessionData?.user?.roles?.includes(EmployeeTypes.LEAVE_EMPLOYEE)
      ? [
          {
            title: translateText(["leaveModule"]),
            filterKey: "permission",
            roles: leaveRoles
          }
        ]
      : []),
    {
      title: translateText(["peopleModule"]),
      filterKey: "permission",
      roles: peopleRoles
    }
  ];

  const handleFilterChange = (
    value: string,
    filterKey: string,
    currentFilter: string[]
  ) => {
    if (!currentFilter.includes(value)) {
      setEmployeeDataFilter(filterKey, [...currentFilter, value]);
    } else {
      setEmployeeDataFilter(
        filterKey,
        currentFilter.filter((currentItem) => currentItem !== value)
      );
    }
  };

  return (
    <Stack
      sx={{
        overflowY: "auto",
        flexDirection: "column",
        maxHeight: "20rem"
      }}
    >
      {filterData.map((filter) => (
        <EmployeeFilterSection
          key={filter.title}
          title={filter.title}
          data={filter.roles}
          filterKey={filter.filterKey}
          handleFilterChange={handleFilterChange}
          currentFilter={employeeDataFilter[filter.filterKey]}
        />
      ))}
    </Stack>
  );
};

export default UserRolesSection;

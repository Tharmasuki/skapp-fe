import {
  AllJobFamilyType,
  JobFamilyEmployeeDataType,
  JobTitleType
} from "~community/people/types/JobFamilyTypes";

export const sortJobFamilyArrayInAscendingOrder = (
  allJobFamilies: AllJobFamilyType[] | null
) => {
  const sortedJobFamilies = allJobFamilies?.sort(
    (a, b) => (a?.jobFamilyId ?? 0) - (b?.jobFamilyId ?? 0)
  );

  return sortedJobFamilies ?? [];
};

export const sortJobTitlesArrayInAscendingOrder = (
  jobTitles: JobTitleType[] | null
) => {
  const sortedJobTitles = jobTitles?.sort(
    (a, b) => (a?.jobTitleId ?? 0) - (b?.jobTitleId ?? 0)
  );

  return sortedJobTitles ?? [];
};

export const getEmployeeDetails = (
  employeeId: number | undefined,
  employees: JobFamilyEmployeeDataType[] | undefined
) => {
  const employee = employees?.find(
    (employee) => employee.employeeId === employeeId
  );

  return employee;
};

export const getJobTitlesWithJobFamilyId = (
  jobFamilyTransfer: boolean,
  allJobFamilies: AllJobFamilyType[] | null,
  jobFamilyId: number | null,
  jobTitleId?: number | null
): JobTitleType[] => {
  const jobFamily = allJobFamilies?.find(
    (jobFamily) => jobFamily.jobFamilyId === jobFamilyId
  );

  if (jobFamilyTransfer) {
    return jobFamily?.jobTitles || [];
  } else {
    return (
      jobFamily?.jobTitles.filter(
        (jobTitle) => jobTitle.jobTitleId !== jobTitleId
      ) || []
    );
  }
};

export const toPascalCase = (str: string) =>
  str?.charAt(0).toUpperCase() + str?.slice(1).toLowerCase();

export const concatStrings = (args: string[], separator: string = " ") =>
  args.join(separator);

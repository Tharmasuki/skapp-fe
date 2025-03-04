import { FilterButtonTypes } from "~community/common/types/CommonTypes";
import { MenuitemsDataTypes } from "~community/common/types/filterTypes";

import { JobFamilyActionModalEnums } from "../enums/JobFamilyEnums";
import {
  EducationalDetailsType,
  EmployeeCareerDetailsTypes,
  EmployeeContactDetailsTypes,
  EmployeeEducationalDetailsTypes,
  EmployeeEmergencyDetailsTypes,
  EmployeeEmploymentDetailsTypes,
  EmployeeEntitlementsDetailType,
  EmployeeFamilyDetailsTypes,
  EmployeeGeneralDetailsTypes,
  EmployeeHealthAndOtherDetailsTypes,
  EmployeeIdentificationAndDiversityDetailsTypes,
  EmployeePreviousEmploymentDetailsTypes,
  EmployeeProfileDetailsTypes,
  EmployeeSocialMediaDetailsTypes,
  EmployeeVisaDetailsTypes,
  FamilyMemberType,
  ManagerStoreType,
  ModifiedFileType,
  PositionDetailsType,
  PreviousEmploymentDetailsType,
  VisaDetailsType
} from "./AddNewResourceTypes";
import {
  BulkEmployeeDetails,
  EmployeeDataFilterTypes,
  EmployeeDataParamsTypes,
  EmployeeRoleType,
  QuickAddEmployeeResponse,
  Role
} from "./EmployeeTypes";
import {
  HolidayDurationType,
  HolidayHalfDayState,
  holidayModalTypes
} from "./HolidayTypes";
import {
  AllJobFamilyType,
  CurrentEditingJobFamilyType,
  DeletingJobFamily,
  JobTitleType,
  TransferMemberFormType
} from "./JobFamilyTypes";
import { DirectoryModalTypes } from "./ModalTypes";
import {
  ProjectTeamsAndEmployeesType,
  ProjectTeamsModalTypes,
  TeamDetailsType,
  TeamModelTypes,
  TeamNamesType,
  TeamType
} from "./TeamTypes";

interface actionsTypes {
  // teamSlice
  setIsTeamModalOpen: (status: boolean) => void;
  setTeamModalType: (value: TeamModelTypes) => void;
  setCurrentEditingTeam: (team: TeamType | undefined) => void;
  setCurrentDeletingTeam: (team: TeamType | undefined) => void;

  // jobFamilySlice
  setAllJobFamilies: (value: AllJobFamilyType[]) => void;
  setCurrentEditingJobFamily: (
    value: CurrentEditingJobFamilyType | null
  ) => void;
  setCurrentDeletingJobFamily: (value: DeletingJobFamily | null) => void;
  setCurrentTransferMembersData: (
    value: TransferMemberFormType[] | null
  ) => void;
  setPreviousJobTitleData: (value: JobTitleType | null) => void;
  setIsJobFamilyModalOpen: (status: boolean) => void;
  setJobFamilyModalType: (value: JobFamilyActionModalEnums) => void;

  //holidayDataFiltersSlice
  handleHolidayDataSort: (key: string, value: string) => void;
  setHolidayDataFilter: (key: string, value: string[] | string) => void;
  resetHolidayDataParams: () => void;
  setHolidayDataParams: (key: string, value: any) => void;
  setHolidayDataPagination: (value: any) => void;
  setIndividualDeleteId: (value: number) => void;
  setSelectedDeleteIds: (value: number[]) => void;
  setSelectedYear: (value: string) => void;

  //holidaySlice
  setIsBulkUpload: (value: boolean) => void;
  setHolidayDetails: (value: any) => void;
  setFailedCount: (value: number) => void;
  setSuccessCount: (count: number) => void;
  resetHolidayDetails: () => void;
  resetFailedCount: () => void;
  resetSuccessCount: () => void;

  //holidayModalSlice
  setIsHolidayModalOpen: (status: boolean) => void;
  setHolidayModalType: (value: holidayModalTypes) => void;

  //addNewCalenderModalSlice
  setNewCalendarDetails?: (key: string, value: any) => void;
  removeAddedCalendarDetails?: () => void;

  //employeeDataFiltersSlice
  handleEmployeeDataSort: (key: string, value: string | boolean) => void;
  setEmployeeDataFilter: (
    key: string,
    value: string[] | string | number | number[] | FilterButtonTypes[]
  ) => void;
  resetEmployeeDataParams: () => void;
  setEmployeeDataParams: (
    key: string,
    value: (string | number)[] | string | boolean
  ) => void;
  setEmployeeDataPagination: (value: number) => void;
  setEmployeeDataFilterOrder: (value: string[]) => void;
  setMenuItems: (value: MenuitemsDataTypes[]) => void;
  setSearchedItems: (value: string[]) => void;
  setEmployeeStatusParam: (value: boolean | string) => void;
  setIsEmployeePending: (value: boolean | string) => void;
  setSearchKeyword: (value: string) => void;
  setIsPendingInvitationListOpen: (value: boolean) => void;
  removeEmployeeFilter: (label?: string) => void;
  removeGenderFilter: () => void;

  //directoryModalSlice
  setIsDirectoryModalOpen: (value: boolean) => void;
  setBulkUploadUsers: (value: BulkEmployeeDetails[]) => void;
  setDirectoryModalType: (value: DirectoryModalTypes) => void;
  setSharedCredentialData: (data: QuickAddEmployeeResponse) => void;

  //employeeDetailsSlice
  setEmployeeGeneralDetails: (
    key: string,
    value:
      | string
      | ModifiedFileType[]
      | number
      | undefined
      | (File & { preview: string })[]
      | null
  ) => void;
  setEmployeeContactDetails: (
    key: string,
    value: string | number | null | undefined
  ) => void;
  setEmployeeFamilyDetails: (
    value: FamilyMemberType | FamilyMemberType[]
  ) => void;
  setEmployeeEducationalDetails: (
    value: EducationalDetailsType | EducationalDetailsType[]
  ) => void;
  setEmployeeSocialMediaDetails: (
    key: string,
    value: string | undefined | null
  ) => void;
  setEmployeeHealthAndOtherDetails: (
    key: string,
    value: string | null | undefined
  ) => void;
  setEmployeePrimaryEmergencyContactDetails: (
    key: string,
    value: string | number
  ) => void;
  setEmployeeSecondaryEmergencyContactDetails: (
    key: string,
    value: string | number
  ) => void;
  setEmployeeEmploymentDetails: (
    key: string,
    value:
      | string
      | ManagerStoreType
      | (string | number)[]
      | number
      | undefined
      | null
  ) => void;
  setEmployeeCareerDetails: (
    value: PositionDetailsType | PositionDetailsType[]
  ) => void;
  setEmployeeIdentificationAndDiversityDetails: (
    key: string,
    value: string
  ) => void;
  setEmployeePreviousEmploymentDetails: (
    value: PreviousEmploymentDetailsType | PreviousEmploymentDetailsType[]
  ) => void;
  setEmployeeVisaDetails: (value: VisaDetailsType | VisaDetailsType[]) => void;
  setEmployeeEntitlementsDetails: (
    value: EmployeeEntitlementsDetailType[]
  ) => void;
  setEmployeeProfileDetails: (
    key: string,
    value: string | string[] | PositionDetailsType
  ) => void;
  reinitializeFormik: () => void;
  resetEmployeeDataChanges: () => void;
  resetEmployeeData: () => void;
  setUserRoles: (key: keyof EmployeeRoleType, value: Role | boolean) => void;
  setIsFromPeopleDirectory: (value: boolean) => void;
  setViewEmployeeId: (value: number) => void;
  setIsLeaveTabVisible: (value: boolean) => void;
  setIsTimeTabVisible: (value: boolean) => void;
  setIsReinviteConfirmationModalOpen: (value: boolean) => void;

  //projectTeamModalSlice
  setProjectTeamsModalOpen: (value: boolean) => void;
  setProjectTeamModalType: (value: ProjectTeamsModalTypes) => void;

  //projectTeamSearchSlice
  setProjectTeamSearchTerm: (value: string) => void;
  setProjectTeams: (value: TeamDetailsType[]) => void;
  setProjectTeamNames: (value: TeamNamesType[]) => void;
  setProjectTeamsAndEmployees: (value: ProjectTeamsAndEmployeesType[]) => void;
  setAddedTeams: (value: Array<{ name: string; teamId: string }>) => void;

  //terminationConfirmationModalSlice
  setTerminationConfirmationModalOpen: (value: boolean) => void;
  setSelectedEmployeeId: (value: string | number) => void;
  setAlertMessage: (value: string) => void;

  //terminationAlertModalSlice
  setTerminationAlertModalOpen: (value: boolean) => void;
}

export interface Store extends actionsTypes {
  // teamSlice
  isTeamModalOpen: boolean;
  teamModalType: TeamModelTypes;
  currentEditingTeam: TeamType | undefined;
  currentDeletingTeam: TeamType | undefined;

  // jobFamilySlice
  allJobFamilies: AllJobFamilyType[] | null;
  currentEditingJobFamily: CurrentEditingJobFamilyType | null;
  currentDeletingJobFamily: DeletingJobFamily | null;
  currentTransferMembersData: TransferMemberFormType[] | null;
  previousJobTitleData: JobTitleType | null;
  isJobFamilyModalOpen: boolean;
  jobFamilyModalType: JobFamilyActionModalEnums;

  //holidaySlice
  isBulkUpload: boolean;
  holidayDataFilter: {
    type: string[];
    color: string[];
    duration: string[];
  };
  holidayDataParams: {
    sortOrder: string;
    page?: string | number;
    isPagination?: boolean;
    holidayTypes?: string;
    colors?: string | string[];
    holidayDurations?: string;
  };
  individualDeleteId: number;
  selectedDeleteIds: number[];
  selectedYear: string;

  //holidaySlice
  newHolidayDetails: {
    holidayDate: string;
    holidayType: string;
    holidayReason: string;
    duration: HolidayDurationType;
    halfDayState: HolidayHalfDayState;
    holidayId: number;
    holidayColor: string;
  };
  failedCount: number;
  successCount: number;

  //holidayModalSlice
  isHolidayModalOpen: boolean;
  holidayModalType: holidayModalTypes;

  //addNewCalenderModalSlice
  newCalenderDetails: any;

  //employeeDataFiltersSlice
  employeeDataFilter: EmployeeDataFilterTypes;
  employeeDataFilterOrder: string[];
  employeeDataParams: EmployeeDataParamsTypes;
  menuItems: MenuitemsDataTypes[];
  searchedItems: string[];
  isPendingInvitationListOpen: boolean;

  //directoryModalSlice
  isDirectoryModalOpen: boolean;
  directoryModalType: DirectoryModalTypes;
  bulkUploadUsers: BulkEmployeeDetails[];
  sharedCredentialData: QuickAddEmployeeResponse | null;

  //employeeDetailsSlice
  employeeGeneralDetails: EmployeeGeneralDetailsTypes;
  employeeContactDetails: EmployeeContactDetailsTypes;
  employeeFamilyDetails: EmployeeFamilyDetailsTypes;
  employeeEducationalDetails: EmployeeEducationalDetailsTypes;
  employeeSocialMediaDetails: EmployeeSocialMediaDetailsTypes;
  employeeHealthAndOtherDetails: EmployeeHealthAndOtherDetailsTypes;
  employeeEmergencyContactDetails: EmployeeEmergencyDetailsTypes;
  employeeEmploymentDetails: EmployeeEmploymentDetailsTypes;
  employeeCareerDetails: EmployeeCareerDetailsTypes;
  employeeIdentificationAndDiversityDetails: EmployeeIdentificationAndDiversityDetailsTypes;
  employeePreviousEmploymentDetails: EmployeePreviousEmploymentDetailsTypes;
  employeeVisaDetails: EmployeeVisaDetailsTypes;
  employeeEntitlementsDetails: EmployeeEntitlementsDetailType[];
  employeeDataChanges: number;
  employeeProfileDetails: EmployeeProfileDetailsTypes;
  userRoles: EmployeeRoleType;
  isFromPeopleDirectory: boolean;
  isLeaveTabVisible: boolean;
  isTimeTabVisible: boolean;
  viewEmployeeId: number | null;
  isReinviteConfirmationModalOpen: boolean;

  //projectTeamModalSlice
  isProjectTeamsModalOpen: boolean;
  projectTeamModalType: ProjectTeamsModalTypes;

  //projectTeamSearchSlice
  projectTeamSearchTerm: string;
  projectTeamNames: TeamNamesType[];
  projectTeams: TeamDetailsType[];
  projectTeamsAndEmployees: ProjectTeamsAndEmployeesType[];
  addedTeams: Array<{ name: string; teamId: string }>;

  //terminationConfirmationModalSlice
  isTerminationConfirmationModalOpen: boolean;
  selectedEmployeeId: string | number;
  alertMessage: string;

  //terminationAlertModalSlice
  isTerminationAlertModalOpen: boolean;
}

import { Box, Stack, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import InputField from "~community/common/components/molecules/InputField/InputField";
import KebabMenu from "~community/common/components/molecules/KebabMenu/KebabMenu";
import PeopleSearch from "~community/common/components/molecules/PeopleSearch/PeopleSearch";
import { ZIndexEnums } from "~community/common/enums/CommonEnums";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { hasSpecialCharacter } from "~community/common/regex/regexPatterns";
import { AdminTypes } from "~community/common/types/AuthTypes";
import { IconName } from "~community/common/types/IconTypes";
import { useGetSearchedEmployees } from "~community/people/api/PeopleApi";
import { useCreateTeam, useUpdateTeam } from "~community/people/api/TeamApi";
import AddTeamMemberRow from "~community/people/components/molecules/AddTeamMemberRow/AddTeamMemberRow";
import AddTeamSelectMembers from "~community/people/components/molecules/AddTeamSelectMembers/AddTeamSelectMembers";
import { characterLengths } from "~community/people/constants/stringConstants";
import { MemberTypes } from "~community/people/enums/TeamEnums";
import { usePeopleStore } from "~community/people/store/store";
import { EmployeeType } from "~community/people/types/EmployeeTypes";
import {
  AddTeamType,
  TeamMemberTypes,
  TeamModelTypes
} from "~community/people/types/TeamTypes";
import { addEditTeamValidationSchema } from "~community/people/utils/validation";

interface Props {
  tempTeamDetails: AddTeamType | undefined;
  setTempTeamDetails: Dispatch<SetStateAction<AddTeamType | undefined>>;
  setCurrentTeamFormData: Dispatch<SetStateAction<AddTeamType | undefined>>;
  isEditingTeamChanged: boolean;
  setLatestTeamId?: Dispatch<SetStateAction<number | null | undefined>>;
}

const AddEditTeamModal = ({
  tempTeamDetails,
  setTempTeamDetails,
  setCurrentTeamFormData,
  isEditingTeamChanged,
  setLatestTeamId
}: Props) => {
  const translateText = useTranslator("peopleModule", "teams");
  const { data: session } = useSession();
  const isAdmin = session?.user?.roles?.includes(AdminTypes.PEOPLE_ADMIN);
  const {
    teamModalType,
    currentEditingTeam,
    setTeamModalType,
    setIsTeamModalOpen
  } = usePeopleStore((state) => state);

  const [isPopperOpen, setIsPopperOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchErrors, _setSearchErrors] = useState<string | undefined>(
    undefined
  );
  const [isSelectingMembers, setIsSelectingMembers] = useState<boolean>(false);
  const { toastMessage, setToastMessage } = useToast();

  const initialValues: AddTeamType = {
    teamName: "",
    teamMembers: [],
    teamSupervisors: []
  };

  const onAddSuccess = () => {
    setIsTeamModalOpen(false);
    setTeamModalType(TeamModelTypes.ADD_TEAM);
    setToastMessage({
      open: true,
      toastType: "success",
      title: translateText(["teamCreateSuccessTitle"]),
      description: translateText(["teamCreateSuccessDes"]),
      isIcon: true
    });
  };

  const onAddError = () => {
    setToastMessage({
      open: true,
      toastType: "error",
      title: translateText(["teamCreateFailTitle"]),
      description: translateText(["teamCreateFailDes"]),
      isIcon: true
    });
  };

  const onUpdateSuccess = () => {
    setIsTeamModalOpen(false);
    setTeamModalType(TeamModelTypes.EDIT_TEAM);
    setToastMessage({
      open: true,
      toastType: "success",
      title: translateText(["teamUpdateSuccessTitle"]),
      description: translateText(["teamUpdateSuccessDes"]),
      isIcon: true
    });
  };

  const onUpdateError = () => {
    setToastMessage({
      open: true,
      toastType: "error",
      title: translateText(["teamUpdateFailTitle"]),
      description: translateText(["teamUpdateFailDes"]),
      isIcon: true
    });
  };

  const {
    mutate: createTeamMutate,
    data,
    isSuccess
  } = useCreateTeam(onAddSuccess, onAddError);
  const { mutate: updateTeamMutate } = useUpdateTeam(
    onUpdateSuccess,
    onUpdateError
  );

  useEffect(() => {
    if (data && isSuccess) setLatestTeamId?.(data?.data?.results[0]?.teamId);
  }, [data, isSuccess]);

  const onSubmit = (values: typeof initialValues) => {
    if (values?.teamSupervisors?.length === 0) {
      setToastMessage({
        open: true,
        toastType: "error",
        title: translateText(["supervisorRequiredErrorTitle"]),
        description: translateText(["supervisorRequiredErrorDes"]),
        isIcon: true
      });
    } else if (teamModalType === TeamModelTypes.ADD_TEAM) {
      createTeamMutate(values);
    } else if (teamModalType === TeamModelTypes.EDIT_TEAM) {
      updateTeamMutate({
        teamId: currentEditingTeam?.teamId as number,
        ...values
      });
    }
  };

  const teamAddForm = useFormik({
    initialValues,
    validationSchema: addEditTeamValidationSchema(translateText),
    onSubmit,
    validateOnChange: false
  });

  const { values, errors, handleSubmit, setFieldValue, setFieldError } =
    teamAddForm;

  const allSelectedUsers = [
    ...(values?.teamMembers || []),
    ...(values?.teamSupervisors || [])
  ];

  const kebabMenuOptions = [
    {
      id: 1,
      text: translateText(["removeMemberLabel"]),
      onClickHandler: () => {
        setIsSelectingMembers(true);
      },
      isDisabled: allSelectedUsers?.length === 0
    }
  ];

  const onSelectUser = async (user: EmployeeType): Promise<void> => {
    if (
      !allSelectedUsers?.some(
        (selectedUser) =>
          selectedUser?.employeeId === parseInt(user?.employeeId?.toString())
      )
    )
      setFieldValue("teamMembers", [...(values?.teamMembers || []), user]);
    setIsPopperOpen(false);
    setSearchTerm("");
  };

  const setTeamMembers = (teamMembers: TeamMemberTypes) => {
    setFieldValue("teamMembers", teamMembers?.members);
    setFieldValue("teamSupervisors", teamMembers?.supervisor);
  };

  const { data: suggestions } = useGetSearchedEmployees(
    searchTerm?.length > 0 ? searchTerm : ""
  );

  const handleCancel = () => {
    if (
      teamModalType === TeamModelTypes.ADD_TEAM &&
      (allSelectedUsers?.length > 0 || values?.teamName?.length > 0)
    ) {
      setTempTeamDetails(values);
      setTeamModalType(TeamModelTypes.UNSAVED_ADD_TEAM);
    } else if (
      teamModalType === TeamModelTypes.EDIT_TEAM &&
      isEditingTeamChanged
    ) {
      setTempTeamDetails(values);
      setTeamModalType(TeamModelTypes.UNSAVED_EDIT_TEAM);
    } else {
      setIsTeamModalOpen(false);
      setTeamModalType(TeamModelTypes.ADD_TEAM);
    }
  };

  useEffect(() => {
    if (tempTeamDetails && teamModalType === TeamModelTypes.ADD_TEAM) {
      setFieldValue("teamName", tempTeamDetails?.teamName);
      setFieldValue("teamMembers", tempTeamDetails?.teamMembers);
      setFieldValue("teamSupervisors", tempTeamDetails?.teamSupervisors);
      setTempTeamDetails(undefined);
    }
  }, [setFieldValue, setTempTeamDetails, teamModalType, tempTeamDetails]);

  useEffect(() => {
    setCurrentTeamFormData(values);
  }, [setCurrentTeamFormData, values]);

  useEffect(() => {
    if (
      teamModalType === TeamModelTypes.EDIT_TEAM &&
      currentEditingTeam &&
      !tempTeamDetails
    ) {
      setFieldValue("teamName", currentEditingTeam?.teamName);
      setFieldValue("teamMembers", currentEditingTeam?.teamMembers);
      setFieldValue("teamSupervisors", currentEditingTeam?.supervisors);
    } else if (
      teamModalType === TeamModelTypes.EDIT_TEAM &&
      currentEditingTeam &&
      tempTeamDetails
    ) {
      setFieldValue("teamName", tempTeamDetails?.teamName);
      setFieldValue("teamMembers", tempTeamDetails?.teamMembers);
      setFieldValue("teamSupervisors", tempTeamDetails?.teamSupervisors);
      if (!tempTeamDetails?.teamName) {
        setFieldError("teamName", translateText(["teamNameError"]));
      }
      if (
        tempTeamDetails?.teamSupervisors?.length === 0 &&
        tempTeamDetails?.teamMembers?.length > 0
      ) {
        setToastMessage({
          open: true,
          toastType: "error",
          title: translateText(["supervisorRequiredErrorTitle"]),
          description: translateText(["supervisorRequiredErrorDes"]),
          isIcon: true
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentEditingTeam,
    handleSubmit,
    setFieldValue,
    teamModalType,
    tempTeamDetails
  ]);

  return (
    <Box
      component="div"
      sx={{
        mt: "1rem"
      }}
    >
      <InputField
        id="team-name-input"
        inputName={"teamName"}
        label={translateText(["teamNameInputLabel"])}
        error={errors.teamName}
        value={values.teamName}
        inputStyle={{ mt: "0.25rem" }}
        inputBaseStyle={{ color: "text.secondary" }}
        labelStyles={{ fontWeight: 500 }}
        onChange={(e) => {
          setFieldValue(
            "teamName",
            e.target.value?.replace(hasSpecialCharacter(), "")
          );
          setFieldError("teamName", undefined);
        }}
        required
        placeHolder={translateText(["teamNameInputPlaceholder"])}
        maxLength={characterLengths.TEAM_NAME_LENGTH}
        isDisabled={!isAdmin}
      />
      {isAdmin && (
        <PeopleSearch
          id="search-team-member-input"
          label={translateText(["addMemberInputLabel"])}
          setIsPopperOpen={setIsPopperOpen}
          isPopperOpen={isPopperOpen}
          labelStyles={{ mb: "0.25rem" }}
          componentStyles={{ my: 2 }}
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          error={searchErrors}
          onSelectMember={(result) => onSelectUser(result)}
          suggestions={suggestions as EmployeeType[]}
          selectedUsers={allSelectedUsers as EmployeeType[]}
          placeHolder={translateText(["addMemberInputPlaceholder"])}
        />
      )}
      {!isSelectingMembers && allSelectedUsers?.length > 0 && (
        <Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ mr: "1.25rem" }}
          >
            <Typography variant="body1" fontWeight={500} lineHeight="1.5rem">
              {translateText(["memberListTitle"])}
            </Typography>
            {isAdmin && (
              <Box>
                <KebabMenu
                  id="add-team-kebab-menu"
                  menuItems={kebabMenuOptions}
                  icon={<Icon name={IconName.MORE_ICON} />}
                  customStyles={{ menu: { zIndex: ZIndexEnums.MODAL } }}
                />
              </Box>
            )}
          </Stack>
          <Stack
            sx={{ mr: "1.25rem", pr: "0.125rem", mt: "0.75rem" }}
            maxHeight={"20vh"}
            overflow="auto"
            spacing="0.75rem"
          >
            <>
              {values?.teamSupervisors?.map((user: EmployeeType, index) => (
                <AddTeamMemberRow
                  id={"supervisor-".concat(index.toString())}
                  key={user?.employeeId}
                  userType={MemberTypes.SUPERVISOR}
                  employeeData={user}
                  teamMembers={{
                    supervisor: values.teamSupervisors,
                    members: values.teamMembers
                  }}
                  setTeamMembers={setTeamMembers}
                />
              ))}
              {values.teamMembers.map((user: EmployeeType, index) => (
                <AddTeamMemberRow
                  id={"member-".concat(index.toString())}
                  key={user?.employeeId}
                  userType={MemberTypes.MEMBER}
                  employeeData={user}
                  teamMembers={{
                    supervisor: values.teamSupervisors,
                    members: values.teamMembers
                  }}
                  setTeamMembers={setTeamMembers}
                />
              ))}
            </>
          </Stack>
        </Box>
      )}
      {isSelectingMembers && (
        <AddTeamSelectMembers
          allUsers={allSelectedUsers}
          teamMembers={{
            supervisor: values?.teamSupervisors,
            members: values?.teamMembers
          }}
          setIsSelectMembersOpen={setIsSelectingMembers}
          setTeamMembers={setTeamMembers}
        />
      )}
      {!isSelectingMembers && isAdmin && (
        <Box>
          <Button
            label={translateText(["saveBtnText"])}
            styles={{
              mt: "1rem"
            }}
            buttonStyle={ButtonStyle.PRIMARY}
            endIcon={<Icon name={IconName.RIGHT_ARROW_ICON} />}
            onClick={() => handleSubmit()}
          />
          <Button
            label={translateText(["cancelBtnText"])}
            styles={{
              mt: "1rem"
            }}
            buttonStyle={ButtonStyle.TERTIARY}
            endIcon={<Icon name={IconName.CLOSE_ICON} />}
            onClick={handleCancel}
          />
        </Box>
      )}
      {!isAdmin && (
        <Button
          label={translateText(["goBackBtnText"])}
          styles={{
            mt: "1rem"
          }}
          buttonStyle={ButtonStyle.TERTIARY}
          startIcon={<Icon name={IconName.LEFT_ARROW_ICON} />}
          onClick={handleCancel}
        />
      )}
    </Box>
  );
};

export default AddEditTeamModal;

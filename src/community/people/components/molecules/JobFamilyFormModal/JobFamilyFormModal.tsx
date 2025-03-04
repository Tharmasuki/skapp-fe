import { Box } from "@mui/material";
import { useFormik } from "formik";
import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import Form from "~community/common/components/molecules/Form/Form";
import InputField from "~community/common/components/molecules/InputField/InputField";
import { characterLengths } from "~community/common/constants/stringConstants";
import {
  ButtonStyle,
  ButtonTypes
} from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { AdminTypes } from "~community/common/types/AuthTypes";
import { IconName } from "~community/common/types/IconTypes";
import JobTitleField from "~community/people/components/molecules/JobTitleField/JobTitleField";
import { JobFamilyActionModalEnums } from "~community/people/enums/JobFamilyEnums";
import { usePeopleStore } from "~community/people/store/store";
import { AddJobFamilyFormType } from "~community/people/types/JobFamilyTypes";
import { sortJobTitlesArrayInAscendingOrder } from "~community/people/utils/jobFamilyUtils/commonUtils";
import { handleJobFamilyNameInputChange } from "~community/people/utils/jobFamilyUtils/jobFamilyUtils";
import { handleJobFamilyCloseModal } from "~community/people/utils/jobFamilyUtils/modalControllerUtils";
import { addEditJobFamilyValidationSchema } from "~community/people/utils/validation";

interface Props {
  hasDataChanged: boolean;
  onSubmit: (values: AddJobFamilyFormType) => void;
}

const JobFamilyFormModal = ({ hasDataChanged, onSubmit }: Props) => {
  const translateText = useTranslator("peopleModule", "jobFamily");

  const { data: session } = useSession();

  const isAdmin = session?.user?.roles?.includes(AdminTypes.PEOPLE_ADMIN);

  const {
    allJobFamilies,
    jobFamilyModalType,
    currentEditingJobFamily,
    setJobFamilyModalType,
    setCurrentEditingJobFamily
  } = usePeopleStore((state) => state);

  const initialValues: AddJobFamilyFormType = {
    jobFamilyId: currentEditingJobFamily?.jobFamilyId ?? 0,
    name: currentEditingJobFamily?.name ?? "",
    jobTitleInput: "",
    jobTitles: currentEditingJobFamily?.jobTitles ?? []
  };

  const formik = useFormik({
    initialValues,
    onSubmit: onSubmit,
    validateOnChange: true,
    validationSchema: addEditJobFamilyValidationSchema(
      allJobFamilies ?? [],
      translateText
    )
  });

  const { values, errors, handleSubmit, setFieldValue, setFieldError } = formik;

  const isSaveBtnDisabled = useMemo(() => {
    if (jobFamilyModalType === JobFamilyActionModalEnums.EDIT_JOB_FAMILY) {
      return (
        !!errors.name ||
        !!errors.jobTitleInput ||
        !!errors.jobTitles ||
        !hasDataChanged
      );
    } else {
      return false;
    }
  }, [
    errors.jobTitleInput,
    errors.jobTitles,
    errors.name,
    hasDataChanged,
    jobFamilyModalType
  ]);

  useEffect(() => {
    const sortedJobTitles = sortJobTitlesArrayInAscendingOrder(
      values.jobTitles
    );

    setCurrentEditingJobFamily({
      jobFamilyId: values.jobFamilyId,
      name: values.name.trim(),
      jobTitles: sortedJobTitles
    });
  }, [setCurrentEditingJobFamily, values]);

  return (
    <Form onSubmit={handleSubmit}>
      <Box component="div">
        <InputField
          id="job-family-name-input"
          inputName="name"
          label={translateText(["jobFamilyInputField.label"])}
          placeHolder={translateText(["jobFamilyInputField.placeholder"])}
          error={errors.name}
          value={values.name}
          onChange={(event) =>
            handleJobFamilyNameInputChange(event, setFieldValue, setFieldError)
          }
          required
          maxLength={characterLengths.JOB_FAMILY_LENGTH}
          isDisabled={!isAdmin}
        />
        <JobTitleField formik={formik} isAdmin={isAdmin} />
        {!isAdmin ? (
          <Button
            label={translateText(["goBackBtnText"])}
            styles={{ mt: "1rem" }}
            buttonStyle={ButtonStyle.TERTIARY}
            startIcon={IconName.LEFT_ARROW_ICON}
            onClick={() =>
              handleJobFamilyCloseModal(
                hasDataChanged,
                jobFamilyModalType,
                setJobFamilyModalType
              )
            }
          />
        ) : (
          <>
            <Button
              type={ButtonTypes.SUBMIT}
              label={translateText(["saveBtnText"])}
              styles={{ mt: "1rem" }}
              disabled={isSaveBtnDisabled}
              buttonStyle={ButtonStyle.PRIMARY}
              endIcon={IconName.RIGHT_ARROW_ICON}
            />
            <Button
              label={translateText(["cancelBtnText"])}
              styles={{ mt: "1rem" }}
              buttonStyle={ButtonStyle.TERTIARY}
              endIcon={IconName.CLOSE_ICON}
              onClick={() =>
                handleJobFamilyCloseModal(
                  hasDataChanged,
                  jobFamilyModalType,
                  setJobFamilyModalType
                )
              }
            />
          </>
        )}
      </Box>
    </Form>
  );
};

export default JobFamilyFormModal;

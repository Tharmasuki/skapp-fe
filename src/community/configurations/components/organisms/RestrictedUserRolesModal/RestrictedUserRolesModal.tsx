import { Box, Stack, Typography } from "@mui/material";
import { useFormik } from "formik";

import Button from "~community/common/components/atoms/Button/Button";
import Checkbox from "~community/common/components/atoms/Checkbox/Checkbox";
import Tooltip from "~community/common/components/atoms/Tooltip/Tooltip";
import Modal from "~community/common/components/organisms/Modal/Modal";
import { Modules } from "~community/common/enums/CommonEnums";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { IconName } from "~community/common/types/IconTypes";
import { useUpdateUserRoleRestrictions } from "~community/configurations/api/userRolesApi";
import { useConfigurationStore } from "~community/configurations/stores/configurationStore";
import { UserRoleRestrictionsType } from "~community/configurations/types/UserRolesTypes";

import styles from "./styles";

interface Props {
  initialData: UserRoleRestrictionsType | undefined;
}

const RestrictedUserRolesModal = ({ initialData }: Props) => {
  const classes = styles();

  const translateText = useTranslator("configurations", "userRoles");

  const { setToastMessage } = useToast();

  const {
    moduleType,
    isUserRoleModalOpen,
    setIsUserRoleModalOpen,
    setModuleType
  } = useConfigurationStore();

  const onSuccess = () => {
    setToastMessage({
      open: true,
      toastType: "success",
      title: translateText(["successToastTitle"]),
      description: translateText(["successToastDescription"])
    });
    handleCancelBtnClick();
  };

  const onError = () => {
    setToastMessage({
      open: true,
      toastType: "error",
      title: translateText(["errorToastTitle"]),
      description: translateText(["errorToastDescription"])
    });
  };

  const { mutate: updateUserRoleRestrictions } = useUpdateUserRoleRestrictions(
    onSuccess,
    onError
  );

  const handleCancelBtnClick = () => {
    setIsUserRoleModalOpen(false);
    setModuleType(Modules.NONE);
  };

  const handleSubmit = () => {
    const payload = {
      module: moduleType,
      isAdmin: values.isAdmin,
      isManager: values.isManager
    };

    updateUserRoleRestrictions(payload);
  };

  const { values, setFieldValue } = useFormik({
    initialValues: {
      isAdmin: initialData !== undefined ? initialData?.isAdmin : false,
      isManager: initialData !== undefined ? initialData?.isManager : false
    },
    onSubmit: handleSubmit
  });

  return (
    <Modal
      isModalOpen={isUserRoleModalOpen}
      onCloseModal={handleCancelBtnClick}
      title={translateText(["restrictedUserRolesTitle"])}
      isClosable={true}
    >
      <Stack sx={classes.wrapper}>
        <Stack sx={classes.description}>
          <Typography sx={classes.text}>
            {translateText(["restrictedUserRolesDescriptionPartOne"])}
            <b>{translateText(["restrictedUserRolesDescriptionPartTwo"])}</b>
            {translateText(["restrictedUserRolesDescriptionPartThree"])}
          </Typography>
          <Box sx={classes.tooltipWrapper}>
            <Tooltip title={translateText(["restrictedUserRolesTooltip"])} />
          </Box>
        </Stack>
        <Stack sx={classes.fieldWrapper}>
          <Checkbox
            label="Admin"
            name="isAdmin"
            checked={values.isAdmin}
            onChange={() => setFieldValue("isAdmin", !values.isAdmin)}
          />
          <Checkbox
            label="Manager"
            name="isManager"
            checked={values.isManager}
            onChange={() => setFieldValue("isManager", !values.isManager)}
          />
        </Stack>
        <Button
          label={translateText(["saveBtnText"])}
          buttonStyle={ButtonStyle.PRIMARY}
          endIcon={IconName.RIGHT_ARROW_ICON}
          onClick={handleSubmit}
        />
        <Button
          label={translateText(["cancelBtnText"])}
          buttonStyle={ButtonStyle.TERTIARY}
          endIcon={IconName.CLOSE_ICON}
          onClick={handleCancelBtnClick}
        />
      </Stack>
    </Modal>
  );
};

export default RestrictedUserRolesModal;

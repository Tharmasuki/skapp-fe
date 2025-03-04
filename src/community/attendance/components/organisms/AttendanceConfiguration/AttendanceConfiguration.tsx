import { Close } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import { ChangeEvent, JSX, useEffect, useState } from "react";

import {
  useGetAttendanceConfiguration,
  useUpdateAttendanceConfiguration
} from "~community/attendance/api/AttendanceAdminApi";
import { AttendanceConfigurationType } from "~community/attendance/types/attendanceTypes";
import Button from "~community/common/components/atoms/Button/Button";
import SwitchRow from "~community/common/components/atoms/SwitchRow/SwitchRow";
import ToastMessage from "~community/common/components/molecules/ToastMessage/ToastMessage";
import { ButtonStyle, ToastType } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { IconName } from "~community/common/types/IconTypes";

import styles from "./styles";

const AttendanceConfiguration = (): JSX.Element => {
  const classes = styles();
  const [config, setConfig] = useState<AttendanceConfigurationType | null>(
    null
  );
  const [initialConfig, setInitialConfig] =
    useState<AttendanceConfigurationType | null>(null);

  const { data: configData } = useGetAttendanceConfiguration();
  const onSuccess = () => {
    setToastMessage({
      open: true,
      toastType: ToastType.SUCCESS,
      title: attendanceConfigurations(["updateSuccessMessageTitle"]),
      description: attendanceConfigurations(["updateSuccessMessage"])
    });
  };

  const onError = () => {
    setToastMessage({
      open: true,
      toastType: ToastType.ERROR,
      title: attendanceConfigurations(["updateErrorMessageTitle"]),
      description: attendanceConfigurations(["updateErrorMessage"])
    });
  };
  const { mutate: updateConfig, isPending: isSaving } =
    useUpdateAttendanceConfiguration(onSuccess, onError);
  const { toastMessage, setToastMessage } = useToast();

  const attendanceConfigurations = useTranslator(
    "attendanceModule",
    "attendanceConfiguration"
  );

  useEffect(() => {
    if (configData) {
      setConfig(configData);
      setInitialConfig(configData);
    }
  }, [configData]);

  const handleSwitchChange = (
    key: keyof AttendanceConfigurationType,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setConfig((prevConfig) =>
      prevConfig ? { ...prevConfig, [key]: event.target.checked } : prevConfig
    );
  };

  const handleSaveBtnClick = () => {
    if (config) {
      updateConfig(config);
    }
  };

  const handleCancelBtnClick = () => {
    setConfig(initialConfig);
  };

  const isFormChanged = () => {
    return JSON.stringify(config) !== JSON.stringify(initialConfig);
  };

  return (
    <>
      <Box>
        <Typography variant="h2" sx={classes.sectionTitle}>
          {attendanceConfigurations(["clockInSettingsTitle"]) ?? ""}
        </Typography>
        <Typography sx={classes.sectionDescription}>
          {attendanceConfigurations(["clockInSettingsDescription"]) ?? ""}
        </Typography>

        <Box sx={classes.container}>
          {config && (
            <>
              <SwitchRow
                label={
                  attendanceConfigurations(["isClockInOnNonWorkingDays"]) ?? ""
                }
                wrapperStyles={classes.switchWrapper}
                checked={config.isClockInOnNonWorkingDays}
                onChange={(checked) =>
                  handleSwitchChange("isClockInOnNonWorkingDays", checked)
                }
              />
              <SwitchRow
                label={attendanceConfigurations(["clockInOnHolidays"]) ?? ""}
                checked={config.isClockInOnCompanyHolidays}
                wrapperStyles={classes.switchWrapper}
                onChange={(checked) =>
                  handleSwitchChange("isClockInOnCompanyHolidays", checked)
                }
              />
              <SwitchRow
                label={attendanceConfigurations(["clockInOnLeaveDays"]) ?? ""}
                checked={config.isClockInOnLeaveDays}
                wrapperStyles={classes.switchWrapper}
                onChange={(checked) =>
                  handleSwitchChange("isClockInOnLeaveDays", checked)
                }
              />
            </>
          )}
        </Box>

        <Typography variant="h2" sx={classes.sectionTitle}>
          {attendanceConfigurations(["timesheetSettingsTitle"]) ?? ""}
        </Typography>
        <Typography sx={classes.sectionDescription}>
          {attendanceConfigurations(["timesheetSettingsDescription"]) ?? ""}
        </Typography>

        <Box sx={classes.container}>
          {config && (
            <SwitchRow
              label={
                attendanceConfigurations(["isAutoApprovalForChanges"]) ?? ""
              }
              checked={config.isAutoApprovalForChanges}
              wrapperStyles={classes.switchWrapper}
              onChange={(checked) =>
                handleSwitchChange("isAutoApprovalForChanges", checked)
              }
            />
          )}
        </Box>

        <Stack direction="row" gap="0.75rem" sx={classes.buttonGroup}>
          <Button
            id="reset-button"
            label={attendanceConfigurations(["cancelButtonText"]) ?? ""}
            buttonStyle={ButtonStyle.TERTIARY}
            styles={classes.buttonStyles}
            onClick={handleCancelBtnClick}
            endIcon={<Close />}
            disabled={!isFormChanged()}
          />

          <Button
            id="save-changes-button"
            label={attendanceConfigurations(["saveButtonText"]) ?? ""}
            buttonStyle={ButtonStyle.PRIMARY}
            styles={classes.saveButtonStyles}
            onClick={handleSaveBtnClick}
            disabled={isSaving || !isFormChanged()}
            endIcon={IconName.RIGHT_ARROW_ICON}
          />
        </Stack>
        <ToastMessage
          {...toastMessage}
          open={toastMessage.open}
          onClose={() => {
            setToastMessage((state) => ({ ...state, open: false }));
          }}
        />
      </Box>
    </>
  );
};

export default AttendanceConfiguration;

import { Avatar, SxProps, Theme, useTheme } from "@mui/material";
import { FC, useEffect, useState } from "react";

import { useGetUploadedImage } from "~community/common/api/FileHandleApi";
import { FileTypes } from "~community/common/enums/CommonEnums";
import { LeaveStates } from "~community/common/types/CommonTypes";
import { mergeSx } from "~community/common/utils/commonUtil";

import DefaultAvatar from "../../atoms/DefaultAvatar/DefaultAvatar";
import styles from "./styles";

interface Props {
  index: number;
  firstName: string | undefined;
  lastName: string | undefined;
  image: string | null;
  hasStyledBadge: boolean;
  leaveState: LeaveStates | undefined;
  avatarStyles?: SxProps<Theme>;
}
const AvatarGroupAvatar: FC<Props> = ({
  index,
  firstName,
  lastName,
  image,
  hasStyledBadge,
  leaveState,
  avatarStyles
}) => {
  const theme: Theme = useTheme();
  const classes = styles(theme);

  const [profileImage, setProfileImage] = useState<string | null>(null);

  const { data: logoUrl } = useGetUploadedImage(
    FileTypes.USER_IMAGE,
    image,
    true
  );

  useEffect(() => {
    if (logoUrl) setProfileImage(logoUrl);
    else if (image) setProfileImage(image);
  }, [logoUrl, image]);
  return (
    <Avatar
      key={index.toString()}
      data-cy="avatar"
      alt={`${firstName} ${lastName}`}
      src={profileImage ?? ""}
      sx={mergeSx([
        classes.avatar,
        hasStyledBadge || leaveState === LeaveStates.FULL_DAY
          ? classes.avatarHasStyledBadge
          : {},
        leaveState === LeaveStates.MORNING ? classes.morningHalfDay : {},
        leaveState === LeaveStates.EVENING ? classes.eveningHalfDay : {},
        avatarStyles
      ])}
    >
      {!image && (
        <DefaultAvatar
          firstName={firstName ?? ""}
          lastName={lastName ?? ""}
          containerStyles={{
            ...classes.defaultAvatar,
            ...(hasStyledBadge ? classes.defaultAvatarHasStyledBadge : {})
          }}
          typographyStyles={classes.defaultAvatarTypography}
        />
      )}
    </Avatar>
  );
};

export default AvatarGroupAvatar;

import UserPromptModal from "~community/common/components/molecules/UserPromptModal/UserPromptModal";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";

interface Props {
  onPrimaryBtnClick: () => void;
  onSecondaryBtnClick: () => void;
}

const AreYouSureModal = ({ onPrimaryBtnClick, onSecondaryBtnClick }: Props) => {
  const translateText = useTranslator(
    "commonComponents",
    "userPromptModal",
    "unsavedChangesModal"
  );

  return (
    <UserPromptModal
      description={translateText(["description"])}
      primaryBtn={{
        label: translateText(["resumeTaskBtn"]),
        onClick: onPrimaryBtnClick,
        endIcon: IconName.RIGHT_ARROW_ICON
      }}
      secondaryBtn={{
        label: translateText(["leaveAnywayBtn"]),
        onClick: onSecondaryBtnClick,
        endIcon: IconName.CLOSE_ICON,
        buttonStyle: ButtonStyle.ERROR
      }}
    />
  );
};

export default AreYouSureModal;

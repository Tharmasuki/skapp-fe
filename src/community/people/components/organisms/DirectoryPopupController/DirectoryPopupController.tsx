import { Fragment, useState } from "react";

import ModalController from "~community/common/components/organisms/ModalController/ModalController";
import { BulkSummaryFlows } from "~community/common/constants/stringConstants";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { BulkUploadResponse } from "~community/common/types/BulkUploadTypes";
import { useGetAllJobFamilies } from "~community/people/api/JobFamilyApi";
import AddNewResourceModal from "~community/people/components/molecules/AddNewResourceModal/AddNewResourceModal";
import LoginCredentialsModal from "~community/people/components/molecules/LoginCredentialsModal/LoginCredentialsModal";
import BulkUploadSummary from "~community/people/components/molecules/UserBulkUploadModals/BulkUploadSummary";
import UserBulkCsvDownload from "~community/people/components/molecules/UserBulkUploadModals/UserBulkCsvDownload";
import UserBulkCsvUpload from "~community/people/components/molecules/UserBulkUploadModals/UserBulkCsvUpload";
import { usePeopleStore } from "~community/people/store/store";
import { DirectoryModalTypes } from "~community/people/types/ModalTypes";

const DirectoryPopupController = () => {
  const translatedTexts = useTranslator("peopleModule", "peoples");

  const {
    directoryModalType,
    isDirectoryModalOpen,
    setDirectoryModalType,
    setBulkUploadUsers
  } = usePeopleStore((state) => state);

  const { data: jobFamilies } = useGetAllJobFamilies();
  const [bulkUploadData, setBulkUploadData] = useState<BulkUploadResponse>();

  const getModalTitle = (): string => {
    switch (directoryModalType) {
      case DirectoryModalTypes.DOWNLOAD_CSV:
        return translatedTexts(["uploadCsvModalTitle"]);
      case DirectoryModalTypes.UPLOAD_CSV:
        return translatedTexts(["uploadCsvModalTitle"]);
      case DirectoryModalTypes.UPLOAD_SUMMARY:
        return translatedTexts(["uploadSummeryModalTitle"]);
      case DirectoryModalTypes.ADD_NEW_RESOURCE:
        return "Add people";
      case DirectoryModalTypes.UPLOAD_TYPE_SELECT:
        return translatedTexts(["uploadTypeSelectorModalTitle"]);
      case DirectoryModalTypes.USER_CREDENTIALS:
        return translatedTexts(["shareCredentials"]);
      default:
        return "";
    }
  };

  const handleCloseModal = (): void => {
    setBulkUploadUsers([]);
  };

  return (
    <ModalController
      isModalOpen={isDirectoryModalOpen}
      handleCloseModal={handleCloseModal}
      modalTitle={getModalTitle()}
      setModalType={setDirectoryModalType}
    >
      <Fragment>
        {directoryModalType === DirectoryModalTypes.DOWNLOAD_CSV && (
          <UserBulkCsvDownload />
        )}
        {directoryModalType === DirectoryModalTypes.UPLOAD_CSV && (
          <UserBulkCsvUpload
            jobRoleList={jobFamilies}
            setBulkUploadData={setBulkUploadData}
            setPopupType={setDirectoryModalType}
          />
        )}
        {bulkUploadData &&
          directoryModalType === DirectoryModalTypes.UPLOAD_SUMMARY &&
          bulkUploadData?.bulkStatusSummary?.failedCount > 0 && (
            <BulkUploadSummary
              setPopupType={setDirectoryModalType}
              data={bulkUploadData}
              flow={BulkSummaryFlows.USER_BULK_UPLOAD}
            />
          )}
        {directoryModalType === DirectoryModalTypes.ADD_NEW_RESOURCE && (
          <AddNewResourceModal />
        )}
        {directoryModalType === DirectoryModalTypes.USER_CREDENTIALS && (
          <LoginCredentialsModal />
        )}
      </Fragment>
    </ModalController>
  );
};

export default DirectoryPopupController;

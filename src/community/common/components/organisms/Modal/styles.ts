import { ZIndexEnums } from "~community/common/enums/CommonEnums";

const styles = () => ({
  modalWrapper: {
    zIndex: ZIndexEnums.MODAL,
    width: { xs: "100%", sm: "60%" },
    marginInline: "auto"
  },
  modelContentWrapper: {
    display: "flex",
    flexDirection: "column",
    maxWidth: { xs: "calc(100dvw - 1.25rem)", sm: "34.5625rem" },
    height: "max-content",
    maxHeight: { xs: "95dvh" },
    padding: "1.5rem",
    backgroundColor: "common.white",
    borderRadius: "1.5rem",
    position: "relative",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    boxShadow: 24,
    outline: 0
  },
  modalHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: "1rem"
  },
  modalHeaderIconContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "1rem"
  },
  modalHeaderTitle: {
    fontWeight: "700",
    fontSize: "1.5rem",
    color: "common.black"
  },
  titleIcon: { marginBottom: "0.1875rem" },
  closeIconBtn: {
    padding: "0rem"
  },
  childrenWrapper: {
    marginTop: "1rem",
    overflow: "auto"
  }
});

export default styles;

import { createElement } from "react";
import toast from "react-hot-toast";
import { AppToast } from "../components/ui/AppToast";

const defaultOptions = {
  position: "top-center",
  duration: 3200,
};

function notify(variant, message, options = {}) {
  const isLoading = variant === "loading";

  return toast.custom(
    (t) => createElement(AppToast, { t, variant, message }),
    {
      ...defaultOptions,
      duration: isLoading ? Infinity : defaultOptions.duration,
      ...options,
    }
  );
}

export const showSuccess = (message, options = {}) => notify("success", message, options);

export const showError = (message, options = {}) => notify("error", message, options);

export const showLoading = (message, options = {}) => notify("loading", message, options);

export const showWarning = (message, options = {}) => notify("warning", message, options);

export const showInfo = (message, options = {}) => notify("info", message, options);

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

export const dismissAllToasts = () => {
  toast.dismiss();
};

export const showCustomToast = (message, _style = {}, options = {}) =>
  notify("info", message, options);

export const showHighlightAdded = (isCertificate = false) =>
  showSuccess(isCertificate ? "Cert added" : "Bullet added", { duration: 1500 });

export const showSaveLoading = () => showLoading("Saving...", { duration: 800 });

export const showSaveSuccess = () => showSuccess("Saved", { duration: 2000 });

export const showSaveError = () => showError("Couldn't save", { duration: 3000 });

export const showDownloadLoading = () => showLoading("Preparing export...", { duration: 1000 });

export const showDownloadSuccess = () => showSuccess("Ready to download", { duration: 2000 });

export const showDownloadError = () => showError("Export failed", { duration: 3000 });

export const showFileUploadSuccess = () => showSuccess("Uploaded", { duration: 2000 });

export const showFileUploadError = (message = "Upload failed") =>
  showError(message, { duration: 3000 });

export const showFileDeleteSuccess = () => showSuccess("Removed", { duration: 2000 });

export const showFileDeleteError = () => showError("Couldn't delete", { duration: 3000 });

export const showValidationError = (message) => showError(message, { duration: 3000 });

export const showNetworkError = () => showError("You're offline", { duration: 4000 });

export const showNetworkRetry = () => showError("Wait 10 sec, then retry", { duration: 3000 });

export const showAIProcessingError = () => showError("Tailoring failed", { duration: 3000 });

export const showFormCleared = () => showSuccess("Cleared", { duration: 2000 });

export const showExperienceAdded = () => showSuccess("Role added", { duration: 1500 });
export const showExperienceDeleted = () => showSuccess("Role removed", { duration: 2000 });

export const showEducationAdded = () => showSuccess("Education added", { duration: 1500 });
export const showEducationDeleted = () => showSuccess("Education removed", { duration: 2000 });

export const showProjectAdded = () => showSuccess("Project added", { duration: 1500 });
export const showProjectDeleted = () => showSuccess("Project removed", { duration: 2000 });

export const showHighlightError = () => showError("Type something first", { duration: 2000 });

export default toast;

import Swal from 'sweetalert2';

const baseOptions = {
  buttonsStyling: false,
  customClass: {
    confirmButton: 'mui-button mui-button-primary',
    cancelButton: 'mui-button mui-button-secondary',
  },
};

/**
 * Important confirmations only — use snackbar for routine feedback.
 * @param {import('sweetalert2').SweetAlertOptions} options
 */
export function confirmAction(options) {
  return Swal.fire({
    ...baseOptions,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    focusCancel: true,
    ...options,
  });
}

import Swal from 'sweetalert2';
import { confirmAction } from './confirmDialog.js';

/**
 * Confirm offer activation; optionally verify effective pricing on the backend.
 * @param {{ productId: string, channelId: string, channelLabel?: string }} context
 * @returns {Promise<{ confirmed: boolean, body?: { resolvePricing?: boolean, currency?: string } }>}
 */
export async function confirmOfferActivation(context) {
  const channelPart = context.channelLabel ? ` on ${context.channelLabel}` : '';
  const choice = await Swal.fire({
    icon: 'question',
    title: 'Activate offer?',
    text: `Activate offer for product ${context.productId}${channelPart}?`,
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: 'Activate',
    denyButtonText: 'Activate with pricing check',
    cancelButtonText: 'Cancel',
    buttonsStyling: false,
    customClass: {
      confirmButton: 'mui-button mui-button-primary',
      denyButton: 'mui-button mui-button-secondary',
      cancelButton: 'mui-button mui-button-secondary',
    },
    focusCancel: true,
  });

  if (choice.isConfirmed) {
    return { confirmed: true, body: {} };
  }

  if (choice.isDenied) {
    const currencyResult = await Swal.fire({
      icon: 'info',
      title: 'Pricing verification',
      input: 'text',
      inputLabel: 'Currency (3-letter ISO code)',
      inputPlaceholder: 'e.g. USD',
      inputAttributes: { maxlength: '3', autocapitalize: 'characters' },
      showCancelButton: true,
      confirmButtonText: 'Activate',
      cancelButtonText: 'Cancel',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'mui-button mui-button-primary',
        cancelButton: 'mui-button mui-button-secondary',
      },
      preConfirm: (value) => {
        const trimmed = (value ?? '').trim().toUpperCase();
        if (!/^[A-Z]{3}$/.test(trimmed)) {
          Swal.showValidationMessage('Enter a valid 3-letter currency code.');
          return false;
        }
        return trimmed;
      },
    });
    if (!currencyResult.isConfirmed || !currencyResult.value) {
      return { confirmed: false };
    }
    return {
      confirmed: true,
      body: { resolvePricing: true, currency: currencyResult.value },
    };
  }

  return { confirmed: false };
}

/**
 * @param {import('../services/api/offersService.js').Offer} offer
 * @param {string} [channelLabel]
 */
export async function confirmOfferDeactivation(offer, channelLabel) {
  const channelPart = channelLabel ? ` / ${channelLabel}` : '';
  return confirmAction({
    title: 'Deactivate offer?',
    text: `Product ${offer.productId}${channelPart} — this offer will become inactive and cannot be edited.`,
    confirmButtonText: 'Deactivate',
  });
}

/**
 * @param {import('../services/api/offersService.js').Offer} offer
 * @param {string} [channelLabel]
 */
export async function confirmOfferSuspend(offer, channelLabel) {
  const channelPart = channelLabel ? ` / ${channelLabel}` : '';
  return confirmAction({
    title: 'Suspend offer?',
    text: `Suspend active offer for product ${offer.productId}${channelPart}?`,
    confirmButtonText: 'Suspend',
  });
}

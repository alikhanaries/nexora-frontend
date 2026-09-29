import { useMutation } from '@tanstack/react-query';
import { mfaService } from '../../services/api/mfaService.js';

export function useStartTotpEnrollment() {
  return useMutation({
    mutationFn: (body) => mfaService.startTotpEnrollment(body),
  });
}

export function useVerifyTotpEnrollment() {
  return useMutation({
    mutationFn: (body) => mfaService.verifyTotpEnrollment(body),
  });
}

export function useActivateTotpFactor() {
  return useMutation({
    mutationFn: (body) => mfaService.activateTotpFactor(body),
  });
}

export function useVerifyMfaStepUp() {
  return useMutation({
    mutationFn: (body) => mfaService.verifyMfaStepUp(body),
  });
}

export function useRecoveryCodeStepUp() {
  return useMutation({
    mutationFn: (body) => mfaService.useRecoveryCodeStepUp(body),
  });
}

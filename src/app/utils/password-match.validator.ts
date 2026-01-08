import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordMatchValidator(
  passwordKey = 'password',
  confirmPasswordKey = 'confirmPassword'
) {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordKey)?.value;
    const confirm = group.get(confirmPasswordKey)?.value;

    if (!password || !confirm) return null;
    return password === confirm ? null : { passwordMismatch: true };
  };
}

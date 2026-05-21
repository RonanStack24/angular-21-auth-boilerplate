import { AbstractControl } from '@angular/forms';

// custom validator to check that two fields match
export function MustMatch(controlName: string, matchingControlName: string) {
    return (group: AbstractControl) => {
        const control = group.get(controlName);
        const matchingControl = group.get(matchingControlName);

        if (!control || !matchingControl) {
            return null;
        }

        // return if another validator has already found an error on the matchingControl
        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            return null;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ ...(matchingControl.errors || {}), mustMatch: true });
        } else {
            const errors = { ...(matchingControl.errors || {}) };
            delete errors.mustMatch;
            matchingControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
        }

        return null;
    }
}
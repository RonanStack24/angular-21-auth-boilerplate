import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { MustMatch } from '@app/_helpers';

enum TokenStatus {
    Validating,
    Valid,
    Invalid
}

@Component({ templateUrl: 'reset-password.component.html', standalone: false })
export class ResetPasswordComponent implements OnInit {
    TokenStatus = TokenStatus;
    tokenStatus: TokenStatus = TokenStatus.Validating;
    token?: string;
    form!: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        console.log('ResetPasswordComponent: ngOnInit called.');
        this.form = this.formBuilder.group({
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required],
        }, {
            validators: MustMatch('password', 'confirmPassword')
        });

        this.route.queryParams
            .subscribe(params => {
                const token = params['token'];
                console.log('ResetPasswordComponent: Query parameters received:', params);

                // If already successfully validated, do not run validation logic again when the URL gets cleared
                if (this.tokenStatus === TokenStatus.Valid) {
                    console.log('ResetPasswordComponent: Token already successfully validated, ignoring URL change.');
                    return;
                }

                if (!token) {
                    console.warn('ResetPasswordComponent: No reset token found in the URL query parameters.');
                    this.tokenStatus = TokenStatus.Invalid;
                    this.cdr.detectChanges();
                    return;
                }

                console.log('ResetPasswordComponent: Found token in URL, calling validateResetToken API...');
                this.tokenStatus = TokenStatus.Validating;
                this.cdr.detectChanges();

                this.accountService.validateResetToken(token)
                    .pipe(first())
                    .subscribe({
                        next: () => {
                            console.log('ResetPasswordComponent: Token validation API returned SUCCESS.');
                            this.token = token;
                            this.tokenStatus = TokenStatus.Valid;
                            this.cdr.detectChanges();
                            // remove token from url to prevent http referer leakage only after successful validation
                            console.log('ResetPasswordComponent: Clearing token from URL to prevent referer leakage...');
                            this.router.navigate([], { relativeTo: this.route, replaceUrl: true })
                                .then(() => console.log('ResetPasswordComponent: URL cleared successfully.'))
                                .catch(err => console.error('ResetPasswordComponent: Error clearing URL:', err));
                        },
                        error: (error) => {
                            console.error('ResetPasswordComponent: Token validation API returned ERROR:', error);
                            this.tokenStatus = TokenStatus.Invalid;
                            this.cdr.detectChanges();
                        }
                    });
            });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.accountService.resetPassword(this.token!, this.f.password.value, this.f.confirmPassword.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Password reset successful, you can now login', { keepAfterRouteChange: true });
                    this.router.navigate(['../login'], { relativeTo: this.route }).catch(() => {});
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
}
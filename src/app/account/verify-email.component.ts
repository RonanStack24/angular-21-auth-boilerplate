import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: './verify-email.component.html', standalone: false })
export class VerifyEmailComponent implements OnInit {
    status = 'verifying';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        try {
            const token = this.route.snapshot.queryParams['token'];
            console.log('VerifyEmailComponent: Initializing with token:', token);

            if (!token) {
                console.log('VerifyEmailComponent: No token, redirecting to login');
                this.router.navigate(['../login'], { relativeTo: this.route });
                return;
            }

            this.accountService.verifyEmail(token)
                .pipe(first())
                .subscribe({
                    next: () => {
                        console.log('VerifyEmailComponent: Success');
                        this.alertService.success('Verification successful, you can now login', { keepAfterRouteChange: true });
                        this.router.navigate(['../login'], { relativeTo: this.route });
                    },
                    error: (error) => {
                        console.error('VerifyEmailComponent: API Error:', error);
                        this.status = 'failed';
                    }
                });
        } catch (e) {
            console.error('VerifyEmailComponent: Critical error in ngOnInit:', e);
            this.status = 'failed';
        }
    }
}
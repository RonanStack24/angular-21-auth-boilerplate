import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

enum EmailStatus {
    Verifying,
    Failed
}

@Component({ templateUrl: 'verify-email.component.html', standalone: false })
export class VerifyEmailComponent implements OnInit {
    EmailStatus = EmailStatus;
    emailStatus = EmailStatus.Verifying;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        const token = this.route.snapshot.queryParams['token'];
        console.log(`VerifyEmailComponent initialized with token: ${token}`);

        if (!token) {
            console.error('No token found in query params, redirecting to login');
            this.router.navigate(['../login'], { relativeTo: this.route });
            return;
        }

        // remove token from url to prevent http referer leakage
        this.router.navigate([], { relativeTo: this.route, replaceUrl: true });

        this.accountService.verifyEmail(token)
            .pipe(first())
            .subscribe({
                next: () => {
                    console.log('Verification successful');
                    this.alertService.success('Verification successful, you can now login', { keepAfterRouteChange: true });
                    this.router.navigate(['../login'], { relativeTo: this.route });
                },
                error: (error) => {
                    console.error('Verification failed', error);
                    this.emailStatus = EmailStatus.Failed;
                }
            });
    }
}
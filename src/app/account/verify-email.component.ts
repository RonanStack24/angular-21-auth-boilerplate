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
        const token = this.route.snapshot.queryParams['token'];

        console.log('VerifyEmailComponent initialized with token:', token);

        if (!token) {
            console.log('No token found, redirecting to login');
            this.router.navigate(['../login'], { relativeTo: this.route });
            return;
        }

        this.accountService.verifyEmail(token)
            .pipe(first())
            .subscribe({
                next: () => {
                    console.log('Email verification successful');
                    this.alertService.success('Verification successful, you can now login', { keepAfterRouteChange: true });
                    this.router.navigate(['../login'], { relativeTo: this.route });
                },
                error: (error) => {
                    console.error('Email verification failed:', error);
                    this.status = 'failed';
                }
            });
    }
}
import { of } from 'rxjs';
import { AccountService } from '@app/_services';

export function appInitializer(accountService: AccountService) {
    return () => of(null);
}
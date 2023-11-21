import { Doc, Rspn } from '../shared/models/response.model';
import { from, Observable, of } from 'rxjs';
import { map, toArray, delay } from 'rxjs/operators';

export function validate<T>(rspn: Rspn<T>): T {
    if (rspn.success) {
        return rspn.data;
    } else {
        throw new Error(rspn.error);
    }
}

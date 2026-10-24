import { InjectionToken } from '@angular/core';

export interface GoodRequiredControl { setFieldRequired(required: boolean): void; }
export const GOOD_DATE_REQUIRED_CONTROL = new InjectionToken<GoodRequiredControl>('GoodUI date required control');

import { InjectionToken } from '@angular/core';

export interface GoodRequiredControl { setFieldRequired(required: boolean): void; }
export const GOOD_COMPOSITE_REQUIRED_CONTROL = new InjectionToken<GoodRequiredControl>('GoodUI composite required control');

import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { GOODUI_OPTIONS, GoodUIOptions } from './goodui-config';
import { GoodNotificationCenter } from './notification-center';
import { GoodThemeService } from './theme';
import { GoodCalendarService } from './calendar-service';

/** Register GoodUI's application services and their shared options at bootstrap. */
export function provideGoodUI(options: GoodUIOptions = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: GOODUI_OPTIONS, useValue: options },
    GoodNotificationCenter,
    GoodThemeService,
    GoodCalendarService,
  ]);
}

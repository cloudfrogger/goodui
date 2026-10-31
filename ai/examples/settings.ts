import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GoodActionGroupComponent, GoodButtonComponent, GoodFormDirective, GoodGroupComponent, GoodMainViewComponent, GoodParagraphComponent, GoodSwitchComponent } from '@goodui/angular';
@Component({
  selector: 'app-settings-example', standalone: true,
  imports: [ReactiveFormsModule, GoodMainViewComponent, GoodGroupComponent, GoodFormDirective, GoodSwitchComponent, GoodActionGroupComponent, GoodButtonComponent, GoodParagraphComponent],
  templateUrl: './settings.html',
})
export class SettingsExample {
  readonly form = new FormGroup({ emailUpdates: new FormControl(true, { nonNullable: true }), activityAlerts: new FormControl(false, { nonNullable: true }) });
  readonly saved = signal(false);
  save(): void { this.saved.set(true); }
}

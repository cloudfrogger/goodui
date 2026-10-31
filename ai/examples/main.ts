import { Component, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { GoodButtonComponent, GoodActionGroupComponent } from '@goodui/angular';
import { LoginExample } from './login';
import { TableViewExample } from './table-view';
import { EditFormExample } from './edit-form';
import { SettingsExample } from './settings';
@Component({
  selector: 'app-root', standalone: true,
  imports: [GoodActionGroupComponent, GoodButtonComponent, LoginExample, TableViewExample, EditFormExample, SettingsExample],
  template: `<good-action-group ariaLabel="Examples">
    <good-button (click)="page.set('login')">Login</good-button>
    <good-button (click)="page.set('table')">Table</good-button>
    <good-button (click)="page.set('edit')">Edit</good-button>
    <good-button (click)="page.set('settings')">Settings</good-button>
  </good-action-group>
  @switch (page()) {
    @case ('login') { <app-login-example /> }
    @case ('table') { <app-table-example /> }
    @case ('edit') { <app-edit-form-example /> }
    @case ('settings') { <app-settings-example /> }
  }`,
})
class App { readonly page = signal<'login' | 'table' | 'edit' | 'settings'>('login'); }
bootstrapApplication(App).catch(error => console.error(error));

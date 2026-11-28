import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GoodSelectComponent, GoodSelectCountryComponent, GoodParagraphComponent, type GoodSelectValue } from '@cloudfrogger/goodui';
@Component({
  selector: 'app-select-filter-example', standalone: true,
  imports: [ReactiveFormsModule, GoodSelectComponent, GoodSelectCountryComponent, GoodParagraphComponent],
  templateUrl: './select-filter.html',
})
export class SelectFilterExample {
  readonly team = new FormControl<GoodSelectValue>('design');
  readonly options = [{ value: 'design', label: 'Design' }, { value: 'engineering', label: 'Engineering' },
    { value: 'archive', label: 'Archive', disabled: true }];
}

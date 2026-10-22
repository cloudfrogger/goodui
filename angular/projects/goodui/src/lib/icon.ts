import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { GoodIconName } from './models';

@Component({
  selector: 'good-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
      stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      @switch (name()) {
        @case ('dashboard') { <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/> }
        @case ('grid') { <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/> }
        @case ('account') { <circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/> }
        @case ('network') { <circle cx="12" cy="4" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="m11 6-5 11m7-11 5 11M7 19h10"/> }
        @case ('home') { <path d="m3 10 9-7 9 7v11H3z"/><path d="M9 21v-7h6v7"/> }
        @case ('settings') { <circle cx="12" cy="12" r="3"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/> }
        @case ('search') { <circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/> }
        @case ('bell') { <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"/> }
        @case ('menu') { <path d="M4 6h16M4 12h16M4 18h16"/> }
        @case ('close') { <path d="M5 5l14 14M19 5 5 19"/> }
        @case ('chevron-down') { <path d="m6 9 6 6 6-6"/> }
        @case ('chevron-right') { <path d="m9 6 6 6-6 6"/> }
        @case ('sun') { <circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/> }
        @case ('moon') { <path d="M20 15.5A8 8 0 0 1 8.5 4 8 8 0 1 0 20 15.5Z"/> }
        @case ('logout') { <path d="M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5M16 17l5-5-5-5m5 5H9"/> }
        @case ('calendar') { <rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/> }
        @case ('question') { <circle cx="12" cy="12" r="9"/><path d="M9.6 9a2.5 2.5 0 0 1 4.8 1c0 1.8-2.4 2-2.4 3.5M12 17h.01"/> }
        @case ('card') { <rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18M7 15h4"/> }
        @case ('book') { <rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/> }
        @case ('contact') { <circle cx="12" cy="5" r="2"/><circle cx="5" cy="17" r="2"/><circle cx="19" cy="17" r="2"/><path d="m10.5 6.6-4 8M13.5 6.6l4 8M7 17h10"/> }
        @case ('star') { <path d="m12 2 3.1 6.4 7 .9-5.1 5 .9 7-5.9-3.2-5.9 3.2.9-7-5.1-5 7-.9z"/> }
        @case ('message') { <path d="M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4V6a2 2 0 0 1 1-2Z"/><path d="M10 9a2 2 0 0 1 4 1c0 1-2 1.5-2 2.5M12 15h.01"/> }
        @case ('globe') { <circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 4 6 4 9s-1 6-4 9M12 3c-3 3-4 6-4 9s1 6 4 9"/> }
      }
    </svg>
  `,
  host: { class: 'good-icon' },
})
export class GoodIconComponent {
  readonly name = input.required<GoodIconName>();
}

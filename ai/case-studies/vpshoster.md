# VPS hoster case study

Public entry: `/examples/case-studies/vpshoster`. The live screens are `/examples/case-studies/vpshoster/servers` and `/examples/case-studies/vpshoster/create`.

Use this study only for tasks about a server list, a long configuration workflow, or its specific GoodUI compositions. Do not scan it for unrelated component work. The full AI package includes the live Angular source at `homepage/src/app/examples/case-studies/vpshoster/`. The original reference screenshots are local review material and are not part of the release archive.

| Screen | GoodUI composition | Application responsibility |
| --- | --- | --- |
| Servers | MainView → Tabs, sortable Table with Checkbox, Badge, Dropdown, and a rich Name cell composed from StatusIcon, Link, and Hint; Modal with Input and Select filters; shell Notifications bell | In-memory server records, a plan/architecture/disk/zone subtitle, StatusIcon mapping, responsive column thresholds including desktop-only selection checkboxes, combined filter predicates including name/IP search in the Filter modal, row and bulk actions; one sample maintenance notice published to the bell inbox |
| Create servers | Fill MainView → AssistantPanel `appearance="soft"` with Main, Header, Body, Footer, and Mobile sections; Timeline with projected sections, Groups, Tabs, RadioGroup, selectable Table, Select, Listbox, Checkbox, Input, NumberInput, Textarea, Alert, Button; shell Notifications bell | Plan and image choices, validation, section completion/attention state, quantity, sample pricing, local creation; contextual form warnings stay beside their controls |

The public examples expose their editable HTML, TypeScript, and shared store through a View source dialog. Read the screen relevant to the task, then verify exact inputs and outputs against the installed GoodUI version's catalog. UI actions are local demonstrations. They do not provision servers, persist data, bill a customer, or transmit SSH keys. Prices are illustrative, and sample IPs use a documentation range.

Keep VPS terminology, plan names, prices, and provisioning logic in the case study. If the workflow reveals a reusable gap, extend the generic GoodUI component and update this study to demonstrate the new API.

The reference images include a prominent maintenance-status block. GoodUI already provides a shell bell, so this study publishes that sample status once through `GoodNotificationCenter` with `delivery: 'inbox'`. Do not recreate the block as an Expandable or Alert in page content. Keep immediate validation messages, such as a missing SSH key, inline because they explain an action on the current form. See [Notifications](../../guides/components/notifications.md) for the delivery and history contract.

The Servers Name column uses a projected `ng-template goodTableCell="name"` for its LED, link, and subtitle. The column definition stays responsible for sorting and visibility. This is the short path for a page-specific rich cell; use `flexRenderComponent` when a cell is reusable across pages.

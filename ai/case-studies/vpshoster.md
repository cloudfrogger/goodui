# VPS hoster case study

Public entry: `/examples/case-studies/vpshoster`. The live screens are `/examples/case-studies/vpshoster/servers` and `/examples/case-studies/vpshoster/create`.

Use this study only for tasks about a server list, a long configuration workflow, or its specific GoodUI compositions. Do not scan it for unrelated component work. The full AI package includes the live Angular source at `homepage/src/app/examples/case-studies/vpshoster/`. The original reference screenshots are local review material and are not part of the release archive.

| Screen | GoodUI composition | Application responsibility |
| --- | --- | --- |
| Servers | MainView → Expandable status notice, Tabs, searchable and sortable Table with Checkbox, Badge, and Dropdown cells; Modal with Input and Select filters | In-memory server records, combined filter predicates, row and bulk actions |
| Create servers | Fill MainView → Expandable status notice and AssistantPanel with Main, Header, Body, Footer, and Mobile sections; Groups, Tabs, RadioGroup, selectable Table, Select, Listbox, Checkbox, Input, NumberInput, Textarea, Alert, Button | Plan and image choices, validation, quantity, sample pricing, local creation |

The public examples expose their editable HTML, TypeScript, and shared store through a View source dialog. Read the screen relevant to the task, then verify exact inputs and outputs against the installed GoodUI version's catalog. UI actions are local demonstrations. They do not provision servers, persist data, bill a customer, or transmit SSH keys. Prices are illustrative, and sample IPs use a documentation range.

Keep VPS terminology, plan names, prices, and provisioning logic in the case study. If the workflow reveals a reusable gap, extend the generic GoodUI component and update this study to demonstrate the new API.

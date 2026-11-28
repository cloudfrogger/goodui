// Generated from design/accessibility-assessment.json; run npm run accessibility:generate.
export const accessibilityAssessment = {
  "edition": "ISO/IEC 40500:2025",
  "baseline": "WCAG 2.2",
  "reviewedOn": "2026-11-28",
  "scope": "Framework support review, not a conformance claim or certification.",
  "statusMeaning": {
    "OK": "Documented implementation support for the bounded behavior described in the row; application use and complete-page testing remain necessary.",
    "Not okay": "Not established for GoodUI as a whole: a known gap, an outstanding verification, or a requirement owned by the consuming application. It does not automatically identify a defect in every use."
  },
  "sources": [
    {
      "label": "ISO/IEC 40500:2025 adoption (W3C)",
      "url": "https://www.w3.org/WAI/news/2025-10-21/wcag22-iso/"
    },
    {
      "label": "WCAG 2.2 normative criteria",
      "url": "https://www.w3.org/TR/WCAG22/"
    },
    {
      "label": "Earlier ISO/IEC 40500:2012 / WCAG 2.0",
      "url": "https://www.w3.org/TR/WCAG20/"
    }
  ],
  "legacy": {
    "id": "4.1.1",
    "title": "Markup parsing",
    "explanation": "Retained for readers of ISO/IEC 40500:2012 and WCAG 2.0. Removed from WCAG 2.2, so it is not one of the 86 current criteria and receives no current status. A legacy HTML-validation audit has not been completed.",
    "url": "https://www.w3.org/WAI/WCAG22/Understanding/parsing.html"
  },
  "criteria": [
    {
      "id": "1.1.1",
      "title": "Image alternatives",
      "level": "A",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "InlineImage accepts alt text and Avatar can be decorative. Charts, signatures, uploaded images, and application icons still need meaningful alternatives chosen for their actual purpose.",
      "evidence": [
        "guides/components/typography.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#non-text-content"
    },
    {
      "id": "1.2.1",
      "title": "Recorded alternatives",
      "level": "A",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "GoodUI does not supply transcripts or equivalent alternatives for recordings supplied by an application.",
      "evidence": [
        "guides/foundations/accessibility.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#audio-only-and-video-only-prerecorded"
    },
    {
      "id": "1.2.2",
      "title": "Recorded subtitles",
      "level": "A",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "Caption tracks for recorded media must be produced and verified by the application author; there is no caption-authoring component.",
      "evidence": [
        "guides/foundations/accessibility.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#captions-prerecorded"
    },
    {
      "id": "1.2.3",
      "title": "Visual narration",
      "level": "A",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "An application must provide an equivalent description of important visual information in its recordings.",
      "evidence": [
        "guides/foundations/accessibility.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#audio-description-or-media-alternative-prerecorded"
    },
    {
      "id": "1.2.4",
      "title": "Live subtitles",
      "level": "AA",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "The framework supplies no live caption service or verification of streamed content.",
      "evidence": [
        "guides/foundations/accessibility.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#captions-live"
    },
    {
      "id": "1.2.5",
      "title": "Recorded narration",
      "level": "AA",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "Audio descriptions depend on the actual video and are outside the supplied UI controls.",
      "evidence": [
        "guides/foundations/accessibility.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#audio-description-prerecorded"
    },
    {
      "id": "1.2.6",
      "title": "Signed recordings",
      "level": "AAA",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "A sign-language version of recorded speech requires content and production work outside GoodUI.",
      "evidence": [
        "guides/foundations/accessibility.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#sign-language-prerecorded"
    },
    {
      "id": "1.2.7",
      "title": "Extended narration",
      "level": "AAA",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "Extended descriptions for recordings are not created or checked by this component library.",
      "evidence": [
        "guides/foundations/accessibility.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#extended-audio-description-prerecorded"
    },
    {
      "id": "1.2.8",
      "title": "Recording transcripts",
      "level": "AAA",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "A complete text alternative for synchronized recordings must be supplied by the consuming application.",
      "evidence": [
        "guides/foundations/accessibility.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#media-alternative-prerecorded"
    },
    {
      "id": "1.2.9",
      "title": "Live transcripts",
      "level": "AAA",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "Equivalent text for live audio is an application or service responsibility, not a framework capability.",
      "evidence": [
        "guides/foundations/accessibility.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#audio-only-live"
    },
    {
      "id": "1.3.1",
      "title": "Semantic structure",
      "level": "A",
      "introduced": "2.0",
      "status": "OK",
      "basis": "Supported",
      "explanation": "Table renders native table, thead, scoped th, and td elements. Heading components preserve HTML heading levels, and Input exposes native labels. This supports the documented composition; application relationships and chart alternatives still require review.",
      "evidence": [
        "angular/projects/goodui/src/lib/table.ts"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#info-and-relationships"
    },
    {
      "id": "1.3.2",
      "title": "Reading sequence",
      "level": "A",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Not verified",
      "explanation": "Shell preserves a single Sidebar and projected content. A complete reading-order review across responsive layouts, portals, and all component combinations has not been completed.",
      "evidence": [
        "angular/projects/goodui/src/lib/app-shell.ts"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#meaningful-sequence"
    },
    {
      "id": "1.3.3",
      "title": "Sensory instructions",
      "level": "A",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "Instructions must identify controls with meaningful text rather than depending only on position, shape, or sound. GoodUI cannot inspect application prose.",
      "evidence": [
        "guides/foundations/accessibility.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#sensory-characteristics"
    },
    {
      "id": "1.3.4",
      "title": "Screen rotation",
      "level": "AA",
      "introduced": "2.1",
      "status": "OK",
      "basis": "Supported",
      "explanation": "Shell and MainView respond to available width rather than locking the device orientation. The library does not request an orientation lock. This is source-level support; applications must test their own landscape layouts.",
      "evidence": [
        "angular/projects/goodui/src/lib/app-shell.ts"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#orientation"
    },
    {
      "id": "1.3.5",
      "title": "Field purpose",
      "level": "AA",
      "introduced": "2.1",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "Input accepts autocomplete values and PIN Input defaults to one-time-code. Applications must assign appropriate purpose tokens to each personal-data field; this cannot be inferred from a generic label.",
      "evidence": [
        "angular/projects/goodui/src/lib/input.ts"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#identify-input-purpose"
    },
    {
      "id": "1.3.6",
      "title": "Interface purpose",
      "level": "AAA",
      "introduced": "2.1",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "Generic roles and names do not identify the purpose of every application region or symbol. Application-specific purpose metadata has not been assessed.",
      "evidence": [
        "guides/components/typography.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#identify-purpose"
    },
    {
      "id": "1.4.1",
      "title": "Color-independent meaning",
      "level": "A",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "Badges and Alerts can include text and icons. Applications must use those cues for status, charts, and markers; semantic color tokens alone do not satisfy this criterion.",
      "evidence": [
        "guides/foundations/tokens.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#use-of-color"
    },
    {
      "id": "1.4.2",
      "title": "Playback controls",
      "level": "A",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "GoodUI has no automatic audio playback of its own. Audio introduced by an application still needs appropriate stop, pause, or independent volume controls.",
      "evidence": [
        "guides/foundations/accessibility.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#audio-control"
    },
    {
      "id": "1.4.3",
      "title": "Text contrast",
      "level": "AA",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Not verified",
      "explanation": "The softer dark palette passes 64 defined text/background pairs at 4.5:1 or higher. This is not an all-component, all-state, light-and-dark audit. Application overrides, images, opacity, and uncovered combinations remain to be checked.",
      "evidence": [
        "scripts/check-theme-contrast.mjs"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#contrast-minimum"
    },
    {
      "id": "1.4.4",
      "title": "Text enlargement",
      "level": "AA",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Not verified",
      "explanation": "Desktop and narrow-screen checks do not establish 200% text enlargement support. Fixed-height controls and complex workspaces need a dedicated enlargement audit.",
      "evidence": [
        "angular/projects/goodui/src/styles.css"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#resize-text"
    },
    {
      "id": "1.4.5",
      "title": "Live lettering",
      "level": "AA",
      "introduced": "2.0",
      "status": "OK",
      "basis": "Supported",
      "explanation": "Headings, Buttons, Inputs, and Table labels render live text rather than rasterized words. Keep essential instructions in those text components; application screenshots and artwork remain outside this support finding.",
      "evidence": [
        "guides/components/typography.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#images-of-text"
    },
    {
      "id": "1.4.6",
      "title": "Stronger contrast",
      "level": "AAA",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Not verified",
      "explanation": "Some primary dark text exceeds 7:1, but muted text on the canvas is 6.91:1. The 4.5:1 AA token guard does not establish enhanced contrast across the framework.",
      "evidence": [
        "scripts/check-theme-contrast.mjs"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#contrast-enhanced"
    },
    {
      "id": "1.4.7",
      "title": "Quiet recordings",
      "level": "AAA",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "Background sound in recorded speech is controlled by the media producer, not by GoodUI.",
      "evidence": [
        "guides/foundations/accessibility.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#low-or-no-background-audio"
    },
    {
      "id": "1.4.8",
      "title": "Reading preferences",
      "level": "AAA",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Not verified",
      "explanation": "Prose has a bounded reading width, but a complete user-controlled presentation system and all enhanced spacing, alignment, and enlargement conditions have not been verified.",
      "evidence": [
        "guides/components/typography.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#visual-presentation"
    },
    {
      "id": "1.4.9",
      "title": "Raster-free lettering",
      "level": "AAA",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "Core controls use real text, but the framework also permits images, PDFs, and rich content. It cannot guarantee that application content never uses images of text.",
      "evidence": [
        "guides/components/typography.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#images-of-text-no-exception"
    },
    {
      "id": "1.4.10",
      "title": "Narrow reflow",
      "level": "AA",
      "introduced": "2.1",
      "status": "Not okay",
      "basis": "Not verified",
      "explanation": "Representative pages have been checked at 320 and 390 CSS pixels. All components and zoom combinations have not been audited; complex tables retain their own two-dimensional scrolling region.",
      "evidence": [
        "guides/components/table.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#reflow"
    },
    {
      "id": "1.4.11",
      "title": "Control contrast",
      "level": "AA",
      "introduced": "2.1",
      "status": "Not okay",
      "basis": "Not verified",
      "explanation": "The text guard does not test boundaries, selected indicators, charts, or focus outlines at 3:1. Subtle borders are not evidence of sufficient contrast for an essential control boundary.",
      "evidence": [
        "guides/foundations/tokens.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#non-text-contrast"
    },
    {
      "id": "1.4.12",
      "title": "Spacing overrides",
      "level": "AA",
      "introduced": "2.1",
      "status": "Not okay",
      "basis": "Not verified",
      "explanation": "The framework has not been audited with the complete required user text-spacing override set. Fixed-height controls and clipped labels need specific checks.",
      "evidence": [
        "angular/projects/goodui/src/styles.css"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#text-spacing"
    },
    {
      "id": "1.4.13",
      "title": "Transient content",
      "level": "AA",
      "introduced": "2.1",
      "status": "Not okay",
      "basis": "Not verified",
      "explanation": "Dropdowns document Escape and outside dismissal. Every hover- and focus-triggered popup still needs a complete dismissible, hoverable, and persistent-content audit.",
      "evidence": [
        "guides/components/dropdown.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#content-on-hover-or-focus"
    },
    {
      "id": "2.1.1",
      "title": "Keyboard operation",
      "level": "A",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Not verified",
      "explanation": "Many controls expose native keyboard interaction, and Table has keyboard sorting and column movement. A complete keyboard audit of Calendar, drawing, editing, resizing, and all dialogs has not been completed.",
      "evidence": [
        "guides/components/table.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#keyboard"
    },
    {
      "id": "2.1.2",
      "title": "Keyboard escape",
      "level": "A",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Not verified",
      "explanation": "Modal documents Escape and focus restoration, and Sidebar supports dismissal. Nested overlays and every composite control still require an end-to-end keyboard-trap audit.",
      "evidence": [
        "guides/components/modal.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#no-keyboard-trap"
    },
    {
      "id": "2.1.3",
      "title": "Complete keyboard",
      "level": "AAA",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Not verified",
      "explanation": "The stronger keyboard requirement has not been verified for drawing, drag interactions, rich editing, and every framework feature.",
      "evidence": [
        "guides/foundations/accessibility.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#keyboard-no-exception"
    },
    {
      "id": "2.1.4",
      "title": "Shortcut control",
      "level": "A",
      "introduced": "2.1",
      "status": "Not okay",
      "basis": "Not verified",
      "explanation": "Header Search uses a modifier shortcut, but there is no complete inventory proving that every character shortcut can be disabled, remapped, or restricted appropriately.",
      "evidence": [
        "guides/components/header-search.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#character-key-shortcuts"
    },
    {
      "id": "2.2.1",
      "title": "Time adjustment",
      "level": "A",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "Notification timers can pause and revisitable messages can be retained. Session expiration, reservation deadlines, and other application time limits need their own extension or adjustment behavior.",
      "evidence": [
        "guides/components/notifications.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#timing-adjustable"
    },
    {
      "id": "2.2.2",
      "title": "Motion control",
      "level": "A",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Not verified",
      "explanation": "Several components honor reduced motion and notifications can pause. A complete inventory of moving, updating, and scrolling content and the required controls is still missing.",
      "evidence": [
        "angular/projects/goodui/src/styles.css"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#pause-stop-hide"
    },
    {
      "id": "2.2.3",
      "title": "Untimed tasks",
      "level": "AAA",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "The component library cannot remove deadlines imposed by authentication, backend workflows, or application business rules.",
      "evidence": [
        "guides/foundations/accessibility.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#no-timing"
    },
    {
      "id": "2.2.4",
      "title": "Interruption control",
      "level": "AAA",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "Applications choose which notifications and interruptions to issue. Persistent history is available, but user control of every nonessential interruption is not guaranteed.",
      "evidence": [
        "guides/components/notifications.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#interruptions"
    },
    {
      "id": "2.2.5",
      "title": "Session recovery",
      "level": "AAA",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "Preserving a completed draft through re-authentication depends on application storage and identity integration; GoodUI does not persist arbitrary form state.",
      "evidence": [
        "guides/foundations/accessibility.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#re-authenticating"
    },
    {
      "id": "2.2.6",
      "title": "Timeout disclosure",
      "level": "AAA",
      "introduced": "2.1",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "Applications must explain inactivity and data-loss timeouts where relevant. The library does not own those policies.",
      "evidence": [
        "guides/foundations/accessibility.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#timeouts"
    },
    {
      "id": "2.3.1",
      "title": "Flash limits",
      "level": "A",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Not verified",
      "explanation": "A quantified photosensitive-flash assessment of all built-in animations and supplied application content has not been performed.",
      "evidence": [
        "angular/projects/goodui/src/styles.css"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#three-flashes-or-below-threshold"
    },
    {
      "id": "2.3.2",
      "title": "Flash avoidance",
      "level": "AAA",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Not verified",
      "explanation": "No enhanced no-flash verification covers every animation, chart, embedded asset, or application update pattern.",
      "evidence": [
        "angular/projects/goodui/src/styles.css"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#three-flashes"
    },
    {
      "id": "2.3.3",
      "title": "Optional motion",
      "level": "AAA",
      "introduced": "2.1",
      "status": "Not okay",
      "basis": "Not verified",
      "explanation": "Reduced-motion rules exist for controls and the Table spinner. This does not establish that all nonessential interaction-triggered motion can be disabled across the framework.",
      "evidence": [
        "angular/projects/goodui/src/styles.css"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#animation-from-interactions"
    },
    {
      "id": "2.4.1",
      "title": "Repeated navigation",
      "level": "A",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Known gap",
      "explanation": "AppShell has no built-in skip-to-main link. An application can add one, but the default shell does not supply a complete bypass pattern.",
      "evidence": [
        "angular/projects/goodui/src/lib/app-shell.ts"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#bypass-blocks"
    },
    {
      "id": "2.4.2",
      "title": "Document titles",
      "level": "A",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Known gap",
      "explanation": "The homepage currently has a shared document title rather than a distinct title for every route. Applications must configure Angular route titles or an equivalent title strategy.",
      "evidence": [
        "homepage/src/index.html"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#page-titled"
    },
    {
      "id": "2.4.3",
      "title": "Focus sequence",
      "level": "A",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Not verified",
      "explanation": "Native controls and overlay restoration provide a basis. Complete forward and reverse tab-order checks across nested overlays and responsive compositions remain outstanding.",
      "evidence": [
        "guides/components/modal.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#focus-order"
    },
    {
      "id": "2.4.4",
      "title": "Contextual links",
      "level": "A",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "Link supports real navigation and projected labels. The application must make each destination understandable in its surrounding context.",
      "evidence": [
        "guides/components/link.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#link-purpose-in-context"
    },
    {
      "id": "2.4.5",
      "title": "Finding pages",
      "level": "AA",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "Sidebar, menus, and search are available. The application chooses their coverage and must supply appropriate alternative ways to find its pages.",
      "evidence": [
        "guides/components/sidebar.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#multiple-ways"
    },
    {
      "id": "2.4.6",
      "title": "Useful labels",
      "level": "AA",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "Heading and field-label components preserve semantics, but useful and accurate labels depend on application text and the actual workflow.",
      "evidence": [
        "guides/components/typography.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#headings-and-labels"
    },
    {
      "id": "2.4.7",
      "title": "Visible focus",
      "level": "AA",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Not verified",
      "explanation": "Many controls define focus-visible styling. Every focusable element, browser mode, clipped container, and custom theme still needs a complete visual focus audit.",
      "evidence": [
        "angular/projects/goodui/src/styles.css"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#focus-visible"
    },
    {
      "id": "2.4.8",
      "title": "Location cues",
      "level": "AAA",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "Breadcrumbs and active navigation are available. Applications must supply the correct hierarchy and current location consistently.",
      "evidence": [
        "guides/components/breadcrumbs.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#location"
    },
    {
      "id": "2.4.9",
      "title": "Standalone links",
      "level": "AAA",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "The purpose of a link without surrounding context depends on the application label. The library cannot judge every projected label.",
      "evidence": [
        "guides/components/link.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#link-purpose-link-only"
    },
    {
      "id": "2.4.10",
      "title": "Section structure",
      "level": "AAA",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "Section and Heading components support structure, but authors must divide each page into meaningful labeled sections.",
      "evidence": [
        "guides/components/typography.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#section-headings"
    },
    {
      "id": "2.4.11",
      "title": "Uncovered focus",
      "level": "AA",
      "introduced": "2.2",
      "status": "Not okay",
      "basis": "Not verified",
      "explanation": "Sticky Table headings and modal surfaces need dedicated checks that focused controls are not fully obscured. General scrolling checks do not prove this criterion.",
      "evidence": [
        "guides/components/table.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#focus-not-obscured-minimum"
    },
    {
      "id": "2.4.12",
      "title": "Fully visible focus",
      "level": "AAA",
      "introduced": "2.2",
      "status": "Not okay",
      "basis": "Not verified",
      "explanation": "The enhanced focus-visibility requirement has not been audited across sticky regions, drawers, overlays, and nested scrolling surfaces.",
      "evidence": [
        "guides/components/modal.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#focus-not-obscured-enhanced"
    },
    {
      "id": "2.4.13",
      "title": "Focus dimensions",
      "level": "AAA",
      "introduced": "2.2",
      "status": "Not okay",
      "basis": "Not verified",
      "explanation": "Existing focus outlines have not been measured against all enhanced area and contrast conditions. A visible ring alone does not establish this requirement.",
      "evidence": [
        "angular/projects/goodui/src/styles.css"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#focus-appearance"
    },
    {
      "id": "2.5.1",
      "title": "Simple gestures",
      "level": "A",
      "introduced": "2.1",
      "status": "Not okay",
      "basis": "Not verified",
      "explanation": "Some complex interactions have keyboard alternatives. A framework-wide audit of single-pointer alternatives to path-based or multipoint gestures remains outstanding.",
      "evidence": [
        "guides/foundations/accessibility.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#pointer-gestures"
    },
    {
      "id": "2.5.2",
      "title": "Pointer cancellation",
      "level": "A",
      "introduced": "2.1",
      "status": "Not okay",
      "basis": "Not verified",
      "explanation": "Native buttons normally activate on release, but custom drag, resize, drawing, and press handlers need a complete cancellation review.",
      "evidence": [
        "angular/projects/goodui/src/lib/table.ts"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#pointer-cancellation"
    },
    {
      "id": "2.5.3",
      "title": "Matching names",
      "level": "A",
      "introduced": "2.1",
      "status": "Not okay",
      "basis": "Not verified",
      "explanation": "Controls provide label and aria-label APIs. A full check that every accessible name contains its visible wording has not been completed.",
      "evidence": [
        "angular/projects/goodui/src/lib/input.ts"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#label-in-name"
    },
    {
      "id": "2.5.4",
      "title": "Motion alternatives",
      "level": "A",
      "introduced": "2.1",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "GoodUI does not require device motion. Any motion features introduced by an application still need an operable alternative and appropriate disable controls.",
      "evidence": [
        "guides/foundations/accessibility.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#motion-actuation"
    },
    {
      "id": "2.5.5",
      "title": "Larger targets",
      "level": "AAA",
      "introduced": "2.1",
      "status": "Not okay",
      "basis": "Known gap",
      "explanation": "Small Buttons are 32 pixels high and header action targets are 36 pixels. Not all controls meet the enhanced 44-pixel target requirement or have a documented exception.",
      "evidence": [
        "guides/components/button.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#target-size-enhanced"
    },
    {
      "id": "2.5.6",
      "title": "Mixed input",
      "level": "AAA",
      "introduced": "2.1",
      "status": "Not okay",
      "basis": "Not verified",
      "explanation": "Controls use native pointer and keyboard events, but simultaneous touch, pen, mouse, and keyboard operation has not been tested across all features.",
      "evidence": [
        "guides/foundations/accessibility.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#concurrent-input-mechanisms"
    },
    {
      "id": "2.5.7",
      "title": "Drag alternatives",
      "level": "AA",
      "introduced": "2.2",
      "status": "Not okay",
      "basis": "Not verified",
      "explanation": "Table columns can move with keyboard controls. Equivalent single-pointer alternatives for every drag operation, including Calendar and resizable workspaces, have not been verified.",
      "evidence": [
        "guides/components/table.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#dragging-movements"
    },
    {
      "id": "2.5.8",
      "title": "Minimum targets",
      "level": "AA",
      "introduced": "2.2",
      "status": "Not okay",
      "basis": "Not verified",
      "explanation": "Default control sizes provide a starting point. Every small icon, removal action, grip, spacing exception, and responsive state still needs a 24-pixel target audit.",
      "evidence": [
        "guides/components/button.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#target-size-minimum"
    },
    {
      "id": "3.1.1",
      "title": "Page language",
      "level": "A",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "The homepage declares en-US. Consuming applications must set the correct document language; a component cannot select the language of an entire product.",
      "evidence": [
        "homepage/src/index.html"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#language-of-page"
    },
    {
      "id": "3.1.2",
      "title": "Mixed languages",
      "level": "AA",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "Language changes within application content require appropriate lang attributes chosen by its author.",
      "evidence": [
        "guides/foundations/accessibility.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#language-of-parts"
    },
    {
      "id": "3.1.3",
      "title": "Unfamiliar vocabulary",
      "level": "AAA",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "Definitions for specialist or unfamiliar wording belong to the application content and have not been assessed by the library.",
      "evidence": [
        "guides/foundations/accessibility.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#unusual-words"
    },
    {
      "id": "3.1.4",
      "title": "Shortened terms",
      "level": "AAA",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "Authors must explain abbreviations where needed. GoodUI does not expand arbitrary application terminology.",
      "evidence": [
        "guides/foundations/accessibility.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#abbreviations"
    },
    {
      "id": "3.1.5",
      "title": "Simpler reading",
      "level": "AAA",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "Reading difficulty, summaries, and alternative wording depend on the audience and application content.",
      "evidence": [
        "guides/foundations/accessibility.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#reading-level"
    },
    {
      "id": "3.1.6",
      "title": "Pronunciation help",
      "level": "AAA",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "Pronunciation information for ambiguous words must be supplied with the relevant content.",
      "evidence": [
        "guides/foundations/accessibility.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#pronunciation"
    },
    {
      "id": "3.2.1",
      "title": "Stable focus",
      "level": "A",
      "introduced": "2.0",
      "status": "OK",
      "basis": "Supported",
      "explanation": "The reviewed Input and Expandable controls do not navigate or submit merely when receiving focus. Applications must keep their own focus handlers free of unexpected context changes.",
      "evidence": [
        "angular/projects/goodui/src/lib/input.ts"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#on-focus"
    },
    {
      "id": "3.2.2",
      "title": "Predictable input",
      "level": "A",
      "introduced": "2.0",
      "status": "OK",
      "basis": "Supported",
      "explanation": "Reviewed Inputs emit values and Expandable reveals its panel without automatically navigating elsewhere. Application event handlers must preserve that behavior or explain a change beforehand.",
      "evidence": [
        "angular/projects/goodui/src/lib/expandable.ts"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#on-input"
    },
    {
      "id": "3.2.3",
      "title": "Repeated navigation",
      "level": "AA",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "AppShell reuses one navigation instance. Applications still own the repeated navigation order and placement across routes.",
      "evidence": [
        "guides/layout/app-shell.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#consistent-navigation"
    },
    {
      "id": "3.2.4",
      "title": "Consistent naming",
      "level": "AA",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "Reusable controls share implementations, but the application chooses labels and icons for repeated functions.",
      "evidence": [
        "guides/components/button.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#consistent-identification"
    },
    {
      "id": "3.2.5",
      "title": "Requested changes",
      "level": "AAA",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "Navigation, refreshes, automatic updates, and other context changes are controlled by application behavior rather than by the library alone.",
      "evidence": [
        "guides/foundations/accessibility.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#change-on-request"
    },
    {
      "id": "3.2.6",
      "title": "Help placement",
      "level": "A",
      "introduced": "2.2",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "The library supplies contextual panels and links, but does not enforce where an application repeats its help mechanisms.",
      "evidence": [
        "guides/foundations/accessibility.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#consistent-help"
    },
    {
      "id": "3.3.1",
      "title": "Described errors",
      "level": "A",
      "introduced": "2.0",
      "status": "OK",
      "basis": "Supported",
      "explanation": "Input exposes error styling, aria-invalid, and describedBy for a textual error message. This supports error identification when the application supplies an accurate message and its ID; a red border alone is insufficient.",
      "evidence": [
        "angular/projects/goodui/src/lib/input.ts"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#error-identification"
    },
    {
      "id": "3.3.2",
      "title": "Field guidance",
      "level": "A",
      "introduced": "2.0",
      "status": "OK",
      "basis": "Supported",
      "explanation": "Input has native label, required, and description bindings; FormField provides structured label and help content. Authors still supply meaningful instructions for the actual data being collected.",
      "evidence": [
        "guides/components/typography.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#labels-or-instructions"
    },
    {
      "id": "3.3.3",
      "title": "Correction advice",
      "level": "AA",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "Validation rules and actionable correction suggestions depend on application data. GoodUI does not infer a correct replacement from every invalid value.",
      "evidence": [
        "guides/foundations/accessibility.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#error-suggestion"
    },
    {
      "id": "3.3.4",
      "title": "Consequential submissions",
      "level": "AA",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "Confirmation dialogs are available. Reversibility, review, and validation for financial, legal, and stored-data changes must be implemented in the application workflow.",
      "evidence": [
        "guides/components/modal.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#error-prevention-legal-financial-data"
    },
    {
      "id": "3.3.5",
      "title": "Contextual help",
      "level": "AAA",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "Applications choose and write help for forms and tasks. A panel component by itself does not provide that help.",
      "evidence": [
        "guides/foundations/accessibility.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#help"
    },
    {
      "id": "3.3.6",
      "title": "Safer submissions",
      "level": "AAA",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "The library does not guarantee review, reversal, or error checking for every application submission.",
      "evidence": [
        "guides/components/modal.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#error-prevention-all"
    },
    {
      "id": "3.3.7",
      "title": "Reused information",
      "level": "A",
      "introduced": "2.2",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "Retaining and reusing previously entered data depends on the application's multi-step form model and persistence.",
      "evidence": [
        "guides/foundations/accessibility.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#redundant-entry"
    },
    {
      "id": "3.3.8",
      "title": "Accessible sign-in",
      "level": "AA",
      "introduced": "2.2",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "Password and PIN controls do not establish an accessible authentication process. Password-manager, paste, recovery, and any identity-provider challenges must be tested in the consuming product.",
      "evidence": [
        "angular/projects/goodui/src/lib/pin-input.ts"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#accessible-authentication-minimum"
    },
    {
      "id": "3.3.9",
      "title": "Simpler sign-in",
      "level": "AAA",
      "introduced": "2.2",
      "status": "Not okay",
      "basis": "Application-owned",
      "explanation": "The enhanced authentication requirement depends on the complete identity-provider process, not just the provided text controls.",
      "evidence": [
        "guides/foundations/accessibility.md"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#accessible-authentication-enhanced"
    },
    {
      "id": "4.1.2",
      "title": "Control semantics",
      "level": "A",
      "introduced": "2.0",
      "status": "Not okay",
      "basis": "Not verified",
      "explanation": "Many components expose native semantics and ARIA state. There is no complete assistive-technology audit establishing correct names, roles, and values for every component and state.",
      "evidence": [
        "angular/projects/goodui/src/lib/input.ts"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#name-role-value"
    },
    {
      "id": "4.1.3",
      "title": "Announced updates",
      "level": "AA",
      "introduced": "2.1",
      "status": "OK",
      "basis": "Supported",
      "explanation": "Table empty/loading states use role=status and the notification host supplies polite live regions. These are implementation hooks; actual announcements still need verification with the application's target assistive technologies.",
      "evidence": [
        "angular/projects/goodui/src/lib/notification-host.ts"
      ],
      "standardUrl": "https://www.w3.org/TR/WCAG22/#status-messages"
    }
  ]
};

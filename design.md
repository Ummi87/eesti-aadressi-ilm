# Aether — Design Specification

Source reference: [Aether Interface System](https://aether-interface-system.ummi87.chatgpt.site)

## 1. Design intent

Aether is a production-oriented interface language for modern applications, dashboards, documentation, and AI-assisted products.

The experience should feel:

- Clean and structured
- Bright by default, with a purpose-built dark mode
- Premium without appearing ornamental
- Futuristic through material, depth, light, and interaction
- Calm during routine work and expressive during important moments

Target balance: **60% practical usability / 40% visual impact**.

The central rule is: **visual sophistication must never make the interface harder to use.**

## 2. Visual thesis

The system combines a quiet near-monochrome foundation with deep signal blue and electric cyan. Most surfaces are restrained. Energy is concentrated in primary actions, focus states, AI activity, visualization highlights, and selected spatial surfaces.

The page uses three visual layers:

1. **Canvas** — soft cloud-white or deep night background.
2. **Working surfaces** — opaque or lightly translucent cards with subtle borders.
3. **Elevated moments** — glass, directional glow, blur, and stronger shadow for command interfaces, AI states, notifications, and showcase elements.

## 3. Core color tokens

| Token | Value | Primary use |
|---|---:|---|
| `signal-blue` | `#0A42D8` | Primary actions, active navigation, charts, focus structure |
| `signal-blue-deep` | `#072E9F` | Gradient depth and pressed action states |
| `electric-cyan` | `#00D9FF` | Energy, AI activity, selected highlights, glow |
| `night` | `#07101F` | Dark theme canvas |
| `ink` | `#0B1529` | Light-theme primary text |
| `cloud` | `#F4F7FB` | Light-theme canvas |
| `white` | `#FFFFFF` | Solid elevated surfaces |
| `success` | `#14BE81` | Operational and successful states |
| `warning` | `#E3A71B` | Pending and caution states |
| `error` | `#DE254F` | Failure, risk, and destructive actions |

Recommended CSS variables:

```css
:root {
  --color-bg: #f4f7fb;
  --color-surface: rgba(255, 255, 255, 0.76);
  --color-surface-solid: #ffffff;
  --color-text: #0b1529;
  --color-text-muted: #68758b;
  --color-border: rgba(21, 50, 95, 0.11);
  --color-signal: #0a42d8;
  --color-signal-deep: #072e9f;
  --color-energy: #00d9ff;
}

[data-theme="dark"] {
  --color-bg: #07101f;
  --color-surface: rgba(12, 25, 46, 0.72);
  --color-surface-solid: #0d1a2d;
  --color-text: #eef6ff;
  --color-text-muted: #93a1b7;
  --color-border: rgba(147, 200, 255, 0.14);
}
```

Do not introduce generic purple or pink AI gradients. Accent color should communicate interaction or system meaning.

## 4. Typography

Use a modern geometric sans-serif for display and a neutral sans-serif for application text. A system stack is acceptable when a custom font is unavailable.

```css
--font-sans: Inter, ui-sans-serif, system-ui, -apple-system,
  BlinkMacSystemFont, "Segoe UI", sans-serif;
--font-mono: ui-monospace, SFMono-Regular, Consolas, monospace;
```

Typography roles:

| Role | Suggested size | Treatment |
|---|---:|---|
| Hero display | `clamp(3.1rem, 5.3vw, 5.5rem)` | 680 weight, very tight tracking, 0.94 line height |
| Section heading | `clamp(1.8rem, 3vw, 2.5rem)` | 650–700 weight, tight tracking |
| Card heading | `0.86–1rem` | 650 weight |
| Body | `1rem` | 1.65–1.75 line height |
| Interface label | `0.75–0.88rem` | 580–650 weight |
| Technical metadata | `0.58–0.68rem` | Monospace, uppercase, expanded tracking |

Large headings should be used only for meaningful hierarchy, not as decoration.

## 5. Geometry and spacing

Recommended radius scale:

```css
--radius-small: 8px;
--radius-control: 12px;
--radius-card: 20px;
--radius-panel: 22px;
--radius-showcase: 28px;
--radius-round: 999px;
```

Spacing is based on a four-pixel foundation:

```text
4, 8, 12, 16, 24, 32, 48, 64, 80, 112
```

Controls use structured rounded rectangles. Reserve full pills for statuses, compact filters, and small navigation markers.

## 6. Borders, shadows, and glass

Default cards use a thin low-contrast border and restrained shadow:

```css
border: 1px solid rgba(21, 50, 95, 0.11);
box-shadow: 0 18px 55px rgba(30, 66, 120, 0.08);
```

Showcase panels may use stronger depth:

```css
box-shadow: 0 22px 70px rgba(33, 65, 117, 0.11);
```

Glass is appropriate for:

- Sticky and floating navigation
- Command center
- Notifications
- AI processing states
- Contextual overlays
- Elevated temporary controls

Glass is not appropriate for every card, dense form, table row, or long content section.

Typical glass treatment:

```css
background: rgba(255, 255, 255, 0.72);
border: 1px solid rgba(255, 255, 255, 0.62);
backdrop-filter: blur(18px);
box-shadow: 0 18px 45px rgba(13, 54, 113, 0.15);
```

## 7. Page architecture

### Desktop

- Fixed left navigation: approximately `242px` wide.
- Sticky utility bar: approximately `76px` high.
- Main content: responsive maximum width around `1280px`.
- Content padding: approximately `58–78px` on large screens.
- Navigation remains visually quiet while content carries the primary hierarchy.

### Main page sequence

1. System overview and visual thesis
2. Interactive component playground
3. Foundation and token cards
4. Component language examples
5. Product-pattern dashboard
6. Documentation and AI-agent resources

The first viewport exposes the system’s identity and a direct route to useful components. It is not a marketing splash screen.

## 8. Navigation

The left navigation groups the system into:

- Overview
- Foundations
- Components
- Patterns

Active navigation uses blue text, a light blue/cyan directional tint, and a two-pixel blue marker. Hover states move slightly on the horizontal axis and introduce a quiet surface tint.

The top bar contains:

- Breadcrumb context
- Search and command-center trigger
- Keyboard shortcut hint
- Light/dark theme control

On mobile, the fixed sidebar becomes an off-canvas touch panel and the command center remains immediately accessible.

## 9. Hero and signature visual

The hero uses a two-column desktop layout:

- Left: system statement, short explanation, actions, and core principles.
- Right: material study combining a luminous blue sphere, subtle grid, depth, glow, and floating glass context cards.

The sphere is a signature showcase element, not a reusable routine control. It demonstrates the system’s material, light, and motion language.

The hero uses one expressive focal point. Supporting content stays calm.

## 10. Buttons

### Primary

- Deep-blue directional gradient
- White label
- Moderate radius
- Directional light reflection on hover
- Depth communicated through shadow rather than inflated geometry

### Secondary

- Neutral or translucent surface
- Thin border
- Minimal shadow
- Strong text contrast

### Destructive

- Dark red to signal-red gradient
- Clear risk styling
- Confirmation proportional to the consequence

Button sizes:

| Size | Height | Typical use |
|---|---:|---|
| Small | `40px` | Dense interface actions |
| Medium | `51px` | Standard actions |
| Large | `60px` | High-emphasis actions |

## 11. Form controls

Inactive controls remain visually quiet. Focus introduces a blue border, cyan-tinted focus halo, and slightly increased depth.

Every validation state must use:

- Color
- Icon or shape
- Clear text message

Never clear a user’s entered value after validation failure.

## 12. Status system

Statuses use compact pill geometry because the form communicates a short state rather than acting as a primary control.

Examples:

- Operational: check icon, green tint, “Operational” label
- Pending: dashed-circle icon, amber tint, “Pending” label
- At risk: alert icon, red tint, “At risk” label

Color alone must never convey status.

## 13. Notifications

Notifications use floating glass surfaces with:

- Status icon
- Concise title
- One-line supporting message
- Optional action
- Visible dismiss control

Motion is short and spatial. Notifications do not depend on sound or haptic feedback.

## 14. Tables and data rows

Tables prioritize numerical and label clarity. Use technical metadata, compact status markers, restrained row highlighting, and inline actions.

Desktop layouts may be dense. Mobile layouts should recompose rows into labeled records rather than shrinking a desktop table.

## 15. Dashboard composition

Dashboards use an adaptive bento layout. Card size follows information importance.

The demonstrated pattern contains:

- Three compact summary metrics
- One dominant visualization card
- One activity stream
- Live status and contextual time controls

Charts use signal blue for the main series and cyan for active points or anomalies. Grid and area fills remain subtle so values stay legible.

## 16. AI visual language

AI uses a recognizable blue-to-cyan system:

- Deep blue for stable structure
- Electric cyan for energy and active processing
- White highlights for intelligence and clarity

AI processing should use progressive illumination, light movement, or content reveal rather than a generic spinner alone.

Recommendations should expose:

- Suggestion
- Expected impact
- Apply
- Adjust
- Dismiss
- Undo when an action has already been applied

## 17. Command center

The command center uses the strongest glass and depth treatment in the system.

Desktop behavior:

- Opens with `Cmd/Ctrl + K`
- Supports navigation and appearance actions
- Appears as a centered spatial overlay
- Closes with Escape or outside interaction

Mobile behavior should become a full-screen command interface with touch-sized results.

## 18. Motion system

Three user-selectable modes are required:

### Reduced

- No continuous decorative motion
- No parallax or 3D tilt
- Immediate or near-immediate state transitions

### Standard

- Short hover and focus transitions
- Controlled component movement
- Restrained ambient animation

### Enhanced

- Richer depth transitions
- More visible illumination movement
- Selected 3D response on showcase components

Suggested timing tokens:

```css
--motion-fast: 160ms;
--motion-standard: 250ms;
--motion-expressive: 650ms;
```

Always respect `prefers-reduced-motion` regardless of the selected system mode.

## 19. Responsive behavior

### Tablet

- Hero moves to a single column.
- Component gallery changes from three columns to two.
- Foundation cards change from three columns to two.
- Dashboard activity expands below the main chart.

### Mobile

- Sidebar becomes an off-canvas panel.
- Utility search becomes an icon trigger.
- Hero text and visual stack vertically.
- Playground controls move below the preview.
- Foundation, component, and dashboard grids become single-column.
- Supporting metadata is removed or moved into context.
- Touch controls target approximately `44 × 44px` or larger.

Responsive design means recomposition, not simple shrinking.

## 20. Accessibility requirements

- Use semantic landmarks and heading order.
- Maintain visible keyboard focus.
- Ensure command and modal interfaces expose dialog semantics.
- Give icon-only controls accessible names.
- Preserve logical keyboard order.
- Maintain readable contrast in both themes.
- Do not rely on color alone.
- Provide a reduced-motion representation of every animated component.
- Keep interactive controls usable at 200% text enlargement.

## 21. Microcopy

Voice is concise, confident, modern, and slightly technical.

Guidelines:

- Buttons start with direct verbs: “Generate report”, “Apply”, “Adjust”.
- Status labels describe the current state directly.
- Errors explain what happened and the next useful action.
- Notifications lead with the outcome.
- Avoid filler, hype, and unnecessary conversational language.

## 22. Implementation rules for AI agents

When creating a new interface from this system:

1. Identify the primary user task.
2. Make that task available in the first viewport.
3. Choose one expressive visual focal point.
4. Keep routine controls calm and familiar.
5. Use glass only for elevated or contextual surfaces.
6. Use blue and cyan only when they communicate action, energy, state, or depth.
7. Preserve clear typography and spacing before adding effects.
8. Recompose dense desktop structures for mobile.
9. Implement light, dark, reduced, standard, and enhanced states from the start.
10. Verify focus, contrast, keyboard behavior, non-color state communication, and touch targets.

## 23. Anti-patterns

Avoid:

- Generic purple/pink AI gradients
- Glass on every surface
- Glow on every component
- Oversized headings without hierarchical purpose
- Excessive pill-shaped controls
- Random gradients
- Decorative motion without functional meaning
- Gaming-style visual language
- Sterile flat minimalism
- Dense desktop layouts merely scaled down for mobile
- Visual effects that reduce numerical or textual clarity

## 24. Definition of done

An interface is consistent with Aether when:

- The primary task is immediately understandable.
- The visual hierarchy remains clear without effects.
- The selected expressive effect supports the page’s purpose.
- Routine work remains calm and efficient.
- Status and validation do not depend on color.
- Light and dark modes feel intentionally designed.
- Mobile is structurally adapted.
- Reduced motion retains all functionality.
- The interface feels advanced because it behaves intelligently and feels carefully engineered.

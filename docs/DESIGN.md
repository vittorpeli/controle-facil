# Design System Strategy: The Financial Architect
 
## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Orchestrated Ledger."** 
 
Moving beyond simple personal finance tracking, this system is designed as a high-stakes "Financial Operating System." It rejects the cluttered, "gamified" aesthetics of retail banking in favor of a **High-End Editorial** experience. The layout philosophy mirrors the "Bench to Boardroom" transition: rigorous, data-driven precision presented through an elite, minimalist lens. 
 
We break the "template" look by using **intentional asymmetry**—pairing ultra-wide whitespace with razor-sharp typography. By treating the UI as an editorial spread rather than a software dashboard, we elevate the act of wealth management into a professional discipline.
 
---
 
## 2. Colors & Surface Philosophy
The palette is grounded in **Deep Teal (#032126)** and **Mint (#A7D5B8)**, creating a high-contrast, authoritative environment.
 
*   **The "No-Line" Rule:** Standard 1px solid borders for sectioning are strictly prohibited. Section boundaries must be defined solely through background color shifts. For example, a `surface-container-low` section should sit on a `surface` background to create a logical break without visual "noise."
*   **Surface Hierarchy & Nesting:** Treat the UI as physical layers. Use the `surface-container` tiers (Lowest to Highest) to create depth. An inner data card should use `surface-container-highest` while its parent container sits on `surface-container-low`. This "stacked fine paper" approach creates a tactile, premium feel.
*   **The "Glass & Gradient" Rule:** For floating modals or navigation bars, use Glassmorphism. Apply a semi-transparent `surface` color with a 20px-40px backdrop-blur. 
*   **Signature Textures:** Main CTAs and high-level hero sections should utilize a subtle linear gradient transitioning from `primary` (#000405) to `primary-container` (#032126). This provides a "liquid ink" depth that flat colors lack.
 
---
 
## 3. Typography: The Editorial Voice
Our typography is a tripartite system designed to convey authority, narrative, and utility.
 
*   **Display & Headlines (Space Grotesk / Greed Style):** Used for large-scale impact. These are the "Statement" elements. The tight tracking and bold weight suggest a modern, rigorous institutional feel.
*   **Narrative (Noto Serif / Tiempos Text):** This is the soul of the system. Use Noto Serif for insights, financial summaries, and "Boardroom" commentary. It shifts the tone from "App" to "Journal."
*   **UI & Labels (Inter):** Reserved for high-density data, button labels, and navigation. Inter provides the "Operating System" reliability required for complex financial figures.
*   **Data (IBM Plex Mono):** Though subtle, use this for transaction amounts and ledger entries to reinforce the "Financial OS" precision.
 
---
 
## 4. Elevation & Depth
We eschew traditional shadows in favor of **Tonal Layering**.
 
*   **The Layering Principle:** Depth is achieved by stacking. Place a `surface-container-lowest` (#ffffff) card atop a `surface-container-low` (#f1f5f1) background. The 15px radius (1rem) creates a soft, architectural lift.
*   **Ambient Shadows:** If a floating element (like a FAB or Popover) requires a shadow, it must be "Ambient." Use a 48px blur, 0px offset, and 4% opacity of the `on-surface` color. It should feel like a soft glow, not a drop shadow.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline-variant` token at **15% opacity**. This "Ghost Border" provides a hint of structure without interrupting the editorial flow.
 
---
 
## 5. Components
 
### Buttons
*   **Primary:** Pill-shaped (`9999px` radius), width fixed at `200px` for hero actions. Background: `primary-container`. Text: `on-primary`.
*   **Secondary:** Ghost-style with a `surface-container-highest` background and no border.
*   **States:** On hover, primary buttons should shift slightly toward the `secondary` (Mint) tone to indicate activity.
 
### Input Fields & Search
*   **Style:** Minimalist underlines or subtle `surface-variant` backgrounds. 
*   **Focus:** Transition the background to `surface-container-lowest` and apply a 1px "Ghost Border" in Mint (#A7D5B8).
*   **Validation:** Use the `error` (#ba1a1a) color only for text; keep the container subtle.
 
### Cards & Financial Lists
*   **The Divider Rule:** Forbid 1px divider lines between list items. Use **24px–32px of vertical whitespace** or alternating subtle background shifts (`surface` to `surface-container-low`) to separate transactions.
*   **Radii:** All cards must strictly adhere to the `1rem` (15px) corner radius.
 
### Signature Component: The "Wealth Ribbon"
A full-width, low-height component using a `primary-container` background with `on-primary` serif typography. This is used for high-level financial summaries (e.g., "Total Managed Assets"), mimicking a ticker tape but styled with editorial elegance.
 
---
 
## 6. Do’s and Don’ts
 
### Do:
*   **Embrace "Empty" Space:** If a screen feels "too empty," you are likely on the right track. High-end finance is about clarity, not density.
*   **Layer Surfaces:** Always think "Which paper is on top of which?" use the `surface-container` tokens to define the stack.
*   **Mix Typefaces:** Use the Serif for narrative insights and the Sans-Serif for hard data. The tension between them creates the "Premium" feel.
 
### Don’t:
*   **No Heavy Borders:** Never use a 100% opaque border to separate content. Use tonal shifts.
*   **No Default Shadows:** Avoid the "Material Design" look. Our elevation is flat and architectural.
*   **No Standard Grids:** Feel free to offset text to the right or left of a central axis to create the "Orchestra" asymmetric editorial look.
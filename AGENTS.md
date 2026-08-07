# Project Guidelines & Rules (AGENTS.md)

## 1. Project Overview
- **App Name**: Fuel Wise
- **Description**: A focused, single-screen utility app for instant US MPG to L/100km (and vice versa) fuel economy conversion.

## 2. Design Rules
- **Header Aesthetics**: Floating compact dark rounded header (`bg-black text-white`, `rounded-xl`, `py-1.5 px-4`, tight compact height) with a sharp, high-resolution vintage gas pump icon (`w-8 h-8`).
- **Card & Result Layout**: Feature a prominent dark gradient output card (Teal-900 to Emerald-950) with high contrast, large clear numbers, copy-to-clipboard functionality, and fuel efficiency rating badges.
- **Minimalist Scope**: Keep the tool strictly focused on single-screen utility without unnecessary landing sections, marketing banners, or artificial clutter.
- **Color Palette**: Neutral slate background (`bg-slate-50`), crisp white input cards (`bg-white`), and emerald accents for key interactive controls.

## 3. Deployment & Build Guidelines
- **Static Export**: The application uses static HTML export (`output: 'export'`, `unoptimized: true` in `next.config.ts`) compatible with Cloudflare Workers / Pages and static web hosting.
- **Wrangler Configuration**: Static assets are output to `./out` and mapped via `wrangler.json`.
- **State Management**: Keep UI logic synchronous during render to prevent cascading render loops and maintain high performance.

## 4. Strict AI Agent Rules & Guidelines
- **Strict Intent & Scope Execution**:
  - Implement ONLY what is explicitly requested in the user prompt.
  - Do NOT add unsolicited features, secondary pages, extra tabs, navigation menus, or extra layout elements that were not asked for.
  - Strictly follow the exact instructions provided — no extra additions, no omissions.
- **No Fake or Unsolicited Demo Data**:
  - Do NOT generate dummy, fake, or mock sample data on your own initiative.
  - Preserve all real user text, titles, names, and existing data.
  - If a change is requested, update only the targeted parts while preserving all existing real content intact.
- **Precise Code Modifications**:
  - Make exact targeted edits as requested.
  - Do NOT change existing color themes, typography, or UI layouts unless explicitly instructed by the user.

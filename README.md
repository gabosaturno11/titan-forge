# TITAN FORGE V1.2

**Saturno Linguistic Console + Voice System + Claude API Integration + Batch PDF Generator**

## Live Demo
[**https://gabosaturno11.github.io/titan-forge/**](https://gabosaturno11.github.io/titan-forge/)

## OPEN THE APPS

| App | Description | Link |
|-----|-------------|------|
| **SATURNO FORGE** | Main console with voice modes & faders | [Open](https://gabosaturno11.github.io/titan-forge/) |
| **TITAN V1.2** | AI synthesis + PDF export | [Open](https://gabosaturno11.github.io/titan-forge/titan.html) |
| **BATCH GENERATOR** | CSV to 100 PDFs | [Open](https://gabosaturno11.github.io/titan-forge/batch-generator.html) |
| **TRITON Onboarding** | 10-question identity sequence | [Open](https://gabosaturno11.github.io/titan-forge/onboarding.html) |
| **APOAPSIS Writer** | Double-panel markdown editor | [Open](https://gabosaturno11.github.io/titan-forge/writer.html) |
| **Mission Logs** | Task tracking & timeline | [Open](https://gabosaturno11.github.io/titan-forge/logs.html) |

---

## NEW IN V1.2

### Claude API Integration
- Direct AI synthesis from browser
- Stores API key in localStorage (never leaves your machine)
- CORS proxy for browser compatibility

### TITAN Editor
- Full 6-fader Linguistic Console
- 8 Voice Modes with AI-powered transformation
- Professional PDF export with margins, page numbers, headers

### Batch Generator
- Upload CSV with titles + content
- Process 100+ documents automatically
- Download all as ZIP file
- Progress tracking and error handling

---

## Features

### Voice System
8 Modes: `/RawMode`, `/TeacherMode`, `/ProphetMode`, `/PhilosopherMode`, `/MysticMode`, `/RebelMode`, `/CompanionMode`, `/ConfessorMode`

### Master Faders
- F1: Certainty (0-10)
- F2: Formality (0-10)
- F3: Intensity (0-10)
- F4: Intimacy (0-10)
- F5: Abstraction (0-10)
- F6: Density (0-10)

### Preset Stacks
- Gentle Authority
- Trust-First Explanation
- Non-Coercive Persuasion
- High-Precision Warmth

---

## Files

```
titan-forge/
├── index.html           # Main Forge console
├── titan.html           # TITAN V1.2 (AI + PDF)
├── batch-generator.html # Batch PDF generator
├── writer.html          # APOAPSIS writer
├── onboarding.html      # TRITON sequence (LOCKED)
├── logs.html            # Mission control
├── js/
│   ├── api-config.js    # API key management
│   └── claude-api.js    # Claude API integration
└── README.md
```

## Setup

1. Open any HTML file in browser
2. Click SETTINGS to add your Claude API key
3. Start synthesizing

**Note:** Claude API requires a CORS proxy for browser use. Default proxy works for testing.
For production, deploy your own proxy or use a backend server.

---

## Design Rules

```css
background: #0a0a0a;
font-family: 'JetBrains Mono', monospace;
accent: #00ffcc;
```

- Dark theme only
- No gradients
- No rounded corners > 4px
- Industrial aesthetic

---

**Creator:** Gabo Saturno
**Stack:** Claude Code + Claude API
**Updated:** January 31, 2026
**Status:** LIVE

# BitHack '26
> **Build. Break. Breakthrough.** — 36-hour hackathon by Bit by Bit Club, VIT Bhopal · April 15–16, 2026

---

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JS (ES Modules) |
| Animations | GSAP 3.12 (ScrollTrigger, SplitText), Canvas API |
| Typography | Syne, DM Sans, JetBrains Mono (Google Fonts) |
| Database | Google Firebase Firestore v10 |
| Hosting | Firebase Hosting / Vercel / Netlify (static) |

---

## Project Structure
```
bithack-26/
├── index.html       # Public landing page + registration form
├── admin.html       # Password-protected admin dashboard
├── css/style.css    # Shared styles for both pages
└── js/script.js     # Shared utilities (cursor, nav, animations)
```

---

## Features

### Public Site [View folder](`index.html`)

- **Navbar** — fixed, smooth-scroll links, mobile hamburger menu
- **Hero** — animated canvas background, gradient orbs, custom cursor, live countdown timer to event date, CTA buttons
- **Stats Strip** — count-up animations: 500+ Participants, 36H, 8+ Domains, ₹50K+ Prize Pool
- **About** — event description with 3 highlight cards (Real-World Problems, Expert Mentorship, Win & Get Recognized)
- **Stages** — 3-stage timeline: Ideation → Prototype → Demo & Judging
- **Domains** — 8 problem domain cards: Cybersecurity, Healthcare, AI/ML, Sustainability, EdTech, Smart Cities, FinTech, Open Innovation
- **Prizes** — 1st, 2nd, 3rd place prize cards + special category awards
- **Registration Form**
  - Section 01: Team Name, College Name, Email, Contact, Team Size (2–5), Problem Domain
  - Section 02: Dynamic member fields (Name, Reg No., Email) — auto-generated based on team size
  - Client-side field validation with inline errors
  - Loading spinner on submit, success screen on completion
  - Data written to Firestore with a server timestamp
- **Contact** — Event Coordinator, Technical Lead, and General Queries cards
- **Footer** — branding and credits

### Admin Dashboard [View folder](`admin.html`)

- **Login** — password-protected overlay, Enter key support, error message on wrong password
- **Stats Bar** — Total Teams, Total Members, Avg Team Size, Top Domain (all computed from live Firestore data)
- **Team Cards** — each card shows Team Name, College, Domain badge, team size, contact info, full member list with avatars, and registration timestamp
- **Search** — real-time filter across team name, college, domain, member names, reg numbers, and emails
- **Data Controls** — Refresh button to re-fetch without page reload; teams sorted newest-first; loading state and error handling

---

## Live Link
- **Website is live at:**   https://bit-hack-2026.vercel.app


---

## Firebase Setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com) and enable Firestore
2. Paste your config into the `<script type="module">` block in **both** `index.html` and `admin.html`:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```
3. Set Firestore Rules (Console → Firestore → Rules tab):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /registrations/{docId} {
      allow write: if true;
      allow read:  if true;
    }
  }
}
```

### Firestore Document Structure (`registrations` collection)
```json
{
  "teamName": "Team Nexus",
  "collegeName": "VIT Bhopal University",
  "collegeEmail": "nexus@vitstudent.ac.in",
  "contact": "+91 98765 43210",
  "teamSize": 4,
  "domain": "AI/ML",
  "members": [
    { "name": "Riya Sharma", "regNo": "21BCE1001", "email": "riya@vitstudent.ac.in" }
  ],
  "createdAt": "Firestore Timestamp"
}
```

---

## Deployment
No build step needed — deploy static files directly.
- **Firebase Hosting:** `firebase init hosting` → `firebase deploy`
- **Vercel / Netlify:** Drag and drop the project folder, no build command needed

---


## Known Issues & Fixes

| Issue | Fix |
|---|---|
| Admin dashboard not loading data | Removed misplaced `<script>` tag between `</head>` and `<body>` and stray duplicate closing tags that aborted the Firebase module script |
| `Missing or insufficient permissions` | Set `allow read: if true` in Firestore Security Rules via Firebase Console |

---

*© 2026 Bit by Bit Club · VIT Bhopal University · Built with ⚡ by the Bit by Bit Club Tech Team*

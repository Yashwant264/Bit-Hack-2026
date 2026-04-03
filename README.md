# B² BitHack '26
> **Build. Break. Breakthrough.** — A 36-hour hackathon by Bit by Bit Club, VIT Bhopal · April 15–16, 2026

---

## Tech Stack
- **Frontend:** HTML, CSS, Vanilla JS (ES Modules)
- **Animations:** GSAP 3.12 (ScrollTrigger, SplitText), Canvas API
- **Backend:** Google Firebase Firestore v10
- **Fonts:** Syne, DM Sans, JetBrains Mono

---

## Features

### Public Site (`index.html`)
- Animated hero with canvas background, gradient orbs & custom cursor
- Live countdown timer to registration deadline
- Sections: About, 3-Stage Timeline, 8 Problem Domains, Prizes
- **Registration form** — dynamic member fields based on team size (2–5), client-side validation, Firebase write on submit, success screen
- Responsive navbar with mobile hamburger menu
- Scroll-triggered GSAP animations throughout

### Admin Dashboard (`admin.html`)
- Password-protected login
- Stats: Total Teams, Total Members, Avg Team Size, Top Domain
- Team cards with full member details (name, reg no., email, timestamp)
- Real-time search across team name, college, domain, and member info
- Refresh button to re-fetch latest data from Firestore

---

## Firebase Setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com) and enable Firestore
2. Paste your Firebase config into both `index.html` and `admin.html`
3. Set Firestore rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /registrations/{docId} {
      allow write: if true;
      allow read: if true;
    }
  }
}
```

### Firestore Document Structure (`registrations` collection)
| Field | Type |
|---|---|
| `teamName` | string |
| `collegeName` | string |
| `collegeEmail` | string |
| `contact` | string |
| `teamSize` | number |
| `domain` | string |
| `members` | array `{ name, regNo, email }` |
| `createdAt` | server timestamp |

---

## File Structure
```
├── index.html       # Public landing page + registration form
├── admin.html       # Admin dashboard
├── css/style.css    # Shared styles
└── js/script.js     # Shared JS utilities
```

---

## Setup
```bash
# No build step needed — pure static files
# Just deploy to Firebase Hosting, Vercel, Netlify, or any CDN
```

---

*© 2026 Bit by Bit Club · VIT Bhopal University* 

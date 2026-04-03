// ============================================================
//  BITHACK '26 — MAIN SCRIPT
//  Firebase + Animations + Form + AI Validator + Countdown
// ============================================================
gsap.registerPlugin(ScrollTrigger)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ── FIREBASE CONFIG ────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyDkBRbDVm-avfc75LGM3kvcDg9JDpS19fs",
  authDomain: "bithack-2026.firebaseapp.com",
  projectId: "bithack-2026",
  storageBucket: "bithack-2026.firebasestorage.app",
  messagingSenderId: "125905800324",
  appId: "1:125905800324:web:eec0aae1e3e7b94e24c6d1"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ── CUSTOM CURSOR ──────────────────────────────────────────
const cursor         = document.getElementById("cursor");
const cursorFollower = document.getElementById("cursorFollower");

if (cursor && cursorFollower) {
  let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

  document.addEventListener("mousemove", e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.left = mouseX + "px";
    cursor.style.top  = mouseY + "px";
  });

  function animateCursor() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.left = followerX + "px";
    cursorFollower.style.top  = followerY + "px";
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll("a, button, .domain-card, .glass-card, select, input, textarea").forEach(el => {
    el.addEventListener("mouseenter", () => {
      cursor.style.transform = "translate(-50%,-50%) scale(2)";
      cursorFollower.style.width  = "56px";
      cursorFollower.style.height = "56px";
      cursorFollower.style.opacity = "0.5";
    });
    el.addEventListener("mouseleave", () => {
      cursor.style.transform = "translate(-50%,-50%) scale(1)";
      cursorFollower.style.width  = "32px";
      cursorFollower.style.height = "32px";
      cursorFollower.style.opacity = "1";
    });
  });
}

// ── NAV SCROLL ────────────────────────────────────────────
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 50);
});

// ── MOBILE MENU ───────────────────────────────────────────
const hamburger  = document.getElementById("navHamburger");
const mobileMenu = document.getElementById("mobileMenu");

hamburger?.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  mobileMenu.classList.toggle("open");
});

document.querySelectorAll(".mm-link").forEach(link => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    mobileMenu.classList.remove("open");
  });
});

// ── HERO CANVAS ───────────────────────────────────────────
function initHeroCanvas() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const PARTICLE_COUNT = 80;
  const particles = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r:  Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
      color: Math.random() > 0.5 ? "#6c47ff" : "#00f5a0"
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, "0");
      ctx.fill();
    });

    particles.forEach((p, i) => {
      for (let j = i + 1; j < particles.length; j++) {
        const q  = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(108,71,255,${0.06 * (1 - d / 100)})`;
          ctx.lineWidth   = 0.5;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(draw);
  }
  draw();
}
initHeroCanvas();

// ── SCROLL ANIMATIONS ─────────────────────────────────────
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = parseInt(el.dataset.delay || "0");
        setTimeout(() => {
          el.classList.add("visible");
        }, delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

  document.querySelectorAll("[data-scroll]").forEach(el => observer.observe(el));

  // About cards
  const cardObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        cardObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll(".about-card").forEach(card => cardObs.observe(card));
}
initScrollAnimations();

// ── STAT COUNTER ──────────────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const end = parseInt(el.dataset.count);
      let   cur = 0;
      const step = Math.ceil(end / 40);
      const iv = setInterval(() => {
        cur += step;
        if (cur >= end) { cur = end; clearInterval(iv); }
        el.textContent = cur;
      }, 30);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
}
initCounters();

// ── GSAP SCROLL EFFECTS ───────────────────────────────────
window.addEventListener("load", () => {
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    // Hero parallax
    gsap.to(".hero-gradient-orb", {
      yPercent: -30,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1.5 }
    });

    gsap.to(".hero-content", {
      yPercent: 20,
      opacity: 0.4,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "center top", end: "bottom top", scrub: 1 }
    });

    // Stage cards entrance
    document.querySelectorAll(".stage-item").forEach((el, i) => {
      gsap.fromTo(el, {
        x: i % 2 === 0 ? -60 : 60,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none none" }
      });
    });

    // Domain cards
    gsap.fromTo(".domain-card", {
      y: 40, opacity: 0, stagger: 0.05, duration: 0.6,
      ease: "power2.out",
      scrollTrigger: { trigger: ".domains-grid", start: "top 80%" }
    });

    // Prize cards
    gsap.fromTo(".prize-card", {
      y: 60, opacity: 0, stagger: 0.12, duration: 0.7,
      ease: "back.out(1.2)",
      scrollTrigger: { trigger: ".prizes-grid", start: "top 80%" }
    });

    // Stats strip
    gsap.fromTo(".stat-item", {
      y: 30, opacity: 0, stagger: 0.08, duration: 0.5,
      ease: "power2.out",
      scrollTrigger: { trigger: ".stats-strip", start: "top 90%" }
    });
  }
});

// ── COUNTDOWN TIMER ───────────────────────────────────────
function initCountdown() {

  const targetDate = new Date("2026-04-10T23:59:59").getTime(); // 🔥 change date if needed

  function updateTimer() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      document.getElementById("countdown").innerHTML = "Event Started!";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById("days").innerText = days;
    document.getElementById("hours").innerText = hours;
    document.getElementById("minutes").innerText = minutes;
    document.getElementById("seconds").innerText = seconds;
  }

  setInterval(updateTimer, 1000);
  updateTimer();
}

// ── DYNAMIC MEMBER FIELDS ─────────────────────────────────
const teamSizeSelect    = document.getElementById("teamSize");
const membersContainer  = document.getElementById("membersContainer");

teamSizeSelect?.addEventListener("change", () => {
  const size = parseInt(teamSizeSelect.value) || 0;
  renderMemberFields(size);
});

function renderMemberFields(count) {
  if (!membersContainer) return;
  membersContainer.innerHTML = "";
  for (let i = 1; i <= count; i++) {
    const block = document.createElement("div");
    block.className = "member-block";
    block.innerHTML = `
      <div class="member-header">
        <span class="member-label" data-num="${i}">Team Member ${i}${i === 1 ? " (Leader)" : ""}</span>
      </div>
      <div class="member-grid">
        <div class="form-group">
          <label>Full Name <span class="req">*</span></label>
          <input type="text" name="member-name-${i}" placeholder="Full Name" required />
          <span class="form-error" id="err-member-name-${i}"></span>
        </div>
        <div class="form-group">
          <label>Registration Number <span class="req">*</span></label>
          <input type="text" name="member-reg-${i}" placeholder="21BIT0001" required />
          <span class="form-error" id="err-member-reg-${i}"></span>
        </div>
        <div class="form-group">
          <label>Email Address <span class="req">*</span></label>
          <input type="email" name="member-email-${i}" placeholder="member@vitbhopal.ac.in" required />
          <span class="form-error" id="err-member-email-${i}"></span>
        </div>
      </div>`;
    membersContainer.appendChild(block);
  }
}

// ── FORM VALIDATION & SUBMISSION ──────────────────────────
const regForm  = document.getElementById("registrationForm");
const formSucc = document.getElementById("formSuccess");
const submitBtn= document.getElementById("submitBtn");
const submitBtnText = document.getElementById("submitBtnText");
const btnSpinner    = document.getElementById("btnSpinner");

function setError(id, msg) {
  const el = document.getElementById("err-" + id);
  if (!el) return;
  el.textContent = msg;
}
function clearErrors() {
  document.querySelectorAll(".form-error").forEach(e => e.textContent = "");
  document.querySelectorAll(".error").forEach(e => e.classList.remove("error"));
}

function validateField(id, value, label, type = "text") {
  if (!value.trim()) { setError(id, `${label} is required.`); return false; }
  if (type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    setError(id, "Enter a valid email address."); return false;
  }
  if (type === "tel" && !/^[6-9]\d{9}$/.test(value.replace(/\D/g, ""))) {
    setError(id, "Enter a valid 10-digit Indian mobile number."); return false;
  }
  return true;
}

regForm?.addEventListener("submit", async e => {
  e.preventDefault();
  clearErrors();

  let valid = true;
  const teamName    = document.getElementById("teamName").value;
  const collegeName = document.getElementById("collegeName").value;
  const collegeEmail= document.getElementById("collegeEmail").value;
  const contact     = document.getElementById("contact").value;
  const teamSize    = document.getElementById("teamSize").value;
  const domain      = document.getElementById("domain").value;
  const termsCheck  = document.getElementById("termsCheck");

  if (!validateField("teamName",    teamName,    "Team Name"))     valid = false;
  if (!validateField("collegeName", collegeName, "College Name"))  valid = false;
  if (!validateField("collegeEmail",collegeEmail,"College Email","email")) valid = false;
  if (!validateField("contact",     contact,     "Contact Number","tel")) valid = false;

  if (!teamSize) { setError("teamSize", "Please select a team size."); valid = false; }
  if (!domain)   { setError("domain",   "Please select a domain."); valid = false; }

  const size = parseInt(teamSize) || 0;
  const members = [];

  for (let i = 1; i <= size; i++) {
    const name  = document.querySelector(`[name="member-name-${i}"]`)?.value || "";
    const reg   = document.querySelector(`[name="member-reg-${i}"]`)?.value  || "";
    const email = document.querySelector(`[name="member-email-${i}"]`)?.value|| "";

    if (!validateField(`member-name-${i}`, name,  `Member ${i} Name`))            valid = false;
    if (!validateField(`member-reg-${i}`,  reg,   `Member ${i} Registration No.`)) valid = false;
    if (!validateField(`member-email-${i}`,email, `Member ${i} Email`, "email"))   valid = false;

    members.push({ name: name.trim(), regNo: reg.trim().toUpperCase(), email: email.trim() });
  }

  if (!termsCheck.checked) {
    setError("terms", "You must agree to the rules before registering.");
    valid = false;
  }

  if (!valid) return;

  // Submit
  submitBtnText.style.display = "none";
  btnSpinner.style.display    = "block";
  submitBtn.disabled = true;

  try {
    await addDoc(collection(db, "registrations"), {
      teamName:    teamName.trim(),
      collegeName: collegeName.trim(),
      collegeEmail:collegeEmail.trim().toLowerCase(),
      contact:     contact.trim(),
      teamSize:    size,
      domain:      domain,
      members:     members,
      createdAt:   serverTimestamp()
    });

    regForm.style.display     = "none";
    formSucc.style.display    = "block";
    formSucc.scrollIntoView({ behavior: "smooth", block: "center" });

  } catch (err) {
    console.error("Firebase error:", err);
    alert("Registration failed. Please check your connection and Firebase configuration, then try again.");
    submitBtnText.style.display = "inline";
    btnSpinner.style.display    = "none";
    submitBtn.disabled = false;
  }
});

window.resetForm = function() {
  regForm.reset();
  membersContainer.innerHTML = "";
  regForm.style.display   = "block";
  formSucc.style.display  = "none";
  submitBtnText.style.display = "inline";
  btnSpinner.style.display    = "none";
  submitBtn.disabled = false;
};

// ── AI IDEA VALIDATOR ─────────────────────────────────────
const FEEDBACK_BANK = {
  strong: [
    "Your idea demonstrates strong real-world applicability and shows clear evidence of problem-solution fit. The scope is appropriate for a 36-hour hackathon and the technical approach appears feasible with modern tooling.",
    "Excellent concept! This shows genuine innovation in addressing a meaningful problem. Focus your prototype on the core value proposition and avoid scope creep — judges reward depth over breadth.",
    "This is a compelling idea with tangible impact potential. Your approach leverages relevant technology and addresses an underserved need. Make sure your demo clearly shows the end-user journey."
  ],
  good: [
    "Solid concept with good potential. To strengthen your submission, sharpen your target user definition and quantify the problem's scale. Consider adding a unique differentiator that sets you apart from existing solutions.",
    "Good foundation, but refine your unique value proposition. Ask yourself: why would a user choose your solution over existing alternatives? A clear answer to that question will elevate your pitch significantly.",
    "A viable idea with room to grow. Strengthen the technical feasibility angle by being specific about your tech stack. Judges appreciate teams who know exactly what they're building and how."
  ],
  moderate: [
    "The idea has merit but needs sharper focus. Try narrowing your target audience to a more specific user persona — solving one problem exceptionally well beats solving many problems poorly in a hackathon context.",
    "Consider revisiting the problem statement before the hackathon. A stronger articulation of the 'why' will help your team build with clearer direction and impress judges during the Q&A round.",
    "This concept would benefit from more concrete problem framing. Ground it in real data or user research if possible. Think about: who specifically suffers from this problem and how often?"
  ]
};

const POSITIVE_SIGNALS = [
  "real-time", "offline", "rural", "machine learning", "ai", "sensor", "iot", "prediction",
  "alert", "automated", "accessible", "low bandwidth", "gamification", "multilingual",
  "crowdsource", "alternative data", "anomaly", "adaptive", "personali", "analytics",
  "blockchain", "api", "dashboard", "mobile", "cross-platform", "open source", "privacy",
  "security", "scalable", "cloud", "edge computing", "recommendation", "nlp", "cv"
];

const NEGATIVE_SIGNALS = ["todo", "basic", "simple website", "just a form", "only shows", "just displays"];

const TAG_POOL = [
  "B2C Product", "B2B SaaS", "API-first", "Mobile-native", "Web Platform",
  "Data-driven", "AI-powered", "Offline-capable", "Open Source", "Social Impact",
  "Hardware+Software", "Cloud-native", "PWA", "Multi-platform", "Real-time",
  "Community-led", "EdTech", "HealthTech", "FinTech", "GovTech"
];

window.validateIdea = function() {
  const text    = document.getElementById("ideaInput").value.trim();
  const domain  = document.getElementById("domainSelect").value;
  const result  = document.getElementById("validatorResult");
  const loading = document.getElementById("validatorLoading");

  if (text.length < 30) {
    alert("Please describe your idea in at least 30 characters for a meaningful analysis.");
    return;
  }

  result.style.display  = "none";
  loading.style.display = "block";

  setTimeout(() => {
    const lower = text.toLowerCase();

    // Count signals
    let positiveHits = 0;
    POSITIVE_SIGNALS.forEach(s => { if (lower.includes(s)) positiveHits++; });
    let negativeHits = 0;
    NEGATIVE_SIGNALS.forEach(s => { if (lower.includes(s)) negativeHits++; });

    const wordCount   = text.split(/\s+/).length;
    const lengthScore = Math.min(wordCount / 80, 1);
    const domainBonus = domain ? 5 : 0;
    const signal      = Math.min(positiveHits / 4, 1);

    // Score each dimension (0–100)
    const innovation  = Math.round(40 + signal * 35 + lengthScore * 10 + Math.random() * 15 - negativeHits * 8);
    const feasibility = Math.round(50 + lengthScore * 20 + signal * 15 + Math.random() * 15 - negativeHits * 10);
    const impact      = Math.round(35 + signal * 40 + domainBonus + lengthScore * 10 + Math.random() * 10);
    const marketFit   = Math.round(40 + signal * 30 + lengthScore * 15 + Math.random() * 15 - negativeHits * 5);

    const clamp = v => Math.min(100, Math.max(20, v));
    const scores = {
      innovation:  clamp(innovation),
      feasibility: clamp(feasibility),
      impact:      clamp(impact),
      marketFit:   clamp(marketFit)
    };

    const avg = (scores.innovation + scores.feasibility + scores.impact + scores.marketFit) / 4;

    let tier, badge;
    if (avg >= 75)      { tier = "strong";   badge = "Strong Idea 🔥"; }
    else if (avg >= 58) { tier = "good";     badge = "Good Potential ✨"; }
    else                { tier = "moderate"; badge = "Needs Refinement 🔧"; }

    // Pick random feedback
    const feedback = FEEDBACK_BANK[tier][Math.floor(Math.random() * 3)];

    // Pick 3–5 random tags
    const shuffled = TAG_POOL.sort(() => Math.random() - 0.5);
    const tags = shuffled.slice(0, 3 + Math.floor(Math.random() * 3));

    loading.style.display = "none";

    // Render
    document.getElementById("resultBadge").textContent  = badge;
    document.getElementById("resultBadge").className    = "result-badge " + tier;
    document.getElementById("resultFeedback").textContent = feedback;

    const animateBar = (barId, valId, score) => {
      const bar = document.getElementById(barId);
      const val = document.getElementById(valId);
      if (!bar || !val) return;
      val.textContent = score + "%";
      setTimeout(() => { bar.style.width = score + "%"; }, 50);
    };

    animateBar("scoreInnovation",  "scoreInnovationVal",  scores.innovation);
    animateBar("scoreFeasibility", "scoreFeasibilityVal", scores.feasibility);
    animateBar("scoreImpact",      "scoreImpactVal",      scores.impact);
    animateBar("scoreMarket",      "scoreMarketVal",      scores.marketFit);

    // Bars reset before animating
    document.querySelectorAll(".score-bar").forEach(b => b.style.width = "0%");
    setTimeout(() => {
      animateBar("scoreInnovation",  "scoreInnovationVal",  scores.innovation);
      animateBar("scoreFeasibility", "scoreFeasibilityVal", scores.feasibility);
      animateBar("scoreImpact",      "scoreImpactVal",      scores.impact);
      animateBar("scoreMarket",      "scoreMarketVal",      scores.marketFit);
    }, 100);

    const tagsEl = document.getElementById("resultTags");
    tagsEl.innerHTML = tags.map(t => `<span class="result-tag">${t}</span>`).join("");

    result.style.display = "block";

  }, 1800 + Math.random() * 800);
};

// ── SMOOTH ANCHOR LINKS ───────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 72;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

console.log(`%c
██████╗ ██╗████████╗██╗  ██╗ █████╗  ██████╗██╗  ██╗
██╔══██╗██║╚══██╔══╝██║  ██║██╔══██╗██╔════╝██║ ██╔╝
██████╔╝██║   ██║   ███████║███████║██║     █████╔╝
██╔══██╗██║   ██║   ██╔══██║██╔══██║██║     ██╔═██╗
██████╔╝██║   ██║   ██║  ██║██║  ██║╚██████╗██║  ██╗
╚═════╝ ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
'26 — Bit by Bit Club · VIT Bhopal
`, "color: #6c47ff; font-family: monospace;");

initCountdown();

gsap.fromTo("select", {
  opacity: 0,
  y: 30,
  duration: 1,
  stagger: 0.2
});

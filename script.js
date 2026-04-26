// ==================== PLAYBOOK DATA ====================

// Objection responses
const objectionResponses = {
  price: [
    "Acknowledge value → Reframe to TCO → Offer payment terms",
    "Ask discovery question → 'What's your budget based on?' → Create custom package",
    "Quantify ROI → Show 6-month payback → Propose trial"
  ],
  timeline: [
    "Create urgency → 'Cost of delay is X per month' → Fast-track pilot",
    "Ask champion → 'What's blocking the timeline?' → Remove blockers",
    "Offer parallel path → 'Run RFP + pilot simultaneously' → Win faster"
  ],
  competitor: [
    "Ask specifics → 'What specifically attracted you to them?' → Reposition",
    "Share intel → 'Here's what they DON'T include' → Highlight gaps",
    "Reference win → 'We replaced them at similar company' → Build confidence"
  ],
  default: [
    "Pause and listen → 'Tell me more about that concern'",
    "Ask clarifying questions → Isolate the real objection",
    "Reframe as opportunity → 'That's actually why our approach works'"
  ]
};

// Deal temperature assessment questions
const dealCheckQuestions = [
  { q: "Does the buyer have budget allocated?", weight: 25 },
  { q: "Have you met the economic buyer?", weight: 25 },
  { q: "Is there a defined timeline for decision?", weight: 20 },
  { q: "Do you have a champion inside?", weight: 20 },
  { q: "Is there a compelling event/pain driving urgency?", weight: 10 }
];

// Opening lines by persona
const openingLines = {
  cfo: [
    "I noticed your Q3 spend on [category] is up 30%. Most CFOs we work with are exploring ways to optimize that line item without sacrificing quality.",
    "Quick thought: companies at your scale typically waste 15-20% on implementation. Have you looked at that cost center recently?",
    "I was reviewing your latest filing. Your gross margin trend caught my attention. Most companies in your space aren't seeing that kind of growth. How are you doing it?"
  ],
  coo: [
    "Your operations team probably deals with 5-10 different tools daily. We've helped teams like yours consolidate that down to 2. Curious if that's a pain point?",
    "I work with a lot of COOs. The #1 thing they tell me is they're drowning in manual processes. Are you facing that?",
    "Your team size suggests you're scaling. Most companies hit a wall around this size unless they upgrade their operations infrastructure. Is that coming up for you?"
  ],
  cto: [
    "I saw you're running on [tech stack]. A lot of CTOs we work with wrestled with tech debt vs. scaling. How are you balancing that?",
    "Your API requirements are probably getting more complex. Most teams at your scale shift from point solutions to platforms. Where are you in that journey?",
    "Your infrastructure is likely the constraint now, not the people. Have you evaluated [solution type] for that layer?"
  ],
  executive: [
    "Your growth story is impressive. At companies like yours, the next inflection point usually comes from [outcome]. How are you thinking about that?",
    "I work with peer companies who've hit $X revenue. The ones who scaled fastest all did [specific thing]. Worth a 15-min conversation?",
    "Your market position is strong. The companies that maintain that edge usually get intentional about [strategic focus]. Is that on your 2026 roadmap?"
  ]
};

// Scenario data for practice
const scenarios = {
  budget: {
    desc: "Fortune 500 operations team asking about pricing. They've requested a discount.",
    clientStatement: "Your solution sounds great, but your pricing is 35% higher than Vendor X. Can you match their price or we'll need to look elsewhere."
  },
  champion: {
    desc: "Your internal champion is stalled. Finance has blocked advancement.",
    clientStatement: "I love this solution and fought hard for it, but finance is pushing back. They want to table this until next year. I hate to say it but I think we're stuck."
  },
  competitor: {
    desc: "Prospect is wavering. Competitor just undercut your price.",
    clientStatement: "We were leaning toward your solution until [Competitor] came in at half your price. We need to know why we should pay double."
  },
  procurement: {
    desc: "Procurement team has called an RFP. You need to stay in the deal.",
    clientStatement: "Our procurement team requires an RFP for any deal over $500K. I know it adds 60 days but it's non-negotiable. Can you participate?"
  }
};

// ==================== DOM ELEMENTS ====================
const chips = Array.from(document.querySelectorAll(".chip"));
const clientTactic = document.getElementById("clientTactic");
const focusModeBtn = document.getElementById("focusModeBtn");
const panels = Array.from(document.querySelectorAll(".panel"));

// Practice tools
const objectionInput = document.getElementById("objectionInput");
const objectionBtn = document.getElementById("objectionBtn");
const objectionOutput = document.getElementById("objectionOutput");

const dealCheckBtn = document.getElementById("dealCheckBtn");
const dealCheckOutput = document.getElementById("dealCheckOutput");

const buyerType = document.getElementById("buyerType");
const openingBtn = document.getElementById("openingBtn");
const openingOutput = document.getElementById("openingOutput");

// Scenario practice
const scenarioBtns = document.querySelectorAll(".scenario-btn");
const scenarioContent = document.getElementById("scenarioContent");
const clientStatement = document.getElementById("clientStatement");
const userResponse = document.getElementById("userResponse");
const submitResponseBtn = document.getElementById("submitResponseBtn");
const feedbackArea = document.getElementById("feedbackArea");
const scenarioDesc = document.querySelector(".scenario-desc");

// Journal
const callDate = document.getElementById("callDate");
const callOutcome = document.getElementById("callOutcome");
const callNotes = document.getElementById("callNotes");
const saveCallBtn = document.getElementById("saveCallBtn");
const callLog = document.getElementById("callLog");

// Tracker
const practiceCount = document.getElementById("practiceCount");
const weekTotal = document.getElementById("weekTotal");
const masteryFill = document.getElementById("masteryFill");
const masteryText = document.getElementById("masteryText");

let currentScenario = "budget";
let practiceStats = {
  today: 0,
  week: 0,
  mastery: 35
};

// ==================== DIFFICULT CLIENTS TACTICS ====================
const difficultClientTactics = {
  price:
    "Acknowledge, then reframe to TCO.\n" +
    "Say: 'Your pricing concern is valid. Let me show you total value over 12 months, not just upfront cost.'\n" +
    "Action: Compare cost-per-outcome with competitor. Emphasize implementation support ROI.\n" +
    "Result: Typically closes at 85% of ask or higher.",

  skeptical:
    "Lower resistance with evidence and curiosity.\n" +
    "Say: 'What would you need to see to gain confidence this is low-risk?'\n" +
    "Action: Share 2 case studies from similar company size. Offer small pilot with guaranteed metrics.\n" +
    "Result: Converts to 68% win rate in RFP situations.",

  silent:
    "Draw out intent with binary prompts and active listening.\n" +
    "Say: 'Is the hesitation more about timing, fit, or something else?'\n" +
    "Action: Pause. Summarize back what you heard. Ask permission to address concerns.\n" +
    "Result: Uncovers hidden blockers. Breaks stalled deals.",

  urgent:
    "Match pace without losing structure.\n" +
    "Say: 'I can keep this to 5 minutes: fit, timeline, next step. Let's do this fast.'\n" +
    "Action: Use concise bullets. End with clear action request and deadline.\n" +
    "Result: Captures deal momentum, reduces decision friction."
};

// ==================== OBJECTION HANDLER ====================
function handleObjection() {
  const objection = objectionInput.value.trim().toLowerCase();
  let responses = [];

  if (objection.includes("price") || objection.includes("cost")) {
    responses = objectionResponses.price;
  } else if (objection.includes("timeline") || objection.includes("time")) {
    responses = objectionResponses.timeline;
  } else if (objection.includes("competitor") || objection.includes("alternative")) {
    responses = objectionResponses.competitor;
  } else {
    responses = objectionResponses.default;
  }

  objectionOutput.innerHTML = `
    <div style="font-weight: 700; margin-bottom: 0.8rem; color: var(--accent);">📌 3 Response Options:</div>
    ${responses.map((r, i) => `<div style="margin: 0.6rem 0; padding: 0.6rem; background: rgba(255,255,255,0.5); border-radius: 6px;"><strong>Option ${i + 1}:</strong> ${r}</div>`).join("")}
  `;

  practiceStats.today++;
  practiceStats.week++;
  updateTracker();
}

// ==================== DEAL TEMPERATURE CHECK ====================
function startDealCheck() {
  dealCheckOutput.innerHTML = `
    <div style="display: grid; gap: 1rem;">
      ${dealCheckQuestions.map((item, i) => `
        <div style="padding: 0.8rem; background: rgba(22,24,24,0.04); border-radius: 8px;">
          <p style="margin: 0 0 0.5rem; font-size: 0.9rem;"><strong>Q${i + 1}:</strong> ${item.q}</p>
          <div style="display: flex; gap: 0.4rem;">
            <button class="deal-answer-btn" data-index="${i}" data-answer="yes" style="flex: 1; padding: 0.5rem; background: rgba(15,118,110,0.1); border: 1px solid var(--accent-2); border-radius: 6px; cursor: pointer; font-weight: 600;">Yes</button>
            <button class="deal-answer-btn" data-index="${i}" data-answer="no" style="flex: 1; padding: 0.5rem; background: rgba(232,93,4,0.1); border: 1px solid var(--accent); border-radius: 6px; cursor: pointer; font-weight: 600;">No</button>
          </div>
        </div>
      `).join("")}
    </div>
  `;

  document.querySelectorAll(".deal-answer-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.style.background = btn.dataset.answer === "yes" ? "var(--accent-2)" : "var(--accent)";
      btn.style.color = "#fff";
      btn.disabled = true;
    });
  });
}

// ==================== OPENING LINE GENERATOR ====================
function generateOpening() {
  const persona = buyerType.value || "executive";
  const lines = openingLines[persona];
  const selected = lines[Math.floor(Math.random() * lines.length)];

  openingOutput.innerHTML = `
    <div style="display: grid; gap: 0.8rem;">
      <div style="padding: 0.8rem; background: rgba(15,118,110,0.08); border-left: 3px solid var(--accent-2); border-radius: 6px;">
        <p style="margin: 0; font-size: 0.9rem; line-height: 1.6;">"${selected}"</p>
      </div>
      <div style="font-size: 0.85rem; color: rgba(22,24,24,0.7);">
        <strong>Why it works:</strong> It demonstrates research + insight, not a generic pitch. It gets them thinking about their business, not your product.
      </div>
    </div>
  `;

  practiceStats.today++;
  updateTracker();
}

// ==================== SCENARIO PRACTICE ====================
scenarioBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    scenarioBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentScenario = btn.dataset.scenario;
    loadScenario();
    userResponse.value = "";
    feedbackArea.className = "feedback-hidden";
  });
});

function loadScenario() {
  const scenario = scenarios[currentScenario];
  scenarioDesc.textContent = scenario.desc;
  clientStatement.textContent = scenario.clientStatement;
}

function submitResponse() {
  const response = userResponse.value.trim();
  if (!response) {
    alert("Please type a response first.");
    return;
  }

  const feedback = generateFeedback(response, currentScenario);
  feedbackArea.className = "feedback-visible";
  feedbackArea.innerHTML = `
    <div class="feedback-score">🎯 Response Score: ${feedback.score}/10</div>
    <div class="feedback-tips">
      <strong>Feedback:</strong>
      <ul>${feedback.tips.map(t => `<li>${t}</li>`).join("")}</ul>
    </div>
    <div style="margin-top: 1rem; font-weight: 600; color: var(--accent-2);">Next Move: ${feedback.nextMove}</div>
  `;

  practiceStats.today++;
  practiceStats.mastery = Math.min(100, practiceStats.mastery + 3);
  updateTracker();
}

function generateFeedback(response, scenario) {
  const hasQuestion = response.includes("?");
  const hasAcknowledge = response.toLowerCase().includes("understand") || response.toLowerCase().includes("hear");
  const isShort = response.length < 50;
  const isLong = response.length > 200;

  let score = 6;
  let tips = [];
  let nextMove = "";

  if (hasAcknowledge) {
    score += 2;
    tips.push("✓ Strong empathy opening. You established rapport.");
  } else {
    tips.push("Add empathy first: 'I hear you...' or 'That makes sense...'");
  }

  if (hasQuestion) {
    score += 1;
    tips.push("✓ Good discovery approach. Asking questions builds engagement.");
  } else {
    tips.push("End with a question to keep them engaged and uncover real concerns.");
  }

  if (isShort) {
    tips.push("Expand your response with specific value statements or examples.");
  }
  if (isLong && !isShort) {
    tips.push("Tighten this up. Sales conversations thrive on brevity and clarity.");
  }

  score = Math.max(3, Math.min(10, score));

  const nextMoves = {
    budget: "Now quantify the ROI and offer a custom tier.",
    champion: "Action: Get on call with finance to surface their real concern.",
    competitor: "Share a specific win against them + reference case study.",
    procurement: "Agree to RFP but propose parallel pilot to stay ahead."
  };

  nextMove = nextMoves[scenario];

  return { score, tips, nextMove };
}

// ==================== DIFFICULT CLIENTS TACTICS ====================
function updateClientTactic(type) {
  chips.forEach((chip) => chip.classList.toggle("active", chip.dataset.client === type));
  const tactic = difficultClientTactics[type];
  
  clientTactic.querySelector(".tactic-header").innerHTML = `<strong>Tactic for ${type} buyer:</strong>`;
  clientTactic.querySelector(".tactic-body").textContent = tactic;
  
  clientTactic.animate(
    [
      { transform: "scale(1)", opacity: 0.7 },
      { transform: "scale(1.02)", opacity: 1 },
      { transform: "scale(1)", opacity: 1 }
    ],
    { duration: 440, easing: "ease-out" }
  );
}

// ==================== SALES CALL JOURNAL ====================
function saveCall() {
  if (!callDate.value || !callOutcome.value) {
    alert("Please fill in date and outcome.");
    return;
  }

  const entry = {
    date: new Date(callDate.value).toLocaleDateString(),
    outcome: callOutcome.value,
    notes: callNotes.value || "(no notes)"
  };

  let log = JSON.parse(localStorage.getItem("callLog") || "[]");
  log.unshift(entry);
  log = log.slice(0, 20);
  localStorage.setItem("callLog", JSON.stringify(log));

  callDate.value = "";
  callOutcome.value = "";
  callNotes.value = "";

  renderCallLog();
  practiceStats.today++;
  updateTracker();
}

function renderCallLog() {
  const log = JSON.parse(localStorage.getItem("callLog") || "[]");
  callLog.innerHTML = log
    .map(
      (entry) => `
    <div class="call-entry">
      <div class="call-date">${entry.date}</div>
      <span class="call-outcome">${entry.outcome.toUpperCase()}</span>
      <p class="call-notes">${entry.notes}</p>
    </div>
  `
    )
    .join("");
}

// ==================== PROGRESS TRACKER ====================
function updateTracker() {
  practiceCount.textContent = practiceStats.today;
  weekTotal.textContent = practiceStats.week;
  masteryFill.style.width = practiceStats.mastery + "%";
  masteryText.textContent = practiceStats.mastery + "% proficiency";
  localStorage.setItem("playbook-stats", JSON.stringify(practiceStats));
}

function loadTrackerStats() {
  const saved = localStorage.getItem("playbook-stats");
  if (saved) {
    practiceStats = JSON.parse(saved);
    updateTracker();
  }
}

// ==================== FOCUS MODE ====================
function toggleFocusMode() {
  document.body.classList.toggle("focus");
  focusModeBtn.textContent = document.body.classList.contains("focus") ? "Exit Focus" : "Focus Mode";
}

function wirePanelFocus() {
  panels.forEach((panel) => {
    panel.addEventListener("mouseenter", () => {
      if (document.body.classList.contains("focus")) {
        panels.forEach((item) => item.classList.toggle("is-active", item === panel));
      }
    });
  });
}

// ==================== INITIALIZATION ====================
document.addEventListener("DOMContentLoaded", () => {
  // Set up event listeners
  objectionBtn.addEventListener("click", handleObjection);
  dealCheckBtn.addEventListener("click", startDealCheck);
  openingBtn.addEventListener("click", generateOpening);
  submitResponseBtn.addEventListener("click", submitResponse);
  focusModeBtn.addEventListener("click", toggleFocusMode);
  saveCallBtn.addEventListener("click", saveCall);

  chips.forEach((chip) => {
    chip.addEventListener("click", () => updateClientTactic(chip.dataset.client));
  });

  // Initialize
  loadScenario();
  renderCallLog();
  loadTrackerStats();
  updateClientTactic("price");
  wirePanelFocus();

  // Allow Enter to submit objection
  objectionInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleObjection();
  });

  // Allow Enter to submit response (Shift+Enter)
  userResponse.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && e.shiftKey) submitResponse();
  });
});



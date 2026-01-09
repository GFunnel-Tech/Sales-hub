// Sales Script Content Configuration
// Script-first teleprompter content for each phase of the sales process

export interface ScriptBlock {
  type: 'speech' | 'instruction' | 'question' | 'action';
  content: string;
  highlight?: boolean;
  label?: string; // For action buttons
}

export interface PhaseHints {
  dos: string[];
  donts: string[];
  listenFor: string[];
  commonMistake: string;
  powerMove?: string;
}

export interface FieldConfig {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'yesno' | 'select';
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

export interface PhaseScript {
  id: string;
  title: string;
  subtitle: string;
  scriptBlocks: ScriptBlock[];
  hints: PhaseHints;
  fields: FieldConfig[];
}

export const SALES_SCRIPT_CONTENT: Record<string, PhaseScript> = {
  handshake_authority: {
    id: 'handshake_authority',
    title: 'Handshake & Authority',
    subtitle: 'Build rapport and set the frame for the call',
    scriptBlocks: [
      {
        type: 'speech',
        content: "Hey [NAME]! Great to finally connect. Before we dive in, I want to let you know - this isn't going to be a typical sales call where I pitch you for an hour.",
        highlight: true,
      },
      {
        type: 'speech',
        content: "What we're going to do is actually BUILD something together right here on this call. By the end, you'll have a complete blueprint of your system, and if it makes sense, we'll even create a live working version of it that you can start using today.",
      },
      {
        type: 'instruction',
        content: "Pause and wait for acknowledgment. This sets the expectation that you're not a typical salesperson.",
      },
      {
        type: 'speech',
        content: "Sound good?",
        highlight: true,
      },
      {
        type: 'instruction',
        content: "Wait for 'yes' - this is your first micro-commitment.",
      },
      {
        type: 'speech',
        content: "Perfect. Quick housekeeping - I'm going to take notes as we go, and I might share my screen at some point to show you what we're building. Is that okay?",
      },
    ],
    hints: {
      dos: [
        "Be confident but warm",
        "Let them talk 80% of the time",
        "Write down their exact words",
        "Get verbal agreement before moving on",
      ],
      donts: [
        "Rush through the opening",
        "Skip authority building",
        "Sound scripted or robotic",
        "Jump straight into questions",
      ],
      listenFor: [
        "Their energy level and tone",
        "Any hesitation or skepticism",
        "Whether they seem rushed",
        "Signs they've been pitched before",
      ],
      commonMistake: "Skipping the frame-setting and jumping straight into discovery. This leaves you positioned as 'just another salesperson' instead of a trusted advisor.",
      powerMove: "Let's actually build this together right now...",
    },
    fields: [
      { id: 'prospectName', label: 'Prospect Name', type: 'text', placeholder: 'Full name', required: true },
      { id: 'companyName', label: 'Company Name', type: 'text', placeholder: 'Company name' },
      { id: 'rapportNotes', label: 'Initial Rapport Notes', type: 'textarea', placeholder: 'How did they respond? Any initial observations...' },
      { id: 'agreedToFrame', label: 'Agreed to call frame?', type: 'yesno' },
    ],
  },

  dream_pain_bridge: {
    id: 'dream_pain_bridge',
    title: 'Dream State & Pain Points',
    subtitle: 'Uncover their vision and the gaps preventing them from achieving it',
    scriptBlocks: [
      {
        type: 'question',
        content: "Okay, so let me ask you this - if we could wave a magic wand and your business operations were perfect, what would that look like?",
        highlight: true,
      },
      {
        type: 'instruction',
        content: "Let them paint the picture. Don't interrupt. Take detailed notes using their exact words.",
      },
      {
        type: 'speech',
        content: "Some things I typically hear from business owners like you:",
      },
      {
        type: 'instruction',
        content: "Use these as prompts if they need help:",
      },
      {
        type: 'speech',
        content: "• Everything in one place, no more dashboard chaos\n• Clients know exactly how to use what we deliver\n• Team members have clear processes to follow\n• No more dropped balls or missed follow-ups",
      },
      {
        type: 'question',
        content: "What else would be in your perfect world?",
      },
      {
        type: 'instruction',
        content: "Now transition to pain - the gap between dream and reality:",
      },
      {
        type: 'question',
        content: "So what's stopping you from having that right now?",
        highlight: true,
      },
      {
        type: 'instruction',
        content: "This is where the real pain comes out. Let them vent. Take notes on specific frustrations.",
      },
      {
        type: 'speech',
        content: "I hear you. And how long has this been going on?",
      },
      {
        type: 'question',
        content: "What has that cost you - in time, money, or stress?",
        highlight: true,
      },
    ],
    hints: {
      dos: [
        "Use their exact words back to them",
        "Ask 'what else?' multiple times",
        "Quantify the pain (time, money, stress)",
        "Show genuine empathy, not fake sympathy",
      ],
      donts: [
        "Offer solutions too early",
        "Minimize their problems",
        "Compare to other clients",
        "Rush past the emotional impact",
      ],
      listenFor: [
        "Frustration level in their voice",
        "Specific tools/systems they mention",
        "Whether they've tried to solve this before",
        "The emotional weight of the problem",
      ],
      commonMistake: "Assuming you know their pain without asking. Every business owner's perfect world and pain points are unique - let them tell you.",
      powerMove: "So what you're really saying is... [reframe their pain at a deeper level]",
    },
    fields: [
      { id: 'dreamState', label: 'Their Dream State', type: 'textarea', placeholder: 'What does their perfect business look like? Use their exact words...' },
      { id: 'painPoints', label: 'Pain Points', type: 'textarea', placeholder: 'What\'s stopping them? What frustrations did they share?' },
      { id: 'painDuration', label: 'How long has this been going on?', type: 'text', placeholder: 'e.g., 6 months, 2 years' },
      { id: 'painCost', label: 'What has it cost them?', type: 'textarea', placeholder: 'Time, money, stress, opportunities...' },
    ],
  },

  discovery: {
    id: 'discovery',
    title: 'Discovery (ACE Framework)',
    subtitle: 'Diagnose their business using the ACE framework',
    scriptBlocks: [
      {
        type: 'speech',
        content: "Perfect. Now I want to really understand your business so I can show you exactly what's possible.",
        highlight: true,
      },
      {
        type: 'speech',
        content: "Every business has three core parts - I call it ACE:",
      },
      {
        type: 'instruction',
        content: "Draw this out or share screen with visual:",
      },
      {
        type: 'speech',
        content: "A = Acquisition - How do you get customers?\nC = Creation - How do you fulfill and deliver?\nE = Expansion - How do you scale and grow?",
        highlight: true,
      },
      {
        type: 'question',
        content: "Let's start with Acquisition. Walk me through how someone becomes a customer today. What's that journey look like?",
      },
      {
        type: 'instruction',
        content: "Map out their current acquisition process. Look for gaps and inefficiencies.",
      },
      {
        type: 'question',
        content: "And once someone becomes a customer, what happens next? How do you deliver what you promised?",
      },
      {
        type: 'instruction',
        content: "This is Creation. Look for manual processes, bottlenecks, things that don't scale.",
      },
      {
        type: 'question',
        content: "Finally, how do you grow? Do you have repeat customers? Referrals? Upsells?",
      },
      {
        type: 'speech',
        content: "Based on what you told me, sounds like your biggest issue is [their pain], which is really a [Creation/Acquisition/Expansion] problem. That right?",
        highlight: true,
      },
    ],
    hints: {
      dos: [
        "Use ACE as a diagnostic framework",
        "Identify which 'bucket' their main pain falls into",
        "Look for the #1 bottleneck",
        "Confirm your diagnosis before moving on",
      ],
      donts: [
        "Try to fix everything at once",
        "Skip any of the three areas",
        "Assume you know their business model",
        "Get lost in the weeds of every detail",
      ],
      listenFor: [
        "Where the biggest time is being spent",
        "What's manual that should be automated",
        "Where customers/leads are falling through cracks",
        "The single biggest bottleneck",
      ],
      commonMistake: "Trying to solve all three areas at once. Focus on the ONE area that will have the biggest impact first.",
      powerMove: "Based on everything you've told me, here's what I see as your #1 priority...",
    },
    fields: [
      { id: 'acquisitionProcess', label: 'Acquisition Process', type: 'textarea', placeholder: 'How do they get customers?' },
      { id: 'creationProcess', label: 'Creation/Fulfillment Process', type: 'textarea', placeholder: 'How do they deliver?' },
      { id: 'expansionProcess', label: 'Expansion Strategy', type: 'textarea', placeholder: 'How do they grow/scale?' },
      { id: 'primaryPainArea', label: 'Primary Pain Area', type: 'select', options: [
        { value: 'acquisition', label: 'Acquisition (getting customers)' },
        { value: 'creation', label: 'Creation (fulfillment/delivery)' },
        { value: 'expansion', label: 'Expansion (scaling/growth)' },
      ]},
      { id: 'numberOnePriority', label: '#1 Priority Identified', type: 'textarea', placeholder: 'What\'s the single biggest bottleneck to solve?' },
    ],
  },

  presentation: {
    id: 'presentation',
    title: 'Presentation (The Magic Moment)',
    subtitle: 'Show them what\'s possible by building it live',
    scriptBlocks: [
      {
        type: 'speech',
        content: "Alright, here's where it gets fun. Watch this.",
        highlight: true,
      },
      {
        type: 'instruction',
        content: "Share your screen. This is the 'magic moment' - you're about to do something they've never seen.",
      },
      {
        type: 'speech',
        content: "I'm going to take everything we just mapped out and have Claude generate a complete technical scope document for your system.",
      },
      {
        type: 'action',
        content: "Generate Scope in Claude",
        label: "Open Claude",
      },
      {
        type: 'speech',
        content: "This alone would cost you $2k-3k from a consultant, and we just did it in real-time.",
        highlight: true,
      },
      {
        type: 'instruction',
        content: "Wait for their reaction. Let them process what just happened.",
      },
      {
        type: 'speech',
        content: "But we're not stopping here...",
      },
      {
        type: 'speech',
        content: "Now I'm going to drop this scope into Lovable, and it's going to BUILD a working prototype of your system right here on this call.",
      },
      {
        type: 'action',
        content: "Build in Lovable",
        label: "Open Lovable",
      },
      {
        type: 'instruction',
        content: "This usually takes 3-5 minutes. Talk them through what's happening.",
      },
      {
        type: 'speech',
        content: "See what's happening here? It's actually building YOUR system, based on YOUR needs, right now.",
      },
      {
        type: 'speech',
        content: "Most companies would charge you $15,000-50,000 for this, and it would take 3-6 months. We just did it in 5 minutes.",
        highlight: true,
      },
    ],
    hints: {
      dos: [
        "Build anticipation before sharing screen",
        "Talk through what's happening as it builds",
        "Point out specific features that address their pain",
        "Let them react - don't fill the silence",
      ],
      donts: [
        "Rush through the demo",
        "Apologize for any imperfections",
        "Get distracted by technical issues",
        "Forget to tie features back to their pain",
      ],
      listenFor: [
        "Expressions of surprise or amazement",
        "Questions about specific features",
        "Concerns or objections bubbling up",
        "Excitement about possibilities",
      ],
      commonMistake: "Showing features without connecting them to the prospect's specific pain points. Every feature you point out should tie back to something they said earlier.",
      powerMove: "This [feature] is exactly what you said you needed for [their specific pain]...",
    },
    fields: [
      { id: 'scopeGenerated', label: 'Scope Generated?', type: 'yesno' },
      { id: 'prototypeBuilt', label: 'Prototype Built?', type: 'yesno' },
      { id: 'prospectReaction', label: 'Prospect Reaction', type: 'textarea', placeholder: 'What did they say? How did they react?' },
      { id: 'featuresHighlighted', label: 'Key Features Highlighted', type: 'textarea', placeholder: 'Which features resonated most?' },
    ],
  },

  ask_objections: {
    id: 'ask_objections',
    title: 'Address Objections',
    subtitle: 'Proactively surface and handle concerns using the IACE Loop',
    scriptBlocks: [
      {
        type: 'speech',
        content: "Before we talk about next steps, I want to make sure I've answered all your questions.",
        highlight: true,
      },
      {
        type: 'question',
        content: "What questions do you have about what you just saw?",
      },
      {
        type: 'instruction',
        content: "Let them ask. Don't be defensive. Use the IACE Loop for any objection:",
      },
      {
        type: 'speech',
        content: "IACE Loop:\n\nI = Isolate - 'Is that the only thing holding you back?'\nA = Accept - 'I totally understand that concern...'\nC = Create - Reframe or provide new information\nE = Expand - 'Does that make sense?' / move forward",
        highlight: true,
      },
      {
        type: 'instruction',
        content: "Common objections and responses:",
      },
      {
        type: 'speech',
        content: "💰 PRICE: 'I totally get it. Let me ask - what would it cost you to NOT solve this problem for another year?'\n\n⏰ TIMING: 'When would be a better time? What changes between now and then?'\n\n👥 AUTHORITY: 'Great - let's get them on a quick call. What would they need to see?'\n\n🤔 TRUST: 'That's fair. Would it help if I showed you some case studies?'",
      },
      {
        type: 'question',
        content: "What else is on your mind?",
      },
    ],
    hints: {
      dos: [
        "Proactively ask for objections",
        "Use IACE Loop for every objection",
        "Stay calm and curious, not defensive",
        "Isolate before trying to solve",
      ],
      donts: [
        "Get defensive or argue",
        "Stack multiple answers at once",
        "Assume you know their objection",
        "Rush past their concerns",
      ],
      listenFor: [
        "The real objection behind the stated one",
        "Whether they're testing you or genuinely concerned",
        "Buying signals hidden in objections",
        "Who else needs to be involved",
      ],
      commonMistake: "Answering the objection before isolating it. Always ask 'Is that the only thing?' first.",
      powerMove: "I'm curious - is that the only thing holding you back, or is there something else?",
    },
    fields: [
      { id: 'objectionsSurfaced', label: 'Objections Raised', type: 'textarea', placeholder: 'What concerns did they voice?' },
      { id: 'howAddressed', label: 'How You Addressed Them', type: 'textarea', placeholder: 'What did you say? What was their response?' },
      { id: 'remainingConcerns', label: 'Any Remaining Concerns?', type: 'textarea', placeholder: 'What\'s still unresolved?' },
    ],
  },

  ask_order: {
    id: 'ask_order',
    title: 'Ask for the Order',
    subtitle: 'Present options and close the deal',
    scriptBlocks: [
      {
        type: 'speech',
        content: "[NAME], based on everything we've built today, and knowing this solves [their #1 pain point], which option makes the most sense for you?",
        highlight: true,
      },
      {
        type: 'instruction',
        content: "Present the three tiers. Use a visual if possible:",
      },
      {
        type: 'speech',
        content: "Option 1: Blueprint Only - $997\nYou get the complete scope document and prototype. You can take this to any developer and they'll know exactly what to build.\n\nOption 2: Blueprint + Platform - $297/month\nEverything in Option 1, plus we host and maintain your system. You get ongoing updates and support.\n\nOption 3: Full Implementation - $5k-$15k\nWe build the entire thing for you, fully customized, with training for your team.",
      },
      {
        type: 'question',
        content: "Which one works best for your situation?",
        highlight: true,
      },
      {
        type: 'instruction',
        content: "SHUT UP. First person to speak loses. Wait for their answer.",
        highlight: true,
      },
      {
        type: 'instruction',
        content: "If they choose, move to Handoff. If they hesitate, go back to objections.",
      },
    ],
    hints: {
      dos: [
        "Present 3 clear options",
        "Tie the ask back to their pain",
        "Be silent after asking",
        "Assume the sale - 'which option' not 'if'",
      ],
      donts: [
        "Add more options or discount too quickly",
        "Talk after asking the question",
        "Show desperation or nervousness",
        "Apologize for the price",
      ],
      listenFor: [
        "Which option they're leaning toward",
        "Price objections vs. value objections",
        "Whether they're ready or stalling",
        "Buying signals ('when can we start?')",
      ],
      commonMistake: "Talking after you ask for the order. The first person to speak loses. Embrace the silence.",
      powerMove: "Based on what you told me about [specific pain], Option 2 seems like the best fit. Want me to get you set up?",
    },
    fields: [
      { id: 'optionPresented', label: 'Options Presented', type: 'yesno' },
      { id: 'selectedOption', label: 'Option Selected', type: 'select', options: [
        { value: 'blueprint', label: 'Blueprint Only ($997)' },
        { value: 'platform', label: 'Blueprint + Platform ($297/mo)' },
        { value: 'implementation', label: 'Full Implementation ($5k-15k)' },
        { value: 'none', label: 'No decision yet' },
      ]},
      { id: 'closingNotes', label: 'Closing Notes', type: 'textarea', placeholder: 'What happened? What did they say?' },
    ],
  },

  handoff: {
    id: 'handoff',
    title: 'Handoff & Next Steps',
    subtitle: 'Complete the sale and set expectations',
    scriptBlocks: [
      {
        type: 'speech',
        content: "Awesome! Let's get you set up right now.",
        highlight: true,
      },
      {
        type: 'instruction',
        content: "If they're ready to pay, process payment immediately. Don't delay.",
      },
      {
        type: 'speech',
        content: "A few quick things before we finalize:\n\n1. Everything we build is yours - you own the code, the designs, everything.\n\n2. For Platform customers, you'll get a dedicated onboarding call within 48 hours.\n\n3. For Implementation, we'll schedule a kickoff call to map out the full timeline.",
      },
      {
        type: 'question',
        content: "Any questions before we process the payment?",
      },
      {
        type: 'instruction',
        content: "Handle any final concerns, then proceed:",
      },
      {
        type: 'speech',
        content: "Perfect. Let me send you the payment link right now. I'll stay on the line while you complete it so we can schedule your onboarding.",
      },
      {
        type: 'instruction',
        content: "Send payment link. Stay on call until payment is confirmed.",
      },
      {
        type: 'speech',
        content: "Got it! You're all set. You'll receive a confirmation email in the next few minutes with all the details and your access credentials.",
        highlight: true,
      },
      {
        type: 'speech',
        content: "[NAME], I'm really excited to work with you on this. You made a great decision today. Any final questions?",
      },
    ],
    hints: {
      dos: [
        "Process payment immediately",
        "Set clear expectations for next steps",
        "Express genuine excitement",
        "Send confirmation while still on call",
      ],
      donts: [
        "Let them 'think about it' and call back",
        "Skip the disclosure about ownership",
        "End the call before payment is confirmed",
        "Forget to schedule the onboarding",
      ],
      listenFor: [
        "Last-minute objections or hesitations",
        "Questions about the process",
        "Signs of buyer's remorse",
        "Referral opportunities",
      ],
      commonMistake: "Letting them go without payment. 'I'll send the invoice' means you lose 50% of deals. Process payment on the call.",
      powerMove: "I'll stay on the line while you complete that so we can get your onboarding scheduled right away.",
    },
    fields: [
      { id: 'paymentProcessed', label: 'Payment Processed?', type: 'yesno' },
      { id: 'paymentAmount', label: 'Payment Amount', type: 'text', placeholder: '$0.00' },
      { id: 'onboardingScheduled', label: 'Onboarding Scheduled?', type: 'yesno' },
      { id: 'onboardingDate', label: 'Onboarding Date/Time', type: 'text', placeholder: 'e.g., Jan 15 at 2pm' },
      { id: 'finalNotes', label: 'Final Notes', type: 'textarea', placeholder: 'Any additional notes or follow-up items...' },
    ],
  },
};

export const PHASE_ORDER = [
  'handshake_authority',
  'dream_pain_bridge',
  'discovery',
  'presentation',
  'ask_objections',
  'ask_order',
  'handoff',
];

export const getPhaseByIndex = (index: number): PhaseScript | null => {
  const phaseId = PHASE_ORDER[index];
  return phaseId ? SALES_SCRIPT_CONTENT[phaseId] : null;
};

export const getPhaseIndex = (phaseId: string): number => {
  return PHASE_ORDER.indexOf(phaseId);
};

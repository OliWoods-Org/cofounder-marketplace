# Agent Key Swarm Architecture

## Vision: 3-5 Minute API Setup

> "20 AI agents connected to 1Pass for env setup - spawn secret team and never add APIs one by one again"

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AGENT KEY SWARM                                      │
│                    "Zero-Touch API Key Collection"                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   USER INPUT (30 seconds)                                                    │
│   ┌────────────────────────────────────────────────────────────────────┐    │
│   │  1. Project vault in 1Pass with required keys list (secure note)  │    │
│   │  2. PayPal-linked card added to vault                             │    │
│   │  3. Temporary email created (orchestrator@project.1pass.io)       │    │
│   │  4. Click "Deploy Key Swarm"                                       │    │
│   └────────────────────────────────────────────────────────────────────┘    │
│                              │                                               │
│                              ▼                                               │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                    ORCHESTRATOR AGENT                                │   │
│   │                                                                      │   │
│   │  • Reads required keys from 1Pass secure note                       │   │
│   │  • Spawns browser swarm (20 parallel instances)                     │   │
│   │  • Assigns each agent a key to collect                              │   │
│   │  • Rotates card every hour                                          │   │
│   │  • Monitors all agent progress                                       │   │
│   │  • Handles escalations (CAPTCHA, manual verify)                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                               │
│              ┌───────────────┼───────────────┐                              │
│              ▼               ▼               ▼                              │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                     │
│   │ BROWSER POD 1│  │ BROWSER POD 2│  │ BROWSER POD N│   (Up to 20)       │
│   │              │  │              │  │              │                     │
│   │ Agent: Stripe│  │ Agent: Twilio│  │ Agent: OpenAI│                     │
│   │ Status: ████ │  │ Status: ██░░ │  │ Status: █░░░ │                     │
│   │ Time: 2:34   │  │ Time: 1:45   │  │ Time: 0:30   │                     │
│   └──────────────┘  └──────────────┘  └──────────────┘                     │
│                              │                                               │
│                              ▼                                               │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                    ZERO-CONTEXT TRACKERS                             │   │
│   │                                                                      │   │
│   │  • Record every URL visited                                         │   │
│   │  • Screenshot each page state                                       │   │
│   │  • Log all form inputs (masked)                                     │   │
│   │  • Track time per step                                              │   │
│   │  • Detect errors/blocks                                             │   │
│   │  • Feed learning data to improve agents                             │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                               │
│                              ▼                                               │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                    1PASSWORD VAULT                                   │   │
│   │                                                                      │   │
│   │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │   │
│   │  │ Secure Note     │  │ Collected Keys  │  │ .env Template   │     │   │
│   │  │ (Required Keys) │  │ (As Collected)  │  │ (Auto-Updated)  │     │   │
│   │  │                 │  │                 │  │                 │     │   │
│   │  │ STRIPE_KEY=?    │  │ STRIPE_KEY=sk_  │  │ STRIPE_KEY=sk_  │     │   │
│   │  │ TWILIO_SID=?    │  │ TWILIO_SID=AC_  │  │ TWILIO_SID=AC_  │     │   │
│   │  │ OPENAI_KEY=?    │  │ OPENAI_KEY=sk-  │  │ OPENAI_KEY=sk-  │     │   │
│   │  └─────────────────┘  └─────────────────┘  └─────────────────┘     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                               │
│                              ▼                                               │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                    SECURITY REVIEW TEAM (3-5 Agents)                 │   │
│   │                                                                      │   │
│   │  Agent 1: .gitignore checker - ensures .env not committed           │   │
│   │  Agent 2: Key rotation validator - confirms all keys active         │   │
│   │  Agent 3: Permission auditor - checks key scopes are minimal        │   │
│   │  Agent 4: Stress tester (premium) - validates rate limits           │   │
│   │  Agent 5: Compliance checker - SOC2/GDPR requirements               │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Agent Roles (Zero Overlap)

### 1. Orchestrator Agent
```yaml
id: orchestrator
role: "Command & Control"
tools:
  - 1password_cli
  - spawn_browser
  - assign_task
  - monitor_swarm
  - rotate_card
skills:
  - Parse secure note for required keys
  - Spawn N browser pods (max 20)
  - Load balance key collection
  - Handle escalations
  - Aggregate results to vault
temperature: 0.1  # Deterministic
```

### 2. Key Collector Agent (1 per API)
```yaml
id: collector-{api_name}
role: "Single API Key Acquisition"
tools:
  - browser_navigate
  - browser_click
  - browser_type
  - browser_screenshot
  - 1password_save
skills:
  - Navigate to API provider signup
  - Create account with temp email
  - Handle email verification
  - Set up billing with vault card
  - Copy API key to clipboard
  - Save to 1Password
context_limit: 8K tokens  # Small, focused
temperature: 0.2
```

### 3. Email Handler Agent
```yaml
id: email-handler
role: "Verification & 2FA"
tools:
  - gmail_cli
  - sms_receive
  - forward_email
skills:
  - Monitor orchestrator inbox
  - Extract verification codes
  - Forward to requesting agent
  - Handle SMS 2FA via Twilio
temperature: 0.1
```

### 4. Zero-Context Tracker
```yaml
id: tracker-{pod_id}
role: "Audit & Learning"
tools:
  - screenshot
  - log_action
  - record_timing
skills:
  - Screenshot every state change
  - Log URLs without context
  - Track time per action
  - Detect error patterns
  - Feed data to learning pipeline
context: NONE  # Stateless observer
```

### 5. Security Review Agent
```yaml
id: security-reviewer
role: "Final Validation"
tools:
  - git_check
  - key_validator
  - permission_audit
skills:
  - Verify .gitignore includes .env
  - Test each key is valid
  - Check key permissions are minimal
  - Generate security report
temperature: 0.0  # Strict
```

## Required Keys List (LuxuryTravels.AI)

```
# 1Pass Secure Note Format
# Project: LuxuryTravels.AI
# Required Keys:

## Critical (Auto-collect)
ANTHROPIC_API_KEY=?          # Claude API
SUPABASE_URL=?               # Database
SUPABASE_SERVICE_KEY=?       # Database admin
STRIPE_SECRET_KEY=?          # Payments
STRIPE_WEBHOOK_SECRET=?      # Webhooks

## Communication
TWILIO_ACCOUNT_SID=?         # SMS
TWILIO_AUTH_TOKEN=?          # SMS auth
TWILIO_PHONE_NUMBER=?        # SMS sender
RESEND_API_KEY=?             # Email

## Travel APIs
AMADEUS_API_KEY=?            # Flights
AMADEUS_API_SECRET=?         # Flights auth
HOTELBEDS_API_KEY=?          # Hotels
HOTELBEDS_SECRET=?           # Hotels auth

## Search & AI
BRAVE_API_KEY=?              # Web search
EXA_API_KEY=?                # Semantic search
MEM0_API_KEY=?               # Memory system
ELEVENLABS_API_KEY=?         # Voice

## Analytics
CUSTOMERIO_SITE_ID=?         # Tracking
CUSTOMERIO_API_KEY=?         # API

## Optional
GOOGLE_PLACES_API_KEY=?      # Maps
APIFY_API_TOKEN=?            # Scraping
```

## Swarm Execution Flow

```
T+0:00  User clicks "Deploy Key Swarm"
        │
        ▼
T+0:05  Orchestrator reads 1Pass secure note
        Identifies 18 required keys
        │
        ▼
T+0:10  Spawns 18 browser pods (parallel)
        Each assigned one API provider
        │
        ├─▶ Pod 1: stripe.com/register
        ├─▶ Pod 2: twilio.com/signup
        ├─▶ Pod 3: anthropic.com/signup
        ├─▶ Pod 4: supabase.com/new
        │   ... (14 more)
        │
T+0:30  First keys start arriving
        │
        ├─▶ STRIPE_KEY collected (Pod 1) ✓
        ├─▶ Email verification needed (Pod 3)
        │   └─▶ Email Handler extracts code
        │   └─▶ Pod 3 continues
        │
T+2:00  80% of keys collected
        │
        ├─▶ CAPTCHA detected (Pod 7)
        │   └─▶ Orchestrator escalates to user
        │   └─▶ User solves, Pod 7 continues
        │
T+3:30  All 18 keys collected
        │
        ▼
T+3:35  Security Review Team spawns
        │
        ├─▶ Agent 1: .gitignore check ✓
        ├─▶ Agent 2: All keys valid ✓
        ├─▶ Agent 3: Permissions minimal ✓
        │
        ▼
T+4:00  .env file generated
        Keys synced to 1Pass vault
        │
        ▼
T+4:30  COMPLETE
        User notified: "18 keys ready"
```

## Browser Pod Architecture

```typescript
interface BrowserPod {
  id: string;
  api_target: string;
  status: 'idle' | 'running' | 'blocked' | 'complete';
  agent: KeyCollectorAgent;
  tracker: ZeroContextTracker;

  // Browser instance (Playwright)
  browser: Browser;
  page: Page;

  // 1Pass integration
  vault_item_id: string;
  card_rotation_time: Date;

  // Metrics
  started_at: Date;
  actions_taken: number;
  screenshots: string[];
  errors: Error[];
}

// Spawn function
async function spawnPod(api: APIProvider): Promise<BrowserPod> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    userAgent: ROTATING_USER_AGENTS[Math.random() * ROTATING_USER_AGENTS.length]
  });

  const page = await context.newPage();

  // Attach tracker (zero context, just observes)
  const tracker = new ZeroContextTracker(page);

  // Create agent with API-specific skills
  const agent = await KeyCollectorAgent.create({
    target: api,
    email: `${api.name}@orchestrator.1pass.io`,
    card: await vault.getRotatingCard(),
    skills: loadSkills(`agents/collectors/${api.name}.yaml`)
  });

  return { browser, page, agent, tracker, ... };
}
```

## 1Password Integration

```typescript
// 1Pass CLI wrapper
class VaultManager {
  private cli: OnePasswordCLI;

  async getRequiredKeys(): Promise<RequiredKey[]> {
    const note = await this.cli.getItem('Required Keys', { vault: 'Project' });
    return this.parseSecureNote(note);
  }

  async saveCollectedKey(api: string, key: string): Promise<void> {
    await this.cli.createItem({
      category: 'API_CREDENTIAL',
      title: `${api} API Key`,
      fields: [
        { name: 'api_key', value: key, type: 'concealed' },
        { name: 'collected_at', value: new Date().toISOString() },
        { name: 'agent_id', value: this.currentAgent.id }
      ],
      vault: 'Project'
    });
  }

  async rotateCard(): Promise<Card> {
    // Switch to next virtual card number
    // All linked to main PayPal account
    const cards = await this.cli.getItems({ category: 'CREDIT_CARD', tag: 'rotating' });
    const nextCard = cards[Date.now() % cards.length];
    return nextCard;
  }

  async generateEnvFile(): Promise<string> {
    const keys = await this.cli.getItems({ category: 'API_CREDENTIAL', vault: 'Project' });
    return keys.map(k => `${k.title}=${k.fields.api_key}`).join('\n');
  }
}
```

## Pricing Model

| Tier | Keys | Browser Pods | Time | Price |
|------|------|--------------|------|-------|
| **Starter** | 5 keys | 5 parallel | ~5 min | $9.99 |
| **Pro** | 15 keys | 15 parallel | ~4 min | $29.99 |
| **Enterprise** | 25+ keys | 20 parallel | ~3 min | $49.99 |
| **Security Add-on** | - | - | +2 min | +$19.99 |

## Files to Create

```
src/
├── agents/
│   ├── key-swarm/
│   │   ├── orchestrator.ts       # Main command & control
│   │   ├── collector.ts          # Generic key collector
│   │   ├── email-handler.ts      # Verification handler
│   │   ├── tracker.ts            # Zero-context observer
│   │   └── security-reviewer.ts  # Final validation
│   │
│   ├── collectors/               # API-specific agents
│   │   ├── stripe.yaml
│   │   ├── twilio.yaml
│   │   ├── anthropic.yaml
│   │   ├── supabase.yaml
│   │   └── ... (one per API)
│   │
│   └── skills/                   # Reusable agent skills
│       ├── signup-flow.yaml
│       ├── email-verify.yaml
│       ├── billing-setup.yaml
│       └── key-extract.yaml
│
├── integrations/
│   ├── 1password/
│   │   ├── cli.ts                # 1Pass CLI wrapper
│   │   ├── vault.ts              # Vault operations
│   │   └── card-rotation.ts      # Card management
│   │
│   └── browser/
│       ├── pod.ts                # Browser pod manager
│       ├── swarm.ts              # Multi-pod orchestration
│       └── anti-detect.ts        # Fingerprint rotation
│
└── ui/
    └── key-swarm-dashboard/
        ├── SwarmStatus.tsx       # Live progress view
        ├── PodGrid.tsx           # Browser pod grid
        └── KeyList.tsx           # Collected keys list
```

## Next Steps

1. **Phase 1**: Build Orchestrator + 1Pass integration
2. **Phase 2**: Create 5 key collector agents (Stripe, Twilio, Anthropic, Supabase, Resend)
3. **Phase 3**: Add browser swarm with Playwright
4. **Phase 4**: Zero-context trackers + learning pipeline
5. **Phase 5**: Security review team
6. **Phase 6**: Dashboard UI

---

*This is the "hammer in your back pocket" - run once, all keys ready, never manually again.*

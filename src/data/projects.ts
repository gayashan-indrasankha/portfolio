// Every project on the site. Flagship projects get a scroll-driven "how it runs" diagram on the
// home page; every project gets a case-file page at /work/<slug>.

export type ProjectTone = 'live' | 'done' | 'team'

export type StepShape = 'stack' | 'db' | 'machine' | 'rack' | 'screen' | 'beacon'

export interface Step {
  /** Short label drawn inside the diagram node (keep it under ~14 characters). */
  label: string
  /** Which 3D model stands for this step in the scene. */
  shape?: StepShape
  title: string
  detail: string
}

export interface Chapter {
  tag: string
  heading: string
  body: string[]
  figure?: { src?: string; caption: string }
}

export interface Project {
  slug: string
  title: string
  kind: string
  status: string
  tone: ProjectTone
  flagship?: boolean
  problem: string
  solution: string
  steps?: Step[]
  figureCaption?: string
  stats: { value: string; label: string }[]
  stack: string[]
  links: { repo?: string; live?: string }
  lede: string
  meta: { role: string; runsOn: string; where: string; scale: string }
  chapters: Chapter[]
}

const gh = (repo: string) => `https://github.com/gayashan-indrasankha/${repo}`

export const projects: Project[] = [
  {
    slug: 'grc-risk-monitor',
    title: 'GRC Risk Monitor',
    kind: 'Procurement control monitoring',
    status: 'Prototype · synthetic data',
    tone: 'done',
    flagship: true,
    problem:
      'An audit reviewer must find control exceptions across purchase requests, invoices and payments, see the evidence and decide what to follow up first. Patterns such as split purchases are easy to miss by hand.',
    solution:
      'A pipeline that loads transaction records, runs four SQL rules written from a procurement policy, and produces findings with severity and evidence, then a Power BI dashboard and an email alert for every high-severity open finding.',
    steps: [
      {
        label: 'Source CSVs',
        shape: 'stack',
        title: 'Synthetic records in',
        detail: '6 employees, 5 suppliers, 20 purchase requests, 20 invoices and 21 payments, regenerated reproducibly from CSV.',
      },
      {
        label: 'SQLite',
        shape: 'db',
        title: 'Loaded into one schema',
        detail: 'Requests, invoices and payments are separate tables. An invoice can have many payments, which makes duplicate-payment checks possible.',
      },
      {
        label: '4 SQL rules',
        shape: 'machine',
        title: 'Policy written as SQL',
        detail: 'R01 duplicate payment, R02 payment without approval, R03 wrong approver above LKR 100,000, R04 potential split purchase.',
      },
      {
        label: 'Findings',
        shape: 'rack',
        title: 'Findings with evidence',
        detail: 'Each finding carries severity, record references, evidence, a recommended action and a review status. The detector never reads the test labels.',
      },
      {
        label: 'Power BI',
        shape: 'screen',
        title: 'Five reporting tables',
        detail: 'Three fact tables and two dimensions feed KPI cards, findings by type and severity, a timeline and supplier and date filters.',
      },
      {
        label: 'Register',
        shape: 'stack',
        title: 'Exception register',
        detail: 'Findings are copied into an Excel Online register. That synchronisation is manual, and the repository says so.',
      },
      {
        label: 'Alert',
        shape: 'beacon',
        title: 'Alerts only when needed',
        detail: 'A Power Automate flow emails a test alert only for findings that are High, Open and Pending, then stamps the row Sent with a UTC time.',
      },
    ],
    figureCaption: 'records become SQL findings, findings become a dashboard and an alert, and a person reviews every flag',
    stats: [
      { value: '4', label: 'SQL detection rules' },
      { value: '61', label: 'transactions screened' },
      { value: '28', label: 'recorded tests passing' },
      { value: '5', label: 'Power BI tables' },
    ],
    stack: ['Python', 'SQL', 'SQLite', 'Power BI', 'DAX', 'Power Query', 'Power Automate', 'Excel Online'],
    links: { repo: gh('grc-risk-monitor') },
    lede: 'A procurement control monitor that turns a written policy into SQL rules, findings a reviewer can check, a Power BI dashboard and alerts for the cases that need someone today.',
    meta: {
      role: 'Designed and built alone: schema, detection rules, Python detector, reporting exports, dashboard, alert flow and tests',
      runsOn: 'Python · SQLite · Power BI · Power Automate',
      where: 'Independent portfolio project',
      scale: '4 rules · 61 transactions · 28 tests',
    },
    chapters: [
      {
        tag: 'Problem',
        heading: 'A policy only matters if someone can check it.',
        body: [
          'A fictional Sri Lankan company buys goods and services from suppliers. Employees raise purchase requests, authorised staff approve them, suppliers invoice, and finance records payments. The policy is short: a Manager must approve anything above LKR 100,000, nothing may be paid while approval is Pending or Rejected, and duplicate payments and split purchases must be investigated.',
          'An audit reviewer needs to find the exceptions, understand the evidence behind each one and decide what to follow up first. This project builds that screening step end to end, on synthetic data only.',
        ],
      },
      {
        tag: 'Rules',
        heading: 'Four rules, each with its limit written down.',
        body: [
          'R01 (High) flags two or more completed payments against one invoice, each for the full amount. R02 (High) flags a completed payment on a request whose approval is not Approved. R03 (High) flags an approved request above LKR 100,000 that was paid but approved by someone other than a Manager. R04 (Medium) flags pairs of requests from the same requester and supplier, within three days, each under the threshold but together above it.',
          'Every rule is a separate SQL file, and every rule documents what it cannot catch: partial overpayments, approval chronology, delegated authority, legitimate related purchases.',
        ],
      },
      {
        tag: 'Detector',
        heading: 'Findings, not accusations.',
        body: [
          'A Python detector runs the rules and writes findings with severity, the record references, the evidence, a recommended action and a review status. It reads only the business records; the ground-truth labels live in a separate test fixture used for evaluation.',
          'Severity orders the review queue. It does not prove misconduct, and the LKR 520,000 of related transaction value across the baseline findings is not a confirmed loss.',
        ],
        figure: {
          src: '/work/grc-risk-monitor/excel-exception-register-redacted.png',
          caption: 'The exception register: each finding with its rule, severity, records and review status',
        },
      },
      {
        tag: 'Dashboard',
        heading: 'One model, three meanings of “date”.',
        body: [
          'Five reporting exports feed a Power BI model with three fact tables (requests, payments, exceptions) and two shared dimensions (suppliers, dates). The report has five KPI cards, findings by type and severity, an event timeline, a detail table and supplier and date filters.',
          'Dates mean different things per table: a request uses the day it was raised, a payment the day it was paid, a finding the date of the underlying event. The filtered counts were checked against the exports.',
        ],
        figure: {
          src: '/work/grc-risk-monitor/power-bi-dashboard-overview.png',
          caption: 'Baseline view: 20 requests, 21 payments, 4 findings, 3 of them High',
        },
      },
      {
        tag: 'Alerts',
        heading: 'Only the findings that need someone today.',
        body: [
          'A Power Automate flow reads the Excel Online register and sends an email only when a finding is High, Open and still Pending notification. When the email sends, the flow marks the row Sent and records a UTC timestamp, so a rerun skips it.',
          'The boundary is stated plainly: copying findings from the local run to the cloud register is a manual step, and the flow is triggered by hand.',
        ],
        figure: {
          src: '/work/grc-risk-monitor/gmail-synthetic-risk-alerts.png',
          caption: 'Synthetic test alerts, one per High open finding',
        },
      },
      {
        tag: 'Evidence',
        heading: 'Tested, and honest about what is not.',
        body: [
          'Scenario tests, data-quality checks and export checks run locally, with 28 recorded passing, plus a reconciliation script and a manual evidence report. Manual validation of the cloud stage is recorded as partial.',
          'The detector is deterministic on purpose. AI-written finding summaries and an evaluation of them are planned as a later extension.',
        ],
      },
    ],
  },
  {
    slug: 'llm-eval-framework',
    title: 'LLM Eval Framework',
    kind: 'AI assistants on compliance questions',
    status: 'Complete · 48 / 48 scored',
    tone: 'done',
    flagship: true,
    problem:
      'People are starting to ask AI assistants compliance questions, but one good-looking answer says little about whether an assistant follows a policy reliably, stays in scope or flags the risk.',
    solution:
      'A reproducible study: three synthetic GRC policies, twelve edge cases, identical archived prompts, two products with two trials each, scored on a six-dimension rubric with every caveat written down.',
    steps: [
      {
        label: '3 policies',
        shape: 'stack',
        title: 'Synthetic policies',
        detail: 'P01 procurement approvals, P02 accounts payable, P03 supplier and access governance.',
      },
      {
        label: '12 cases',
        shape: 'rack',
        title: 'Cases at the edges',
        detail: 'Threshold boundaries, segregation of duties, split purchases, duplicate invoices, three-way matching, bank-detail checks, access revocation and an unsupported ISO 27001 claim.',
      },
      {
        label: 'Prompts',
        shape: 'stack',
        title: 'One archived prompt per case',
        detail: 'Prompts are generated deterministically and archived, so each product received exactly the same text.',
      },
      {
        label: '2 × 2 trials',
        shape: 'machine',
        title: 'Two products, two trials',
        detail: 'Claude and Microsoft Copilot, each in fresh chats, twice per case, collected manually.',
      },
      {
        label: '48 answers',
        shape: 'rack',
        title: 'Responses kept verbatim',
        detail: 'All 48 original plaintext responses are stored next to the prompts that produced them.',
      },
      {
        label: 'Rubric',
        shape: 'machine',
        title: 'Six axes, 0 to 4 each',
        detail: 'Accuracy, coverage, groundedness, instruction following, clarity and risk awareness, summed out of 24.',
      },
      {
        label: 'Analysis',
        shape: 'screen',
        title: 'Report and dashboard',
        detail: 'A comparative report and an Excel dashboard. Scores were AI-assisted and approved by me, not blinded.',
      },
    ],
    figureCaption: 'three policies become twelve cases, each asked identically twice of two products and scored on six axes',
    stats: [
      { value: '48', label: 'responses scored' },
      { value: '12', label: 'GRC cases' },
      { value: '6', label: 'rubric dimensions' },
      { value: '0', label: 'external dependencies' },
    ],
    stack: ['Python (standard library)', 'Excel', 'Markdown'],
    links: { repo: gh('llm-eval-framework') },
    lede: 'A small, reproducible study of how Claude and Microsoft Copilot answered compliance questions grounded in three synthetic policies, with the rubric, the raw answers and the limits all in the repository.',
    meta: {
      role: 'Designed and ran the study: policies, cases, prompt generator, rubric, scoring review, analysis',
      runsOn: 'Python standard library · Excel',
      where: 'Independent portfolio study',
      scale: '12 cases · 48 responses · 6-axis rubric',
    },
    chapters: [
      {
        tag: 'Question',
        heading: 'Not “which model is better”.',
        body: [
          'The question is narrower: given a written policy and a realistic compliance question, does an assistant reach the right conclusion, stay within the policy, follow the instructions and flag the risk? And does it do that the same way twice?',
          'The study describes two specific product configurations on twelve synthetic questions. It is not a general model ranking or a real compliance audit.',
        ],
      },
      {
        tag: 'Design',
        heading: 'Three policies, twelve edge cases.',
        body: [
          'Three synthetic policies cover procurement approvals, accounts payable, and supplier and access governance. Twelve cases sit where policies are easiest to get wrong: values just either side of a threshold, segregation of duties, purchases split to avoid approval, duplicate invoices, three-way matching, bank-detail changes, supplier monitoring, access revocation, and a claim of ISO 27001 compliance the documents do not support.',
        ],
      },
      {
        tag: 'Collection',
        heading: 'The same prompt, twice, in a fresh chat.',
        body: [
          'Each case produces one deterministic prompt, archived before collection. Each product answered it in a fresh chat on two separate trials, giving 48 responses, stored verbatim.',
          'Neither product was called through an API. The exact model behind Copilot and the live configuration of each app were not independently verified, and the methodology records that.',
        ],
      },
      {
        tag: 'Scoring',
        heading: 'Six axes, written before scoring.',
        body: [
          'Every response is scored 0 to 4 on accuracy, coverage, groundedness, instruction following, clarity and risk awareness, an equal-weight total out of 24. Scoring was AI-assisted and each score was reviewed and approved by me; it was not blinded or professionally adjudicated.',
        ],
      },
      {
        tag: 'Results',
        heading: 'Close on substance, apart on instructions.',
        body: [
          'Claude earned 545 of 576 rubric points (94.62%) and Copilot 575 of 576 (99.83%). Twenty-four of the thirty-point gap came from instruction following, mostly scope and concision, not wrong policy conclusions: every response scored 4 of 4 on accuracy, coverage and risk awareness.',
          'All 24 model–case pairs kept the same policy conclusion across both trials; two pairs moved by one rubric point. No fabricated policy obligations were tagged.',
        ],
      },
      {
        tag: 'Limits',
        heading: 'What these numbers do not show.',
        body: [
          'Twelve synthetic cases cannot establish real-world accuracy, model superiority or freedom from hallucination. What the repository does give is a protocol anyone can rerun: the data validator, prompt generator and metrics use only the Python standard library, with no API key required.',
        ],
      },
    ],
  },
  {
    slug: 'swifttrack-middleware',
    title: 'SwiftTrack Middleware',
    kind: 'Integration layer for a logistics company',
    status: 'Team project · IS3208',
    tone: 'team',
    flagship: true,
    problem:
      'SwiftLogistics runs three back-end systems that speak different protocols: SOAP/XML for clients, REST for route planning and a proprietary TCP protocol for the warehouse. Orders must pass through all three without being lost when one is down.',
    solution:
      'One API gateway that translates between protocols, runs each order as a saga, publishes events through RabbitMQ and pushes live status to client and driver web apps over WebSockets.',
    steps: [
      {
        label: 'Portals',
        shape: 'screen',
        title: 'Client and driver apps',
        detail: 'A client dashboard and a mobile-first driver PWA with offline support, both talking to one gateway.',
      },
      {
        label: 'Gateway',
        shape: 'machine',
        title: 'One front door',
        detail: 'A Node.js gateway handles JWT authentication, routing and WebSocket dispatch.',
      },
      {
        label: 'Adapters',
        shape: 'rack',
        title: 'Protocol adapters',
        detail: 'REST to SOAP/XML for the client system and REST to raw TCP for the warehouse system, behind a canonical data model.',
      },
      {
        label: 'Saga',
        shape: 'machine',
        title: 'Each order is a saga',
        detail: 'A coordinator runs the order across all three systems; if a step fails, earlier steps are compensated instead of leaving a half-made order.',
      },
      {
        label: 'RabbitMQ',
        shape: 'rack',
        title: 'Events, not polling',
        detail: 'Services publish to fanout exchanges for order, route and warehouse events.',
      },
      {
        label: 'PostgreSQL',
        shape: 'db',
        title: 'One shared record',
        detail: 'PostgreSQL 16 holds the order data every service agrees on.',
      },
      {
        label: 'Live',
        shape: 'beacon',
        title: 'Status pushed live',
        detail: 'Updates reach clients and drivers over WebSockets, broadcast or targeted at one user.',
      },
    ],
    figureCaption: 'one gateway translates between three protocols, runs each order as a saga and pushes status live',
    stats: [
      { value: '3', label: 'protocols bridged' },
      { value: '5', label: 'integration patterns' },
      { value: '7', label: 'services in Compose' },
      { value: '2', label: 'installable PWAs' },
    ],
    stack: ['Node.js', 'Express', 'Python', 'Flask', 'Spyne', 'RabbitMQ', 'PostgreSQL', 'WebSockets', 'Docker Compose'],
    links: { repo: gh('Middleware-Architecture-for-SwiftLogistics') },
    lede: 'Middleware that connects a SOAP client system, a REST route optimiser and a TCP warehouse system behind one gateway, so an order is never lost when one of them is briefly down.',
    meta: {
      // TODO: replace with the parts you personally built.
      role: 'Team project for IS3208 Middleware Architecture',
      runsOn: 'Node.js · Flask · RabbitMQ · PostgreSQL · Docker Compose',
      where: 'University of Colombo School of Computing',
      scale: '3 back-end systems · 7 services · 2 PWAs',
    },
    chapters: [
      {
        tag: 'Problem',
        heading: 'Three systems that do not speak to each other.',
        body: [
          'SwiftLogistics keeps clients in a SOAP/XML system, plans routes in a REST service and runs its warehouse on a proprietary TCP protocol. A new order touches all three, and any one of them can be unavailable for a moment.',
        ],
      },
      {
        tag: 'Gateway',
        heading: 'One front door, three adapters.',
        body: [
          'Every client and driver request goes to a single Node.js gateway. Channel adapters translate REST to SOAP/XML for the client system and REST to raw TCP for the warehouse, mapping each system’s shape onto one canonical order model.',
        ],
      },
      {
        tag: 'Saga',
        heading: 'An order either completes or is undone.',
        body: [
          'A saga coordinator runs each order as a sequence of steps across the three systems. When a step fails, the steps already taken are compensated, so the platform never leaves an order half-registered in one system and missing from another.',
        ],
      },
      {
        tag: 'Events',
        heading: 'Publish once, everyone hears.',
        body: [
          'Services publish to RabbitMQ fanout exchanges for order, route and warehouse events. The gateway listens and forwards updates over WebSockets, either broadcast or targeted at one client or driver.',
        ],
      },
      {
        tag: 'Running it',
        heading: 'One command for the whole stack.',
        body: [
          'Docker Compose starts PostgreSQL, RabbitMQ, the three back-end services, the gateway and both portals. The driver portal is an installable PWA with a service worker for offline use.',
        ],
      },
    ],
  },
  {
    slug: 'skill-to-career',
    title: 'Skill-to-Career Predictor',
    kind: 'Career guidance with local market data',
    status: 'Competition prototype',
    tone: 'done',
    problem:
      'Students in Sri Lanka often choose a career without local evidence: which roles are in demand, what they pay in LKR, and what it takes to get there.',
    solution:
      'A MERN app that infers skills from an assessment and a GitHub scan, matches them to Sri Lanka–relevant career pathways and shows demand, LKR salary bands, skill gaps and a roadmap for each.',
    stats: [
      { value: 'MERN', label: 'full-stack' },
      { value: 'LKR', label: 'salary bands' },
    ],
    stack: ['MongoDB', 'Express', 'React', 'Node.js', 'Gemini (optional)'],
    links: { repo: gh('AI-Driven-Skill-to-Career-Pathway-Predictor') },
    lede: 'A prototype for SLIIT Ignite Innovation 2026 that matches student skills to Sri Lanka–relevant career pathways, backed by local market sources.',
    meta: {
      role: 'Built for SLIIT Ignite Innovation 2026',
      runsOn: 'MongoDB · Express · React · Node.js',
      where: 'SLIIT Ignite Innovation 2026',
      scale: 'Assessment · GitHub scan · roadmap dashboard',
    },
    chapters: [
      {
        tag: 'Problem',
        heading: 'Career choices without local evidence.',
        body: [
          'Generic career advice rarely reflects the Sri Lankan market. Students need to know which pathways are in demand locally, what they pay in LKR and which skills they are missing.',
        ],
      },
      {
        tag: 'Matching',
        heading: 'Skills in, pathways out.',
        body: [
          'Students enter skills and interests or scan a GitHub profile. A weighted scoring model matches them to pathways and shows the match score, skill gaps, a local demand score and salary bands, with the sources behind each figure.',
        ],
      },
      {
        tag: 'Evidence',
        heading: 'Seed data from published sources.',
        body: [
          'Market data is drawn from the Export Development Board ICT/BPM strategy, the SLASSCOM employability report, the 2024 Labour Force Survey and services-export reporting.',
        ],
      },
      {
        tag: 'Simulator',
        heading: 'From learning to a pilot.',
        body: [
          'A commercial simulator projects LKR salary, prototype cost and break-even period, with a month-by-month plan from learning to a pilot product.',
        ],
      },
    ],
  },
  {
    slug: 'nexbus',
    title: 'NexBus',
    kind: 'Bus tracking and fleet management',
    status: 'Team project',
    tone: 'team',
    problem:
      'Sri Lankan bus operations still run on paper schedules, phone calls and scattered records, which makes delays hard to see and fleets hard to manage.',
    solution:
      'A role-based web system with GPS tracking, timetables, trip logs, fleet management and passenger feedback, with a separate dashboard for each of seven roles.',
    stats: [
      { value: '7', label: 'user roles' },
      { value: 'MVC', label: 'architecture' },
    ],
    stack: ['PHP', 'MySQL', 'JavaScript', 'AJAX'],
    links: { repo: gh('NexBus') },
    lede: 'A role-based bus tracking and fleet management system for Sri Lankan public and private transport.',
    meta: {
      // TODO: replace with the parts you personally built.
      role: 'Team project',
      runsOn: 'PHP · MySQL · JavaScript',
      where: 'University project',
      scale: '7 roles · MVC',
    },
    chapters: [
      {
        tag: 'Problem',
        heading: 'Paper schedules and phone calls.',
        body: [
          'Timetables, trip records and fleet details are kept on paper and passed around by phone, so nobody has a live picture of where buses are or how they are performing.',
        ],
      },
      {
        tag: 'Roles',
        heading: 'Seven roles, seven views.',
        body: [
          'Passengers, NTC admins, depot managers, depot officers, SLTB timekeepers, private bus timekeepers and bus owners each get the screens and permissions their job needs, from timetable search to trip logs and earnings reports.',
        ],
      },
    ],
  },
]

export const flagships = projects.filter((p) => p.flagship)

export function findProject(slug: string | undefined) {
  return projects.find((p) => p.slug === slug)
}

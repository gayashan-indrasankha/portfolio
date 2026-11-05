// Everything personal lives here. Edit this file to change what the site says about you.

export const profile = {
  name: { first: 'Gayashan', last: 'Indrasankha' },
  role: 'Full-stack developer',
  org: 'IT undergraduate, UCSC',
  pitch:
    'I build complete products, from the database schema to the interface people use. Recent work: a procurement control monitor that turns policy into SQL rules and alerts, a reproducible benchmark of two AI assistants on compliance questions, and a gateway that connects SOAP, REST and TCP systems without losing an order. I study Information Technology at the University of Colombo School of Computing.',
  status: 'Open to SE internships',
  based: 'Sri Lanka',
  currently: 'UCSC · IT undergraduate',
  focus: 'Full-stack · Data & GRC',
  timeZone: 'Asia/Colombo',
  timeZoneLabel: 'SLST',
  email: 'gayashanindrasankha@gmail.com',
  // Drop a PDF into /public and set this to e.g. '/gayashan-indrasankha-resume.pdf'. Hidden while empty.
  resumeUrl: '',
  // Black-background portrait in /public; it blends into the page. A monogram shows while empty.
  portraitUrl: '/portrait.jpg',
  links: [
    { label: 'LinkedIn', handle: 'in/gayashan-indrasankha', href: 'https://www.linkedin.com/in/gayashan-indrasankha/' },
    { label: 'GitHub', handle: 'gayashan-indrasankha', href: 'https://github.com/gayashan-indrasankha' },
    { label: 'X', handle: '@indrasankhaG', href: 'https://x.com/indrasankhaG' },
  ],
}

export const about = {
  headline: 'I turn business rules into software people can check.',
  body: 'Most of what I build starts with a rule someone already follows by hand: approve purchases above a threshold, route an order through three systems, answer a policy question correctly. I write that rule down as data and code, test it, and document honestly where it stops working.',
  focus: [
    'Full-stack products: React and Next.js interfaces on Node.js, Express and PostgreSQL.',
    'Business rules as code: policy thresholds expressed as SQL checks with evidence and tests.',
    'Evaluating AI carefully: archived prompts, explicit rubrics and written-down limits.',
    'Integration: gateways, message queues and protocol adapters between systems that disagree.',
    'Reporting: Power BI models with DAX, and alerts that fire only when someone must act.',
  ],
}

export type TimelineKind = 'work' | 'education' | 'project'

export interface TimelineEntry {
  period: string
  kind: TimelineKind
  now?: boolean
  title: string
  org: string
  note?: string
  // Optional ISO dates; when both are set the entry shows a progress bar.
  start?: string
  end?: string
}

// TODO: add your degree name and years, any internships or jobs, and school results.
export const timeline: TimelineEntry[] = [
  {
    period: 'Now',
    kind: 'education',
    now: true,
    title: 'Information Technology',
    org: 'University of Colombo School of Computing (UCSC)',
    note: 'Undergraduate. Coursework includes middleware architecture (IS3208).',
  },
  {
    period: '2026',
    kind: 'project',
    title: 'SLIIT Ignite Innovation 2026',
    org: 'Competition entry',
    note: 'Built the Skill-to-Career Pathway Predictor, a MERN prototype matching students to Sri Lanka–relevant careers.',
  },
  {
    period: '2026',
    kind: 'project',
    title: 'SwiftTrack middleware',
    org: 'Team project · IS3208 Middleware Architecture',
    note: 'API gateway, protocol adapters and saga coordination across three logistics systems.',
  },
]

export interface StackGroup {
  key: string
  name: string
  items: string[]
  note: string
}

export const stack: StackGroup[] = [
  {
    key: 'A',
    name: 'Languages',
    items: ['TypeScript', 'JavaScript', 'Python', 'SQL', 'Java', 'PHP', 'C#', 'C / C++'],
    note: 'Python for the GRC detector and the evaluation scripts; JavaScript and TypeScript for web work.',
  },
  {
    key: 'B',
    name: 'Frontend',
    items: ['React', 'Next.js', 'Tailwind CSS', 'Bootstrap', 'HTML & CSS', 'PWA'],
    note: 'React for the Skill-to-Career Predictor; installable PWAs for the SwiftTrack portals.',
  },
  {
    key: 'C',
    name: 'Backend & data',
    items: ['Node.js', 'Express', 'Flask', 'PostgreSQL', 'MongoDB', 'MySQL', 'SQLite', 'RabbitMQ'],
    note: 'SQLite and SQL rules for the GRC Risk Monitor; PostgreSQL and RabbitMQ behind SwiftTrack.',
  },
  {
    key: 'D',
    name: 'Analytics & automation',
    items: ['Power BI', 'DAX', 'Power Query', 'Power Automate', 'Excel'],
    note: 'The GRC dashboard and its alert flow; the Excel dashboard for the AI evaluation.',
  },
  {
    key: 'E',
    name: 'Tools & deploy',
    items: ['Git', 'GitHub Actions', 'Docker', 'Vercel', 'Postman', 'Electron', '.NET'],
    note: 'Docker Compose runs the full SwiftTrack stack with one command.',
  },
]

// Fill these in to show the Certificates and Awards sections; they stay hidden while empty.
export const certificates: { title: string; issuer: string; date: string; note?: string; href?: string }[] = []
export const awards: { year: string; title: string; org: string; note?: string }[] = []

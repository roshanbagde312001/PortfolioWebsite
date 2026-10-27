export const profile = {
  name: 'Roshan Bagde',
  role: 'Node.js & Full-Stack Developer',
  location: 'Pune, Maharashtra, India',
  phone: '+91 7517767247',
  email: 'roshan.bagde@outlook.com',
  linkedin: 'https://www.linkedin.com/in/roshan-bagde',
  github: 'https://github.com/Roshan-Bagde',
  resume: '/Roshan_Bagde_Resume.docx',
};

export const summary =
  "I design and scale secure REST APIs with Node.js and Express — JWT & OAuth2 auth, MongoDB & PostgreSQL data layers, Redis caching — and pair them with fast, component-driven React interfaces. I own services end-to-end: from schema design to CI/CD to production.";

export const summaryAccent = ['Node.js', 'Express', 'React', 'secure', 'end-to-end:', 'production.'];

export const stats = [
  { value: 3, suffix: '+', label: 'Years shipping production software' },
  { value: 70, suffix: '%', label: 'Faster CI/CD builds with caching & parallel jobs' },
  { value: 100, suffix: 'K+', label: 'Records powering real-time dashboards' },
  { value: 75, prefix: '~', suffix: '%', label: 'Faster page loads, validated with Lighthouse' },
  { value: 25, suffix: '%', label: 'Less downtime through root-cause fixes' },
  { value: 30, suffix: '%', label: 'Fewer post-deployment defects with Jest' },
];

export const skills = [
  {
    title: 'Backend',
    code: 'api',
    wide: true,
    desc: 'Secure, documented, well-structured APIs that scale.',
    items: ['Node.js', 'Express.js', 'REST API Design', 'Middleware Architecture', 'JWT & OAuth2', 'RBAC', 'Rate Limiting', 'Pagination', 'Centralized Error Handling', 'Swagger / OpenAPI', 'Helmet', 'CORS'],
  },
  {
    title: 'Frontend',
    code: 'ui',
    desc: 'Component-driven, performant interfaces.',
    items: ['React.js', 'Redux Toolkit', 'Context API', 'JavaScript (ES6+)', 'TypeScript', 'HTML5', 'CSS3', 'Responsive UI'],
  },
  {
    title: 'Database',
    code: 'db',
    desc: 'Schemas and queries built for speed.',
    items: ['MongoDB (Mongoose)', 'PostgreSQL', 'Redis Caching', 'Schema Design', 'Indexing', 'Aggregation Pipelines', 'Query Optimization'],
  },
  {
    title: 'Cloud & DevOps',
    code: 'ops',
    desc: 'From commit to production, automated.',
    items: ['AWS EC2', 'S3', 'RDS', 'IAM', 'Lambda', 'Docker', 'GitLab CI/CD', 'SonarQube', 'Nginx', 'Git / GitHub', 'Microservices'],
  },
  {
    title: 'Testing & Tools',
    code: 'qa',
    desc: 'Confidence in every deploy.',
    items: ['Jest', 'React Testing Library', 'Unit & Integration', 'Postman', 'SonarQube'],
  },
  {
    title: 'Observability',
    code: 'obs',
    desc: 'Know what production is doing — before users do.',
    items: ['IBM Instana (APM)', 'Grafana', 'Prometheus', 'Loki', 'ELK Stack', 'Distributed Tracing', 'Alerting & SLOs'],
  },
  {
    title: 'Security & API Practices',
    code: 'sec',
    wide: true,
    desc: 'Hardened by default, not as an afterthought.',
    items: ['Secure App Development', 'API Security Hardening', 'JWT / OAuth2', 'Input Validation', 'CORS / Helmet Policies'],
  },
  {
    title: 'System Design',
    code: 'sys',
    wide: true,
    desc: 'Designing for scale, failure and change.',
    items: ['Scalability', 'Load Balancing', 'Caching Strategies', 'CAP Theorem', 'Sharding & Replication', 'Consistent Hashing', 'Message Queues', 'Microservices', 'API Gateway', 'Rate Limiting'],
  },
  {
    title: 'Patterns & Algorithms',
    code: 'dsa',
    desc: 'Clean code on solid fundamentals.',
    items: ['Design Patterns (GoF)', 'SOLID', 'Clean Architecture', 'Data Structures', 'Algorithms', 'Big-O Analysis'],
  },
  {
    title: 'Networking',
    code: 'net',
    full: true,
    desc: 'How bytes actually get from the browser to the database and back.',
    items: ['OSI & TCP/IP Models', 'TCP / UDP', 'HTTP/1.1 · 2 · 3', 'DNS', 'TLS / HTTPS', 'Load Balancing L4/L7', 'Reverse Proxy', 'WebSockets', 'Subnetting & CIDR', 'AWS VPC & Security Groups', 'NAT & Firewalls', 'CDN'],
  },
];

export const marquee = ['Node.js', 'Express', 'React', 'Redux Toolkit', 'MongoDB', 'PostgreSQL', 'Redis', 'AWS', 'Docker', 'GitLab CI/CD', 'Nginx', 'Jest', 'Swagger', 'Grafana', 'Prometheus', 'Loki', 'IBM Instana', 'SonarQube', 'TCP/IP', 'DNS', 'TypeScript'];

export const experience = [
  {
    role: 'Software Developer',
    company: 'Fineshift Software Pvt. Ltd.',
    period: 'Dec 2025 — Present',
    location: 'Pune, India · Product-focused Engineering Team',
    current: true,
    points: [
      'Architecting a modular analytics platform backend with Node.js and Express.js, exposing RESTful APIs consumed by React.js dashboards for real-time business reporting.',
      'Designed API-layer input validation, JWT authentication and middleware-based error handling; hardened endpoints with Helmet and CORS policies to shrink the attack surface.',
      'Documented REST APIs with Swagger/OpenAPI and introduced Redis caching on hot endpoints — fewer redundant database calls and faster responses under concurrent load.',
      'Optimised React.js rendering with memoization, lazy loading and code splitting to keep the UI responsive as data volume grew.',
      'Run Agile/Scrum sprints with GitLab CI/CD, automated testing gates and zero-downtime deployments alongside QA and DevOps.',
      'Support pre-sales technical demos, translating architecture decisions into client-facing walkthroughs.',
    ],
    tags: ['Node.js', 'Express.js', 'React.js', 'Redis', 'Swagger', 'GitLab CI/CD'],
  },
  {
    role: 'Associate Software Developer',
    company: 'Datamato Technologies Pvt. Ltd.',
    period: 'Jun 2023 — Dec 2025',
    location: 'Pune, India · Product & Internal Tooling',
    points: [
      'Contributed to architecture decisions on module boundaries, data flow and scalability for in-house platforms across Business, QA and DevOps.',
      'Led root-cause analysis on recurring production incidents, cutting system downtime by 25% through systemic fixes rather than patches.',
      'Built the backend and frontend of a full-stack Channel & Pack Management (CPM) onboarding/workflow system (Node.js/Express.js + React.js), replacing a manual process for 100+ internal users.',
      'Designed MongoDB schemas with strategic indexing and aggregation pipelines for an internal analytics portal handling 100K+ records.',
      'Set up GitLab CI/CD with build caching and parallel jobs, cutting build time by 70%.',
      'Wrote Jest unit and integration test suites that reduced post-deployment defects by 30%.',
      'Mentored 3 junior developers through pair programming and code reviews.',
    ],
    tags: ['Node.js', 'MongoDB', 'React.js', 'Jest', 'Docker', 'GitLab CI/CD'],
  },
];

export const projects = [
  {
    id: 'cpm',
    index: '01',
    title: 'Channel & Pack Management',
    kind: 'Full-stack workflow platform',
    desc: 'Express.js REST APIs and Mongoose schemas paired with a component-based React.js frontend for an onboarding and workflow application — replacing a fully manual process.',
    points: ['Serves 100+ internal users in production', '~75% faster page loads via backend response optimisation and frontend code splitting, validated with Lighthouse audits'],
    metrics: [{ v: '100+', l: 'Active users' }, { v: '~75%', l: 'Faster loads' }],
    tech: ['Node.js', 'Express.js', 'MongoDB', 'React.js', 'Redux Toolkit', 'Jest', 'Docker'],
    visual: 'workflow',
    color: '#2997ff',
  },
  {
    id: 'gitlab',
    index: '02',
    title: 'GitLab Engineering Analytics',
    kind: 'Data pipeline & real-time dashboards',
    desc: 'A backend pipeline that pulls CI/CD pipeline and repository activity from the GitLab API, processing it with Node.js worker threads and cron jobs into a MongoDB store.',
    points: ['MongoDB aggregation pipelines and indexing over 100K+ records', 'Dashboard load time cut by 60%'],
    metrics: [{ v: '100K+', l: 'Records' }, { v: '60%', l: 'Faster dashboards' }],
    tech: ['Node.js', 'Express.js', 'MongoDB', 'Cron Jobs', 'Worker Threads', 'AWS S3', 'IAM'],
    visual: 'chart',
    color: '#a259ff',
  },
  {
    id: 'portfolio',
    index: '03',
    title: 'This Portfolio',
    kind: 'Motion-first React experience',
    desc: 'Designed and built from scratch with React, Framer Motion and Lenis — scroll-scrubbed launch-style scenes, a command palette and a live, rate-limited API playground.',
    points: ['Scroll-driven 3D scenes at 60fps', 'Press ⌘K / Ctrl+K anywhere to navigate'],
    metrics: [{ v: '60fps', l: 'Animations' }, { v: '⌘K', l: 'Command palette' }],
    tech: ['React', 'Framer Motion', 'Lenis', 'Vite'],
    visual: 'terminal',
    color: '#ff5c8a',
  },
];

export const education = {
  degree: 'B.E. — Computer Science & Engineering',
  school: 'Jhulelal Institute of Technology, Nagpur',
  period: '2019 — 2023',
};

export const languages = [
  { name: 'English', level: 'Fluent' },
  { name: 'Hindi', level: 'Fluent' },
  { name: 'Marathi', level: 'Expert' },
];

export const endpoints = [
  {
    method: 'GET',
    path: '/api/v1/profile',
    desc: 'Who am I?',
    body: {
      name: 'Roshan Bagde',
      role: 'Node.js & Full-Stack Developer',
      experienceYears: 3,
      location: 'Pune, India',
      currentlyAt: 'Fineshift Software',
      openToWork: true,
      languages: ['English', 'Hindi', 'Marathi'],
    },
  },
  {
    method: 'GET',
    path: '/api/v1/skills?stack=backend',
    desc: 'What I build with',
    body: {
      stack: 'backend',
      runtime: 'Node.js 16–21',
      frameworks: ['Express.js'],
      auth: ['JWT', 'OAuth2', 'RBAC'],
      data: ['MongoDB', 'PostgreSQL', 'Redis'],
      practices: ['Rate limiting', 'Validation', 'Swagger/OpenAPI'],
    },
  },
  {
    method: 'GET',
    path: '/api/v1/impact',
    desc: 'Numbers that matter',
    body: {
      ciBuildTime: '-70%',
      downtime: '-25%',
      postDeployDefects: '-30%',
      dashboardLoad: '-60%',
      pageLoad: '-75%',
      recordsServed: '100K+',
      juniorsMentored: 3,
    },
  },
  {
    method: 'GET',
    path: '/api/v1/architecture',
    desc: 'How I design systems',
    body: {
      style: ['Microservices', 'Event-driven', 'Layered / Clean'],
      scaling: 'Stateless Node.js behind Nginx',
      caching: 'Redis cache-aside + TTL',
      data: 'Primary-replica, indexed, sharded by key',
      async: 'Queues + workers with retries',
      delivery: 'GitLab CI → SonarQube → Docker → AWS',
      observability: ['IBM Instana', 'Prometheus', 'Grafana', 'Loki'],
    },
  },
  {
    method: 'POST',
    path: '/api/v1/hire',
    desc: 'The best request',
    status: 201,
    body: {
      status: 'created',
      message: "Great decision. Let's talk!",
      email: 'roshan.bagde@outlook.com',
      responseTime: '< 24h',
    },
  },
];

/* ---------------- System design ---------------- */

export const archSteps = [
  {
    title: 'Load balancing & reverse proxy',
    text: 'Traffic enters through Nginx — TLS termination, gzip, and round-robin or least-connections balancing across healthy upstreams.',
    tags: ['Nginx', 'L7 routing', 'Health checks', 'TLS'],
  },
  {
    title: 'Stateless horizontal scaling',
    text: 'Node.js services hold no session state — JWT-based auth means any instance can serve any request, so capacity scales by adding containers.',
    tags: ['Node.js', 'Docker', 'JWT', 'Auto-scaling'],
  },
  {
    title: 'Caching that pays for itself',
    text: 'Redis sits in front of hot reads with cache-aside and TTLs, and doubles as the store for distributed rate-limit counters.',
    tags: ['Redis', 'Cache-aside', 'TTL / LRU', 'Rate limiting'],
  },
  {
    title: 'Data: replication & sharding',
    text: 'Writes go to the primary, reads fan out to replicas. Indexed schemas, aggregation pipelines, and shard keys keep queries fast as data grows.',
    tags: ['MongoDB', 'PostgreSQL', 'Replicas', 'Consistent hashing'],
  },
  {
    title: 'Async & event-driven',
    text: 'Slow work leaves the request path — queues decouple producers from workers, with retries, exponential backoff, and idempotency keys.',
    tags: ['Queues', 'Workers', 'Cron jobs', 'Idempotency'],
  },
  {
    title: 'Observable end-to-end',
    text: 'Every hop emits metrics, logs, and traces — Prometheus & Grafana for metrics, Loki for logs, IBM Instana for APM and distributed tracing.',
    tags: ['IBM Instana', 'Prometheus', 'Grafana', 'Loki'],
  },
];

export const concepts = [
  { title: 'Scalability', tag: 'Scale', text: 'Horizontal vs vertical scaling, stateless services, auto-scaling groups.' },
  { title: 'Load Balancing', tag: 'Traffic', text: 'Round-robin, least-connections, IP-hash; L4 vs L7; health checks.' },
  { title: 'Caching', tag: 'Speed', text: 'Cache-aside, write-through, TTLs, LRU eviction and invalidation.' },
  { title: 'CAP & Consistency', tag: 'Theory', text: 'CAP / PACELC trade-offs, strong vs eventual consistency.' },
  { title: 'Replication & Sharding', tag: 'Data', text: 'Primary-replica reads, shard keys, consistent hashing.' },
  { title: 'Rate Limiting', tag: 'Protect', text: 'Token bucket, leaky bucket, fixed & sliding window counters.' },
  { title: 'Message Queues', tag: 'Async', text: 'Pub/sub, retries, dead-letter queues and back-pressure.' },
  { title: 'Microservices', tag: 'Architecture', text: 'Service boundaries, API gateway, service discovery, sagas.' },
  { title: 'API Design', tag: 'Contracts', text: 'REST conventions, versioning, pagination, idempotency keys.' },
  { title: 'Resilience', tag: 'Reliability', text: 'Circuit breakers, timeouts, retries with backoff & jitter.' },
  { title: 'Database Design', tag: 'Storage', text: 'SQL vs NoSQL, normalization, indexing, query plans.' },
  { title: 'Security', tag: 'Trust', text: 'OAuth2, JWT, RBAC, OWASP Top 10, secrets management.' },
];

/* ---------------- Design patterns ---------------- */

export const principles = ['SOLID', 'DRY', 'KISS', 'YAGNI', 'Separation of Concerns', 'Dependency Injection', 'Clean Architecture', 'MVC', 'Controller → Service → Repository', 'Event-driven', 'Microservices'];

export const patterns = [
  {
    name: 'Singleton',
    category: 'Creational',
    desc: 'Guarantee exactly one instance of a shared resource.',
    use: 'Database connection pools, config, loggers.',
    file: 'db.js',
    code: `// One shared connection pool for the whole app
class Database {
  static #instance;

  static get() {
    if (!Database.#instance) {
      Database.#instance = new Database();
    }
    return Database.#instance;
  }

  constructor() {
    this.pool = mongoose.createConnection(process.env.MONGO_URI);
  }
}

export const db = Database.get();`,
  },
  {
    name: 'Factory',
    category: 'Creational',
    desc: 'Create objects without coupling callers to concrete classes.',
    use: 'Notification channels, payment providers, storage drivers.',
    file: 'notifier.factory.js',
    code: `// Pick an implementation at runtime — callers never change
const notifiers = {
  email: () => new EmailNotifier(ses),
  sms: () => new SmsNotifier(gateway),
  slack: () => new SlackNotifier(webhook),
};

export function createNotifier(channel) {
  const make = notifiers[channel];
  if (!make) throw new Error(\`Unknown channel: \${channel}\`);
  return make();
}`,
  },
  {
    name: 'Chain of Responsibility',
    category: 'Behavioral',
    desc: 'Pass a request along a chain of handlers — Express middleware is this pattern.',
    use: 'Auth, validation, rate limiting, centralized errors.',
    file: 'orders.routes.js',
    code: `// Each handler decides: handle, reject, or pass along
router.post('/orders',
  rateLimit({ windowMs: 60_000, max: 30 }),
  authenticate,            // 401 without a valid JWT
  authorize('admin'),      // 403 if the role is missing
  validate(orderSchema),   // 422 on bad input
  createOrder              // the actual work
);

app.use(errorHandler);     // centralized error handling`,
  },
  {
    name: 'Observer / Pub-Sub',
    category: 'Behavioral',
    desc: 'Publishers emit events; any number of subscribers react independently.',
    use: 'Domain events, cache invalidation, analytics hooks.',
    file: 'events.js',
    code: `import { EventEmitter } from 'node:events';

export const bus = new EventEmitter();

// Publishers don't know who is listening
bus.emit('order.created', order);

// Subscribers react independently
bus.on('order.created', sendConfirmation);
bus.on('order.created', updateAnalytics);
bus.on('order.created', (o) => cache.del(\`user:\${o.userId}\`));`,
  },
  {
    name: 'Strategy',
    category: 'Behavioral',
    desc: 'Swap interchangeable algorithms behind a single interface.',
    use: 'Rate-limit algorithms, auth strategies, pricing rules.',
    file: 'limiter.js',
    code: `// Swap rate-limiting algorithms behind one interface
const strategies = {
  fixedWindow: new FixedWindowLimiter(redis),
  slidingWindow: new SlidingWindowLimiter(redis),
  tokenBucket: new TokenBucketLimiter(redis),
};

export const limiter = (name, opts) => async (req, res, next) => {
  const ok = await strategies[name].allow(req.ip, opts);
  return ok ? next() : res.status(429).json({ error: 'Too Many Requests' });
};`,
  },
  {
    name: 'Repository',
    category: 'Architectural',
    desc: 'Hide persistence details behind a clean data-access API.',
    use: 'Keeps services testable and database-agnostic.',
    file: 'user.repository.js',
    code: `// Business logic never talks to Mongoose directly
export class UserRepository {
  constructor(model) { this.model = model; }

  findById(id) {
    return this.model.findById(id).lean();
  }

  paginate({ page = 1, limit = 20 }) {
    return this.model.find().sort({ createdAt: -1 })
      .skip((page - 1) * limit).limit(limit).lean();
  }
}`,
  },
  {
    name: 'Adapter',
    category: 'Structural',
    desc: 'Translate a third-party interface into the shape your domain expects.',
    use: 'Wrapping the GitLab API in the analytics pipeline.',
    file: 'gitlab.adapter.js',
    code: `// Normalize the GitLab API into our own domain shape
export class GitLabAdapter {
  constructor(client) { this.client = client; }

  async getPipelines(projectId) {
    const raw = await this.client.get(\`/projects/\${projectId}/pipelines\`);
    return raw.map((p) => ({
      id: p.id,
      status: p.status,
      branch: p.ref,
      durationSec: p.duration,
    }));
  }
}`,
  },
  {
    name: 'Decorator',
    category: 'Structural',
    desc: 'Add behaviour to a function or object without modifying it.',
    use: 'Caching, retries, timing and logging wrappers.',
    file: 'withCache.js',
    code: `// Add Redis caching to any async function
export const withCache = (fn, { key, ttl = 60 }) =>
  async (...args) => {
    const k = key(...args);
    const hit = await redis.get(k);
    if (hit) return JSON.parse(hit);

    const result = await fn(...args);
    await redis.set(k, JSON.stringify(result), 'EX', ttl);
    return result;
  };

const getReport = withCache(buildReport, { key: (id) => \`report:\${id}\` });`,
  },
  {
    name: 'Circuit Breaker',
    category: 'Resilience',
    desc: 'Fail fast when a dependency is down, then probe for recovery.',
    use: 'Calls to flaky third-party APIs and downstream services.',
    file: 'circuitBreaker.js',
    code: `// Stop hammering a failing dependency
class CircuitBreaker {
  state = 'CLOSED';
  failures = 0;

  async call(fn) {
    if (this.state === 'OPEN') throw new Error('Circuit open');
    try {
      const res = await fn();
      this.failures = 0;
      this.state = 'CLOSED';
      return res;
    } catch (err) {
      if (++this.failures >= 5) this.trip();
      throw err;
    }
  }

  trip() {
    this.state = 'OPEN';
    setTimeout(() => (this.state = 'HALF_OPEN'), 10_000);
  }
}`,
  },
];

/* ---------------- Algorithms ---------------- */

export const algorithms = {
  bubble: { name: 'Bubble Sort', best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: true },
  insertion: { name: 'Insertion Sort', best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: true },
  merge: { name: 'Merge Sort', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)', stable: true },
  quick: { name: 'Quick Sort', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)', stable: false },
};

export const dsaTopics = [
  { name: 'Arrays & Hashing', o: 'O(1) lookup' },
  { name: 'Two Pointers & Sliding Window', o: 'O(n)' },
  { name: 'Binary Search', o: 'O(log n)' },
  { name: 'Stacks & Queues', o: 'O(1) ops' },
  { name: 'Linked Lists', o: 'O(1) insert' },
  { name: 'Trees & BST', o: 'O(log n)' },
  { name: 'Heaps / Priority Queues', o: 'O(log n)' },
  { name: 'Graphs — BFS / DFS', o: 'O(V + E)' },
  { name: 'Dijkstra & Shortest Paths', o: 'O(E log V)' },
  { name: 'Dynamic Programming', o: 'Memo / Tabulation' },
  { name: 'Greedy & Backtracking', o: 'Pruned search' },
  { name: 'Tries', o: 'O(L)' },
];

/* ---------------- DevOps ---------------- */

export const pipeline = [
  { name: 'Commit', tool: 'Git · GitLab', icon: '⎇', log: '$ git push origin feature/analytics-api' },
  { name: 'Build', tool: 'GitLab CI/CD', icon: '⚙', log: '▶ pipeline #4821 · cache restored · 4 parallel jobs' },
  { name: 'Test', tool: 'Jest', icon: '✓', log: '✓ 248 tests passed · coverage 86%' },
  { name: 'Quality gate', tool: 'SonarQube', icon: '◈', log: '✓ Quality gate passed · 0 bugs · 0 vulnerabilities' },
  { name: 'Containerize', tool: 'Docker', icon: '▣', log: '✓ multi-stage build · 142 MB · pushed to registry' },
  { name: 'Deploy', tool: 'AWS EC2 · S3 · RDS', icon: '☁', log: '✓ rolling deploy to EC2 · zero downtime · IAM scoped' },
  { name: 'Serve', tool: 'Nginx', icon: '⇄', log: '✓ nginx reloaded · upstreams healthy (3/3)' },
  { name: 'Monitor', tool: 'Instana · Grafana', icon: '◉', log: '✓ p95 112 ms · error rate 0.02% · alerts armed' },
];

export const devopsHighlights = [
  { v: '70%', l: 'Faster builds with caching & parallel jobs' },
  { v: '0', l: 'Downtime deploys across environments' },
  { v: '30%', l: 'Fewer post-deploy defects via test gates' },
];

/* ---------------- Observability ---------------- */

export const monitoringTools = [
  { name: 'IBM Instana', role: 'APM', text: 'Auto-discovery, service maps, and distributed tracing down to every DB call.' },
  { name: 'Prometheus', role: 'Metrics', text: 'Scraping service metrics, PromQL queries, and alerting rules.' },
  { name: 'Grafana', role: 'Dashboards', text: 'Latency, throughput and SLO dashboards with on-call alerting.' },
  { name: 'Loki', role: 'Logs', text: 'Structured log aggregation with LogQL, correlated with traces.' },
  { name: 'ELK Stack', role: 'Search', text: 'Elasticsearch, Logstash and Kibana for deep log analysis.' },
];

export const traceSpans = [
  { name: 'GET /api/v1/analytics', svc: 'nginx', start: 0, dur: 100 },
  { name: 'auth.verifyJWT', svc: 'node', start: 2, dur: 4 },
  { name: 'redis.GET report:42', svc: 'redis', start: 7, dur: 3 },
  { name: 'mongo.aggregate(reports)', svc: 'mongodb', start: 12, dur: 64 },
  { name: 'redis.SET report:42', svc: 'redis', start: 78, dur: 4 },
  { name: 'serialize.json', svc: 'node', start: 84, dur: 12 },
];

/* ---------------- Networking ---------------- */

export const netLanes = ['Browser', 'DNS', 'Nginx', 'Node API'];

export const netSteps = [
  {
    title: 'DNS resolution',
    text: 'The browser asks a resolver for the A/AAAA record. TTLs, CNAMEs and caching at every hop decide how fast this is.',
    tags: ['DNS', 'A / CNAME', 'TTL', 'UDP :53'],
    ms: '12 ms',
  },
  {
    title: 'TCP three-way handshake',
    text: 'SYN → SYN-ACK → ACK opens a reliable, ordered byte stream on port 443. Keep-alive and connection pooling avoid paying this twice.',
    tags: ['TCP', 'SYN / ACK', 'Port 443', 'Keep-alive'],
    ms: '24 ms',
  },
  {
    title: 'TLS 1.3 handshake',
    text: 'One round trip to agree on keys and verify the certificate chain. Nginx terminates TLS so the app servers don’t have to.',
    tags: ['TLS 1.3', 'Certificates', 'HTTPS', 'TLS termination'],
    ms: '28 ms',
  },
  {
    title: 'HTTP/2 request & reverse proxy',
    text: 'Multiplexed HTTP/2 streams hit Nginx, which load-balances and proxy_passes to a healthy Node.js upstream over the private network.',
    tags: ['HTTP/2', 'Reverse proxy', 'Load balancing', 'Headers'],
    ms: '6 ms',
  },
  {
    title: 'Response, compression & caching',
    text: 'JSON comes back gzip-compressed with Cache-Control and ETag headers. CORS and security headers are set on the way out.',
    tags: ['gzip / Brotli', 'Cache-Control', 'ETag', 'CORS'],
    ms: '41 ms',
  },
  {
    title: 'Revalidation & reuse',
    text: 'The next request reuses the warm connection and sends If-None-Match — a 304 Not Modified costs almost nothing.',
    tags: ['304', 'Conditional GET', 'Connection reuse', 'CDN'],
    ms: '9 ms',
  },
];

export const netMessages = [
  { from: 0, to: 1, label: 'A? api.example.com', m: 'A? api.example.com', step: 0 },
  { from: 1, to: 0, label: '203.0.113.10 · TTL 300', m: '203.0.113.10', step: 0 },
  { from: 0, to: 2, label: 'SYN', step: 1 },
  { from: 2, to: 0, label: 'SYN-ACK', step: 1 },
  { from: 0, to: 2, label: 'ACK', step: 1 },
  { from: 0, to: 2, label: 'ClientHello · key share', m: 'ClientHello', step: 2 },
  { from: 2, to: 0, label: 'ServerHello · cert · Finished', m: 'ServerHello · cert', step: 2 },
  { from: 0, to: 2, label: 'GET /api/v1/analytics (h2)', m: 'GET /api/v1/analytics', step: 3 },
  { from: 2, to: 3, label: 'proxy_pass upstream', m: 'proxy_pass', step: 3 },
  { from: 3, to: 2, label: '200 OK · JSON', m: '200 OK', step: 4 },
  { from: 2, to: 0, label: '200 · gzip · ETag "a1f"', m: '200 · gzip · ETag', step: 4 },
  { from: 0, to: 2, label: 'If-None-Match: "a1f"', m: 'If-None-Match', step: 5 },
  { from: 2, to: 0, label: '304 Not Modified', step: 5 },
];

export const osiLayers = [
  { n: 7, name: 'Application', tcpip: 'Application', protocols: ['HTTP/HTTPS', 'REST', 'WebSocket', 'DNS', 'SMTP'], me: 'Designing REST APIs, status codes, caching headers, WebSockets and API gateways.' },
  { n: 6, name: 'Presentation', tcpip: 'Application', protocols: ['TLS/SSL', 'JSON', 'gzip / Brotli', 'UTF-8'], me: 'TLS termination at Nginx, payload compression and serialization formats.' },
  { n: 5, name: 'Session', tcpip: 'Application', protocols: ['Sessions', 'Cookies', 'JWT', 'Keep-alive'], me: 'Stateless auth with JWT/OAuth2, cookie flags, session lifetime and keep-alive.' },
  { n: 4, name: 'Transport', tcpip: 'Transport', protocols: ['TCP', 'UDP', 'Ports', 'QUIC'], me: 'Handshakes, timeouts, connection pooling, and choosing TCP vs UDP.' },
  { n: 3, name: 'Network', tcpip: 'Internet', protocols: ['IPv4/IPv6', 'ICMP', 'Routing', 'CIDR / NAT'], me: 'AWS VPC subnets, route tables, NAT gateways and security groups.' },
  { n: 2, name: 'Data Link', tcpip: 'Link', protocols: ['Ethernet', 'MAC', 'ARP', 'VLAN'], me: 'How frames move inside a LAN — ARP, switching and VLAN segmentation.' },
  { n: 1, name: 'Physical', tcpip: 'Link', protocols: ['Fiber', 'Copper', 'Wi-Fi', 'Signals'], me: 'The bits on the wire — media, bandwidth and latency fundamentals.' },
];

export const netConcepts = [
  { title: 'TCP vs UDP', tag: 'Transport', text: 'Reliability, ordering and congestion control vs low-latency datagrams.', cmd: 'ss -tuln', out: ['tcp  LISTEN  0.0.0.0:443', 'udp  UNCONN  0.0.0.0:53'] },
  { title: 'HTTP/1.1 · 2 · 3', tag: 'Protocols', text: 'Keep-alive, multiplexing, header compression, QUIC over UDP.', cmd: 'curl -sI --http2 https://api.example.com', out: ['HTTP/2 200', 'alt-svc: h3=":443"'] },
  { title: 'DNS', tag: 'Naming', text: 'Resolvers, A/AAAA/CNAME/MX records, TTLs and propagation.', cmd: 'dig +noall +answer api.example.com', out: ['api.example.com.  300  IN  A  203.0.113.10'] },
  { title: 'TLS / HTTPS', tag: 'Security', text: 'Handshakes, certificate chains, HSTS and TLS termination.', cmd: 'openssl s_client -connect api.example.com:443', out: ['Protocol  : TLSv1.3', 'Verify return code: 0 (ok)'] },
  { title: 'Load Balancing L4 / L7', tag: 'Traffic', text: 'TCP-level vs HTTP-aware routing, health checks, sticky sessions.', cmd: 'upstream api { least_conn; server node1; server node2; }', out: ['health: node1 ✓  node2 ✓'] },
  { title: 'Reverse Proxy · Nginx', tag: 'Edge', text: 'proxy_pass, upstreams, gzip, rate limits and caching at the edge.', cmd: 'nginx -t', out: ['syntax is ok', 'test is successful'] },
  { title: 'WebSockets & SSE', tag: 'Real-time', text: 'Protocol upgrade, persistent connections and server push.', cmd: 'GET /socket  Upgrade: websocket', out: ['HTTP/1.1 101 Switching Protocols'] },
  { title: 'CORS & Security Headers', tag: 'Browser', text: 'Preflight requests, allowed origins, CSP, Helmet defaults.', cmd: 'curl -sI -X OPTIONS https://api.example.com', out: ['access-control-allow-origin: https://app.example.com', 'strict-transport-security: max-age=31536000'] },
  { title: 'Subnetting & CIDR', tag: 'Addressing', text: 'Network masks, host ranges, private ranges (RFC 1918).', cmd: 'ipcalc 10.0.1.0/24', out: ['Netmask: 255.255.255.0', 'Hosts/Net: 254'] },
  { title: 'AWS VPC', tag: 'Cloud', text: 'Public/private subnets, route tables, security groups, NACLs.', cmd: 'aws ec2 describe-subnets', out: ['10.0.1.0/24  public   igw', '10.0.2.0/24  private  nat'] },
  { title: 'NAT & Firewalls', tag: 'Perimeter', text: 'Address translation, egress control, port allow-lists.', cmd: 'ufw status', out: ['22/tcp   ALLOW  admin-vpn', '443/tcp  ALLOW  anywhere'] },
  { title: 'CDN & Edge Caching', tag: 'Performance', text: 'Cache keys, TTLs, invalidation and origin shielding.', cmd: 'curl -sI https://cdn.example.com/app.js', out: ['cache-control: max-age=31536000', 'x-cache: HIT'] },
];

/* ---------------- Exploded stack (bottom → top) ---------------- */

export const stackLayers = [
  { id: 'obs', name: 'Observability', tech: 'Instana · Prometheus · Grafana · Loki', desc: 'APM traces, metrics and logs under everything — so every incident has a root cause.', color: '#30d158', pattern: 'obs' },
  { id: 'platform', name: 'Platform', tech: 'Docker · AWS · GitLab CI/CD · SonarQube', desc: 'Containerised services shipped through quality-gated pipelines to AWS.', color: '#64d2ff', pattern: 'platform' },
  { id: 'data', name: 'Data', tech: 'MongoDB · PostgreSQL', desc: 'Indexed schemas, aggregation pipelines, replicas — fast at 100K+ records.', color: '#a259ff', pattern: 'db' },
  { id: 'cache', name: 'Cache', tech: 'Redis', desc: 'Cache-aside on hot endpoints and distributed rate-limit counters.', color: '#ff453a', pattern: 'cache' },
  { id: 'api', name: 'API', tech: 'Node.js · Express · JWT / OAuth2', desc: 'Secure, documented REST APIs with validation and centralized errors.', color: '#2997ff', pattern: 'api' },
  { id: 'edge', name: 'Edge', tech: 'Nginx · TLS · Load balancing', desc: 'Reverse proxy, TLS termination, gzip and traffic distribution.', color: '#ff9f0a', pattern: 'edge' },
  { id: 'ui', name: 'Interface', tech: 'React · Redux Toolkit', desc: 'Component-driven UIs, code-split and memoized to stay fast.', color: '#ff5c8a', pattern: 'ui' },
];

/* OSI model as an exploded stack (bottom → top) */
const osiVisual = {
  7: { color: '#ff9f0a', pattern: 'http', tag: 'Data' },
  6: { color: '#ff5c8a', pattern: 'lock', tag: 'Data' },
  5: { color: '#bf5af2', pattern: 'session', tag: 'Data' },
  4: { color: '#a259ff', pattern: 'transport', tag: 'Segment' },
  3: { color: '#5e5ce6', pattern: 'network', tag: 'Packet' },
  2: { color: '#2997ff', pattern: 'link', tag: 'Frame' },
  1: { color: '#64d2ff', pattern: 'physical', tag: 'Bits' },
};

export const osiStack = [...osiLayers].reverse().map((l) => ({
  id: `osi-${l.n}`,
  n: l.n,
  name: `L${l.n} · ${l.name}`,
  tech: l.protocols.join(' · '),
  desc: l.me,
  ...osiVisual[l.n],
}));

export const ports = [
  { port: 22, name: 'SSH', proto: 'TCP' },
  { port: 53, name: 'DNS', proto: 'UDP/TCP' },
  { port: 80, name: 'HTTP', proto: 'TCP' },
  { port: 443, name: 'HTTPS', proto: 'TCP' },
  { port: 3000, name: 'Node.js · Grafana', proto: 'TCP' },
  { port: 5432, name: 'PostgreSQL', proto: 'TCP' },
  { port: 6379, name: 'Redis', proto: 'TCP' },
  { port: 27017, name: 'MongoDB', proto: 'TCP' },
  { port: 9090, name: 'Prometheus', proto: 'TCP' },
  { port: 3100, name: 'Loki', proto: 'TCP' },
];

/* ---------------- Spoken intro (Web Speech API) ---------------- */

export const introScript = [
  { chapter: 'Hello', section: 'home', text: "Hi, I'm Roshan Bagde — a Node.js and full-stack developer from Pune, India, with over three years of experience shipping production software." },
  { chapter: 'What I do', section: 'about', text: 'I design and scale secure REST APIs with Node.js and Express, and pair them with fast, component-driven React interfaces. I own services end to end — from schema design, to CI/CD, to production.' },
  { chapter: 'Now', section: 'experience', text: "Right now I'm a Software Developer at Fineshift Software, architecting a modular analytics platform — with JWT security, Swagger-documented APIs, and Redis caching on hot endpoints." },
  { chapter: 'Before', section: 'experience', text: 'Before that, at Datamato Technologies, I cut build times by seventy percent with GitLab CI/CD, reduced downtime by twenty-five percent through root-cause fixes, and mentored three junior developers.' },
  { chapter: 'Data', section: 'skills', text: 'On the data side, I work with MongoDB and PostgreSQL — indexed schemas and aggregation pipelines that stay fast at more than a hundred thousand records.' },
  { chapter: 'Design', section: 'system-design', text: 'I think in systems: load balancing, caching, replication and queues — and I apply design patterns, algorithms and solid networking fundamentals, from the OSI model to subnets in an AWS VPC.' },
  { chapter: 'Ship', section: 'devops', text: 'I ship with Docker, GitLab pipelines, SonarQube quality gates, Nginx and AWS — and I watch production with Instana, Prometheus, Grafana and Loki.' },
  { chapter: 'Hello again', section: 'contact', text: "I hold a B.E. in Computer Science, and I'm always happy to talk about backend architecture or a great product. Thanks for listening — let's build something together." },
];

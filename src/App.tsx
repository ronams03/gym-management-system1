import { type ReactNode, useMemo, useState } from "react";

type Tab = "overview" | "members" | "schedule" | "finance";
type RangeKey = "7d" | "30d" | "90d";
type MemberStatus = "active" | "trial" | "freeze";
type RiskLevel = "low" | "medium" | "high";

type Member = {
  id: number;
  name: string;
  plan: string;
  goal: string;
  status: MemberStatus;
  visits: number;
  coach: string;
  lastCheckIn: string;
  nextPayment: string;
  balance: number;
  risk: RiskLevel;
};

type ClassSession = {
  id: number;
  name: string;
  coach: string;
  start: string;
  end: string;
  booked: number;
  capacity: number;
  zone: string;
  intensity: string;
};

type Trainer = {
  name: string;
  specialty: string;
  utilization: number;
  clientsToday: number;
  score: string;
};

type Invoice = {
  member: string;
  due: string;
  amount: number;
  method: string;
  status: "due" | "processing" | "paid";
};

type Equipment = {
  name: string;
  zone: string;
  usage: number;
  status: "ready" | "watch" | "service";
};

const tabs: { key: Tab; label: string; note: string }[] = [
  { key: "overview", label: "Overview", note: "Live KPI board" },
  { key: "members", label: "Members", note: "Roster and renewals" },
  { key: "schedule", label: "Schedule", note: "Classes and coaches" },
  { key: "finance", label: "Finance", note: "MRR and collections" },
];

const rangeOptions: RangeKey[] = ["7d", "30d", "90d"];

const attendanceByRange = {
  "7d": {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    data: [102, 118, 126, 121, 139, 154, 136],
  },
  "30d": {
    labels: ["W1", "W2", "W3", "W4", "W5", "W6"],
    data: [690, 742, 768, 724, 805, 832],
  },
  "90d": {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    data: [2680, 2790, 2865, 3010, 3180, 3305],
  },
} as const;

const revenueByRange = {
  "7d": {
    labels: ["1", "2", "3", "4", "5", "6", "7"],
    data: [2240, 2350, 2410, 2480, 2590, 2680, 2740],
  },
  "30d": {
    labels: ["W1", "W2", "W3", "W4", "W5", "W6"],
    data: [15220, 15840, 16120, 16690, 17180, 18420],
  },
  "90d": {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    data: [48200, 49550, 50820, 52360, 54840, 56100],
  },
} as const;

const planMix = [
  { label: "Performance", value: 44, color: "#84cc16" },
  { label: "Strength+", value: 28, color: "#f97316" },
  { label: "Recovery", value: 16, color: "#22c55e" },
  { label: "Starter", value: 12, color: "#facc15" },
];

const members: Member[] = [
  {
    id: 1,
    name: "Aarav Mehta",
    plan: "Performance",
    goal: "Strength block",
    status: "active",
    visits: 5,
    coach: "Maya",
    lastCheckIn: "06:12",
    nextPayment: "Today",
    balance: 89,
    risk: "medium",
  },
  {
    id: 2,
    name: "Sofia Reed",
    plan: "Strength+",
    goal: "Hyrox prep",
    status: "active",
    visits: 6,
    coach: "Noah",
    lastCheckIn: "07:05",
    nextPayment: "18 Sep",
    balance: 0,
    risk: "low",
  },
  {
    id: 3,
    name: "Liam Chen",
    plan: "Starter",
    goal: "Fat loss",
    status: "trial",
    visits: 2,
    coach: "Tara",
    lastCheckIn: "08:42",
    nextPayment: "14 Sep",
    balance: 19,
    risk: "medium",
  },
  {
    id: 4,
    name: "Nina Kapoor",
    plan: "Recovery",
    goal: "Mobility",
    status: "active",
    visits: 4,
    coach: "Maya",
    lastCheckIn: "10:14",
    nextPayment: "21 Sep",
    balance: 0,
    risk: "low",
  },
  {
    id: 5,
    name: "Daniel Ortiz",
    plan: "Strength+",
    goal: "Muscle gain",
    status: "freeze",
    visits: 1,
    coach: "Jordan",
    lastCheckIn: "Mon",
    nextPayment: "Paused",
    balance: 0,
    risk: "high",
  },
  {
    id: 6,
    name: "Emma Silva",
    plan: "Performance",
    goal: "Conditioning",
    status: "active",
    visits: 5,
    coach: "Noah",
    lastCheckIn: "12:28",
    nextPayment: "11 Sep",
    balance: 89,
    risk: "high",
  },
  {
    id: 7,
    name: "Marcus Bell",
    plan: "Performance",
    goal: "Athlete return",
    status: "active",
    visits: 4,
    coach: "Jordan",
    lastCheckIn: "14:06",
    nextPayment: "22 Sep",
    balance: 0,
    risk: "low",
  },
  {
    id: 8,
    name: "Ivy Walker",
    plan: "Starter",
    goal: "General fitness",
    status: "trial",
    visits: 3,
    coach: "Tara",
    lastCheckIn: "15:18",
    nextPayment: "16 Sep",
    balance: 19,
    risk: "medium",
  },
  {
    id: 9,
    name: "Kabir Shah",
    plan: "Strength+",
    goal: "Powerlifting",
    status: "active",
    visits: 6,
    coach: "Maya",
    lastCheckIn: "17:09",
    nextPayment: "27 Sep",
    balance: 0,
    risk: "low",
  },
  {
    id: 10,
    name: "Chloe Evans",
    plan: "Recovery",
    goal: "Postural rehab",
    status: "active",
    visits: 3,
    coach: "Jordan",
    lastCheckIn: "18:10",
    nextPayment: "12 Sep",
    balance: 59,
    risk: "medium",
  },
];

const classes: ClassSession[] = [
  {
    id: 1,
    name: "Hyrox Engine",
    coach: "Noah",
    start: "06:30",
    end: "07:20",
    booked: 19,
    capacity: 24,
    zone: "Turf",
    intensity: "High",
  },
  {
    id: 2,
    name: "Barbell Strength",
    coach: "Maya",
    start: "08:00",
    end: "09:00",
    booked: 14,
    capacity: 18,
    zone: "Rack lane",
    intensity: "Moderate",
  },
  {
    id: 3,
    name: "Mobility Reset",
    coach: "Tara",
    start: "12:15",
    end: "12:50",
    booked: 9,
    capacity: 12,
    zone: "Recovery",
    intensity: "Low",
  },
  {
    id: 4,
    name: "Glute Lab",
    coach: "Jordan",
    start: "17:30",
    end: "18:20",
    booked: 17,
    capacity: 20,
    zone: "Studio A",
    intensity: "Moderate",
  },
  {
    id: 5,
    name: "Fight Conditioning",
    coach: "Noah",
    start: "19:00",
    end: "19:50",
    booked: 21,
    capacity: 24,
    zone: "Combat deck",
    intensity: "High",
  },
];

const trainers: Trainer[] = [
  { name: "Maya", specialty: "Strength systems", utilization: 91, clientsToday: 8, score: "5.0" },
  { name: "Noah", specialty: "Conditioning", utilization: 88, clientsToday: 7, score: "4.9" },
  { name: "Jordan", specialty: "Movement rehab", utilization: 72, clientsToday: 5, score: "4.8" },
  { name: "Tara", specialty: "Mobility and core", utilization: 64, clientsToday: 4, score: "4.7" },
];

const invoices: Invoice[] = [
  { member: "Aarav Mehta", due: "Today", amount: 89, method: "Card auto-pay", status: "processing" },
  { member: "Emma Silva", due: "11 Sep", amount: 89, method: "Card on file", status: "due" },
  { member: "Chloe Evans", due: "12 Sep", amount: 59, method: "UPI", status: "due" },
  { member: "Liam Chen", due: "14 Sep", amount: 19, method: "Trial renewal", status: "due" },
  { member: "Ivy Walker", due: "16 Sep", amount: 19, method: "Trial renewal", status: "due" },
  { member: "Sofia Reed", due: "18 Sep", amount: 129, method: "Annual split", status: "paid" },
];

const equipment: Equipment[] = [
  { name: "Assault Bike", zone: "Conditioning", usage: 86, status: "ready" },
  { name: "Leg Press", zone: "Strength", usage: 91, status: "watch" },
  { name: "Cable Crossover", zone: "Strength", usage: 73, status: "ready" },
  { name: "RowErg", zone: "Conditioning", usage: 78, status: "ready" },
  { name: "Infrared Sauna", zone: "Recovery", usage: 62, status: "service" },
];

const zoneUtilization = [
  { name: "Strength floor", value: 84 },
  { name: "Cardio deck", value: 67 },
  { name: "Functional turf", value: 91 },
  { name: "Recovery suite", value: 48 },
];

const expenseMix = [
  { label: "Payroll", value: 42, color: "#84cc16" },
  { label: "Rent", value: 26, color: "#f97316" },
  { label: "Utilities", value: 14, color: "#facc15" },
  { label: "Equipment", value: 18, color: "#22c55e" },
];

const activityFeed = [
  { time: "06:18", title: "Morning access opened", note: "38 members checked in before 07:00" },
  { time: "08:55", title: "Class waitlist moved", note: "3 spots released for Barbell Strength" },
  { time: "12:10", title: "Recovery suite at 48%", note: "Low occupancy window for upsell sessions" },
  { time: "17:04", title: "Peak floor traffic", note: "Functional turf crossed 90% utilization" },
];

const statusStyles: Record<MemberStatus, string> = {
  active: "border-lime-400/20 bg-lime-400/10 text-lime-200",
  trial: "border-amber-400/20 bg-amber-400/10 text-amber-100",
  freeze: "border-zinc-500/30 bg-zinc-500/10 text-zinc-300",
};

const riskStyles: Record<RiskLevel, string> = {
  low: "text-lime-200",
  medium: "text-amber-100",
  high: "text-rose-200",
};

const invoiceStyles: Record<Invoice["status"], string> = {
  due: "border-rose-400/20 bg-rose-400/10 text-rose-100",
  processing: "border-amber-400/20 bg-amber-400/10 text-amber-100",
  paid: "border-lime-400/20 bg-lime-400/10 text-lime-200",
};

const equipmentStyles: Record<Equipment["status"], string> = {
  ready: "border-lime-400/20 bg-lime-400/10 text-lime-200",
  watch: "border-amber-400/20 bg-amber-400/10 text-amber-100",
  service: "border-rose-400/20 bg-rose-400/10 text-rose-100",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function buildConicGradient(segments: { value: number; color: string }[]) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  let start = 0;

  return `conic-gradient(${segments
    .map((segment) => {
      const end = start + (segment.value / total) * 360;
      const stop = `${segment.color} ${start}deg ${end}deg`;
      start = end;
      return stop;
    })
    .join(", ")})`;
}

function getSparkPoints(data: readonly number[], width = 320, height = 120, padding = 12) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const scale = max - min || 1;

  return data.map((value, index) => {
    const x = padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1);
    const y = height - padding - ((value - min) / scale) * (height - padding * 2);
    return { x, y };
  });
}

function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#07110b] text-zinc-50">
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(132,204,22,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(249,115,22,0.14),_transparent_24%),linear-gradient(180deg,_#07110b_0%,_#09150d_42%,_#050806_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">{children}</div>
      </div>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  right,
  children,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-white/10 bg-white/5 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.24em] text-zinc-400">{title}</p>
          {subtitle ? <h2 className="text-sm font-medium text-white/90">{subtitle}</h2> : null}
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

function NavButton({
  active,
  label,
  note,
  onClick,
}: {
  active: boolean;
  label: string;
  note: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border px-3 py-3 text-left transition ${
        active
          ? "border-lime-400/30 bg-lime-400/14 shadow-[0_0_0_1px_rgba(132,204,22,0.1)]"
          : "border-white/8 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.06]"
      }`}
    >
      <p className="text-sm font-medium text-white/90">{label}</p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-zinc-400">{note}</p>
    </button>
  );
}

function StatCard({
  label,
  value,
  note,
  tone,
}: {
  label: string;
  value: string;
  note: string;
  tone: "lime" | "orange" | "yellow" | "green";
}) {
  const tones = {
    lime: "from-lime-400/15 to-lime-400/5 text-lime-200",
    orange: "from-orange-400/15 to-orange-400/5 text-orange-100",
    yellow: "from-amber-400/15 to-amber-400/5 text-amber-100",
    green: "from-emerald-400/15 to-emerald-400/5 text-emerald-100",
  } as const;

  return (
    <div className={`rounded-[22px] border border-white/10 bg-gradient-to-br ${tones[tone]} p-4`}>
      <p className="text-[10px] uppercase tracking-[0.24em] text-zinc-400">{label}</p>
      <p className="mt-3 text-base font-semibold text-white">{value}</p>
      <p className="mt-2 text-xs text-zinc-300">{note}</p>
    </div>
  );
}

function ProgressBar({ value, color = "bg-lime-400" }: { value: number; color?: string }) {
  return (
    <div className="h-2 rounded-full bg-white/8">
      <div className={`h-2 rounded-full ${color}`} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
}

function Sparkline({ data }: { data: readonly number[] }) {
  const points = getSparkPoints(data);
  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} 108 L ${points[0].x} 108 Z`;

  return (
    <svg viewBox="0 0 320 120" className="h-28 w-full">
      <defs>
        <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#84cc16" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#84cc16" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#spark-fill)" />
      <path d={linePath} fill="none" stroke="#84cc16" strokeWidth="3" strokeLinecap="round" />
      {points.map((point, index) => (
        <circle key={`${point.x}-${index}`} cx={point.x} cy={point.y} r="3" fill="#f97316" />
      ))}
    </svg>
  );
}

function DonutChart({
  segments,
  centerTop,
  centerBottom,
}: {
  segments: { label: string; value: number; color: string }[];
  centerTop: string;
  centerBottom: string;
}) {
  return (
    <div className="relative mx-auto h-40 w-40">
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: buildConicGradient(segments) }}
      />
      <div className="absolute inset-[18px] rounded-full border border-white/10 bg-[#08110b]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">{centerTop}</span>
        <span className="mt-2 text-base font-semibold text-white">{centerBottom}</span>
      </div>
    </div>
  );
}

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [range, setRange] = useState<RangeKey>("30d");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<MemberStatus | "all">("all");
  const [actionMessage, setActionMessage] = useState(
    "Staffing is balanced and evening turf demand is the current pressure point."
  );

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesQuery = [member.name, member.plan, member.goal, member.coach]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesStatus = statusFilter === "all" ? true : member.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [query, statusFilter]);

  const totalActiveMembers = members.filter((member) => member.status === "active").length;
  const trials = members.filter((member) => member.status === "trial").length;
  const atRisk = members.filter((member) => member.risk !== "low").length;
  const averageVisits = (
    members.reduce((sum, member) => sum + member.visits, 0) / Math.max(members.length, 1)
  ).toFixed(1);
  const checkInsToday = attendanceByRange["7d"].data[attendanceByRange["7d"].data.length - 1];
  const occupancy = Math.round(
    (classes.reduce((sum, session) => sum + session.booked, 0) /
      classes.reduce((sum, session) => sum + session.capacity, 0)) *
      100
  );
  const pendingRevenue = invoices
    .filter((invoice) => invoice.status !== "paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const revenueNow = revenueByRange[range].data[revenueByRange[range].data.length - 1];
  const busiestClass = [...classes].sort((a, b) => b.booked / b.capacity - a.booked / a.capacity)[0];
  const dueSoon = invoices.filter((invoice) => invoice.status !== "paid");

  const handleAction = (message: string, tab: Tab) => {
    setActionMessage(message);
    setActiveTab(tab);
  };

  const overviewView = (
    <div className="grid gap-4 xl:grid-cols-[1.55fr_minmax(320px,1fr)]">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          <StatCard
            label="Active members"
            value={`${totalActiveMembers * 18 + 22}`}
            note="6 renewals due this week"
            tone="lime"
          />
          <StatCard
            label="Check-ins today"
            value={`${checkInsToday}`}
            note="12% above last week"
            tone="orange"
          />
          <StatCard
            label="Floor occupancy"
            value={`${occupancy}%`}
            note="Peak expected at 18:00"
            tone="yellow"
          />
          <StatCard
            label="MRR snapshot"
            value={formatCurrency(revenueByRange["30d"].data[revenueByRange["30d"].data.length - 1])}
            note="Collection rate 96.4%"
            tone="green"
          />
        </div>

        <Panel
          title="Check-in momentum"
          subtitle="Attendance shape and revenue pace"
          right={<span className="rounded-full border border-lime-400/20 bg-lime-400/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-lime-200">Stable growth</span>}
        >
          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-2">
                {attendanceByRange[range].data.map((value, index) => {
                  const max = Math.max(...attendanceByRange[range].data);
                  return (
                    <div key={`${attendanceByRange[range].labels[index]}-${value}`} className="space-y-2">
                      <div className="flex h-28 items-end rounded-2xl border border-white/6 bg-white/[0.03] p-2">
                        <div
                          className="w-full rounded-xl bg-gradient-to-t from-lime-400 to-orange-400"
                          style={{ height: `${(value / max) * 100}%` }}
                        />
                      </div>
                      <div className="space-y-1 text-center">
                        <p className="text-xs text-zinc-200">{value}</p>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                          {attendanceByRange[range].labels[index]}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/20 p-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">Revenue signal</p>
                    <p className="mt-1 text-sm text-white/90">Current run rate {formatCurrency(revenueNow)}</p>
                  </div>
                  <span className="rounded-full border border-orange-400/20 bg-orange-400/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-orange-100">
                    +8.6%
                  </span>
                </div>
                <Sparkline data={revenueByRange[range].data} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-white/8 bg-black/20 p-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">Pressure points</p>
                <div className="mt-3 space-y-3">
                  <div className="rounded-2xl border border-white/6 bg-white/[0.03] p-3">
                    <p className="text-sm font-medium text-white/90">Busiest class</p>
                    <div className="mt-2 flex items-center justify-between gap-3 text-xs text-zinc-300">
                      <span>{busiestClass.name}</span>
                      <span>{busiestClass.booked}/{busiestClass.capacity}</span>
                    </div>
                    <div className="mt-2">
                      <ProgressBar value={(busiestClass.booked / busiestClass.capacity) * 100} color="bg-orange-400" />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/6 bg-white/[0.03] p-3">
                    <p className="text-sm font-medium text-white/90">Renewal attention</p>
                    <p className="mt-2 text-xs text-zinc-300">{atRisk} members need follow-up due to low engagement or pending balances.</p>
                  </div>
                  <div className="rounded-2xl border border-white/6 bg-white/[0.03] p-3">
                    <p className="text-sm font-medium text-white/90">Recovery window</p>
                    <p className="mt-2 text-xs text-zinc-300">12:00–15:00 has spare capacity for physio, mobility and intro consults.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/8 bg-black/20 p-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">Zone occupancy</p>
                <div className="mt-3 space-y-3">
                  {zoneUtilization.map((zone) => (
                    <div key={zone.name} className="space-y-2">
                      <div className="flex items-center justify-between gap-3 text-xs text-zinc-300">
                        <span>{zone.name}</span>
                        <span>{zone.value}%</span>
                      </div>
                      <ProgressBar value={zone.value} color={zone.value > 85 ? "bg-orange-400" : "bg-lime-400"} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Panel>

        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Attention board" subtitle="Members who may need outreach">
            <div className="space-y-3">
              {members
                .filter((member) => member.risk !== "low")
                .slice(0, 4)
                .map((member) => (
                  <div key={member.id} className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-black/20 p-3">
                    <div>
                      <p className="text-sm font-medium text-white/90">{member.name}</p>
                      <p className="mt-1 text-xs text-zinc-400">
                        {member.goal} · Coach {member.coach}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-medium ${riskStyles[member.risk]}`}>{member.risk} risk</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-zinc-500">Next pay {member.nextPayment}</p>
                    </div>
                  </div>
                ))}
            </div>
          </Panel>

          <Panel title="Equipment readiness" subtitle="High-use equipment monitoring">
            <div className="space-y-3">
              {equipment.map((item) => (
                <div key={item.name} className="rounded-2xl border border-white/8 bg-black/20 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white/90">{item.name}</p>
                      <p className="mt-1 text-xs text-zinc-400">{item.zone}</p>
                    </div>
                    <span className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] ${equipmentStyles[item.status]}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between gap-3 text-xs text-zinc-300">
                      <span>Usage load</span>
                      <span>{item.usage}%</span>
                    </div>
                    <ProgressBar value={item.usage} color={item.status === "service" ? "bg-rose-400" : item.status === "watch" ? "bg-amber-400" : "bg-lime-400"} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <div className="space-y-4">
        <Panel title="Membership mix" subtitle="Plan share across active base">
          <div className="space-y-4">
            <DonutChart segments={planMix} centerTop="active split" centerBottom="148 members" />
            <div className="space-y-3">
              {planMix.map((plan) => (
                <div key={plan.label} className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-black/20 px-3 py-2.5">
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: plan.color }} />
                    <span className="text-xs text-zinc-200">{plan.label}</span>
                  </div>
                  <span className="text-xs text-zinc-400">{plan.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel title="Class board" subtitle="Today's most relevant sessions">
          <div className="space-y-3">
            {classes.map((session) => (
              <div key={session.id} className="rounded-2xl border border-white/8 bg-black/20 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white/90">{session.name}</p>
                    <p className="mt-1 text-xs text-zinc-400">
                      {session.start}–{session.end} · {session.coach}
                    </p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-300">
                    {session.intensity}
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between gap-3 text-xs text-zinc-300">
                    <span>{session.zone}</span>
                    <span>
                      {session.booked}/{session.capacity}
                    </span>
                  </div>
                  <ProgressBar value={(session.booked / session.capacity) * 100} color="bg-lime-400" />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Live activity" subtitle="Operational pulse from today">
          <div className="space-y-3">
            {activityFeed.map((item) => (
              <div key={`${item.time}-${item.title}`} className="relative rounded-2xl border border-white/8 bg-black/20 p-3 pl-5">
                <div className="absolute left-3 top-4 h-2 w-2 rounded-full bg-orange-400" />
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-white/90">{item.title}</p>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">{item.time}</span>
                </div>
                <p className="mt-2 text-xs text-zinc-400">{item.note}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );

  const membersView = (
    <div className="grid gap-4 xl:grid-cols-[1.45fr_minmax(300px,1fr)]">
      <Panel
        title="Member roster"
        subtitle="Search, segment and monitor engagement"
        right={<span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-300">{filteredMembers.length} visible</span>}
      >
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <label className="block flex-1">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-zinc-500">Search member</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name, plan, goal, coach"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-lime-400/30"
            />
          </label>
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500">Status</p>
            <div className="flex flex-wrap gap-2">
              {(["all", "active", "trial", "freeze"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setStatusFilter(item)}
                  className={`rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] transition ${
                    statusFilter === item
                      ? "border-lime-400/25 bg-lime-400/10 text-lime-200"
                      : "border-white/10 bg-white/[0.03] text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {filteredMembers.map((member) => (
            <div key={member.id} className="rounded-[22px] border border-white/8 bg-black/20 p-3">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-white/90">{member.name}</p>
                    <span className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] ${statusStyles[member.status]}`}>
                      {member.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    {member.plan} · {member.goal} · Coach {member.coach}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Visits</p>
                    <p className="mt-1 text-sm text-white/90">{member.visits}/wk</p>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Last in</p>
                    <p className="mt-1 text-sm text-white/90">{member.lastCheckIn}</p>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Next pay</p>
                    <p className="mt-1 text-sm text-white/90">{member.nextPayment}</p>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Balance</p>
                    <p className={`mt-1 text-sm ${member.balance > 0 ? "text-amber-100" : "text-white/90"}`}>
                      {member.balance > 0 ? formatCurrency(member.balance) : "Clear"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <div className="space-y-4">
        <Panel title="Engagement pulse" subtitle="Core member health indicators">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-2xl border border-white/8 bg-black/20 p-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Average visits</p>
              <p className="mt-2 text-base font-semibold text-white">{averageVisits}</p>
              <p className="mt-2 text-xs text-zinc-400">Healthy target is 4.0+ visits per week.</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-black/20 p-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Trials in motion</p>
              <p className="mt-2 text-base font-semibold text-white">{trials}</p>
              <p className="mt-2 text-xs text-zinc-400">Conversion lane is strongest after 3rd visit.</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-black/20 p-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">At-risk count</p>
              <p className="mt-2 text-base font-semibold text-white">{atRisk}</p>
              <p className="mt-2 text-xs text-zinc-400">Set recovery calls and plan reviews this afternoon.</p>
            </div>
          </div>
        </Panel>

        <Panel title="Plan performance" subtitle="Sample mix by package">
          <div className="space-y-3">
            {planMix.map((plan) => (
              <div key={plan.label} className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-xs text-zinc-300">
                  <span>{plan.label}</span>
                  <span>{plan.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/8">
                  <div className="h-2 rounded-full" style={{ width: `${plan.value}%`, backgroundColor: plan.color }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Renewals due" subtitle="Follow-up queue for the next few days">
          <div className="space-y-3">
            {dueSoon.slice(0, 5).map((invoice) => (
              <div key={`${invoice.member}-${invoice.due}`} className="rounded-2xl border border-white/8 bg-black/20 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white/90">{invoice.member}</p>
                    <p className="mt-1 text-xs text-zinc-400">{invoice.method}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/90">{formatCurrency(invoice.amount)}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-zinc-500">{invoice.due}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );

  const scheduleView = (
    <div className="grid gap-4 xl:grid-cols-[1.45fr_minmax(320px,1fr)]">
      <div className="space-y-4">
        <Panel title="Programming runway" subtitle="Today's classes with fill ratio and intensity">
          <div className="space-y-3">
            {classes.map((session) => {
              const fill = Math.round((session.booked / session.capacity) * 100);
              return (
                <div key={session.id} className="rounded-[22px] border border-white/8 bg-black/20 p-3">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-white/90">{session.name}</p>
                        <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-300">
                          {session.intensity}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400">
                        {session.start}–{session.end} · {session.zone} · Coach {session.coach}
                      </p>
                    </div>
                    <div className="grid min-w-[240px] grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Booked</p>
                        <p className="mt-1 text-sm text-white/90">{session.booked}/{session.capacity}</p>
                      </div>
                      <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Fill</p>
                        <p className="mt-1 text-sm text-white/90">{fill}%</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <ProgressBar value={fill} color={fill >= 85 ? "bg-orange-400" : "bg-lime-400"} />
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel title="Zone utilization" subtitle="Where traffic is clustering right now">
          <div className="grid gap-3 sm:grid-cols-2">
            {zoneUtilization.map((zone) => (
              <div key={zone.name} className="rounded-2xl border border-white/8 bg-black/20 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-white/90">{zone.name}</p>
                  <span className="text-xs text-zinc-300">{zone.value}%</span>
                </div>
                <div className="mt-3 h-24 rounded-2xl border border-white/6 bg-white/[0.03] p-3">
                  <div className="flex h-full items-end">
                    <div
                      className="w-full rounded-xl bg-gradient-to-t from-lime-400 to-orange-400"
                      style={{ height: `${zone.value}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="space-y-4">
        <Panel title="Coach load" subtitle="Trainer utilization across the day">
          <div className="space-y-3">
            {trainers.map((trainer) => (
              <div key={trainer.name} className="rounded-2xl border border-white/8 bg-black/20 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white/90">{trainer.name}</p>
                    <p className="mt-1 text-xs text-zinc-400">{trainer.specialty}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/90">{trainer.utilization}%</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-zinc-500">{trainer.clientsToday} clients</p>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <ProgressBar value={trainer.utilization} color={trainer.utilization >= 85 ? "bg-orange-400" : "bg-lime-400"} />
                  <div className="flex items-center justify-between gap-3 text-xs text-zinc-400">
                    <span>Service score</span>
                    <span>{trainer.score}/5</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Operational notes" subtitle="What the floor team should watch">
          <div className="space-y-3 text-xs text-zinc-300">
            <div className="rounded-2xl border border-white/8 bg-black/20 p-3">Functional turf is running hottest. Keep sled lane clear after 17:00.</div>
            <div className="rounded-2xl border border-white/8 bg-black/20 p-3">Sauna is in service mode. Route recovery members to mobility reset slots.</div>
            <div className="rounded-2xl border border-white/8 bg-black/20 p-3">Fight Conditioning has waitlist demand. Consider adding one overflow circuit.</div>
          </div>
        </Panel>
      </div>
    </div>
  );

  const financeView = (
    <div className="grid gap-4 xl:grid-cols-[1.45fr_minmax(320px,1fr)]">
      <div className="space-y-4">
        <Panel title="Revenue velocity" subtitle="Income trend for the selected range">
          <div className="rounded-[22px] border border-white/8 bg-black/20 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Current collected</p>
                <p className="mt-2 text-base font-semibold text-white">{formatCurrency(revenueNow)}</p>
              </div>
              <div className="flex gap-2">
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Collection</p>
                  <p className="mt-1 text-sm text-white/90">96.4%</p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Pending</p>
                  <p className="mt-1 text-sm text-white/90">{formatCurrency(pendingRevenue)}</p>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <Sparkline data={revenueByRange[range].data} />
            </div>
            <div className="grid grid-cols-6 gap-2 text-center">
              {revenueByRange[range].labels.map((label) => (
                <div key={label} className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                  {label}
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel title="Collections board" subtitle="Upcoming invoices and payment state">
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div key={`${invoice.member}-${invoice.due}-${invoice.amount}`} className="rounded-[22px] border border-white/8 bg-black/20 p-3">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-white/90">{invoice.member}</p>
                      <span className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] ${invoiceStyles[invoice.status]}`}>
                        {invoice.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-400">{invoice.method}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Due</p>
                      <p className="mt-1 text-sm text-white/90">{invoice.due}</p>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Amount</p>
                      <p className="mt-1 text-sm text-white/90">{formatCurrency(invoice.amount)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="space-y-4">
        <Panel title="Expense split" subtitle="Operating cost structure">
          <div className="space-y-3">
            {expenseMix.map((expense) => (
              <div key={expense.label} className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-xs text-zinc-300">
                  <span>{expense.label}</span>
                  <span>{expense.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/8">
                  <div className="h-2 rounded-full" style={{ width: `${expense.value}%`, backgroundColor: expense.color }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Plan mix" subtitle="Revenue posture across packages">
          <div className="space-y-4">
            <DonutChart segments={planMix} centerTop="run rate" centerBottom={formatCurrency(18420)} />
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/8 bg-black/20 p-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">ARPU</p>
                <p className="mt-2 text-sm text-white/90">{formatCurrency(124)}</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/20 p-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Retention</p>
                <p className="mt-2 text-sm text-white/90">93.1%</p>
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Finance notes" subtitle="Immediate commercial actions">
          <div className="space-y-3 text-xs text-zinc-300">
            <div className="rounded-2xl border border-white/8 bg-black/20 p-3">Push trial conversions before the 4th visit to lift starter plan upgrades.</div>
            <div className="rounded-2xl border border-white/8 bg-black/20 p-3">Re-activate frozen members with recovery bundle offers and low-volume plans.</div>
            <div className="rounded-2xl border border-white/8 bg-black/20 p-3">Evening conditioning demand justifies one premium small-group upsell block.</div>
          </div>
        </Panel>
      </div>
    </div>
  );

  return (
    <AppShell>
      <div className="grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <Panel title="Brand" subtitle="ForgeFit Control">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-lime-400 to-orange-400 text-[#07110b] shadow-[0_12px_30px_rgba(132,204,22,0.25)]">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 10h3l2-3 3 10 2-5h8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white/90">Modern gym operations</p>
                <p className="mt-2 text-xs text-zinc-400">
                  One focused workspace for members, classes, coaches and collections.
                </p>
              </div>
            </div>
          </Panel>

          <Panel title="Navigation" subtitle="System modules">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <NavButton
                  key={tab.key}
                  active={activeTab === tab.key}
                  label={tab.label}
                  note={tab.note}
                  onClick={() => setActiveTab(tab.key)}
                />
              ))}
            </div>
          </Panel>

          <Panel title="Quick actions" subtitle="Fast operational shortcuts">
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleAction("New consultation lane created. Review the members tab for trial momentum.", "members")}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-left text-xs text-zinc-200 transition hover:border-lime-400/25 hover:bg-lime-400/8"
              >
                Add lead follow-up
              </button>
              <button
                type="button"
                onClick={() => handleAction("Evening classes are heating up. The schedule tab highlights classes nearest capacity.", "schedule")}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-left text-xs text-zinc-200 transition hover:border-orange-400/25 hover:bg-orange-400/8"
              >
                Review tonight's classes
              </button>
              <button
                type="button"
                onClick={() => handleAction("Collections queue prioritized. The finance tab shows all pending invoices and risk balances.", "finance")}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-left text-xs text-zinc-200 transition hover:border-amber-400/25 hover:bg-amber-400/8"
              >
                Chase pending payments
              </button>
            </div>
          </Panel>
        </aside>

        <main className="space-y-4">
          <Panel
            title="Control room"
            subtitle="Gym Management System MVP"
            right={
              <div className="flex flex-wrap gap-2">
                {rangeOptions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setRange(item)}
                    className={`rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] transition ${
                      range === item
                        ? "border-lime-400/25 bg-lime-400/10 text-lime-200"
                        : "border-white/10 bg-white/[0.03] text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            }
          >
            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-lime-400/20 bg-lime-400/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-lime-200">
                  Live mode · Open until 23:00
                </div>
                <p className="max-w-2xl text-base font-semibold text-white">
                  Built for gym owners who want one clean command center for occupancy, member retention and revenue.
                </p>
                <p className="text-sm text-zinc-300">{actionMessage}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[22px] border border-white/8 bg-black/20 p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Check-ins</p>
                  <p className="mt-2 text-sm text-white/90">{checkInsToday}</p>
                </div>
                <div className="rounded-[22px] border border-white/8 bg-black/20 p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Trials</p>
                  <p className="mt-2 text-sm text-white/90">{trials}</p>
                </div>
                <div className="rounded-[22px] border border-white/8 bg-black/20 p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Pending dues</p>
                  <p className="mt-2 text-sm text-white/90">{formatCurrency(pendingRevenue)}</p>
                </div>
              </div>
            </div>
          </Panel>

          {activeTab === "overview" ? overviewView : null}
          {activeTab === "members" ? membersView : null}
          {activeTab === "schedule" ? scheduleView : null}
          {activeTab === "finance" ? financeView : null}
        </main>
      </div>
    </AppShell>
  );
}

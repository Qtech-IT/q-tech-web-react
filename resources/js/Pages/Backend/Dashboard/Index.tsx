
import { Avatar, AvatarFallback } from '@/Components/UI/Avatar'
import { Badge } from '@/Components/UI/Badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/UI/Card'
import { Separator } from '@/Components/UI/Separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/UI/Tabs'
import { useTranslations } from '@/Hooks/useTranslations'
import { AuthenticatedLayout } from '@/Layouts/User/AuthenticatedLayout'
import BaseLayout from '@/Layouts/User/BaseLayout'
import { MainContainer } from '@/Layouts/User/MainContainer'

import { Head } from '@inertiajs/react'
import {
  Activity,
  ArrowDownToLine,
  ArrowUpFromLine,
  BadgeDollarSign, BarChart3,
  Clock,
  DollarSign,
  Flame,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Users
} from 'lucide-react'
import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis, YAxis
} from 'recharts'

// ─── helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number | string, dec = 2) =>
  Number(n ?? 0).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })

const fmtCompact = (n: number, currency_symbol = '$') => {
  n = Number(n ?? 0)
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `${currency_symbol}${(n / 1_000).toFixed(2)}K`
  return `$${n.toFixed(2)}`
}

const PIE_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe']

// ─── sub-components ───────────────────────────────────────────────────────────

function KpiCard({ icon: Icon, label, value, sub, trend, trendUp, accent = 'indigo' }: any) {
  const accentMap: any = {
    indigo: 'text-indigo-500 bg-indigo-500/10',
    violet: 'text-violet-500 bg-violet-500/10',
    emerald: 'text-emerald-500 bg-emerald-500/10',
    amber: 'text-amber-500  bg-amber-500/10',
    rose: 'text-rose-500   bg-rose-500/10',
    sky: 'text-sky-500    bg-sky-500/10',
  }
  const cls = accentMap[accent] ?? accentMap.indigo
  return (
    <Card className="border border-border/60 bg-card/60 backdrop-blur-sm hover:shadow-lg hover:shadow-black/5 transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{label}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
          </div>
          <div className={`rounded-xl p-2.5 ${cls}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {trend !== undefined && (
          <div className="mt-3 flex items-center gap-1.5">
            {trendUp
              ? <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              : <TrendingDown className="h-3.5 w-3.5 text-rose-500" />}
            <span className={`text-xs font-medium ${trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
              {trend}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function SectionTitle({ icon: Icon, title, description }: any) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="rounded-lg bg-primary/10 p-2">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
    </div>
  )
}

// Custom tooltip
const ChartTooltip = ({ active, payload, label, prefix = '$' }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-border bg-popover/95 backdrop-blur px-3 py-2 shadow-xl text-xs">
      <p className="font-semibold mb-1 text-foreground">{label}</p>
      {payload.map((p: any, i: any) => (
        <div key={i} className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground capitalize">{p.name}:</span>
          <span className="font-medium text-foreground">
            {prefix}{typeof p.value === 'number' ? fmt(p.value) : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map = {
    pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    approved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    declined: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    open: 'bg-sky-500/10 text-sky-500 border-sky-500/20',
    closed: 'bg-muted text-muted-foreground border-border',
    cancelled: 'bg-muted text-muted-foreground border-border',
    win: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    lose: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    inactive: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  } as any;
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${map[status] ?? 'bg-muted text-muted-foreground'}`}>
      {status}
    </span>
  )
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function Dashboard({ stats = {}, charts = {}, recent = {}, top_cryptos = [], currency_symbol }: any) {
  const winRate = stats.win_rate ?? 0

  const pieData = useMemo(() =>
    (charts.by_crypto ?? []).map((c: any) => ({ name: c.symbol, value: c.total }))
    , [charts.by_crypto])


  const { t } = useTranslations();

  const coloredPieData = pieData.map((item: any, i: number) => ({
    ...item,
    fill: PIE_COLORS[i % PIE_COLORS.length] || PIE_COLORS[0],
  }));

  return (
    <BaseLayout>
      <AuthenticatedLayout>
        <Head title="Dashboard" />
        <MainContainer>

          {/* ── Page header ───────────────────────────────────────────────── */}
          <div className="mb-8 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500" />
              <h1 className="text-2xl font-bold tracking-tight">
                {t('Platform Overview')}
              </h1>
            </div>
            <p className="pl-3 text-sm text-muted-foreground">
              {t('Real-time reporting across users, trades, deposits & withdrawals.')}
            </p>
          </div>

          {/* ── KPI grid ──────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <KpiCard
              icon={Users} accent="indigo" label="Total Users"
              value={fmt(stats.total_users, 0)}
              sub={`${stats.active_users} active`}
              trend={`+${stats.new_users_month} this month`}
              trendUp
            />
            <KpiCard
              icon={BadgeDollarSign} accent="emerald" label="Total Deposits"
              value={fmtCompact(stats.total_deposits_usd, currency_symbol)}
              sub={`${fmtCompact(stats.deposits_this_month, currency_symbol)} this month`}
              trend={`${stats.pending_deposits_count} pending`}
              trendUp={stats.pending_deposits_count === 0}
            />
            <KpiCard
              icon={BarChart3} accent="violet" label="Total Trades"
              value={fmt(stats.total_trades, 0)}
              sub={`${stats.open_trades} open now`}
              trend={`Win rate ${winRate}%`}
              trendUp={winRate >= 50}
            />
            <KpiCard
              icon={DollarSign} accent={stats.total_pnl >= 0 ? 'emerald' : 'rose'} label="Net P&L (USD)"
              value={`${(stats.total_pnl)}`}
              sub={`${stats.trades_won}W / ${stats.trades_lost}L`}
              trend={`${winRate}% win rate`}
              trendUp={stats.total_pnl >= 0}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
            <KpiCard
              icon={Clock} accent="amber" label="Pending Deposits"
              value={stats.pending_deposits_count}
              sub={`${fmtCompact(stats.pending_deposits_amount, currency_symbol)} queued`}
            />
            <KpiCard
              icon={ArrowUpFromLine} accent="sky" label="Pending Withdrawals"
              value={stats.pending_withdraws_count}
              sub={`${fmt(stats.pending_withdraws_amount, 4)} crypto`}
            />
            <KpiCard
              icon={Activity} accent="indigo" label="Open Trades"
              value={stats.open_trades}
              sub="Live positions"
            />
            <KpiCard
              icon={Users} accent="violet" label="New Today"
              value={stats.new_users_today}
              sub="Registrations"
            />
          </div>

          {/* ── Charts row ────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">

            {/* Revenue area chart */}
            <Card className="lg:col-span-2 border border-border/60 bg-card/60 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">
                  {t('Deposit Revenue')}
                </CardTitle>
                <CardDescription className="text-xs">{t('Last 30 days')} ({currency_symbol})</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={charts.revenue ?? []} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                      tickLine={false} axisLine={false} interval={6} />
                    <YAxis tickFormatter={v => `$${v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v}`}
                      tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                      tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="total" name="Revenue"
                      stroke="#6366f1" strokeWidth={2} fill="url(#revGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Deposit by crypto pie */}
            <Card className="border border-border/60 bg-card/60 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">
                  {t('Deposits by Crypto')}
                </CardTitle>
                <CardDescription className="text-xs">{t('Approved deposits breakdown')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={160}>

                  <PieChart>
                    <Pie
                      data={coloredPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={72}
                      paddingAngle={3}
                      dataKey="value"
                      fill="#8884d8"
                    />

                    <Tooltip formatter={(v) => [`$${fmt(v as any)}`, '']} />
                  </PieChart>




                </ResponsiveContainer>
                <div className="mt-2 space-y-1">
                  {(charts.by_crypto ?? []).slice(0, 4).map((c: any, i: any) => (
                    <div key={c.symbol} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[i] }} />
                        <span className="font-medium">{c.symbol}</span>
                      </div>
                      <span className="text-muted-foreground">{fmtCompact(c.total, currency_symbol)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trade chart */}
          <Card className="mb-6 border border-border/60 bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                {t('Trade Activity')}
              </CardTitle>
              <CardDescription className="text-xs">{t('Wins vs Losses — last 14 days')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={charts.trades ?? []} margin={{ top: 5, right: 5, bottom: 0, left: 0 }} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltip prefix="" />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="wins" name="Wins" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="losses" name="Losses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* ── Win-rate progress ring + top cryptos ─────────────────────── */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">

            {/* Win rate */}
            <Card className="flex flex-col items-center justify-center py-8 border border-border/60 bg-card/60 backdrop-blur-sm">
              <CardHeader className="pb-2 text-center">
                <CardTitle className="text-sm font-semibold">
                  {t('Platform Win Rate')}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <div className="relative h-36 w-36">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none"
                      stroke="hsl(var(--border))" strokeWidth="10" />
                    <circle cx="50" cy="50" r="40" fill="none"
                      stroke="url(#winGrad)" strokeWidth="10"
                      strokeDasharray={`${winRate * 2.513} 251.3`}
                      strokeLinecap="round" />
                    <defs>
                      <linearGradient id="winGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{winRate}%</span>
                    <span className="text-xs text-muted-foreground">
                      {t('Win Rate')}
                    </span>
                  </div>
                </div>
                <div className="flex gap-6 text-xs">
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-emerald-500">{fmt(stats.trades_won, 0)}</span>
                    <span className="text-muted-foreground">
                      {t('Wins')}
                    </span>
                  </div>
                  <Separator orientation="vertical" className="h-8" />
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-rose-500">{fmt(stats.trades_lost, 0)}</span>
                    <span className="text-muted-foreground">
                      {t('Losses')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top cryptos */}
            <Card className="lg:col-span-2 border border-border/60 bg-card/60 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <SectionTitle icon={Flame} title="Top Cryptos by Trade Volume" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {top_cryptos.map((c: any, i: number) => (
                    <div key={c.symbol}
                      className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2.5 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-muted-foreground w-4">#{i + 1}</span>
                        <div>
                          <p className="text-sm font-semibold">{c.symbol}</p>
                          <p className="text-xs text-muted-foreground">{c.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <p className="text-xs font-medium">{c.trade_count} {t('trades')}</p>
                          <p className="text-xs text-muted-foreground">{fmtCompact(c.total_volume, currency_symbol)} {t('vol')}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {(c.change_24h ?? 0) >= 0
                            ? <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                            : <TrendingDown className="h-3.5 w-3.5 text-rose-500" />}
                          <span className={`text-xs font-medium ${(c.change_24h ?? 0) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {fmt(Math.abs(c.change_24h ?? 0))}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {top_cryptos.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      {t('No data available')}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Recent activity tabs ──────────────────────────────────────── */}
          <Card className="border border-border/60 bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-0">
              <CardTitle className="text-sm font-semibold">
                {t('Recent Activity')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Tabs defaultValue="trades">
                <TabsList className="mb-4 h-9">
                  <TabsTrigger value="trades" className="text-xs gap-1.5"><Activity className="h-3.5 w-3.5" />
                    {t('Trades')}</TabsTrigger>
                  <TabsTrigger value="deposits" className="text-xs gap-1.5"><ArrowDownToLine className="h-3.5 w-3.5" /> {t('Deposits')}</TabsTrigger>
                  <TabsTrigger value="withdraws" className="text-xs gap-1.5"><ArrowUpFromLine className="h-3.5 w-3.5" /> {t('Withdrawals')}</TabsTrigger>
                  <TabsTrigger value="users" className="text-xs gap-1.5"><Users className="h-3.5 w-3.5" /> {t('Users')}</TabsTrigger>
                </TabsList>

                {/* Trades */}
                <TabsContent value="trades">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border/50">
                          {['#', 'User', 'Crypto', 'Dir', 'Stake', 'P&L', 'Result', 'When'].map(h => (
                            <th key={h} className="pb-2 text-left font-medium text-muted-foreground pr-4 whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(recent.trades ?? []).map((t: any) => (
                          <tr key={t.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                            <td className="py-2.5 pr-4 text-muted-foreground">{t.id}</td>
                            <td className="py-2.5 pr-4 font-medium">{t.user}</td>
                            <td className="py-2.5 pr-4">
                              <Badge variant="outline" className="text-[11px]">{t.crypto}</Badge>
                            </td>
                            <td className="py-2.5 pr-4">
                              <span className={`font-semibold uppercase text-[11px] ${t.direction === 'long' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {t.direction}
                              </span>
                            </td>
                            <td className="py-2.5 pr-4">${fmt(t.usd_stake)}</td>
                            <td className={`py-2.5 pr-4 font-medium ${(t.pnl ?? 0) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                              {(t.pnl ?? 0) >= 0 ? '+' : ''}{fmtCompact(t.pnl ?? 0, currency_symbol)}
                            </td>
                            <td className="py-2.5 pr-4"><StatusBadge status={t.result} /></td>
                            <td className="py-2.5 text-muted-foreground whitespace-nowrap">{t.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {(recent.trades ?? []).length === 0 && (
                      <p className="py-6 text-center text-xs text-muted-foreground">
                        {t('No data available')}
                      </p>
                    )}
                  </div>
                </TabsContent>

                {/* Deposits */}
                <TabsContent value="deposits">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border/50">
                          {['#', 'User', 'Crypto', 'Amount', 'USD', 'Status', 'When'].map(h => (
                            <th key={h} className="pb-2 text-left font-medium text-muted-foreground pr-4 whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(recent.deposits ?? []).map((d: any) => (
                          <tr key={d.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                            <td className="py-2.5 pr-4 text-muted-foreground">{d.id}</td>
                            <td className="py-2.5 pr-4">
                              <div>
                                <p className="font-medium">{d.user}</p>
                                <p className="text-muted-foreground">{d.email}</p>
                              </div>
                            </td>
                            <td className="py-2.5 pr-4"><Badge variant="outline" className="text-[11px]">{d.crypto}</Badge></td>
                            <td className="py-2.5 pr-4">{fmt(d.amount, 4)}</td>
                            <td className="py-2.5 pr-4 font-medium">${fmt(d.usd)}</td>
                            <td className="py-2.5 pr-4"><StatusBadge status={d.status} /></td>
                            <td className="py-2.5 text-muted-foreground whitespace-nowrap">{d.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {(recent.deposits ?? []).length === 0 && (
                      <p className="py-6 text-center text-xs text-muted-foreground">
                        {t('No deposits yet')}
                      </p>
                    )}
                  </div>
                </TabsContent>

                {/* Withdrawals */}
                <TabsContent value="withdraws">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border/50">
                          {['#', 'User', 'Amount', 'Status', 'When'].map(h => (
                            <th key={h} className="pb-2 text-left font-medium text-muted-foreground pr-4 whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(recent.withdraws ?? []).map((w: any) => (
                          <tr key={w.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                            <td className="py-2.5 pr-4 text-muted-foreground">{w.id}</td>
                            <td className="py-2.5 pr-4">
                              <div>
                                <p className="font-medium">{w.user}</p>
                                <p className="text-muted-foreground">{w.email}</p>
                              </div>
                            </td>
                            <td className="py-2.5 pr-4 font-medium">{fmt(w.amount, 4)}</td>
                            <td className="py-2.5 pr-4"><StatusBadge status={w.status} /></td>
                            <td className="py-2.5 text-muted-foreground whitespace-nowrap">{w.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {(recent.withdraws ?? []).length === 0 && (
                      <p className="py-6 text-center text-xs text-muted-foreground">
                        {t('No withdrawals yet')}
                      </p>
                    )}
                  </div>
                </TabsContent>

                {/* Users */}
                <TabsContent value="users">
                  <div className="space-y-2">
                    {(recent.users ?? []).map((u: any) => (
                      <div key={u.id}
                        className="flex items-center justify-between rounded-lg bg-muted/20 px-3 py-2.5 hover:bg-muted/40 transition-colors">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-indigo-500/10 text-indigo-500">
                              {u.name?.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xs font-medium">{u.name}</p>
                            <p className="text-[11px] text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {u.kyc && (
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                          )}
                          <StatusBadge status={u.status} />
                          <span className="text-[11px] text-muted-foreground">{u.date}</span>
                        </div>
                      </div>
                    ))}
                    {(recent.users ?? []).length === 0 && (
                      <p className="py-6 text-center text-xs text-muted-foreground">
                        {t('No new users yet')}
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

        </MainContainer>
      </AuthenticatedLayout>
    </BaseLayout>
  )
}
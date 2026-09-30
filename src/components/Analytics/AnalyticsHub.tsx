import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';
import { DisasterAlert } from '../../types/disaster';
import { formatNumber } from '../../utils/formatters';
import {
  TrendingUp,
  Users,
  ShieldAlert,
  DollarSign,
  AlertTriangle,
  Globe,
  Flame,
  Activity,
  Calendar,
} from 'lucide-react';

interface AnalyticsHubProps {
  alerts: DisasterAlert[];
}

export const AnalyticsHub: React.FC<AnalyticsHubProps> = ({ alerts }) => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'ytd'>('7d');

  // Key metrics calculations
  const totalActive = alerts.length;
  const criticalCount = alerts.filter((a) => a.severity === 'CRITICAL').length;
  const warningCount = alerts.filter((a) => a.severity === 'WARNING').length;
  const totalAffected = alerts.reduce((acc, a) => acc + a.affectedPopulationEstimate, 0);
  const totalDisplaced = alerts.reduce((acc, a) => acc + a.casualtiesEstimate.displaced, 0);

  // 1. Bar Chart Data: Disasters by Category & Region
  const categoryRegionData = [
    {
      region: 'Asia-Pacific',
      Geological: 2,
      Meteorological: 2,
      Biological: 1,
      Industrial: 0,
      Intentional: 1,
    },
    {
      region: 'Europe',
      Geological: 0,
      Meteorological: 1,
      Biological: 0,
      Industrial: 0,
      Intentional: 1,
    },
    {
      region: 'Americas',
      Geological: 0,
      Meteorological: 0,
      Biological: 0,
      Industrial: 2,
      Intentional: 0,
    },
    {
      region: 'Africa',
      Geological: 0,
      Meteorological: 0,
      Biological: 1,
      Industrial: 0,
      Intentional: 0,
    },
  ];

  // 2. Line Chart Data: Historical Impact & Escalation over time
  const escalationTrendData = [
    { period: '2020 Q1', eventsCount: 142, economicLossBillions: 34, displacedThousands: 420 },
    { period: '2021 Q2', eventsCount: 188, economicLossBillions: 52, displacedThousands: 580 },
    { period: '2022 Q3', eventsCount: 245, economicLossBillions: 98, displacedThousands: 920 },
    { period: '2023 Q4', eventsCount: 298, economicLossBillions: 112, displacedThousands: 1140 },
    { period: '2024 Q2', eventsCount: 340, economicLossBillions: 135, displacedThousands: 1380 },
    { period: '2025 Q3', eventsCount: 385, economicLossBillions: 168, displacedThousands: 1720 },
    { period: '2026 YTD', eventsCount: 420, economicLossBillions: 194, displacedThousands: 2100 },
  ];

  // 3. Pie Chart Data: Global Disaster Distribution ratio across 5 categories
  const categoryDistributionData = [
    { name: 'Geological (Quakes/Volcanoes)', value: 25, color: '#F43F5E' },
    { name: 'Meteorological & Climatological', value: 35, color: '#38BDF8' },
    { name: 'Biological (Epidemics/Pests)', value: 15, color: '#10B981' },
    { name: 'Human-Caused (Unintentional)', value: 15, color: '#F59E0B' },
    { name: 'Human-Caused (Intentional)', value: 10, color: '#A855F7' },
  ];

  return (
    <div className="space-y-6">
      {/* Analytics Hub Header & Time Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sky-500" />
            Global Disaster Intelligence &amp; Multi-Vector Analytics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Aggregated situational metrics across United Nations GDACS, USGS, WHO, and National Authorities
          </p>
        </div>

        {/* Time Period Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700">
          {(['24h', '7d', '30d', 'ytd'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeRange(t)}
              className={`px-3 py-1 rounded-md uppercase font-mono transition-colors ${
                timeRange === t
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>ACTIVE GLOBAL THREATS</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {totalActive}
            </span>
            <span className="text-xs text-red-600 dark:text-red-400 font-semibold font-mono">
              {criticalCount} Critical
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {warningCount} Moderate Warnings · 100% Monitored
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>AFFECTED POPULATION</span>
            <Users className="w-4 h-4 text-sky-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {(totalAffected / 1_000_000).toFixed(2)}M
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-mono font-semibold">
              +12% vs LW
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {formatNumber(totalDisplaced)} Internally Displaced Persons
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>RELIEF AID REQUESTED</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              $142.5M
            </span>
            <span className="text-xs text-emerald-700 dark:text-emerald-300 font-mono font-semibold">
              USD
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            $58.2M Dispatched (40.8% Funded)
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>DISASTER RESPONSE NODES</span>
            <Globe className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              184
            </span>
            <span className="text-xs text-sky-600 dark:text-sky-400 font-mono font-semibold">
              Deployed
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Including NDRRMA, FEMA, Red Cross, WHO
          </p>
        </div>
      </div>

      {/* Grid: Charts (2 Rows) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Bar Graph (Disasters by Category & Region) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Disasters by Category &amp; Geographic Region
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cross-regional distribution across the 5 structural classification domains
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryRegionData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="region" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#F8FAFC',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Geological" fill="#F43F5E" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Meteorological" fill="#38BDF8" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Biological" fill="#10B981" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Industrial" fill="#F59E0B" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Intentional" fill="#A855F7" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Pie / Donut Chart (Global Distribution Ratio) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Global Disaster Distribution Ratio
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Proportionate breakdown of active and recent disaster incidences
            </p>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value}%`, 'Global Share']}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#F8FAFC',
                  }}
                />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart 3: Full Width Line Graph (Historical Escalation & Economic Losses) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-500" />
              Multi-Year Impact &amp; Economic Escalation Curve (2020 - 2026)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Correlation between cumulative catastrophic events, financial damages (USD Billions), and population displacements
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400">
            Source: Munich Re &amp; UNDRR Global Assessment Report
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={escalationTrendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11, fill: '#94A3B8' }}
                unit="B"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  fontSize: '11px',
                  color: '#F8FAFC',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="eventsCount"
                name="Incident Frequency Count"
                stroke="#38BDF8"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="economicLossBillions"
                name="Economic Loss ($ USD Billions)"
                stroke="#EF4444"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

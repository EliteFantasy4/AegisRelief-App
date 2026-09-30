import { SeverityLevel, DisasterCategory } from '../types/disaster';

export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(0) + 'k';
  }
  return num.toLocaleString();
}

export function formatTimeAgo(isoString: string): string {
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  } catch {
    return 'Recently';
  }
}

export function getSeverityStyle(severity: SeverityLevel): {
  bg: string;
  text: string;
  border: string;
  badgeBg: string;
  ringColor: string;
} {
  switch (severity) {
    case 'CRITICAL':
      return {
        bg: 'bg-red-500/10 dark:bg-red-950/40',
        text: 'text-red-700 dark:text-red-400 font-semibold',
        border: 'border-red-500/40',
        badgeBg: 'bg-red-600 text-white',
        ringColor: '#EF4444',
      };
    case 'WARNING':
      return {
        bg: 'bg-amber-500/10 dark:bg-amber-950/40',
        text: 'text-amber-800 dark:text-amber-300 font-semibold',
        border: 'border-amber-500/40',
        badgeBg: 'bg-amber-500 text-slate-900 font-bold',
        ringColor: '#F59E0B',
      };
    case 'ADVISORY':
    default:
      return {
        bg: 'bg-sky-500/10 dark:bg-sky-950/40',
        text: 'text-sky-700 dark:text-sky-300 font-medium',
        border: 'border-sky-500/40',
        badgeBg: 'bg-sky-600 text-white',
        ringColor: '#0284C7',
      };
  }
}

export function getCategoryBadge(category: DisasterCategory): {
  name: string;
  colorClass: string;
} {
  switch (category) {
    case 'geological':
      return { name: 'Geological', colorClass: 'text-rose-600 dark:text-rose-400' };
    case 'meteorological':
      return { name: 'Meteorological', colorClass: 'text-sky-600 dark:text-sky-400' };
    case 'biological':
      return { name: 'Biological', colorClass: 'text-emerald-600 dark:text-emerald-400' };
    case 'human_unintentional':
      return { name: 'Industrial / Accident', colorClass: 'text-amber-600 dark:text-amber-400' };
    case 'human_intentional':
      return { name: 'Conflict / Cyber', colorClass: 'text-purple-600 dark:text-purple-400' };
    default:
      return { name: 'General', colorClass: 'text-slate-600 dark:text-slate-400' };
  }
}

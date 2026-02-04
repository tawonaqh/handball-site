import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date, options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  return new Date(date).toLocaleDateString('en-US', defaultOptions);
}

export function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

export function formatDateTime(date) {
  const now = new Date();
  const targetDate = new Date(date);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const targetDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

  if (targetDay.getTime() === today.getTime()) {
    return `Today, ${formatTime(date)}`;
  } else if (targetDay.getTime() === tomorrow.getTime()) {
    return `Tomorrow, ${formatTime(date)}`;
  } else {
    return `${formatDate(date, { weekday: 'short' })}, ${formatTime(date)}`;
  }
}

export function getGameStatus(game) {
  const matchDate = new Date(game.match_date);
  const now = new Date();
  const isUpcoming = matchDate > now;
  const isLive = game.status === 'live';
  const isCompleted = game.status === 'completed' || (game.home_score !== null && game.away_score !== null);

  if (isLive) {
    return { text: 'LIVE', variant: 'live', pulse: true };
  }
  if (isCompleted) {
    return { text: 'COMPLETED', variant: 'completed' };
  }
  if (isUpcoming) {
    return { text: 'UPCOMING', variant: 'upcoming' };
  }
  
  const statusMap = {
    postponed: { text: 'POSTPONED', variant: 'postponed' },
    cancelled: { text: 'CANCELLED', variant: 'cancelled' },
  };
  
  return statusMap[game.status] || { text: 'SCHEDULED', variant: 'scheduled' };
}

export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export function getInitials(name) {
  if (!name) return 'UN';
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function generateGradient(seed) {
  const gradients = [
    'from-orange-400 to-red-500',
    'from-blue-400 to-purple-500',
    'from-green-400 to-blue-500',
    'from-yellow-400 to-orange-500',
    'from-purple-400 to-pink-500',
    'from-indigo-400 to-blue-500',
    'from-teal-400 to-green-500',
    'from-red-400 to-pink-500',
  ];
  
  const index = Math.abs(seed.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % gradients.length;
  return gradients[index];
}
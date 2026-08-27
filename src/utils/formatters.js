export function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatDateTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function formatScore(score) {
  if (score === undefined || score === null) return '0';
  return Number.isInteger(score) ? score.toString() : score.toFixed(1);
}

export function getScoreColor(score, maxScore = 20) {
  const percent = (score / maxScore) * 100;
  if (percent >= 50) return 'text-emerald-600';
  return 'text-red-500';
}

export function getScoreBgColor(score, maxScore = 20) {
  const percent = (score / maxScore) * 100;
  if (percent >= 50) return 'bg-emerald-500';
  return 'bg-red-500';
}

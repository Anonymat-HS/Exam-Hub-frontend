export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR');
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('fr-FR');
}

export function toCurrency(cents: number): string {
  if (cents > 9999) {
    return `INR ${(cents / 100).toFixed(2)}`;
  }

  return `USD ${(cents / 100).toFixed(2)}`;
}

export function statusColor(status: string): string {
  if (status === 'CHECKED_OUT') {
    return 'bg-brand text-white';
  }

  if (status === 'CANCELED') {
    return 'bg-danger text-white';
  }

  return 'bg-surface-strong text-brand-ink';
}

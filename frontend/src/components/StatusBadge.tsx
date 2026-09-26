type Props = { value: string }

export function StatusBadge({ value }: Props) {
  const key = value.toLowerCase().replaceAll('_', '-')
  return <span className={`status-badge status-${key}`}>{value.replaceAll('_', ' ')}</span>
}

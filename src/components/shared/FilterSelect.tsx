import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export interface FilterOption<T extends string> {
  value: T
  label: string
}

interface FilterSelectProps<T extends string> {
  label: string
  value: T
  options: FilterOption<T>[]
  onChange: (value: T) => void
}

/** Select de filtre : label gris + valeur semibold + chevron (h-9, bordure, rounded-lg). */
export function FilterSelect<T extends string>({ label, value, options, onChange }: FilterSelectProps<T>) {
  return (
    <Select
      value={value}
      items={options}
      onValueChange={(next) => {
        if (typeof next === 'string') onChange(next as T)
      }}
    >
      <SelectTrigger aria-label={label} className="h-9 gap-1.5 rounded-lg border-line bg-surface px-3 text-sm">
        <span className="text-ink-sub">{label}:</span>
        <SelectValue className="font-semibold text-ink" />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} align="start" className="min-w-44">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

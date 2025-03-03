'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { DebouncedInput } from '@/registry/data-table-filter/components/debounced-input'
import { flatten, take, uniq } from '@/registry/data-table-filter/lib/array'
import type { ColumnOption } from '@/registry/data-table-filter/lib/filters'
import {
  type FilterValue,
  determineNewOperator,
  numberFilterDetails,
} from '@/registry/data-table-filter/lib/filters'
import type { Row, RowModel, Table } from '@tanstack/react-table'
import { format, isEqual } from 'date-fns'
import { Ellipsis } from 'lucide-react'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'

export function PropertyFilterValueController<TData, TValue>({
  id,
  table,
}: {
  id: string
  table: Table<TData>
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="m-0 h-full w-full whitespace-nowrap rounded-none p-0 px-2 text-xs"
        >
          <PropertyFilterValueDisplay id={id} table={table} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-fit p-0">
        <PropertyFilterValueMenu id={id} table={table} />
      </PopoverContent>
    </Popover>
  )
}

export function PropertyFilterValueDisplay<TData, TValue>({
  id,
  table,
}: {
  id: string
  table: Table<TData>
}) {
  const column = table.getColumn(id)
  if (!column) return null
  const meta = column.columnDef.meta
  if (!meta) return null

  switch (meta.type) {
    case 'option':
      return <PropertyFilterOptionValueDisplay id={id} table={table} />
    case 'multiOption':
      return <PropertyFilterMultiOptionValueDisplay id={id} table={table} />
    case 'date':
      return <PropertyFilterDateValueDisplay id={id} table={table} />
    case 'text':
      return <PropertyFilterTextValueDisplay id={id} table={table} />
    case 'number':
      return <PropertyFilterNumberValueDisplay id={id} table={table} />
    default:
      return null
  }
}

export function PropertyFilterOptionValueDisplay<TData>({
  id,
  table,
}: {
  id: string
  table: Table<TData>
}) {
  const column = table.getColumn(id)

  if (!column) return null

  const meta = column.columnDef.meta

  if (!meta) return null

  const providedOptions = meta.options

  let options: ColumnOption[]

  if (providedOptions) {
    // If provided options are available for the column, use them
    options = providedOptions
  } else if (meta.transformFn) {
    // No provided options, we should dynamically generate them based on the column data
    // If a transform function is provided, we use it to transform the column data into
    // an acceptable format
    const columnVals = table.getCoreRowModel().rows.map((r) => r.getValue(id))
    const transformed = columnVals.map(meta.transformFn) as string[]
    const unique = uniq(transformed)
    options = unique.map((value) => {
      const option: ColumnOption = {
        value: value,
        label: value,
        icon: undefined,
      }
      return option
    })
  } else {
    // No provided options or transform function
    // We should generate options based on the raw column data
    const columnVals = table
      .getCoreRowModel()
      .rows.map((r) => r.getValue<string>(id))
    const unique = uniq(columnVals)
    options = unique.map((value) => {
      const option: ColumnOption = {
        value: value,
        label: value,
        icon: undefined,
      }
      return option
    })
  }

  const filter = column.getFilterValue() as FilterValue<'option'>
  const selected = options.filter((o) => filter?.values.includes(o.value))

  // We display the selected options based on how many are selected
  //
  // If there is only one option selected, we display its icon and label
  //
  // If there are multiple options selected, we display:
  // 1) up to 3 icons of the selected options
  // 2) the number of selected options
  if (selected.length === 1) {
    const { label, icon: Icon } = selected[0]
    const hasIcon = !!Icon
    return (
      <span className="inline-flex items-center gap-1">
        {hasIcon && <Icon strokeWidth={2.25} className="size-4" />}
        <span className="text-slate-700">{label}</span>
      </span>
    )
  }
  const name = meta.displayName.toLowerCase()
  const pluralName = name.endsWith('s') ? `${name}es` : `${name}s`

  const hasOptionIcons = !!meta.options

  return (
    <div className="inline-flex items-center gap-0.5">
      {hasOptionIcons &&
        take(selected, 3).map(({ value, icon }) => {
          const Icon = icon!
          return <Icon key={value} strokeWidth={2.25} className="size-4" />
        })}
      <span className={cn('text-slate-700', hasOptionIcons && 'ml-1.5')}>
        {selected.length} {pluralName}
      </span>
    </div>
  )
}

export function PropertyFilterMultiOptionValueDisplay<TData>({
  id,
  table,
}: {
  id: string
  table: Table<TData>
}) {
  const column = table.getColumn(id)

  if (!column) return null

  const meta = column.columnDef.meta

  if (!meta) return null

  const providedOptions = meta.options

  let options: ColumnOption[]

  if (providedOptions) {
    options = providedOptions
  } else if (meta.transformFn) {
    const columnVals = table.getCoreRowModel().rows.map((r) => r.getValue(id))
    const transformed = columnVals.map(meta.transformFn) as string[][]
    const flattened = flatten(transformed)
    const unique = uniq(flattened)
    options = unique.map((value) => {
      const option: ColumnOption = {
        value: value,
        label: value,
        icon: undefined,
      }
      return option
    })
  } else {
    const columnVals = table
      .getCoreRowModel()
      .rows.map((r) => r.getValue<string[]>(id))
    const flattened = flatten(columnVals)
    const unique = uniq(flattened)
    options = unique.map((value) => {
      const option: ColumnOption = {
        value: value,
        label: value,
        icon: undefined,
      }
      return option
    })
  }

  const filter = column.getFilterValue() as FilterValue<'multiOption'>
  const selected = options.filter((o) => filter?.values[0].includes(o.value))

  if (selected.length === 1) {
    const { label, icon: Icon } = selected[0]
    const hasIcon = !!Icon
    return (
      <span className="inline-flex items-center gap-1">
        {hasIcon && <Icon strokeWidth={2.25} className="size-4" />}
        <span className="text-slate-700">{label}</span>
      </span>
    )
  }

  const name = meta.displayName.toLowerCase()

  const hasOptionIcons = !!meta.options

  return (
    <div className="inline-flex items-center gap-0.5">
      {hasOptionIcons &&
        take(selected, 3).map(({ value, icon }) => {
          const Icon = icon!
          return <Icon key={value} strokeWidth={2.25} className="size-4" />
        })}
      <span className={cn('text-slate-700', hasOptionIcons && 'ml-1.5')}>
        {selected.length} {name}
      </span>
    </div>
  )
}

function formatDateRange(start: Date, end: Date) {
  const sameMonth = start.getMonth() === end.getMonth()
  const sameYear = start.getFullYear() === end.getFullYear()

  if (sameMonth && sameYear) {
    return `${format(start, 'MMM d')} - ${format(end, 'd, yyyy')}`
  }

  if (sameYear) {
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`
  }

  return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`
}

export function PropertyFilterDateValueDisplay<TData, TValue>({
  id,
  table,
}: {
  id: string
  table: Table<TData>
}) {
  const column = table.getColumn(id)

  if (!column) {
    return null
  }

  const filter = column.getFilterValue()
    ? (column.getFilterValue() as FilterValue<'date'>)
    : undefined

  if (!filter) return null
  if (filter.values.length === 0)
    return <Ellipsis className="size-4 text-slate-400" />
  if (filter.values.length === 1) {
    const value = filter.values[0]

    const formattedDateStr = format(value, 'MMM d, yyyy')

    return <span className="text-slate-700">{formattedDateStr}</span>
  }

  const formattedRangeStr = formatDateRange(filter.values[0], filter.values[1])

  return <span className="text-slate-700">{formattedRangeStr}</span>
}

export function PropertyFilterTextValueDisplay<TData, TValue>({
  id,
  table,
}: {
  id: string
  table: Table<TData>
}) {
  const column = table.getColumn(id)

  if (!column) {
    return null
  }

  const filter = column.getFilterValue()
    ? (column.getFilterValue() as FilterValue<'text'>)
    : undefined

  if (!filter) return null
  if (filter.values.length === 0 || filter.values[0].trim() === '')
    return <Ellipsis className="size-4 text-slate-400" />

  const value = filter.values[0]

  return <span className="text-slate-700">{value}</span>
}

export function PropertyFilterNumberValueDisplay<TData, TValue>({
  id,
  table,
}: {
  id: string
  table: Table<TData>
}) {
  const column = table.getColumn(id)

  if (!column) {
    return null
  }

  const maxFromMeta = column.columnDef.meta?.max
  const cappedMax = maxFromMeta ?? 2147483647

  const filter = column.getFilterValue()
    ? (column.getFilterValue() as FilterValue<'number'>)
    : undefined

  if (!filter) return null

  if (
    filter.operator === 'is between' ||
    filter.operator === 'is not between'
  ) {
    const minValue = filter.values[0]
    const maxValue =
      filter.values[1] === Number.POSITIVE_INFINITY ||
      filter.values[1] >= cappedMax
        ? `${cappedMax}+`
        : filter.values[1]

    return (
      <span className="tabular-nums tracking-tight text-slate-700">
        {minValue} and {maxValue}
      </span>
    )
  }

  if (!filter.values || filter.values.length === 0) {
    return null
  }

  const value = filter.values[0]
  return (
    <span className="tabular-nums tracking-tight text-slate-700">{value}</span>
  )
}

export function PropertyFilterValueMenu<TData>({
  id,
  table,
}: {
  id: string
  table: Table<TData>
}) {
  const column = table.getColumn(id)

  if (!column) {
    return null
  }

  const { type } = column.columnDef.meta!

  switch (type) {
    case 'option':
      return <PropertyFilterOptionValueMenu id={id} table={table} />
    case 'multiOption':
      return <PropertyFilterMultiOptionValueMenu id={id} table={table} />
    case 'date':
      return <PropertyFilterDateValueMenu id={id} table={table} />
    case 'text':
      return <PropertyFilterTextValueMenu id={id} table={table} />
    case 'number':
      return <PropertyFilterNumberValueMenu id={id} table={table} />
    default:
      return null
  }
}

export function PropertyFilterOptionValueMenu<TData>({
  id,
  table,
}: {
  id: string
  table: Table<TData>
}) {
  const column = table.getColumn(id)

  if (!column) {
    return null
  }

  const filter = column.getFilterValue()
    ? (column.getFilterValue() as FilterValue<'option'>)
    : undefined

  const meta = column.columnDef.meta!

  const optionsProvided = !!meta && !!meta.options
  const options = optionsProvided
    ? (meta.options as ColumnOption[])
    : uniq(table.getCoreRowModel().rows.map((r) => r.getValue<string>(id))).map(
        (value) => {
          const option: ColumnOption = {
            value: value,
            label: value,
            icon: undefined,
          }

          return option
        },
      )

  function handleOptionSelect(value: string, check: boolean) {
    if (check)
      column?.setFilterValue((old: undefined | FilterValue<'option'>) => {
        if (!old || old.values.length === 0)
          return {
            operator: 'is',
            values: [value],
          } satisfies FilterValue<'option'>

        const newValues = [...old.values, value]

        return {
          operator: 'is any of',
          values: newValues,
        } satisfies FilterValue<'option'>
      })
    else
      column?.setFilterValue((old: undefined | FilterValue<'option'>) => {
        if (!old || old.values.length <= 1) return undefined

        const newValues = old.values.filter((v) => v !== value)
        return {
          operator: newValues.length > 1 ? 'is any of' : 'is',
          values: newValues,
        } satisfies FilterValue<'option'>
      })
  }

  return (
    <Command loop>
      <CommandInput autoFocus placeholder="Search..." />
      <CommandEmpty>No results.</CommandEmpty>
      <CommandList className="max-h-fit">
        <CommandGroup>
          {options.map((v) => {
            const checked = Boolean(filter?.values.includes(v.value))
            let data = table.getCoreRowModel().rows.map((r: Row<TData>) => {
              const original = r.original as Record<string, unknown>
              const value = original[id]
              return value
            })

            if (meta.transformFn) {
              data = data.map(meta.transformFn)
            }

            const count = data.filter((d) => d === v.value).length ?? 0

            return (
              <CommandItem
                key={v.value}
                onSelect={() => {
                  handleOptionSelect(v.value, !checked)
                }}
                className="group flex items-center justify-between gap-1.5 text-slate-700"
              >
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Checkbox
                    checked={checked}
                    className="border-slate-300 opacity-0 group-hover:opacity-100 data-[state=checked]:opacity-100"
                  />
                  {v.icon && (
                    <v.icon
                      strokeWidth={2.25}
                      className="size-4 text-primary"
                    />
                  )}
                  <span className="text-slate-700">
                    {v.label}
                    <sup
                      className={cn(
                        'ml-0.5 tabular-nums tracking-tight text-slate-400',
                        count === 0 && 'slashed-zero',
                      )}
                    >
                      {count < 100 ? count : '100+'}
                    </sup>
                  </span>
                </div>
              </CommandItem>
            )
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

export function PropertyFilterMultiOptionValueMenu<TData>({
  id,
  table,
}: {
  id: string
  table: Table<TData>
}) {
  const column = table.getColumn(id)

  if (!column) {
    return null
  }

  const filter = column.getFilterValue()
    ? (column.getFilterValue() as FilterValue<'multiOption'>)
    : undefined

  const meta = column.columnDef.meta

  if (!meta) return null

  const hasProvidedOptions = !!meta.options

  let options: ColumnOption[]

  if (hasProvidedOptions) {
    options = meta.options as ColumnOption[]
  } else if (meta.transformFn) {
    const columnVals = table
      .getCoreRowModel()
      .rows.flatMap((r) => r.getValue(id))
    const transformed = columnVals.map(meta.transformFn) as string[]
    // const flattened = flatten(transformed)
    // TODO: Do we need to flatten?
    const flattened = transformed
    const unique = uniq(flattened)
    options = unique.map((value) => {
      const option: ColumnOption = {
        value: value,
        label: value,
        icon: undefined,
      }
      return option
    })
  } else {
    const columnVals = table
      .getCoreRowModel()
      .rows.flatMap((r) => r.getValue<string[]>(id))
    const unique = uniq(columnVals)
    options = unique.map((value) => {
      const option: ColumnOption = {
        value: value,
        label: value,
        icon: undefined,
      }
      return option
    })
  }

  // Handles the selection/deselection of an option
  function handleOptionSelect(value: string, check: boolean) {
    if (check) {
      column?.setFilterValue((old: undefined | FilterValue<'multiOption'>) => {
        if (
          !old ||
          old.values.length === 0 ||
          !old.values[0] ||
          old.values[0].length === 0
        )
          return {
            operator: 'include',
            values: [[value]],
          } satisfies FilterValue<'multiOption'>

        const newValues = [uniq([...old.values[0], value])]

        return {
          operator: determineNewOperator(
            'multiOption',
            old.values,
            newValues,
            old.operator,
          ),
          values: newValues,
        } satisfies FilterValue<'multiOption'>
      })
    } else
      column?.setFilterValue((old: undefined | FilterValue<'multiOption'>) => {
        if (!old?.values[0] || old.values[0].length <= 1) return undefined

        const newValues = [
          uniq([...old.values[0], value]).filter((v) => v !== value),
        ]

        return {
          operator: determineNewOperator(
            'multiOption',
            old.values,
            newValues,
            old.operator,
          ),
          values: newValues,
        } satisfies FilterValue<'multiOption'>
      })
  }

  return (
    <Command loop>
      <CommandInput autoFocus placeholder="Search..." />
      <CommandEmpty>No results.</CommandEmpty>
      <CommandList className="max-h-fit">
        <CommandGroup>
          {options.map((v) => {
            const checked = Boolean(filter?.values[0]?.includes(v.value))
            let data = table
              .getCoreRowModel()
              .rows.map((r) => r.original as Record<string, unknown>)
              .map((d) => d[id])

            if (meta.transformFn) {
              data = data.map(meta.transformFn)
            }

            const count =
              data.filter((d) => (d as unknown[]).includes(v.value)).length ?? 0

            return (
              <CommandItem
                key={v.value}
                onSelect={() => {
                  handleOptionSelect(v.value, !checked)
                }}
                className="group flex items-center justify-between gap-1.5 text-slate-700"
              >
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Checkbox
                    checked={checked}
                    className="border-slate-300 opacity-0 group-hover:opacity-100 data-[state=checked]:opacity-100"
                  />
                  {v.icon && (
                    <v.icon
                      strokeWidth={2.25}
                      className="size-4 text-primary"
                    />
                  )}
                  <span className="text-slate-700">
                    {v.label}
                    <sup
                      className={cn(
                        'ml-0.5 tabular-nums tracking-tight text-slate-400',
                        count === 0 && 'slashed-zero',
                      )}
                    >
                      {count < 100 ? count : '100+'}
                    </sup>
                  </span>
                </div>
              </CommandItem>
            )
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

export function PropertyFilterDateValueMenu<TData>({
  id,
  table,
}: {
  id: string
  table: Table<TData>
}) {
  const column = table.getColumn(id)

  const filter = column?.getFilterValue()
    ? (column?.getFilterValue() as FilterValue<'date'>)
    : undefined

  const [date, setDate] = useState<DateRange | undefined>({
    from: filter?.values[0] ?? new Date(),
    to: filter?.values[1] ?? undefined,
  })

  if (!column) {
    return null
  }

  function changeDateRange(value: DateRange | undefined) {
    const start = value?.from
    const end =
      start && value && value.to && !isEqual(start, value.to)
        ? value.to
        : undefined

    setDate({ from: start, to: end })

    const isRange = start && end

    const newValues = isRange ? [start, end] : start ? [start] : []

    column?.setFilterValue((old: undefined | FilterValue<'date'>) => {
      if (!old || old.values.length === 0)
        return {
          operator: newValues.length > 1 ? 'is between' : 'is',
          values: newValues,
        } satisfies FilterValue<'date'>

      return {
        operator:
          old.values.length < newValues.length
            ? 'is between'
            : old.values.length > newValues.length
              ? 'is'
              : old.operator,
        values: newValues,
      } satisfies FilterValue<'date'>
    })
  }

  return (
    <Command>
      {/* <CommandInput placeholder="Search..." /> */}
      {/* <CommandEmpty>No results.</CommandEmpty> */}
      <CommandList className="max-h-fit">
        <CommandGroup>
          <div>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={changeDateRange}
              numberOfMonths={1}
            />
          </div>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

export function PropertyFilterTextValueMenu<TData>({
  id,
  table,
}: {
  id: string
  table: Table<TData>
}) {
  const column = table.getColumn(id)

  const filter = column?.getFilterValue()
    ? (column?.getFilterValue() as FilterValue<'text'>)
    : undefined

  if (!column) {
    return null
  }

  const changeText = (value: string | number) => {
    column?.setFilterValue((old: undefined | FilterValue<'text'>) => {
      if (!old || old.values.length === 0)
        return {
          operator: 'contains',
          values: [String(value)],
        } satisfies FilterValue<'text'>
      return { operator: old.operator, values: [String(value)] }
    })
  }

  return (
    <Command>
      <CommandList className="max-h-fit">
        <CommandGroup>
          <CommandItem>
            <DebouncedInput
              placeholder="Search..."
              autoFocus
              value={filter?.values[0] ?? ''}
              onChange={changeText}
            />
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

export function PropertyFilterNumberValueMenu<TData>({
  id,
  table,
}: {
  id: string
  table: Table<TData>
}) {
  const column = table.getColumn(id) ?? {
    getFilterValue: () => undefined,
    columnDef: { meta: { max: 2147483647 } },
    setFilterValue: () => {},
    getFacetedMinMaxValues: () => [0, 2147483647],
  }

  const maxFromMeta = column.columnDef.meta?.max
  const cappedMax = maxFromMeta ?? 2147483647

  const filter = column.getFilterValue()
    ? (column.getFilterValue() as FilterValue<'number'>)
    : undefined

  const isNumberRange =
    !!filter && numberFilterDetails[filter.operator].target === 'multiple'

  const [datasetMin] = column.getFacetedMinMaxValues() ?? [0, 0]

  const initialValues = () => {
    if (filter?.values) {
      return filter.values.map((val) =>
        val >= cappedMax ? `${cappedMax}+` : val.toString(),
      )
    }
    return [datasetMin.toString()]
  }

  const [inputValues, setInputValues] = useState<string[]>(initialValues)

  const changeNumber = (value: number[]) => {
    const sortedValues = [...value].sort((a, b) => a - b)

    column.setFilterValue((old: undefined | FilterValue<'number'>) => {
      if (!old || old.values.length === 0) {
        return {
          operator: 'is',
          values: sortedValues,
        }
      }

      const operator = numberFilterDetails[old.operator]
      let newValues: number[]

      if (operator.target === 'single') {
        newValues = [sortedValues[0]]
      } else {
        newValues = [
          sortedValues[0] >= cappedMax ? cappedMax : sortedValues[0],
          sortedValues[1] >= cappedMax
            ? Number.POSITIVE_INFINITY
            : sortedValues[1],
        ]
      }

      return {
        operator: old.operator,
        values: newValues,
      }
    })
  }

  const handleInputChange = (index: number, value: string) => {
    const newValues = [...inputValues]
    if (isNumberRange && Number.parseInt(value, 10) >= cappedMax) {
      newValues[index] = `${cappedMax}+`
    } else {
      newValues[index] = value
    }

    setInputValues(newValues)

    const parsedValues = newValues.map((val) => {
      if (val.trim() === '') return 0
      if (val === `${cappedMax}+`) return cappedMax
      return Number.parseInt(val, 10)
    })

    changeNumber(parsedValues)
  }

  const changeType = (type: 'single' | 'range') => {
    column.setFilterValue((old: undefined | FilterValue<'number'>) => {
      if (type === 'single') {
        return {
          operator: 'is',
          values: [old?.values[0] ?? 0],
        }
      }
      const newMaxValue = old?.values[0] ?? cappedMax
      return {
        operator: 'is between',
        values: [0, newMaxValue],
      }
    })

    if (type === 'single') {
      setInputValues([inputValues[0]])
    } else {
      const maxValue = inputValues[0] || cappedMax.toString()
      setInputValues(['0', maxValue])
    }
  }

  return (
    <Command className="w-[300px]">
      <CommandList>
        <CommandGroup>
          <CommandItem className="flex flex-col items-start gap-4 bg-transparent pt-4 aria-selected:bg-transparent">
            {isNumberRange ? (
              <>
                <Slider
                  value={inputValues.map((val) =>
                    val === '' || val === `${cappedMax}+`
                      ? cappedMax
                      : Number.parseInt(val, 10),
                  )}
                  onValueChange={(value) => {
                    const values = value.map((val) =>
                      val >= cappedMax ? cappedMax : val,
                    )
                    setInputValues(
                      values.map((v) =>
                        v >= cappedMax ? `${cappedMax}+` : v.toString(),
                      ),
                    )
                    changeNumber(values)
                  }}
                  min={datasetMin}
                  max={cappedMax}
                  step={1}
                  aria-orientation="horizontal"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-600">
                      Min
                    </span>
                    <Input
                      type="number"
                      value={inputValues[0]}
                      onChange={(e) => handleInputChange(0, e.target.value)}
                      max={cappedMax}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-600">
                      Max
                    </span>
                    <Input
                      type="text"
                      value={inputValues[1]}
                      placeholder={`${cappedMax}+`}
                      onChange={(e) => handleInputChange(1, e.target.value)}
                      max={cappedMax}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex w-1/2 items-center gap-2">
                <span className="text-sm font-medium text-slate-600">
                  Value
                </span>
                <Input
                  id="single"
                  type="number"
                  value={inputValues[0]}
                  onChange={(e) => handleInputChange(0, e.target.value)}
                  max={cappedMax}
                />
              </div>
            )}
          </CommandItem>
          <CommandSeparator className="my-4" />
          <CommandItem className="bg-transparent pb-3 pt-0 aria-selected:bg-transparent">
            <div className="flex items-center gap-2">
              <Switch
                checked={isNumberRange}
                onCheckedChange={(checked) =>
                  changeType(checked ? 'range' : 'single')
                }
              />
              <Label className="font-normal">Range</Label>
            </div>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

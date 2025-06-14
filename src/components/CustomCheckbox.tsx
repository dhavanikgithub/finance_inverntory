// components/CustomCheckbox.tsx
import React from 'react'

type Props = {
  value: string
  checked: boolean
  onChange: () => void
}

export default function CustomCheckbox({ value, checked, onChange }: Props) {
  return (
    <div className="flex gap-2 relative">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="relative peer shrink-0 appearance-none w-4 h-4 rounded-sm bg-slate-200 mt-1
                   checked:bg-black checked:border-0
                   dark:bg-slate-500 dark:checked:bg-slate-200"
      />
      <label onClick={onChange}>{value}</label>
      <svg
        className="absolute w-4 h-4 mt-1 hidden peer-checked:block pointer-events-none text-white dark:text-black p-[2px]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>
  )
}

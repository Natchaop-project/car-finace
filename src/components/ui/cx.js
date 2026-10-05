import { twMerge } from 'tailwind-merge'

// Join class names, skipping falsy values; later classes win conflicts (h-10 over h-11).
export const cx = (...classes) => twMerge(classes.filter(Boolean).join(' '))

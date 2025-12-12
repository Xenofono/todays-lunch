import { atomWithReset } from 'jotai/utils'

export const randomizedRestaurantAtom = atomWithReset<string | undefined>(undefined)
import { atom } from "jotai";

export const amountAtom = atom(0); 
export const purposeAtom = atom("")
export const splitsAtom = atom<string[]>([]);
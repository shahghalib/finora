import { create } from 'zustand';

interface AddTransactionState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useAddTransactionStore = create<AddTransactionState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

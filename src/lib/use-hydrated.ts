import { useSyncExternalStore } from 'react';
const subscribe = () => () => {};

/** Keep server-rendered controls disabled until their event handlers are ready. */
export function useHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import LoadingScreen from "./LoadingScreen";

interface LoadingCtx {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingCtx>({
  showLoading: () => {},
  hideLoading: () => {},
});

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  // hydrated becomes true after the first client-side render (i.e. after page
  // load / browser refresh). While false the loading screen acts as a splash.
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<{ active: boolean; message: string }>({
    active: false,
    message: "",
  });
  // Safety: auto-hide after 12s in case a component forgets to call hideLoading
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Fires once after first client paint — marks app as hydrated
    setHydrated(true);
  }, []);

  const showLoading = useCallback((message = "載入中") => {
    if (safetyTimer.current) clearTimeout(safetyTimer.current);
    setState({ active: true, message });
    safetyTimer.current = setTimeout(() => {
      setState((s) => ({ ...s, active: false }));
    }, 12000);
  }, []);

  const hideLoading = useCallback(() => {
    if (safetyTimer.current) clearTimeout(safetyTimer.current);
    setState((s) => ({ ...s, active: false }));
  }, []);

  const isVisible = !hydrated || state.active;
  const message = !hydrated ? "載入中" : state.message;

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading }}>
      {children}
      {isVisible && <LoadingScreen message={message} />}
    </LoadingContext.Provider>
  );
}

export const useLoading = () => useContext(LoadingContext);

import { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";
import { createConsentStore } from "./store.js";
import ConsentPanel from "./ConsentPanel.jsx";

const store = typeof window === "undefined" ? null : createConsentStore(window);
const Context = createContext({ state: null, save: () => false, openSettings: () => {} });
const emptySubscribe = () => () => {};
const emptySnapshot = () => null;

export function useConsent() { return useContext(Context); }

export default function ConsentProvider({ children }) {
  const state = useSyncExternalStore(store?.subscribe ?? emptySubscribe, store?.getSnapshot ?? emptySnapshot, emptySnapshot);
  const [ready, setReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => { store?.start(); setReady(true); }, []);
  const save = (choices) => {
    const saved = store?.save(choices) ?? false;
    setStorageError(!saved);
    if (saved) setSettingsOpen(false);
    return saved;
  };
  return <Context.Provider value={{ state, save, openSettings: () => setSettingsOpen(true) }}>
    {children}
    {ready && (settingsOpen || !state) && <ConsentPanel state={state} save={save} customize={settingsOpen}
      onCustomize={() => setSettingsOpen(true)} onClose={() => setSettingsOpen(false)} storageError={storageError} />}
  </Context.Provider>;
}

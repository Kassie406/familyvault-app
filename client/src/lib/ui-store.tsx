import React from "react";

type UIState = {
  sidebarCollapsed: boolean;          // current visual state
  _prevSidebarCollapsed: boolean|null; // to restore after inbox closes
  setSidebarCollapsed(v: boolean): void;

  inboxOpen: boolean;
  openInbox(): void;
  closeInbox(): void;
};

const Ctx = React.createContext<UIState>(null as any);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [prev, setPrev] = React.useState<boolean|null>(null);
  const [inboxOpen, setInboxOpen] = React.useState(false);

  const openInbox = React.useCallback(() => {
    setPrev(sidebarCollapsed);      // remember current
    setSidebarCollapsed(true);      // lock collapsed while inbox shown
    setInboxOpen(true);
    document.body.setAttribute("data-inbox-open", "true");
  }, [sidebarCollapsed]);

  const closeInbox = React.useCallback(() => {
    setInboxOpen(false);
    document.body.removeAttribute("data-inbox-open");
    setSidebarCollapsed(prev ?? false); // restore previous
    setPrev(null);
  }, [prev]);

  const value = {
    sidebarCollapsed,
    _prevSidebarCollapsed: prev,
    setSidebarCollapsed,
    inboxOpen,
    openInbox,
    closeInbox,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useUI = () => React.useContext(Ctx);
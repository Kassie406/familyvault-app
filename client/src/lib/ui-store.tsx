import React from "react";

type UI = {
  sidebarCollapsed: boolean;
  inboxOpen: boolean;
  openInbox(): void;
  closeInbox(): void;
  setSidebarCollapsed(v: boolean): void; // for your manual toggle button
};

const Ctx = React.createContext<UI>(null as any);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [inboxOpen, setInboxOpen] = React.useState(false);
  const prevCollapsedRef = React.useRef<boolean>(false);

  // keep body attributes in sync (single effect)
  React.useEffect(() => {
    document.body.toggleAttribute("data-sidebar-collapsed", sidebarCollapsed);
  }, [sidebarCollapsed]);

  React.useEffect(() => {
    document.body.toggleAttribute("data-inbox-open", inboxOpen);
  }, [inboxOpen]);

  const openInbox = React.useCallback(() => {
    prevCollapsedRef.current = sidebarCollapsed; // remember
    setSidebarCollapsed(true);                   // icon-only
    setInboxOpen(true);
  }, [sidebarCollapsed]);

  const closeInbox = React.useCallback(() => {
    setInboxOpen(false);
    setSidebarCollapsed(prevCollapsedRef.current); // restore
  }, []);

  // clear any stale flags on first mount
  React.useEffect(() => {
    document.body.removeAttribute("data-inbox-open");
    document.body.removeAttribute("data-sidebar-collapsed");
  }, []);

  return (
    <Ctx.Provider
      value={{ sidebarCollapsed, inboxOpen, openInbox, closeInbox, setSidebarCollapsed }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useUI = () => React.useContext(Ctx);
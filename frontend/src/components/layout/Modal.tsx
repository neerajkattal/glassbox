import { useEffect, useRef, type ReactNode } from "react";

interface Props {
  label: string;
  onClose: () => void;
  children: ReactNode;
}

/** Accessible dialog: closes on Escape or backdrop click and keeps focus inside. */
export function Modal({ label, onClose, children }: Props) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-end bg-ink/40 p-0 backdrop-blur-sm sm:place-items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className="max-h-[90vh] w-full animate-pop overflow-y-auto rounded-t-3xl bg-white p-6 shadow-card sm:max-w-lg sm:rounded-3xl"
      >
        {children}
      </div>
    </div>
  );
}

import { PlugZap } from "lucide-react";
import { useI18n } from "../../i18n";

interface Props {
  failed: boolean;
  connecting: boolean;
  lost: boolean;
  onRetry: () => void;
}

/** Explains loading and connection problems in friendly words. */
export function StatusBanner({ failed, connecting, lost, onRetry }: Props) {
  const { t } = useI18n();
  if (!failed && !connecting && !lost) return null;

  if (connecting) {
    return (
      <div className="card mb-4 flex items-center gap-3" role="status">
        <span className="h-5 w-5 shrink-0 animate-spin rounded-full border-[3px] border-brand-100 border-t-brand-600" />
        <div>
          <p className="font-bold">{t.status.waking}</p>
          <p className="text-sm text-gray-500">{t.status.firstTime}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-4 flex flex-wrap items-center gap-3 border-2 border-rose-100" role="alert">
      <PlugZap className="h-6 w-6 shrink-0 text-rose-500" aria-hidden />
      <p className="flex-1 font-bold text-rose-700">{failed ? t.status.offline : t.status.reconnecting}</p>
      <button type="button" className="btn-primary" onClick={onRetry}>
        {t.status.retry}
      </button>
    </div>
  );
}

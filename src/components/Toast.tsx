import { useEffect, useState } from 'react';

/** Kleine Rueckmeldung ("Zur Einkaufsliste hinzugefuegt"). */
export function useToast() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 2400);
    return () => clearTimeout(timer);
  }, [message]);

  const toast = message ? <div className="toast">{message}</div> : null;
  return { showToast: setMessage, toast };
}

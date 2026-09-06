import type { Recipe } from '../types';

/**
 * KI-Schnittstelle (vorbereitet, noch nicht aktiv).
 *
 * WICHTIG: Der Anthropic-API-Schluessel darf niemals im Frontend liegen.
 * Dieses Modul ruft deshalb ausschliesslich einen eigenen Backend-Endpunkt auf
 * (siehe `server/`), der den Schluessel serverseitig haelt und die Anfrage an
 * Claude weiterleitet.
 *
 * Solange kein Backend laeuft (`VITE_AI_ENDPOINT` nicht gesetzt), liefert
 * `isAiAvailable()` false und die Oberflaeche blendet die KI-Funktionen aus.
 */

const ENDPOINT = import.meta.env.VITE_AI_ENDPOINT as string | undefined;

export type AiTask =
  | { type: 'was-kochen'; mood?: string }
  | { type: 'reste-verwerten'; ingredients: string[] }
  | { type: 'wochenplan-vorschlag'; days: number }
  | { type: 'kinder-empfehlung' }
  | { type: 'neues-rezept'; wunsch: string };

export interface AiSuggestion {
  /** Vorhandene Rezepte, die Claude empfiehlt. */
  recipeIds: string[];
  /** Freitext-Antwort fuer die Anzeige. */
  message: string;
  /** Optional ein komplett neu generiertes Rezept. */
  newRecipe?: Recipe;
}

export function isAiAvailable(): boolean {
  return Boolean(ENDPOINT);
}

export async function askAi(task: AiTask, context: unknown): Promise<AiSuggestion> {
  if (!ENDPOINT) {
    throw new Error(
      'KI ist noch nicht verbunden. Backend starten und VITE_AI_ENDPOINT setzen (siehe server/README.md).',
    );
  }
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task, context }),
  });
  if (!response.ok) throw new Error(`KI-Anfrage fehlgeschlagen (${response.status})`);
  return (await response.json()) as AiSuggestion;
}

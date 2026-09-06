import type { AppState } from '../types';
import { hydrate } from './storage';
import { plural } from './text';

/**
 * Datensicherung.
 *
 * Solange die Daten nur im Browser des Geraets liegen, ist ein Export die
 * einzige Absicherung gegen Datenverlust (Browserdaten geloescht, neues Handy).
 * Das Format ist bewusst schlichtes JSON – es laesst sich spaeter direkt in
 * eine Datenbank einspielen.
 */

const BACKUP_VERSION = 1;

export interface Backup {
  app: 'essens-app';
  version: number;
  exportedAt: string;
  state: AppState;
}

export function createBackup(state: AppState): Backup {
  return {
    app: 'essens-app',
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    state,
  };
}

/** Dateiname mit Datum, z. B. essens-app-sicherung-2026-09-06.json */
export function backupFileName(date = new Date()): string {
  return `essens-app-sicherung-${date.toISOString().slice(0, 10)}.json`;
}

/**
 * Liest eine Sicherungsdatei ein.
 * Wirft einen Fehler mit verstaendlichem Text, wenn die Datei nicht passt.
 */
export function parseBackup(text: string): AppState {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Die Datei ist keine gültige Sicherung (kein lesbares JSON).');
  }
  if (!data || typeof data !== 'object') {
    throw new Error('Die Datei ist keine gültige Sicherung.');
  }
  const backup = data as Partial<Backup>;
  if (backup.app !== 'essens-app' || !backup.state) {
    throw new Error('Diese Datei stammt nicht aus der Essens App.');
  }
  if (typeof backup.version === 'number' && backup.version > BACKUP_VERSION) {
    throw new Error('Die Sicherung stammt aus einer neueren App-Version. Bitte zuerst die App aktualisieren.');
  }
  // hydrate ergaenzt fehlende Felder und schuetzt vor unvollstaendigen Dateien.
  return hydrate(backup.state as AppState);
}

/** Kurze Zusammenfassung fuer die Anzeige nach dem Einlesen. */
export function describeState(state: AppState): string {
  const parts = [
    plural(state.favorites.length, 'Favorit', 'Favoriten'),
    plural(state.ratings.length, 'Bewertung', 'Bewertungen'),
    plural(state.shoppingList.items.length, 'Einkaufsposition', 'Einkaufspositionen'),
    `${plural(state.weeklyPlan.items.length, 'geplante Mahlzeit', 'geplante Mahlzeiten')}`,
  ];
  return parts.join(' · ');
}

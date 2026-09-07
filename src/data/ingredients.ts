import type { Ingredient, ShopCategory } from '../types';

/**
 * Zutaten-Stammdaten.
 *
 * Die id ist gleichzeitig der Merge-Schluessel der Einkaufsliste: Zutaten mit
 * derselben id aus verschiedenen Rezepten werden automatisch zusammengerechnet.
 * Spaeter koennen hier gtin / vendorRefs fuer die Haendleranbindung ergaenzt werden.
 */
function ing(
  id: string,
  name: string,
  category: ShopCategory,
  pantry = false,
): Ingredient {
  return { id, name, category, ...(pantry ? { pantry: true } : {}) };
}

export const INGREDIENTS: Ingredient[] = [
  // --- Obst & Gemuese ---
  ing('zwiebel', 'Zwiebel', 'obst-gemuese'),
  ing('rote-zwiebel', 'Rote Zwiebel', 'obst-gemuese'),
  ing('fruehlingszwiebel', 'Frühlingszwiebel', 'obst-gemuese'),
  ing('knoblauch', 'Knoblauchzehe', 'obst-gemuese'),
  ing('moehre', 'Möhre', 'obst-gemuese'),
  ing('paprika', 'Paprika', 'obst-gemuese'),
  ing('brokkoli', 'Brokkoli', 'obst-gemuese'),
  ing('blumenkohl', 'Blumenkohl', 'obst-gemuese'),
  ing('zucchini', 'Zucchini', 'obst-gemuese'),
  ing('tomate', 'Tomate', 'obst-gemuese'),
  ing('kirschtomaten', 'Kirschtomaten', 'obst-gemuese'),
  ing('kartoffel', 'Kartoffeln (festkochend)', 'obst-gemuese'),
  ing('suesskartoffel', 'Süßkartoffel', 'obst-gemuese'),
  ing('lauch', 'Lauch', 'obst-gemuese'),
  ing('champignon', 'Champignons', 'obst-gemuese'),
  ing('babyspinat', 'Babyspinat', 'obst-gemuese'),
  ing('salatgurke', 'Salatgurke', 'obst-gemuese'),
  ing('kopfsalat', 'Kopfsalat', 'obst-gemuese'),
  ing('apfel', 'Apfel', 'obst-gemuese'),
  ing('banane', 'Banane', 'obst-gemuese'),
  ing('zitrone', 'Zitrone', 'obst-gemuese'),
  ing('petersilie', 'Petersilie', 'obst-gemuese'),
  ing('schnittlauch', 'Schnittlauch', 'obst-gemuese'),
  ing('basilikum', 'Basilikum', 'obst-gemuese'),
  ing('ingwer', 'Ingwer', 'obst-gemuese'),
  ing('kuerbis', 'Hokkaido-Kürbis', 'obst-gemuese'),

  // --- Fleisch ---
  ing('haehnchenbrust', 'Hähnchenbrustfilet', 'fleisch'),
  ing('haehnchenkeule', 'Hähnchenkeulen', 'fleisch'),
  ing('rinderhack', 'Rinderhackfleisch', 'fleisch'),
  ing('gemischtes-hack', 'Gemischtes Hackfleisch', 'fleisch'),
  ing('kochschinken', 'Kochschinken', 'fleisch'),

  // --- Milchprodukte ---
  ing('milch', 'Milch', 'milchprodukte'),
  ing('sahne', 'Schlagsahne', 'milchprodukte'),
  ing('kochsahne', 'Kochsahne', 'milchprodukte'),
  ing('frischkaese', 'Frischkäse natur', 'milchprodukte'),
  ing('creme-fraiche', 'Crème fraîche', 'milchprodukte'),
  ing('schmand', 'Schmand', 'milchprodukte'),
  ing('joghurt', 'Naturjoghurt', 'milchprodukte'),
  ing('griechischer-joghurt', 'Griechischer Joghurt', 'milchprodukte'),
  ing('quark', 'Magerquark', 'milchprodukte'),
  ing('butter', 'Butter', 'milchprodukte'),
  ing('gouda-gerieben', 'Geriebener Gouda', 'milchprodukte'),
  ing('mozzarella', 'Mozzarella', 'milchprodukte'),
  ing('parmesan', 'Parmesan', 'milchprodukte'),
  ing('feta', 'Feta', 'milchprodukte'),

  // --- Eier ---
  ing('ei', 'Eier', 'eier'),

  // --- Reis, Nudeln & Getreide ---
  ing('nudeln', 'Nudeln', 'getreide'),
  ing('vollkornnudeln', 'Vollkornnudeln', 'getreide'),
  ing('spaghetti', 'Spaghetti', 'getreide'),
  ing('reis', 'Reis', 'getreide'),
  ing('basmatireis', 'Basmatireis', 'getreide'),
  ing('milchreis', 'Milchreis', 'getreide'),
  ing('couscous', 'Couscous', 'getreide'),
  ing('quinoa', 'Quinoa', 'getreide'),
  ing('rote-linsen', 'Rote Linsen', 'getreide'),
  ing('haferflocken', 'Haferflocken', 'getreide'),
  // --- Glutenfreie Alternativen ---
  // Eigene Eintraege statt Varianten der Weizenprodukte: Auf der Einkaufsliste
  // muss stehen, welche Packung wirklich in den Wagen gehoert.
  ing('hirse', 'Hirse', 'getreide'),
  ing('buchweizenmehl', 'Buchweizenmehl', 'getreide'),
  ing('glutenfreie-nudeln', 'Glutenfreie Nudeln (Mais/Reis)', 'getreide'),
  ing('glutenfreie-haferflocken', 'Haferflocken (glutenfrei)', 'getreide'),
  ing('mais-tortillas', 'Mais-Tortillas', 'getreide'),
  ing('mehl', 'Weizenmehl', 'getreide', true),
  ing('vollkornmehl', 'Vollkornmehl', 'getreide'),
  ing('gnocchi', 'Gnocchi (Kühlregal)', 'getreide'),
  ing('wraps', 'Weizen-Wraps', 'getreide'),
  ing('vollkornbrot', 'Vollkornbrot', 'getreide'),
  ing('semmelbroesel', 'Semmelbrösel', 'getreide', true),

  // --- Konserven ---
  ing('gehackte-tomaten', 'Gehackte Tomaten', 'konserven'),
  ing('passierte-tomaten', 'Passierte Tomaten', 'konserven'),
  ing('tomatenmark', 'Tomatenmark', 'konserven', true),
  ing('kokosmilch', 'Kokosmilch', 'konserven'),
  ing('kidneybohnen', 'Kidneybohnen', 'konserven'),
  ing('kichererbsen', 'Kichererbsen', 'konserven'),
  ing('mais', 'Mais', 'konserven'),
  ing('apfelmus', 'Apfelmus ohne Zuckerzusatz', 'konserven'),

  // --- Gewuerze & Oele (Vorrat) ---
  ing('salz', 'Salz', 'gewuerze', true),
  ing('pfeffer', 'Pfeffer', 'gewuerze', true),
  ing('paprikapulver', 'Paprikapulver edelsüß', 'gewuerze', true),
  ing('oregano', 'Oregano', 'gewuerze', true),
  ing('thymian', 'Thymian', 'gewuerze', true),
  ing('rosmarin', 'Rosmarin', 'gewuerze', true),
  ing('italienische-kraeuter', 'Italienische Kräuter', 'gewuerze', true),
  ing('kreuzkuemmel', 'Kreuzkümmel gemahlen', 'gewuerze', true),
  ing('currypulver', 'Currypulver mild', 'gewuerze', true),
  ing('kurkuma', 'Kurkuma', 'gewuerze', true),
  ing('zimt', 'Zimt', 'gewuerze', true),
  ing('muskat', 'Muskatnuss', 'gewuerze', true),
  ing('vanille', 'Gemahlene Vanille', 'gewuerze', true),
  ing('lorbeerblatt', 'Lorbeerblatt', 'gewuerze', true),
  ing('gemuesebruehe', 'Gemüsebrühe (Pulver)', 'gewuerze', true),
  ing('huehnerbruehe', 'Hühnerbrühe (Pulver)', 'gewuerze', true),
  // Bruehpulver enthaelt sehr oft Weizen – fuer glutenfreie Rezepte deshalb
  // ein eigener Eintrag, damit die Einkaufsliste die richtige Packung nennt.
  ing('gemuesebruehe-glutenfrei', 'Gemüsebrühe (glutenfrei)', 'gewuerze', true),
  ing('huehnerbruehe-glutenfrei', 'Hühnerbrühe (glutenfrei)', 'gewuerze', true),
  ing('olivenoel', 'Olivenöl', 'gewuerze', true),
  ing('rapsoel', 'Rapsöl', 'gewuerze', true),
  ing('senf', 'Senf (ohne Zuckerzusatz)', 'gewuerze', true),
  ing('backpulver', 'Backpulver', 'gewuerze', true),

  // --- Tiefkuehl ---
  ing('erbsen-tk', 'Erbsen (TK)', 'tiefkuehl'),
  ing('erbsen-moehren-tk', 'Erbsen & Möhren (TK)', 'tiefkuehl'),
  ing('spinat-tk', 'Blattspinat (TK)', 'tiefkuehl'),
  ing('beeren-tk', 'Beerenmischung (TK)', 'tiefkuehl'),

  // --- Sonstiges ---
  ing('wasser', 'Wasser', 'sonstiges', true),
  ing('mandeln', 'Gemahlene Mandeln', 'sonstiges'),
  ing('sonnenblumenkerne', 'Sonnenblumenkerne', 'sonstiges'),
  ing('cashewkerne', 'Cashewkerne', 'sonstiges'),
];

export const INGREDIENT_BY_ID: Record<string, Ingredient> = Object.fromEntries(
  INGREDIENTS.map((i) => [i.id, i]),
);

export const SHOP_CATEGORY_LABEL: Record<ShopCategory, string> = {
  'obst-gemuese': '🥦 Obst & Gemüse',
  fleisch: '🥩 Fleisch',
  milchprodukte: '🥛 Milchprodukte',
  eier: '🥚 Eier',
  getreide: '🍚 Reis, Nudeln & Getreide',
  konserven: '🥫 Konserven',
  gewuerze: '🧂 Gewürze',
  tiefkuehl: '❄️ Tiefkühlprodukte',
  sonstiges: '📦 Sonstiges',
};

export const SHOP_CATEGORY_ORDER: ShopCategory[] = [
  'obst-gemuese',
  'fleisch',
  'milchprodukte',
  'eier',
  'getreide',
  'konserven',
  'tiefkuehl',
  'gewuerze',
  'sonstiges',
];

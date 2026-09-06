-- ============================================================================
-- Essens App – Grunddaten (Zutaten und Rezepte)
--
-- AUTOMATISCH ERZEUGT von scripts/generate-seed.ts – nicht von Hand ändern.
-- Neu erzeugen mit:  npm run seed
--
-- Anwenden: Supabase -> SQL Editor -> einfügen -> Run (nach schema.sql).
-- Mehrfaches Ausführen ist unschädlich (vorhandene Einträge werden aktualisiert).
-- ============================================================================

begin;

-- ------------------------------------------------------------- Zutaten
insert into ingredients (id, name, category, pantry) values ('zwiebel', 'Zwiebel', 'obst-gemuese', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('rote-zwiebel', 'Rote Zwiebel', 'obst-gemuese', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('fruehlingszwiebel', 'Frühlingszwiebel', 'obst-gemuese', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('knoblauch', 'Knoblauchzehe', 'obst-gemuese', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('moehre', 'Möhre', 'obst-gemuese', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('paprika', 'Paprika', 'obst-gemuese', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('brokkoli', 'Brokkoli', 'obst-gemuese', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('blumenkohl', 'Blumenkohl', 'obst-gemuese', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('zucchini', 'Zucchini', 'obst-gemuese', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('tomate', 'Tomate', 'obst-gemuese', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('kirschtomaten', 'Kirschtomaten', 'obst-gemuese', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('kartoffel', 'Kartoffeln (festkochend)', 'obst-gemuese', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('suesskartoffel', 'Süßkartoffel', 'obst-gemuese', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('lauch', 'Lauch', 'obst-gemuese', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('champignon', 'Champignons', 'obst-gemuese', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('babyspinat', 'Babyspinat', 'obst-gemuese', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('salatgurke', 'Salatgurke', 'obst-gemuese', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('kopfsalat', 'Kopfsalat', 'obst-gemuese', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('apfel', 'Apfel', 'obst-gemuese', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('banane', 'Banane', 'obst-gemuese', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('zitrone', 'Zitrone', 'obst-gemuese', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('petersilie', 'Petersilie', 'obst-gemuese', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('schnittlauch', 'Schnittlauch', 'obst-gemuese', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('basilikum', 'Basilikum', 'obst-gemuese', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('ingwer', 'Ingwer', 'obst-gemuese', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('kuerbis', 'Hokkaido-Kürbis', 'obst-gemuese', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('haehnchenbrust', 'Hähnchenbrustfilet', 'fleisch', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('haehnchenkeule', 'Hähnchenkeulen', 'fleisch', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('rinderhack', 'Rinderhackfleisch', 'fleisch', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('gemischtes-hack', 'Gemischtes Hackfleisch', 'fleisch', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('kochschinken', 'Kochschinken', 'fleisch', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('milch', 'Milch', 'milchprodukte', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('sahne', 'Schlagsahne', 'milchprodukte', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('kochsahne', 'Kochsahne', 'milchprodukte', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('frischkaese', 'Frischkäse natur', 'milchprodukte', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('creme-fraiche', 'Crème fraîche', 'milchprodukte', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('schmand', 'Schmand', 'milchprodukte', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('joghurt', 'Naturjoghurt', 'milchprodukte', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('griechischer-joghurt', 'Griechischer Joghurt', 'milchprodukte', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('quark', 'Magerquark', 'milchprodukte', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('butter', 'Butter', 'milchprodukte', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('gouda-gerieben', 'Geriebener Gouda', 'milchprodukte', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('mozzarella', 'Mozzarella', 'milchprodukte', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('parmesan', 'Parmesan', 'milchprodukte', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('feta', 'Feta', 'milchprodukte', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('ei', 'Eier', 'eier', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('nudeln', 'Nudeln', 'getreide', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('vollkornnudeln', 'Vollkornnudeln', 'getreide', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('spaghetti', 'Spaghetti', 'getreide', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('reis', 'Reis', 'getreide', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('basmatireis', 'Basmatireis', 'getreide', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('milchreis', 'Milchreis', 'getreide', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('couscous', 'Couscous', 'getreide', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('quinoa', 'Quinoa', 'getreide', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('rote-linsen', 'Rote Linsen', 'getreide', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('haferflocken', 'Haferflocken', 'getreide', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('mehl', 'Weizenmehl', 'getreide', true) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('vollkornmehl', 'Vollkornmehl', 'getreide', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('gnocchi', 'Gnocchi (Kühlregal)', 'getreide', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('wraps', 'Weizen-Wraps', 'getreide', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('vollkornbrot', 'Vollkornbrot', 'getreide', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('semmelbroesel', 'Semmelbrösel', 'getreide', true) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('gehackte-tomaten', 'Gehackte Tomaten', 'konserven', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('passierte-tomaten', 'Passierte Tomaten', 'konserven', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('tomatenmark', 'Tomatenmark', 'konserven', true) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('kokosmilch', 'Kokosmilch', 'konserven', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('kidneybohnen', 'Kidneybohnen', 'konserven', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('kichererbsen', 'Kichererbsen', 'konserven', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('mais', 'Mais', 'konserven', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('apfelmus', 'Apfelmus ohne Zuckerzusatz', 'konserven', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('salz', 'Salz', 'gewuerze', true) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('pfeffer', 'Pfeffer', 'gewuerze', true) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('paprikapulver', 'Paprikapulver edelsüß', 'gewuerze', true) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('oregano', 'Oregano', 'gewuerze', true) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('thymian', 'Thymian', 'gewuerze', true) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('italienische-kraeuter', 'Italienische Kräuter', 'gewuerze', true) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('kreuzkuemmel', 'Kreuzkümmel gemahlen', 'gewuerze', true) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('currypulver', 'Currypulver mild', 'gewuerze', true) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('kurkuma', 'Kurkuma', 'gewuerze', true) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('zimt', 'Zimt', 'gewuerze', true) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('muskat', 'Muskatnuss', 'gewuerze', true) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('vanille', 'Gemahlene Vanille', 'gewuerze', true) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('lorbeerblatt', 'Lorbeerblatt', 'gewuerze', true) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('gemuesebruehe', 'Gemüsebrühe (Pulver)', 'gewuerze', true) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('huehnerbruehe', 'Hühnerbrühe (Pulver)', 'gewuerze', true) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('olivenoel', 'Olivenöl', 'gewuerze', true) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('rapsoel', 'Rapsöl', 'gewuerze', true) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('senf', 'Senf (ohne Zuckerzusatz)', 'gewuerze', true) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('backpulver', 'Backpulver', 'gewuerze', true) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('erbsen-tk', 'Erbsen (TK)', 'tiefkuehl', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('erbsen-moehren-tk', 'Erbsen & Möhren (TK)', 'tiefkuehl', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('spinat-tk', 'Blattspinat (TK)', 'tiefkuehl', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('beeren-tk', 'Beerenmischung (TK)', 'tiefkuehl', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('wasser', 'Wasser', 'sonstiges', true) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('mandeln', 'Gemahlene Mandeln', 'sonstiges', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('sonnenblumenkerne', 'Sonnenblumenkerne', 'sonstiges', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;
insert into ingredients (id, name, category, pantry) values ('cashewkerne', 'Cashewkerne', 'sonstiges', false) on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;

-- ------------------------------------------------------------- Rezepte

-- One-Pot Nudeln Bolognese
insert into recipes (id, name, description, placeholder_emoji, placeholder_tone, base_servings,
  time_minutes, difficulty, steps, kcal, protein, carbs, fat, categories,
  no_added_sugar, kid_friendly, one_pot, tips, household_id) values (
  'one-pot-bolognese-nudeln', 'One-Pot Nudeln Bolognese', 'Alles wandert in einen Topf: Hackfleisch, Tomaten, Gemüse und Nudeln kochen zusammen. Nach 25 Minuten steht das Lieblingsessen auf dem Tisch – ganz ohne Zuckerzusatz.',
  '🍝', 'tomato', 4,
  25, 'einfach', '["Öl in einem großen Topf erhitzen. Hackfleisch darin krümelig anbraten, bis es Farbe bekommt.","Zwiebel, Knoblauch und geraspelte Möhren zugeben und 3 Minuten mitbraten.","Tomatenmark einrühren und kurz mitrösten – das gibt die natürliche Süße statt Zucker.","Gehackte Tomaten, Wasser, Brühe und Oregano zugeben und aufkochen.","Nudeln einrühren und bei mittlerer Hitze 10–12 Minuten offen köcheln lassen, dabei mehrfach umrühren.","Mit Salz und Pfeffer abschmecken, Parmesan darüberstreuen und servieren."]'::jsonb,
  620, 35, 66, 21,
  array['one-pot', 'hackfleisch', 'pasta', 'kinderliebling', 'unter-30', 'proteinreich']::text[],
  true, true, true, 'Die geraspelte Möhre schmeckt man nicht heraus, macht die Sauce aber mild und leicht süßlich.', null)
on conflict (id) do update set
  name = excluded.name, description = excluded.description, steps = excluded.steps,
  time_minutes = excluded.time_minutes, difficulty = excluded.difficulty,
  kcal = excluded.kcal, protein = excluded.protein, carbs = excluded.carbs, fat = excluded.fat,
  categories = excluded.categories, one_pot = excluded.one_pot, tips = excluded.tips;
delete from recipe_ingredients where recipe_id = 'one-pot-bolognese-nudeln';
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-bolognese-nudeln', 'rinderhack', 400, 'g', null, false, 0);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-bolognese-nudeln', 'zwiebel', 1, 'Stk', 'fein gewürfelt', false, 1);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-bolognese-nudeln', 'knoblauch', 2, 'Zehe', null, false, 2);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-bolognese-nudeln', 'moehre', 2, 'Stk', 'fein geraspelt', false, 3);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-bolognese-nudeln', 'tomatenmark', 2, 'EL', null, false, 4);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-bolognese-nudeln', 'gehackte-tomaten', 400, 'g', null, false, 5);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-bolognese-nudeln', 'nudeln', 300, 'g', null, false, 6);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-bolognese-nudeln', 'wasser', 600, 'ml', null, false, 7);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-bolognese-nudeln', 'olivenoel', 2, 'EL', null, false, 8);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-bolognese-nudeln', 'oregano', 1, 'TL', null, false, 9);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-bolognese-nudeln', 'gemuesebruehe', 1, 'TL', null, false, 10);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-bolognese-nudeln', 'parmesan', 40, 'g', 'gerieben', false, 11);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-bolognese-nudeln', 'salz', 1, 'TL', null, false, 12);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-bolognese-nudeln', 'pfeffer', 1, 'Prise', null, false, 13);

-- One-Pot Hähnchen-Reis mit Paprika & Erbsen
insert into recipes (id, name, description, placeholder_emoji, placeholder_tone, base_servings,
  time_minutes, difficulty, steps, kcal, protein, carbs, fat, categories,
  no_added_sugar, kid_friendly, one_pot, tips, household_id) values (
  'one-pot-haehnchen-reis-paprika', 'One-Pot Hähnchen-Reis mit Paprika & Erbsen', 'Saftige Hähnchenstreifen, bunte Paprika und Erbsen garen zusammen mit dem Reis. Ein mildes Gericht, das Kinder fast immer mögen.',
  '🍚', 'sun', 4,
  30, 'einfach', '["Öl in einem weiten Topf erhitzen und die Hähnchenstreifen rundherum anbraten.","Zwiebel und Knoblauch zugeben, 2 Minuten mitbraten, dann Paprika unterrühren.","Paprikapulver zugeben und kurz mitrösten.","Reis einrühren, Wasser und Brühe angießen und aufkochen.","Zugedeckt bei kleiner Hitze 15 Minuten garen.","Erbsen unterheben, 3 Minuten ziehen lassen und abschmecken."]'::jsonb,
  590, 42, 72, 12,
  array['one-pot', 'haehnchen', 'reis', 'kinderliebling', 'unter-30', 'proteinreich']::text[],
  true, true, true, null, null)
on conflict (id) do update set
  name = excluded.name, description = excluded.description, steps = excluded.steps,
  time_minutes = excluded.time_minutes, difficulty = excluded.difficulty,
  kcal = excluded.kcal, protein = excluded.protein, carbs = excluded.carbs, fat = excluded.fat,
  categories = excluded.categories, one_pot = excluded.one_pot, tips = excluded.tips;
delete from recipe_ingredients where recipe_id = 'one-pot-haehnchen-reis-paprika';
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-haehnchen-reis-paprika', 'haehnchenbrust', 500, 'g', 'in Streifen', false, 0);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-haehnchen-reis-paprika', 'reis', 300, 'g', null, false, 1);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-haehnchen-reis-paprika', 'paprika', 2, 'Stk', 'gewürfelt', false, 2);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-haehnchen-reis-paprika', 'erbsen-tk', 200, 'g', null, false, 3);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-haehnchen-reis-paprika', 'zwiebel', 1, 'Stk', null, false, 4);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-haehnchen-reis-paprika', 'knoblauch', 2, 'Zehe', null, false, 5);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-haehnchen-reis-paprika', 'wasser', 700, 'ml', null, false, 6);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-haehnchen-reis-paprika', 'huehnerbruehe', 2, 'TL', null, false, 7);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-haehnchen-reis-paprika', 'paprikapulver', 2, 'TL', null, false, 8);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-haehnchen-reis-paprika', 'olivenoel', 2, 'EL', null, false, 9);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-haehnchen-reis-paprika', 'salz', 1, 'TL', null, false, 10);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-haehnchen-reis-paprika', 'pfeffer', 1, 'Prise', null, false, 11);

-- One-Pot Gemüsenudeln mit Frischkäse
insert into recipes (id, name, description, placeholder_emoji, placeholder_tone, base_servings,
  time_minutes, difficulty, steps, kcal, protein, carbs, fat, categories,
  no_added_sugar, kid_friendly, one_pot, tips, household_id) values (
  'one-pot-gemuesenudeln-frischkaese', 'One-Pot Gemüsenudeln mit Frischkäse', 'Cremige Nudeln mit viel Gemüse, gebunden nur mit Frischkäse. Vegetarisch, schnell und bei Kindern beliebt.',
  '🥦', 'green', 4,
  20, 'einfach', '["Zwiebel im Öl glasig dünsten.","Möhren, Zucchini, Nudeln, Wasser und Brühe zugeben und aufkochen.","Offen 10 Minuten köcheln lassen, gelegentlich umrühren.","Erbsen zugeben und 2 Minuten mitgaren.","Topf vom Herd nehmen, Frischkäse und Parmesan einrühren, abschmecken."]'::jsonb,
  520, 20, 72, 16,
  array['one-pot', 'vegetarisch', 'pasta', 'kinderliebling', 'unter-20']::text[],
  true, true, true, null, null)
on conflict (id) do update set
  name = excluded.name, description = excluded.description, steps = excluded.steps,
  time_minutes = excluded.time_minutes, difficulty = excluded.difficulty,
  kcal = excluded.kcal, protein = excluded.protein, carbs = excluded.carbs, fat = excluded.fat,
  categories = excluded.categories, one_pot = excluded.one_pot, tips = excluded.tips;
delete from recipe_ingredients where recipe_id = 'one-pot-gemuesenudeln-frischkaese';
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-gemuesenudeln-frischkaese', 'nudeln', 350, 'g', null, false, 0);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-gemuesenudeln-frischkaese', 'zucchini', 1, 'Stk', 'gewürfelt', false, 1);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-gemuesenudeln-frischkaese', 'moehre', 2, 'Stk', 'in Scheiben', false, 2);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-gemuesenudeln-frischkaese', 'erbsen-tk', 150, 'g', null, false, 3);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-gemuesenudeln-frischkaese', 'frischkaese', 200, 'g', null, false, 4);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-gemuesenudeln-frischkaese', 'wasser', 800, 'ml', null, false, 5);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-gemuesenudeln-frischkaese', 'gemuesebruehe', 2, 'TL', null, false, 6);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-gemuesenudeln-frischkaese', 'zwiebel', 1, 'Stk', null, false, 7);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-gemuesenudeln-frischkaese', 'olivenoel', 1, 'EL', null, false, 8);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-gemuesenudeln-frischkaese', 'parmesan', 30, 'g', null, false, 9);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-gemuesenudeln-frischkaese', 'salz', 1, 'TL', null, false, 10);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-gemuesenudeln-frischkaese', 'pfeffer', 1, 'Prise', null, false, 11);

-- One-Pot Kartoffelgulasch mit Hackfleisch
insert into recipes (id, name, description, placeholder_emoji, placeholder_tone, base_servings,
  time_minutes, difficulty, steps, kcal, protein, carbs, fat, categories,
  no_added_sugar, kid_friendly, one_pot, tips, household_id) values (
  'one-pot-kartoffelgulasch', 'One-Pot Kartoffelgulasch mit Hackfleisch', 'Herzhafter Eintopf mit Kartoffeln, Paprika und Hackfleisch. Schmeckt aufgewärmt am nächsten Tag noch besser.',
  '🥘', 'tomato', 4,
  35, 'einfach', '["Hackfleisch im Öl kräftig anbraten.","Zwiebeln und Knoblauch zugeben und glasig dünsten.","Paprikapulver einrühren, Kartoffeln und Paprika zugeben.","Passierte Tomaten, Wasser, Brühe und Lorbeerblatt angießen.","Zugedeckt 20–25 Minuten köcheln, bis die Kartoffeln weich sind.","Lorbeerblatt entfernen und kräftig abschmecken."]'::jsonb,
  540, 30, 52, 22,
  array['one-pot', 'hackfleisch', 'kartoffeln', 'suppe-eintopf', 'kinderliebling']::text[],
  true, true, true, null, null)
on conflict (id) do update set
  name = excluded.name, description = excluded.description, steps = excluded.steps,
  time_minutes = excluded.time_minutes, difficulty = excluded.difficulty,
  kcal = excluded.kcal, protein = excluded.protein, carbs = excluded.carbs, fat = excluded.fat,
  categories = excluded.categories, one_pot = excluded.one_pot, tips = excluded.tips;
delete from recipe_ingredients where recipe_id = 'one-pot-kartoffelgulasch';
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-kartoffelgulasch', 'gemischtes-hack', 400, 'g', null, false, 0);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-kartoffelgulasch', 'kartoffel', 800, 'g', 'gewürfelt', false, 1);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-kartoffelgulasch', 'paprika', 2, 'Stk', null, false, 2);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-kartoffelgulasch', 'zwiebel', 2, 'Stk', null, false, 3);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-kartoffelgulasch', 'knoblauch', 2, 'Zehe', null, false, 4);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-kartoffelgulasch', 'passierte-tomaten', 400, 'g', null, false, 5);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-kartoffelgulasch', 'wasser', 400, 'ml', null, false, 6);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-kartoffelgulasch', 'paprikapulver', 2, 'TL', null, false, 7);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-kartoffelgulasch', 'gemuesebruehe', 2, 'TL', null, false, 8);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-kartoffelgulasch', 'rapsoel', 2, 'EL', null, false, 9);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-kartoffelgulasch', 'lorbeerblatt', 1, 'Stk', null, false, 10);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-kartoffelgulasch', 'salz', 1, 'TL', null, false, 11);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-kartoffelgulasch', 'pfeffer', 1, 'Prise', null, false, 12);

-- One-Pot Linsen-Kokos-Curry
insert into recipes (id, name, description, placeholder_emoji, placeholder_tone, base_servings,
  time_minutes, difficulty, steps, kcal, protein, carbs, fat, categories,
  no_added_sugar, kid_friendly, one_pot, tips, household_id) values (
  'one-pot-linsen-kokos-curry', 'One-Pot Linsen-Kokos-Curry', 'Milde rote Linsen in Kokosmilch mit Möhren und Kartoffeln. Vegetarisch, sättigend und sehr proteinreich.',
  '🍛', 'sun', 4,
  30, 'einfach', '["Zwiebel, Knoblauch und Ingwer im Öl andünsten.","Curry und Kurkuma zugeben und 30 Sekunden mitrösten.","Möhren und Kartoffeln würfeln, zugeben und kurz mitbraten.","Linsen, Kokosmilch, Wasser und Brühe zugeben, aufkochen.","Bei kleiner Hitze 18–20 Minuten köcheln, bis alles weich ist.","Mit Salz abschmecken. Für Kinder etwas Joghurt untermischen."]'::jsonb,
  610, 25, 68, 25,
  array['one-pot', 'vegetarisch', 'suppe-eintopf', 'unter-30', 'proteinreich']::text[],
  true, true, true, null, null)
on conflict (id) do update set
  name = excluded.name, description = excluded.description, steps = excluded.steps,
  time_minutes = excluded.time_minutes, difficulty = excluded.difficulty,
  kcal = excluded.kcal, protein = excluded.protein, carbs = excluded.carbs, fat = excluded.fat,
  categories = excluded.categories, one_pot = excluded.one_pot, tips = excluded.tips;
delete from recipe_ingredients where recipe_id = 'one-pot-linsen-kokos-curry';
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-linsen-kokos-curry', 'rote-linsen', 300, 'g', null, false, 0);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-linsen-kokos-curry', 'kokosmilch', 400, 'ml', null, false, 1);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-linsen-kokos-curry', 'moehre', 3, 'Stk', null, false, 2);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-linsen-kokos-curry', 'kartoffel', 400, 'g', null, false, 3);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-linsen-kokos-curry', 'zwiebel', 1, 'Stk', null, false, 4);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-linsen-kokos-curry', 'knoblauch', 2, 'Zehe', null, false, 5);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-linsen-kokos-curry', 'ingwer', 15, 'g', null, false, 6);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-linsen-kokos-curry', 'currypulver', 2, 'TL', null, false, 7);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-linsen-kokos-curry', 'kurkuma', 1, 'TL', null, false, 8);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-linsen-kokos-curry', 'wasser', 600, 'ml', null, false, 9);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-linsen-kokos-curry', 'gemuesebruehe', 2, 'TL', null, false, 10);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-linsen-kokos-curry', 'rapsoel', 2, 'EL', null, false, 11);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-linsen-kokos-curry', 'salz', 1, 'TL', null, false, 12);

-- One-Pot Hähnchen-Gnocchi in Rahmsauce
insert into recipes (id, name, description, placeholder_emoji, placeholder_tone, base_servings,
  time_minutes, difficulty, steps, kcal, protein, carbs, fat, categories,
  no_added_sugar, kid_friendly, one_pot, tips, household_id) values (
  'one-pot-haehnchen-gnocchi', 'One-Pot Hähnchen-Gnocchi in Rahmsauce', 'Gnocchi, Hähnchen und Babyspinat in einer cremigen Sauce – in einer Pfanne, in 20 Minuten.',
  '🥔', 'cream', 4,
  20, 'einfach', '["Hähnchenwürfel im Öl in einer großen Pfanne goldbraun braten und salzen.","Knoblauch und halbierte Kirschtomaten zugeben, 2 Minuten braten.","Gnocchi, Sahne, Wasser und Brühe zugeben und 6–8 Minuten köcheln.","Spinat unterheben, bis er zusammenfällt.","Parmesan einrühren und abschmecken."]'::jsonb,
  640, 38, 68, 22,
  array['one-pot', 'haehnchen', 'kartoffeln', 'unter-20', 'proteinreich', 'kinderliebling']::text[],
  true, true, true, null, null)
on conflict (id) do update set
  name = excluded.name, description = excluded.description, steps = excluded.steps,
  time_minutes = excluded.time_minutes, difficulty = excluded.difficulty,
  kcal = excluded.kcal, protein = excluded.protein, carbs = excluded.carbs, fat = excluded.fat,
  categories = excluded.categories, one_pot = excluded.one_pot, tips = excluded.tips;
delete from recipe_ingredients where recipe_id = 'one-pot-haehnchen-gnocchi';
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-haehnchen-gnocchi', 'gnocchi', 800, 'g', null, false, 0);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-haehnchen-gnocchi', 'haehnchenbrust', 400, 'g', 'gewürfelt', false, 1);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-haehnchen-gnocchi', 'babyspinat', 100, 'g', null, false, 2);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-haehnchen-gnocchi', 'kirschtomaten', 200, 'g', null, false, 3);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-haehnchen-gnocchi', 'kochsahne', 200, 'ml', null, false, 4);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-haehnchen-gnocchi', 'wasser', 150, 'ml', null, false, 5);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-haehnchen-gnocchi', 'knoblauch', 2, 'Zehe', null, false, 6);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-haehnchen-gnocchi', 'huehnerbruehe', 1, 'TL', null, false, 7);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-haehnchen-gnocchi', 'olivenoel', 2, 'EL', null, false, 8);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-haehnchen-gnocchi', 'parmesan', 40, 'g', null, false, 9);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-haehnchen-gnocchi', 'salz', 1, 'TL', null, false, 10);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-haehnchen-gnocchi', 'pfeffer', 1, 'Prise', null, false, 11);

-- One-Pot Reispfanne mit Kichererbsen & Spinat
insert into recipes (id, name, description, placeholder_emoji, placeholder_tone, base_servings,
  time_minutes, difficulty, steps, kcal, protein, carbs, fat, categories,
  no_added_sugar, kid_friendly, one_pot, tips, household_id) values (
  'one-pot-reis-kichererbsen-spinat', 'One-Pot Reispfanne mit Kichererbsen & Spinat', 'Vegetarische Reispfanne mit Kichererbsen, Spinat und milden Gewürzen. Ein günstiges Alltagsgericht.',
  '🌱', 'green', 4,
  30, 'einfach', '["Zwiebel, Knoblauch und Paprika im Öl andünsten.","Gewürze zugeben und kurz mitrösten.","Reis, Kichererbsen, Wasser und Brühe zugeben und aufkochen.","Zugedeckt 15 Minuten bei kleiner Hitze garen.","Spinat unterheben und weitere 5 Minuten ziehen lassen.","Feta darüberbröseln und servieren."]'::jsonb,
  560, 22, 78, 16,
  array['one-pot', 'vegetarisch', 'reis', 'unter-30']::text[],
  true, true, true, null, null)
on conflict (id) do update set
  name = excluded.name, description = excluded.description, steps = excluded.steps,
  time_minutes = excluded.time_minutes, difficulty = excluded.difficulty,
  kcal = excluded.kcal, protein = excluded.protein, carbs = excluded.carbs, fat = excluded.fat,
  categories = excluded.categories, one_pot = excluded.one_pot, tips = excluded.tips;
delete from recipe_ingredients where recipe_id = 'one-pot-reis-kichererbsen-spinat';
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-reis-kichererbsen-spinat', 'reis', 300, 'g', null, false, 0);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-reis-kichererbsen-spinat', 'kichererbsen', 400, 'g', 'abgetropft', false, 1);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-reis-kichererbsen-spinat', 'spinat-tk', 300, 'g', null, false, 2);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-reis-kichererbsen-spinat', 'zwiebel', 1, 'Stk', null, false, 3);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-reis-kichererbsen-spinat', 'knoblauch', 2, 'Zehe', null, false, 4);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-reis-kichererbsen-spinat', 'paprika', 1, 'Stk', null, false, 5);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-reis-kichererbsen-spinat', 'wasser', 700, 'ml', null, false, 6);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-reis-kichererbsen-spinat', 'gemuesebruehe', 2, 'TL', null, false, 7);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-reis-kichererbsen-spinat', 'kreuzkuemmel', 1, 'TL', null, false, 8);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-reis-kichererbsen-spinat', 'paprikapulver', 1, 'TL', null, false, 9);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-reis-kichererbsen-spinat', 'olivenoel', 2, 'EL', null, false, 10);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-reis-kichererbsen-spinat', 'feta', 100, 'g', null, false, 11);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-reis-kichererbsen-spinat', 'salz', 1, 'TL', null, false, 12);

-- One-Pot Cremige Brokkoli-Nudeln
insert into recipes (id, name, description, placeholder_emoji, placeholder_tone, base_servings,
  time_minutes, difficulty, steps, kcal, protein, carbs, fat, categories,
  no_added_sugar, kid_friendly, one_pot, tips, household_id) values (
  'one-pot-brokkoli-nudeln', 'One-Pot Cremige Brokkoli-Nudeln', 'Nudeln und Brokkoli kochen gemeinsam, am Ende wird alles mit Frischkäse und Parmesan cremig gerührt. In 18 Minuten fertig.',
  '🥦', 'green', 4,
  18, 'einfach', '["Knoblauch im Öl kurz andünsten.","Nudeln, Wasser und Brühe zugeben und aufkochen.","Nach 5 Minuten den Brokkoli zugeben und weitere 5 Minuten offen köcheln.","Topf vom Herd ziehen, Frischkäse und Parmesan einrühren.","Mit Muskat, Salz und Pfeffer abschmecken."]'::jsonb,
  500, 23, 68, 15,
  array['one-pot', 'vegetarisch', 'pasta', 'unter-20', 'kinderliebling']::text[],
  true, true, true, null, null)
on conflict (id) do update set
  name = excluded.name, description = excluded.description, steps = excluded.steps,
  time_minutes = excluded.time_minutes, difficulty = excluded.difficulty,
  kcal = excluded.kcal, protein = excluded.protein, carbs = excluded.carbs, fat = excluded.fat,
  categories = excluded.categories, one_pot = excluded.one_pot, tips = excluded.tips;
delete from recipe_ingredients where recipe_id = 'one-pot-brokkoli-nudeln';
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-brokkoli-nudeln', 'nudeln', 350, 'g', null, false, 0);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-brokkoli-nudeln', 'brokkoli', 500, 'g', 'in Röschen', false, 1);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-brokkoli-nudeln', 'frischkaese', 150, 'g', null, false, 2);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-brokkoli-nudeln', 'parmesan', 50, 'g', null, false, 3);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-brokkoli-nudeln', 'knoblauch', 2, 'Zehe', null, false, 4);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-brokkoli-nudeln', 'wasser', 800, 'ml', null, false, 5);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-brokkoli-nudeln', 'gemuesebruehe', 2, 'TL', null, false, 6);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-brokkoli-nudeln', 'olivenoel', 2, 'EL', null, false, 7);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-brokkoli-nudeln', 'muskat', 1, 'Prise', null, false, 8);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-brokkoli-nudeln', 'salz', 1, 'TL', null, false, 9);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-brokkoli-nudeln', 'pfeffer', 1, 'Prise', null, false, 10);

-- One-Pot Hack-Reis-Pfanne mit Käse
insert into recipes (id, name, description, placeholder_emoji, placeholder_tone, base_servings,
  time_minutes, difficulty, steps, kcal, protein, carbs, fat, categories,
  no_added_sugar, kid_friendly, one_pot, tips, household_id) values (
  'one-pot-hack-reis-kaese', 'One-Pot Hack-Reis-Pfanne mit Käse', 'Der Klassiker im Burger-Stil: Hackfleisch, Reis, Tomaten und geschmolzener Käse – ganz ohne Ketchup und Zuckerzusatz.',
  '🧀', 'sun', 4,
  30, 'einfach', '["Hackfleisch im Öl krümelig braten, Zwiebel und Knoblauch mitdünsten.","Senf und Paprikapulver einrühren.","Reis, Tomaten, Wasser und Brühe zugeben und aufkochen.","Zugedeckt 15 Minuten garen, gelegentlich umrühren.","Mais unterheben, Käse darüberstreuen und zugedeckt 3 Minuten schmelzen lassen."]'::jsonb,
  680, 40, 62, 28,
  array['one-pot', 'hackfleisch', 'reis', 'kinderliebling', 'unter-30', 'proteinreich']::text[],
  true, true, true, null, null)
on conflict (id) do update set
  name = excluded.name, description = excluded.description, steps = excluded.steps,
  time_minutes = excluded.time_minutes, difficulty = excluded.difficulty,
  kcal = excluded.kcal, protein = excluded.protein, carbs = excluded.carbs, fat = excluded.fat,
  categories = excluded.categories, one_pot = excluded.one_pot, tips = excluded.tips;
delete from recipe_ingredients where recipe_id = 'one-pot-hack-reis-kaese';
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-hack-reis-kaese', 'rinderhack', 400, 'g', null, false, 0);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-hack-reis-kaese', 'reis', 250, 'g', null, false, 1);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-hack-reis-kaese', 'gehackte-tomaten', 400, 'g', null, false, 2);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-hack-reis-kaese', 'mais', 150, 'g', 'abgetropft', false, 3);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-hack-reis-kaese', 'zwiebel', 1, 'Stk', null, false, 4);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-hack-reis-kaese', 'knoblauch', 1, 'Zehe', null, false, 5);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-hack-reis-kaese', 'gouda-gerieben', 150, 'g', null, false, 6);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-hack-reis-kaese', 'senf', 1, 'TL', null, false, 7);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-hack-reis-kaese', 'paprikapulver', 2, 'TL', null, false, 8);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-hack-reis-kaese', 'wasser', 500, 'ml', null, false, 9);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-hack-reis-kaese', 'gemuesebruehe', 2, 'TL', null, false, 10);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-hack-reis-kaese', 'rapsoel', 1, 'EL', null, false, 11);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-hack-reis-kaese', 'salz', 1, 'TL', null, false, 12);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-hack-reis-kaese', 'pfeffer', 1, 'Prise', null, false, 13);

-- One-Pot Süßkartoffel-Hähnchen-Eintopf
insert into recipes (id, name, description, placeholder_emoji, placeholder_tone, base_servings,
  time_minutes, difficulty, steps, kcal, protein, carbs, fat, categories,
  no_added_sugar, kid_friendly, one_pot, tips, household_id) values (
  'one-pot-suesskartoffel-haehnchen', 'One-Pot Süßkartoffel-Hähnchen-Eintopf', 'Süßkartoffeln bringen natürliche Süße, Hähnchen viel Eiweiß. Ein wärmender Eintopf für kühle Tage.',
  '🍲', 'sun', 4,
  35, 'einfach', '["Hähnchen im Öl anbraten und herausnehmen.","Zwiebel, Knoblauch, gewürfelte Möhren und Süßkartoffeln 5 Minuten andünsten.","Gewürze zugeben, Tomaten, Wasser und Brühe angießen.","Hähnchen zurück in den Topf geben und 20 Minuten köcheln lassen.","Abschmecken und servieren."]'::jsonb,
  520, 40, 55, 13,
  array['one-pot', 'haehnchen', 'suppe-eintopf', 'proteinreich']::text[],
  true, true, true, null, null)
on conflict (id) do update set
  name = excluded.name, description = excluded.description, steps = excluded.steps,
  time_minutes = excluded.time_minutes, difficulty = excluded.difficulty,
  kcal = excluded.kcal, protein = excluded.protein, carbs = excluded.carbs, fat = excluded.fat,
  categories = excluded.categories, one_pot = excluded.one_pot, tips = excluded.tips;
delete from recipe_ingredients where recipe_id = 'one-pot-suesskartoffel-haehnchen';
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-suesskartoffel-haehnchen', 'haehnchenbrust', 500, 'g', 'gewürfelt', false, 0);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-suesskartoffel-haehnchen', 'suesskartoffel', 700, 'g', null, false, 1);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-suesskartoffel-haehnchen', 'moehre', 2, 'Stk', null, false, 2);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-suesskartoffel-haehnchen', 'zwiebel', 1, 'Stk', null, false, 3);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-suesskartoffel-haehnchen', 'knoblauch', 2, 'Zehe', null, false, 4);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-suesskartoffel-haehnchen', 'gehackte-tomaten', 400, 'g', null, false, 5);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-suesskartoffel-haehnchen', 'wasser', 500, 'ml', null, false, 6);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-suesskartoffel-haehnchen', 'huehnerbruehe', 2, 'TL', null, false, 7);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-suesskartoffel-haehnchen', 'paprikapulver', 2, 'TL', null, false, 8);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-suesskartoffel-haehnchen', 'thymian', 1, 'TL', null, false, 9);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-suesskartoffel-haehnchen', 'olivenoel', 2, 'EL', null, false, 10);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-suesskartoffel-haehnchen', 'salz', 1, 'TL', null, false, 11);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-suesskartoffel-haehnchen', 'pfeffer', 1, 'Prise', null, false, 12);

-- One-Pot Tomate-Mozzarella-Nudeln
insert into recipes (id, name, description, placeholder_emoji, placeholder_tone, base_servings,
  time_minutes, difficulty, steps, kcal, protein, carbs, fat, categories,
  no_added_sugar, kid_friendly, one_pot, tips, household_id) values (
  'one-pot-tomate-mozzarella-nudeln', 'One-Pot Tomate-Mozzarella-Nudeln', 'Nudeln, Kirschtomaten und Basilikum kochen zusammen, zum Schluss schmilzt Mozzarella darüber. Fertig in 20 Minuten.',
  '🍅', 'tomato', 4,
  20, 'einfach', '["Knoblauch im Öl andünsten, halbierte Kirschtomaten zugeben.","Nudeln, passierte Tomaten, Wasser, Brühe und Oregano zugeben.","Offen 10–12 Minuten köcheln lassen, dabei rühren, bis die Nudeln gar sind.","Mozzarella zupfen, unterheben und 2 Minuten zugedeckt schmelzen lassen.","Mit Basilikum bestreuen und abschmecken."]'::jsonb,
  570, 26, 72, 20,
  array['one-pot', 'vegetarisch', 'pasta', 'unter-20', 'kinderliebling']::text[],
  true, true, true, null, null)
on conflict (id) do update set
  name = excluded.name, description = excluded.description, steps = excluded.steps,
  time_minutes = excluded.time_minutes, difficulty = excluded.difficulty,
  kcal = excluded.kcal, protein = excluded.protein, carbs = excluded.carbs, fat = excluded.fat,
  categories = excluded.categories, one_pot = excluded.one_pot, tips = excluded.tips;
delete from recipe_ingredients where recipe_id = 'one-pot-tomate-mozzarella-nudeln';
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-tomate-mozzarella-nudeln', 'nudeln', 350, 'g', null, false, 0);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-tomate-mozzarella-nudeln', 'kirschtomaten', 400, 'g', null, false, 1);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-tomate-mozzarella-nudeln', 'passierte-tomaten', 200, 'g', null, false, 2);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-tomate-mozzarella-nudeln', 'mozzarella', 250, 'g', null, false, 3);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-tomate-mozzarella-nudeln', 'knoblauch', 2, 'Zehe', null, false, 4);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-tomate-mozzarella-nudeln', 'basilikum', 1, 'Bund', null, false, 5);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-tomate-mozzarella-nudeln', 'wasser', 750, 'ml', null, false, 6);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-tomate-mozzarella-nudeln', 'gemuesebruehe', 2, 'TL', null, false, 7);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-tomate-mozzarella-nudeln', 'olivenoel', 2, 'EL', null, false, 8);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-tomate-mozzarella-nudeln', 'oregano', 1, 'TL', null, false, 9);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-tomate-mozzarella-nudeln', 'salz', 1, 'TL', null, false, 10);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-tomate-mozzarella-nudeln', 'pfeffer', 1, 'Prise', null, false, 11);

-- One-Pot Bolognese-Reis mit Zucchini
insert into recipes (id, name, description, placeholder_emoji, placeholder_tone, base_servings,
  time_minutes, difficulty, steps, kcal, protein, carbs, fat, categories,
  no_added_sugar, kid_friendly, one_pot, tips, household_id) values (
  'one-pot-bolognese-reis-zucchini', 'One-Pot Bolognese-Reis mit Zucchini', 'Die Bolognese-Idee mit Reis statt Nudeln – mit viel Gemüse und mild gewürzt.',
  '🍚', 'tomato', 4,
  30, 'einfach', '["Hackfleisch im Öl anbraten, Zwiebel und Knoblauch zugeben.","Geraspelte Möhre und gewürfelte Zucchini 3 Minuten mitbraten.","Reis, passierte Tomaten, Wasser, Brühe und Kräuter zugeben.","Zugedeckt 18 Minuten bei kleiner Hitze garen, gelegentlich umrühren.","Mit Parmesan bestreuen und abschmecken."]'::jsonb,
  600, 34, 64, 22,
  array['one-pot', 'hackfleisch', 'reis', 'unter-30', 'kinderliebling']::text[],
  true, true, true, null, null)
on conflict (id) do update set
  name = excluded.name, description = excluded.description, steps = excluded.steps,
  time_minutes = excluded.time_minutes, difficulty = excluded.difficulty,
  kcal = excluded.kcal, protein = excluded.protein, carbs = excluded.carbs, fat = excluded.fat,
  categories = excluded.categories, one_pot = excluded.one_pot, tips = excluded.tips;
delete from recipe_ingredients where recipe_id = 'one-pot-bolognese-reis-zucchini';
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-bolognese-reis-zucchini', 'gemischtes-hack', 400, 'g', null, false, 0);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-bolognese-reis-zucchini', 'reis', 250, 'g', null, false, 1);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-bolognese-reis-zucchini', 'zucchini', 1, 'Stk', null, false, 2);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-bolognese-reis-zucchini', 'moehre', 2, 'Stk', null, false, 3);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-bolognese-reis-zucchini', 'passierte-tomaten', 400, 'g', null, false, 4);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-bolognese-reis-zucchini', 'zwiebel', 1, 'Stk', null, false, 5);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-bolognese-reis-zucchini', 'knoblauch', 2, 'Zehe', null, false, 6);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-bolognese-reis-zucchini', 'wasser', 450, 'ml', null, false, 7);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-bolognese-reis-zucchini', 'gemuesebruehe', 2, 'TL', null, false, 8);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-bolognese-reis-zucchini', 'italienische-kraeuter', 2, 'TL', null, false, 9);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-bolognese-reis-zucchini', 'olivenoel', 2, 'EL', null, false, 10);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-bolognese-reis-zucchini', 'parmesan', 40, 'g', null, false, 11);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-bolognese-reis-zucchini', 'salz', 1, 'TL', null, false, 12);

-- One-Pot Kartoffel-Möhren-Topf mit Hähnchen
insert into recipes (id, name, description, placeholder_emoji, placeholder_tone, base_servings,
  time_minutes, difficulty, steps, kcal, protein, carbs, fat, categories,
  no_added_sugar, kid_friendly, one_pot, tips, household_id) values (
  'one-pot-kartoffel-moehren-haehnchen', 'One-Pot Kartoffel-Möhren-Topf mit Hähnchen', 'Ein einfacher, klarer Eintopf, wie ihn schon Oma gemacht hat – mit Kartoffeln, Möhren und zarten Hähnchenstücken.',
  '🥕', 'sun', 4,
  35, 'einfach', '["Hähnchen würfeln und im Öl anbraten.","Zwiebel und Lauchringe zugeben und andünsten.","Kartoffel- und Möhrenwürfel zugeben, mit Wasser und Brühe auffüllen.","Lorbeerblatt zugeben und 20 Minuten köcheln, bis das Gemüse weich ist.","Lorbeerblatt entfernen, mit Petersilie, Salz und Pfeffer abschmecken."]'::jsonb,
  450, 38, 48, 10,
  array['one-pot', 'haehnchen', 'kartoffeln', 'suppe-eintopf', 'proteinreich']::text[],
  true, true, true, null, null)
on conflict (id) do update set
  name = excluded.name, description = excluded.description, steps = excluded.steps,
  time_minutes = excluded.time_minutes, difficulty = excluded.difficulty,
  kcal = excluded.kcal, protein = excluded.protein, carbs = excluded.carbs, fat = excluded.fat,
  categories = excluded.categories, one_pot = excluded.one_pot, tips = excluded.tips;
delete from recipe_ingredients where recipe_id = 'one-pot-kartoffel-moehren-haehnchen';
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-kartoffel-moehren-haehnchen', 'haehnchenbrust', 450, 'g', null, false, 0);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-kartoffel-moehren-haehnchen', 'kartoffel', 700, 'g', null, false, 1);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-kartoffel-moehren-haehnchen', 'moehre', 4, 'Stk', null, false, 2);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-kartoffel-moehren-haehnchen', 'lauch', 1, 'Stk', null, false, 3);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-kartoffel-moehren-haehnchen', 'zwiebel', 1, 'Stk', null, false, 4);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-kartoffel-moehren-haehnchen', 'wasser', 900, 'ml', null, false, 5);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-kartoffel-moehren-haehnchen', 'huehnerbruehe', 3, 'TL', null, false, 6);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-kartoffel-moehren-haehnchen', 'petersilie', 0.5, 'Bund', null, false, 7);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-kartoffel-moehren-haehnchen', 'rapsoel', 2, 'EL', null, false, 8);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-kartoffel-moehren-haehnchen', 'lorbeerblatt', 1, 'Stk', null, false, 9);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-kartoffel-moehren-haehnchen', 'salz', 1, 'TL', null, false, 10);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-kartoffel-moehren-haehnchen', 'pfeffer', 1, 'Prise', null, false, 11);

-- One-Pot Nudeln mit Schinken & Erbsen
insert into recipes (id, name, description, placeholder_emoji, placeholder_tone, base_servings,
  time_minutes, difficulty, steps, kcal, protein, carbs, fat, categories,
  no_added_sugar, kid_friendly, one_pot, tips, household_id) values (
  'one-pot-schinken-erbsen-nudeln', 'One-Pot Nudeln mit Schinken & Erbsen', 'Das schnelle Rettungsessen für stressige Tage: Nudeln, Kochschinken und Erbsen in cremiger Sauce.',
  '🍜', 'cream', 4,
  18, 'einfach', '["Zwiebel im Öl andünsten, Schinkenwürfel kurz mitbraten.","Nudeln, Wasser und Brühe zugeben und offen 9 Minuten köcheln.","Erbsen zugeben und 2 Minuten mitgaren.","Sahne und Parmesan einrühren, kurz einkochen lassen und abschmecken."]'::jsonb,
  610, 30, 74, 21,
  array['one-pot', 'pasta', 'unter-20', 'kinderliebling']::text[],
  true, true, true, null, null)
on conflict (id) do update set
  name = excluded.name, description = excluded.description, steps = excluded.steps,
  time_minutes = excluded.time_minutes, difficulty = excluded.difficulty,
  kcal = excluded.kcal, protein = excluded.protein, carbs = excluded.carbs, fat = excluded.fat,
  categories = excluded.categories, one_pot = excluded.one_pot, tips = excluded.tips;
delete from recipe_ingredients where recipe_id = 'one-pot-schinken-erbsen-nudeln';
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-schinken-erbsen-nudeln', 'nudeln', 350, 'g', null, false, 0);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-schinken-erbsen-nudeln', 'kochschinken', 200, 'g', 'gewürfelt', false, 1);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-schinken-erbsen-nudeln', 'erbsen-tk', 250, 'g', null, false, 2);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-schinken-erbsen-nudeln', 'kochsahne', 200, 'ml', null, false, 3);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-schinken-erbsen-nudeln', 'zwiebel', 1, 'Stk', null, false, 4);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-schinken-erbsen-nudeln', 'wasser', 700, 'ml', null, false, 5);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-schinken-erbsen-nudeln', 'gemuesebruehe', 2, 'TL', null, false, 6);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-schinken-erbsen-nudeln', 'parmesan', 40, 'g', null, false, 7);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-schinken-erbsen-nudeln', 'olivenoel', 1, 'EL', null, false, 8);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-schinken-erbsen-nudeln', 'salz', 1, 'TL', null, false, 9);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-schinken-erbsen-nudeln', 'pfeffer', 1, 'Prise', null, false, 10);

-- One-Pot Chili sin Carne (mild)
insert into recipes (id, name, description, placeholder_emoji, placeholder_tone, base_servings,
  time_minutes, difficulty, steps, kcal, protein, carbs, fat, categories,
  no_added_sugar, kid_friendly, one_pot, tips, household_id) values (
  'one-pot-chili-sin-carne', 'One-Pot Chili sin Carne (mild)', 'Mildes Bohnen-Chili ohne Schärfe, dafür mit Mais und Paprika. Vegetarisch und sehr proteinreich.',
  '🫘', 'tomato', 4,
  30, 'einfach', '["Zwiebeln, Knoblauch und Paprika im Öl 5 Minuten andünsten.","Tomatenmark und Gewürze zugeben und kurz mitrösten.","Tomaten, Wasser und Brühe angießen, aufkochen.","Bohnen und Mais zugeben und 15 Minuten offen köcheln lassen.","Abschmecken – dazu passt Reis oder Vollkornbrot."]'::jsonb,
  430, 21, 58, 11,
  array['one-pot', 'vegetarisch', 'suppe-eintopf', 'unter-30', 'proteinreich']::text[],
  true, true, true, null, null)
on conflict (id) do update set
  name = excluded.name, description = excluded.description, steps = excluded.steps,
  time_minutes = excluded.time_minutes, difficulty = excluded.difficulty,
  kcal = excluded.kcal, protein = excluded.protein, carbs = excluded.carbs, fat = excluded.fat,
  categories = excluded.categories, one_pot = excluded.one_pot, tips = excluded.tips;
delete from recipe_ingredients where recipe_id = 'one-pot-chili-sin-carne';
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-chili-sin-carne', 'kidneybohnen', 500, 'g', 'abgetropft', false, 0);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-chili-sin-carne', 'mais', 200, 'g', 'abgetropft', false, 1);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-chili-sin-carne', 'gehackte-tomaten', 800, 'g', null, false, 2);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-chili-sin-carne', 'paprika', 2, 'Stk', null, false, 3);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-chili-sin-carne', 'zwiebel', 2, 'Stk', null, false, 4);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-chili-sin-carne', 'knoblauch', 2, 'Zehe', null, false, 5);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-chili-sin-carne', 'tomatenmark', 2, 'EL', null, false, 6);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-chili-sin-carne', 'kreuzkuemmel', 2, 'TL', null, false, 7);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-chili-sin-carne', 'paprikapulver', 2, 'TL', null, false, 8);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-chili-sin-carne', 'gemuesebruehe', 2, 'TL', null, false, 9);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-chili-sin-carne', 'wasser', 200, 'ml', null, false, 10);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-chili-sin-carne', 'olivenoel', 2, 'EL', null, false, 11);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-chili-sin-carne', 'salz', 1, 'TL', null, false, 12);

-- One-Pot Couscous-Hähnchen-Pfanne
insert into recipes (id, name, description, placeholder_emoji, placeholder_tone, base_servings,
  time_minutes, difficulty, steps, kcal, protein, carbs, fat, categories,
  no_added_sugar, kid_friendly, one_pot, tips, household_id) values (
  'one-pot-couscous-haehnchen', 'One-Pot Couscous-Hähnchen-Pfanne', 'Couscous quillt direkt in der Pfanne mit Hähnchen und Gemüse – schneller geht ein warmes Abendessen kaum.',
  '🍗', 'sun', 4,
  20, 'einfach', '["Hähnchenstreifen im Öl anbraten und salzen.","Zwiebel, Paprika und Zucchini zugeben und 4 Minuten braten.","Kirschtomaten und Paprikapulver zugeben.","Couscous einstreuen, Wasser mit Brühe angießen, umrühren.","Herd ausschalten, zugedeckt 6 Minuten quellen lassen.","Mit Zitronensaft, Salz und Pfeffer abschmecken."]'::jsonb,
  540, 40, 62, 13,
  array['one-pot', 'haehnchen', 'unter-20', 'proteinreich']::text[],
  true, true, true, null, null)
on conflict (id) do update set
  name = excluded.name, description = excluded.description, steps = excluded.steps,
  time_minutes = excluded.time_minutes, difficulty = excluded.difficulty,
  kcal = excluded.kcal, protein = excluded.protein, carbs = excluded.carbs, fat = excluded.fat,
  categories = excluded.categories, one_pot = excluded.one_pot, tips = excluded.tips;
delete from recipe_ingredients where recipe_id = 'one-pot-couscous-haehnchen';
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-couscous-haehnchen', 'haehnchenbrust', 450, 'g', 'in Streifen', false, 0);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-couscous-haehnchen', 'couscous', 250, 'g', null, false, 1);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-couscous-haehnchen', 'zucchini', 1, 'Stk', null, false, 2);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-couscous-haehnchen', 'paprika', 1, 'Stk', null, false, 3);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-couscous-haehnchen', 'kirschtomaten', 200, 'g', null, false, 4);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-couscous-haehnchen', 'zwiebel', 1, 'Stk', null, false, 5);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-couscous-haehnchen', 'wasser', 400, 'ml', null, false, 6);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-couscous-haehnchen', 'huehnerbruehe', 2, 'TL', null, false, 7);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-couscous-haehnchen', 'paprikapulver', 1, 'TL', null, false, 8);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-couscous-haehnchen', 'olivenoel', 2, 'EL', null, false, 9);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-couscous-haehnchen', 'zitrone', 0.5, 'Stk', null, false, 10);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-couscous-haehnchen', 'salz', 1, 'TL', null, false, 11);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-couscous-haehnchen', 'pfeffer', 1, 'Prise', null, false, 12);

-- One-Pot Champignon-Rahmnudeln
insert into recipes (id, name, description, placeholder_emoji, placeholder_tone, base_servings,
  time_minutes, difficulty, steps, kcal, protein, carbs, fat, categories,
  no_added_sugar, kid_friendly, one_pot, tips, household_id) values (
  'one-pot-champignon-rahmnudeln', 'One-Pot Champignon-Rahmnudeln', 'Vegetarische Rahmnudeln mit gebratenen Champignons und frischer Petersilie.',
  '🍄', 'herb', 4,
  22, 'einfach', '["Champignons im heißen Öl kräftig anbraten, bis sie Farbe haben.","Zwiebel und Knoblauch zugeben und mitdünsten.","Nudeln, Wasser und Brühe zugeben und offen 10 Minuten köcheln.","Sahne und Parmesan einrühren, 2 Minuten einkochen lassen.","Mit Petersilie, Salz und Pfeffer abschmecken."]'::jsonb,
  560, 22, 70, 21,
  array['one-pot', 'vegetarisch', 'pasta', 'unter-30']::text[],
  true, true, true, null, null)
on conflict (id) do update set
  name = excluded.name, description = excluded.description, steps = excluded.steps,
  time_minutes = excluded.time_minutes, difficulty = excluded.difficulty,
  kcal = excluded.kcal, protein = excluded.protein, carbs = excluded.carbs, fat = excluded.fat,
  categories = excluded.categories, one_pot = excluded.one_pot, tips = excluded.tips;
delete from recipe_ingredients where recipe_id = 'one-pot-champignon-rahmnudeln';
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-champignon-rahmnudeln', 'nudeln', 350, 'g', null, false, 0);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-champignon-rahmnudeln', 'champignon', 400, 'g', 'in Scheiben', false, 1);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-champignon-rahmnudeln', 'kochsahne', 200, 'ml', null, false, 2);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-champignon-rahmnudeln', 'zwiebel', 1, 'Stk', null, false, 3);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-champignon-rahmnudeln', 'knoblauch', 2, 'Zehe', null, false, 4);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-champignon-rahmnudeln', 'wasser', 700, 'ml', null, false, 5);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-champignon-rahmnudeln', 'gemuesebruehe', 2, 'TL', null, false, 6);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-champignon-rahmnudeln', 'petersilie', 0.5, 'Bund', null, false, 7);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-champignon-rahmnudeln', 'parmesan', 40, 'g', null, false, 8);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-champignon-rahmnudeln', 'olivenoel', 2, 'EL', null, false, 9);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-champignon-rahmnudeln', 'salz', 1, 'TL', null, false, 10);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('one-pot-champignon-rahmnudeln', 'pfeffer', 1, 'Prise', null, false, 11);

-- Ofen-Hähnchen mit Kartoffelspalten & Gemüse
insert into recipes (id, name, description, placeholder_emoji, placeholder_tone, base_servings,
  time_minutes, difficulty, steps, kcal, protein, carbs, fat, categories,
  no_added_sugar, kid_friendly, one_pot, tips, household_id) values (
  'ofen-haehnchen-kartoffelspalten', 'Ofen-Hähnchen mit Kartoffelspalten & Gemüse', 'Alles auf ein Blech: knusprige Kartoffelspalten, buntes Gemüse und würzige Hähnchenkeulen. Wenig Arbeit, viel Geschmack.',
  '🍗', 'sun', 4,
  50, 'einfach', '["Ofen auf 200 °C Ober-/Unterhitze vorheizen.","Kartoffelspalten mit 2 EL Öl, Paprikapulver, Salz und Pfeffer mischen und auf ein Blech geben.","Hähnchenkeulen mit restlichem Öl, gepresstem Knoblauch, Thymian und Salz einreiben und dazulegen.","25 Minuten backen.","Gemüse in Stücken zugeben, alles wenden und weitere 20 Minuten backen.","Kurz ruhen lassen und servieren."]'::jsonb,
  660, 42, 55, 28,
  array['haehnchen', 'kartoffeln', 'ofen', 'proteinreich', 'kinderliebling']::text[],
  true, true, false, null, null)
on conflict (id) do update set
  name = excluded.name, description = excluded.description, steps = excluded.steps,
  time_minutes = excluded.time_minutes, difficulty = excluded.difficulty,
  kcal = excluded.kcal, protein = excluded.protein, carbs = excluded.carbs, fat = excluded.fat,
  categories = excluded.categories, one_pot = excluded.one_pot, tips = excluded.tips;
delete from recipe_ingredients where recipe_id = 'ofen-haehnchen-kartoffelspalten';
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('ofen-haehnchen-kartoffelspalten', 'haehnchenkeule', 4, 'Stk', null, false, 0);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('ofen-haehnchen-kartoffelspalten', 'kartoffel', 900, 'g', 'in Spalten', false, 1);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('ofen-haehnchen-kartoffelspalten', 'paprika', 2, 'Stk', null, false, 2);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('ofen-haehnchen-kartoffelspalten', 'zucchini', 1, 'Stk', null, false, 3);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('ofen-haehnchen-kartoffelspalten', 'rote-zwiebel', 2, 'Stk', null, false, 4);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('ofen-haehnchen-kartoffelspalten', 'olivenoel', 4, 'EL', null, false, 5);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('ofen-haehnchen-kartoffelspalten', 'paprikapulver', 2, 'TL', null, false, 6);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('ofen-haehnchen-kartoffelspalten', 'thymian', 2, 'TL', null, false, 7);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('ofen-haehnchen-kartoffelspalten', 'knoblauch', 3, 'Zehe', null, false, 8);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('ofen-haehnchen-kartoffelspalten', 'salz', 2, 'TL', null, false, 9);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('ofen-haehnchen-kartoffelspalten', 'pfeffer', 1, 'Prise', null, false, 10);

-- Kartoffel-Hackfleisch-Auflauf
insert into recipes (id, name, description, placeholder_emoji, placeholder_tone, base_servings,
  time_minutes, difficulty, steps, kcal, protein, carbs, fat, categories,
  no_added_sugar, kid_friendly, one_pot, tips, household_id) values (
  'kartoffel-hack-auflauf', 'Kartoffel-Hackfleisch-Auflauf', 'Schichten aus Kartoffeln, Hackfleisch-Tomaten-Sauce und Käse. Der Klassiker, der immer leer gegessen wird.',
  '🧑‍🍳', 'tomato', 4,
  55, 'mittel', '["Kartoffeln schälen, in dünne Scheiben schneiden und 8 Minuten in Salzwasser vorkochen.","Hackfleisch mit Zwiebeln und Knoblauch anbraten, Tomatenmark mitrösten.","Gehackte Tomaten und Oregano zugeben, 5 Minuten einkochen, kräftig abschmecken.","Ofen auf 200 °C vorheizen. Kartoffeln und Hacksauce abwechselnd in eine Auflaufform schichten.","Sahne mit Muskat, Salz und Pfeffer verrühren und darübergießen, Käse aufstreuen.","30 Minuten backen, bis der Käse goldbraun ist."]'::jsonb,
  720, 40, 58, 34,
  array['hackfleisch', 'kartoffeln', 'auflauf', 'ofen', 'kinderliebling', 'proteinreich']::text[],
  true, true, false, null, null)
on conflict (id) do update set
  name = excluded.name, description = excluded.description, steps = excluded.steps,
  time_minutes = excluded.time_minutes, difficulty = excluded.difficulty,
  kcal = excluded.kcal, protein = excluded.protein, carbs = excluded.carbs, fat = excluded.fat,
  categories = excluded.categories, one_pot = excluded.one_pot, tips = excluded.tips;
delete from recipe_ingredients where recipe_id = 'kartoffel-hack-auflauf';
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('kartoffel-hack-auflauf', 'kartoffel', 1000, 'g', null, false, 0);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('kartoffel-hack-auflauf', 'gemischtes-hack', 500, 'g', null, false, 1);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('kartoffel-hack-auflauf', 'gehackte-tomaten', 400, 'g', null, false, 2);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('kartoffel-hack-auflauf', 'tomatenmark', 2, 'EL', null, false, 3);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('kartoffel-hack-auflauf', 'zwiebel', 2, 'Stk', null, false, 4);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('kartoffel-hack-auflauf', 'knoblauch', 2, 'Zehe', null, false, 5);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('kartoffel-hack-auflauf', 'kochsahne', 200, 'ml', null, false, 6);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('kartoffel-hack-auflauf', 'gouda-gerieben', 150, 'g', null, false, 7);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('kartoffel-hack-auflauf', 'oregano', 2, 'TL', null, false, 8);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('kartoffel-hack-auflauf', 'olivenoel', 2, 'EL', null, false, 9);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('kartoffel-hack-auflauf', 'muskat', 1, 'Prise', null, false, 10);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('kartoffel-hack-auflauf', 'salz', 2, 'TL', null, false, 11);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('kartoffel-hack-auflauf', 'pfeffer', 1, 'Prise', null, false, 12);

-- Nudelauflauf mit Brokkoli & Käse
insert into recipes (id, name, description, placeholder_emoji, placeholder_tone, base_servings,
  time_minutes, difficulty, steps, kcal, protein, carbs, fat, categories,
  no_added_sugar, kid_friendly, one_pot, tips, household_id) values (
  'nudelauflauf-brokkoli', 'Nudelauflauf mit Brokkoli & Käse', 'Vegetarischer Auflauf mit Nudeln, Brokkoli und einer cremigen Käsesauce ohne Fertigprodukte.',
  '🧀', 'green', 4,
  45, 'mittel', '["Nudeln 2 Minuten kürzer als angegeben in Salzwasser kochen, Brokkoliröschen die letzten 3 Minuten mitkochen.","Butter schmelzen, Mehl einrühren und 1 Minute anschwitzen.","Milch nach und nach einrühren und die Sauce 3 Minuten köcheln lassen.","Gouda einrühren, mit Muskat, Salz und Pfeffer abschmecken.","Nudeln und Brokkoli in eine Auflaufform geben, Sauce darübergießen, Parmesan aufstreuen.","Bei 200 °C 20 Minuten überbacken."]'::jsonb,
  640, 30, 72, 26,
  array['vegetarisch', 'pasta', 'auflauf', 'ofen', 'kinderliebling']::text[],
  true, true, false, null, null)
on conflict (id) do update set
  name = excluded.name, description = excluded.description, steps = excluded.steps,
  time_minutes = excluded.time_minutes, difficulty = excluded.difficulty,
  kcal = excluded.kcal, protein = excluded.protein, carbs = excluded.carbs, fat = excluded.fat,
  categories = excluded.categories, one_pot = excluded.one_pot, tips = excluded.tips;
delete from recipe_ingredients where recipe_id = 'nudelauflauf-brokkoli';
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('nudelauflauf-brokkoli', 'nudeln', 350, 'g', null, false, 0);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('nudelauflauf-brokkoli', 'brokkoli', 600, 'g', null, false, 1);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('nudelauflauf-brokkoli', 'milch', 400, 'ml', null, false, 2);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('nudelauflauf-brokkoli', 'butter', 40, 'g', null, false, 3);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('nudelauflauf-brokkoli', 'mehl', 40, 'g', null, false, 4);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('nudelauflauf-brokkoli', 'gouda-gerieben', 150, 'g', null, false, 5);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('nudelauflauf-brokkoli', 'parmesan', 40, 'g', null, false, 6);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('nudelauflauf-brokkoli', 'muskat', 1, 'Prise', null, false, 7);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('nudelauflauf-brokkoli', 'salz', 2, 'TL', null, false, 8);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('nudelauflauf-brokkoli', 'pfeffer', 1, 'Prise', null, false, 9);

-- Frikadellen mit Kartoffelpüree & Möhrengemüse
insert into recipes (id, name, description, placeholder_emoji, placeholder_tone, base_servings,
  time_minutes, difficulty, steps, kcal, protein, carbs, fat, categories,
  no_added_sugar, kid_friendly, one_pot, tips, household_id) values (
  'frikadellen-kartoffelpueree', 'Frikadellen mit Kartoffelpüree & Möhrengemüse', 'Selbstgemachte Frikadellen ohne Zuckerzusatz, dazu cremiges Püree und buttrige Möhren.',
  '🥔', 'cream', 4,
  45, 'mittel', '["Kartoffeln schälen, würfeln und in Salzwasser 20 Minuten weich kochen.","Hack mit Ei, Semmelbröseln, fein gewürfelter Zwiebel, Senf, Salz und Pfeffer verkneten.","Frikadellen formen und im Öl bei mittlerer Hitze je Seite 5–6 Minuten braten.","Möhren in Scheiben schneiden und mit 20 g Butter und wenig Wasser 12 Minuten dünsten.","Kartoffeln abgießen, mit warmer Milch und restlicher Butter stampfen, mit Muskat und Salz abschmecken.","Alles mit Petersilie bestreut servieren."]'::jsonb,
  700, 38, 58, 34,
  array['hackfleisch', 'kartoffeln', 'kinderliebling', 'proteinreich']::text[],
  true, true, false, 'Fertige Frikadellen und Püree lassen sich gut einfrieren – ideal zum Vorkochen.', null)
on conflict (id) do update set
  name = excluded.name, description = excluded.description, steps = excluded.steps,
  time_minutes = excluded.time_minutes, difficulty = excluded.difficulty,
  kcal = excluded.kcal, protein = excluded.protein, carbs = excluded.carbs, fat = excluded.fat,
  categories = excluded.categories, one_pot = excluded.one_pot, tips = excluded.tips;
delete from recipe_ingredients where recipe_id = 'frikadellen-kartoffelpueree';
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('frikadellen-kartoffelpueree', 'gemischtes-hack', 500, 'g', null, false, 0);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('frikadellen-kartoffelpueree', 'ei', 1, 'Stk', null, false, 1);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('frikadellen-kartoffelpueree', 'semmelbroesel', 50, 'g', null, false, 2);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('frikadellen-kartoffelpueree', 'zwiebel', 1, 'Stk', null, false, 3);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('frikadellen-kartoffelpueree', 'senf', 1, 'TL', null, false, 4);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('frikadellen-kartoffelpueree', 'kartoffel', 900, 'g', null, false, 5);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('frikadellen-kartoffelpueree', 'milch', 150, 'ml', null, false, 6);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('frikadellen-kartoffelpueree', 'butter', 40, 'g', null, false, 7);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('frikadellen-kartoffelpueree', 'moehre', 500, 'g', null, false, 8);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('frikadellen-kartoffelpueree', 'petersilie', 0.5, 'Bund', null, false, 9);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('frikadellen-kartoffelpueree', 'rapsoel', 2, 'EL', null, false, 10);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('frikadellen-kartoffelpueree', 'muskat', 1, 'Prise', null, false, 11);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('frikadellen-kartoffelpueree', 'salz', 2, 'TL', null, false, 12);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('frikadellen-kartoffelpueree', 'pfeffer', 1, 'Prise', null, false, 13);

-- Selbstgemachte Hähnchen-Nuggets mit Ofengemüse
insert into recipes (id, name, description, placeholder_emoji, placeholder_tone, base_servings,
  time_minutes, difficulty, steps, kcal, protein, carbs, fat, categories,
  no_added_sugar, kid_friendly, one_pot, tips, household_id) values (
  'haehnchen-nuggets-ofengemuese', 'Selbstgemachte Hähnchen-Nuggets mit Ofengemüse', 'Knusprige Nuggets aus echtem Hähnchenfilet, im Ofen gebacken statt frittiert – ohne Zucker in der Panade.',
  '🍗', 'sun', 4,
  40, 'mittel', '["Ofen auf 200 °C vorheizen. Kartoffeln und Möhren in Stifte schneiden, mit 2 EL Öl und Salz mischen und auf ein Blech geben, 15 Minuten backen.","Hähnchen in mundgerechte Stücke schneiden und salzen.","Drei Schalen vorbereiten: Mehl mit Paprikapulver, verquirlte Eier, Semmelbrösel.","Hähnchenstücke nacheinander in Mehl, Ei und Bröseln wenden.","Nuggets mit dem restlichen Öl beträufeln, mit dem Brokkoli aufs Blech legen.","Weitere 18–20 Minuten backen, nach der Hälfte wenden."]'::jsonb,
  610, 46, 58, 20,
  array['haehnchen', 'ofen', 'kartoffeln', 'kinderliebling', 'proteinreich']::text[],
  true, true, false, 'Als Dip passt Joghurt mit Schnittlauch – ganz ohne den Zucker aus fertigem Ketchup.', null)
on conflict (id) do update set
  name = excluded.name, description = excluded.description, steps = excluded.steps,
  time_minutes = excluded.time_minutes, difficulty = excluded.difficulty,
  kcal = excluded.kcal, protein = excluded.protein, carbs = excluded.carbs, fat = excluded.fat,
  categories = excluded.categories, one_pot = excluded.one_pot, tips = excluded.tips;
delete from recipe_ingredients where recipe_id = 'haehnchen-nuggets-ofengemuese';
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('haehnchen-nuggets-ofengemuese', 'haehnchenbrust', 600, 'g', null, false, 0);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('haehnchen-nuggets-ofengemuese', 'ei', 2, 'Stk', null, false, 1);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('haehnchen-nuggets-ofengemuese', 'semmelbroesel', 120, 'g', null, false, 2);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('haehnchen-nuggets-ofengemuese', 'mehl', 60, 'g', null, false, 3);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('haehnchen-nuggets-ofengemuese', 'paprikapulver', 2, 'TL', null, false, 4);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('haehnchen-nuggets-ofengemuese', 'kartoffel', 600, 'g', null, false, 5);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('haehnchen-nuggets-ofengemuese', 'moehre', 3, 'Stk', null, false, 6);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('haehnchen-nuggets-ofengemuese', 'brokkoli', 300, 'g', null, false, 7);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('haehnchen-nuggets-ofengemuese', 'olivenoel', 4, 'EL', null, false, 8);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('haehnchen-nuggets-ofengemuese', 'salz', 2, 'TL', null, false, 9);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('haehnchen-nuggets-ofengemuese', 'pfeffer', 1, 'Prise', null, false, 10);

-- Pfannkuchen mit Apfelmus
insert into recipes (id, name, description, placeholder_emoji, placeholder_tone, base_servings,
  time_minutes, difficulty, steps, kcal, protein, carbs, fat, categories,
  no_added_sugar, kid_friendly, one_pot, tips, household_id) values (
  'pfannkuchen-apfelmus', 'Pfannkuchen mit Apfelmus', 'Fluffige Pfannkuchen ohne Zucker im Teig. Die Süße kommt aus Apfelmus ohne Zuckerzusatz und etwas Zimt.',
  '🥞', 'cream', 4,
  25, 'einfach', '["Mehl, Milch, Eier, Vanille und Salz zu einem glatten Teig verrühren und 10 Minuten quellen lassen.","Etwas Butter in einer Pfanne erhitzen.","Je eine Kelle Teig hineingeben und von beiden Seiten goldbraun backen.","Apfelmus mit Zimt verrühren.","Pfannkuchen mit Apfelmus servieren."]'::jsonb,
  520, 20, 66, 18,
  array['vegetarisch', 'fruehstueck', 'kinderliebling', 'unter-30']::text[],
  true, true, false, null, null)
on conflict (id) do update set
  name = excluded.name, description = excluded.description, steps = excluded.steps,
  time_minutes = excluded.time_minutes, difficulty = excluded.difficulty,
  kcal = excluded.kcal, protein = excluded.protein, carbs = excluded.carbs, fat = excluded.fat,
  categories = excluded.categories, one_pot = excluded.one_pot, tips = excluded.tips;
delete from recipe_ingredients where recipe_id = 'pfannkuchen-apfelmus';
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('pfannkuchen-apfelmus', 'mehl', 250, 'g', null, false, 0);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('pfannkuchen-apfelmus', 'milch', 500, 'ml', null, false, 1);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('pfannkuchen-apfelmus', 'ei', 4, 'Stk', null, false, 2);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('pfannkuchen-apfelmus', 'butter', 30, 'g', null, false, 3);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('pfannkuchen-apfelmus', 'apfelmus', 400, 'g', null, false, 4);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('pfannkuchen-apfelmus', 'zimt', 1, 'TL', null, false, 5);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('pfannkuchen-apfelmus', 'vanille', 1, 'Prise', null, false, 6);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('pfannkuchen-apfelmus', 'salz', 1, 'Prise', null, false, 7);

-- Overnight Oats mit Banane & Beeren
insert into recipes (id, name, description, placeholder_emoji, placeholder_tone, base_servings,
  time_minutes, difficulty, steps, kcal, protein, carbs, fat, categories,
  no_added_sugar, kid_friendly, one_pot, tips, household_id) values (
  'overnight-oats-beeren', 'Overnight Oats mit Banane & Beeren', 'Am Abend in 10 Minuten vorbereitet, morgens sofort fertig. Gesüßt wird nur mit reifer Banane.',
  '🫐', 'berry', 4,
  10, 'einfach', '["Haferflocken, Milch, Joghurt, Zimt und Vanille in einer Schüssel verrühren.","Eine Banane zerdrücken und untermischen – sie ersetzt den Zucker.","Auf vier Gläser verteilen und über Nacht in den Kühlschrank stellen.","Am Morgen mit aufgetauten Beeren, der zweiten Banane in Scheiben und Mandeln toppen."]'::jsonb,
  380, 16, 52, 12,
  array['vegetarisch', 'fruehstueck', 'unter-20', 'kinderliebling']::text[],
  true, true, false, null, null)
on conflict (id) do update set
  name = excluded.name, description = excluded.description, steps = excluded.steps,
  time_minutes = excluded.time_minutes, difficulty = excluded.difficulty,
  kcal = excluded.kcal, protein = excluded.protein, carbs = excluded.carbs, fat = excluded.fat,
  categories = excluded.categories, one_pot = excluded.one_pot, tips = excluded.tips;
delete from recipe_ingredients where recipe_id = 'overnight-oats-beeren';
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('overnight-oats-beeren', 'haferflocken', 200, 'g', null, false, 0);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('overnight-oats-beeren', 'milch', 500, 'ml', null, false, 1);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('overnight-oats-beeren', 'joghurt', 250, 'g', null, false, 2);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('overnight-oats-beeren', 'banane', 2, 'Stk', null, false, 3);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('overnight-oats-beeren', 'beeren-tk', 250, 'g', null, false, 4);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('overnight-oats-beeren', 'mandeln', 40, 'g', null, false, 5);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('overnight-oats-beeren', 'zimt', 1, 'TL', null, false, 6);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('overnight-oats-beeren', 'vanille', 1, 'Prise', null, false, 7);

-- Rührei mit Vollkornbrot & Tomaten
insert into recipes (id, name, description, placeholder_emoji, placeholder_tone, base_servings,
  time_minutes, difficulty, steps, kcal, protein, carbs, fat, categories,
  no_added_sugar, kid_friendly, one_pot, tips, household_id) values (
  'ruehrei-vollkornbrot', 'Rührei mit Vollkornbrot & Tomaten', 'Der proteinreiche Start in den Tag: cremiges Rührei mit Schnittlauch, dazu Vollkornbrot und frische Tomaten.',
  '🍳', 'sun', 4,
  15, 'einfach', '["Eier mit Milch, Salz und Pfeffer verquirlen.","Butter in einer beschichteten Pfanne bei mittlerer Hitze schmelzen.","Eiermasse hineingeben und mit dem Teigschaber langsam stocken lassen.","Vom Herd nehmen, solange es noch leicht cremig ist, Schnittlauch unterheben.","Mit Vollkornbrot und Tomatenscheiben servieren."]'::jsonb,
  420, 26, 34, 20,
  array['vegetarisch', 'fruehstueck', 'unter-20', 'proteinreich']::text[],
  true, true, false, null, null)
on conflict (id) do update set
  name = excluded.name, description = excluded.description, steps = excluded.steps,
  time_minutes = excluded.time_minutes, difficulty = excluded.difficulty,
  kcal = excluded.kcal, protein = excluded.protein, carbs = excluded.carbs, fat = excluded.fat,
  categories = excluded.categories, one_pot = excluded.one_pot, tips = excluded.tips;
delete from recipe_ingredients where recipe_id = 'ruehrei-vollkornbrot';
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('ruehrei-vollkornbrot', 'ei', 8, 'Stk', null, false, 0);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('ruehrei-vollkornbrot', 'milch', 60, 'ml', null, false, 1);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('ruehrei-vollkornbrot', 'butter', 25, 'g', null, false, 2);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('ruehrei-vollkornbrot', 'schnittlauch', 0.5, 'Bund', null, false, 3);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('ruehrei-vollkornbrot', 'vollkornbrot', 8, 'Scheibe', null, false, 4);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('ruehrei-vollkornbrot', 'tomate', 3, 'Stk', null, false, 5);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('ruehrei-vollkornbrot', 'salz', 1, 'TL', null, false, 6);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('ruehrei-vollkornbrot', 'pfeffer', 1, 'Prise', null, false, 7);

-- Gemüse-Frittata mit Kartoffeln
insert into recipes (id, name, description, placeholder_emoji, placeholder_tone, base_servings,
  time_minutes, difficulty, steps, kcal, protein, carbs, fat, categories,
  no_added_sugar, kid_friendly, one_pot, tips, household_id) values (
  'gemuese-frittata', 'Gemüse-Frittata mit Kartoffeln', 'Herzhafter Eierkuchen aus der Pfanne mit Kartoffeln, Paprika und Käse. Schmeckt warm und kalt.',
  '🍳', 'herb', 4,
  35, 'mittel', '["Kartoffeln würfeln und 10 Minuten in Salzwasser vorkochen, abgießen.","Öl in einer ofenfesten Pfanne erhitzen, Zwiebel, Paprika und Zucchini 5 Minuten braten.","Kartoffeln zugeben und kurz mitbraten.","Eier mit Milch, Käse, Salz und Pfeffer verquirlen und über das Gemüse gießen.","Bei kleiner Hitze 10 Minuten stocken lassen, dann 8 Minuten bei 200 °C im Ofen fertig backen.","Mit Petersilie bestreuen und in Stücke schneiden."]'::jsonb,
  480, 28, 38, 24,
  array['vegetarisch', 'kartoffeln', 'proteinreich', 'unter-30']::text[],
  true, true, false, null, null)
on conflict (id) do update set
  name = excluded.name, description = excluded.description, steps = excluded.steps,
  time_minutes = excluded.time_minutes, difficulty = excluded.difficulty,
  kcal = excluded.kcal, protein = excluded.protein, carbs = excluded.carbs, fat = excluded.fat,
  categories = excluded.categories, one_pot = excluded.one_pot, tips = excluded.tips;
delete from recipe_ingredients where recipe_id = 'gemuese-frittata';
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('gemuese-frittata', 'ei', 8, 'Stk', null, false, 0);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('gemuese-frittata', 'kartoffel', 600, 'g', null, false, 1);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('gemuese-frittata', 'paprika', 1, 'Stk', null, false, 2);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('gemuese-frittata', 'zucchini', 1, 'Stk', null, false, 3);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('gemuese-frittata', 'zwiebel', 1, 'Stk', null, false, 4);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('gemuese-frittata', 'gouda-gerieben', 100, 'g', null, false, 5);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('gemuese-frittata', 'milch', 80, 'ml', null, false, 6);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('gemuese-frittata', 'olivenoel', 3, 'EL', null, false, 7);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('gemuese-frittata', 'petersilie', 0.5, 'Bund', null, false, 8);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('gemuese-frittata', 'salz', 2, 'TL', null, false, 9);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('gemuese-frittata', 'pfeffer', 1, 'Prise', null, false, 10);

-- Quinoa-Bowl mit Ofengemüse & Joghurtdip
insert into recipes (id, name, description, placeholder_emoji, placeholder_tone, base_servings,
  time_minutes, difficulty, steps, kcal, protein, carbs, fat, categories,
  no_added_sugar, kid_friendly, one_pot, tips, household_id) values (
  'quinoa-bowl-ofengemuese', 'Quinoa-Bowl mit Ofengemüse & Joghurtdip', 'Buntes Ofengemüse auf Quinoa mit frischem Joghurt-Kräuter-Dip. Leicht, sättigend und voller Eiweiß.',
  '🥗', 'green', 4,
  40, 'einfach', '["Ofen auf 200 °C vorheizen. Gemüse in Stücke schneiden, mit Kichererbsen, Öl, Paprikapulver und Salz mischen.","Auf einem Blech verteilen und 25–30 Minuten backen, nach der Hälfte wenden.","Quinoa waschen und in der doppelten Menge Wasser mit Brühe 15 Minuten garen, dann quellen lassen.","Joghurt mit Zitronensaft, Schnittlauch, Salz und Pfeffer verrühren.","Quinoa in Schüsseln füllen, Ofengemüse daraufgeben und mit Dip servieren."]'::jsonb,
  560, 22, 68, 20,
  array['vegetarisch', 'ofen', 'proteinreich']::text[],
  true, true, false, null, null)
on conflict (id) do update set
  name = excluded.name, description = excluded.description, steps = excluded.steps,
  time_minutes = excluded.time_minutes, difficulty = excluded.difficulty,
  kcal = excluded.kcal, protein = excluded.protein, carbs = excluded.carbs, fat = excluded.fat,
  categories = excluded.categories, one_pot = excluded.one_pot, tips = excluded.tips;
delete from recipe_ingredients where recipe_id = 'quinoa-bowl-ofengemuese';
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('quinoa-bowl-ofengemuese', 'quinoa', 250, 'g', null, false, 0);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('quinoa-bowl-ofengemuese', 'suesskartoffel', 500, 'g', null, false, 1);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('quinoa-bowl-ofengemuese', 'paprika', 2, 'Stk', null, false, 2);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('quinoa-bowl-ofengemuese', 'zucchini', 1, 'Stk', null, false, 3);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('quinoa-bowl-ofengemuese', 'rote-zwiebel', 1, 'Stk', null, false, 4);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('quinoa-bowl-ofengemuese', 'kichererbsen', 250, 'g', 'abgetropft', false, 5);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('quinoa-bowl-ofengemuese', 'griechischer-joghurt', 250, 'g', null, false, 6);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('quinoa-bowl-ofengemuese', 'zitrone', 1, 'Stk', null, false, 7);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('quinoa-bowl-ofengemuese', 'schnittlauch', 0.5, 'Bund', null, false, 8);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('quinoa-bowl-ofengemuese', 'olivenoel', 4, 'EL', null, false, 9);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('quinoa-bowl-ofengemuese', 'paprikapulver', 2, 'TL', null, false, 10);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('quinoa-bowl-ofengemuese', 'gemuesebruehe', 1, 'TL', null, false, 11);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('quinoa-bowl-ofengemuese', 'salz', 2, 'TL', null, false, 12);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('quinoa-bowl-ofengemuese', 'pfeffer', 1, 'Prise', null, false, 13);

-- Kartoffelpuffer mit Kräuterquark
insert into recipes (id, name, description, placeholder_emoji, placeholder_tone, base_servings,
  time_minutes, difficulty, steps, kcal, protein, carbs, fat, categories,
  no_added_sugar, kid_friendly, one_pot, tips, household_id) values (
  'kartoffelpuffer-kraeuterquark', 'Kartoffelpuffer mit Kräuterquark', 'Knusprige Kartoffelpuffer mit frischem Kräuterquark – ein Klassiker, den Kinder lieben.',
  '🥔', 'cream', 4,
  40, 'mittel', '["Kartoffeln und Zwiebel fein reiben und die Flüssigkeit gut ausdrücken.","Mit Eiern, Mehl, Salz, Pfeffer und Muskat vermengen.","Öl portionsweise in einer Pfanne erhitzen, kleine Puffer hineingeben und flach drücken.","Je Seite 3–4 Minuten goldbraun braten, auf Küchenpapier abtropfen lassen.","Quark mit Milch, Schnittlauch, Salz und Pfeffer cremig rühren und dazu servieren."]'::jsonb,
  580, 28, 60, 24,
  array['vegetarisch', 'kartoffeln', 'kinderliebling']::text[],
  true, true, false, null, null)
on conflict (id) do update set
  name = excluded.name, description = excluded.description, steps = excluded.steps,
  time_minutes = excluded.time_minutes, difficulty = excluded.difficulty,
  kcal = excluded.kcal, protein = excluded.protein, carbs = excluded.carbs, fat = excluded.fat,
  categories = excluded.categories, one_pot = excluded.one_pot, tips = excluded.tips;
delete from recipe_ingredients where recipe_id = 'kartoffelpuffer-kraeuterquark';
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('kartoffelpuffer-kraeuterquark', 'kartoffel', 1000, 'g', 'mehligkochend', false, 0);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('kartoffelpuffer-kraeuterquark', 'zwiebel', 1, 'Stk', null, false, 1);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('kartoffelpuffer-kraeuterquark', 'ei', 2, 'Stk', null, false, 2);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('kartoffelpuffer-kraeuterquark', 'mehl', 60, 'g', null, false, 3);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('kartoffelpuffer-kraeuterquark', 'quark', 500, 'g', null, false, 4);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('kartoffelpuffer-kraeuterquark', 'milch', 60, 'ml', null, false, 5);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('kartoffelpuffer-kraeuterquark', 'schnittlauch', 1, 'Bund', null, false, 6);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('kartoffelpuffer-kraeuterquark', 'rapsoel', 6, 'EL', null, false, 7);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('kartoffelpuffer-kraeuterquark', 'muskat', 1, 'Prise', null, false, 8);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('kartoffelpuffer-kraeuterquark', 'salz', 2, 'TL', null, false, 9);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('kartoffelpuffer-kraeuterquark', 'pfeffer', 1, 'Prise', null, false, 10);

-- Wraps mit Hähnchen & knackigem Gemüse
insert into recipes (id, name, description, placeholder_emoji, placeholder_tone, base_servings,
  time_minutes, difficulty, steps, kcal, protein, carbs, fat, categories,
  no_added_sugar, kid_friendly, one_pot, tips, household_id) values (
  'wraps-haehnchen-gemuese', 'Wraps mit Hähnchen & knackigem Gemüse', 'Warme Wraps mit gebratenem Hähnchen, Salat, Gurke und Joghurtsauce. Jeder belegt seinen Wrap selbst.',
  '🌯', 'green', 4,
  25, 'einfach', '["Hähnchenstreifen mit Paprikapulver, Salz und Pfeffer würzen und im Öl 6–8 Minuten braten.","Joghurt mit Zitronensaft, Schnittlauch, Salz und Pfeffer zu einer Sauce verrühren.","Salat, Gurke und Tomaten klein schneiden.","Wraps kurz in einer trockenen Pfanne erwärmen.","Wraps mit Sauce bestreichen, mit Hähnchen, Gemüse und Mais füllen und einrollen."]'::jsonb,
  560, 44, 56, 16,
  array['haehnchen', 'unter-30', 'kinderliebling', 'proteinreich']::text[],
  true, true, false, null, null)
on conflict (id) do update set
  name = excluded.name, description = excluded.description, steps = excluded.steps,
  time_minutes = excluded.time_minutes, difficulty = excluded.difficulty,
  kcal = excluded.kcal, protein = excluded.protein, carbs = excluded.carbs, fat = excluded.fat,
  categories = excluded.categories, one_pot = excluded.one_pot, tips = excluded.tips;
delete from recipe_ingredients where recipe_id = 'wraps-haehnchen-gemuese';
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('wraps-haehnchen-gemuese', 'wraps', 8, 'Stk', null, false, 0);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('wraps-haehnchen-gemuese', 'haehnchenbrust', 500, 'g', 'in Streifen', false, 1);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('wraps-haehnchen-gemuese', 'kopfsalat', 1, 'Stk', null, false, 2);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('wraps-haehnchen-gemuese', 'salatgurke', 1, 'Stk', null, false, 3);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('wraps-haehnchen-gemuese', 'tomate', 3, 'Stk', null, false, 4);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('wraps-haehnchen-gemuese', 'mais', 150, 'g', null, false, 5);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('wraps-haehnchen-gemuese', 'griechischer-joghurt', 250, 'g', null, false, 6);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('wraps-haehnchen-gemuese', 'zitrone', 0.5, 'Stk', null, false, 7);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('wraps-haehnchen-gemuese', 'paprikapulver', 2, 'TL', null, false, 8);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('wraps-haehnchen-gemuese', 'olivenoel', 2, 'EL', null, false, 9);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('wraps-haehnchen-gemuese', 'schnittlauch', 0.5, 'Bund', null, false, 10);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('wraps-haehnchen-gemuese', 'salz', 1, 'TL', null, false, 11);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('wraps-haehnchen-gemuese', 'pfeffer', 1, 'Prise', null, false, 12);

-- Milchreis mit Apfel & Zimt
insert into recipes (id, name, description, placeholder_emoji, placeholder_tone, base_servings,
  time_minutes, difficulty, steps, kcal, protein, carbs, fat, categories,
  no_added_sugar, kid_friendly, one_pot, tips, household_id) values (
  'milchreis-apfel-zimt', 'Milchreis mit Apfel & Zimt', 'Cremiger Milchreis, gesüßt nur mit warmem Zimt-Apfel-Kompott. Als Frühstück oder süßes Mittagessen.',
  '🍎', 'cream', 4,
  35, 'einfach', '["Milch mit Vanille und Salz aufkochen, Milchreis einrühren.","Bei kleiner Hitze 25–30 Minuten unter gelegentlichem Rühren quellen lassen.","Äpfel schälen, würfeln und mit Butter, Wasser und Zimt 8 Minuten weich dünsten.","Milchreis in Schalen füllen und das warme Apfelkompott daraufgeben."]'::jsonb,
  480, 16, 76, 12,
  array['vegetarisch', 'fruehstueck', 'kinderliebling']::text[],
  true, true, false, 'Reife, süße Apfelsorten wie Gala oder Elstar brauchen keinerlei Zuckerzusatz.', null)
on conflict (id) do update set
  name = excluded.name, description = excluded.description, steps = excluded.steps,
  time_minutes = excluded.time_minutes, difficulty = excluded.difficulty,
  kcal = excluded.kcal, protein = excluded.protein, carbs = excluded.carbs, fat = excluded.fat,
  categories = excluded.categories, one_pot = excluded.one_pot, tips = excluded.tips;
delete from recipe_ingredients where recipe_id = 'milchreis-apfel-zimt';
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('milchreis-apfel-zimt', 'milchreis', 250, 'g', null, false, 0);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('milchreis-apfel-zimt', 'milch', 1000, 'ml', null, false, 1);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('milchreis-apfel-zimt', 'apfel', 4, 'Stk', null, false, 2);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('milchreis-apfel-zimt', 'zimt', 2, 'TL', null, false, 3);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('milchreis-apfel-zimt', 'vanille', 1, 'Prise', null, false, 4);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('milchreis-apfel-zimt', 'butter', 20, 'g', null, false, 5);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('milchreis-apfel-zimt', 'wasser', 100, 'ml', null, false, 6);
insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ('milchreis-apfel-zimt', 'salz', 1, 'Prise', null, false, 7);

commit;

/**
 * Erzeugt supabase/seed.sql aus den Rezeptdaten der App.
 *
 * Aufruf:  npm run seed
 *
 * Damit müssen Rezepte nur an einer Stelle gepflegt werden (src/data/*.ts);
 * die Datei für die Datenbank entsteht daraus automatisch neu.
 */
import { writeFileSync } from 'node:fs';
import { INGREDIENTS } from '../src/data/ingredients.ts';
import { RECIPES } from '../src/data/recipes.ts';
import { sqlBool as bool, sqlJson as jsonb, sqlText as q, sqlTextArray as textArray } from '../src/lib/sql.ts';

const lines: string[] = [
  '-- ============================================================================',
  '-- Essens App – Grunddaten (Zutaten und Rezepte)',
  '--',
  '-- AUTOMATISCH ERZEUGT von scripts/generate-seed.ts – nicht von Hand ändern.',
  '-- Neu erzeugen mit:  npm run seed',
  '--',
  '-- Anwenden: Supabase -> SQL Editor -> einfügen -> Run (nach schema.sql).',
  '-- Mehrfaches Ausführen ist unschädlich (vorhandene Einträge werden aktualisiert).',
  '-- ============================================================================',
  '',
  'begin;',
  '',
  '-- ------------------------------------------------------------- Zutaten',
];

for (const ing of INGREDIENTS) {
  lines.push(
    `insert into ingredients (id, name, category, pantry) values ` +
      `(${q(ing.id)}, ${q(ing.name)}, ${q(ing.category)}, ${bool(Boolean(ing.pantry))}) ` +
      `on conflict (id) do update set name = excluded.name, category = excluded.category, pantry = excluded.pantry;`,
  );
}

lines.push('', '-- ------------------------------------------------------------- Rezepte');

for (const recipe of RECIPES) {
  lines.push(
    '',
    `-- ${recipe.name}`,
    `insert into recipes (id, name, description, placeholder_emoji, placeholder_tone, base_servings,`,
    `  time_minutes, difficulty, steps, kcal, protein, carbs, fat, categories,`,
    `  no_added_sugar, kid_friendly, one_pot, tips, household_id) values (`,
    `  ${q(recipe.id)}, ${q(recipe.name)}, ${q(recipe.description)},`,
    `  ${q(recipe.placeholder.emoji)}, ${q(recipe.placeholder.tone)}, ${recipe.baseServings},`,
    `  ${recipe.timeMinutes}, ${q(recipe.difficulty)}, ${jsonb(recipe.steps)},`,
    `  ${recipe.nutrition.kcal}, ${recipe.nutrition.protein}, ${recipe.nutrition.carbs}, ${recipe.nutrition.fat},`,
    `  ${textArray(recipe.categories)},`,
    `  ${bool(recipe.noAddedSugar)}, ${bool(recipe.kidFriendly)}, ${bool(recipe.onePot)}, ${q(recipe.tips)}, null)`,
    `on conflict (id) do update set`,
    `  name = excluded.name, description = excluded.description, steps = excluded.steps,`,
    `  time_minutes = excluded.time_minutes, difficulty = excluded.difficulty,`,
    `  kcal = excluded.kcal, protein = excluded.protein, carbs = excluded.carbs, fat = excluded.fat,`,
    `  categories = excluded.categories, one_pot = excluded.one_pot, tips = excluded.tips;`,
    `delete from recipe_ingredients where recipe_id = ${q(recipe.id)};`,
  );

  recipe.ingredients.forEach((ri, index) => {
    lines.push(
      `insert into recipe_ingredients (recipe_id, ingredient_id, amount, unit, note, skip_shopping, position) values ` +
        `(${q(recipe.id)}, ${q(ri.ingredientId)}, ${ri.amount}, ${q(ri.unit)}, ${q(ri.note)}, ` +
        `${bool(Boolean(ri.skipShopping))}, ${index});`,
    );
  });
}

lines.push('', 'commit;', '');

writeFileSync(new URL('../supabase/seed.sql', import.meta.url), lines.join('\n'), 'utf8');
console.log(
  `supabase/seed.sql erzeugt: ${INGREDIENTS.length} Zutaten, ${RECIPES.length} Rezepte.`,
);

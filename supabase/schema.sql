-- ============================================================================
-- Essens App – Datenbankschema für Supabase (PostgreSQL)
--
-- Anwenden: Supabase-Projekt öffnen -> SQL Editor -> Inhalt dieser Datei
-- einfügen -> "Run". Danach supabase/seed.sql ausführen (Rezepte & Zutaten).
--
-- Grundidee: Alles gehört einem HAUSHALT, nicht einer einzelnen Person.
-- So sehen beide Erwachsene dieselbe Einkaufsliste und denselben Wochenplan.
-- ============================================================================

-- ---------------------------------------------------------------- Haushalte

create table if not exists households (
  id          uuid primary key default gen_random_uuid(),
  name        text not null default 'Familie',
  adults      smallint not null default 2 check (adults between 1 and 10),
  kids        smallint not null default 2 check (kids between 0 and 10),
  created_at  timestamptz not null default now()
);

comment on table households is 'Eine Familie. Alle Daten hängen am Haushalt, nicht am einzelnen Konto.';

-- Nutzerprofil, verknüpft ein Anmeldekonto mit einem Haushalt.
create table if not exists profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  household_id  uuid not null references households (id) on delete cascade,
  display_name  text,
  created_at    timestamptz not null default now()
);

create index if not exists profiles_household_idx on profiles (household_id);

-- Haushalt der angemeldeten Person. Wird in allen Regeln unten verwendet.
create or replace function current_household_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select household_id from profiles where id = auth.uid();
$$;

-- Beim ersten Anmelden automatisch Haushalt + Profil anlegen.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_household uuid;
begin
  insert into households default values returning id into new_household;
  insert into profiles (id, household_id, display_name)
  values (new.id, new_household, coalesce(new.raw_user_meta_data ->> 'name', 'Familie'));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ------------------------------------------------------- Zutaten & Rezepte

create table if not exists ingredients (
  id          text primary key,                    -- Slug, z. B. 'zwiebel'
  name        text not null,
  category    text not null check (category in (
                'obst-gemuese','fleisch','milchprodukte','eier','getreide',
                'konserven','gewuerze','tiefkuehl','sonstiges')),
  pantry      boolean not null default false,      -- Vorratszutat (Salz, Öl …)
  gtin        text,                                -- für spätere Händleranbindung
  vendor_refs jsonb not null default '[]'::jsonb,  -- Produkt-IDs je Lieferdienst
  created_at  timestamptz not null default now()
);

comment on column ingredients.id is 'Merge-Schlüssel: gleiche id wird in der Einkaufsliste zusammengerechnet.';

create table if not exists recipes (
  id                text primary key,              -- Slug, z. B. 'one-pot-bolognese-nudeln'
  name              text not null,
  description       text not null default '',
  image_url         text,
  placeholder_emoji text not null default '🍽️',
  placeholder_tone  text not null default 'green',
  base_servings     smallint not null default 4 check (base_servings > 0),
  time_minutes      smallint not null check (time_minutes > 0),
  difficulty        text not null check (difficulty in ('einfach','mittel','anspruchsvoll')),
  steps             jsonb not null default '[]'::jsonb,   -- Array aus Texten
  kcal              integer not null default 0,
  protein           integer not null default 0,
  carbs             integer not null default 0,
  fat               integer not null default 0,
  categories        text[] not null default '{}',
  no_added_sugar    boolean not null default true,
  kid_friendly      boolean not null default true,
  one_pot           boolean not null default false,
  tips              text,
  -- NULL = mitgeliefertes Rezept für alle. Gesetzt = eigenes Rezept dieser Familie
  -- (z. B. später von Claude erzeugt).
  household_id      uuid references households (id) on delete cascade,
  created_at        timestamptz not null default now()
);

create index if not exists recipes_household_idx on recipes (household_id);

create table if not exists recipe_ingredients (
  id            uuid primary key default gen_random_uuid(),
  recipe_id     text not null references recipes (id) on delete cascade,
  ingredient_id text not null references ingredients (id),
  amount        numeric(10,2) not null check (amount > 0),
  unit          text not null,
  note          text,
  skip_shopping boolean not null default false,
  position      smallint not null default 0
);

create index if not exists recipe_ingredients_recipe_idx on recipe_ingredients (recipe_id);

-- ------------------------------------------------ Favoriten & Bewertungen

create table if not exists favorites (
  household_id uuid not null references households (id) on delete cascade,
  recipe_id    text not null references recipes (id) on delete cascade,
  created_by   uuid references auth.users (id) on delete set null,
  created_at   timestamptz not null default now(),
  primary key (household_id, recipe_id)
);

create table if not exists ratings (
  id           uuid primary key default gen_random_uuid(),
  household_id uuid not null references households (id) on delete cascade,
  recipe_id    text not null references recipes (id) on delete cascade,
  created_by   uuid references auth.users (id) on delete set null,
  stars        smallint not null check (stars between 1 and 5),
  kids_liked   boolean,                            -- NULL = keine Angabe
  comment      text,
  created_at   timestamptz not null default now()
);

create index if not exists ratings_recipe_idx on ratings (household_id, recipe_id);

-- ----------------------------------------------------------- Einkaufsliste

create table if not exists shopping_lists (
  id           uuid primary key default gen_random_uuid(),
  household_id uuid not null references households (id) on delete cascade,
  name         text not null default 'Einkaufsliste',
  updated_at   timestamptz not null default now()
);

create index if not exists shopping_lists_household_idx on shopping_lists (household_id);

create table if not exists shopping_list_items (
  id            uuid primary key default gen_random_uuid(),
  list_id       uuid not null references shopping_lists (id) on delete cascade,
  ingredient_id text not null references ingredients (id),
  -- Menge immer in der Basiseinheit (g / ml / Stk / TL), damit Positionen
  -- aus verschiedenen Rezepten verlustfrei addiert werden können.
  amount        numeric(10,2) not null check (amount >= 0),
  unit          text not null,
  checked       boolean not null default false,
  manual        boolean not null default false,
  sources       jsonb not null default '[]'::jsonb, -- [{recipeId, servings}]
  created_at    timestamptz not null default now(),
  -- Eine Zutat kommt je Liste und Einheit nur einmal vor – das erzwingt das
  -- Zusammenrechnen auch auf Datenbankebene.
  unique (list_id, ingredient_id, unit)
);

create index if not exists shopping_list_items_list_idx on shopping_list_items (list_id);

-- -------------------------------------------------------------- Wochenplan

create table if not exists weekly_plans (
  id           uuid primary key default gen_random_uuid(),
  household_id uuid not null references households (id) on delete cascade,
  week_start   date not null,                       -- Montag der Woche
  created_at   timestamptz not null default now(),
  unique (household_id, week_start)
);

create table if not exists weekly_plan_items (
  id        uuid primary key default gen_random_uuid(),
  plan_id   uuid not null references weekly_plans (id) on delete cascade,
  day       text not null check (day in ('mo','di','mi','do','fr','sa','so')),
  slot      text not null check (slot in ('fruehstueck','mittag','abend')),
  recipe_id text not null references recipes (id) on delete cascade,
  servings  smallint not null default 4 check (servings > 0),
  unique (plan_id, day, slot)
);

-- ============================================================================
-- Zugriffsschutz (Row Level Security)
-- Regel: Man sieht und ändert ausschließlich Daten des eigenen Haushalts.
-- ============================================================================

alter table households          enable row level security;
alter table profiles            enable row level security;
alter table ingredients         enable row level security;
alter table recipes             enable row level security;
alter table recipe_ingredients  enable row level security;
alter table favorites           enable row level security;
alter table ratings             enable row level security;
alter table shopping_lists      enable row level security;
alter table shopping_list_items enable row level security;
alter table weekly_plans        enable row level security;
alter table weekly_plan_items   enable row level security;

-- Eigener Haushalt und eigenes Profil
create policy households_select on households for select
  using (id = current_household_id());
create policy households_update on households for update
  using (id = current_household_id());

create policy profiles_select on profiles for select
  using (household_id = current_household_id());
create policy profiles_update on profiles for update
  using (id = auth.uid());

-- Zutaten und mitgelieferte Rezepte darf jede angemeldete Person lesen.
create policy ingredients_read on ingredients for select
  to authenticated using (true);

create policy recipes_read on recipes for select
  to authenticated using (household_id is null or household_id = current_household_id());
create policy recipes_write on recipes for all
  using (household_id = current_household_id())
  with check (household_id = current_household_id());

create policy recipe_ingredients_read on recipe_ingredients for select
  to authenticated using (
    exists (select 1 from recipes r
            where r.id = recipe_id
              and (r.household_id is null or r.household_id = current_household_id()))
  );
create policy recipe_ingredients_write on recipe_ingredients for all
  using (
    exists (select 1 from recipes r where r.id = recipe_id and r.household_id = current_household_id())
  )
  with check (
    exists (select 1 from recipes r where r.id = recipe_id and r.household_id = current_household_id())
  );

-- Haushaltsdaten
create policy favorites_all on favorites for all
  using (household_id = current_household_id())
  with check (household_id = current_household_id());

create policy ratings_all on ratings for all
  using (household_id = current_household_id())
  with check (household_id = current_household_id());

create policy shopping_lists_all on shopping_lists for all
  using (household_id = current_household_id())
  with check (household_id = current_household_id());

create policy shopping_list_items_all on shopping_list_items for all
  using (exists (select 1 from shopping_lists l
                 where l.id = list_id and l.household_id = current_household_id()))
  with check (exists (select 1 from shopping_lists l
                      where l.id = list_id and l.household_id = current_household_id()));

create policy weekly_plans_all on weekly_plans for all
  using (household_id = current_household_id())
  with check (household_id = current_household_id());

create policy weekly_plan_items_all on weekly_plan_items for all
  using (exists (select 1 from weekly_plans p
                 where p.id = plan_id and p.household_id = current_household_id()))
  with check (exists (select 1 from weekly_plans p
                      where p.id = plan_id and p.household_id = current_household_id()));

-- ============================================================================
-- Tabellenrechte
--
-- In einem Supabase-Projekt bekommen neue Tabellen diese Rechte automatisch.
-- Hier stehen sie trotzdem ausdrücklich, damit das Schema auch für sich allein
-- vollständig ist. Geschützt wird weiterhin über die Regeln oben: die Rechte
-- erlauben den Zugriff auf die Tabelle, die Regeln entscheiden über die Zeilen.
-- ============================================================================

grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on
  households, profiles, recipes, recipe_ingredients, favorites, ratings,
  shopping_lists, shopping_list_items, weekly_plans, weekly_plan_items
  to authenticated;

grant select on ingredients to authenticated;

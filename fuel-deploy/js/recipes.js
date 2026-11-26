/* =============================================
   FUEL — Recipe Database
   Recipes for the meal-plan generator.
   Names and steps are bilingual: name_en/name_ru, steps_en/steps_ru.
   Each recipe has: cuisine, complexity, time, cost (1-3),
   meal type, and a list of ingredients (foodId + grams).
   Macros are auto-computed from ingredients.
============================================= */

const RECIPES = [
  // ===== BREAKFAST =====
  {
    id: 'oats-banana',
    name_en: 'Oatmeal with banana & honey',
    name_ru: 'Овсянка с бананом и мёдом',
    emoji: '🥣',
    cuisine: 'universal',
    meal: 'breakfast',
    complexity: 1, // 1=easy 2=medium 3=hard
    time: 10, // minutes
    cost: 1,   // 1=cheap 2=mid 3=expensive
    servings: 1,
    ingredients: [
      { foodId: 'oats', amount: 50 },
      { foodId: 'banana', amount: 100 },
      { foodId: 'honey', amount: 10 },
      { foodId: 'milk-skim', amount: 200 }
    ],
    steps_en: [
      'Bring milk to a gentle simmer.',
      'Add oats, cook for 5 minutes stirring occasionally.',
      'Top with sliced banana and honey.'
    ],
    steps_ru: [
      'Доведите молоко до лёгкого кипения.',
      'Всыпьте овсяные хлопья и варите 5 минут, помешивая.',
      'Сверху выложите нарезанный банан и полейте мёдом.'
    ]
  },
  {
    id: 'syrniki-honey',
    name_en: 'Syrniki with honey',
    name_ru: 'Сырники с мёдом',
    emoji: '🥞',
    cuisine: 'russian',
    meal: 'breakfast',
    complexity: 2,
    time: 25,
    cost: 1,
    servings: 1,
    ingredients: [
      { foodId: 'cottage-cheese', amount: 200 },
      { foodId: 'egg', amount: 1 },
      { foodId: 'oats', amount: 20 },
      { foodId: 'honey', amount: 15 },
      { foodId: 'sour-cream', amount: 30 }
    ],
    steps_en: [
      'Mix cottage cheese, egg, and oats into a dough.',
      'Form into small patties.',
      'Fry on medium heat until golden, ~3 min per side.',
      'Serve with sour cream and honey.'
    ],
    steps_ru: [
      'Смешайте творог, яйцо и овсяные хлопья в однородное тесто.',
      'Сформируйте небольшие сырники.',
      'Обжарьте на среднем огне до золотистой корочки, около 3 минут с каждой стороны.',
      'Подавайте со сметаной и мёдом.'
    ]
  },
  {
    id: 'omelette-veg',
    name_en: 'Veggie omelette',
    name_ru: 'Омлет с овощами',
    emoji: '🍳',
    cuisine: 'universal',
    meal: 'breakfast',
    complexity: 1,
    time: 10,
    cost: 1,
    servings: 1,
    ingredients: [
      { foodId: 'egg', amount: 3 },
      { foodId: 'tomato', amount: 80 },
      { foodId: 'bell-pepper', amount: 50 },
      { foodId: 'spinach', amount: 30 },
      { foodId: 'olive-oil', amount: 5 }
    ],
    steps_en: [
      'Whisk eggs with a pinch of salt.',
      'Sauté chopped pepper and tomato in olive oil for 2 minutes.',
      'Pour eggs over veggies, add spinach.',
      'Cook on low until set, ~4 minutes.'
    ],
    steps_ru: [
      'Взбейте яйца со щепоткой соли.',
      'Обжарьте нарезанные перец и помидор на оливковом масле 2 минуты.',
      'Залейте овощи яйцами, добавьте шпинат.',
      'Готовьте на слабом огне до схватывания, около 4 минут.'
    ]
  },
  {
    id: 'greek-yogurt-bowl',
    name_en: 'Greek yogurt with berries',
    name_ru: 'Греческий йогурт с ягодами',
    emoji: '🫐',
    cuisine: 'universal',
    meal: 'breakfast',
    complexity: 1,
    time: 3,
    cost: 2,
    servings: 1,
    ingredients: [
      { foodId: 'greek-yogurt', amount: 200 },
      { foodId: 'blueberry', amount: 80 },
      { foodId: 'almonds', amount: 15 },
      { foodId: 'honey', amount: 10 }
    ],
    steps_en: [
      'Spoon yogurt into a bowl.',
      'Top with blueberries, almonds, and a drizzle of honey.'
    ],
    steps_ru: [
      'Выложите йогурт в миску.',
      'Добавьте голубику, миндаль и немного мёда.'
    ]
  },
  {
    id: 'khachapuri-egg',
    name_en: 'Khachapuri with egg',
    name_ru: 'Хачапури с яйцом',
    emoji: '🫓',
    cuisine: 'caucasian',
    meal: 'breakfast',
    complexity: 3,
    time: 50,
    cost: 2,
    servings: 1,
    ingredients: [
      { foodId: 'khachapuri', amount: 200 },
      { foodId: 'egg', amount: 1 }
    ],
    steps_en: [
      'Heat khachapuri in oven at 180°C for 8 minutes.',
      'Crack an egg into the center cavity.',
      'Bake another 4 minutes until egg is set but yolk runny.'
    ],
    steps_ru: [
      'Разогрейте хачапури в духовке при 180°C 8 минут.',
      'Разбейте яйцо в углубление в центре.',
      'Запекайте ещё 4 минуты, чтобы белок схватился, а желток остался жидким.'
    ]
  },

  // ===== LUNCH =====
  {
    id: 'chicken-rice-broccoli',
    name_en: 'Chicken, rice & broccoli',
    name_ru: 'Курица с рисом и брокколи',
    emoji: '🍱',
    cuisine: 'universal',
    meal: 'lunch',
    complexity: 1,
    time: 30,
    cost: 2,
    servings: 1,
    ingredients: [
      { foodId: 'chicken-breast', amount: 200 },
      { foodId: 'rice-white', amount: 200 },
      { foodId: 'broccoli', amount: 150 },
      { foodId: 'olive-oil', amount: 10 }
    ],
    steps_en: [
      'Season chicken breast with salt and pepper.',
      'Cook rice according to package.',
      'Steam broccoli for 5 minutes.',
      'Pan-fry chicken in olive oil, 6 min per side.',
      'Slice chicken, plate with rice and broccoli.'
    ],
    steps_ru: [
      'Посолите и поперчите куриную грудку.',
      'Сварите рис по инструкции на упаковке.',
      'Приготовьте брокколи на пару 5 минут.',
      'Обжарьте курицу на оливковом масле, по 6 минут с каждой стороны.',
      'Нарежьте курицу и выложите на тарелку с рисом и брокколи.'
    ]
  },
  {
    id: 'borscht-bowl',
    name_en: 'Borscht with sour cream',
    name_ru: 'Борщ со сметаной',
    emoji: '🍲',
    cuisine: 'russian',
    meal: 'lunch',
    complexity: 3,
    time: 90,
    cost: 1,
    servings: 1,
    ingredients: [
      { foodId: 'borscht', amount: 400 },
      { foodId: 'sour-cream', amount: 30 },
      { foodId: 'bread-rye', amount: 50 }
    ],
    steps_en: [
      'Heat borscht to a simmer.',
      'Ladle into a bowl.',
      'Top with sour cream and serve with rye bread.'
    ],
    steps_ru: [
      'Разогрейте борщ до лёгкого кипения.',
      'Налейте в тарелку.',
      'Добавьте сметану, подавайте с ржаным хлебом.'
    ]
  },
  {
    id: 'buckwheat-meat',
    name_en: 'Buckwheat with beef',
    name_ru: 'Гречка с говядиной',
    emoji: '🌾',
    cuisine: 'russian',
    meal: 'lunch',
    complexity: 2,
    time: 35,
    cost: 1,
    servings: 1,
    ingredients: [
      { foodId: 'buckwheat', amount: 200 },
      { foodId: 'beef-lean', amount: 150 },
      { foodId: 'onion', amount: 50 },
      { foodId: 'carrot', amount: 50 },
      { foodId: 'sunflower-oil', amount: 10 }
    ],
    steps_en: [
      'Cook buckwheat according to package.',
      'Sauté chopped onion and carrot in oil for 5 minutes.',
      'Add diced beef, cook until browned, 8 minutes.',
      'Combine with buckwheat and serve.'
    ],
    steps_ru: [
      'Сварите гречку по инструкции на упаковке.',
      'Обжарьте нарезанные лук и морковь на масле 5 минут.',
      'Добавьте говядину кубиками и обжаривайте до румяности, 8 минут.',
      'Смешайте с гречкой и подавайте.'
    ]
  },
  {
    id: 'shashlik-veg',
    name_en: 'Shashlik with grilled veggies',
    name_ru: 'Шашлык с овощами на гриле',
    emoji: '🍢',
    cuisine: 'caucasian',
    meal: 'lunch',
    complexity: 2,
    time: 40,
    cost: 2,
    servings: 1,
    ingredients: [
      { foodId: 'shashlik', amount: 250 },
      { foodId: 'eggplant', amount: 100 },
      { foodId: 'bell-pepper', amount: 80 },
      { foodId: 'tomato', amount: 80 },
      { foodId: 'lavash', amount: 60 }
    ],
    steps_en: [
      'Grill shashlik skewers for 12-15 minutes, turning often.',
      'Slice eggplant, pepper, tomato; grill alongside until charred.',
      'Serve with warm lavash.'
    ],
    steps_ru: [
      'Жарьте шашлык на гриле 12-15 минут, часто переворачивая.',
      'Нарежьте баклажан, перец и помидор и обжарьте рядом до подпалин.',
      'Подавайте с тёплым лавашом.'
    ]
  },
  {
    id: 'lobio-bowl',
    name_en: 'Lobio with herbs',
    name_ru: 'Лобио с зеленью',
    emoji: '🫘',
    cuisine: 'caucasian',
    meal: 'lunch',
    complexity: 2,
    time: 60,
    cost: 1,
    servings: 1,
    ingredients: [
      { foodId: 'lobio', amount: 350 },
      { foodId: 'lavash', amount: 60 },
      { foodId: 'walnuts', amount: 20 }
    ],
    steps_en: [
      'Heat lobio gently with a splash of water if thick.',
      'Top with crushed walnuts.',
      'Serve with warm lavash.'
    ],
    steps_ru: [
      'Аккуратно разогрейте лобио, если густое, добавьте немного воды.',
      'Посыпьте измельчёнными грецкими орехами.',
      'Подавайте с тёплым лавашом.'
    ]
  },
  {
    id: 'tuna-salad-bowl',
    name_en: 'Tuna power bowl',
    name_ru: 'Боул с тунцом',
    emoji: '🥗',
    cuisine: 'universal',
    meal: 'lunch',
    complexity: 1,
    time: 10,
    cost: 2,
    servings: 1,
    ingredients: [
      { foodId: 'tuna-canned', amount: 150 },
      { foodId: 'quinoa', amount: 150 },
      { foodId: 'avocado', amount: 80 },
      { foodId: 'spinach', amount: 50 },
      { foodId: 'olive-oil', amount: 10 }
    ],
    steps_en: [
      'Drain tuna.',
      'Layer cooked quinoa, spinach, avocado slices in a bowl.',
      'Top with tuna and a drizzle of olive oil.'
    ],
    steps_ru: [
      'Слейте жидкость с тунца.',
      'Выложите в миску слоями варёную киноа, шпинат и ломтики авокадо.',
      'Сверху тунец и немного оливкового масла.'
    ]
  },
  {
    id: 'lentil-soup',
    name_en: 'Hearty lentil soup',
    name_ru: 'Сытный чечевичный суп',
    emoji: '🍲',
    cuisine: 'universal',
    meal: 'lunch',
    complexity: 2,
    time: 45,
    cost: 1,
    servings: 1,
    ingredients: [
      { foodId: 'lentils', amount: 300 },
      { foodId: 'carrot', amount: 50 },
      { foodId: 'onion', amount: 50 },
      { foodId: 'olive-oil', amount: 10 },
      { foodId: 'bread-whole', amount: 50 }
    ],
    steps_en: [
      'Sauté chopped onion and carrot in olive oil for 5 minutes.',
      'Add lentils and 500ml water, simmer 30 minutes.',
      'Season with salt and pepper.',
      'Serve with whole wheat bread.'
    ],
    steps_ru: [
      'Обжарьте нарезанные лук и морковь на оливковом масле 5 минут.',
      'Добавьте чечевицу и 500 мл воды, варите 30 минут.',
      'Посолите и поперчите.',
      'Подавайте с цельнозерновым хлебом.'
    ]
  },

  // ===== DINNER =====
  {
    id: 'salmon-asparagus',
    name_en: 'Salmon with asparagus',
    name_ru: 'Лосось со спаржей',
    emoji: '🐟',
    cuisine: 'universal',
    meal: 'dinner',
    complexity: 2,
    time: 25,
    cost: 3,
    servings: 1,
    ingredients: [
      { foodId: 'salmon', amount: 200 },
      { foodId: 'asparagus', amount: 150 },
      { foodId: 'sweet-potato', amount: 200 },
      { foodId: 'olive-oil', amount: 10 }
    ],
    steps_en: [
      'Preheat oven to 200°C.',
      'Toss asparagus and sweet potato with oil.',
      'Roast veggies 15 minutes.',
      'Add seasoned salmon, roast another 10 minutes.'
    ],
    steps_ru: [
      'Разогрейте духовку до 200°C.',
      'Перемешайте спаржу и батат с маслом.',
      'Запекайте овощи 15 минут.',
      'Добавьте приправленный лосось и запекайте ещё 10 минут.'
    ]
  },
  {
    id: 'beef-stroganoff-pasta',
    name_en: 'Beef stroganoff with pasta',
    name_ru: 'Бефстроганов с макаронами',
    emoji: '🍖',
    cuisine: 'russian',
    meal: 'dinner',
    complexity: 3,
    time: 50,
    cost: 2,
    servings: 1,
    ingredients: [
      { foodId: 'beef-stroganoff', amount: 250 },
      { foodId: 'pasta', amount: 200 }
    ],
    steps_en: [
      'Heat stroganoff gently in a pan.',
      'Cook pasta al dente.',
      'Plate pasta, top with stroganoff.'
    ],
    steps_ru: [
      'Аккуратно разогрейте бефстроганов на сковороде.',
      'Сварите макароны аль денте.',
      'Выложите макароны на тарелку, сверху бефстроганов.'
    ]
  },
  {
    id: 'khinkali-dinner',
    name_en: 'Khinkali (8 pcs)',
    name_ru: 'Хинкали (8 шт)',
    emoji: '🥟',
    cuisine: 'caucasian',
    meal: 'dinner',
    complexity: 2,
    time: 25,
    cost: 2,
    servings: 1,
    ingredients: [
      { foodId: 'khinkali', amount: 320 }
    ],
    steps_en: [
      'Bring a large pot of salted water to a boil.',
      'Drop khinkali in carefully, stir gently.',
      'Boil 12 minutes until they float and tops are firm.',
      'Sprinkle with black pepper and serve.'
    ],
    steps_ru: [
      'Доведите до кипения большую кастрюлю подсоленной воды.',
      'Аккуратно опустите хинкали и осторожно перемешайте.',
      'Варите 12 минут, пока не всплывут и хвостики не станут плотными.',
      'Поперчите чёрным перцем и подавайте.'
    ]
  },
  {
    id: 'satsivi-rice',
    name_en: 'Satsivi with rice',
    name_ru: 'Сациви с рисом',
    emoji: '🍗',
    cuisine: 'caucasian',
    meal: 'dinner',
    complexity: 3,
    time: 60,
    cost: 2,
    servings: 1,
    ingredients: [
      { foodId: 'satsivi', amount: 250 },
      { foodId: 'rice-white', amount: 150 },
      { foodId: 'pomegranate', amount: 50 }
    ],
    steps_en: [
      'Reheat satsivi gently — do not boil the walnut sauce.',
      'Cook rice.',
      'Plate, garnish with pomegranate seeds.'
    ],
    steps_ru: [
      'Аккуратно разогрейте сациви, не доводя ореховый соус до кипения.',
      'Сварите рис.',
      'Выложите на тарелку и украсьте зёрнами граната.'
    ]
  },
  {
    id: 'turkey-quinoa',
    name_en: 'Turkey quinoa bowl',
    name_ru: 'Боул с индейкой и киноа',
    emoji: '🦃',
    cuisine: 'universal',
    meal: 'dinner',
    complexity: 1,
    time: 25,
    cost: 2,
    servings: 1,
    ingredients: [
      { foodId: 'turkey-breast', amount: 200 },
      { foodId: 'quinoa', amount: 150 },
      { foodId: 'zucchini', amount: 100 },
      { foodId: 'tomato', amount: 80 },
      { foodId: 'olive-oil', amount: 10 }
    ],
    steps_en: [
      'Cook quinoa.',
      'Pan-fry sliced turkey 4 min per side.',
      'Sauté diced zucchini and tomato 5 minutes.',
      'Plate quinoa, top with turkey and veggies.'
    ],
    steps_ru: [
      'Сварите киноа.',
      'Обжарьте нарезанную индейку, по 4 минуты с каждой стороны.',
      'Обжарьте кабачок и помидор кубиками 5 минут.',
      'Выложите киноа, сверху индейку и овощи.'
    ]
  },
  {
    id: 'cod-potato',
    name_en: 'Baked cod with potatoes',
    name_ru: 'Треска, запечённая с картофелем',
    emoji: '🐟',
    cuisine: 'universal',
    meal: 'dinner',
    complexity: 2,
    time: 40,
    cost: 2,
    servings: 1,
    ingredients: [
      { foodId: 'cod', amount: 200 },
      { foodId: 'potato', amount: 250 },
      { foodId: 'lemon', amount: 30 },
      { foodId: 'olive-oil', amount: 10 }
    ],
    steps_en: [
      'Preheat oven to 200°C.',
      'Cube potatoes, toss with oil, roast 20 minutes.',
      'Add cod with lemon slices, bake 12 more minutes.'
    ],
    steps_ru: [
      'Разогрейте духовку до 200°C.',
      'Нарежьте картофель кубиками, перемешайте с маслом и запекайте 20 минут.',
      'Добавьте треску с ломтиками лимона и запекайте ещё 12 минут.'
    ]
  },
  {
    id: 'beef-veg-skillet',
    name_en: 'Ground beef veggie skillet',
    name_ru: 'Фарш с овощами на сковороде',
    emoji: '🥘',
    cuisine: 'universal',
    meal: 'dinner',
    complexity: 1,
    time: 25,
    cost: 1,
    servings: 1,
    ingredients: [
      { foodId: 'beef-ground', amount: 200 },
      { foodId: 'potato', amount: 200 },
      { foodId: 'onion', amount: 50 },
      { foodId: 'cabbage', amount: 100 },
      { foodId: 'sunflower-oil', amount: 10 }
    ],
    steps_en: [
      'Brown ground beef in a skillet, drain excess fat.',
      'Add diced onion, cook 3 minutes.',
      'Add cubed potato and shredded cabbage, season.',
      'Cover, simmer 15 minutes until potato is tender.'
    ],
    steps_ru: [
      'Обжарьте говяжий фарш на сковороде, слейте лишний жир.',
      'Добавьте нарезанный лук и готовьте 3 минуты.',
      'Добавьте картофель кубиками и нашинкованную капусту, приправьте.',
      'Накройте крышкой и тушите 15 минут до мягкости картофеля.'
    ]
  },

  // ===== SNACKS =====
  {
    id: 'cottage-cheese-fruit',
    name_en: 'Cottage cheese with fruit',
    name_ru: 'Творог с фруктами',
    emoji: '🍓',
    cuisine: 'universal',
    meal: 'snack',
    complexity: 1,
    time: 2,
    cost: 1,
    servings: 1,
    ingredients: [
      { foodId: 'cottage-cheese', amount: 150 },
      { foodId: 'strawberry', amount: 80 }
    ],
    steps_en: [
      'Spoon cottage cheese into a bowl.',
      'Top with sliced strawberries.'
    ],
    steps_ru: [
      'Выложите творог в миску.',
      'Добавьте нарезанную клубнику.'
    ]
  },
  {
    id: 'protein-shake-banana',
    name_en: 'Protein shake with banana',
    name_ru: 'Протеиновый коктейль с бананом',
    emoji: '🥤',
    cuisine: 'universal',
    meal: 'snack',
    complexity: 1,
    time: 3,
    cost: 2,
    servings: 1,
    ingredients: [
      { foodId: 'protein-shake', amount: 1 },
      { foodId: 'banana', amount: 100 },
      { foodId: 'peanut-butter', amount: 15 }
    ],
    steps_en: [
      'Blend protein shake, banana, and peanut butter until smooth.'
    ],
    steps_ru: [
      'Взбейте в блендере протеиновый коктейль, банан и арахисовую пасту до однородности.'
    ]
  },
  {
    id: 'apple-pb',
    name_en: 'Apple slices with peanut butter',
    name_ru: 'Яблоко с арахисовой пастой',
    emoji: '🍎',
    cuisine: 'universal',
    meal: 'snack',
    complexity: 1,
    time: 2,
    cost: 1,
    servings: 1,
    ingredients: [
      { foodId: 'apple', amount: 150 },
      { foodId: 'peanut-butter', amount: 20 }
    ],
    steps_en: [
      'Slice apple.',
      'Serve with peanut butter for dipping.'
    ],
    steps_ru: [
      'Нарежьте яблоко дольками.',
      'Подавайте с арахисовой пастой.'
    ]
  },
  {
    id: 'hummus-veg',
    name_en: 'Hummus with veggie sticks',
    name_ru: 'Хумус с овощными палочками',
    emoji: '🥕',
    cuisine: 'caucasian',
    meal: 'snack',
    complexity: 1,
    time: 5,
    cost: 1,
    servings: 1,
    ingredients: [
      { foodId: 'hummus', amount: 80 },
      { foodId: 'carrot', amount: 80 },
      { foodId: 'cucumber', amount: 80 }
    ],
    steps_en: [
      'Cut carrot and cucumber into sticks.',
      'Serve with hummus.'
    ],
    steps_ru: [
      'Нарежьте морковь и огурец брусочками.',
      'Подавайте с хумусом.'
    ]
  },
  {
    id: 'walnuts-honey',
    name_en: 'Walnuts with honey',
    name_ru: 'Грецкие орехи с мёдом',
    emoji: '🌰',
    cuisine: 'caucasian',
    meal: 'snack',
    complexity: 1,
    time: 1,
    cost: 2,
    servings: 1,
    ingredients: [
      { foodId: 'walnuts', amount: 30 },
      { foodId: 'honey', amount: 15 }
    ],
    steps_en: [
      'Mix walnuts with honey in a small bowl.'
    ],
    steps_ru: [
      'Смешайте грецкие орехи с мёдом в небольшой миске.'
    ]
  },
  {
    id: 'kefir-glass',
    name_en: 'Glass of kefir',
    name_ru: 'Стакан кефира',
    emoji: '🥛',
    cuisine: 'russian',
    meal: 'snack',
    complexity: 1,
    time: 1,
    cost: 1,
    servings: 1,
    ingredients: [
      { foodId: 'kefir', amount: 250 }
    ],
    steps_en: [
      'Pour kefir into a glass and enjoy chilled.'
    ],
    steps_ru: [
      'Налейте кефир в стакан и пейте охлаждённым.'
    ]
  }
];

// Compute total macros for a recipe by summing ingredients
function recipeMacros(recipe) {
  const total = { kcal: 0, p: 0, c: 0, f: 0 };
  for (const ing of recipe.ingredients) {
    const m = computeMacros(ing.foodId, ing.amount);
    total.kcal += m.kcal;
    total.p += m.p;
    total.c += m.c;
    total.f += m.f;
  }
  return {
    kcal: Math.round(total.kcal / recipe.servings),
    p: Math.round(total.p / recipe.servings * 10) / 10,
    c: Math.round(total.c / recipe.servings * 10) / 10,
    f: Math.round(total.f / recipe.servings * 10) / 10
  };
}

// Cost per serving estimate (currency-agnostic, just relative scale)
// Used so the user can match recipes to a daily food budget.
// 1 = budget (~$3-5/serving), 2 = mid (~$5-10), 3 = premium ($10+).
function recipeCostLabel(cost) {
  return ['$', '$$', '$$$'][cost - 1] || '$';
}

function complexityLabel(c) {
  return t(['recipe.easy', 'recipe.medium', 'recipe.advanced'][c - 1] || 'recipe.easy');
}

function recipeName(r) {
  return (getLang() === 'ru' ? r.name_ru : r.name_en) || r.name_en;
}

function recipeSteps(r) {
  return (getLang() === 'ru' ? r.steps_ru : r.steps_en) || r.steps_en || [];
}

function cuisineLabel(c) {
  return t('cuisine.' + c);
}

// Legacy log entries (pre-v1.1.0) stored only the English recipe name
const RECIPE_BY_NAME_EN = Object.fromEntries(RECIPES.map(r => [r.name_en, r]));

// Filter & generate a meal plan
function filterRecipes(filters) {
  // filters: { cuisine, maxTime, maxComplexity, maxCost, meal }
  return RECIPES.filter(r => {
    if (filters.meal && r.meal !== filters.meal) return false;
    if (filters.cuisine && filters.cuisine !== 'any' && r.cuisine !== filters.cuisine && r.cuisine !== 'universal') return false;
    if (filters.maxTime && r.time > filters.maxTime) return false;
    if (filters.maxComplexity && r.complexity > filters.maxComplexity) return false;
    if (filters.maxCost && r.cost > filters.maxCost) return false;
    return true;
  });
}

// Generate a single day plan: 1 breakfast + 1 lunch + 1 dinner + 0-1 snack
// Targets the user's daily kcal goal within ~10%.
function generateDayPlan(filters, targetKcal) {
  const breakfasts = filterRecipes({ ...filters, meal: 'breakfast' });
  const lunches = filterRecipes({ ...filters, meal: 'lunch' });
  const dinners = filterRecipes({ ...filters, meal: 'dinner' });
  const snacks = filterRecipes({ ...filters, meal: 'snack' });

  if (breakfasts.length === 0 || lunches.length === 0 || dinners.length === 0) {
    return null; // not enough variety
  }

  // Try several random combinations and pick the closest to target
  let best = null;
  let bestDiff = Infinity;
  const tries = 50;

  for (let i = 0; i < tries; i++) {
    const b = breakfasts[Math.floor(Math.random() * breakfasts.length)];
    const l = lunches[Math.floor(Math.random() * lunches.length)];
    const d = dinners[Math.floor(Math.random() * dinners.length)];

    const baseTotal = recipeMacros(b).kcal + recipeMacros(l).kcal + recipeMacros(d).kcal;
    const remaining = targetKcal - baseTotal;
    let chosenSnack = null;

    // Add a snack if we're under target and there's room
    if (remaining > 100 && snacks.length > 0) {
      const candidates = snacks.filter(s => Math.abs(recipeMacros(s).kcal - remaining) < 250);
      if (candidates.length > 0) {
        chosenSnack = candidates[Math.floor(Math.random() * candidates.length)];
      }
    }

    const total = baseTotal + (chosenSnack ? recipeMacros(chosenSnack).kcal : 0);
    const diff = Math.abs(total - targetKcal);

    if (diff < bestDiff) {
      bestDiff = diff;
      best = { breakfast: b, lunch: l, dinner: d, snack: chosenSnack, totalKcal: total };
    }
  }

  return best;
}

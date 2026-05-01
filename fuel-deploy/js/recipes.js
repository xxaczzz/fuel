/* =============================================
   FUEL — Recipe Database
   Recipes for the meal-plan generator.
   Each recipe has: cuisine, complexity, time, cost (1-3),
   meal type, and a list of ingredients (foodId + grams).
   Macros are auto-computed from ingredients.
============================================= */

const RECIPES = [
  // ===== BREAKFAST =====
  {
    id: 'oats-banana',
    name: 'Oatmeal with banana & honey',
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
    steps: [
      'Bring milk to a gentle simmer.',
      'Add oats, cook for 5 minutes stirring occasionally.',
      'Top with sliced banana and honey.'
    ]
  },
  {
    id: 'syrniki-honey',
    name: 'Syrniki with honey',
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
    steps: [
      'Mix cottage cheese, egg, and oats into a dough.',
      'Form into small patties.',
      'Fry on medium heat until golden, ~3 min per side.',
      'Serve with sour cream and honey.'
    ]
  },
  {
    id: 'omelette-veg',
    name: 'Veggie omelette',
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
    steps: [
      'Whisk eggs with a pinch of salt.',
      'Sauté chopped pepper and tomato in olive oil for 2 minutes.',
      'Pour eggs over veggies, add spinach.',
      'Cook on low until set, ~4 minutes.'
    ]
  },
  {
    id: 'greek-yogurt-bowl',
    name: 'Greek yogurt with berries',
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
    steps: [
      'Spoon yogurt into a bowl.',
      'Top with blueberries, almonds, and a drizzle of honey.'
    ]
  },
  {
    id: 'khachapuri-egg',
    name: 'Khachapuri with egg',
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
    steps: [
      'Heat khachapuri in oven at 180°C for 8 minutes.',
      'Crack an egg into the center cavity.',
      'Bake another 4 minutes until egg is set but yolk runny.'
    ]
  },

  // ===== LUNCH =====
  {
    id: 'chicken-rice-broccoli',
    name: 'Chicken, rice & broccoli',
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
    steps: [
      'Season chicken breast with salt and pepper.',
      'Cook rice according to package.',
      'Steam broccoli for 5 minutes.',
      'Pan-fry chicken in olive oil, 6 min per side.',
      'Slice chicken, plate with rice and broccoli.'
    ]
  },
  {
    id: 'borscht-bowl',
    name: 'Borscht with sour cream',
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
    steps: [
      'Heat borscht to a simmer.',
      'Ladle into a bowl.',
      'Top with sour cream and serve with rye bread.'
    ]
  },
  {
    id: 'buckwheat-meat',
    name: 'Buckwheat with beef',
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
    steps: [
      'Cook buckwheat according to package.',
      'Sauté chopped onion and carrot in oil for 5 minutes.',
      'Add diced beef, cook until browned, 8 minutes.',
      'Combine with buckwheat and serve.'
    ]
  },
  {
    id: 'shashlik-veg',
    name: 'Shashlik with grilled veggies',
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
    steps: [
      'Grill shashlik skewers for 12-15 minutes, turning often.',
      'Slice eggplant, pepper, tomato; grill alongside until charred.',
      'Serve with warm lavash.'
    ]
  },
  {
    id: 'lobio-bowl',
    name: 'Lobio with herbs',
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
    steps: [
      'Heat lobio gently with a splash of water if thick.',
      'Top with crushed walnuts.',
      'Serve with warm lavash.'
    ]
  },
  {
    id: 'tuna-salad-bowl',
    name: 'Tuna power bowl',
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
    steps: [
      'Drain tuna.',
      'Layer cooked quinoa, spinach, avocado slices in a bowl.',
      'Top with tuna and a drizzle of olive oil.'
    ]
  },
  {
    id: 'lentil-soup',
    name: 'Hearty lentil soup',
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
    steps: [
      'Sauté chopped onion and carrot in olive oil for 5 minutes.',
      'Add lentils and 500ml water, simmer 30 minutes.',
      'Season with salt and pepper.',
      'Serve with whole wheat bread.'
    ]
  },

  // ===== DINNER =====
  {
    id: 'salmon-asparagus',
    name: 'Salmon with asparagus',
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
    steps: [
      'Preheat oven to 200°C.',
      'Toss asparagus and sweet potato with oil.',
      'Roast veggies 15 minutes.',
      'Add seasoned salmon, roast another 10 minutes.'
    ]
  },
  {
    id: 'beef-stroganoff-pasta',
    name: 'Beef stroganoff with pasta',
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
    steps: [
      'Heat stroganoff gently in a pan.',
      'Cook pasta al dente.',
      'Plate pasta, top with stroganoff.'
    ]
  },
  {
    id: 'khinkali-dinner',
    name: 'Khinkali (8 pcs)',
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
    steps: [
      'Bring a large pot of salted water to a boil.',
      'Drop khinkali in carefully, stir gently.',
      'Boil 12 minutes until they float and tops are firm.',
      'Sprinkle with black pepper and serve.'
    ]
  },
  {
    id: 'satsivi-rice',
    name: 'Satsivi with rice',
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
    steps: [
      'Reheat satsivi gently — do not boil the walnut sauce.',
      'Cook rice.',
      'Plate, garnish with pomegranate seeds.'
    ]
  },
  {
    id: 'turkey-quinoa',
    name: 'Turkey quinoa bowl',
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
    steps: [
      'Cook quinoa.',
      'Pan-fry sliced turkey 4 min per side.',
      'Sauté diced zucchini and tomato 5 minutes.',
      'Plate quinoa, top with turkey and veggies.'
    ]
  },
  {
    id: 'cod-potato',
    name: 'Baked cod with potatoes',
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
    steps: [
      'Preheat oven to 200°C.',
      'Cube potatoes, toss with oil, roast 20 minutes.',
      'Add cod with lemon slices, bake 12 more minutes.'
    ]
  },
  {
    id: 'beef-veg-skillet',
    name: 'Ground beef veggie skillet',
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
    steps: [
      'Brown ground beef in a skillet, drain excess fat.',
      'Add diced onion, cook 3 minutes.',
      'Add cubed potato and shredded cabbage, season.',
      'Cover, simmer 15 minutes until potato is tender.'
    ]
  },

  // ===== SNACKS =====
  {
    id: 'cottage-cheese-fruit',
    name: 'Cottage cheese with fruit',
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
    steps: [
      'Spoon cottage cheese into a bowl.',
      'Top with sliced strawberries.'
    ]
  },
  {
    id: 'protein-shake-banana',
    name: 'Protein shake with banana',
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
    steps: [
      'Blend protein shake, banana, and peanut butter until smooth.'
    ]
  },
  {
    id: 'apple-pb',
    name: 'Apple slices with peanut butter',
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
    steps: [
      'Slice apple.',
      'Serve with peanut butter for dipping.'
    ]
  },
  {
    id: 'hummus-veg',
    name: 'Hummus with veggie sticks',
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
    steps: [
      'Cut carrot and cucumber into sticks.',
      'Serve with hummus.'
    ]
  },
  {
    id: 'walnuts-honey',
    name: 'Walnuts with honey',
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
    steps: [
      'Mix walnuts with honey in a small bowl.'
    ]
  },
  {
    id: 'kefir-glass',
    name: 'Glass of kefir',
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
    steps: [
      'Pour kefir into a glass and enjoy chilled.'
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
  return ['Easy', 'Medium', 'Advanced'][c - 1] || 'Easy';
}

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

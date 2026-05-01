/* =============================================
   FUEL — Food Database
   Calorie & macro values per 100g (or per unit where noted).
   Curated list of ~140 common foods covering Russian, Caucasian,
   and Western cuisines.
============================================= */

// unit: 'g' = per 100g, 'ml' = per 100ml, 'piece' = per piece (with avgGrams for conversion)
// emoji is just for visual flair in lists
const FOODS = [
  // ===== PROTEINS — MEAT =====
  { id: 'chicken-breast', name: 'Chicken breast (cooked)', emoji: '🍗', cat: 'protein', kcal: 165, p: 31, c: 0, f: 3.6, unit: 'g', tags: ['meat','low-fat','high-protein'] },
  { id: 'chicken-thigh', name: 'Chicken thigh (cooked)', emoji: '🍗', cat: 'protein', kcal: 209, p: 26, c: 0, f: 11, unit: 'g', tags: ['meat'] },
  { id: 'beef-lean', name: 'Lean beef (cooked)', emoji: '🥩', cat: 'protein', kcal: 217, p: 27, c: 0, f: 12, unit: 'g', tags: ['meat','red-meat'] },
  { id: 'beef-ground', name: 'Ground beef 15% (cooked)', emoji: '🥩', cat: 'protein', kcal: 254, p: 26, c: 0, f: 17, unit: 'g', tags: ['meat'] },
  { id: 'pork-loin', name: 'Pork loin (cooked)', emoji: '🥩', cat: 'protein', kcal: 242, p: 27, c: 0, f: 14, unit: 'g', tags: ['meat'] },
  { id: 'lamb', name: 'Lamb (cooked)', emoji: '🥩', cat: 'protein', kcal: 294, p: 25, c: 0, f: 21, unit: 'g', tags: ['meat','caucasian'] },
  { id: 'turkey-breast', name: 'Turkey breast (cooked)', emoji: '🦃', cat: 'protein', kcal: 135, p: 30, c: 0, f: 1, unit: 'g', tags: ['meat','low-fat'] },
  { id: 'bacon', name: 'Bacon (cooked)', emoji: '🥓', cat: 'protein', kcal: 541, p: 37, c: 1.4, f: 42, unit: 'g', tags: ['meat','high-fat'] },

  // ===== PROTEINS — FISH =====
  { id: 'salmon', name: 'Salmon (cooked)', emoji: '🐟', cat: 'protein', kcal: 208, p: 22, c: 0, f: 13, unit: 'g', tags: ['fish','omega3'] },
  { id: 'tuna-canned', name: 'Tuna in water (canned)', emoji: '🐟', cat: 'protein', kcal: 116, p: 26, c: 0, f: 1, unit: 'g', tags: ['fish','low-fat'] },
  { id: 'cod', name: 'Cod (cooked)', emoji: '🐟', cat: 'protein', kcal: 105, p: 23, c: 0, f: 1, unit: 'g', tags: ['fish','low-fat'] },
  { id: 'shrimp', name: 'Shrimp (cooked)', emoji: '🦐', cat: 'protein', kcal: 99, p: 24, c: 0.2, f: 0.3, unit: 'g', tags: ['seafood'] },
  { id: 'mackerel', name: 'Mackerel (cooked)', emoji: '🐟', cat: 'protein', kcal: 262, p: 24, c: 0, f: 18, unit: 'g', tags: ['fish','omega3'] },
  { id: 'herring', name: 'Herring (pickled)', emoji: '🐟', cat: 'protein', kcal: 217, p: 14, c: 8, f: 15, unit: 'g', tags: ['fish','russian'] },

  // ===== PROTEINS — DAIRY & EGGS =====
  { id: 'egg', name: 'Egg (large)', emoji: '🥚', cat: 'protein', kcal: 72, p: 6.3, c: 0.4, f: 5, unit: 'piece', avgGrams: 50, tags: ['dairy-eggs'] },
  { id: 'egg-white', name: 'Egg white', emoji: '🥚', cat: 'protein', kcal: 17, p: 3.6, c: 0.2, f: 0.1, unit: 'piece', avgGrams: 33, tags: ['dairy-eggs','low-fat'] },
  { id: 'cottage-cheese', name: 'Cottage cheese (low-fat)', emoji: '🧀', cat: 'protein', kcal: 98, p: 11, c: 3.4, f: 4.3, unit: 'g', tags: ['dairy-eggs','russian'] },
  { id: 'greek-yogurt', name: 'Greek yogurt (plain)', emoji: '🥛', cat: 'protein', kcal: 59, p: 10, c: 3.6, f: 0.4, unit: 'g', tags: ['dairy-eggs','low-fat'] },
  { id: 'milk-skim', name: 'Skim milk', emoji: '🥛', cat: 'protein', kcal: 34, p: 3.4, c: 5, f: 0.1, unit: 'ml', tags: ['dairy-eggs','low-fat'] },
  { id: 'milk-whole', name: 'Whole milk', emoji: '🥛', cat: 'protein', kcal: 61, p: 3.2, c: 4.8, f: 3.3, unit: 'ml', tags: ['dairy-eggs'] },
  { id: 'cheddar', name: 'Cheddar cheese', emoji: '🧀', cat: 'protein', kcal: 403, p: 25, c: 1.3, f: 33, unit: 'g', tags: ['dairy-eggs','high-fat'] },
  { id: 'mozzarella', name: 'Mozzarella', emoji: '🧀', cat: 'protein', kcal: 280, p: 28, c: 3, f: 17, unit: 'g', tags: ['dairy-eggs'] },
  { id: 'feta', name: 'Feta cheese', emoji: '🧀', cat: 'protein', kcal: 264, p: 14, c: 4, f: 21, unit: 'g', tags: ['dairy-eggs','caucasian'] },
  { id: 'kefir', name: 'Kefir 1%', emoji: '🥛', cat: 'protein', kcal: 40, p: 3, c: 4, f: 1, unit: 'ml', tags: ['dairy-eggs','russian'] },
  { id: 'sour-cream', name: 'Sour cream 20%', emoji: '🥛', cat: 'fat', kcal: 206, p: 2.8, c: 3.2, f: 20, unit: 'g', tags: ['dairy-eggs','russian'] },
  { id: 'butter', name: 'Butter', emoji: '🧈', cat: 'fat', kcal: 717, p: 0.9, c: 0.1, f: 81, unit: 'g', tags: ['dairy-eggs','high-fat'] },

  // ===== GRAINS & BREAD =====
  { id: 'rice-white', name: 'White rice (cooked)', emoji: '🍚', cat: 'carb', kcal: 130, p: 2.7, c: 28, f: 0.3, unit: 'g', tags: ['grain'] },
  { id: 'rice-brown', name: 'Brown rice (cooked)', emoji: '🍚', cat: 'carb', kcal: 112, p: 2.6, c: 23, f: 0.9, unit: 'g', tags: ['grain'] },
  { id: 'rice-jasmine', name: 'Jasmine rice (cooked)', emoji: '🍚', cat: 'carb', kcal: 129, p: 2.7, c: 28, f: 0.2, unit: 'g', tags: ['grain'] },
  { id: 'buckwheat', name: 'Buckwheat (cooked)', emoji: '🌾', cat: 'carb', kcal: 92, p: 3.4, c: 20, f: 0.6, unit: 'g', tags: ['grain','russian'] },
  { id: 'oats', name: 'Oats (dry)', emoji: '🥣', cat: 'carb', kcal: 389, p: 17, c: 66, f: 7, unit: 'g', tags: ['grain'] },
  { id: 'oats-cooked', name: 'Oatmeal (cooked w/ water)', emoji: '🥣', cat: 'carb', kcal: 71, p: 2.5, c: 12, f: 1.5, unit: 'g', tags: ['grain'] },
  { id: 'quinoa', name: 'Quinoa (cooked)', emoji: '🌾', cat: 'carb', kcal: 120, p: 4.4, c: 21, f: 1.9, unit: 'g', tags: ['grain'] },
  { id: 'pasta', name: 'Pasta (cooked)', emoji: '🍝', cat: 'carb', kcal: 158, p: 5.8, c: 31, f: 0.9, unit: 'g', tags: ['grain'] },
  { id: 'bread-white', name: 'White bread', emoji: '🍞', cat: 'carb', kcal: 265, p: 9, c: 49, f: 3.2, unit: 'g', tags: ['grain'] },
  { id: 'bread-rye', name: 'Rye bread', emoji: '🍞', cat: 'carb', kcal: 259, p: 9, c: 48, f: 3.3, unit: 'g', tags: ['grain','russian'] },
  { id: 'bread-whole', name: 'Whole wheat bread', emoji: '🍞', cat: 'carb', kcal: 247, p: 13, c: 41, f: 4.2, unit: 'g', tags: ['grain'] },
  { id: 'lavash', name: 'Lavash', emoji: '🫓', cat: 'carb', kcal: 277, p: 8, c: 56, f: 1.2, unit: 'g', tags: ['grain','caucasian'] },
  { id: 'tortilla', name: 'Flour tortilla', emoji: '🫓', cat: 'carb', kcal: 304, p: 8, c: 50, f: 8, unit: 'g', tags: ['grain'] },
  { id: 'noodles-egg', name: 'Egg noodles (cooked)', emoji: '🍜', cat: 'carb', kcal: 138, p: 4.5, c: 25, f: 2.1, unit: 'g', tags: ['grain'] },
  { id: 'rice-noodles', name: 'Rice noodles (cooked)', emoji: '🍜', cat: 'carb', kcal: 109, p: 1.8, c: 25, f: 0.2, unit: 'g', tags: ['grain'] },

  // ===== STARCHES & POTATOES =====
  { id: 'potato', name: 'Potato (boiled)', emoji: '🥔', cat: 'carb', kcal: 87, p: 1.9, c: 20, f: 0.1, unit: 'g', tags: ['starch','russian'] },
  { id: 'potato-fried', name: 'French fries', emoji: '🍟', cat: 'carb', kcal: 312, p: 3.4, c: 41, f: 15, unit: 'g', tags: ['starch','high-fat'] },
  { id: 'sweet-potato', name: 'Sweet potato (baked)', emoji: '🍠', cat: 'carb', kcal: 90, p: 2, c: 21, f: 0.2, unit: 'g', tags: ['starch'] },

  // ===== LEGUMES =====
  { id: 'lentils', name: 'Lentils (cooked)', emoji: '🫘', cat: 'protein', kcal: 116, p: 9, c: 20, f: 0.4, unit: 'g', tags: ['legume','vegan'] },
  { id: 'chickpeas', name: 'Chickpeas (cooked)', emoji: '🫘', cat: 'protein', kcal: 164, p: 8.9, c: 27, f: 2.6, unit: 'g', tags: ['legume','vegan','caucasian'] },
  { id: 'black-beans', name: 'Black beans (cooked)', emoji: '🫘', cat: 'protein', kcal: 132, p: 8.9, c: 24, f: 0.5, unit: 'g', tags: ['legume','vegan'] },
  { id: 'kidney-beans', name: 'Kidney beans (cooked)', emoji: '🫘', cat: 'protein', kcal: 127, p: 8.7, c: 23, f: 0.5, unit: 'g', tags: ['legume','vegan','caucasian'] },
  { id: 'tofu', name: 'Tofu (firm)', emoji: '🥡', cat: 'protein', kcal: 144, p: 17, c: 3, f: 9, unit: 'g', tags: ['legume','vegan'] },
  { id: 'edamame', name: 'Edamame', emoji: '🟢', cat: 'protein', kcal: 122, p: 11, c: 10, f: 5, unit: 'g', tags: ['legume','vegan'] },
  { id: 'hummus', name: 'Hummus', emoji: '🟡', cat: 'protein', kcal: 166, p: 7.9, c: 14, f: 9.6, unit: 'g', tags: ['legume','vegan','caucasian'] },

  // ===== VEGETABLES =====
  { id: 'broccoli', name: 'Broccoli', emoji: '🥦', cat: 'veg', kcal: 34, p: 2.8, c: 7, f: 0.4, unit: 'g', tags: ['vegetable'] },
  { id: 'cauliflower', name: 'Cauliflower', emoji: '🥦', cat: 'veg', kcal: 25, p: 1.9, c: 5, f: 0.3, unit: 'g', tags: ['vegetable'] },
  { id: 'spinach', name: 'Spinach', emoji: '🥬', cat: 'veg', kcal: 23, p: 2.9, c: 3.6, f: 0.4, unit: 'g', tags: ['vegetable','green'] },
  { id: 'lettuce', name: 'Lettuce', emoji: '🥬', cat: 'veg', kcal: 15, p: 1.4, c: 2.9, f: 0.2, unit: 'g', tags: ['vegetable','green'] },
  { id: 'cabbage', name: 'Cabbage', emoji: '🥬', cat: 'veg', kcal: 25, p: 1.3, c: 6, f: 0.1, unit: 'g', tags: ['vegetable','russian'] },
  { id: 'cucumber', name: 'Cucumber', emoji: '🥒', cat: 'veg', kcal: 15, p: 0.7, c: 3.6, f: 0.1, unit: 'g', tags: ['vegetable'] },
  { id: 'tomato', name: 'Tomato', emoji: '🍅', cat: 'veg', kcal: 18, p: 0.9, c: 3.9, f: 0.2, unit: 'g', tags: ['vegetable'] },
  { id: 'bell-pepper', name: 'Bell pepper', emoji: '🫑', cat: 'veg', kcal: 31, p: 1, c: 6, f: 0.3, unit: 'g', tags: ['vegetable'] },
  { id: 'carrot', name: 'Carrot', emoji: '🥕', cat: 'veg', kcal: 41, p: 0.9, c: 10, f: 0.2, unit: 'g', tags: ['vegetable'] },
  { id: 'onion', name: 'Onion', emoji: '🧅', cat: 'veg', kcal: 40, p: 1.1, c: 9, f: 0.1, unit: 'g', tags: ['vegetable'] },
  { id: 'garlic', name: 'Garlic', emoji: '🧄', cat: 'veg', kcal: 149, p: 6.4, c: 33, f: 0.5, unit: 'g', tags: ['vegetable'] },
  { id: 'mushrooms', name: 'Mushrooms', emoji: '🍄', cat: 'veg', kcal: 22, p: 3.1, c: 3.3, f: 0.3, unit: 'g', tags: ['vegetable','russian'] },
  { id: 'zucchini', name: 'Zucchini', emoji: '🥒', cat: 'veg', kcal: 17, p: 1.2, c: 3.1, f: 0.3, unit: 'g', tags: ['vegetable','caucasian'] },
  { id: 'eggplant', name: 'Eggplant', emoji: '🍆', cat: 'veg', kcal: 25, p: 1, c: 6, f: 0.2, unit: 'g', tags: ['vegetable','caucasian'] },
  { id: 'beets', name: 'Beets (cooked)', emoji: '🍠', cat: 'veg', kcal: 44, p: 1.7, c: 10, f: 0.2, unit: 'g', tags: ['vegetable','russian'] },
  { id: 'corn', name: 'Corn (cooked)', emoji: '🌽', cat: 'veg', kcal: 96, p: 3.4, c: 21, f: 1.5, unit: 'g', tags: ['vegetable'] },
  { id: 'green-beans', name: 'Green beans', emoji: '🟢', cat: 'veg', kcal: 31, p: 1.8, c: 7, f: 0.2, unit: 'g', tags: ['vegetable'] },
  { id: 'asparagus', name: 'Asparagus', emoji: '🟢', cat: 'veg', kcal: 20, p: 2.2, c: 3.9, f: 0.1, unit: 'g', tags: ['vegetable'] },
  { id: 'avocado', name: 'Avocado', emoji: '🥑', cat: 'fat', kcal: 160, p: 2, c: 9, f: 15, unit: 'g', tags: ['vegetable','high-fat'] },

  // ===== FRUITS =====
  { id: 'apple', name: 'Apple', emoji: '🍎', cat: 'fruit', kcal: 52, p: 0.3, c: 14, f: 0.2, unit: 'g', tags: ['fruit'] },
  { id: 'banana', name: 'Banana', emoji: '🍌', cat: 'fruit', kcal: 89, p: 1.1, c: 23, f: 0.3, unit: 'g', tags: ['fruit'] },
  { id: 'orange', name: 'Orange', emoji: '🍊', cat: 'fruit', kcal: 47, p: 0.9, c: 12, f: 0.1, unit: 'g', tags: ['fruit'] },
  { id: 'grapes', name: 'Grapes', emoji: '🍇', cat: 'fruit', kcal: 69, p: 0.7, c: 18, f: 0.2, unit: 'g', tags: ['fruit'] },
  { id: 'strawberry', name: 'Strawberries', emoji: '🍓', cat: 'fruit', kcal: 32, p: 0.7, c: 7.7, f: 0.3, unit: 'g', tags: ['fruit'] },
  { id: 'blueberry', name: 'Blueberries', emoji: '🫐', cat: 'fruit', kcal: 57, p: 0.7, c: 14, f: 0.3, unit: 'g', tags: ['fruit'] },
  { id: 'pear', name: 'Pear', emoji: '🍐', cat: 'fruit', kcal: 57, p: 0.4, c: 15, f: 0.1, unit: 'g', tags: ['fruit'] },
  { id: 'pineapple', name: 'Pineapple', emoji: '🍍', cat: 'fruit', kcal: 50, p: 0.5, c: 13, f: 0.1, unit: 'g', tags: ['fruit'] },
  { id: 'mango', name: 'Mango', emoji: '🥭', cat: 'fruit', kcal: 60, p: 0.8, c: 15, f: 0.4, unit: 'g', tags: ['fruit'] },
  { id: 'watermelon', name: 'Watermelon', emoji: '🍉', cat: 'fruit', kcal: 30, p: 0.6, c: 8, f: 0.2, unit: 'g', tags: ['fruit'] },
  { id: 'lemon', name: 'Lemon', emoji: '🍋', cat: 'fruit', kcal: 29, p: 1.1, c: 9, f: 0.3, unit: 'g', tags: ['fruit'] },
  { id: 'pomegranate', name: 'Pomegranate', emoji: '🟥', cat: 'fruit', kcal: 83, p: 1.7, c: 19, f: 1.2, unit: 'g', tags: ['fruit','caucasian'] },
  { id: 'persimmon', name: 'Persimmon', emoji: '🟧', cat: 'fruit', kcal: 70, p: 0.6, c: 19, f: 0.2, unit: 'g', tags: ['fruit','caucasian'] },

  // ===== NUTS & SEEDS =====
  { id: 'almonds', name: 'Almonds', emoji: '🌰', cat: 'fat', kcal: 579, p: 21, c: 22, f: 50, unit: 'g', tags: ['nuts','high-fat'] },
  { id: 'walnuts', name: 'Walnuts', emoji: '🌰', cat: 'fat', kcal: 654, p: 15, c: 14, f: 65, unit: 'g', tags: ['nuts','high-fat','caucasian'] },
  { id: 'cashews', name: 'Cashews', emoji: '🌰', cat: 'fat', kcal: 553, p: 18, c: 30, f: 44, unit: 'g', tags: ['nuts','high-fat'] },
  { id: 'peanuts', name: 'Peanuts', emoji: '🥜', cat: 'fat', kcal: 567, p: 26, c: 16, f: 49, unit: 'g', tags: ['nuts','high-fat'] },
  { id: 'peanut-butter', name: 'Peanut butter', emoji: '🥜', cat: 'fat', kcal: 588, p: 25, c: 20, f: 50, unit: 'g', tags: ['nuts','high-fat'] },
  { id: 'sunflower-seeds', name: 'Sunflower seeds', emoji: '🌻', cat: 'fat', kcal: 584, p: 21, c: 20, f: 51, unit: 'g', tags: ['seeds','high-fat'] },
  { id: 'chia-seeds', name: 'Chia seeds', emoji: '🌱', cat: 'fat', kcal: 486, p: 17, c: 42, f: 31, unit: 'g', tags: ['seeds'] },

  // ===== OILS & FATS =====
  { id: 'olive-oil', name: 'Olive oil', emoji: '🫒', cat: 'fat', kcal: 884, p: 0, c: 0, f: 100, unit: 'ml', tags: ['oil','high-fat'] },
  { id: 'sunflower-oil', name: 'Sunflower oil', emoji: '🌻', cat: 'fat', kcal: 884, p: 0, c: 0, f: 100, unit: 'ml', tags: ['oil','high-fat','russian'] },
  { id: 'coconut-oil', name: 'Coconut oil', emoji: '🥥', cat: 'fat', kcal: 862, p: 0, c: 0, f: 100, unit: 'ml', tags: ['oil','high-fat'] },

  // ===== PREPARED DISHES — RUSSIAN =====
  { id: 'borscht', name: 'Borscht', emoji: '🍲', cat: 'mixed', kcal: 60, p: 3, c: 7, f: 2.5, unit: 'g', tags: ['russian','soup'] },
  { id: 'pelmeni', name: 'Pelmeni (boiled)', emoji: '🥟', cat: 'mixed', kcal: 248, p: 12, c: 27, f: 10, unit: 'g', tags: ['russian'] },
  { id: 'olivier-salad', name: 'Olivier salad', emoji: '🥗', cat: 'mixed', kcal: 198, p: 5, c: 9, f: 16, unit: 'g', tags: ['russian'] },
  { id: 'syrniki', name: 'Syrniki', emoji: '🥞', cat: 'mixed', kcal: 220, p: 13, c: 22, f: 9, unit: 'g', tags: ['russian'] },
  { id: 'golubtsy', name: 'Cabbage rolls (golubtsy)', emoji: '🥬', cat: 'mixed', kcal: 130, p: 7, c: 11, f: 6.5, unit: 'g', tags: ['russian'] },
  { id: 'beef-stroganoff', name: 'Beef stroganoff', emoji: '🍖', cat: 'mixed', kcal: 187, p: 13, c: 6, f: 12, unit: 'g', tags: ['russian'] },

  // ===== PREPARED DISHES — CAUCASIAN =====
  { id: 'shashlik', name: 'Shashlik (grilled meat skewer)', emoji: '🍢', cat: 'mixed', kcal: 220, p: 23, c: 1, f: 14, unit: 'g', tags: ['caucasian'] },
  { id: 'khachapuri', name: 'Khachapuri', emoji: '🫓', cat: 'mixed', kcal: 295, p: 12, c: 30, f: 14, unit: 'g', tags: ['caucasian'] },
  { id: 'khinkali', name: 'Khinkali (boiled)', emoji: '🥟', cat: 'mixed', kcal: 235, p: 10, c: 27, f: 9, unit: 'g', tags: ['caucasian'] },
  { id: 'lobio', name: 'Lobio (bean stew)', emoji: '🫘', cat: 'mixed', kcal: 130, p: 8, c: 18, f: 3, unit: 'g', tags: ['caucasian','vegan'] },
  { id: 'satsivi', name: 'Satsivi (chicken in walnut sauce)', emoji: '🍗', cat: 'mixed', kcal: 250, p: 18, c: 6, f: 18, unit: 'g', tags: ['caucasian'] },
  { id: 'kharcho', name: 'Kharcho soup', emoji: '🍲', cat: 'mixed', kcal: 90, p: 6, c: 8, f: 4, unit: 'g', tags: ['caucasian','soup'] },
  { id: 'dolma', name: 'Dolma', emoji: '🌿', cat: 'mixed', kcal: 165, p: 6, c: 13, f: 10, unit: 'g', tags: ['caucasian'] },
  { id: 'chebureki', name: 'Cheburek', emoji: '🥟', cat: 'mixed', kcal: 264, p: 13, c: 29, f: 11, unit: 'g', tags: ['caucasian'] },

  // ===== PREPARED DISHES — WESTERN =====
  { id: 'pizza-cheese', name: 'Cheese pizza (1 slice)', emoji: '🍕', cat: 'mixed', kcal: 285, p: 12, c: 36, f: 10, unit: 'g', tags: ['western'] },
  { id: 'burger', name: 'Cheeseburger', emoji: '🍔', cat: 'mixed', kcal: 295, p: 15, c: 25, f: 14, unit: 'g', tags: ['western'] },
  { id: 'caesar-salad', name: 'Caesar salad', emoji: '🥗', cat: 'mixed', kcal: 158, p: 5, c: 6, f: 13, unit: 'g', tags: ['western'] },
  { id: 'omelette', name: 'Omelette (2 eggs)', emoji: '🍳', cat: 'mixed', kcal: 154, p: 11, c: 0.6, f: 12, unit: 'g', tags: ['breakfast'] },
  { id: 'pancakes', name: 'Pancakes', emoji: '🥞', cat: 'mixed', kcal: 227, p: 6, c: 28, f: 10, unit: 'g', tags: ['breakfast'] },
  { id: 'french-toast', name: 'French toast', emoji: '🍞', cat: 'mixed', kcal: 229, p: 8, c: 25, f: 11, unit: 'g', tags: ['breakfast'] },

  // ===== SNACKS & SWEETS =====
  { id: 'dark-chocolate', name: 'Dark chocolate (70%)', emoji: '🍫', cat: 'sweet', kcal: 598, p: 7.8, c: 46, f: 43, unit: 'g', tags: ['sweet','high-fat'] },
  { id: 'milk-chocolate', name: 'Milk chocolate', emoji: '🍫', cat: 'sweet', kcal: 535, p: 7.6, c: 59, f: 30, unit: 'g', tags: ['sweet'] },
  { id: 'cookie', name: 'Cookie (avg)', emoji: '🍪', cat: 'sweet', kcal: 502, p: 5, c: 65, f: 24, unit: 'g', tags: ['sweet'] },
  { id: 'ice-cream', name: 'Ice cream (vanilla)', emoji: '🍦', cat: 'sweet', kcal: 207, p: 3.5, c: 24, f: 11, unit: 'g', tags: ['sweet'] },
  { id: 'donut', name: 'Donut (glazed)', emoji: '🍩', cat: 'sweet', kcal: 421, p: 5, c: 49, f: 23, unit: 'g', tags: ['sweet'] },
  { id: 'chips', name: 'Potato chips', emoji: '🥔', cat: 'sweet', kcal: 536, p: 7, c: 53, f: 35, unit: 'g', tags: ['snack','high-fat'] },
  { id: 'popcorn', name: 'Popcorn (air-popped)', emoji: '🍿', cat: 'sweet', kcal: 387, p: 13, c: 78, f: 4.5, unit: 'g', tags: ['snack'] },
  { id: 'honey', name: 'Honey', emoji: '🍯', cat: 'sweet', kcal: 304, p: 0.3, c: 82, f: 0, unit: 'g', tags: ['sweet'] },
  { id: 'sugar', name: 'Sugar', emoji: '🍬', cat: 'sweet', kcal: 387, p: 0, c: 100, f: 0, unit: 'g', tags: ['sweet'] },
  { id: 'jam', name: 'Jam', emoji: '🍓', cat: 'sweet', kcal: 250, p: 0.4, c: 65, f: 0.1, unit: 'g', tags: ['sweet'] },

  // ===== DRINKS =====
  { id: 'coffee-black', name: 'Coffee (black)', emoji: '☕', cat: 'drink', kcal: 2, p: 0.3, c: 0, f: 0, unit: 'ml', tags: ['drink'] },
  { id: 'coffee-latte', name: 'Latte (medium, whole milk)', emoji: '☕', cat: 'drink', kcal: 95, p: 6, c: 9, f: 4, unit: 'piece', avgGrams: 350, tags: ['drink'] },
  { id: 'tea', name: 'Tea (unsweetened)', emoji: '🍵', cat: 'drink', kcal: 1, p: 0, c: 0.2, f: 0, unit: 'ml', tags: ['drink'] },
  { id: 'orange-juice', name: 'Orange juice', emoji: '🧃', cat: 'drink', kcal: 45, p: 0.7, c: 10, f: 0.2, unit: 'ml', tags: ['drink'] },
  { id: 'apple-juice', name: 'Apple juice', emoji: '🧃', cat: 'drink', kcal: 46, p: 0.1, c: 11, f: 0.1, unit: 'ml', tags: ['drink'] },
  { id: 'cola', name: 'Cola', emoji: '🥤', cat: 'drink', kcal: 42, p: 0, c: 11, f: 0, unit: 'ml', tags: ['drink','sweet'] },
  { id: 'cola-zero', name: 'Diet cola', emoji: '🥤', cat: 'drink', kcal: 0, p: 0, c: 0, f: 0, unit: 'ml', tags: ['drink'] },
  { id: 'beer', name: 'Beer (lager)', emoji: '🍺', cat: 'drink', kcal: 43, p: 0.5, c: 3.6, f: 0, unit: 'ml', tags: ['drink','alcohol'] },
  { id: 'wine-red', name: 'Red wine', emoji: '🍷', cat: 'drink', kcal: 85, p: 0.1, c: 2.6, f: 0, unit: 'ml', tags: ['drink','alcohol'] },
  { id: 'vodka', name: 'Vodka', emoji: '🥃', cat: 'drink', kcal: 231, p: 0, c: 0, f: 0, unit: 'ml', tags: ['drink','alcohol'] },
  { id: 'protein-shake', name: 'Protein shake (whey, w/ water)', emoji: '🥤', cat: 'protein', kcal: 120, p: 24, c: 3, f: 1.5, unit: 'piece', avgGrams: 300, tags: ['drink','high-protein'] },

  // ===== CONDIMENTS =====
  { id: 'mayo', name: 'Mayonnaise', emoji: '🥫', cat: 'fat', kcal: 680, p: 1, c: 0.6, f: 75, unit: 'g', tags: ['condiment','high-fat'] },
  { id: 'ketchup', name: 'Ketchup', emoji: '🍅', cat: 'sweet', kcal: 101, p: 1.7, c: 24, f: 0.4, unit: 'g', tags: ['condiment'] },
  { id: 'soy-sauce', name: 'Soy sauce', emoji: '🍶', cat: 'mixed', kcal: 53, p: 8, c: 5, f: 0.6, unit: 'ml', tags: ['condiment'] }
];

// Lookup helper
const FOOD_BY_ID = Object.fromEntries(FOODS.map(f => [f.id, f]));

// Get food categories for filtering
const FOOD_CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'protein', name: 'Protein' },
  { id: 'carb', name: 'Carbs' },
  { id: 'veg', name: 'Veggies' },
  { id: 'fruit', name: 'Fruit' },
  { id: 'fat', name: 'Fats' },
  { id: 'mixed', name: 'Dishes' },
  { id: 'sweet', name: 'Sweets' },
  { id: 'drink', name: 'Drinks' }
];

// Compute calories/macros for a given amount of food
// amount: grams or ml; for "piece" units, amount is # of pieces
function computeMacros(foodId, amount) {
  const food = FOOD_BY_ID[foodId];
  if (!food) return { kcal: 0, p: 0, c: 0, f: 0 };

  let factor;
  if (food.unit === 'piece') {
    factor = amount; // amount = number of pieces
  } else {
    factor = amount / 100; // amount = grams or ml
  }

  return {
    kcal: Math.round(food.kcal * factor),
    p: Math.round(food.p * factor * 10) / 10,
    c: Math.round(food.c * factor * 10) / 10,
    f: Math.round(food.f * factor * 10) / 10
  };
}

// Default amount when adding a food (sensible portion)
function defaultAmount(food) {
  if (food.unit === 'piece') return 1;
  if (food.cat === 'drink') return 250;
  if (food.cat === 'fat' && food.tags?.includes('oil')) return 10;
  if (food.cat === 'sweet') return 30;
  if (food.cat === 'protein') return 150;
  if (food.cat === 'carb') return 150;
  if (food.cat === 'veg') return 100;
  if (food.cat === 'fruit') return 150;
  return 100;
}

// Search foods by query
function searchFoods(query, category = 'all') {
  const q = query.trim().toLowerCase();
  let results = FOODS;
  if (category !== 'all') {
    results = results.filter(f => f.cat === category);
  }
  if (!q) {
    return results.slice(0, 30);
  }
  // Score: exact name match > starts with > contains > tag match
  const scored = results.map(f => {
    const name = f.name.toLowerCase();
    let score = 0;
    if (name === q) score = 100;
    else if (name.startsWith(q)) score = 80;
    else if (name.includes(' ' + q)) score = 60;
    else if (name.includes(q)) score = 40;
    else if (f.tags?.some(t => t.includes(q))) score = 20;
    return { food: f, score };
  });
  return scored.filter(s => s.score > 0)
               .sort((a, b) => b.score - a.score)
               .slice(0, 30)
               .map(s => s.food);
}

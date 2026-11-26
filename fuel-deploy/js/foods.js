/* =============================================
   FUEL — Food Database
   Calorie & macro values per 100g (or per unit where noted).
   Curated list of common foods covering Russian, Caucasian,
   and Western cuisines. Each entry has name_en and name_ru.
============================================= */

// unit: 'g' = per 100g, 'ml' = per 100ml, 'piece' = per piece (with avgGrams for conversion)
// emoji is just for visual flair in lists
const FOODS = [
  // ===== PROTEINS — MEAT =====
  { id: 'chicken-breast', name_en: 'Chicken breast (cooked)', name_ru: 'Куриная грудка (готовая)', emoji: '🍗', cat: 'protein', kcal: 165, p: 31, c: 0, f: 3.6, unit: 'g', tags: ['meat','low-fat','high-protein'] },
  { id: 'chicken-thigh', name_en: 'Chicken thigh (cooked)', name_ru: 'Куриное бедро (готовое)', emoji: '🍗', cat: 'protein', kcal: 209, p: 26, c: 0, f: 11, unit: 'g', tags: ['meat'] },
  { id: 'beef-lean', name_en: 'Lean beef (cooked)', name_ru: 'Говядина постная (готовая)', emoji: '🥩', cat: 'protein', kcal: 217, p: 27, c: 0, f: 12, unit: 'g', tags: ['meat','red-meat'] },
  { id: 'beef-ground', name_en: 'Ground beef 15% (cooked)', name_ru: 'Говяжий фарш 15% (готовый)', emoji: '🥩', cat: 'protein', kcal: 254, p: 26, c: 0, f: 17, unit: 'g', tags: ['meat'] },
  { id: 'pork-loin', name_en: 'Pork loin (cooked)', name_ru: 'Свиная корейка (готовая)', emoji: '🥩', cat: 'protein', kcal: 242, p: 27, c: 0, f: 14, unit: 'g', tags: ['meat'] },
  { id: 'lamb', name_en: 'Lamb (cooked)', name_ru: 'Баранина (готовая)', emoji: '🥩', cat: 'protein', kcal: 294, p: 25, c: 0, f: 21, unit: 'g', tags: ['meat','caucasian'] },
  { id: 'turkey-breast', name_en: 'Turkey breast (cooked)', name_ru: 'Грудка индейки (готовая)', emoji: '🦃', cat: 'protein', kcal: 135, p: 30, c: 0, f: 1, unit: 'g', tags: ['meat','low-fat'] },
  { id: 'bacon', name_en: 'Bacon (cooked)', name_ru: 'Бекон (жареный)', emoji: '🥓', cat: 'protein', kcal: 541, p: 37, c: 1.4, f: 42, unit: 'g', tags: ['meat','high-fat'] },

  // ===== PROTEINS — FISH =====
  { id: 'salmon', name_en: 'Salmon (cooked)', name_ru: 'Лосось (готовый)', emoji: '🐟', cat: 'protein', kcal: 208, p: 22, c: 0, f: 13, unit: 'g', tags: ['fish','omega3'] },
  { id: 'tuna-canned', name_en: 'Tuna in water (canned)', name_ru: 'Тунец в собственном соку (консервы)', emoji: '🐟', cat: 'protein', kcal: 116, p: 26, c: 0, f: 1, unit: 'g', tags: ['fish','low-fat'] },
  { id: 'cod', name_en: 'Cod (cooked)', name_ru: 'Треска (готовая)', emoji: '🐟', cat: 'protein', kcal: 105, p: 23, c: 0, f: 1, unit: 'g', tags: ['fish','low-fat'] },
  { id: 'shrimp', name_en: 'Shrimp (cooked)', name_ru: 'Креветки (отварные)', emoji: '🦐', cat: 'protein', kcal: 99, p: 24, c: 0.2, f: 0.3, unit: 'g', tags: ['seafood'] },
  { id: 'mackerel', name_en: 'Mackerel (cooked)', name_ru: 'Скумбрия (готовая)', emoji: '🐟', cat: 'protein', kcal: 262, p: 24, c: 0, f: 18, unit: 'g', tags: ['fish','omega3'] },
  { id: 'herring', name_en: 'Herring (pickled)', name_ru: 'Сельдь (маринованная)', emoji: '🐟', cat: 'protein', kcal: 217, p: 14, c: 8, f: 15, unit: 'g', tags: ['fish','russian'] },

  // ===== PROTEINS — DAIRY & EGGS =====
  { id: 'egg', name_en: 'Egg (large)', name_ru: 'Яйцо (крупное)', emoji: '🥚', cat: 'protein', kcal: 72, p: 6.3, c: 0.4, f: 5, unit: 'piece', avgGrams: 50, tags: ['dairy-eggs'] },
  { id: 'egg-white', name_en: 'Egg white', name_ru: 'Яичный белок', emoji: '🥚', cat: 'protein', kcal: 17, p: 3.6, c: 0.2, f: 0.1, unit: 'piece', avgGrams: 33, tags: ['dairy-eggs','low-fat'] },
  { id: 'cottage-cheese', name_en: 'Cottage cheese (low-fat)', name_ru: 'Творог (нежирный)', emoji: '🧀', cat: 'protein', kcal: 98, p: 11, c: 3.4, f: 4.3, unit: 'g', tags: ['dairy-eggs','russian'] },
  { id: 'greek-yogurt', name_en: 'Greek yogurt (plain)', name_ru: 'Греческий йогурт (натуральный)', emoji: '🥛', cat: 'protein', kcal: 59, p: 10, c: 3.6, f: 0.4, unit: 'g', tags: ['dairy-eggs','low-fat'] },
  { id: 'milk-skim', name_en: 'Skim milk', name_ru: 'Молоко обезжиренное', emoji: '🥛', cat: 'protein', kcal: 34, p: 3.4, c: 5, f: 0.1, unit: 'ml', tags: ['dairy-eggs','low-fat'] },
  { id: 'milk-whole', name_en: 'Whole milk', name_ru: 'Молоко цельное', emoji: '🥛', cat: 'protein', kcal: 61, p: 3.2, c: 4.8, f: 3.3, unit: 'ml', tags: ['dairy-eggs'] },
  { id: 'cheddar', name_en: 'Cheddar cheese', name_ru: 'Сыр чеддер', emoji: '🧀', cat: 'protein', kcal: 403, p: 25, c: 1.3, f: 33, unit: 'g', tags: ['dairy-eggs','high-fat'] },
  { id: 'mozzarella', name_en: 'Mozzarella', name_ru: 'Моцарелла', emoji: '🧀', cat: 'protein', kcal: 280, p: 28, c: 3, f: 17, unit: 'g', tags: ['dairy-eggs'] },
  { id: 'feta', name_en: 'Feta cheese', name_ru: 'Сыр фета', emoji: '🧀', cat: 'protein', kcal: 264, p: 14, c: 4, f: 21, unit: 'g', tags: ['dairy-eggs','caucasian'] },
  { id: 'kefir', name_en: 'Kefir 1%', name_ru: 'Кефир 1%', emoji: '🥛', cat: 'protein', kcal: 40, p: 3, c: 4, f: 1, unit: 'ml', tags: ['dairy-eggs','russian'] },
  { id: 'sour-cream', name_en: 'Sour cream 20%', name_ru: 'Сметана 20%', emoji: '🥛', cat: 'fat', kcal: 206, p: 2.8, c: 3.2, f: 20, unit: 'g', tags: ['dairy-eggs','russian'] },
  { id: 'butter', name_en: 'Butter', name_ru: 'Сливочное масло', emoji: '🧈', cat: 'fat', kcal: 717, p: 0.9, c: 0.1, f: 81, unit: 'g', tags: ['dairy-eggs','high-fat'] },

  // ===== GRAINS & BREAD =====
  { id: 'rice-white', name_en: 'White rice (cooked)', name_ru: 'Рис белый (варёный)', emoji: '🍚', cat: 'carb', kcal: 130, p: 2.7, c: 28, f: 0.3, unit: 'g', tags: ['grain'] },
  { id: 'rice-brown', name_en: 'Brown rice (cooked)', name_ru: 'Рис бурый (варёный)', emoji: '🍚', cat: 'carb', kcal: 112, p: 2.6, c: 23, f: 0.9, unit: 'g', tags: ['grain'] },
  { id: 'rice-jasmine', name_en: 'Jasmine rice (cooked)', name_ru: 'Рис жасмин (варёный)', emoji: '🍚', cat: 'carb', kcal: 129, p: 2.7, c: 28, f: 0.2, unit: 'g', tags: ['grain'] },
  { id: 'buckwheat', name_en: 'Buckwheat (cooked)', name_ru: 'Гречка (варёная)', emoji: '🌾', cat: 'carb', kcal: 92, p: 3.4, c: 20, f: 0.6, unit: 'g', tags: ['grain','russian'] },
  { id: 'oats', name_en: 'Oats (dry)', name_ru: 'Овсяные хлопья (сухие)', emoji: '🥣', cat: 'carb', kcal: 389, p: 17, c: 66, f: 7, unit: 'g', tags: ['grain'] },
  { id: 'oats-cooked', name_en: 'Oatmeal (cooked w/ water)', name_ru: 'Овсянка на воде', emoji: '🥣', cat: 'carb', kcal: 71, p: 2.5, c: 12, f: 1.5, unit: 'g', tags: ['grain'] },
  { id: 'quinoa', name_en: 'Quinoa (cooked)', name_ru: 'Киноа (варёная)', emoji: '🌾', cat: 'carb', kcal: 120, p: 4.4, c: 21, f: 1.9, unit: 'g', tags: ['grain'] },
  { id: 'pasta', name_en: 'Pasta (cooked)', name_ru: 'Макароны (варёные)', emoji: '🍝', cat: 'carb', kcal: 158, p: 5.8, c: 31, f: 0.9, unit: 'g', tags: ['grain'] },
  { id: 'bread-white', name_en: 'White bread', name_ru: 'Хлеб белый', emoji: '🍞', cat: 'carb', kcal: 265, p: 9, c: 49, f: 3.2, unit: 'g', tags: ['grain'] },
  { id: 'bread-rye', name_en: 'Rye bread', name_ru: 'Хлеб ржаной', emoji: '🍞', cat: 'carb', kcal: 259, p: 9, c: 48, f: 3.3, unit: 'g', tags: ['grain','russian'] },
  { id: 'bread-whole', name_en: 'Whole wheat bread', name_ru: 'Хлеб цельнозерновой', emoji: '🍞', cat: 'carb', kcal: 247, p: 13, c: 41, f: 4.2, unit: 'g', tags: ['grain'] },
  { id: 'lavash', name_en: 'Lavash', name_ru: 'Лаваш', emoji: '🫓', cat: 'carb', kcal: 277, p: 8, c: 56, f: 1.2, unit: 'g', tags: ['grain','caucasian'] },
  { id: 'tortilla', name_en: 'Flour tortilla', name_ru: 'Тортилья пшеничная', emoji: '🫓', cat: 'carb', kcal: 304, p: 8, c: 50, f: 8, unit: 'g', tags: ['grain'] },
  { id: 'noodles-egg', name_en: 'Egg noodles (cooked)', name_ru: 'Яичная лапша (варёная)', emoji: '🍜', cat: 'carb', kcal: 138, p: 4.5, c: 25, f: 2.1, unit: 'g', tags: ['grain'] },
  { id: 'rice-noodles', name_en: 'Rice noodles (cooked)', name_ru: 'Рисовая лапша (варёная)', emoji: '🍜', cat: 'carb', kcal: 109, p: 1.8, c: 25, f: 0.2, unit: 'g', tags: ['grain'] },

  // ===== STARCHES & POTATOES =====
  { id: 'potato', name_en: 'Potato (boiled)', name_ru: 'Картофель (варёный)', emoji: '🥔', cat: 'carb', kcal: 87, p: 1.9, c: 20, f: 0.1, unit: 'g', tags: ['starch','russian'] },
  { id: 'potato-fried', name_en: 'French fries', name_ru: 'Картофель фри', emoji: '🍟', cat: 'carb', kcal: 312, p: 3.4, c: 41, f: 15, unit: 'g', tags: ['starch','high-fat'] },
  { id: 'sweet-potato', name_en: 'Sweet potato (baked)', name_ru: 'Батат (запечённый)', emoji: '🍠', cat: 'carb', kcal: 90, p: 2, c: 21, f: 0.2, unit: 'g', tags: ['starch'] },

  // ===== LEGUMES =====
  { id: 'lentils', name_en: 'Lentils (cooked)', name_ru: 'Чечевица (варёная)', emoji: '🫘', cat: 'protein', kcal: 116, p: 9, c: 20, f: 0.4, unit: 'g', tags: ['legume','vegan'] },
  { id: 'chickpeas', name_en: 'Chickpeas (cooked)', name_ru: 'Нут (варёный)', emoji: '🫘', cat: 'protein', kcal: 164, p: 8.9, c: 27, f: 2.6, unit: 'g', tags: ['legume','vegan','caucasian'] },
  { id: 'black-beans', name_en: 'Black beans (cooked)', name_ru: 'Чёрная фасоль (варёная)', emoji: '🫘', cat: 'protein', kcal: 132, p: 8.9, c: 24, f: 0.5, unit: 'g', tags: ['legume','vegan'] },
  { id: 'kidney-beans', name_en: 'Kidney beans (cooked)', name_ru: 'Красная фасоль (варёная)', emoji: '🫘', cat: 'protein', kcal: 127, p: 8.7, c: 23, f: 0.5, unit: 'g', tags: ['legume','vegan','caucasian'] },
  { id: 'tofu', name_en: 'Tofu (firm)', name_ru: 'Тофу (твёрдый)', emoji: '🥡', cat: 'protein', kcal: 144, p: 17, c: 3, f: 9, unit: 'g', tags: ['legume','vegan'] },
  { id: 'edamame', name_en: 'Edamame', name_ru: 'Эдамаме', emoji: '🟢', cat: 'protein', kcal: 122, p: 11, c: 10, f: 5, unit: 'g', tags: ['legume','vegan'] },
  { id: 'hummus', name_en: 'Hummus', name_ru: 'Хумус', emoji: '🟡', cat: 'protein', kcal: 166, p: 7.9, c: 14, f: 9.6, unit: 'g', tags: ['legume','vegan','caucasian'] },

  // ===== VEGETABLES =====
  { id: 'broccoli', name_en: 'Broccoli', name_ru: 'Брокколи', emoji: '🥦', cat: 'veg', kcal: 34, p: 2.8, c: 7, f: 0.4, unit: 'g', tags: ['vegetable'] },
  { id: 'cauliflower', name_en: 'Cauliflower', name_ru: 'Цветная капуста', emoji: '🥦', cat: 'veg', kcal: 25, p: 1.9, c: 5, f: 0.3, unit: 'g', tags: ['vegetable'] },
  { id: 'spinach', name_en: 'Spinach', name_ru: 'Шпинат', emoji: '🥬', cat: 'veg', kcal: 23, p: 2.9, c: 3.6, f: 0.4, unit: 'g', tags: ['vegetable','green'] },
  { id: 'lettuce', name_en: 'Lettuce', name_ru: 'Салат листовой', emoji: '🥬', cat: 'veg', kcal: 15, p: 1.4, c: 2.9, f: 0.2, unit: 'g', tags: ['vegetable','green'] },
  { id: 'cabbage', name_en: 'Cabbage', name_ru: 'Капуста белокочанная', emoji: '🥬', cat: 'veg', kcal: 25, p: 1.3, c: 6, f: 0.1, unit: 'g', tags: ['vegetable','russian'] },
  { id: 'cucumber', name_en: 'Cucumber', name_ru: 'Огурец', emoji: '🥒', cat: 'veg', kcal: 15, p: 0.7, c: 3.6, f: 0.1, unit: 'g', tags: ['vegetable'] },
  { id: 'tomato', name_en: 'Tomato', name_ru: 'Помидор', emoji: '🍅', cat: 'veg', kcal: 18, p: 0.9, c: 3.9, f: 0.2, unit: 'g', tags: ['vegetable'] },
  { id: 'bell-pepper', name_en: 'Bell pepper', name_ru: 'Болгарский перец', emoji: '🫑', cat: 'veg', kcal: 31, p: 1, c: 6, f: 0.3, unit: 'g', tags: ['vegetable'] },
  { id: 'carrot', name_en: 'Carrot', name_ru: 'Морковь', emoji: '🥕', cat: 'veg', kcal: 41, p: 0.9, c: 10, f: 0.2, unit: 'g', tags: ['vegetable'] },
  { id: 'onion', name_en: 'Onion', name_ru: 'Лук репчатый', emoji: '🧅', cat: 'veg', kcal: 40, p: 1.1, c: 9, f: 0.1, unit: 'g', tags: ['vegetable'] },
  { id: 'garlic', name_en: 'Garlic', name_ru: 'Чеснок', emoji: '🧄', cat: 'veg', kcal: 149, p: 6.4, c: 33, f: 0.5, unit: 'g', tags: ['vegetable'] },
  { id: 'mushrooms', name_en: 'Mushrooms', name_ru: 'Шампиньоны', emoji: '🍄', cat: 'veg', kcal: 22, p: 3.1, c: 3.3, f: 0.3, unit: 'g', tags: ['vegetable','russian'] },
  { id: 'zucchini', name_en: 'Zucchini', name_ru: 'Кабачок', emoji: '🥒', cat: 'veg', kcal: 17, p: 1.2, c: 3.1, f: 0.3, unit: 'g', tags: ['vegetable','caucasian'] },
  { id: 'eggplant', name_en: 'Eggplant', name_ru: 'Баклажан', emoji: '🍆', cat: 'veg', kcal: 25, p: 1, c: 6, f: 0.2, unit: 'g', tags: ['vegetable','caucasian'] },
  { id: 'beets', name_en: 'Beets (cooked)', name_ru: 'Свёкла (варёная)', emoji: '🍠', cat: 'veg', kcal: 44, p: 1.7, c: 10, f: 0.2, unit: 'g', tags: ['vegetable','russian'] },
  { id: 'corn', name_en: 'Corn (cooked)', name_ru: 'Кукуруза (варёная)', emoji: '🌽', cat: 'veg', kcal: 96, p: 3.4, c: 21, f: 1.5, unit: 'g', tags: ['vegetable'] },
  { id: 'green-beans', name_en: 'Green beans', name_ru: 'Стручковая фасоль', emoji: '🟢', cat: 'veg', kcal: 31, p: 1.8, c: 7, f: 0.2, unit: 'g', tags: ['vegetable'] },
  { id: 'asparagus', name_en: 'Asparagus', name_ru: 'Спаржа', emoji: '🟢', cat: 'veg', kcal: 20, p: 2.2, c: 3.9, f: 0.1, unit: 'g', tags: ['vegetable'] },
  { id: 'avocado', name_en: 'Avocado', name_ru: 'Авокадо', emoji: '🥑', cat: 'fat', kcal: 160, p: 2, c: 9, f: 15, unit: 'g', tags: ['vegetable','high-fat'] },

  // ===== FRUITS =====
  { id: 'apple', name_en: 'Apple', name_ru: 'Яблоко', emoji: '🍎', cat: 'fruit', kcal: 52, p: 0.3, c: 14, f: 0.2, unit: 'g', tags: ['fruit'] },
  { id: 'banana', name_en: 'Banana', name_ru: 'Банан', emoji: '🍌', cat: 'fruit', kcal: 89, p: 1.1, c: 23, f: 0.3, unit: 'g', tags: ['fruit'] },
  { id: 'orange', name_en: 'Orange', name_ru: 'Апельсин', emoji: '🍊', cat: 'fruit', kcal: 47, p: 0.9, c: 12, f: 0.1, unit: 'g', tags: ['fruit'] },
  { id: 'grapes', name_en: 'Grapes', name_ru: 'Виноград', emoji: '🍇', cat: 'fruit', kcal: 69, p: 0.7, c: 18, f: 0.2, unit: 'g', tags: ['fruit'] },
  { id: 'strawberry', name_en: 'Strawberries', name_ru: 'Клубника', emoji: '🍓', cat: 'fruit', kcal: 32, p: 0.7, c: 7.7, f: 0.3, unit: 'g', tags: ['fruit'] },
  { id: 'blueberry', name_en: 'Blueberries', name_ru: 'Голубика', emoji: '🫐', cat: 'fruit', kcal: 57, p: 0.7, c: 14, f: 0.3, unit: 'g', tags: ['fruit'] },
  { id: 'pear', name_en: 'Pear', name_ru: 'Груша', emoji: '🍐', cat: 'fruit', kcal: 57, p: 0.4, c: 15, f: 0.1, unit: 'g', tags: ['fruit'] },
  { id: 'pineapple', name_en: 'Pineapple', name_ru: 'Ананас', emoji: '🍍', cat: 'fruit', kcal: 50, p: 0.5, c: 13, f: 0.1, unit: 'g', tags: ['fruit'] },
  { id: 'mango', name_en: 'Mango', name_ru: 'Манго', emoji: '🥭', cat: 'fruit', kcal: 60, p: 0.8, c: 15, f: 0.4, unit: 'g', tags: ['fruit'] },
  { id: 'watermelon', name_en: 'Watermelon', name_ru: 'Арбуз', emoji: '🍉', cat: 'fruit', kcal: 30, p: 0.6, c: 8, f: 0.2, unit: 'g', tags: ['fruit'] },
  { id: 'lemon', name_en: 'Lemon', name_ru: 'Лимон', emoji: '🍋', cat: 'fruit', kcal: 29, p: 1.1, c: 9, f: 0.3, unit: 'g', tags: ['fruit'] },
  { id: 'pomegranate', name_en: 'Pomegranate', name_ru: 'Гранат', emoji: '🟥', cat: 'fruit', kcal: 83, p: 1.7, c: 19, f: 1.2, unit: 'g', tags: ['fruit','caucasian'] },
  { id: 'persimmon', name_en: 'Persimmon', name_ru: 'Хурма', emoji: '🟧', cat: 'fruit', kcal: 70, p: 0.6, c: 19, f: 0.2, unit: 'g', tags: ['fruit','caucasian'] },

  // ===== NUTS & SEEDS =====
  { id: 'almonds', name_en: 'Almonds', name_ru: 'Миндаль', emoji: '🌰', cat: 'fat', kcal: 579, p: 21, c: 22, f: 50, unit: 'g', tags: ['nuts','high-fat'] },
  { id: 'walnuts', name_en: 'Walnuts', name_ru: 'Грецкие орехи', emoji: '🌰', cat: 'fat', kcal: 654, p: 15, c: 14, f: 65, unit: 'g', tags: ['nuts','high-fat','caucasian'] },
  { id: 'cashews', name_en: 'Cashews', name_ru: 'Кешью', emoji: '🌰', cat: 'fat', kcal: 553, p: 18, c: 30, f: 44, unit: 'g', tags: ['nuts','high-fat'] },
  { id: 'peanuts', name_en: 'Peanuts', name_ru: 'Арахис', emoji: '🥜', cat: 'fat', kcal: 567, p: 26, c: 16, f: 49, unit: 'g', tags: ['nuts','high-fat'] },
  { id: 'peanut-butter', name_en: 'Peanut butter', name_ru: 'Арахисовая паста', emoji: '🥜', cat: 'fat', kcal: 588, p: 25, c: 20, f: 50, unit: 'g', tags: ['nuts','high-fat'] },
  { id: 'sunflower-seeds', name_en: 'Sunflower seeds', name_ru: 'Семечки подсолнечника', emoji: '🌻', cat: 'fat', kcal: 584, p: 21, c: 20, f: 51, unit: 'g', tags: ['seeds','high-fat'] },
  { id: 'chia-seeds', name_en: 'Chia seeds', name_ru: 'Семена чиа', emoji: '🌱', cat: 'fat', kcal: 486, p: 17, c: 42, f: 31, unit: 'g', tags: ['seeds'] },

  // ===== OILS & FATS =====
  { id: 'olive-oil', name_en: 'Olive oil', name_ru: 'Оливковое масло', emoji: '🫒', cat: 'fat', kcal: 884, p: 0, c: 0, f: 100, unit: 'ml', tags: ['oil','high-fat'] },
  { id: 'sunflower-oil', name_en: 'Sunflower oil', name_ru: 'Подсолнечное масло', emoji: '🌻', cat: 'fat', kcal: 884, p: 0, c: 0, f: 100, unit: 'ml', tags: ['oil','high-fat','russian'] },
  { id: 'coconut-oil', name_en: 'Coconut oil', name_ru: 'Кокосовое масло', emoji: '🥥', cat: 'fat', kcal: 862, p: 0, c: 0, f: 100, unit: 'ml', tags: ['oil','high-fat'] },

  // ===== PREPARED DISHES — RUSSIAN =====
  { id: 'borscht', name_en: 'Borscht', name_ru: 'Борщ', emoji: '🍲', cat: 'mixed', kcal: 60, p: 3, c: 7, f: 2.5, unit: 'g', tags: ['russian','soup'] },
  { id: 'pelmeni', name_en: 'Pelmeni (boiled)', name_ru: 'Пельмени (варёные)', emoji: '🥟', cat: 'mixed', kcal: 248, p: 12, c: 27, f: 10, unit: 'g', tags: ['russian'] },
  { id: 'olivier-salad', name_en: 'Olivier salad', name_ru: 'Салат оливье', emoji: '🥗', cat: 'mixed', kcal: 198, p: 5, c: 9, f: 16, unit: 'g', tags: ['russian'] },
  { id: 'syrniki', name_en: 'Syrniki', name_ru: 'Сырники', emoji: '🥞', cat: 'mixed', kcal: 220, p: 13, c: 22, f: 9, unit: 'g', tags: ['russian'] },
  { id: 'golubtsy', name_en: 'Cabbage rolls (golubtsy)', name_ru: 'Голубцы', emoji: '🥬', cat: 'mixed', kcal: 130, p: 7, c: 11, f: 6.5, unit: 'g', tags: ['russian'] },
  { id: 'beef-stroganoff', name_en: 'Beef stroganoff', name_ru: 'Бефстроганов', emoji: '🍖', cat: 'mixed', kcal: 187, p: 13, c: 6, f: 12, unit: 'g', tags: ['russian'] },

  // ===== PREPARED DISHES — CAUCASIAN =====
  { id: 'shashlik', name_en: 'Shashlik (grilled meat skewer)', name_ru: 'Шашлык', emoji: '🍢', cat: 'mixed', kcal: 220, p: 23, c: 1, f: 14, unit: 'g', tags: ['caucasian'] },
  { id: 'khachapuri', name_en: 'Khachapuri', name_ru: 'Хачапури', emoji: '🫓', cat: 'mixed', kcal: 295, p: 12, c: 30, f: 14, unit: 'g', tags: ['caucasian'] },
  { id: 'khinkali', name_en: 'Khinkali (boiled)', name_ru: 'Хинкали (варёные)', emoji: '🥟', cat: 'mixed', kcal: 235, p: 10, c: 27, f: 9, unit: 'g', tags: ['caucasian'] },
  { id: 'lobio', name_en: 'Lobio (bean stew)', name_ru: 'Лобио', emoji: '🫘', cat: 'mixed', kcal: 130, p: 8, c: 18, f: 3, unit: 'g', tags: ['caucasian','vegan'] },
  { id: 'satsivi', name_en: 'Satsivi (chicken in walnut sauce)', name_ru: 'Сациви (курица в ореховом соусе)', emoji: '🍗', cat: 'mixed', kcal: 250, p: 18, c: 6, f: 18, unit: 'g', tags: ['caucasian'] },
  { id: 'kharcho', name_en: 'Kharcho soup', name_ru: 'Суп харчо', emoji: '🍲', cat: 'mixed', kcal: 90, p: 6, c: 8, f: 4, unit: 'g', tags: ['caucasian','soup'] },
  { id: 'dolma', name_en: 'Dolma', name_ru: 'Долма', emoji: '🌿', cat: 'mixed', kcal: 165, p: 6, c: 13, f: 10, unit: 'g', tags: ['caucasian'] },
  { id: 'chebureki', name_en: 'Cheburek', name_ru: 'Чебурек', emoji: '🥟', cat: 'mixed', kcal: 264, p: 13, c: 29, f: 11, unit: 'g', tags: ['caucasian'] },

  // ===== PREPARED DISHES — WESTERN =====
  { id: 'pizza-cheese', name_en: 'Cheese pizza (1 slice)', name_ru: 'Пицца с сыром (1 кусок)', emoji: '🍕', cat: 'mixed', kcal: 285, p: 12, c: 36, f: 10, unit: 'g', tags: ['western'] },
  { id: 'burger', name_en: 'Cheeseburger', name_ru: 'Чизбургер', emoji: '🍔', cat: 'mixed', kcal: 295, p: 15, c: 25, f: 14, unit: 'g', tags: ['western'] },
  { id: 'caesar-salad', name_en: 'Caesar salad', name_ru: 'Салат цезарь', emoji: '🥗', cat: 'mixed', kcal: 158, p: 5, c: 6, f: 13, unit: 'g', tags: ['western'] },
  { id: 'omelette', name_en: 'Omelette (2 eggs)', name_ru: 'Омлет (2 яйца)', emoji: '🍳', cat: 'mixed', kcal: 154, p: 11, c: 0.6, f: 12, unit: 'g', tags: ['breakfast'] },
  { id: 'pancakes', name_en: 'Pancakes', name_ru: 'Панкейки', emoji: '🥞', cat: 'mixed', kcal: 227, p: 6, c: 28, f: 10, unit: 'g', tags: ['breakfast'] },
  { id: 'french-toast', name_en: 'French toast', name_ru: 'Гренки сладкие (французский тост)', emoji: '🍞', cat: 'mixed', kcal: 229, p: 8, c: 25, f: 11, unit: 'g', tags: ['breakfast'] },

  // ===== SNACKS & SWEETS =====
  { id: 'dark-chocolate', name_en: 'Dark chocolate (70%)', name_ru: 'Тёмный шоколад (70%)', emoji: '🍫', cat: 'sweet', kcal: 598, p: 7.8, c: 46, f: 43, unit: 'g', tags: ['sweet','high-fat'] },
  { id: 'milk-chocolate', name_en: 'Milk chocolate', name_ru: 'Молочный шоколад', emoji: '🍫', cat: 'sweet', kcal: 535, p: 7.6, c: 59, f: 30, unit: 'g', tags: ['sweet'] },
  { id: 'cookie', name_en: 'Cookie (avg)', name_ru: 'Печенье (среднее)', emoji: '🍪', cat: 'sweet', kcal: 502, p: 5, c: 65, f: 24, unit: 'g', tags: ['sweet'] },
  { id: 'ice-cream', name_en: 'Ice cream (vanilla)', name_ru: 'Мороженое (пломбир)', emoji: '🍦', cat: 'sweet', kcal: 207, p: 3.5, c: 24, f: 11, unit: 'g', tags: ['sweet'] },
  { id: 'donut', name_en: 'Donut (glazed)', name_ru: 'Пончик (в глазури)', emoji: '🍩', cat: 'sweet', kcal: 421, p: 5, c: 49, f: 23, unit: 'g', tags: ['sweet'] },
  { id: 'chips', name_en: 'Potato chips', name_ru: 'Чипсы картофельные', emoji: '🥔', cat: 'sweet', kcal: 536, p: 7, c: 53, f: 35, unit: 'g', tags: ['snack','high-fat'] },
  { id: 'popcorn', name_en: 'Popcorn (air-popped)', name_ru: 'Попкорн (без масла)', emoji: '🍿', cat: 'sweet', kcal: 387, p: 13, c: 78, f: 4.5, unit: 'g', tags: ['snack'] },
  { id: 'honey', name_en: 'Honey', name_ru: 'Мёд', emoji: '🍯', cat: 'sweet', kcal: 304, p: 0.3, c: 82, f: 0, unit: 'g', tags: ['sweet'] },
  { id: 'sugar', name_en: 'Sugar', name_ru: 'Сахар', emoji: '🍬', cat: 'sweet', kcal: 387, p: 0, c: 100, f: 0, unit: 'g', tags: ['sweet'] },
  { id: 'jam', name_en: 'Jam', name_ru: 'Варенье', emoji: '🍓', cat: 'sweet', kcal: 250, p: 0.4, c: 65, f: 0.1, unit: 'g', tags: ['sweet'] },

  // ===== DRINKS =====
  { id: 'coffee-black', name_en: 'Coffee (black)', name_ru: 'Кофе чёрный', emoji: '☕', cat: 'drink', kcal: 2, p: 0.3, c: 0, f: 0, unit: 'ml', tags: ['drink'] },
  { id: 'coffee-latte', name_en: 'Latte (medium, whole milk)', name_ru: 'Латте (средний, цельное молоко)', emoji: '☕', cat: 'drink', kcal: 95, p: 6, c: 9, f: 4, unit: 'piece', avgGrams: 350, tags: ['drink'] },
  { id: 'tea', name_en: 'Tea (unsweetened)', name_ru: 'Чай (без сахара)', emoji: '🍵', cat: 'drink', kcal: 1, p: 0, c: 0.2, f: 0, unit: 'ml', tags: ['drink'] },
  { id: 'orange-juice', name_en: 'Orange juice', name_ru: 'Апельсиновый сок', emoji: '🧃', cat: 'drink', kcal: 45, p: 0.7, c: 10, f: 0.2, unit: 'ml', tags: ['drink'] },
  { id: 'apple-juice', name_en: 'Apple juice', name_ru: 'Яблочный сок', emoji: '🧃', cat: 'drink', kcal: 46, p: 0.1, c: 11, f: 0.1, unit: 'ml', tags: ['drink'] },
  { id: 'cola', name_en: 'Cola', name_ru: 'Кола', emoji: '🥤', cat: 'drink', kcal: 42, p: 0, c: 11, f: 0, unit: 'ml', tags: ['drink','sweet'] },
  { id: 'cola-zero', name_en: 'Diet cola', name_ru: 'Кола без сахара', emoji: '🥤', cat: 'drink', kcal: 0, p: 0, c: 0, f: 0, unit: 'ml', tags: ['drink'] },
  { id: 'beer', name_en: 'Beer (lager)', name_ru: 'Пиво (светлое)', emoji: '🍺', cat: 'drink', kcal: 43, p: 0.5, c: 3.6, f: 0, unit: 'ml', tags: ['drink','alcohol'] },
  { id: 'wine-red', name_en: 'Red wine', name_ru: 'Красное вино', emoji: '🍷', cat: 'drink', kcal: 85, p: 0.1, c: 2.6, f: 0, unit: 'ml', tags: ['drink','alcohol'] },
  { id: 'vodka', name_en: 'Vodka', name_ru: 'Водка', emoji: '🥃', cat: 'drink', kcal: 231, p: 0, c: 0, f: 0, unit: 'ml', tags: ['drink','alcohol'] },
  { id: 'protein-shake', name_en: 'Protein shake (whey, w/ water)', name_ru: 'Протеиновый коктейль (на воде)', emoji: '🥤', cat: 'protein', kcal: 120, p: 24, c: 3, f: 1.5, unit: 'piece', avgGrams: 300, tags: ['drink','high-protein'] },

  // ===== CONDIMENTS =====
  { id: 'mayo', name_en: 'Mayonnaise', name_ru: 'Майонез', emoji: '🥫', cat: 'fat', kcal: 680, p: 1, c: 0.6, f: 75, unit: 'g', tags: ['condiment','high-fat'] },
  { id: 'ketchup', name_en: 'Ketchup', name_ru: 'Кетчуп', emoji: '🍅', cat: 'sweet', kcal: 101, p: 1.7, c: 24, f: 0.4, unit: 'g', tags: ['condiment'] },
  { id: 'soy-sauce', name_en: 'Soy sauce', name_ru: 'Соевый соус', emoji: '🍶', cat: 'mixed', kcal: 53, p: 8, c: 5, f: 0.6, unit: 'ml', tags: ['condiment'] }
];

// Lookup helper
const FOOD_BY_ID = Object.fromEntries(FOODS.map(f => [f.id, f]));

// Get food categories for filtering
const FOOD_CATEGORIES = [
  { id: 'all', name_en: 'All', name_ru: 'Все' },
  { id: 'protein', name_en: 'Protein', name_ru: 'Белки' },
  { id: 'carb', name_en: 'Carbs', name_ru: 'Углеводы' },
  { id: 'veg', name_en: 'Veggies', name_ru: 'Овощи' },
  { id: 'fruit', name_en: 'Fruit', name_ru: 'Фрукты' },
  { id: 'fat', name_en: 'Fats', name_ru: 'Жиры' },
  { id: 'mixed', name_en: 'Dishes', name_ru: 'Блюда' },
  { id: 'sweet', name_en: 'Sweets', name_ru: 'Сладкое' },
  { id: 'drink', name_en: 'Drinks', name_ru: 'Напитки' }
];

// Compute calories/macros for a given amount of food
// amount: grams or ml; for "piece" units, amount is # of pieces
function computeMacros(foodId, amount) {
  let food = FOOD_BY_ID[foodId];
  if (!food && typeof STATE !== 'undefined' && STATE.customFoods) {
    food = STATE.customFoods.find(f => f.id === foodId);
  }
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

// Localized display name. Catalog entries carry name_en/name_ru;
// user-saved foods have a single user-entered name shown as is.
function foodName(f) {
  if (!f) return '';
  if (f.name_en || f.name_ru) {
    return (getLang() === 'ru' ? f.name_ru : f.name_en) || f.name_en || f.name_ru;
  }
  return f.name || '';
}

function catName(c) {
  return (getLang() === 'ru' ? c.name_ru : c.name_en) || c.name_en;
}

// Lowercase + treat "ё" as "е" so "мед" finds "Мёд"
function normSearch(s) {
  return String(s || '').toLowerCase().replace(/ё/g, 'е').trim();
}

function scoreName(name, q) {
  if (!name) return 0;
  const n = normSearch(name);
  if (n === q) return 100;
  if (n.startsWith(q)) return 80;
  if (n.includes(' ' + q) || n.includes('(' + q)) return 60;
  if (n.includes(q)) return 40;
  return 0;
}

// Search foods by query (matches both languages, shows current language)
function searchFoods(query, category = 'all') {
  const q = normSearch(query);
  const custom = (typeof STATE !== 'undefined' && Array.isArray(STATE.customFoods)) ? STATE.customFoods : [];
  let results = custom.concat(FOODS);
  if (category !== 'all') {
    results = results.filter(f => f.cat === category);
  }
  if (!q) {
    return results.slice(0, 30);
  }
  // Score: exact name match > starts with > contains > tag match.
  // Name in the current language gets a small edge over the other language.
  const cur = getLang();
  const scored = results.map(f => {
    let score;
    if (f.name_en || f.name_ru) {
      const sEn = scoreName(f.name_en, q) + (cur === 'en' ? 1 : 0);
      const sRu = scoreName(f.name_ru, q) + (cur === 'ru' ? 1 : 0);
      score = Math.max(scoreName(f.name_en, q) ? sEn : 0, scoreName(f.name_ru, q) ? sRu : 0);
    } else {
      score = scoreName(f.name, q);
    }
    if (!score && f.tags?.some(t => t.includes(q))) score = 20;
    // Slight boost so user's own foods surface above near-equal catalog hits
    if (score > 0 && f.custom) score += 5;
    return { food: f, score };
  });
  return scored.filter(s => s.score > 0)
               .sort((a, b) => b.score - a.score)
               .slice(0, 30)
               .map(s => s.food);
}

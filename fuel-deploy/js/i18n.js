/* =============================================
   FUEL — i18n
   Dictionaries (en/ru), translation helper, plurals, locale.
   The chosen language lives in its own localStorage key ('fuel-lang'),
   separate from app data: it survives Reset and is not part of backups.
   First launch: navigator.language starting with "ru" -> ru, else en.
============================================= */

const APP_VERSION = '1.1.0';
const LANG_KEY = 'fuel-lang';
const SUPPORTED_LANGS = [
  { id: 'en', label: 'English' },
  { id: 'ru', label: 'Русский' }
];

const I18N = {
  en: {
    'app.tagline': 'Smart Nutrition Journal',

    'nav.today': 'Today',
    'nav.log': 'Log',
    'nav.plan': 'Plan',
    'nav.body': 'Body',
    'nav.stats': 'Progress',

    'update.available': 'New version available',
    'update.button': 'UPDATE',
    'update.dismiss': 'Dismiss',

    'common.today': 'Today',
    'common.back': 'Back',
    'common.continue': 'Continue',
    'common.close': 'Close',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.add': 'Add',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.yes': 'YES',
    'common.no': 'NO',
    'common.any': 'Any',
    'common.dailyTarget': 'Daily target',

    'unit.g': 'g',
    'unit.kg': 'kg',
    'unit.ml': 'ml',
    'unit.pc': 'pc',
    'unit.serv': 'serv',
    'unit.kcal': 'kcal',
    'unit.cm': 'cm',
    'unit.min': 'min',

    'macro.protein': 'Protein',
    'macro.carbs': 'Carbs',
    'macro.fat': 'Fat',
    'macro.proteinCaps': 'PROTEIN',
    'macro.carbsCaps': 'CARBS',
    'macro.fatCaps': 'FAT',
    'macro.pShort': 'P',
    'macro.cShort': 'C',
    'macro.fShort': 'F',

    'meal.breakfast': 'Breakfast',
    'meal.lunch': 'Lunch',
    'meal.dinner': 'Dinner',
    'meal.snack': 'Snack',
    'mealGroup.breakfast': 'Breakfast',
    'mealGroup.lunch': 'Lunch',
    'mealGroup.dinner': 'Dinner',
    'mealGroup.snack': 'Snacks',

    'goal.cut': 'Lose fat',
    'goal.maintain': 'Maintain',
    'goal.bulk': 'Build muscle',

    'activity.sedentary': 'Sedentary',
    'activity.light': 'Light',
    'activity.moderate': 'Moderate',
    'activity.active': 'Active',
    'activity.very': 'Very active',

    'cuisine.universal': 'Universal',
    'cuisine.russian': 'Russian',
    'cuisine.caucasian': 'Caucasian',

    'recipe.easy': 'Easy',
    'recipe.medium': 'Medium',
    'recipe.advanced': 'Advanced',

    // Onboarding
    'onb.welcome': 'Track your calories with photos, get meal plans tailored to your budget and time, and watch your daily target self-adjust as you progress.',
    'onb.start': 'Get started',
    'onb.step': 'Step {n} of {total}',
    'onb.sex.title': 'Are you...',
    'onb.sex.sub': 'We use this to calculate your metabolic rate.',
    'onb.sex.male': 'Male',
    'onb.sex.female': 'Female',
    'onb.age.title': 'How old are you?',
    'onb.age.sub': 'In years.',
    'onb.height.title': 'Your height?',
    'onb.height.sub': 'In centimeters.',
    'onb.weight.title': 'Your weight?',
    'onb.weight.sub': 'In kilograms. Be honest, this is for the math.',
    'onb.goal.title': "What's the goal?",
    'onb.goal.sub': 'You can change this any time.',
    'onb.goal.cutDesc': 'About 0.5 kg per week, 20% calorie deficit',
    'onb.goal.maintainDesc': 'Keep current weight, fuel your training',
    'onb.goal.bulkDesc': 'About 0.3 kg per week, 10% surplus',
    'onb.act.title': 'How active are you?',
    'onb.act.sub': 'Outside of structured workouts.',
    'onb.act.sedentaryDesc': 'Office work, mostly sitting',
    'onb.act.lightDesc': '1-3 workouts/week, some walking',
    'onb.act.moderateDesc': '3-5 workouts/week, on your feet often',
    'onb.act.active': 'Very active',
    'onb.act.activeDesc': '6-7 workouts/week, physical job',

    // Today
    'today.trainingBonus': 'Training day: +{n} kcal granted',
    'today.addFood': 'Add food',
    'today.prevDay': 'Previous day',
    'today.nextDay': 'Next day',
    'today.jumpToday': 'Jump to today',
    'today.left': '{n} left',
    'today.over': '{n} over',
    'today.stats': "Today's stats",
    'today.weight': 'Weight',
    'today.steps': 'Steps',
    'today.trained': 'Trained',

    // Add food
    'add.title.breakfast': 'Add to Breakfast',
    'add.title.lunch': 'Add to Lunch',
    'add.title.dinner': 'Add to Dinner',
    'add.title.snack': 'Add to Snacks',
    'add.addTo.breakfast': 'Add to breakfast',
    'add.addTo.lunch': 'Add to lunch',
    'add.addTo.dinner': 'Add to dinner',
    'add.addTo.snack': 'Add to snacks',
    'add.photo': 'Photo',
    'add.offline': 'offline',
    'add.manual': 'Manual',
    'add.search': 'Search {n}+ foods...',
    'add.noResults': 'No foods found.',
    'add.noResultsHint': 'Try different keywords or use Manual entry.',
    'add.mine': 'MINE',
    'add.per': 'per {u}',
    'add.perPiece': 'piece',
    'add.kcalPer': '{n} kcal per {u}',
    'add.amount': 'Amount',
    'add.willAdd': 'Will add',

    // Photo
    'photo.analyzing': 'Analyzing...',
    'photo.identifying': 'Identifying food...',
    'photo.addTitle': 'Add photo',
    'photo.descLabel': 'Description (optional)',
    'photo.descPlaceholder': 'e.g. eclair with custard 50 g / kharcho with beef',
    'photo.analyze': 'Analyze',
    'photo.noKeyTitle': 'No API key set',
    'photo.noKeyText': 'To recognize food from photos, add your Anthropic API key in Settings. The photo is sent directly from your phone, nothing is stored on any server.',
    'photo.addKey': 'Add API key',
    'photo.enterManually': 'Enter manually',
    'photo.parseError': 'Could not parse response. Try again.',
    'photo.apiError': 'API error {n}',
    'photo.failed': 'Recognition failed',
    'photo.unknownError': 'Unknown error',
    'photo.failedHint': 'Common causes: invalid API key, no credits, or network error.',
    'photo.checkKey': 'Check key',
    'photo.unknownFood': 'Unknown food',
    'photo.conf.high': 'high',
    'photo.conf.medium': 'medium',
    'photo.conf.low': 'low',
    'photo.aiEstimate': 'AI estimate',
    'photo.aiAdjusted': 'AI est. {n} g · adjusted',
    'photo.weightLabel': 'Weight (g)',
    'photo.less': 'Less',
    'photo.more': 'More',
    'photo.tweak': 'Tweak',
    'photo.mealFallback': 'Photo meal',

    // Manual entry
    'manual.title': 'Manual entry',
    'manual.editTitle': 'Edit meal',
    'manual.name': 'Name',
    'manual.namePlaceholder': "e.g. Grandma's stew",
    'manual.kcal': 'Calories (kcal)',
    'manual.protein': 'Protein g',
    'manual.carbs': 'Carbs g',
    'manual.fat': 'Fat g',
    'manual.saveToggle': 'Save to my foods',
    'manual.saveToggleSub': 'REUSE IT FROM SEARCH LATER',
    'manual.portionWeight': 'Portion weight (g): the macros above are for this weight',

    // Weight / steps
    'weight.title': 'Log weight',
    'weight.hint': 'Weigh in the morning, after the bathroom, before food. Most reliable trend.',
    'steps.title': 'Log steps',

    // Body
    'body.noChange': 'No change yet',
    'body.fromStart': '{n} kg from start ({pct}%)',
    'body.logWeight': "Log today's weight",
    'body.trend': 'Weight trend',
    'body.needTwo': 'Need at least 2 weigh-ins to plot a trend.',
    'body.stats': 'Body stats',
    'body.startWeight': 'Starting weight',
    'body.currentWeight': 'Current weight',
    'body.totalChange': 'Total change',
    'body.height': 'Height',
    'body.bmi': 'BMI',
    'body.bmr': 'BMR',
    'body.tdee': 'TDEE',
    'body.autoAdjusted': 'Auto-adjusted by FUEL based on your real progress',

    // Plan
    'plan.eyebrow': 'Meal generator',
    'plan.title': 'Plan a day',
    'plan.sub': 'Choose filters, get a full day of meals at about {n} kcal.',
    'plan.cuisine': 'Cuisine',
    'plan.maxTime': 'Max time per meal',
    'plan.difficulty': 'Difficulty',
    'plan.easyOnly': 'Easy only',
    'plan.upToMedium': '≤Medium',
    'plan.budget': 'Budget',
    'plan.generate': 'Generate day plan',
    'plan.yourDay': 'Your day',
    'plan.addAll': "Add full plan to today's log",
    'plan.ingredients': 'Ingredients',
    'plan.steps': 'Steps',
    'plan.addToLog': 'Add to log',

    // Log
    'log.history': 'History',
    'log.sub': 'Tap any day to view or edit it.',
    'log.empty': 'No log entries yet.',
    'log.emptyHint': 'Start tracking on the Today tab.',
    'log.trained': 'trained',

    // Share
    'share.generating': 'Generating share card...',
    'share.title': 'Share day',
    'share.download': 'Download',
    'share.share': 'Share',
    'share.downloadImage': 'Download image',
    'share.longPress': 'On mobile: long-press image to save',
    'share.nativeTitle': 'FUEL: Day summary',
    'share.nativeText': 'My nutrition log',
    'share.ofTarget': '{n}% OF TARGET',
    'share.mealsLogged': '{n} logged',
    'share.trainingDay': 'Training day',
    'share.streak': '{n} streak',

    // Stats
    'stats.thisWeek': 'This week',
    'stats.weeksAgo': '{n} ago',
    'stats.streak': 'Streak',
    'stats.keepUp': 'Keep it up!',
    'stats.startStreak': 'Track today to start a streak.',
    'stats.building': 'Building consistency.',
    'stats.last7': 'Last 7 days',
    'stats.macroSplit': 'Macro split',
    'stats.last7short': 'last 7d',
    'stats.noMeals': 'No meals logged in the past week.',
    'stats.weekly': 'Weekly summary',
    'stats.tracked': '{n} tracked',
    'stats.avgKcal': 'AVG KCAL',
    'stats.profile': 'Profile',
    'stats.goal': 'Goal',
    'stats.activity': 'Activity',
    'stats.target': 'target {n}',

    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.photo': 'Photo recognition',
    'settings.photoText': 'Paste your Anthropic API key to enable photo-based food recognition. Photos go directly to api.anthropic.com, nothing is stored on any server.',
    'settings.getKey': 'Get a key at',
    'settings.saveKey': 'Save key',
    'settings.removeKey': 'Remove',
    'settings.activity': 'Activity level',
    'settings.target': 'Daily calorie target',
    'settings.customOverride': 'CUSTOM OVERRIDE',
    'settings.autoCalc': 'AUTO-CALCULATED',
    'settings.resetAuto': 'Reset to auto',
    'settings.autoWouldBe': 'Auto would be: {n} kcal',
    'settings.setCustom': 'Set custom target',
    'settings.myFoods': 'My foods',
    'settings.noFoods': 'No saved foods yet. When you add a meal manually, flip {toggle} to reuse it from search.',
    'settings.data': 'Data',
    'settings.export': 'Export backup (JSON)',
    'settings.import': 'Import backup',
    'settings.storagePersistent': 'Storage: Persistent ✓',
    'settings.storageTap': 'Storage: Tap to make persistent',
    'settings.danger': 'Danger',
    'settings.reset': 'Reset all data',

    // Custom food / target / reset / import
    'cf.title': 'Edit food',
    'cf.hint': 'Values are per 100 g, they scale to any portion when you add this food.',
    'cf.kcal': 'Calories (kcal / 100g)',
    'cf.deleteTitle': 'Delete food?',
    'cf.deleteText': 'Remove {name} from your foods? Meals you already logged with it stay unchanged.',
    'ct.title': 'Custom target',
    'ct.text': "Override the auto-calculated target. Once set, FUEL won't auto-adjust this number based on your weight trend.",
    'reset.title': 'Reset all data?',
    'reset.text': 'This will permanently delete your profile, all logs, weight history, and settings. This cannot be undone.',
    'reset.hint': 'Consider exporting a backup first.',
    'reset.confirm': 'Delete all',
    'import.confirm': 'This will replace all your current data. Continue?',

    // Toasts
    'toast.welcome': 'Welcome to FUEL!',
    'toast.storageFull': 'Storage is full. Make a backup and clear old logs.',
    'toast.targetAdjusted': 'Daily target adjusted: {n} kcal',
    'toast.enterNumber': 'Please enter a number',
    'toast.min': 'Minimum is {n}',
    'toast.max': 'Maximum is {n}',
    'toast.pickOption': 'Please pick an option',
    'toast.validAmount': 'Enter a valid amount',
    'toast.addedKcal': 'Added {n} kcal',
    'toast.removed': 'Removed',
    'toast.noFood': 'No food detected in photo',
    'toast.enterName': 'Enter a name',
    'toast.enterKcal': 'Enter calories',
    'toast.updated': 'Updated',
    'toast.addedSaved': 'Added · saved to my foods',
    'toast.validWeight': 'Enter a valid weight',
    'toast.loggedWeight': 'Logged {n} kg',
    'toast.validNumber': 'Enter a valid number',
    'toast.loggedSteps': 'Logged {n} steps',
    'toast.trainingOn': 'Training day on, extra kcal granted',
    'toast.trainingOff': 'Training day off',
    'toast.noPlan': 'No combination matches these filters. Loosen them up.',
    'toast.recipeAdded': 'Added "{name}" to today',
    'toast.planAdded': 'Added {n} to today',
    'toast.shareCardFailed': 'Could not generate share card',
    'toast.downloaded': 'Downloaded',
    'toast.shareFailed': 'Sharing failed',
    'toast.saved': 'Saved',
    'toast.deleted': 'Deleted',
    'toast.keyPrefix': 'Key should start with sk-ant-',
    'toast.keySaved': 'API key saved',
    'toast.keyRemoved': 'API key removed',
    'toast.goal': 'Goal: {name}',
    'toast.activity': 'Activity updated',
    'toast.targetRange': 'Enter 800-6000',
    'toast.targetSet': 'Target: {n} kcal/day',
    'toast.resetAuto': 'Reset to auto',
    'toast.exported': 'Backup exported',
    'toast.restored': 'Backup restored',
    'toast.invalidBackup': 'Invalid backup file',
    'toast.persistOk': 'Storage is now persistent ✓',
    'toast.persistNo': 'Browser declined persistent storage',
    'toast.cleared': 'All data cleared',

    // Plurals: one / other
    'plural.days': { one: '{n} day', other: '{n} days' },
    'plural.daysStreak': { one: '{n}-day', other: '{n}-day' },
    'plural.weeks': { one: '{n} week', other: '{n} weeks' },
    'plural.entries': { one: '{n} entry', other: '{n} entries' },
    'plural.meals': { one: '{n} meal', other: '{n} meals' },
    'plural.trainings': { one: '{n} training', other: '{n} trainings' },
    'plural.steps': { one: '{n} step', other: '{n} steps' },
    'plural.pcs': { one: '{n} pc', other: '{n} pcs' }
  },

  ru: {
    'app.tagline': 'Умный дневник питания',

    'nav.today': 'Сегодня',
    'nav.log': 'Журнал',
    'nav.plan': 'План',
    'nav.body': 'Тело',
    'nav.stats': 'Прогресс',

    'update.available': 'Доступна новая версия',
    'update.button': 'ОБНОВИТЬ',
    'update.dismiss': 'Скрыть',

    'common.today': 'Сегодня',
    'common.back': 'Назад',
    'common.continue': 'Далее',
    'common.close': 'Закрыть',
    'common.cancel': 'Отмена',
    'common.save': 'Сохранить',
    'common.add': 'Добавить',
    'common.edit': 'Изменить',
    'common.delete': 'Удалить',
    'common.yes': 'ДА',
    'common.no': 'НЕТ',
    'common.any': 'Не важно',
    'common.dailyTarget': 'Цель на день',

    'unit.g': 'г',
    'unit.kg': 'кг',
    'unit.ml': 'мл',
    'unit.pc': 'шт',
    'unit.serv': 'порц',
    'unit.kcal': 'ккал',
    'unit.cm': 'см',
    'unit.min': 'мин',

    'macro.protein': 'Белки',
    'macro.carbs': 'Углеводы',
    'macro.fat': 'Жиры',
    'macro.proteinCaps': 'БЕЛКИ',
    'macro.carbsCaps': 'УГЛЕВОДЫ',
    'macro.fatCaps': 'ЖИРЫ',
    'macro.pShort': 'Б',
    'macro.cShort': 'У',
    'macro.fShort': 'Ж',

    'meal.breakfast': 'Завтрак',
    'meal.lunch': 'Обед',
    'meal.dinner': 'Ужин',
    'meal.snack': 'Перекус',
    'mealGroup.breakfast': 'Завтрак',
    'mealGroup.lunch': 'Обед',
    'mealGroup.dinner': 'Ужин',
    'mealGroup.snack': 'Перекусы',

    'goal.cut': 'Сбросить жир',
    'goal.maintain': 'Поддерживать вес',
    'goal.bulk': 'Набрать мышцы',

    'activity.sedentary': 'Сидячий',
    'activity.light': 'Лёгкий',
    'activity.moderate': 'Умеренный',
    'activity.active': 'Активный',
    'activity.very': 'Очень активный',

    'cuisine.universal': 'Универсальная',
    'cuisine.russian': 'Русская',
    'cuisine.caucasian': 'Кавказская',

    'recipe.easy': 'Легко',
    'recipe.medium': 'Средне',
    'recipe.advanced': 'Сложно',

    // Onboarding
    'onb.welcome': 'Считайте калории по фото, получайте планы питания под свой бюджет и время, а дневная цель подстроится сама по мере прогресса.',
    'onb.start': 'Начать',
    'onb.step': 'Шаг {n} из {total}',
    'onb.sex.title': 'Ваш пол',
    'onb.sex.sub': 'Нужен для расчёта обмена веществ.',
    'onb.sex.male': 'Мужской',
    'onb.sex.female': 'Женский',
    'onb.age.title': 'Сколько вам лет?',
    'onb.age.sub': 'Полных лет.',
    'onb.height.title': 'Ваш рост?',
    'onb.height.sub': 'В сантиметрах.',
    'onb.weight.title': 'Ваш вес?',
    'onb.weight.sub': 'В килограммах. Честно, это для расчётов.',
    'onb.goal.title': 'Какая цель?',
    'onb.goal.sub': 'Её можно поменять в любой момент.',
    'onb.goal.cutDesc': 'Около 0,5 кг в неделю, дефицит калорий 20%',
    'onb.goal.maintainDesc': 'Держать текущий вес и восстанавливаться после тренировок',
    'onb.goal.bulkDesc': 'Около 0,3 кг в неделю, профицит 10%',
    'onb.act.title': 'Насколько вы активны?',
    'onb.act.sub': 'Не считая тренировок.',
    'onb.act.sedentaryDesc': 'Офисная работа, в основном сидя',
    'onb.act.lightDesc': '1-3 тренировки в неделю, немного ходьбы',
    'onb.act.moderateDesc': '3-5 тренировок в неделю, часто на ногах',
    'onb.act.active': 'Очень активный',
    'onb.act.activeDesc': '6-7 тренировок в неделю, физическая работа',

    // Today
    'today.trainingBonus': 'День тренировки: +{n} ккал к цели',
    'today.addFood': 'Добавить еду',
    'today.prevDay': 'Предыдущий день',
    'today.nextDay': 'Следующий день',
    'today.jumpToday': 'К сегодняшнему дню',
    'today.left': 'осталось {n}',
    'today.over': 'перебор {n}',
    'today.stats': 'Сегодня',
    'today.weight': 'Вес',
    'today.steps': 'Шаги',
    'today.trained': 'Тренировка',

    // Add food
    'add.title.breakfast': 'Добавить в завтрак',
    'add.title.lunch': 'Добавить в обед',
    'add.title.dinner': 'Добавить в ужин',
    'add.title.snack': 'Добавить в перекусы',
    'add.addTo.breakfast': 'Добавить в завтрак',
    'add.addTo.lunch': 'Добавить в обед',
    'add.addTo.dinner': 'Добавить в ужин',
    'add.addTo.snack': 'Добавить в перекусы',
    'add.photo': 'Фото',
    'add.offline': 'офлайн',
    'add.manual': 'Вручную',
    'add.search': 'Поиск среди {n}+ продуктов...',
    'add.noResults': 'Ничего не найдено.',
    'add.noResultsHint': 'Попробуйте другие слова или добавьте вручную.',
    'add.mine': 'МОЁ',
    'add.per': 'на {u}',
    'add.perPiece': 'штуку',
    'add.kcalPer': '{n} ккал на {u}',
    'add.amount': 'Количество',
    'add.willAdd': 'Будет добавлено',

    // Photo
    'photo.analyzing': 'Анализ...',
    'photo.identifying': 'Распознаём еду...',
    'photo.addTitle': 'Добавить фото',
    'photo.descLabel': 'Описание (необязательно)',
    'photo.descPlaceholder': 'напр. эклер с заварным кремом 50 г / харчо с говядиной',
    'photo.analyze': 'Распознать',
    'photo.noKeyTitle': 'API-ключ не задан',
    'photo.noKeyText': 'Чтобы распознавать еду по фото, добавьте ключ Anthropic API в настройках. Фото отправляется прямо с телефона, на серверах ничего не хранится.',
    'photo.addKey': 'Добавить ключ',
    'photo.enterManually': 'Ввести вручную',
    'photo.parseError': 'Не удалось разобрать ответ. Попробуйте ещё раз.',
    'photo.apiError': 'Ошибка API {n}',
    'photo.failed': 'Не удалось распознать',
    'photo.unknownError': 'Неизвестная ошибка',
    'photo.failedHint': 'Частые причины: неверный ключ, закончились кредиты или нет сети.',
    'photo.checkKey': 'Проверить ключ',
    'photo.unknownFood': 'Неизвестное блюдо',
    'photo.conf.high': 'высокая',
    'photo.conf.medium': 'средняя',
    'photo.conf.low': 'низкая',
    'photo.aiEstimate': 'Оценка ИИ',
    'photo.aiAdjusted': 'ИИ: {n} г · изменено',
    'photo.weightLabel': 'Вес (г)',
    'photo.less': 'Меньше',
    'photo.more': 'Больше',
    'photo.tweak': 'Поправить',
    'photo.mealFallback': 'Блюдо с фото',

    // Manual entry
    'manual.title': 'Ручной ввод',
    'manual.editTitle': 'Изменить запись',
    'manual.name': 'Название',
    'manual.namePlaceholder': 'напр. бабушкино рагу',
    'manual.kcal': 'Калории (ккал)',
    'manual.protein': 'Белки, г',
    'manual.carbs': 'Углеводы, г',
    'manual.fat': 'Жиры, г',
    'manual.saveToggle': 'Сохранить в мои продукты',
    'manual.saveToggleSub': 'ПОТОМ НАЙДЁТСЯ В ПОИСКЕ',
    'manual.portionWeight': 'Вес порции (г): значения выше указаны для этого веса',

    // Weight / steps
    'weight.title': 'Записать вес',
    'weight.hint': 'Взвешивайтесь утром, после туалета и до еды. Так тренд точнее всего.',
    'steps.title': 'Записать шаги',

    // Body
    'body.noChange': 'Пока без изменений',
    'body.fromStart': '{n} кг от старта ({pct}%)',
    'body.logWeight': 'Записать вес за сегодня',
    'body.trend': 'Динамика веса',
    'body.needTwo': 'Для графика нужно минимум 2 взвешивания.',
    'body.stats': 'Показатели',
    'body.startWeight': 'Стартовый вес',
    'body.currentWeight': 'Текущий вес',
    'body.totalChange': 'Изменение',
    'body.height': 'Рост',
    'body.bmi': 'ИМТ',
    'body.bmr': 'Базовый обмен',
    'body.tdee': 'Расход за день',
    'body.autoAdjusted': 'Скорректировано FUEL по вашему реальному прогрессу',

    // Plan
    'plan.eyebrow': 'Генератор меню',
    'plan.title': 'План на день',
    'plan.sub': 'Выберите фильтры и получите меню на день примерно на {n} ккал.',
    'plan.cuisine': 'Кухня',
    'plan.maxTime': 'Время на один приём',
    'plan.difficulty': 'Сложность',
    'plan.easyOnly': 'Только лёгкие',
    'plan.upToMedium': '≤Средние',
    'plan.budget': 'Бюджет',
    'plan.generate': 'Составить план',
    'plan.yourDay': 'Ваш день',
    'plan.addAll': 'Добавить весь план в сегодня',
    'plan.ingredients': 'Ингредиенты',
    'plan.steps': 'Приготовление',
    'plan.addToLog': 'В журнал',

    // Log
    'log.history': 'История',
    'log.sub': 'Нажмите на день, чтобы посмотреть или изменить.',
    'log.empty': 'Записей пока нет.',
    'log.emptyHint': 'Начните на вкладке «Сегодня».',
    'log.trained': 'тренировка',

    // Share
    'share.generating': 'Готовим карточку...',
    'share.title': 'Поделиться днём',
    'share.download': 'Скачать',
    'share.share': 'Поделиться',
    'share.downloadImage': 'Скачать картинку',
    'share.longPress': 'На телефоне: удерживайте картинку, чтобы сохранить',
    'share.nativeTitle': 'FUEL: итоги дня',
    'share.nativeText': 'Мой дневник питания',
    'share.ofTarget': '{n}% ОТ ЦЕЛИ',
    'share.mealsLogged': 'Записано: {n}',
    'share.trainingDay': 'День тренировки',
    'share.streak': 'Серия: {n}',

    // Stats
    'stats.thisWeek': 'Эта неделя',
    'stats.weeksAgo': '{n} назад',
    'stats.streak': 'Серия',
    'stats.keepUp': 'Так держать!',
    'stats.startStreak': 'Запишите еду сегодня, чтобы начать серию.',
    'stats.building': 'Вырабатываем привычку.',
    'stats.last7': 'Последние 7 дней',
    'stats.macroSplit': 'Баланс БЖУ',
    'stats.last7short': 'за 7 дн',
    'stats.noMeals': 'За последнюю неделю записей нет.',
    'stats.weekly': 'По неделям',
    'stats.tracked': 'с записями: {n}',
    'stats.avgKcal': 'СР. ККАЛ',
    'stats.profile': 'Профиль',
    'stats.goal': 'Цель',
    'stats.activity': 'Активность',
    'stats.target': 'цель {n}',

    // Settings
    'settings.title': 'Настройки',
    'settings.language': 'Язык',
    'settings.photo': 'Распознавание фото',
    'settings.photoText': 'Вставьте ключ Anthropic API, чтобы распознавать еду по фото. Фото уходят напрямую на api.anthropic.com, на серверах ничего не хранится.',
    'settings.getKey': 'Получить ключ:',
    'settings.saveKey': 'Сохранить ключ',
    'settings.removeKey': 'Удалить',
    'settings.activity': 'Уровень активности',
    'settings.target': 'Дневная цель по калориям',
    'settings.customOverride': 'ЗАДАНА ВРУЧНУЮ',
    'settings.autoCalc': 'РАССЧИТАНА АВТОМАТИЧЕСКИ',
    'settings.resetAuto': 'Вернуть авто',
    'settings.autoWouldBe': 'Авторасчёт: {n} ккал',
    'settings.setCustom': 'Задать свою цель',
    'settings.myFoods': 'Мои продукты',
    'settings.noFoods': 'Сохранённых продуктов пока нет. При ручном вводе включите {toggle}, чтобы потом найти его в поиске.',
    'settings.data': 'Данные',
    'settings.export': 'Экспорт бэкапа (JSON)',
    'settings.import': 'Импорт бэкапа',
    'settings.storagePersistent': 'Хранилище: постоянное ✓',
    'settings.storageTap': 'Хранилище: нажмите, чтобы закрепить',
    'settings.danger': 'Опасная зона',
    'settings.reset': 'Удалить все данные',

    // Custom food / target / reset / import
    'cf.title': 'Изменить продукт',
    'cf.hint': 'Значения на 100 г, при добавлении они пересчитываются на любую порцию.',
    'cf.kcal': 'Калории (ккал / 100 г)',
    'cf.deleteTitle': 'Удалить продукт?',
    'cf.deleteText': 'Удалить {name} из ваших продуктов? Уже записанные приёмы пищи не изменятся.',
    'ct.title': 'Своя цель',
    'ct.text': 'Замените автоматическую цель своей. После этого FUEL не будет подстраивать её по динамике веса.',
    'reset.title': 'Удалить все данные?',
    'reset.text': 'Профиль, все записи, история веса и настройки будут удалены навсегда. Отменить это нельзя.',
    'reset.hint': 'Сначала лучше сделать бэкап.',
    'reset.confirm': 'Удалить всё',
    'import.confirm': 'Все текущие данные будут заменены. Продолжить?',

    // Toasts
    'toast.welcome': 'Добро пожаловать в FUEL!',
    'toast.storageFull': 'Хранилище заполнено. Сделайте бэкап и удалите старые записи.',
    'toast.targetAdjusted': 'Дневная цель изменена: {n} ккал',
    'toast.enterNumber': 'Введите число',
    'toast.min': 'Минимум {n}',
    'toast.max': 'Максимум {n}',
    'toast.pickOption': 'Выберите вариант',
    'toast.validAmount': 'Введите корректное количество',
    'toast.addedKcal': 'Добавлено {n} ккал',
    'toast.removed': 'Удалено',
    'toast.noFood': 'На фото не найдено еды',
    'toast.enterName': 'Введите название',
    'toast.enterKcal': 'Введите калории',
    'toast.updated': 'Обновлено',
    'toast.addedSaved': 'Добавлено · сохранено в мои продукты',
    'toast.validWeight': 'Введите корректный вес',
    'toast.loggedWeight': 'Записано {n} кг',
    'toast.validNumber': 'Введите корректное число',
    'toast.loggedSteps': 'Записано шагов: {n}',
    'toast.trainingOn': 'День тренировки, цель увеличена',
    'toast.trainingOff': 'Тренировка снята',
    'toast.noPlan': 'Под эти фильтры ничего не подходит. Ослабьте их.',
    'toast.recipeAdded': '«{name}» добавлено в сегодня',
    'toast.planAdded': 'Добавлено в сегодня: {n}',
    'toast.shareCardFailed': 'Не удалось создать карточку',
    'toast.downloaded': 'Скачано',
    'toast.shareFailed': 'Не удалось поделиться',
    'toast.saved': 'Сохранено',
    'toast.deleted': 'Удалено',
    'toast.keyPrefix': 'Ключ должен начинаться с sk-ant-',
    'toast.keySaved': 'Ключ сохранён',
    'toast.keyRemoved': 'Ключ удалён',
    'toast.goal': 'Цель: {name}',
    'toast.activity': 'Активность обновлена',
    'toast.targetRange': 'Введите от 800 до 6000',
    'toast.targetSet': 'Цель: {n} ккал в день',
    'toast.resetAuto': 'Возвращён авторасчёт',
    'toast.exported': 'Бэкап сохранён',
    'toast.restored': 'Бэкап восстановлен',
    'toast.invalidBackup': 'Неверный файл бэкапа',
    'toast.persistOk': 'Хранилище закреплено ✓',
    'toast.persistNo': 'Браузер не разрешил закрепить хранилище',
    'toast.cleared': 'Все данные удалены',

    // Plurals: one / few / many (Intl.PluralRules 'ru'); "other" is for fractions
    'plural.days': { one: '{n} день', few: '{n} дня', many: '{n} дней', other: '{n} дня' },
    'plural.daysStreak': { one: '{n} день', few: '{n} дня', many: '{n} дней', other: '{n} дня' },
    'plural.weeks': { one: '{n} неделю', few: '{n} недели', many: '{n} недель', other: '{n} недели' },
    'plural.entries': { one: '{n} запись', few: '{n} записи', many: '{n} записей', other: '{n} записи' },
    'plural.meals': { one: '{n} приём пищи', few: '{n} приёма пищи', many: '{n} приёмов пищи', other: '{n} приёма пищи' },
    'plural.trainings': { one: '{n} тренировка', few: '{n} тренировки', many: '{n} тренировок', other: '{n} тренировки' },
    'plural.steps': { one: '{n} шаг', few: '{n} шага', many: '{n} шагов', other: '{n} шага' },
    'plural.pcs': { one: '{n} шт', few: '{n} шт', many: '{n} шт', other: '{n} шт' }
  }
};

function detectLang() {
  const nav = (navigator.language || '').toLowerCase();
  return nav.startsWith('ru') ? 'ru' : 'en';
}

let CURRENT_LANG = (() => {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && I18N[saved]) return saved;
  } catch (e) {}
  return detectLang();
})();

function getLang() {
  return CURRENT_LANG;
}

function setLang(lang) {
  if (!I18N[lang]) return;
  CURRENT_LANG = lang;
  try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
}

function locale() {
  return CURRENT_LANG === 'ru' ? 'ru-RU' : 'en-US';
}

function hasKey(key) {
  return key in I18N[CURRENT_LANG] || key in I18N.en;
}

// t('toast.addedKcal', { n: 250 }) -> "Added 250 kcal"
// Falls back to English, then to the key itself, so a missing string is visible but harmless.
function t(key, params) {
  let s = I18N[CURRENT_LANG][key];
  if (s === undefined) s = I18N.en[key];
  if (s === undefined) return key;
  if (typeof s !== 'string') return key;
  return fillParams(s, params);
}

function fillParams(s, params) {
  if (!params) return s;
  return s.replace(/\{(\w+)\}/g, (m, k) => (params[k] !== undefined ? params[k] : m));
}

// plural(5, 'plural.days') -> "5 дней" / "5 days"
// wordOnly drops the number ("шт"); display overrides how the number is printed (e.g. "12 500").
function plural(n, key, wordOnly, display) {
  const forms = I18N[CURRENT_LANG][key] || I18N.en[key];
  if (!forms) return String(n);
  const rule = new Intl.PluralRules(locale()).select(n);
  const form = forms[rule] || forms.other || forms.one;
  if (wordOnly) return form.replace(/\{n\}\s*/, '').trim();
  return fillParams(form, { n: display !== undefined ? display : n });
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

// Static markup in index.html: nav labels and the update banner
function applyStaticI18n() {
  document.documentElement.lang = CURRENT_LANG;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    el.setAttribute('aria-label', t(el.dataset.i18nAria));
  });
}

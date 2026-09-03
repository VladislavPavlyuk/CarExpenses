export type Language = 'uk' | 'en';

export const translations = {
  uk: {
    // Навігація
    navList:       'Список',
    navAdd:        'Додавання',
    navStats:      'Статистика',
    navSettings:   'Налаштування',
    navDetail:     'Деталі витрати',
    navEdit:       'Редагування',
    navAddBtn:     '+ Додати',

    // Типи витрат
    typeAll:           'Всі',
    typeFuel:          'заправка',
    typeRepair:        'ремонт',
    typeMaintenance:   'технічне обслуговування',
    typeInsurance:     'страхування',
    typeOther:         'інші витрати',

    // Список
    searchPlaceholder:  'Пошук (тип, опис, дата, сума)...',
    dateFromPlaceholder:'Початок (YYYY-MM-DD)',
    dateToPlaceholder:  'Кінець (YYYY-MM-DD)',
    sortDate:           'Дата',
    sortAmount:         'Сума',
    emptyList:          'Витрат не знайдено. Додайте першу операцію.',
    km:                 'км',

    // Форма
    formExpenseType:    'Тип витрати:',
    formAmount:         'Сума (₴):',
    formDate:           'Дата (YYYY-MM-DD):',
    formMileage:        'Пробіг (км):',
    formDescription:    'Опис:',
    formDescPlaceholder:"Необов'язково",
    formSave:           'Зберегти',
    formUpdate:         'Оновити',
    formErrRequired:    'Заповніть суму, дату та пробіг',
    formErrAmount:      'Сума має бути додатним числом',
    formErrDate:        "Дата у форматі YYYY-MM-DD",
    formErrMileage:     'Пробіг має бути невід\u2019ємним числом',

    // Деталі
    detailDate:     'Дата:',
    detailMileage:  'Пробіг:',
    detailDesc:     'Опис:',
    detailEdit:     'Редагувати',
    detailDelete:   'Видалити',
    deleteTitle:    'Видалення',
    deleteConfirm:  'Ви впевнені, що хочете видалити цей запис?',
    deleteCancel:   'Скасувати',

    // Статистика
    statsTotal:       'Загальні витрати',
    statsAvgFuel:     'Середня вартість заправки:',
    statsByCategory:  'Витрати за категоріями',
    statsRecent:      'Останні операції',
    statsNoRecords:   'Поки немає записів',

    // Налаштування
    settingsDarkTheme:    'Темна тема',
    settingsStorageNote:  'Зберігається в AsyncStorage',
    settingsLanguage:     'Мова інтерфейсу',
    settingsCurrency:     'Валюта',
    settingsExit:         'Вийти з додатка',
    exitIosNote:          'На iOS закрийте додаток системною жестом / кнопкою.',
    exitTitle:            'Вихід',
  },
  en: {
    navList:       'List',
    navAdd:        'Add',
    navStats:      'Statistics',
    navSettings:   'Settings',
    navDetail:     'Expense details',
    navEdit:       'Edit',
    navAddBtn:     '+ Add',

    typeAll:           'All',
    typeFuel:          'fuel',
    typeRepair:        'repair',
    typeMaintenance:   'maintenance',
    typeInsurance:     'insurance',
    typeOther:         'other expenses',

    searchPlaceholder:  'Search (type, note, date, amount)...',
    dateFromPlaceholder:'From (YYYY-MM-DD)',
    dateToPlaceholder:  'To (YYYY-MM-DD)',
    sortDate:           'Date',
    sortAmount:         'Amount',
    emptyList:          'No expenses found. Add the first record.',
    km:                 'km',

    formExpenseType:    'Expense type:',
    formAmount:         'Amount (₴):',
    formDate:           'Date (YYYY-MM-DD):',
    formMileage:        'Mileage (km):',
    formDescription:    'Description:',
    formDescPlaceholder:'Optional',
    formSave:           'Save',
    formUpdate:         'Update',
    formErrRequired:    'Fill in amount, date and mileage',
    formErrAmount:      'Amount must be a positive number',
    formErrDate:        'Date must be in YYYY-MM-DD format',
    formErrMileage:     'Mileage must be a non-negative number',

    detailDate:     'Date:',
    detailMileage:  'Mileage:',
    detailDesc:     'Description:',
    detailEdit:     'Edit',
    detailDelete:   'Delete',
    deleteTitle:    'Delete',
    deleteConfirm:  'Are you sure you want to delete this record?',
    deleteCancel:   'Cancel',

    statsTotal:       'Total expenses',
    statsAvgFuel:     'Average fuel cost:',
    statsByCategory:  'Expenses by category',
    statsRecent:      'Recent operations',
    statsNoRecords:   'No records yet',

    settingsDarkTheme:    'Dark theme',
    settingsStorageNote:  'Saved in AsyncStorage',
    settingsLanguage:     'Interface language',
    settingsCurrency:     'Currency',
    settingsExit:         'Exit app',
    exitIosNote:          'On iOS, close the app with a system gesture.',
    exitTitle:            'Exit',
  },
} as const;

export type Strings = { [K in keyof typeof translations.uk]: string };

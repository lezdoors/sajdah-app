// Sajdah i18n — English + Arabic
// RTL-aware translation system

export const SUPPORTED_LOCALES = ['en', 'ar'];

export const translations = {
  en: {
    // Tab labels (keep short!)
    tab_home: 'Home',
    tab_prayer: 'Salat',
    tab_qibla: 'Qibla',
    tab_quran: 'Quran',
    tab_settings: 'More',
    tab_duas: 'Duas',
    tab_discover: 'Discover',
    tab_you: 'You',

    // Home
    greeting_morning: 'Good Morning',
    greeting_afternoon: 'Good Afternoon',
    greeting_evening: 'Good Evening',
    current_prayer: 'CURRENT PRAYER',
    starts_at: 'STARTS AT',
    go_to_prayer: 'Prayer Times',
    daily_ayah: 'DAILY AYAH',
    reflect_title: 'Reflect on today',
    reflect_subtitle: 'Take a moment to center yourself.',
    reflect_prompt: '"What is one thing you\'re grateful for today?"',
    journal_button: 'Journal Thoughts',
    quick_prayers: 'Prayers',
    quick_quran: 'Quran',
    quick_qibla: 'Qibla',
    quick_dua: 'Duas',

    // Prayer
    prayer_times: 'Prayer Times',
    next_prayer: 'NEXT PRAYER',
    fajr: 'Fajr',
    sunrise: 'Sunrise',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha',
    qiyam: 'Qiyam',

    // Qibla
    qibla_finder: 'Qibla Finder',
    current_location: 'CURRENT LOCATION',
    distance: 'DISTANCE',
    direction: 'DIRECTION',
    towards_mecca: 'Towards Mecca',
    calibrate_tip: 'Move your phone in a figure-8 to calibrate',
    compass_active: 'Compass active',
    finding_location: 'Finding your location...',
    location_needed: 'Location access is needed to find the Qibla direction.',

    // Quran
    quran_title: 'Quran',
    surahs_count: '114 Surahs',
    search_surahs: 'Search surahs...',
    surah: 'Surah',
    juz: 'Juz',
    ayahs: 'ayahs',
    loading_surah: 'Loading surah...',
    load_error: 'Unable to load surah. Please check your connection.',
    try_again: 'Try Again',
    no_surahs: 'No surahs found',

    // Settings
    settings_title: 'Settings',
    prayer_section: 'PRAYER',
    calc_method: 'Calculation Method',
    location: 'Location',
    automatic: 'Automatic',
    notifications_section: 'NOTIFICATIONS',
    prayer_reminders: 'Prayer Reminders',
    appearance_section: 'APPEARANCE',
    dark_mode: 'Dark Mode',
    theme_light: 'Light',
    theme_dark: 'Dark',
    theme_system: 'System',
    language_section: 'LANGUAGE',
    language: 'Language',
    english: 'English',
    arabic: 'العربية',
    about_section: 'ABOUT',
    rate_app: 'Rate Sajdah',
    privacy: 'Privacy Policy',
    version: 'Version',
    app_tagline: 'Your spiritual companion',

    // Onboarding
    welcome_title: 'Welcome to your',
    welcome_accent: 'spiritual companion.',
    welcome_desc: 'Find peace in the chaos, stay connected to your community, and grow daily in your faith journey.',
    get_started: 'Get Started',
    location_title: 'Location Access',
    location_accent: 'Accurate Prayer Times',
    location_desc: 'We need your location to calculate precise prayer times and Qibla direction for where you are.',
    allow_location: 'Allow Location',
    setup_title: 'Ready for your journey',
    setup_desc: 'Stay inspired with a daily Ayah or Quote. Set your intention to grow every day.',
    finish_setup: 'Finish Setup',
    preferences: 'Preferences',
    daily_reminders: 'Daily Reminders',
    daily_reminders_desc: 'Receive a morning inspiration',
    skip: 'Skip',
    sign_in: 'Already have an account? Sign In',
    settings_note: 'You can change these settings anytime in your profile.',

    // Daily Goals
    daily_goals: 'Daily Goals',
    goal_fajr: 'Fajr',
    goal_quran: 'Quran',
    goal_dhikr: 'Dhikr',
    goal_dhuhr: 'Dhuhr',
    goal_charity: 'Charity',
    goal_asr: 'Asr',
    goal_maghrib: 'Maghrib',
    goal_isha: 'Isha',

    // Streak
    streak_title: 'Streak',
    streak_days: 'days',
    streak_best: 'Best',

    // Continue Reading
    continue_reading: 'Continue Reading',
    surah_reading: 'Surah',
    ayah_reading: 'Ayah',

    // Daily Hadith
    daily_hadith: 'DAILY HADITH',
    hadith_source: 'Source',

    // Daily Dua
    daily_dua: 'DAILY DUA',
    dua_of_the_day: 'Dua of the Day',

    // Duas Tab
    duas_title: 'Supplications',
    duas_subtitle: 'Your daily companion for remembrance',
    search_duas: 'Search duas...',
    all_categories: 'All',
    athkar_filter: 'Athkar',
    daily_filter: 'Daily',
    duas_count: 'duas',

    // Dua Reader
    dua_reader_title: 'Dua Reader',
    repetitions: 'repetitions',
    completed: 'Completed',
    next_dua: 'Next',
    prev_dua: 'Previous',
    count_label: 'Count',

    // Discover
    discover_title: 'Discover',
    featured_hadith: 'FEATURED HADITH',
    topics: 'Topics',
    browse_by_topic: 'Browse by topic',
    features: 'Features',
    names_of_allah: '99 Names of Allah',
    names_subtitle: 'Learn the beautiful names',
    tasbih_title: 'Tasbih Counter',
    tasbih_subtitle: 'Digital prayer beads',
    qibla_title: 'Qibla Compass',
    qibla_subtitle: 'Find the direction',
    calendar_title: 'Islamic Calendar',
    calendar_subtitle: 'Hijri dates & events',

    // Tasbih
    tasbih_counter: 'Tasbih',
    tasbih_total: 'Total',
    tasbih_session: 'Session',
    tasbih_reset: 'Reset',
    tasbih_target: 'Target',
    subhanallah: 'SubhanAllah',
    alhamdulillah: 'Alhamdulillah',
    allahu_akbar: 'Allahu Akbar',

    // 99 Names
    names_title: '99 Names of Allah',
    names_search: 'Search names...',

    // Calendar
    hijri_calendar: 'Islamic Calendar',
    notable_dates: 'Notable Dates',
    today: 'Today',

    // You Tab
    you_title: 'Profile',
    your_streak: 'Your Streak',
    your_goals: 'Your Goals',
    bookmarks_title: 'Bookmarks',
    no_bookmarks: 'No bookmarks yet',
    all_settings: 'Settings',

    // Feature Grid (Home)
    feature_names: '99 Names',
    feature_tasbih: 'Tasbih',
    feature_qibla: 'Qibla',
    feature_calendar: 'Calendar',

    // Prayer Tracking
    prayer_completed: 'Completed',
    prayer_tap_to_log: 'Tap to log',
    prayers_today: 'prayers today',
    prayer_streak_msg: 'Keep it up!',
    all_prayers_done: 'All prayers logged',
    prayer_log: 'Prayer Log',

    // Tasbih Milestones
    tasbih_milestone: 'Milestone!',
    tasbih_complete: 'Complete!',
    tasbih_target_33: '33',
    tasbih_target_99: '99',
    tasbih_target_custom: 'Custom',

    // Home Ring
    next_in: 'Next in',
    time_remaining: 'remaining',
  },

  ar: {
    // Tab labels
    tab_home: 'الرئيسية',
    tab_prayer: 'الصلاة',
    tab_qibla: 'القبلة',
    tab_quran: 'القرآن',
    tab_settings: 'المزيد',
    tab_duas: 'الأدعية',
    tab_discover: 'اكتشف',
    tab_you: 'أنت',

    // Home
    greeting_morning: 'صباح الخير',
    greeting_afternoon: 'مساء الخير',
    greeting_evening: 'مساء الخير',
    current_prayer: 'الصلاة الحالية',
    starts_at: 'تبدأ في',
    go_to_prayer: 'أوقات الصلاة',
    daily_ayah: 'آية اليوم',
    reflect_title: 'تأمل في يومك',
    reflect_subtitle: 'خذ لحظة لتتأمل.',
    reflect_prompt: '"ما هو الشيء الذي تشكر الله عليه اليوم؟"',
    journal_button: 'دوّن أفكارك',
    quick_prayers: 'الصلاة',
    quick_quran: 'القرآن',
    quick_qibla: 'القبلة',
    quick_dua: 'الدعاء',

    // Prayer
    prayer_times: 'أوقات الصلاة',
    next_prayer: 'الصلاة التالية',
    fajr: 'الفجر',
    sunrise: 'الشروق',
    dhuhr: 'الظهر',
    asr: 'العصر',
    maghrib: 'المغرب',
    isha: 'العشاء',
    qiyam: 'القيام',

    // Qibla
    qibla_finder: 'اتجاه القبلة',
    current_location: 'موقعك الحالي',
    distance: 'المسافة',
    direction: 'الاتجاه',
    towards_mecca: 'نحو مكة',
    calibrate_tip: 'حرّك هاتفك على شكل رقم 8 للمعايرة',
    compass_active: 'البوصلة نشطة',
    finding_location: 'جاري تحديد موقعك...',
    location_needed: 'نحتاج إذن الموقع لتحديد اتجاه القبلة.',

    // Quran
    quran_title: 'القرآن الكريم',
    surahs_count: '١١٤ سورة',
    search_surahs: 'ابحث عن سورة...',
    surah: 'سورة',
    juz: 'جزء',
    ayahs: 'آيات',
    loading_surah: 'جاري تحميل السورة...',
    load_error: 'تعذر تحميل السورة. تحقق من اتصالك.',
    try_again: 'حاول مجدداً',
    no_surahs: 'لم يتم العثور على سور',

    // Settings
    settings_title: 'الإعدادات',
    prayer_section: 'الصلاة',
    calc_method: 'طريقة الحساب',
    location: 'الموقع',
    automatic: 'تلقائي',
    notifications_section: 'الإشعارات',
    prayer_reminders: 'تذكير الصلاة',
    appearance_section: 'المظهر',
    dark_mode: 'الوضع الداكن',
    theme_light: 'فاتح',
    theme_dark: 'داكن',
    theme_system: 'النظام',
    language_section: 'اللغة',
    language: 'اللغة',
    english: 'English',
    arabic: 'العربية',
    about_section: 'حول التطبيق',
    rate_app: 'قيّم سجدة',
    privacy: 'سياسة الخصوصية',
    version: 'الإصدار',
    app_tagline: 'رفيقك الروحي',

    // Onboarding
    welcome_title: 'مرحباً بك في',
    welcome_accent: 'رفيقك الروحي.',
    welcome_desc: 'اعثر على السكينة في صخب الحياة، وابقَ على صلة بمجتمعك، وانمُ يومياً في رحلة إيمانك.',
    get_started: 'ابدأ الآن',
    location_title: 'إذن الموقع',
    location_accent: 'أوقات صلاة دقيقة',
    location_desc: 'نحتاج موقعك لحساب أوقات الصلاة واتجاه القبلة بدقة.',
    allow_location: 'السماح بالموقع',
    setup_title: 'جاهز لرحلتك',
    setup_desc: 'استلهم يومياً بآية أو دعاء. ضع نيتك للنمو كل يوم.',
    finish_setup: 'إنهاء الإعداد',
    preferences: 'التفضيلات',
    daily_reminders: 'التذكير اليومي',
    daily_reminders_desc: 'تلقي إلهام صباحي',
    skip: 'تخطي',
    sign_in: 'لديك حساب بالفعل؟ تسجيل الدخول',
    settings_note: 'يمكنك تغيير هذه الإعدادات في أي وقت.',

    // Daily Goals
    daily_goals: 'الأهداف اليومية',
    goal_fajr: 'الفجر',
    goal_quran: 'القرآن',
    goal_dhikr: 'الذكر',
    goal_dhuhr: 'الظهر',
    goal_charity: 'الصدقة',
    goal_asr: 'العصر',
    goal_maghrib: 'المغرب',
    goal_isha: 'العشاء',

    // Streak
    streak_title: 'التواصل',
    streak_days: 'يوم',
    streak_best: 'الأفضل',

    // Continue Reading
    continue_reading: 'أكمل القراءة',
    surah_reading: 'سورة',
    ayah_reading: 'آية',

    // Daily Hadith
    daily_hadith: 'حديث اليوم',
    hadith_source: 'المصدر',

    // Daily Dua
    daily_dua: 'دعاء اليوم',
    dua_of_the_day: 'دعاء اليوم',

    // Duas Tab
    duas_title: 'الأدعية والأذكار',
    duas_subtitle: 'رفيقك اليومي للذكر',
    search_duas: 'ابحث عن دعاء...',
    all_categories: 'الكل',
    athkar_filter: 'أذكار',
    daily_filter: 'يومية',
    duas_count: 'دعاء',

    // Dua Reader
    dua_reader_title: 'قارئ الأدعية',
    repetitions: 'تكرار',
    completed: 'مكتمل',
    next_dua: 'التالي',
    prev_dua: 'السابق',
    count_label: 'العدد',

    // Discover
    discover_title: 'اكتشف',
    featured_hadith: 'الحديث المميز',
    topics: 'المواضيع',
    browse_by_topic: 'تصفح حسب الموضوع',
    features: 'المزيد',
    names_of_allah: 'أسماء الله الحسنى',
    names_subtitle: 'تعلم الأسماء الحسنى',
    tasbih_title: 'عداد التسبيح',
    tasbih_subtitle: 'مسبحة رقمية',
    qibla_title: 'بوصلة القبلة',
    qibla_subtitle: 'اعثر على الاتجاه',
    calendar_title: 'التقويم الإسلامي',
    calendar_subtitle: 'التواريخ والمناسبات الهجرية',

    // Tasbih
    tasbih_counter: 'التسبيح',
    tasbih_total: 'المجموع',
    tasbih_session: 'الجلسة',
    tasbih_reset: 'إعادة',
    tasbih_target: 'الهدف',
    subhanallah: 'سبحان الله',
    alhamdulillah: 'الحمد لله',
    allahu_akbar: 'الله أكبر',

    // 99 Names
    names_title: 'أسماء الله الحسنى',
    names_search: 'ابحث عن اسم...',

    // Calendar
    hijri_calendar: 'التقويم الهجري',
    notable_dates: 'التواريخ المهمة',
    today: 'اليوم',

    // You Tab
    you_title: 'الملف الشخصي',
    your_streak: 'تواصلك',
    your_goals: 'أهدافك',
    bookmarks_title: 'المحفوظات',
    no_bookmarks: 'لا توجد محفوظات بعد',
    all_settings: 'الإعدادات',

    // Feature Grid (Home)
    feature_names: 'الأسماء',
    feature_tasbih: 'التسبيح',
    feature_qibla: 'القبلة',
    feature_calendar: 'التقويم',

    // Prayer Tracking
    prayer_completed: 'تم',
    prayer_tap_to_log: 'اضغط للتسجيل',
    prayers_today: 'صلوات اليوم',
    prayer_streak_msg: 'استمر!',
    all_prayers_done: 'تم تسجيل جميع الصلوات',
    prayer_log: 'سجل الصلاة',

    // Tasbih Milestones
    tasbih_milestone: 'إنجاز!',
    tasbih_complete: 'مكتمل!',
    tasbih_target_33: '٣٣',
    tasbih_target_99: '٩٩',
    tasbih_target_custom: 'مخصص',

    // Home Ring
    next_in: 'التالي في',
    time_remaining: 'متبقي',
  },
};

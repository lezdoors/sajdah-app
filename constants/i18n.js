// Sajdah i18n — English + Arabic
// RTL-aware translation system

export const SUPPORTED_LOCALES = ['en', 'ar', 'fr'];

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
    facing_qibla: 'Facing Qibla',
    qibla_aligned_hint: 'You are facing the Qibla',
    qibla_rotate_hint: 'Rotate your phone until the Kaaba points up',

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
    app_name: 'Sajdah',
    app_name_arabic: 'سجدة',

    // Onboarding
    welcome_title: 'Welcome to your',
    welcome_accent: 'spiritual companion.',
    welcome_desc: 'Find peace in the chaos, stay connected to your community, and grow daily in your faith journey.',
    get_started: 'Get Started',
    location_title: 'Location Access',
    location_accent: 'Accurate Prayer Times',
    location_desc: 'We need your location to calculate precise prayer times and Qibla direction for where you are.',
    allow_location: 'Allow Location',
    continue_button: 'Continue',
    setup_title: 'Ready for your journey',
    setup_desc: 'Stay inspired with a daily Ayah or Quote. Set your intention to grow every day.',
    finish_setup: 'Finish Setup',
    preferences: 'Preferences',
    daily_reminders: 'Daily Reminders',
    daily_reminders_desc: 'Receive a morning inspiration',
    skip: 'Skip',
    free_forever: 'Free. No account needed.',
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
    la_ilaha_illallah: 'La ilaha illallah',

    // Bookmark Types
    bookmark_ayah: 'Ayah',
    bookmark_surah: 'Surah',
    bookmark_dua: 'Dua',
    bookmark_hadith: 'Hadith',
    bookmark_name: 'Name',

    // 99 Names
    names_title: '99 Names of Allah',
    names_search: 'Search names...',

    // Calendar
    hijri_calendar: 'Islamic Calendar',
    notable_dates: 'Notable Dates',
    today: 'Today',
    days_away: 'days away',
    this_month: 'This month',

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
    feature_quran: 'Quran',
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

    // Hardcoded strings cleanup
    view_all: 'View all',
    services: 'Services',
    tap_to_view_prayers: 'Tap to view all prayer times',
    no_duas_found: 'No duas found',
    total_prayers: 'Total Prayers',
    days_tracked: 'Days Tracked',
    complete_days: 'Complete Days',
    ad_free_privacy: 'Ad-free. Privacy-first. Always.',
    hadith_singular: 'hadith',
    hadith_plural: 'hadiths',
    hadiths_on_topic: 'Hadiths on',
    back: 'Back',
    swipe_for_next: 'Swipe for next',
    category_not_found: 'Category not found',

    // Calculation Methods
    calc_method_mwl: 'Muslim World League',
    calc_method_isna: 'Islamic Society of North America',
    calc_method_egyptian: 'Egyptian General Authority',
    calc_method_karachi: 'University of Islamic Sciences, Karachi',
    calc_method_dubai: 'Dubai',
    calc_method_qatar: 'Qatar',
    calc_method_kuwait: 'Kuwait',
    calc_method_singapore: 'Singapore',
    calc_method_turkey: 'Turkey',
    calc_method_tehran: 'Institute of Geophysics, Tehran',

    // Adhan Sounds
    adhan_section: 'ADHAN SOUND',
    adhan_sound: 'Adhan Sound',
    adhan_default: 'Default',
    adhan_makkah: 'Makkah',
    adhan_madinah: 'Madinah',
    adhan_alaqsa: 'Al-Aqsa',
    adhan_alafasy: 'Mishary Alafasy',
    adhan_alafasy2: 'Alafasy (Classic)',
    adhan_turkish: 'Turkish Style',
    adhan_nafees: 'Ahmad Al-Nafees',
    adhan_zahrani: 'Mansour Al-Zahrani',
    adhan_silent: 'Silent',
    adhan_preview: 'Tap to preview',

    // Empty states
    enable_location: 'Enable location to see prayer times',
    open_settings: 'Open Settings',
    finding_your_location: 'Finding your location...',
    no_names_found: 'No names match your search',
    long_press_hint: 'Long press to mark as prayed',

    // Privacy Policy
    privacy_last_updated: 'Last updated: March 30, 2026',
    privacy_intro: 'Sajdah is built with your privacy in mind. We believe your spiritual journey is personal, and your data should stay that way.',
    privacy_data_title: 'Data Collection',
    privacy_data_body: 'Sajdah does not collect, store, or transmit any personal data to external servers. All your data — including prayer logs, bookmarks, goals, and preferences — is stored locally on your device.',
    privacy_location_title: 'Location Data',
    privacy_location_body: 'Sajdah requests location access solely to calculate accurate prayer times and Qibla direction. Your location is processed on-device and is never sent to any server.',
    privacy_storage_title: 'Local Storage',
    privacy_storage_body: 'All app data is stored on your device using local storage. If you uninstall the app, all data will be permanently deleted. We do not back up your data to any cloud service.',
    privacy_analytics_title: 'Analytics & Advertising',
    privacy_analytics_body: 'Sajdah does not use any analytics, tracking, or advertising services. There are no ads in the app, and we do not share any information with third parties.',
    privacy_children_title: "Children's Privacy",
    privacy_children_body: 'Sajdah is safe for users of all ages. Since we do not collect any personal data, there are no special concerns regarding children\'s privacy.',
    privacy_changes_title: 'Changes to This Policy',
    privacy_changes_body: 'If we update this privacy policy, the changes will be reflected in the app. We encourage you to review this page periodically.',
    privacy_contact_title: 'Contact',
    privacy_contact_body: 'If you have questions about this privacy policy, you can reach us through the App Store listing.',
    // Share
    share_app: 'Share Sajdah',
    share_message: 'Check out Sajdah — a beautiful prayer times app with Quran, Duas, Qibla compass and more. Free, no ads, no account needed.\n\nDownload: https://apps.apple.com/app/sajdah',
    // Language
    french: 'Français',
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
    facing_qibla: 'متجه للقبلة',
    qibla_aligned_hint: 'أنت متجه نحو القبلة',
    qibla_rotate_hint: 'أدر هاتفك حتى تشير الكعبة للأعلى',

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
    app_name: 'سجدة',
    app_name_arabic: 'سجدة',

    // Onboarding
    welcome_title: 'مرحباً بك في',
    welcome_accent: 'رفيقك الروحي.',
    welcome_desc: 'اعثر على السكينة في صخب الحياة، وابقَ على صلة بمجتمعك، وانمُ يومياً في رحلة إيمانك.',
    get_started: 'ابدأ الآن',
    location_title: 'إذن الموقع',
    location_accent: 'أوقات صلاة دقيقة',
    location_desc: 'نحتاج موقعك لحساب أوقات الصلاة واتجاه القبلة بدقة.',
    allow_location: 'السماح بالموقع',
    continue_button: 'متابعة',
    setup_title: 'جاهز لرحلتك',
    setup_desc: 'استلهم يومياً بآية أو دعاء. ضع نيتك للنمو كل يوم.',
    finish_setup: 'إنهاء الإعداد',
    preferences: 'التفضيلات',
    daily_reminders: 'التذكير اليومي',
    daily_reminders_desc: 'تلقي إلهام صباحي',
    skip: 'تخطي',
    free_forever: 'مجاني. لا حاجة لحساب.',
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
    la_ilaha_illallah: 'لا إله إلا الله',

    // Bookmark Types
    bookmark_ayah: 'آية',
    bookmark_surah: 'سورة',
    bookmark_dua: 'دعاء',
    bookmark_hadith: 'حديث',
    bookmark_name: 'اسم',

    // 99 Names
    names_title: 'أسماء الله الحسنى',
    names_search: 'ابحث عن اسم...',

    // Calendar
    hijri_calendar: 'التقويم الهجري',
    notable_dates: 'التواريخ المهمة',
    today: 'اليوم',
    days_away: 'يوم متبقي',
    this_month: 'هذا الشهر',

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
    feature_quran: 'القرآن',
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

    // Hardcoded strings cleanup
    view_all: 'عرض الكل',
    services: 'الخدمات',
    tap_to_view_prayers: 'اضغط لعرض أوقات الصلاة',
    no_duas_found: 'لم يتم العثور على أدعية',
    total_prayers: 'إجمالي الصلوات',
    days_tracked: 'الأيام المتتبعة',
    complete_days: 'أيام مكتملة',
    ad_free_privacy: 'بدون إعلانات. خصوصية أولاً. دائماً.',
    hadith_singular: 'حديث',
    hadith_plural: 'أحاديث',
    hadiths_on_topic: 'أحاديث عن',
    back: 'رجوع',
    swipe_for_next: 'اسحب للتالي',
    category_not_found: 'الفئة غير موجودة',

    // Calculation Methods
    calc_method_mwl: 'رابطة العالم الإسلامي',
    calc_method_isna: 'الجمعية الإسلامية لأمريكا الشمالية',
    calc_method_egyptian: 'الهيئة المصرية العامة للمساحة',
    calc_method_karachi: 'جامعة العلوم الإسلامية، كراتشي',
    calc_method_dubai: 'دبي',
    calc_method_qatar: 'قطر',
    calc_method_kuwait: 'الكويت',
    calc_method_singapore: 'سنغافورة',
    calc_method_turkey: 'تركيا',
    calc_method_tehran: 'معهد الجيوفيزياء، طهران',

    // Adhan Sounds
    adhan_section: 'صوت الأذان',
    adhan_sound: 'صوت الأذان',
    adhan_default: 'الافتراضي',
    adhan_makkah: 'مكة',
    adhan_madinah: 'المدينة',
    adhan_alaqsa: 'الأقصى',
    adhan_alafasy: 'مشاري العفاسي',
    adhan_alafasy2: 'العفاسي (كلاسيك)',
    adhan_turkish: 'الأذان التركي',
    adhan_nafees: 'أحمد النفيس',
    adhan_zahrani: 'منصور الزهراني',
    adhan_silent: 'صامت',
    adhan_preview: 'اضغط للاستماع',

    // Empty states
    enable_location: 'فعّل الموقع لعرض أوقات الصلاة',
    open_settings: 'فتح الإعدادات',
    finding_your_location: 'جاري تحديد موقعك...',
    no_names_found: 'لم يتم العثور على أسماء مطابقة',
    long_press_hint: 'اضغط مطولاً للتحديد كصلاة',

    // Privacy Policy
    privacy_last_updated: 'آخر تحديث: ٣٠ مارس ٢٠٢٦',
    privacy_intro: 'سجدة مبنية مع مراعاة خصوصيتك. نؤمن بأن رحلتك الروحية شخصية، وبياناتك يجب أن تبقى كذلك.',
    privacy_data_title: 'جمع البيانات',
    privacy_data_body: 'سجدة لا تجمع أو تخزن أو ترسل أي بيانات شخصية إلى خوادم خارجية. جميع بياناتك — بما في ذلك سجل الصلاة والمحفوظات والأهداف والتفضيلات — مخزنة محلياً على جهازك.',
    privacy_location_title: 'بيانات الموقع',
    privacy_location_body: 'تطلب سجدة إذن الموقع فقط لحساب أوقات الصلاة واتجاه القبلة بدقة. يتم معالجة موقعك على الجهاز ولا يتم إرساله إلى أي خادم.',
    privacy_storage_title: 'التخزين المحلي',
    privacy_storage_body: 'جميع بيانات التطبيق مخزنة على جهازك باستخدام التخزين المحلي. إذا قمت بحذف التطبيق، سيتم حذف جميع البيانات نهائياً. نحن لا ننسخ بياناتك احتياطياً إلى أي خدمة سحابية.',
    privacy_analytics_title: 'التحليلات والإعلانات',
    privacy_analytics_body: 'سجدة لا تستخدم أي خدمات تحليل أو تتبع أو إعلانات. لا توجد إعلانات في التطبيق، ولا نشارك أي معلومات مع أطراف ثالثة.',
    privacy_children_title: 'خصوصية الأطفال',
    privacy_children_body: 'سجدة آمنة للمستخدمين من جميع الأعمار. بما أننا لا نجمع أي بيانات شخصية، لا توجد مخاوف خاصة بشأن خصوصية الأطفال.',
    privacy_changes_title: 'التغييرات على هذه السياسة',
    privacy_changes_body: 'إذا قمنا بتحديث سياسة الخصوصية هذه، ستنعكس التغييرات في التطبيق. نشجعك على مراجعة هذه الصفحة بشكل دوري.',
    privacy_contact_title: 'التواصل',
    privacy_contact_body: 'إذا كانت لديك أسئلة حول سياسة الخصوصية هذه، يمكنك التواصل معنا من خلال صفحة التطبيق على المتجر.',
    // Share
    share_app: 'شارك سجدة',
    share_message: 'جرّب تطبيق سجدة — تطبيق أوقات الصلاة مع القرآن والأدعية وبوصلة القبلة. مجاني بدون إعلانات.\n\nحمّل: https://apps.apple.com/app/sajdah',
    // Language
    french: 'Français',
  },

  fr: {
    // Tab labels
    tab_home: 'Accueil',
    tab_prayer: 'Salat',
    tab_qibla: 'Qibla',
    tab_quran: 'Coran',
    tab_settings: 'Plus',
    tab_duas: 'Duas',
    tab_discover: 'Explorer',
    tab_you: 'Profil',

    // Home
    greeting_morning: 'Bonjour',
    greeting_afternoon: 'Bon après-midi',
    greeting_evening: 'Bonsoir',
    current_prayer: 'PRIÈRE EN COURS',
    starts_at: 'COMMENCE À',
    go_to_prayer: 'Horaires de prière',
    daily_ayah: 'VERSET DU JOUR',
    reflect_title: 'Réflexion du jour',
    reflect_subtitle: 'Prenez un moment pour vous recentrer.',
    reflect_prompt: '"De quoi êtes-vous reconnaissant aujourd\'hui ?"',
    journal_button: 'Écrire vos pensées',
    quick_prayers: 'Prières',
    quick_quran: 'Coran',
    quick_qibla: 'Qibla',
    quick_dua: 'Duas',

    // Prayer
    prayer_times: 'Horaires de prière',
    next_prayer: 'PRIÈRE SUIVANTE',
    fajr: 'Fajr',
    sunrise: 'Lever du soleil',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha',
    qiyam: 'Qiyam',

    // Qibla
    qibla_finder: 'Direction de la Qibla',
    current_location: 'POSITION ACTUELLE',
    distance: 'DISTANCE',
    direction: 'DIRECTION',
    towards_mecca: 'Vers La Mecque',
    calibrate_tip: 'Bougez votre téléphone en forme de 8 pour calibrer',
    compass_active: 'Boussole active',
    finding_location: 'Localisation en cours...',
    location_needed: 'L\'accès à la localisation est nécessaire pour trouver la direction de la Qibla.',
    facing_qibla: 'Face à la Qibla',
    qibla_aligned_hint: 'Vous êtes face à la Qibla',
    qibla_rotate_hint: 'Tournez votre téléphone jusqu\'à ce que la Kaaba pointe vers le haut',

    // Quran
    quran_title: 'Coran',
    surahs_count: '114 Sourates',
    search_surahs: 'Rechercher une sourate...',
    surah: 'Sourate',
    juz: 'Juz',
    ayahs: 'versets',
    loading_surah: 'Chargement de la sourate...',
    load_error: 'Impossible de charger la sourate. Vérifiez votre connexion.',
    try_again: 'Réessayer',
    no_surahs: 'Aucune sourate trouvée',

    // Settings
    settings_title: 'Paramètres',
    prayer_section: 'PRIÈRE',
    calc_method: 'Méthode de calcul',
    location: 'Localisation',
    automatic: 'Automatique',
    notifications_section: 'NOTIFICATIONS',
    prayer_reminders: 'Rappels de prière',
    appearance_section: 'APPARENCE',
    dark_mode: 'Mode sombre',
    theme_light: 'Clair',
    theme_dark: 'Sombre',
    theme_system: 'Système',
    language_section: 'LANGUE',
    language: 'Langue',
    english: 'English',
    arabic: 'العربية',
    french: 'Français',
    about_section: 'À PROPOS',
    rate_app: 'Noter Sajdah',
    share_app: 'Partager Sajdah',
    share_message: 'Découvrez Sajdah — une belle application d\'horaires de prière avec Coran, Duas, boussole Qibla et plus. Gratuite, sans publicité.\n\nTélécharger : https://apps.apple.com/app/sajdah',
    privacy: 'Politique de confidentialité',
    version: 'Version',
    app_tagline: 'Votre compagnon spirituel',
    app_name: 'Sajdah',
    app_name_arabic: 'سجدة',

    // Onboarding
    welcome_title: 'Bienvenue dans votre',
    welcome_accent: 'compagnon spirituel.',
    welcome_desc: 'Trouvez la paix dans le chaos, restez connecté à votre communauté et progressez chaque jour dans votre foi.',
    get_started: 'Commencer',
    location_title: 'Accès à la localisation',
    location_accent: 'Horaires de prière précis',
    location_desc: 'Nous avons besoin de votre position pour calculer les horaires de prière et la direction de la Qibla.',
    allow_location: 'Autoriser la localisation',
    continue_button: 'Continuer',
    setup_title: 'Prêt pour votre voyage',
    setup_desc: 'Restez inspiré avec un verset ou une citation quotidienne. Fixez votre intention de progresser chaque jour.',
    finish_setup: 'Terminer la configuration',
    preferences: 'Préférences',
    daily_reminders: 'Rappels quotidiens',
    daily_reminders_desc: 'Recevoir une inspiration matinale',
    skip: 'Passer',
    free_forever: 'Gratuit. Aucun compte requis.',
    settings_note: 'Vous pouvez modifier ces paramètres à tout moment dans votre profil.',

    // Daily Goals
    daily_goals: 'Objectifs quotidiens',
    goal_fajr: 'Fajr',
    goal_quran: 'Coran',
    goal_dhikr: 'Dhikr',
    goal_dhuhr: 'Dhuhr',
    goal_charity: 'Charité',
    goal_asr: 'Asr',
    goal_maghrib: 'Maghrib',
    goal_isha: 'Isha',

    // Streak
    streak_title: 'Série',
    streak_days: 'jours',
    streak_best: 'Record',

    // Continue Reading
    continue_reading: 'Continuer la lecture',
    surah_reading: 'Sourate',
    ayah_reading: 'Verset',

    // Daily Hadith
    daily_hadith: 'HADITH DU JOUR',
    hadith_source: 'Source',

    // Daily Dua
    daily_dua: 'DUA DU JOUR',
    dua_of_the_day: 'Dua du jour',

    // Duas Tab
    duas_title: 'Invocations',
    duas_subtitle: 'Votre compagnon quotidien pour le rappel',
    search_duas: 'Rechercher des duas...',
    all_categories: 'Tout',
    athkar_filter: 'Athkar',
    daily_filter: 'Quotidien',
    duas_count: 'duas',

    // Dua Reader
    dua_reader_title: 'Lecteur de Duas',
    repetitions: 'répétitions',
    completed: 'Terminé',
    next_dua: 'Suivant',
    prev_dua: 'Précédent',
    count_label: 'Compte',

    // Discover
    discover_title: 'Explorer',
    featured_hadith: 'HADITH EN VEDETTE',
    topics: 'Sujets',
    browse_by_topic: 'Parcourir par sujet',
    features: 'Fonctionnalités',
    names_of_allah: '99 Noms d\'Allah',
    names_subtitle: 'Apprenez les beaux noms',
    tasbih_title: 'Compteur de Tasbih',
    tasbih_subtitle: 'Chapelet numérique',
    qibla_title: 'Boussole Qibla',
    qibla_subtitle: 'Trouvez la direction',
    calendar_title: 'Calendrier islamique',
    calendar_subtitle: 'Dates et événements hégirien',

    // Tasbih
    tasbih_counter: 'Tasbih',
    tasbih_total: 'Total',
    tasbih_session: 'Session',
    tasbih_reset: 'Réinitialiser',
    tasbih_target: 'Objectif',
    subhanallah: 'SubhanAllah',
    alhamdulillah: 'Alhamdulillah',
    allahu_akbar: 'Allahu Akbar',
    la_ilaha_illallah: 'La ilaha illallah',

    // Bookmark Types
    bookmark_ayah: 'Verset',
    bookmark_surah: 'Sourate',
    bookmark_dua: 'Dua',
    bookmark_hadith: 'Hadith',
    bookmark_name: 'Nom',

    // 99 Names
    names_title: '99 Noms d\'Allah',
    names_search: 'Rechercher un nom...',

    // Calendar
    hijri_calendar: 'Calendrier islamique',
    notable_dates: 'Dates importantes',
    today: 'Aujourd\'hui',
    days_away: 'jours restants',
    this_month: 'Ce mois-ci',

    // You Tab
    you_title: 'Profil',
    your_streak: 'Votre série',
    your_goals: 'Vos objectifs',
    bookmarks_title: 'Favoris',
    no_bookmarks: 'Aucun favori pour le moment',
    all_settings: 'Paramètres',

    // Feature Grid (Home)
    feature_names: '99 Noms',
    feature_tasbih: 'Tasbih',
    feature_qibla: 'Qibla',
    feature_quran: 'Coran',
    feature_calendar: 'Calendrier',

    // Prayer Tracking
    prayer_completed: 'Effectuée',
    prayer_tap_to_log: 'Appuyez pour enregistrer',
    prayers_today: 'prières aujourd\'hui',
    prayer_streak_msg: 'Continuez !',
    all_prayers_done: 'Toutes les prières enregistrées',
    prayer_log: 'Journal de prière',

    // Tasbih Milestones
    tasbih_milestone: 'Étape !',
    tasbih_complete: 'Terminé !',
    tasbih_target_33: '33',
    tasbih_target_99: '99',
    tasbih_target_custom: 'Personnalisé',

    // Home Ring
    next_in: 'Prochaine dans',
    time_remaining: 'restant',

    // Hardcoded strings cleanup
    view_all: 'Voir tout',
    services: 'Services',
    tap_to_view_prayers: 'Appuyez pour voir les horaires',
    no_duas_found: 'Aucune dua trouvée',
    total_prayers: 'Total prières',
    days_tracked: 'Jours suivis',
    complete_days: 'Jours complets',
    ad_free_privacy: 'Sans pub. Confidentialité d\'abord. Toujours.',
    hadith_singular: 'hadith',
    hadith_plural: 'hadiths',
    hadiths_on_topic: 'Hadiths sur',
    back: 'Retour',
    swipe_for_next: 'Glissez pour suivant',
    category_not_found: 'Catégorie introuvable',

    // Calculation Methods
    calc_method_mwl: 'Ligue islamique mondiale',
    calc_method_isna: 'Société islamique d\'Amérique du Nord',
    calc_method_egyptian: 'Autorité générale égyptienne',
    calc_method_karachi: 'Université des sciences islamiques, Karachi',
    calc_method_dubai: 'Dubaï',
    calc_method_qatar: 'Qatar',
    calc_method_kuwait: 'Koweït',
    calc_method_singapore: 'Singapour',
    calc_method_turkey: 'Turquie',
    calc_method_tehran: 'Institut de géophysique, Téhéran',

    // Adhan Sounds
    adhan_section: 'SON DE L\'ADHAN',
    adhan_sound: 'Son de l\'adhan',
    adhan_default: 'Par défaut',
    adhan_makkah: 'La Mecque',
    adhan_madinah: 'Médine',
    adhan_alaqsa: 'Al-Aqsa',
    adhan_alafasy: 'Mishary Alafasy',
    adhan_alafasy2: 'Alafasy (Classique)',
    adhan_turkish: 'Style Turc',
    adhan_nafees: 'Ahmad Al-Nafees',
    adhan_zahrani: 'Mansour Al-Zahrani',
    adhan_silent: 'Silencieux',
    adhan_preview: 'Appuyez pour écouter',

    // Empty states
    enable_location: 'Activez la localisation pour voir les horaires de prière',
    open_settings: 'Ouvrir les paramètres',
    finding_your_location: 'Localisation en cours...',
    no_names_found: 'Aucun nom ne correspond à votre recherche',
    long_press_hint: 'Appui long pour marquer comme priée',

    // Privacy Policy
    privacy_last_updated: 'Dernière mise à jour : 30 mars 2026',
    privacy_intro: 'Sajdah est conçue dans le respect de votre vie privée. Nous croyons que votre parcours spirituel est personnel et que vos données doivent le rester.',
    privacy_data_title: 'Collecte de données',
    privacy_data_body: 'Sajdah ne collecte, ne stocke ni ne transmet aucune donnée personnelle vers des serveurs externes. Toutes vos données sont stockées localement sur votre appareil.',
    privacy_location_title: 'Données de localisation',
    privacy_location_body: 'Sajdah demande l\'accès à la localisation uniquement pour calculer les horaires de prière et la direction de la Qibla. Votre position est traitée sur l\'appareil.',
    privacy_storage_title: 'Stockage local',
    privacy_storage_body: 'Toutes les données sont stockées sur votre appareil. Si vous désinstallez l\'application, toutes les données seront définitivement supprimées.',
    privacy_analytics_title: 'Analyses et publicité',
    privacy_analytics_body: 'Sajdah n\'utilise aucun service d\'analyse, de suivi ou de publicité. Il n\'y a pas de publicités dans l\'application.',
    privacy_children_title: 'Confidentialité des enfants',
    privacy_children_body: 'Sajdah est sûre pour les utilisateurs de tous âges. Comme nous ne collectons aucune donnée personnelle, il n\'y a aucune préoccupation particulière.',
    privacy_changes_title: 'Modifications de cette politique',
    privacy_changes_body: 'Si nous mettons à jour cette politique de confidentialité, les changements seront reflétés dans l\'application.',
    privacy_contact_title: 'Contact',
    privacy_contact_body: 'Si vous avez des questions, vous pouvez nous contacter via la page de l\'application sur l\'App Store.',
  },
};

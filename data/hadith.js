// Daily hadith rotation (30+ hadiths from major collections)
// Arabic text uses Unicode escape sequences

export const DAILY_HADITHS = [
  // 1 - Patience
  {
    arabic: '\u0625\u0650\u0646\u0651\u064E\u0645\u064E\u0627 \u0627\u0644\u0635\u0651\u064E\u0628\u0652\u0631\u064F \u0639\u0650\u0646\u0652\u062F\u064E \u0627\u0644\u0635\u0651\u064E\u062F\u0652\u0645\u064E\u0629\u0650 \u0627\u0644\u0652\u0623\u064F\u0648\u0644\u064E\u0649',
    english: 'Verily, patience is at the first strike of a calamity.',
    narrator: 'Anas ibn Malik',
    source: 'Sahih Bukhari 1283',
    topic: 'patience',
  },
  // 2 - Good character
  {
    arabic: '\u0625\u0650\u0646\u0651\u064E \u0645\u0650\u0646\u0652 \u0623\u064E\u062D\u064E\u0628\u0651\u0650\u0643\u064F\u0645\u0652 \u0625\u0650\u0644\u064E\u064A\u0651\u064E \u0648\u064E\u0623\u064E\u0642\u0652\u0631\u064E\u0628\u0650\u0643\u064F\u0645\u0652 \u0645\u0650\u0646\u0651\u0650\u064A \u0645\u064E\u062C\u0652\u0644\u0650\u0633\u064B\u0627 \u064A\u064E\u0648\u0652\u0645\u064E \u0627\u0644\u0652\u0642\u0650\u064A\u064E\u0627\u0645\u064E\u0629\u0650 \u0623\u064E\u062D\u064E\u0627\u0633\u0650\u0646\u064F\u0643\u064F\u0645\u0652 \u0623\u064E\u062E\u0652\u0644\u064E\u0627\u0642\u064B\u0627',
    english: 'The dearest and nearest among you to me on the Day of Resurrection will be the best of you in conduct.',
    narrator: 'Jabir ibn Abdullah',
    source: 'Sunan al-Tirmidhi 2018',
    topic: 'manners',
  },
  // 3 - Faith / actions
  {
    arabic: '\u0625\u0650\u0646\u0651\u064E\u0645\u064E\u0627 \u0627\u0644\u0652\u0623\u064E\u0639\u0652\u0645\u064E\u0627\u0644\u064F \u0628\u0650\u0627\u0644\u0646\u0651\u0650\u064A\u0651\u064E\u0627\u062A\u0650 \u0648\u064E\u0625\u0650\u0646\u0651\u064E\u0645\u064E\u0627 \u0644\u0650\u0643\u064F\u0644\u0651\u0650 \u0627\u0645\u0652\u0631\u0650\u0626\u064D \u0645\u064E\u0627 \u0646\u064E\u0648\u064E\u0649',
    english: 'Actions are judged by intentions, and every person will get what they intended.',
    narrator: 'Umar ibn al-Khattab',
    source: 'Sahih Bukhari 1',
    topic: 'sincerity',
  },
  // 4 - Prayer
  {
    arabic: '\u0628\u064E\u064A\u0652\u0646\u064E \u0627\u0644\u0631\u0651\u064E\u062C\u064F\u0644\u0650 \u0648\u064E\u0628\u064E\u064A\u0652\u0646\u064E \u0627\u0644\u0634\u0651\u0650\u0631\u0652\u0643\u0650 \u0648\u064E\u0627\u0644\u0652\u0643\u064F\u0641\u0652\u0631\u0650 \u062A\u064E\u0631\u0652\u0643\u064F \u0627\u0644\u0635\u0651\u064E\u0644\u064E\u0627\u0629\u0650',
    english: 'Between a man and disbelief and paganism is the abandonment of prayer.',
    narrator: 'Jabir ibn Abdullah',
    source: 'Sahih Muslim 82',
    topic: 'prayer',
  },
  // 5 - Charity
  {
    arabic: '\u0645\u064E\u0627 \u0646\u064E\u0642\u064E\u0635\u064E\u062A\u0652 \u0635\u064E\u062F\u064E\u0642\u064E\u0629\u064C \u0645\u0650\u0646\u0652 \u0645\u064E\u0627\u0644\u064D',
    english: 'Charity does not decrease wealth.',
    narrator: 'Abu Hurairah',
    source: 'Sahih Muslim 2588',
    topic: 'charity',
  },
  // 6 - Manners / smiling
  {
    arabic: '\u062A\u064E\u0628\u064E\u0633\u0651\u064F\u0645\u064F\u0643\u064E \u0641\u0650\u064A \u0648\u064E\u062C\u0652\u0647\u0650 \u0623\u064E\u062E\u0650\u064A\u0643\u064E \u0644\u064E\u0643\u064E \u0635\u064E\u062F\u064E\u0642\u064E\u0629\u064C',
    english: 'Your smiling in the face of your brother is an act of charity.',
    narrator: 'Abu Dharr',
    source: 'Sunan al-Tirmidhi 1956',
    topic: 'charity',
  },
  // 7 - Faith
  {
    arabic: '\u0644\u064E\u0627 \u064A\u064F\u0624\u0652\u0645\u0650\u0646\u064F \u0623\u064E\u062D\u064E\u062F\u064F\u0643\u064F\u0645\u0652 \u062D\u064E\u062A\u0651\u064E\u0649 \u064A\u064F\u062D\u0650\u0628\u0651\u064E \u0644\u0650\u0623\u064E\u062E\u0650\u064A\u0647\u0650 \u0645\u064E\u0627 \u064A\u064F\u062D\u0650\u0628\u0651\u064F \u0644\u0650\u0646\u064E\u0641\u0652\u0633\u0650\u0647\u0650',
    english: 'None of you truly believes until he loves for his brother what he loves for himself.',
    narrator: 'Anas ibn Malik',
    source: 'Sahih Bukhari 13',
    topic: 'faith',
  },
  // 8 - Forgiveness
  {
    arabic: '\u0645\u064E\u0646\u0652 \u0644\u064E\u0627 \u064A\u064E\u0631\u0652\u062D\u064E\u0645\u0650 \u0627\u0644\u0646\u0651\u064E\u0627\u0633\u064E \u0644\u064E\u0627 \u064A\u064E\u0631\u0652\u062D\u064E\u0645\u0652\u0647\u064F \u0627\u0644\u0644\u0651\u064E\u0647\u064F',
    english: 'He who does not show mercy to people, Allah will not show mercy to him.',
    narrator: 'Jarir ibn Abdullah',
    source: 'Sahih Bukhari 7376',
    topic: 'forgiveness',
  },
  // 9 - Knowledge
  {
    arabic: '\u0645\u064E\u0646\u0652 \u0633\u064E\u0644\u064E\u0643\u064E \u0637\u064E\u0631\u0650\u064A\u0642\u064B\u0627 \u064A\u064E\u0644\u0652\u062A\u064E\u0645\u0650\u0633\u064F \u0641\u0650\u064A\u0647\u0650 \u0639\u0650\u0644\u0652\u0645\u064B\u0627 \u0633\u064E\u0647\u0651\u064E\u0644\u064E \u0627\u0644\u0644\u0651\u064E\u0647\u064F \u0644\u064E\u0647\u064F \u0637\u064E\u0631\u0650\u064A\u0642\u064B\u0627 \u0625\u0650\u0644\u064E\u0649 \u0627\u0644\u0652\u062C\u064E\u0646\u0651\u064E\u0629\u0650',
    english: 'Whoever takes a path in search of knowledge, Allah will make easy for him a path to Paradise.',
    narrator: 'Abu Hurairah',
    source: 'Sahih Muslim 2699',
    topic: 'knowledge',
  },
  // 10 - Remembrance of Allah
  {
    arabic: '\u0645\u064E\u062B\u064E\u0644\u064F \u0627\u0644\u0651\u064E\u0630\u0650\u064A \u064A\u064E\u0630\u0652\u0643\u064F\u0631\u064F \u0631\u064E\u0628\u0651\u064E\u0647\u064F \u0648\u064E\u0627\u0644\u0651\u064E\u0630\u0650\u064A \u0644\u064E\u0627 \u064A\u064E\u0630\u0652\u0643\u064F\u0631\u064F \u0631\u064E\u0628\u0651\u064E\u0647\u064F \u0645\u064E\u062B\u064E\u0644\u064F \u0627\u0644\u0652\u062D\u064E\u064A\u0651\u0650 \u0648\u064E\u0627\u0644\u0652\u0645\u064E\u064A\u0651\u0650\u062A\u0650',
    english: 'The example of the one who remembers his Lord and the one who does not is like that of the living and the dead.',
    narrator: 'Abu Musa al-Ashari',
    source: 'Sahih Bukhari 6407',
    topic: 'remembrance',
  },
  // 11 - Good character
  {
    arabic: '\u0627\u062A\u0651\u064E\u0642\u0650 \u0627\u0644\u0644\u0651\u064E\u0647\u064E \u062D\u064E\u064A\u0652\u062B\u064F\u0645\u064E\u0627 \u0643\u064F\u0646\u062A\u064E \u0648\u064E\u0623\u064E\u062A\u0652\u0628\u0650\u0639\u0650 \u0627\u0644\u0633\u0651\u064E\u064A\u0651\u0650\u0626\u064E\u0629\u064E \u0627\u0644\u0652\u062D\u064E\u0633\u064E\u0646\u064E\u0629\u064E \u062A\u064E\u0645\u0652\u062D\u064F\u0647\u064E\u0627 \u0648\u064E\u062E\u064E\u0627\u0644\u0650\u0642\u0650 \u0627\u0644\u0646\u0651\u064E\u0627\u0633\u064E \u0628\u0650\u062E\u064F\u0644\u064F\u0642\u064D \u062D\u064E\u0633\u064E\u0646\u064D',
    english: 'Fear Allah wherever you are, follow a bad deed with a good deed and it will erase it, and behave well towards people.',
    narrator: 'Abu Dharr and Muadh ibn Jabal',
    source: 'Sunan al-Tirmidhi 1987',
    topic: 'manners',
  },
  // 12 - Prayer / worship
  {
    arabic: '\u0623\u064E\u0642\u0652\u0631\u064E\u0628\u064F \u0645\u064E\u0627 \u064A\u064E\u0643\u064F\u0648\u0646\u064F \u0627\u0644\u0652\u0639\u064E\u0628\u0652\u062F\u064F \u0645\u0650\u0646\u0652 \u0631\u064E\u0628\u0651\u0650\u0647\u0650 \u0648\u064E\u0647\u064F\u0648\u064E \u0633\u064E\u0627\u062C\u0650\u062F\u064C \u0641\u064E\u0623\u064E\u0643\u0652\u062B\u0650\u0631\u064F\u0648\u0627 \u0627\u0644\u062F\u0651\u064F\u0639\u064E\u0627\u0621\u064E',
    english: 'The closest a servant is to his Lord is when he is in prostration, so increase your supplications therein.',
    narrator: 'Abu Hurairah',
    source: 'Sahih Muslim 482',
    topic: 'prayer',
  },
  // 13 - Patience
  {
    arabic: '\u0639\u064E\u062C\u064E\u0628\u064B\u0627 \u0644\u0650\u0623\u064E\u0645\u0652\u0631\u0650 \u0627\u0644\u0652\u0645\u064F\u0624\u0652\u0645\u0650\u0646\u0650 \u0625\u0650\u0646\u0651\u064E \u0623\u064E\u0645\u0652\u0631\u064E\u0647\u064F \u0643\u064F\u0644\u0651\u064E\u0647\u064F \u062E\u064E\u064A\u0652\u0631\u064C',
    english: 'How wonderful is the affair of the believer, for all his affairs are good.',
    narrator: 'Suhaib ar-Rumi',
    source: 'Sahih Muslim 2999',
    topic: 'patience',
  },
  // 14 - Family / parents
  {
    arabic: '\u0631\u0650\u0636\u064E\u0627 \u0627\u0644\u0631\u0651\u064E\u0628\u0651\u0650 \u0641\u0650\u064A \u0631\u0650\u0636\u064E\u0627 \u0627\u0644\u0652\u0648\u064E\u0627\u0644\u0650\u062F\u0650 \u0648\u064E\u0633\u064E\u062E\u064E\u0637\u064F \u0627\u0644\u0631\u0651\u064E\u0628\u0651\u0650 \u0641\u0650\u064A \u0633\u064E\u062E\u064E\u0637\u0650 \u0627\u0644\u0652\u0648\u064E\u0627\u0644\u0650\u062F\u0650',
    english: 'The pleasure of the Lord is in the pleasure of the parent, and the anger of the Lord is in the anger of the parent.',
    narrator: 'Abdullah ibn Amr',
    source: 'Sunan al-Tirmidhi 1899',
    topic: 'family',
  },
  // 15 - Sincerity
  {
    arabic: '\u0625\u0650\u0646\u0651\u064E \u0627\u0644\u0644\u0651\u064E\u0647\u064E \u0644\u064E\u0627 \u064A\u064E\u0646\u0652\u0638\u064F\u0631\u064F \u0625\u0650\u0644\u064E\u0649 \u0635\u064F\u0648\u064E\u0631\u0650\u0643\u064F\u0645\u0652 \u0648\u064E\u0623\u064E\u0645\u0652\u0648\u064E\u0627\u0644\u0650\u0643\u064F\u0645\u0652 \u0648\u064E\u0644\u064E\u0643\u0650\u0646\u0652 \u064A\u064E\u0646\u0652\u0638\u064F\u0631\u064F \u0625\u0650\u0644\u064E\u0649 \u0642\u064F\u0644\u064F\u0648\u0628\u0650\u0643\u064F\u0645\u0652 \u0648\u064E\u0623\u064E\u0639\u0652\u0645\u064E\u0627\u0644\u0650\u0643\u064F\u0645\u0652',
    english: 'Allah does not look at your appearance or your wealth, but He looks at your hearts and your deeds.',
    narrator: 'Abu Hurairah',
    source: 'Sahih Muslim 2564',
    topic: 'sincerity',
  },
  // 16 - Forgiveness
  {
    arabic: '\u0645\u064E\u0646\u0652 \u0644\u064E\u0627 \u064A\u064E\u0631\u0652\u062D\u064E\u0645\u0652 \u0644\u064E\u0627 \u064A\u064F\u0631\u0652\u062D\u064E\u0645\u0652',
    english: 'He who shows no mercy will not be shown mercy.',
    narrator: 'Abu Hurairah',
    source: 'Sahih Bukhari 5997',
    topic: 'forgiveness',
  },
  // 17 - Knowledge
  {
    arabic: '\u0627\u0637\u0652\u0644\u064F\u0628\u064F\u0648\u0627 \u0627\u0644\u0652\u0639\u0650\u0644\u0652\u0645\u064E \u0645\u0650\u0646\u064E \u0627\u0644\u0652\u0645\u064E\u0647\u0652\u062F\u0650 \u0625\u0650\u0644\u064E\u0649 \u0627\u0644\u0644\u0651\u064E\u062D\u0652\u062F\u0650',
    english: 'Seek knowledge from the cradle to the grave.',
    narrator: 'Anas ibn Malik',
    source: 'Musnad al-Firdaws',
    topic: 'knowledge',
  },
  // 18 - Charity
  {
    arabic: '\u0627\u0644\u064A\u064E\u062F\u064F \u0627\u0644\u0652\u0639\u064F\u0644\u0652\u064A\u064E\u0627 \u062E\u064E\u064A\u0652\u0631\u064C \u0645\u0650\u0646\u064E \u0627\u0644\u064A\u064E\u062F\u0650 \u0627\u0644\u0633\u0651\u064F\u0641\u0652\u0644\u064E\u0649',
    english: 'The upper hand (the giving hand) is better than the lower hand (the receiving hand).',
    narrator: 'Abdullah ibn Umar',
    source: 'Sahih Bukhari 1427',
    topic: 'charity',
  },
  // 19 - Faith / trust in Allah
  {
    arabic: '\u0644\u064E\u0648\u0652 \u0623\u064E\u0646\u0651\u064E\u0643\u064F\u0645\u0652 \u062A\u064E\u062A\u064E\u0648\u064E\u0643\u0651\u064E\u0644\u064F\u0648\u0646\u064E \u0639\u064E\u0644\u064E\u0649 \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u062D\u064E\u0642\u0651\u064E \u062A\u064E\u0648\u064E\u0643\u0651\u064F\u0644\u0650\u0647\u0650 \u0644\u064E\u0631\u064E\u0632\u064E\u0642\u064E\u0643\u064F\u0645\u0652 \u0643\u064E\u0645\u064E\u0627 \u064A\u064E\u0631\u0652\u0632\u064F\u0642\u064F \u0627\u0644\u0637\u0651\u064E\u064A\u0652\u0631\u064E',
    english: 'If you were to rely upon Allah with true reliance, He would provide for you as He provides for the birds.',
    narrator: 'Umar ibn al-Khattab',
    source: 'Sunan al-Tirmidhi 2344',
    topic: 'faith',
  },
  // 20 - Good speech
  {
    arabic: '\u0645\u064E\u0646\u0652 \u0643\u064E\u0627\u0646\u064E \u064A\u064F\u0624\u0652\u0645\u0650\u0646\u064F \u0628\u0650\u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0648\u064E\u0627\u0644\u0652\u064A\u064E\u0648\u0652\u0645\u0650 \u0627\u0644\u0652\u0622\u062E\u0650\u0631\u0650 \u0641\u064E\u0644\u0652\u064A\u064E\u0642\u064F\u0644\u0652 \u062E\u064E\u064A\u0652\u0631\u064B\u0627 \u0623\u064E\u0648\u0652 \u0644\u0650\u064A\u064E\u0635\u0652\u0645\u064F\u062A\u0652',
    english: 'Whoever believes in Allah and the Last Day, let him speak good or remain silent.',
    narrator: 'Abu Hurairah',
    source: 'Sahih Bukhari 6018',
    topic: 'manners',
  },
  // 21 - Modesty
  {
    arabic: '\u0627\u0644\u0652\u062D\u064E\u064A\u064E\u0627\u0621\u064F \u0644\u064E\u0627 \u064A\u064E\u0623\u0652\u062A\u0650\u064A \u0625\u0650\u0644\u0651\u064E\u0627 \u0628\u0650\u062E\u064E\u064A\u0652\u0631\u064D',
    english: 'Modesty brings nothing but good.',
    narrator: 'Imran ibn Husayn',
    source: 'Sahih Bukhari 6117',
    topic: 'manners',
  },
  // 22 - Remembrance / dhikr
  {
    arabic: '\u0643\u064E\u0644\u0650\u0645\u064E\u062A\u064E\u0627\u0646\u0650 \u062E\u064E\u0641\u0650\u064A\u0641\u064E\u062A\u064E\u0627\u0646\u0650 \u0639\u064E\u0644\u064E\u0649 \u0627\u0644\u0644\u0651\u0650\u0633\u064E\u0627\u0646\u0650 \u062B\u064E\u0642\u0650\u064A\u0644\u064E\u062A\u064E\u0627\u0646\u0650 \u0641\u0650\u064A \u0627\u0644\u0652\u0645\u0650\u064A\u0632\u064E\u0627\u0646\u0650: \u0633\u064F\u0628\u0652\u062D\u064E\u0627\u0646\u064E \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0648\u064E\u0628\u0650\u062D\u064E\u0645\u0652\u062F\u0650\u0647\u0650\u060C \u0633\u064F\u0628\u0652\u062D\u064E\u0627\u0646\u064E \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0627\u0644\u0652\u0639\u064E\u0638\u0650\u064A\u0645\u0650',
    english: 'Two words are light on the tongue, heavy on the scales: SubhanAllahi wa bihamdihi, SubhanAllahil-Adheem.',
    narrator: 'Abu Hurairah',
    source: 'Sahih Bukhari 6406',
    topic: 'remembrance',
  },
  // 23 - Good deeds
  {
    arabic: '\u0623\u064E\u062D\u064E\u0628\u0651\u064F \u0627\u0644\u0652\u0623\u064E\u0639\u0652\u0645\u064E\u0627\u0644\u0650 \u0625\u0650\u0644\u064E\u0649 \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0623\u064E\u062F\u0652\u0648\u064E\u0645\u064F\u0647\u064E\u0627 \u0648\u064E\u0625\u0650\u0646\u0652 \u0642\u064E\u0644\u0651\u064E',
    english: 'The most beloved deeds to Allah are those done consistently, even if they are small.',
    narrator: 'Aisha',
    source: 'Sahih Bukhari 6464',
    topic: 'faith',
  },
  // 24 - Anger management
  {
    arabic: '\u0644\u064E\u064A\u0652\u0633\u064E \u0627\u0644\u0634\u0651\u064E\u062F\u0650\u064A\u062F\u064F \u0628\u0650\u0627\u0644\u0635\u0651\u064F\u0631\u064E\u0639\u064E\u0629\u0650 \u0625\u0650\u0646\u0651\u064E\u0645\u064E\u0627 \u0627\u0644\u0634\u0651\u064E\u062F\u0650\u064A\u062F\u064F \u0627\u0644\u0651\u064E\u0630\u0650\u064A \u064A\u064E\u0645\u0652\u0644\u0650\u0643\u064F \u0646\u064E\u0641\u0652\u0633\u064E\u0647\u064F \u0639\u0650\u0646\u0652\u062F\u064E \u0627\u0644\u0652\u063A\u064E\u0636\u064E\u0628\u0650',
    english: 'The strong person is not the one who can wrestle someone else down. The strong person is the one who can control himself when he is angry.',
    narrator: 'Abu Hurairah',
    source: 'Sahih Bukhari 6114',
    topic: 'patience',
  },
  // 25 - Supplication
  {
    arabic: '\u0627\u0644\u062F\u0651\u064F\u0639\u064E\u0627\u0621\u064F \u0647\u064F\u0648\u064E \u0627\u0644\u0652\u0639\u0650\u0628\u064E\u0627\u062F\u064E\u0629\u064F',
    english: 'Supplication is the essence of worship.',
    narrator: 'Anas ibn Malik',
    source: 'Sunan al-Tirmidhi 3371',
    topic: 'prayer',
  },
  // 26 - Brotherhood
  {
    arabic: '\u0627\u0644\u0652\u0645\u064F\u0633\u0652\u0644\u0650\u0645\u064F \u0623\u064E\u062E\u064F\u0648 \u0627\u0644\u0652\u0645\u064F\u0633\u0652\u0644\u0650\u0645\u0650 \u0644\u064E\u0627 \u064A\u064E\u0638\u0652\u0644\u0650\u0645\u064F\u0647\u064F \u0648\u064E\u0644\u064E\u0627 \u064A\u064E\u062E\u0652\u0630\u064F\u0644\u064F\u0647\u064F',
    english: 'A Muslim is the brother of a Muslim. He does not wrong him, nor does he forsake him.',
    narrator: 'Abdullah ibn Umar',
    source: 'Sahih Bukhari 2442',
    topic: 'faith',
  },
  // 27 - Gratitude
  {
    arabic: '\u0644\u064E\u0627 \u064A\u064E\u0634\u0652\u0643\u064F\u0631\u064F \u0627\u0644\u0644\u0651\u064E\u0647\u064E \u0645\u064E\u0646\u0652 \u0644\u064E\u0627 \u064A\u064E\u0634\u0652\u0643\u064F\u0631\u064F \u0627\u0644\u0646\u0651\u064E\u0627\u0633\u064E',
    english: 'He who does not thank people has not thanked Allah.',
    narrator: 'Abu Hurairah',
    source: 'Sunan Abu Dawud 4811',
    topic: 'manners',
  },
  // 28 - Truthfulness
  {
    arabic: '\u0639\u064E\u0644\u064E\u064A\u0652\u0643\u064F\u0645\u0652 \u0628\u0650\u0627\u0644\u0635\u0651\u0650\u062F\u0652\u0642\u0650 \u0641\u064E\u0625\u0650\u0646\u0651\u064E \u0627\u0644\u0635\u0651\u0650\u062F\u0652\u0642\u064E \u064A\u064E\u0647\u0652\u062F\u0650\u064A \u0625\u0650\u0644\u064E\u0649 \u0627\u0644\u0652\u0628\u0650\u0631\u0651\u0650',
    english: 'Be truthful, for truthfulness leads to righteousness.',
    narrator: 'Abdullah ibn Masud',
    source: 'Sahih Muslim 2607',
    topic: 'manners',
  },
  // 29 - Generosity
  {
    arabic: '\u0645\u064E\u0646\u0652 \u0643\u064E\u0627\u0646\u064E \u064A\u064F\u0624\u0652\u0645\u0650\u0646\u064F \u0628\u0650\u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0648\u064E\u0627\u0644\u0652\u064A\u064E\u0648\u0652\u0645\u0650 \u0627\u0644\u0652\u0622\u062E\u0650\u0631\u0650 \u0641\u064E\u0644\u0652\u064A\u064F\u0643\u0652\u0631\u0650\u0645\u0652 \u0636\u064E\u064A\u0652\u0641\u064E\u0647\u064F',
    english: 'Whoever believes in Allah and the Last Day, let him honor his guest.',
    narrator: 'Abu Hurairah',
    source: 'Sahih Bukhari 6136',
    topic: 'manners',
  },
  // 30 - Harm removal
  {
    arabic: '\u0644\u064E\u0627 \u0636\u064E\u0631\u064E\u0631\u064E \u0648\u064E\u0644\u064E\u0627 \u0636\u0650\u0631\u064E\u0627\u0631\u064E',
    english: 'There should be neither harming nor reciprocating harm.',
    narrator: 'Abu Said al-Khudri',
    source: '40 Hadith Nawawi 32',
    topic: 'manners',
  },
  // 31 - Leaving what does not concern you
  {
    arabic: '\u0645\u0650\u0646\u0652 \u062D\u064F\u0633\u0652\u0646\u0650 \u0625\u0650\u0633\u0652\u0644\u064E\u0627\u0645\u0650 \u0627\u0644\u0652\u0645\u064E\u0631\u0652\u0621\u0650 \u062A\u064E\u0631\u0652\u0643\u064F\u0647\u064F \u0645\u064E\u0627 \u0644\u064E\u0627 \u064A\u064E\u0639\u0652\u0646\u0650\u064A\u0647\u0650',
    english: 'Part of the perfection of a person\'s Islam is his leaving that which does not concern him.',
    narrator: 'Abu Hurairah',
    source: '40 Hadith Nawawi 12',
    topic: 'manners',
  },
  // 32 - This world
  {
    arabic: '\u0643\u064F\u0646\u0652 \u0641\u0650\u064A \u0627\u0644\u062F\u0651\u064F\u0646\u0652\u064A\u064E\u0627 \u0643\u064E\u0623\u064E\u0646\u0651\u064E\u0643\u064E \u063A\u064E\u0631\u0650\u064A\u0628\u064C \u0623\u064E\u0648\u0652 \u0639\u064E\u0627\u0628\u0650\u0631\u064F \u0633\u064E\u0628\u0650\u064A\u0644\u064D',
    english: 'Be in this world as if you were a stranger or a traveler.',
    narrator: 'Abdullah ibn Umar',
    source: 'Sahih Bukhari 6416',
    topic: 'faith',
  },
  // 33 - Neighbors
  {
    arabic: '\u0645\u064E\u0646\u0652 \u0643\u064E\u0627\u0646\u064E \u064A\u064F\u0624\u0652\u0645\u0650\u0646\u064F \u0628\u0650\u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0648\u064E\u0627\u0644\u0652\u064A\u064E\u0648\u0652\u0645\u0650 \u0627\u0644\u0652\u0622\u062E\u0650\u0631\u0650 \u0641\u064E\u0644\u064E\u0627 \u064A\u064F\u0624\u0652\u0630\u0650 \u062C\u064E\u0627\u0631\u064E\u0647\u064F',
    english: 'Whoever believes in Allah and the Last Day, let him not harm his neighbor.',
    narrator: 'Abu Hurairah',
    source: 'Sahih Bukhari 6018',
    topic: 'manners',
  },
  // 34 - Fasting
  {
    arabic: '\u0645\u064E\u0646\u0652 \u0635\u064E\u0627\u0645\u064E \u0631\u064E\u0645\u064E\u0636\u064E\u0627\u0646\u064E \u0625\u0650\u064A\u0645\u064E\u0627\u0646\u064B\u0627 \u0648\u064E\u0627\u062D\u0652\u062A\u0650\u0633\u064E\u0627\u0628\u064B\u0627 \u063A\u064F\u0641\u0650\u0631\u064E \u0644\u064E\u0647\u064F \u0645\u064E\u0627 \u062A\u064E\u0642\u064E\u062F\u0651\u064E\u0645\u064E \u0645\u0650\u0646\u0652 \u0630\u064E\u0646\u0652\u0628\u0650\u0647\u0650',
    english: 'Whoever fasts Ramadan out of faith and seeking reward, his previous sins will be forgiven.',
    narrator: 'Abu Hurairah',
    source: 'Sahih Bukhari 2014',
    topic: 'forgiveness',
  },
  // 35 - Gentleness
  {
    arabic: '\u0625\u0650\u0646\u0651\u064E \u0627\u0644\u0644\u0651\u064E\u0647\u064E \u0631\u064E\u0641\u0650\u064A\u0642\u064C \u064A\u064F\u062D\u0650\u0628\u0651\u064F \u0627\u0644\u0631\u0651\u0650\u0641\u0652\u0642\u064E',
    english: 'Allah is gentle and loves gentleness in all things.',
    narrator: 'Aisha',
    source: 'Sahih Bukhari 6927',
    topic: 'manners',
  },
];

export function getDailyHadith() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return DAILY_HADITHS[dayOfYear % DAILY_HADITHS.length];
}

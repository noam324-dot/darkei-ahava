"use client";

import { useMemo } from "react";
import intro from "../content/intro.json";
import men from "../content/men.json";
import women from "../content/women.json";
import { usePersistentState } from "./usePersistentState";

type CategoryId =
  | "words"
  | "quality_time"
  | "gifts"
  | "acts_of_service"
  | "touch";

type Participant = "man" | "woman";
type GenderTrack = "man" | "woman";
type CoupleScreen =
  | "welcome"
  | "intro"
  | "participant"
  | "quiz"
  | "results"
  | "gestureIdeas"
  | "chooseGesture"
  | "finish";

type Item = {
  id: string;
  category: CategoryId;
  text: string;
};

type Content = {
  categories: Record<CategoryId, string>;
  answers: { label: string; value: number }[];
};

type LoveAction = {
  id: string;
  category: CategoryId;
  text: string;
};

type CoupleState = {
  screen: CoupleScreen;
  participant: Participant | null;
  genderTrack: GenderTrack;
  questionIndex: number;
  answers: Record<string, number>;
  partnerSelections: string[];
  chosenGesture: string;
};

const typedIntro = intro as Content;
const storageKey = "darchei-haahava-couple-v06";

const initialState: CoupleState = {
  screen: "welcome",
  participant: null,
  genderTrack: "man",
  questionIndex: 0,
  answers: {},
  partnerSelections: [],
  chosenGesture: "",
};

const categoryText: Record<CategoryId, string> = {
  words: "מילים טובות, תודה, הערכה וברכה עוזרות ללב להרגיש שרואים אותו.",
  quality_time: "זמן יחד, הקשבה ונוכחות שקטה יוצרים תחושה של קרבה ובחירה.",
  gifts: "מחווה קטנה או דבר שנבחר במחשבה יכולים לומר: חשבתי עליך.",
  acts_of_service: "עזרה מעשית והקלה בעומס יכולות להרגיש כמו אהבה שמגיעה עד הבית.",
  touch: "מגע של קרבה וחיבה, כשהוא מתאים ונעים, מזכיר שהקשר חי ונמצא כאן.",
};

const categoryIcons: Record<CategoryId, string> = {
  words: "💬",
  quality_time: "🕰",
  gifts: "🎁",
  acts_of_service: "🛠",
  touch: "❤️",
};

const introLovePaths = [
  {
    icon: "💬",
    title: "מילים טובות",
    text: "מחמאות, הערכה, תודה ומילים שמחזקות.",
  },
  {
    icon: "🕒",
    title: "זמן איכות",
    text: "זמן משותף, הקשבה ונוכחות אמיתית.",
  },
  {
    icon: "🤲",
    title: "עזרה ומעשים",
    text: "עזרה שמורידה עומס ומביעה אכפתיות.",
  },
  {
    icon: "🤍",
    title: "קרבה וחיבה",
    text: "חיבוק, מגע, חיוך וכל ביטוי של קרבה שמתאים לשני בני הזוג.",
  },
  {
    icon: "🎁",
    title: "מחוות ומתנות",
    text: 'הפתעות קטנות שמראות: "חשבתי עליך."',
  },
];

const loveActions: Record<CategoryId, LoveAction[]> = {
  quality_time: [
    { id: "quality_time_01", category: "quality_time", text: "לשתות יחד קפה בלי טלפונים." },
    { id: "quality_time_02", category: "quality_time", text: "לצאת להליכה קצרה יחד." },
    { id: "quality_time_03", category: "quality_time", text: "לשבת עשר דקות רק כדי לדבר." },
    { id: "quality_time_04", category: "quality_time", text: "לנסוע יחד לסידור קטן." },
    { id: "quality_time_05", category: "quality_time", text: "לעשות משהו קטן יחד בלי למהר." },
    { id: "quality_time_06", category: "quality_time", text: "לעצור יחד לכמה דקות שקטות." },
    { id: "quality_time_07", category: "quality_time", text: "לשאול איך עבר היום ולהקשיב עד הסוף." },
    { id: "quality_time_08", category: "quality_time", text: "לשבת יחד בלי לעשות עוד משהו במקביל." },
    { id: "quality_time_09", category: "quality_time", text: "להקדיש זמן קצר למשהו שנעים לשניכם." },
    { id: "quality_time_10", category: "quality_time", text: "להישאר יחד עוד כמה דקות אחרי סוף היום." },
  ],
  words: [
    { id: "words_01", category: "words", text: "לשלוח הודעה טובה באמצע היום." },
    { id: "words_02", category: "words", text: "לומר תודה על דבר אחד מסוים." },
    { id: "words_03", category: "words", text: "לכתוב פתק קטן עם מילה מחזקת." },
    { id: "words_04", category: "words", text: "לומר מחמאה אמיתית וברורה." },
    { id: "words_05", category: "words", text: "לומר לפני השינה דבר אחד שהערכתי היום." },
    { id: "words_06", category: "words", text: "לומר בקול מה שמתי לב שעשית בשבילנו." },
    { id: "words_07", category: "words", text: "להזכיר תכונה טובה שאני רואה בך." },
    { id: "words_08", category: "words", text: "לשלוח משפט עידוד לפני יום עמוס." },
    { id: "words_09", category: "words", text: "לומר משהו טוב בקול ברור." },
    { id: "words_10", category: "words", text: "להתחיל את היום במילה טובה." },
  ],
  acts_of_service: [
    { id: "acts_01", category: "acts_of_service", text: "להוריד משהו קטן מהעומס." },
    { id: "acts_02", category: "acts_of_service", text: "להכין משהו שהשני רגיל להכין." },
    { id: "acts_03", category: "acts_of_service", text: "לעשות משהו קטן שיקל על היום." },
    { id: "acts_04", category: "acts_of_service", text: "לטפל בדבר קטן שמחכה." },
    { id: "acts_05", category: "acts_of_service", text: "להפתיע במעשה שירות קטן." },
    { id: "acts_06", category: "acts_of_service", text: "לסדר דבר קטן שמפריע כבר זמן מה." },
    { id: "acts_07", category: "acts_of_service", text: "להכין שתייה או משהו קל לאכול." },
    { id: "acts_08", category: "acts_of_service", text: "לטפל בסידור קטן שיכול להקל." },
    { id: "acts_09", category: "acts_of_service", text: "לפנות זמן מנוחה קצר." },
    { id: "acts_10", category: "acts_of_service", text: "להציע עזרה לפני שמבקשים." },
  ],
  touch: [
    { id: "touch_01", category: "touch", text: "חיבוק ארוך כשנפגשים." },
    { id: "touch_02", category: "touch", text: "להחזיק ידיים בזמן הליכה." },
    { id: "touch_03", category: "touch", text: "לשבת קרוב בזמן שיחה." },
    { id: "touch_04", category: "touch", text: "ללטף את היד בזמן שמדברים." },
    { id: "touch_05", category: "touch", text: "לפתוח או לסיים את היום בחיבוק." },
    { id: "touch_06", category: "touch", text: "יד על הכתף בזמן שיחה." },
    { id: "touch_07", category: "touch", text: "ליזום רגע קצר של קרבה." },
    { id: "touch_08", category: "touch", text: "לשבת יחד קרוב במקום שנעים לכם." },
    { id: "touch_09", category: "touch", text: "מבט רך וחיוך מקרוב." },
    { id: "touch_10", category: "touch", text: "נשיקה או חיבוק ברגע שמתאים לשניכם." },
  ],
  gifts: [
    { id: "gifts_01", category: "gifts", text: "להביא פרח קטן." },
    { id: "gifts_02", category: "gifts", text: "להביא משהו קטן שאהוב במיוחד." },
    { id: "gifts_03", category: "gifts", text: "להשאיר פתק במקום שיראו." },
    { id: "gifts_04", category: "gifts", text: "לשלוח תמונה משותפת עם מילה טובה." },
    { id: "gifts_05", category: "gifts", text: "להכין משהו קטן שמראה: חשבתי עליך." },
    { id: "gifts_06", category: "gifts", text: "להביא מאכל קטן שאהוב במיוחד." },
    { id: "gifts_07", category: "gifts", text: "לבחור חפץ קטן שמתאים למה שמעניין אותך." },
    { id: "gifts_08", category: "gifts", text: "להשאיר משהו קטן במקום שיראו." },
    { id: "gifts_09", category: "gifts", text: "להביא דבר קטן מהדרך." },
    { id: "gifts_10", category: "gifts", text: "להכין משהו קטן ליום עמוס." },
  ],
};

const participantLabels: Record<Participant, string> = {
  man: "❤️ הגבר",
  woman: "❤️ האישה",
};

const questionTextOverrides: Record<string, string> = {
  m01: "אשתי אומרת לי תודה על דבר שעשיתי.",
  m06: "אשתי אומרת לי שהיא מעריכה את המאמץ שאני משקיע.",
  m10: "אשתי נותנת לי חיבוק ברגע שמתאים לשנינו.",
  m11: "אשתי מביעה הערכה כלפיי במילים ברורות.",
  m13: "אשתי מביאה לי משהו קטן שהיא יודעת שישמח אותי.",
  m14: "אשתי מטפלת בדבר קטן שחיכה לי כדי להקל עליי.",
  m19: "אשתי לוקחת על עצמה דבר קטן כשיש לי עומס.",
  m20: "אשתי יושבת קרוב אליי במקום שנעים לשנינו.",
  m22: "אשתי מציעה שנקדיש זמן לדבר או ללמוד משהו קצר יחד.",
  m23: "אשתי מכינה לי משהו קטן לדרך או ליום עמוס.",
  m24: "אשתי עוזרת לי להתארגן לרגע עמוס בלי שאבקש.",
  m27: "אשתי מניחה בצד הסחות דעת כדי להיות איתי.",
  m29: "אשתי מסייעת לי לסיים דבר קטן שמחכה.",
  m30: "אשתי מתקרבת אליי כשאנחנו עומדים או יושבים יחד.",
  w01: "בעלי אומר לי תודה על דבר שעשיתי.",
  w06: "בעלי אומר לי שהוא מעריך את המאמץ שאני משקיעה.",
  w10: "בעלי נותן לי חיבוק ברגע שמתאים לשנינו.",
  w11: "בעלי מביע הערכה כלפיי במילים ברורות.",
  w13: "בעלי מביא לי משהו קטן שהוא יודע שישמח אותי.",
  w14: "בעלי מטפל בדבר קטן שחיכה לי כדי להקל עליי.",
  w19: "בעלי לוקח על עצמו דבר קטן כשיש לי עומס.",
  w20: "בעלי יושב קרוב אליי במקום שנעים לשנינו.",
  w22: "בעלי מציע שנקדיש זמן לדבר או ללמוד משהו קצר יחד.",
  w23: "בעלי מכין לי משהו קטן לדרך או ליום עמוס.",
  w24: "בעלי עוזר לי להתארגן לרגע עמוס בלי שאבקש.",
  w27: "בעלי מניח בצד הסחות דעת כדי להיות איתי.",
  w29: "בעלי מסייע לי לסיים דבר קטן שמחכה.",
  w30: "בעלי מתקרב אליי כשאנחנו עומדים או יושבים יחד.",
};

const itemsByTrack: Record<GenderTrack, Item[]> = {
  man: men.items as Item[],
  woman: women.items as Item[],
};

export default function CoupleApp() {
  const [state, setState] = usePersistentState<CoupleState>(
    storageKey,
    initialState,
  );
  const currentScreen = state.screen;

  const items = useMemo(
    () =>
      itemsByTrack[state.genderTrack].map((item) => ({
        ...item,
        text: questionTextOverrides[item.id] ?? item.text,
      })),
    [state.genderTrack],
  );
  const scores = useMemo(
    () => getScores(items, state.answers),
    [items, state.answers],
  );
  const answeredCount = items.filter(
    (item) => state.answers[item.id] !== undefined,
  ).length;
  const progress = Math.round((answeredCount / items.length) * 100);

  function goTo(screen: CoupleScreen) {
    setState((current) => ({ ...current, screen }));
  }

  function startQuiz(participant: Participant, genderTrack: GenderTrack) {
    setState((current) => ({
      ...current,
      participant,
      genderTrack,
      questionIndex: 0,
      answers: {},
      screen: "quiz",
    }));
  }

  function answerCurrent(value: number) {
    const item = items[state.questionIndex];
    const nextIndex = state.questionIndex + 1;

    setState((current) => ({
      ...current,
      answers: { ...current.answers, [item.id]: value },
      questionIndex: nextIndex >= items.length ? current.questionIndex : nextIndex,
      screen: nextIndex >= items.length ? "results" : "quiz",
    }));
  }

  function togglePartnerSelection(idea: string) {
    setState((current) => {
      const selected = current.partnerSelections;
      const partnerSelections = selected.includes(idea)
        ? selected.filter((item) => item !== idea)
        : selected.length < 3
          ? [...selected, idea]
          : selected;

      return { ...current, partnerSelections };
    });
  }

  return (
    <main className="shell couple-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <section className="app-panel couple-panel">
        <header className="topbar">
          <button
            className="brand"
            type="button"
            onClick={() => goTo("welcome")}
          >
            <span className="brand-mark" aria-hidden="true" />
            <span>דרכי האהבה</span>
          </button>
          <div className="step-pill">{getScreenLabel(currentScreen)}</div>
        </header>

        {currentScreen === "welcome" && (
          <WelcomeScreen onStart={() => goTo("intro")} />
        )}

        {currentScreen === "intro" && (
          <IntroScreen
            onBack={() => goTo("welcome")}
            onNext={() => goTo("participant")}
          />
        )}

        {currentScreen === "participant" && (
          <ParticipantScreen onBack={() => goTo("intro")} onStart={startQuiz} />
        )}

        {currentScreen === "quiz" && (
          <QuizScreen
            answers={typedIntro.answers}
            item={items[state.questionIndex]}
            questionIndex={state.questionIndex}
            questionTotal={items.length}
            progress={progress}
            selectedValue={state.answers[items[state.questionIndex].id]}
            onAnswer={answerCurrent}
            onBack={() =>
              state.questionIndex === 0
                ? goTo("participant")
                : setState((current) => ({
                    ...current,
                    questionIndex: current.questionIndex - 1,
                  }))
            }
          />
        )}

        {currentScreen === "results" && (
          <ResultsScreen
            scores={scores}
            onBack={() =>
              setState((current) => ({
                ...current,
                screen: "quiz",
                questionIndex: items.length - 1,
              }))
            }
            onNext={() =>
              setState((current) => ({
                ...current,
                partnerSelections: [],
                chosenGesture: "",
                screen: "gestureIdeas",
              }))
            }
          />
        )}

        {currentScreen === "gestureIdeas" && (
          <GestureIdeasScreen
            scores={scores}
            selected={state.partnerSelections}
            onBack={() => goTo("results")}
            onToggle={togglePartnerSelection}
            onNext={() => goTo("chooseGesture")}
          />
        )}

        {currentScreen === "chooseGesture" && (
          <ChooseGestureScreen
            selected={state.partnerSelections}
            chosenGesture={state.chosenGesture}
            onBack={() => goTo("gestureIdeas")}
            onChoose={(chosenGesture) =>
              setState((current) => ({ ...current, chosenGesture }))
            }
            onNext={() => goTo("finish")}
          />
        )}

        {currentScreen === "finish" && (
          <FinishScreen
            gesture={state.chosenGesture}
            onRestart={() => setState(initialState)}
          />
        )}
      </section>
    </main>
  );
}

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="screen-block app-welcome couple-welcome">
      <div className="welcome-heart" aria-hidden="true">
        ❤️
      </div>
      <div>
        <h1>דרכי האהבה</h1>
        <p className="lead-text">
          רובנו אוהבים את בן או בת הזוג שלנו.
          <br />
          אבל לפעמים אנחנו מביעים אהבה בדרך שטבעית לנו.
          <br />
          המסע הזה ינסה לעזור לנו לגלות איך לתת אהבה בדרך שנכונה לאדם שאיתנו.
        </p>
      </div>
      <button className="primary-button" type="button" onClick={onStart}>
        מתחילים
      </button>
      <div className="home-scene compact-scene" aria-label="בית ואור של בוקר">
        <div className="sun" />
        <div className="hills hill-back" />
        <div className="hills hill-front" />
        <div className="house">
          <div className="roof" />
          <div className="wall">
            <span />
            <span />
          </div>
        </div>
      </div>
    </div>
  );
}

function IntroScreen({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="screen-block intro-logic-screen">
      <div className="welcome-heart" aria-hidden="true">
        ❤️
      </div>
      <div className="intro-copy">
        <h2>כל אחד מרגיש אהוב בדרך קצת אחרת</h2>
        <p>אין דרך אחת נכונה לאהוב.</p>
        <p>רובנו אוהבים באמת את בן או בת הזוג שלנו.</p>
        <p>
          אבל לפעמים אנחנו מביעים אהבה בדרך שטבעית לנו, ולא בדרך שהאדם שמולנו
          באמת מרגיש.
        </p>
        <p>
          לכן לפני שנבחר מחוות, ננסה לגלות אילו דרכים גורמות לך להרגיש אהוב
          במיוחד.
        </p>
      </div>
      <div className="intro-path-list" aria-label="חמש דרכי האהבה">
        {introLovePaths.map((path) => (
          <article className="intro-path-card" key={path.title}>
            <span aria-hidden="true">{path.icon}</span>
            <div>
              <h3>{path.title}</h3>
              <p>{path.text}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="intro-copy intro-closing">
        <p>אצל רוב האנשים יש שילוב של כמה דרכי אהבה.</p>
        <p>השאלון אינו בודק כמה אתם אוהבים.</p>
        <p>
          הוא רק עוזר לגלות באילו דרכים אתם מרגישים אהובים במיוחד.
        </p>
        <p>בדקות הקרובות נתחיל לגלות מה משמעותי עבורך.</p>
      </div>
      <div className="footer-actions">
        <button className="ghost-button" type="button" onClick={onBack}>
          חזרה
        </button>
        <button className="primary-button" type="button" onClick={onNext}>
          ממשיכים
        </button>
      </div>
    </div>
  );
}

function ParticipantScreen({
  onBack,
  onStart,
}: {
  onBack: () => void;
  onStart: (participant: Participant, genderTrack: GenderTrack) => void;
}) {
  return (
    <div className="screen-block">
      <ScreenHeader
        eyebrow="מתחילים בשאלון"
        title="מי עונה עכשיו על השאלון?"
        text="בחרו מי ממלא עכשיו. אחר כך עוברים ישר לשאלות."
      />
      <div className="participant-grid">
        <ParticipantCard
          label={participantLabels.man}
          onPick={() => onStart("man", "man")}
        />
        <ParticipantCard
          label={participantLabels.woman}
          onPick={() => onStart("woman", "woman")}
        />
      </div>
      <button className="ghost-button" type="button" onClick={onBack}>
        חזרה
      </button>
    </div>
  );
}

function QuizScreen({
  answers,
  item,
  questionIndex,
  questionTotal,
  progress,
  selectedValue,
  onAnswer,
  onBack,
}: {
  answers: { label: string; value: number }[];
  item: Item;
  questionIndex: number;
  questionTotal: number;
  progress: number;
  selectedValue?: number;
  onAnswer: (value: number) => void;
  onBack: () => void;
}) {
  return (
    <div className="screen-block quiz-single">
      <div>
        <p className="eyebrow">
          שאלה {questionIndex + 1} מתוך {questionTotal}
        </p>
        <div className="journey-progress" aria-label="התקדמות בשאלון">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>
      <article className="single-question-card">
        <span className="question-badge">{questionIndex + 1}</span>
        <h2>{item.text}</h2>
      </article>
      <div className="answer-stack">
        {answers.map((answer) => (
          <button
            className={
              selectedValue === answer.value ? "answer selected" : "answer"
            }
            key={answer.value}
            type="button"
            onClick={() => onAnswer(answer.value)}
          >
            <span>{answer.label}</span>
            <b>{answer.value}</b>
          </button>
        ))}
      </div>
      <button className="ghost-button" type="button" onClick={onBack}>
        חזרה
      </button>
    </div>
  );
}

function ResultsScreen({
  scores,
  onBack,
  onNext,
}: {
  scores: Score[];
  onBack: () => void;
  onNext: () => void;
}) {
  const topTwo = scores.slice(0, 2);

  return (
    <div className="screen-block">
      <ScreenHeader
        eyebrow="התוצאה שלך"
        title="הדרכים שהכי ממלאות אותך באהבה"
        text="אלו שתי הדרכים שעלו אצלך הכי חזק."
      />
      <div className="top-result-grid">
        {topTwo.map((score, index) => (
          <article className={`top-love-card score-${score.id}`} key={score.id}>
            <div className="top-love-icon" aria-hidden="true">
              {categoryIcons[score.id]}
            </div>
            <div>
              <p className="eyebrow">
                דרך האהבה {index === 0 ? "הראשונה" : "השנייה"}
              </p>
              <h3>{score.label}</h3>
              <p>{categoryText[score.id]}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="results-note">
        אין כאן דרך טובה יותר או פחות.
        <br />
        זו פשוט הדרך שבה בדרך כלל קל לך יותר להרגיש אהוב.
      </p>
      <div className="footer-actions">
        <button className="ghost-button" type="button" onClick={onBack}>
          חזרה
        </button>
        <button className="primary-button" type="button" onClick={onNext}>
          להפוך את זה למחווה
        </button>
      </div>
    </div>
  );
}

function GestureIdeasScreen({
  scores,
  selected,
  onBack,
  onToggle,
  onNext,
}: {
  scores: Score[];
  selected: string[];
  onBack: () => void;
  onToggle: (idea: string) => void;
  onNext: () => void;
}) {
  const topCategories = scores.slice(0, 2).map((score) => score.id);
  const topCategoryLabels = topCategories
    .map((categoryId) => typedIntro.categories[categoryId])
    .join(" ו");
  const actions = topCategories.flatMap((categoryId) => loveActions[categoryId]);

  return (
    <div className="screen-block">
      <ScreenHeader
        eyebrow="מתרגמים למעשה"
        title="מה ישמח אותך באמת השבוע?"
        text={`ההצעות כאן נבנו לפי שתי הדרכים שעלו אצלך הכי חזק: ${topCategoryLabels}.`}
      />
      <CentralIdeaCard />
      <p className="results-note">
        ❤️ הציגו את הרשימה לבן או בת הזוג. אילו מהמחוות האלה היו גורמות לך להרגיש אהוב במיוחד השבוע?
      </p>
      <div className="gesture-list">
        {actions.map((action) => (
          <button
            className={
              selected.includes(action.text)
                ? "gesture-card selected"
                : "gesture-card"
            }
            key={action.id}
            type="button"
            onClick={() => onToggle(action.text)}
          >
            <span aria-hidden="true">{categoryIcons[action.category]}</span>
            <b>{action.text}</b>
          </button>
        ))}
      </div>
      <p className="selection-count">{selected.length}/3 נבחרו</p>
      <div className="footer-actions">
        <button className="ghost-button" type="button" onClick={onBack}>
          חזרה
        </button>
        <button
          className="primary-button"
          disabled={selected.length === 0}
          type="button"
          onClick={onNext}
        >
          להראות לבן/בת הזוג
        </button>
      </div>
    </div>
  );
}

function ChooseGestureScreen({
  selected,
  chosenGesture,
  onBack,
  onChoose,
  onNext,
}: {
  selected: string[];
  chosenGesture: string;
  onBack: () => void;
  onChoose: (value: string) => void;
  onNext: () => void;
}) {
  return (
    <div className="screen-block">
      <ScreenHeader
        eyebrow="מחווה אחת קטנה"
        title="מה אבחר לעשות השבוע?"
        text="מתוך מה שסומן, בוחרים דבר אחד בלבד. לא צריך לבחור הרבה. רק דבר אחד קטן לשבוע הזה."
      />
      <div className="gesture-list">
        {selected.map((idea) => (
          <button
            className={chosenGesture === idea ? "gesture-card selected final" : "gesture-card"}
            key={idea}
            type="button"
            onClick={() => onChoose(idea)}
          >
            <span aria-hidden="true">❤️</span>
            <b>{idea}</b>
          </button>
        ))}
      </div>
      <div className="footer-actions">
        <button className="ghost-button" type="button" onClick={onBack}>
          חזרה
        </button>
        <button
          className="primary-button"
          disabled={!chosenGesture}
          type="button"
          onClick={onNext}
        >
          לסיום
        </button>
      </div>
    </div>
  );
}

function FinishScreen({
  gesture,
  onRestart,
}: {
  gesture: string;
  onRestart: () => void;
}) {
  return (
    <div className="screen-block finish-screen">
      <div className="welcome-heart" aria-hidden="true">
        ❤️
      </div>
      <div>
        <h1>האהבה מתחילה בבית</h1>
        <p className="lead-text">
          השבוע בחרתי להראות אהבה בדרך שבן או בת הזוג שלי באמת מרגישים.
          <br />
          מחווה אחת קטנה. השפעה גדולה.
        </p>
      </div>
      {gesture.trim() && (
        <article className="soft-card">
          <h3>המחווה שבחרתי</h3>
          <p>{gesture}</p>
        </article>
      )}
      <button className="primary-button" type="button" onClick={onRestart}>
        נתראה בעוד שבוע
      </button>
    </div>
  );
}

function LovePathsList() {
  return (
    <div className="love-paths couple-paths" aria-label="חמש דרכי האהבה">
      {(Object.keys(typedIntro.categories) as CategoryId[]).map((id) => (
        <div className="love-path" key={id}>
          <span aria-hidden="true">{categoryIcons[id]}</span>
          <div>
            <b>{typedIntro.categories[id]}</b>
            <small>{categoryText[id]}</small>
          </div>
        </div>
      ))}
    </div>
  );
}

function CentralIdeaCard() {
  return (
    <section className="central-idea" aria-label="הרעיון המרכזי של המסע">
      <p>
        רובנו נותנים אהבה בדרך שטבעית לנו.
        <br />
        המסע הזה מזמין אותנו לגלות איך לתת אהבה בדרך שנכונה לאדם שאיתנו.
      </p>
    </section>
  );
}

function ParticipantCard({
  label,
  onPick,
}: {
  label: string;
  onPick: () => void;
}) {
  return (
    <button className="participant-card" type="button" onClick={onPick}>
      <span aria-hidden="true">○</span>
      <div>
        <strong>{label}</strong>
      </div>
    </button>
  );
}

function ScreenHeader({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p className="muted">{text}</p>
    </div>
  );
}

function TextArea({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="field-label">
      <span>{label}</span>
      <textarea
        placeholder={placeholder}
        rows={3}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

type Score = {
  id: CategoryId;
  label: string;
  score: number;
  max: number;
};

function getScores(items: Item[], answers: Record<string, number>): Score[] {
  return (Object.keys(typedIntro.categories) as CategoryId[])
    .map((categoryId) => {
      const categoryItems = items.filter((item) => item.category === categoryId);
      const score = categoryItems.reduce(
        (sum, item) => sum + (answers[item.id] ?? 0),
        0,
      );

      return {
        id: categoryId,
        label: typedIntro.categories[categoryId],
        score,
        max: categoryItems.length * 3,
      };
    })
    .sort((a, b) => b.score - a.score);
}

function getScreenLabel(screen: CoupleScreen) {
  const labels: Record<CoupleScreen, string> = {
    welcome: "פתיחה",
    intro: "משתתף",
    participant: "משתתף",
    quiz: "שאלון",
    results: "תוצאות",
    gestureIdeas: "מחוות",
    chooseGesture: "בחירה",
    finish: "סיום",
  };

  return labels[screen];
}

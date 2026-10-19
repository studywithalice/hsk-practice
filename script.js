
let currentQuestion = 0;
let currentQuestions = [];
let currentTestName = "Bài 1 - AI小语，你好！";
let quizSubmitted = false;

function showHSK1Tests() {
  const menu = document.getElementById("hsk1TestMenu");
  const buttonsContainer = document.getElementById("hsk1TestButtons");

  if (!menu || !buttonsContainer) {
    alert("Không tìm thấy khu vực chọn đề HSK 1.");
    return;
  }

  buttonsContainer.innerHTML = "";

  const testNames = Object.keys(window.hsk1Tests || {});

  if (testNames.length === 0) {
    alert("Chưa có bộ đề HSK 1 nào.");
    return;
  }

  testNames.forEach(testName => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = testName;

    button.addEventListener("click", () => {
      menu.hidden = true;
      openHSK1Lesson(testName);
    });

    buttonsContainer.appendChild(button);
  });

  menu.hidden = false;
  menu.scrollIntoView({ behavior: "smooth", block: "center" });
}

function setDockAudio(source, label) {
  const audio = document.querySelector("#sampleAudioDockSlot audio");
  const labelEl = document.getElementById("sampleAudioDockLabel");
  if (audio && source && !audio.src.endsWith(source)) {
    audio.pause();
    audio.src = source;
    audio.load();
  }
  if (labelEl && label) labelEl.textContent = label;
}

function openHSK1Lesson(testName = "Bài 1 - AI小语，你好！") {
  currentTestName = testName;
  const lesson = document.getElementById("phoneticsLesson");
  const quiz = document.getElementById("quiz");
  if (lesson) lesson.hidden = false;
  if (quiz) quiz.hidden = true;
  const audioDock = document.getElementById("sampleAudioDock");
  if (audioDock) audioDock.hidden = false;
  setDockAudio("audio/yuyin.mp3", "语音 · Nghe mẫu");
  showLessonPage(0, false);
  if (lesson) lesson.scrollIntoView({ behavior: "smooth", block: "start" });
}

let activeLessonPage = 0;
const lessonPageTitles = [
  "Trang 1 · Âm tiết tiếng Trung",
  "Trang 2 · Thanh mẫu và vận mẫu",
  "Trang 3 · Bốn thanh điệu"
];
const lessonPageDescriptions = [
  "Hiểu cấu tạo của một âm tiết và xem ví dụ ngay bên dưới.",
  "Phân biệt âm đầu với phần vần, sau đó quan sát ví dụ trong giáo trình.",
  "Nắm đường đi của bốn thanh điệu và so sánh ví dụ bā, bá, bǎ, bà."
];

function showLessonPage(index, scroll = true) {
  const pages = [...document.querySelectorAll(".lesson-page")];
  if (!pages.length) return;
  activeLessonPage = Math.max(0, Math.min(index, pages.length - 1));
  pages.forEach((page, i) => {
    const active = i === activeLessonPage;
    page.hidden = !active;
    page.classList.toggle("active", active);
  });
  document.querySelectorAll(".lesson-page-dot").forEach((button, i) => {
    const active = i === activeLessonPage;
    button.classList.toggle("active", active);
    button.setAttribute("aria-current", active ? "step" : "false");
  });
  const title = document.getElementById("lessonPageTitle");
  const description = document.getElementById("lessonPageDescription");
  const count = document.getElementById("lessonPageCount");
  const previous = document.getElementById("previousLessonPage");
  const next = document.getElementById("nextLessonPage");
  const practice = document.getElementById("lessonPracticeStart");
  if (title) title.textContent = lessonPageTitles[activeLessonPage];
  if (description) description.textContent = lessonPageDescriptions[activeLessonPage];
  if (count) count.textContent = `${activeLessonPage + 1} / ${pages.length}`;
  if (previous) previous.disabled = activeLessonPage === 0;
  if (next) {
    next.hidden = activeLessonPage === pages.length - 1;
    next.disabled = activeLessonPage === pages.length - 1;
  }
  if (practice) practice.hidden = activeLessonPage !== pages.length - 1;
  if (scroll) {
    const heading = document.querySelector(".lesson-page-heading");
    if (heading) heading.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const sampleAudio = document.querySelector(".audio-first-card audio");
  const sampleAudioSlot = document.getElementById("sampleAudioDockSlot");
  if (sampleAudio && sampleAudioSlot) sampleAudioSlot.appendChild(sampleAudio);
  const sampleAudioDock = document.getElementById("sampleAudioDock");
  if (sampleAudioDock) sampleAudioDock.hidden = true;
  document.querySelectorAll(".lesson-page-dot").forEach(button => {
    button.addEventListener("click", () => showLessonPage(Number(button.dataset.lessonPage)));
  });
  document.getElementById("previousLessonPage")?.addEventListener("click", () => showLessonPage(activeLessonPage - 1));
  document.getElementById("nextLessonPage")?.addEventListener("click", () => showLessonPage(activeLessonPage + 1));
  showLessonPage(0, false);
});

function startHSK1(testName = "Bài 1 - AI小语，你好！") {
  currentTestName = testName;
  // Image examples belong to the learning stage, not to the scored exercise list.
  currentQuestions = (window.hsk1Tests?.[currentTestName] || [])
    .filter(item => item.type !== "image-gallery");
  const lesson = document.getElementById("phoneticsLesson");
  if (lesson) lesson.hidden = true;
  const audioDock = document.getElementById("sampleAudioDock");
  if (audioDock) audioDock.hidden = true;
  

  if (!Array.isArray(currentQuestions) || currentQuestions.length === 0) {
    alert("Không tìm thấy câu hỏi của bộ đề: " + currentTestName);
    return;
  }

  currentQuestion = 0;
  quizSubmitted = false;

  const quiz = document.getElementById("quiz");
  const container = document.getElementById("questions");
  const testAudio = document.getElementById("testAudio");

  quiz.hidden = false;
  container.innerHTML = "";
  console.log("Số thẻ trước khi tạo:", container.querySelectorAll(".question-card").length);

  if (testAudio) {
    testAudio.src = "audio/tingdu-lianxi.mp3";
    testAudio.load();
  }
  if (audioDock) audioDock.hidden = false;
  setDockAudio("audio/tingdu-lianxi.mp3", "听读练 · Audio bài tập");

  document.getElementById("result").textContent = "";
  const questionNavigation = document.getElementById("questionNavigation");
  if (questionNavigation) questionNavigation.hidden = false;
  const questionControls = document.querySelector(".question-controls");
  if (questionControls) questionControls.hidden = false;
  document.getElementById("submitBtn").hidden = false;
  document.getElementById("backBtn").hidden = true;
  document.getElementById("redoBtn").hidden = true;

  currentQuestions.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "question-card";
    card.dataset.index = index;
card.hidden = true;
    const title = document.createElement("h3");
    // Show only the section number, not the global question number (avoids "9. 2." / "51. 5.").
    title.textContent = `${item.sectionNumber || ""}. ${item.question}`;
    card.appendChild(title);

    // Show Pinyin and Vietnamese meaning immediately below the instruction, before image/answer controls.
    if (item.pinyin) {
      const pinyin = document.createElement("p");
      pinyin.className = "question-pinyin";
      pinyin.textContent = item.pinyin;
      card.appendChild(pinyin);
    }

    if (item.meaning) {
      const meaning = document.createElement("p");
      meaning.className = "question-meaning";
      meaning.textContent = item.meaning;
      card.appendChild(meaning);
    }

    if (item.image) {
      const questionImage = document.createElement("img");
      questionImage.className = "question-image";
      questionImage.src = item.image;
      questionImage.alt = "Hình minh họa cho câu hỏi";
      questionImage.loading = "lazy";
      questionImage.style.display = "block";
      questionImage.style.width = "100%";
      questionImage.style.maxWidth = "560px";
      questionImage.style.height = "auto";
      questionImage.style.margin = "12px auto";
      questionImage.style.borderRadius = "8px";
      card.appendChild(questionImage);
    }

    if (item.type === "image-gallery") {
      const gallery = document.createElement("div");
      gallery.className = "vocabulary-image-gallery";
      (item.galleryImages || []).forEach(imageInfo => {
        const image = document.createElement("img");
        image.src = imageInfo.src;
        image.alt = imageInfo.alt || "Hình minh họa từ vựng";
        image.loading = "lazy";
        gallery.appendChild(image);
      });
      card.appendChild(gallery);
    }

    if (item.type === "reading") {
      const syllableGrid = document.createElement("div");
      syllableGrid.className = "syllable-grid";
      (item.syllables || []).forEach(syllable => {
        const syllableItem = document.createElement("div");
        syllableItem.className = "syllable-item";
        syllableItem.textContent = syllable;
        syllableGrid.appendChild(syllableItem);
      });
      card.appendChild(syllableGrid);
    }

    if (item.type === "fill-in") {
      const input = document.createElement("input");
      input.type = "text";
      input.className = "fill-answer";
      input.name = `question-${index}`;
      // Hướng dẫn nhập liệu phải khớp với dạng câu hỏi trong giáo trình.
      if (String(item.sectionNumber) === "2") {
        input.placeholder = "Nhập thanh mẫu (ví dụ: b, d, m)...";
      } else if (String(item.sectionNumber) === "3") {
        input.placeholder = "Nhập vận mẫu (ví dụ: a, ai, an)...";
      } else if (String(item.sectionNumber) === "4") {
        input.placeholder = "Nhập thanh điệu (1, 2, 3 hoặc 4)...";
      } else {
        input.placeholder = "Nhập câu trả lời...";
      }
      input.autocomplete = "off";
      input.setAttribute("aria-label", `Câu trả lời câu ${index + 1}`);
      input.addEventListener("input", updateProgress);

      if (item.promptLabel) {
        const promptLabel = document.createElement("div");
        promptLabel.className = "answer-prompt-label";

        const match = item.promptLabel.match(/^(第\d+题：)(.*)$/);
        if (match) {
          const promptNumber = document.createElement("div");
          promptNumber.className = "answer-prompt-number";
          promptNumber.textContent = match[1];

          const promptTarget = document.createElement("div");
          promptTarget.className = "answer-prompt-target";
          promptTarget.textContent = match[2].trim();

          promptLabel.appendChild(promptNumber);
          promptLabel.appendChild(promptTarget);
        } else {
          promptLabel.textContent = item.promptLabel;
        }

        card.appendChild(promptLabel);
      }
      card.appendChild(input);
    } else {
      const options = Array.isArray(item.options) ? item.options : [];

      options.forEach((option, optionIndex) => {
        const label = document.createElement("label");
        label.className = "answer-option";

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = `question-${index}`;
        radio.value = optionIndex;
        radio.addEventListener("change", updateProgress);

        const text = document.createElement("span");
        text.textContent = `${String.fromCharCode(65 + optionIndex)}. ${option}`;

        label.appendChild(radio);
        label.appendChild(text);
        card.appendChild(label);
      });
    }

 container.appendChild(card);
});

  renderQuestionNavigation();
  showQuestion(0);
  updateProgress();
  updateQuestionControls();

  quiz.scrollIntoView({ behavior: "smooth" });
}


function isAnswered(index) {
  const item = currentQuestions[index];

  if (!item) {
    return false;
  }

  // Nhóm luyện đọc không cần nhập đáp án.
  if (item.type === "reading" || item.type === "image-gallery") {
    return true;
  }

  if (item.type === "fill-in") {
    const input = document.querySelector(
      `.question-card[data-index="${index}"] .fill-answer`
    );

    return Boolean(input && input.value.trim() !== "");
  }

  return Boolean(
    document.querySelector(
      `input[name="question-${index}"]:checked`
    )
  );
}



function getUserAnswer(index) {
  const item = currentQuestions[index];

  if (!item || item.type === "reading" || item.type === "image-gallery") {
    return null;
  }

  if (item.type === "fill-in") {
    const input = document.querySelector(
      `.question-card[data-index="${index}"] .fill-answer`
    );

    return input ? input.value.trim() : "";
  }

  const selected = document.querySelector(
    `input[name="question-${index}"]:checked`
  );

  return selected ? Number(selected.value) : null;
}


function renderQuestionNavigation() {
  const nav = document.getElementById("questionNavigation");
  nav.innerHTML = "";
console.log("Số câu trước khi tạo thẻ:", currentQuestions.length);
console.log("8 câu đầu:", currentQuestions.slice(0, 8).map((item, index) => ({
  index,
  question: item.question
})));
  currentQuestions.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "question-number";
    button.textContent = index + 1;
    button.setAttribute("aria-label", `Đi đến câu ${index + 1}`);

    button.addEventListener("click", () => {
      if (!quizSubmitted) showQuestion(index);
    });

    nav.appendChild(button);
  });

  updateQuestionNavigation();
}

function showQuestion(index) {
  if (!Number.isInteger(index)) return;
  if (index < 0 || index >= currentQuestions.length) return;

  currentQuestion = index;

  const container = document.getElementById("questions");
  const cards = container.querySelectorAll(".question-card");

  cards.forEach((card) => {
    card.hidden = Number(card.dataset.index) !== index;
  });

  updateQuestionControls();
  updateQuestionNavigation();
}

function changeQuestion(direction) {
  if (quizSubmitted) return;
  showQuestion(currentQuestion + direction);
}

function updateQuestionControls() {
  const total = currentQuestions.length;

  document.getElementById("currentQuestionText").textContent =
    `Câu ${currentQuestion + 1}/${total}`;

  document.getElementById("prevBtn").disabled =
    currentQuestion === 0 || quizSubmitted;

  document.getElementById("nextBtn").disabled =
    currentQuestion === total - 1 || quizSubmitted;
}

function updateQuestionNavigation() {
  document.querySelectorAll(".question-number").forEach((button, index) => {
    button.classList.toggle("current", index === currentQuestion);
    button.classList.toggle("answered", isAnswered(index));
    button.disabled = quizSubmitted;
  });
}

function updateProgress() {
  const total = currentQuestions.length;
  const answered = currentQuestions.filter((item, index) =>
    isAnswered(index)
  ).length;

  const percent = total > 0
    ? Math.round((answered / total) * 100)
    : 0;

  document.getElementById("progressText").textContent =
    `Đã trả lời ${answered}/${total} câu`;

  document.getElementById("progressPercent").textContent = `${percent}%`;
  document.getElementById("progressBar").style.width = `${percent}%`;

  updateQuestionNavigation();
}


function submitQuiz() {
  if (quizSubmitted) return;

  const unanswered = currentQuestions.filter(
    (item, index) => !isAnswered(index)
  ).length;

  if (unanswered > 0) {
    const confirmSubmit = confirm(
      `Bạn còn ${unanswered} câu chưa trả lời. Bạn vẫn muốn nộp bài?`
    );

    if (!confirmSubmit) return;
  }

  quizSubmitted = true;
  let score = 0;
  let totalScored = 0;

  currentQuestions.forEach((item, index) => {
    const card = document.querySelector(
      `.question-card[data-index="${index}"]`
    );

    if (!card) return;

    card.querySelectorAll(".feedback").forEach(el => el.remove());

    // Phần luyện đọc và thẻ hình từ vựng chỉ dùng để luyện tập, không chấm điểm.
    if (item.type === "reading" || item.type === "image-gallery") {
      const note = document.createElement("p");
      note.className = "feedback feedback-neutral";
      note.textContent =
        item.type === "reading"
          ? "Phần luyện đọc: hãy nghe audio và tự đọc to các âm tiết."
          : "Phần hình ảnh từ vựng: hãy nghe, nhắc lại âm tiết và đọc to.";
      card.appendChild(note);
      card.hidden = false;
      return;
    }

    const userAnswer = getUserAnswer(index);
    const feedback = document.createElement("p");
    feedback.className = "feedback";

    let isCorrect = false;

    if (item.type === "fill-in") {
      const acceptedAnswers = Array.isArray(item.answers)
        ? item.answers
        : [item.answerText || ""];

      isCorrect = acceptedAnswers.some(answer =>
        String(answer).trim().toLowerCase() ===
        String(userAnswer ?? "").trim().toLowerCase()
      );

      const input = card.querySelector(".fill-answer");
      if (input) {
        input.disabled = true;
        input.classList.add(isCorrect ? "answer-correct" : "answer-wrong");
        input.setAttribute("aria-label", isCorrect ? "Câu trả lời chính xác" : "Câu trả lời chưa chính xác");
      }

      const correctAnswerText = acceptedAnswers
        .map(answer => String(answer).trim())
        .filter(Boolean)
        .join(" / ");

      feedback.textContent = isCorrect
        ? `✓ Chính xác! Đáp án: ${correctAnswerText}`
        : `✗ Chưa chính xác. Đáp án đúng: ${correctAnswerText || "Chưa có đáp án được thiết lập."}`;
    } else {
      isCorrect = userAnswer === item.answer;

      const options = card.querySelectorAll(".answer-option");

      if (options[item.answer]) {
        options[item.answer].classList.add("correct-answer");
      }

      if (userAnswer !== null && options[userAnswer]) {
        options[userAnswer].classList.add(
          isCorrect ? "selected-correct" : "selected-wrong"
        );
      }

      const correctOptionText = options[item.answer]
        ? options[item.answer].querySelector("span")?.textContent || ""
        : "";

      feedback.textContent = isCorrect
        ? `✓ Chính xác! Đáp án đúng: ${correctOptionText}`
        : `✗ Chưa chính xác. Đáp án đúng: ${correctOptionText || "Chưa có đáp án được thiết lập."}`;

      card.querySelectorAll('input[type="radio"]').forEach(input => {
        input.disabled = true;
      });
    }

    totalScored++;
    if (isCorrect) score++;

    card.classList.add(isCorrect ? "question-correct" : "question-wrong");
    feedback.classList.add(isCorrect ? "feedback-correct" : "feedback-wrong");
    card.appendChild(feedback);
    card.hidden = false;
  });

  const percent = totalScored > 0
    ? Math.round((score / totalScored) * 100)
    : 0;

  document.getElementById("result").textContent =
    totalScored > 0
      ? `Kết quả: Bạn trả lời đúng ${score}/${totalScored} câu (${percent}%). Câu đúng được đánh dấu màu xanh lá; câu sai được đánh dấu màu đỏ và hiển thị đáp án đúng.`
      : "Đã hoàn thành phần luyện đọc.";

  // Sau khi nộp, hiện tất cả câu để người học xem màu sắc và đáp án phản hồi.
  document.querySelectorAll(".question-card").forEach(card => {
    card.hidden = false;
  });
  const questionNavigation = document.getElementById("questionNavigation");
  if (questionNavigation) questionNavigation.hidden = true;
  const questionControls = document.querySelector(".question-controls");
  if (questionControls) questionControls.hidden = true;

  document.getElementById("submitBtn").hidden = true;
  document.getElementById("redoBtn").hidden = false;
  document.getElementById("backBtn").hidden = false;

  updateProgress();
  updateQuestionControls();

  document.querySelectorAll(".question-number").forEach(button => {
    button.disabled = true;
  });

  document.getElementById("result").scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

function backToHome() {
  document.getElementById("quiz").hidden = true;
  const lesson = document.getElementById("phoneticsLesson");
  if (lesson) lesson.hidden = true;
  const audioDock = document.getElementById("sampleAudioDock");
  if (audioDock) audioDock.hidden = true;
  document.getElementById("result").textContent = "";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

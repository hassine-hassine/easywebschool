const correctAnswers = {
  html: {
    question1: "Hyper Text Markup Language",
    question2: "W3C",
    question3: "h1",
    question4: "br",
    question5: "/",
    question6: "ol",
    question7: "a href='url'",
    question8: "title",
    question9: "main",
    question10: "img"
  },
  css: {
    question1: "Cascading Style Sheets",
    question2: "<link>",
    question3: "background-color: blue;",
    question4: "color",
    question5: "#header",
    question6: "font-size",
    question7: "font-weight: bold;",
    question8: "font-family",
    question9: "line-height",
    question10: "display"
  },
  js: {
    question1: "console.log()",
    question2: "All of the above",
    question3: "JSON.parse()",
    question4: "function myFunction()",
    question5: "// This is a comment",
    question6: "=",
    question7: "number",
    question8: "var arr = [];",
    question9: "push()",
    question10: "Boolean"
  }
};

let score = 0;

function getQuizLanguage() {
  const id = document.body.id;
  if (id === "quizHTMLPage") return "html";
  if (id === "quizCSSPage") return "css";
  if (id === "quizJSPage") return "js";
  return null;
}

const selectedLanguage = getQuizLanguage();

function checkAnswer(questionNumber) {
  const questionDiv = document.getElementById(`q${questionNumber}`);
  const selected = questionDiv.querySelector(`input[name="question${questionNumber}"]:checked`);
  const submitBtn = questionDiv.querySelector(".submit-btn");

  if (!selected) {
    showFeedback(questionDiv, "Please select an answer.", "orange");
    return;
  }

  const userAnswer = selected.value;
  const correct = correctAnswers[selectedLanguage][`question${questionNumber}`];
  const label = questionDiv.querySelector(`label[for="${selected.id}"]`);

  questionDiv.querySelectorAll("input").forEach(inp => inp.disabled = true);
  submitBtn.disabled = true;

  if (userAnswer === correct) {
    score++;
    showFeedback(questionDiv, "Correct!", "green");
    label.style.backgroundColor = "#d4edda";
    label.style.border = "2px solid green";
  } else {
    showFeedback(questionDiv, "Wrong!", "red");
    label.style.backgroundColor = "#f8d7da";
    label.style.border = "2px solid red";
  }

  if (!questionDiv.querySelector(".next-btn")) {
    const nextBtn = document.createElement("button");
    nextBtn.className = "next-btn";
    nextBtn.style.marginTop = "15px";
    nextBtn.textContent = questionNumber === 10 ? "Finish" : "Next";

    nextBtn.onclick = () => {
      if (questionNumber === 10) {
        finishQuiz();
      } else {
        questionDiv.classList.remove("active");
        document.getElementById(`q${questionNumber + 1}`).classList.add("active");
        nextBtn.remove();
      }
    };

    questionDiv.appendChild(nextBtn);
  }
}

function showFeedback(container, message, color) {
  let feedback = container.querySelector(".feedback");
  if (!feedback) {
    feedback = document.createElement("p");
    feedback.className = "feedback";
    feedback.style.marginTop = "10px";
    container.appendChild(feedback);
  }
  feedback.textContent = message;
  feedback.style.color = color;
}

function finishQuiz() {
  alert(`Quiz finished! 🎉 Your score: ${score} out of 10.`);
  localStorage.setItem("lastScore", score);

  const best = localStorage.getItem("bestScore");
  if (!best || score > Number(best)) {
    localStorage.setItem("bestScore", score);
  }

  window.location.href = "greetpage.html";
}

// Attach submit button handlers
document.querySelectorAll('.submit-btn').forEach((btn) => {
  btn.onclick = () => {
    const div = btn.closest('.question');
    const num = parseInt(div.id.replace('q', ''));
    checkAnswer(num);
  };
});

// Greet page logic
if (window.location.pathname.includes("greetpage.html")) {
  window.addEventListener("DOMContentLoaded", () => {
    const lastScoreSpan = document.getElementById("last-score");
    const bestScoreSpan = document.getElementById("best-score");
    const last = localStorage.getItem("lastScore");
    const best = localStorage.getItem("bestScore");

    if (lastScoreSpan) lastScoreSpan.textContent = last ? `Last Score: ${last} / 10` : "Last Score: -";
    if (bestScoreSpan) bestScoreSpan.textContent = best ? `Best Score: ${best} / 10` : "Best Score: -";
  });

  // Language selection on greet page
  const langBtns = document.querySelectorAll('.language-selection button[data-lang]');
  const startBtn = document.querySelector('.start-button button');
  const selectedDiv = document.querySelector('.selected-language');

  let selectedLang = null;

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      langBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedLang = btn.getAttribute('data-lang');
      localStorage.setItem('selectedLanguage', selectedLang);
      selectedDiv.textContent = `Selected language: ${selectedLang.toUpperCase()}`;
      startBtn.disabled = false;
    });
  });

  startBtn.addEventListener('click', () => {
    if (!selectedLang) return;
    window.location.href = `quiz-${selectedLang}.html`;
  });
}

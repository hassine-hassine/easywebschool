// --- Correct Answers ---
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

// --- Get Quiz Language ---
function getQuizLanguage() {
  const id = document.body.id;
  return id.includes("HTML") ? "html" : id.includes("CSS") ? "css" : id.includes("JS") ? "js" : null;
}

const selectedLanguage = getQuizLanguage();

// --- Show Feedback ---
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

// --- Check Answer ---
function checkAnswer(qNum) {
  const qDiv = document.getElementById(`q${qNum}`);
  const selectedInput = qDiv.querySelector(`input[name="question${qNum}"]:checked`);
  if (!selectedInput) return showFeedback(qDiv, "Please select an answer.", "orange");

  const userAnswer = selectedInput.value;
  const correct = correctAnswers[selectedLanguage][`question${qNum}`];

  // Disable inputs
  qDiv.querySelectorAll("input").forEach(inp => inp.disabled = true);

  // Feedback styling
  qDiv.querySelectorAll("input").forEach(inp => {
    const lbl = qDiv.querySelector(`label[for="${inp.id}"]`);
    if (inp.value === correct) {
      lbl.style.backgroundColor = "#d4edda";
      lbl.style.border = "2px solid green";
    } else if (inp.checked) {
      lbl.style.backgroundColor = "#f8d7da";
      lbl.style.border = "2px solid red";
    }
  });

  if (userAnswer === correct) score++;
  showFeedback(qDiv, userAnswer === correct ? "Correct!" : "Wrong!", userAnswer === correct ? "green" : "red");

  // Next button
  if (!qDiv.querySelector(".next-btn")) {
    const nextBtn = document.createElement("button");
    nextBtn.className = "next-btn";
    nextBtn.textContent = qNum === 10 ? "Finish" : "Next";
    nextBtn.onclick = () => {
      if (qNum === 10) finishQuiz();
      else {
        qDiv.classList.remove("active");
        document.getElementById(`q${qNum + 1}`).classList.add("active");
        nextBtn.remove();
      }
    };
    qDiv.appendChild(nextBtn);
  }
}

// --- Finish Quiz ---
function finishQuiz() {
  localStorage.setItem("lastScore", score);
  const best = localStorage.getItem("bestScore");
  if (!best || score > Number(best)) localStorage.setItem("bestScore", score);
    alert(`🎉 Quiz Finished!\nYour Score: ${score}`);
  window.location.href = "index.html";
}

// --- Event Listeners for Submit Buttons ---
document.querySelectorAll('.submit-btn').forEach(btn => {
  btn.onclick = () => {
    const qNum = parseInt(btn.closest('.question').id.replace('q',''));
    checkAnswer(qNum);
  };
});

// --- Greet Page Logic ---
if (window.location.pathname.includes("index.html")) {
  window.addEventListener("DOMContentLoaded", () => {
    const lastScore = localStorage.getItem("lastScore") || "-";
    const bestScore = localStorage.getItem("bestScore") || "-";
    document.getElementById("last-score").textContent = `Last Score: ${lastScore} / 10`;
    document.getElementById("best-score").textContent = `Best Score: ${bestScore} / 10`;
  });

  const langBtns = document.querySelectorAll('.language-selection button[data-lang]');
  const startBtn = document.querySelector('.start-button button');
  const selectedDiv = document.querySelector('.selected-language');
  let selectedLang = null;

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      langBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedLang = btn.dataset.lang;
      localStorage.setItem('selectedLanguage', selectedLang);
      selectedDiv.textContent = `Selected language: ${selectedLang.toUpperCase()}`;
      selectedDiv.classList.add('visible');
      startBtn.disabled = false;
    });
  });

  startBtn.addEventListener('click', () => {
    if (selectedLang) window.location.href = `quiz-${selectedLang}.html`;
  });
}

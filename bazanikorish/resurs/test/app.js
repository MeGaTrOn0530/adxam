const apiUrl = "https://script.google.com/macros/s/AKfycbzwDBsguJKZJ2J7RfBxC3ARO4mumeLzdYdH3um0ozNENGVa0D8vFcxOsIfQF288vZSG/exec";

document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const time = data.time;
    const questions = data.questions;
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let isTestFinished = false;

    // Timer funksiyasi
    const timerElement = document.getElementById("time-circle");
    let timeLeft = parseInt(time) * 60;
    const timer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            finishTest();
        }
        timeLeft--;
    }, 1000);

    // Savollarni chiqarish
    const questionsContainer = document.getElementById("questions");
    const indicatorsContainer = document.getElementById("indicators");

    questions.forEach((q, index) => {
        const questionCard = document.createElement("div");
        questionCard.classList.add("question-card");
        questionCard.innerHTML = `<h2>${index + 1}. ${q.question}</h2>`;

        const shuffledOptions = q.options.sort(() => Math.random() - 0.5);
        shuffledOptions.forEach(option => {
            const label = document.createElement("label");
            label.classList.add("option-label");
            label.innerHTML = `<input type="radio" name="q${index}" value="${option}"> ${option}`;
            if (option === q.correct) label.dataset.correct = "true";
            questionCard.appendChild(label);
        });

        questionsContainer.appendChild(questionCard);

        // Indicatorni yaratish
        const indicator = document.createElement("div");
        indicator.classList.add("indicator");
        indicator.textContent = index + 1;
        indicator.dataset.index = index;

        // Savolga tegishli belgilash orqali indikatorni yangilash
        questionCard.addEventListener("change", () => {
            const selectedOption = questionCard.querySelector("input[type='radio']:checked");
            if (selectedOption) {
                indicator.classList.add("selected");
            } else {
                indicator.classList.remove("selected");
            }
        });

        indicator.addEventListener("click", () => {
            questionCard.scrollIntoView({ behavior: "smooth" });
        });

        indicatorsContainer.appendChild(indicator);
    });

    // Testni yakunlash funksiyasi
    function finishTest() {
        if (isTestFinished) return;
        isTestFinished = true;

        const selectedOptions = document.querySelectorAll("input[type='radio']:checked");
        selectedOptions.forEach(option => {
            const questionIndex = option.name.replace("q", "");
            const indicator = indicatorsContainer.querySelector(`.indicator:nth-child(${+questionIndex + 1})`);

            if (option.parentElement.dataset.correct === "true") {
                correctAnswers++;
                indicator.classList.add("correct");
            } else {
                incorrectAnswers++;
                indicator.classList.add("incorrect");
            }
        });

        // Belgilanmagan savollar uchun qora rangni belgilash
        questions.forEach((_, index) => {
            const indicator = indicatorsContainer.querySelector(`.indicator:nth-child(${index + 1})`);
            const selectedOption = document.querySelector(`input[name="q${index}"]:checked`);
            if (!selectedOption && !indicator.classList.contains("correct") && !indicator.classList.contains("incorrect")) {
                indicator.classList.add("unanswered");
            }
        });

        // Natijalarni chiqarish
        const resultContainer = document.createElement("div");
        resultContainer.classList.add("result-container");
        resultContainer.innerHTML = `
            <h3>Test yakunlandi!</h3>
            <p>To'g'ri javoblar: <span class="correct-count">${correctAnswers}</span></p>
            <p>Noto'g'ri javoblar: <span class="incorrect-count">${incorrectAnswers}</span></p>
        `;
        document.body.appendChild(resultContainer);

        // Savollarni bloklash
        document.querySelectorAll("input[type='radio']").forEach(input => (input.disabled = true));
    }

    // Yakunlash tugmasiga bog'lash
    document.querySelector(".finish-button").addEventListener("click", () => {
        clearInterval(timer);
        finishTest();
    });
});

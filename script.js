// কুইজের প্রশ্ন ও উত্তরসমূহ (Object Array)
const quizData = [
    {
        question: "১. জাভাস্ক্রিপ্ট (JavaScript) মূলত কী ধরনের ল্যাঙ্গুয়েজ?",
        options: ["Client-side Scripting", "Markup Language", "Database Language", "Operating System"],
        correct: 0
    },
    {
        question: "২. CSS এর পূর্ণরূপ বা ফুল ফর্ম কোনটি?",
        options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
        correct: 1
    },
    {
        question: "৩. HTML-এ সবচেয়ে বড় হেডিং ট্যাগ কোনটি?",
        options: ["<h6>", "<heading>", "<h1>", "<head>"],
        correct: 2
    },
    {
        question: "৪. ব্রাউজারে ডাটা স্থায়ীভাবে সেভ রাখার জন্য কোনটি ব্যবহার করা হয়?",
        options: ["SessionStorage", "LocalStorage", "Array", "Variables"],
        correct: 1
    }
];

// প্রয়োজনীয় DOM Elements সিলেক্ট করা
const quizContainer = document.getElementById('quiz');
const questionNumberEl = document.getElementById('question-number');
const timeLeftEl = document.getElementById('time-left');
const questionTextEl = document.getElementById('question-text');
const optionsContainer = document.getElementById('options');
const nextBtn = document.getElementById('next-btn');

const resultBox = document.getElementById('result-box');
const scoreEl = document.getElementById('score');
const totalQuestionsEl = document.getElementById('total-questions');
const restartBtn = document.getElementById('restart-btn');

// স্টেট ম্যানেজমেন্ট ভেরিয়েবল
let currentQuestionIndex = 0;
let score = 0;
let timer;
const maxTime = 10; // প্রতি প্রশ্নের জন্য ১০ সেকেন্ড
let timeLeft = maxTime;

// কুইজ শুরু করার ফাংশন
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    totalQuestionsEl.innerText = quizData.length;
    resultBox.classList.add('hide');
    quizContainer.classList.remove('hide');
    showQuestion();
}

// প্রশ্ন এবং অপশন স্ক্রিনে দেখানো
function showQuestion() {
    resetState();
    
    // বর্তমান প্রশ্ন নেওয়া
    let currentQuestion = quizData[currentQuestionIndex];
    questionNumberEl.innerText = `প্রশ্ন ${currentQuestionIndex + 1}/${quizData.length}`;
    questionTextEl.innerText = currentQuestion.question;

    // অপশন বাটন তৈরি করা
    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option-btn');
        // সঠিক উত্তরের ইনডেক্স বাটনে ডেটাসেট হিসেবে সেভ রাখা
        button.dataset.index = index;
        button.addEventListener('click', selectAnswer);
        optionsContainer.appendChild(button);
    });

    // টাইমার চালু করা
    startTimer();
}

// আগের প্রশ্নের ডেটা ও বাটন রিসেট করা
function resetState() {
    clearInterval(timer);
    timeLeft = maxTime;
    timeLeftEl.innerText = timeLeft;
    nextBtn.classList.add('hide');
    optionsContainer.innerHTML = '';
}

// টাইমার ফাংশন (setInterval এর ব্যবহার)
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timeLeftEl.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            // সময় শেষ হয়ে গেলে স্বয়ংক্রিয়ভাবে সঠিক উত্তরটি দেখিয়ে দেওয়া
            handleTimeout();
        }
    }, 1000);
}

// উত্তর সিলেক্ট করার পর যা হবে
function selectAnswer(e) {
    clearInterval(timer); // উত্তর দেওয়ার সাথে সাথে টাইমার বন্ধ হবে
    const selectedButton = e.target;
    const selectedAnswerIndex = parseInt(selectedButton.dataset.index);
    const correctAnswerIndex = quizData[currentQuestionIndex].correct;

    // সঠিক নাকি ভুল চেক করা
    if (selectedAnswerIndex === correctAnswerIndex) {
        selectedButton.classList.add('correct');
        score++;
    } else {
        selectedButton.classList.add('wrong');
        // ভুল উত্তর দিলে সঠিক উত্তরটি সবুজ করে দেখানো
        optionsContainer.children[correctAnswerIndex].classList.add('correct');
    }

    // একটি উত্তর দেওয়ার পর বাকি সব অপশন ক্লিক করা বন্ধ (Disable) করা
    Array.from(optionsContainer.children).forEach(button => {
        button.classList.add('disabled');
    });

    nextBtn.classList.remove('hide');
}

// সময় শেষ হয়ে গেলে লজিক
function handleTimeout() {
    const correctAnswerIndex = quizData[currentQuestionIndex].correct;
    // ব্যবহারকারীকে সঠিক উত্তরটি হাইলাইট করে দেখানো
    optionsContainer.children[correctAnswerIndex].classList.add('correct');

    Array.from(optionsContainer.children).forEach(button => {
        button.classList.add('disabled');
    });

    nextBtn.classList.remove('hide');
}

// পরবর্তী বাটনে ক্লিক করলে
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        showQuestion();
    } else {
        // কুইজ শেষ হলে ফলাফল দেখানো
        showResult();
    }
});

// ফলাফল বা স্কোরবোর্ড দেখানো
function showResult() {
    quizContainer.classList.add('hide');
    resultBox.classList.remove('hide');
    scoreEl.innerText = score;
}

// আবার খেলুন বাটনে ক্লিক করলে কুইজ রিস্টার্ট করা
restartBtn.addEventListener('click', startQuiz);

// অ্যাপ প্রথমবার রান করা
startQuiz();
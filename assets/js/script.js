/*
 *  This is going to be our object that represents a single question in this quiz.
 *
 *  question:           A string representing the text of the question.
 *  answers:            An array of strings representing possible answers.
 *  correctAnswerIndex: A number representing the index of the correct answer in the array of possible answers.
 *  element:            The HTML Element representing this Question, formatted to be inserted into the main section.
 */
class Question {
    constructor(question, answers, correctAnswerIndex) {
        this.question = question;
        this.answers = answers;
        this.correctAnswerIndex = correctAnswerIndex;
        this.element = this.createElement();
    }

    /*
     *  Returns the HTML representation of this question.
     *
     *  The HTML returned will be of the format:
     *  <section class="question-section">
     *      <h3 class="question-prompt">this.question</h3>
     *      <button class="answer-button" id="answer-button-0">this.answers[0]</button>
     *      <button class="answer-button" id="answer-button-1">this.answers[1]</button>
     *      <button class="answer-button" id="answer-button-2">this.answers[2]</button>
     *      <button class="answer-button" id="answer-button-3">this.answers[3]</button>
     *  </section>
     */
    createElement() {
        var questionSection = document.createElement("section");
        questionSection.className = "question-section";
    
        var questionPrompt = document.createElement("h3");
        questionPrompt.className = "question-prompt";
        questionPrompt.textContent = this.question;

        questionSection.appendChild(questionPrompt);

        for (var i = 0; i < this.answers.length; i++) {
            var buttonToAdd = document.createElement("button");
            buttonToAdd.className = "answer-button";
            buttonToAdd.id = "answer-button-" + i;

            if (i === this.correctAnswerIndex) {
                buttonToAdd.setAttribute("correct", true);
            } else {
                buttonToAdd.setAttribute("correct", false);
            }

            buttonToAdd.textContent = (i + 1) + ". " + this.answers[i];

            buttonToAdd.addEventListener("click", answerButtonOnClick);

            questionSection.appendChild(buttonToAdd);
        }

        return questionSection;
    }
}

/* The list of Questions for our Quiz. */
const quizQuestions = [
    new Question(
        "Which of the following IS NOT a primitive data type in JavaScript?",
        ["string", "boolean", "class", "number"],
        2),
    new Question(
        "The statement in an if-else statement is enclosed within ______.",
        ["parentheses", "curly brackets", "quotes", "square brackets"],
        0),
    new Question(
        "Arrays in JavaScript can be used to store ______.",
        ["numbers and strings", "other arrays", "booleans", "all of the above"],
        3)
];

var bodyElement = document.querySelector("body");
var mainElement = document.querySelector("main");
var splashPageElement = document.getElementById("splash-page");
var startQuizButtonElement = document.getElementById("start-quiz-button");
var timerElement = document.getElementById("timer");
var donePageElement;
var currentQuestionElement;
var currentQuestionIndex;
var timeLeft = 0;
var timeInterval; // I need to define the timeInterval here so I can stop it when the user answers all the Questions

const maxTime = 75;

/*
 *  Defines the behaviour of the quiz when an answer button is clicked.
 * 
 *  When the answer button is clicked we need to:
 *      1. Determine if its the correct answer.
 *      2. If it is not the correct answer, we remove 10 seconds from the timer/score and update the timer.
 *      3. We display whether it was correct in a box below the Question.
 *      4. Stop all answer buttons from being clicked.
 *      5. Wait a little bit so the user can see if they were correct or not.
 *      6. Then go to the next Question, if there is one.
 */
function answerButtonOnClick(event) {
    var buttonPressed = event.target;

    /* 1. Determine if its the correct answer. */
    var correct = checkIfCorrect(buttonPressed);
    
    /* 2. If it is not the correct answer, we remove 10 seconds from the timer/score and update it. */
    if (!correct) {
        timeLeft = timeLeft - 10;
        setTimerText();
    }

    /* 3. We display whether it was correct in a box below the Question. */
    displayCorrectness(correct);

    /* 4. Stop all answer buttons from being clicked. */
    removeAnswerButtonListeners();
    
    /* 
     *  5. Wait a little bit so the user can see if they were correct or not. 
     *
     *  Specifically, we wait about a second.
     */
    var timeInterval = setInterval(function () {
        clearInterval(timeInterval);

        /* 6. Then go to the next Question, if there is one. */
        nextQuestion();
    }, 900);
}

/* 
 *  Checks if the answer is correct when given the answer button HTML Element.
 *  Returns true if it is correct, or false if it is not.
 */
function checkIfCorrect(answerButtonElement) {
    var correct = answerButtonElement.getAttribute("correct");

    return correct === "true";
}

/* Clears the area below the header of content, whatever that content is. */
function clearMainContent() {
    mainElement.firstElementChild.remove();
}

/* 
 *  Creates and sets the done page HTML element.
 *
 *  The following steps must be taken to create the done page:
 *      1. Create a section element representing the content of the section.
 *      2. Create a header element saying "All done!", add it as a child of the section element.
 *      3. Create a text element displaying the users score.
 *      4. Create a span element where we can alter the users score, add it as a child to the text element.
 *      5. Add the text element as child of the section element.
 *      6. Create a form element, create and add child label, input, and submit button elements to it.
 *      7. Create a text input element, add it to the section element.
 *      8. Create a submit button, add it to the section element.
 *      9. Set our global reference to the done page equal to the section element.
 */
function createDonePage() {
    console.log("Creating the done page.");

    /* 1. Create a section element representing the content of the section. */
    var sectionToCreate = document.createElement("section");
    sectionToCreate.className = "done-section";

    /* 2. Create a header element saying "All done!", add it as a child of the section element. */
    var headerToAdd = document.createElement("h3");
    headerToAdd.className = "done-section-header";
    headerToAdd.textContent = "All done!";
    sectionToCreate.appendChild(headerToAdd);

    /* 3. Create a text element displaying the users score. */
    var textToAdd = document.createElement("p");
    textToAdd.className = "score-text";
    textToAdd.textContent = "Your score is ";

    /* 4. Create a span element where we can alter the users score, add it as a child to the text element. */
    var spanToAdd = document.createElement("span");
    spanToAdd.id = "score";
    textToAdd.appendChild(spanToAdd);

    /* 5. Add the text element as child of the section element. */
    sectionToCreate.appendChild(textToAdd);

    /* 6. Create a form element, create and add child label, input, and submit button elements to it. */

    console.log(sectionToCreate);
}

/* 
 *  Displays a box below the answer choices. If the user chose the correct answer, it displays "Correct!". Otherwise, it displays "Wrong"!
 *
 *  answer: a boolean value. if true, the user chose the correct answer. if false, they chose wrong.
 */
function displayCorrectness(answer) {
    pElementToAdd = document.createElement("p");
    pElementToAdd.className = "correctness";
    
    if (answer) {
        pElementToAdd.textContent = "Correct!";
    } else {
        pElementToAdd.textContent = "Wrong!";
    }

    var questionSectionElement = document.querySelector(".question-section");
    questionSectionElement.appendChild(pElementToAdd);
}

/*
 *  Initializes some content before the game is played.
 *  Specifically, I'm going to create all of the code quiz screen HTML elements before the game starts so it's quick and easy to load.
 *  Additionally, I need to grab any highscores that are saved locally, and, if there are none, create an entry.
 */
function initializeContent() {
    console.log("Initializing Content");

    createDonePage();
}

/* Loads a question into the content window below the header. */
function loadQuestion(q) {
    currentQuestionElement = q.element;
    mainElement.appendChild(currentQuestionElement);
}

/* 
 *  The logic of proceeding to the next question will go here.
 *  The steps we need to take to proceed to the next question:
 *      1. Clear the main content window.
 *      2. Check if we are at the end of the quiz. If so end the quiz and proceed to the display score screen.
 *      3. Otherwise, load the next question.
 */
function nextQuestion() {
    /* 1. Clear the main content window. */
    clearMainContent();

    /* 2. Check if we are at the end of the quiz. If so, end the quiz and proceed to the highscore screen */
    currentQuestionIndex++;

    if (currentQuestionIndex === quizQuestions.length) {
        stopQuiz();
    } 
    /* 3. Otherwise, load the next question. */
    else {
        loadQuestion(quizQuestions[currentQuestionIndex]);
    }
}

/* 
 *  Removes all the eventListeners from the current questionElement. This is necessary so that the user doesn't click an answer in the seconds after
 *  the application displays whether they were correct or not and before the page displays the next question.
 */
function removeAnswerButtonListeners() {
    answerButtonElements = document.querySelectorAll(".answer-button");

    for (var i = 0; i < answerButtonElements.length; i++) {
        answerButtonElements[i].removeEventListener("click", answerButtonOnClick);
    }
}

/* Sets the text in the timer box equal to the current value of timeLeft. */
function setTimerText() {
    timerElement.textContent = timeLeft;
}

/* The logic of starting the timer goes here here. */
function startTimer() {
    timeLeft = maxTime;
    setTimerText();

    timeInterval = setInterval(function () {
        timeLeft--;
        setTimerText();

        /*  If the time remaining is 0, let's stop the timer and stop the quiz. */
        if (timeLeft === 0) {
            stopQuiz();
        }
    }, 1000);
}

/* The logic of starting the quiz will go here. */
function startQuiz() {
    currentQuestionIndex = 0;

    clearMainContent();
    loadQuestion(quizQuestions[currentQuestionIndex]);
    startTimer();
}

/* 
 *  Defines the logic for stopping the quiz.
 *
 *  When we stop the quiz we must:
 *  1. Stop the timer.
 *  2. Load the done page.
 */
function stopQuiz() {
    /* 1. Stop the timer. */
    clearInterval(timeInterval);
    console.log("QUIZ STOPPED");

    /* 2. Load the done page. */
}

startQuizButtonElement.addEventListener("click", function() {
    startQuiz();
});

initializeContent();
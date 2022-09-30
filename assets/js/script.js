/*
 *  This is going to be our object that represents a single question in this quiz.
 *
 *  question:       A string representing the text of the question.
 *  answers:        An array of strings representing possible answers.
 *  correctAnswer:  A number representing the index of the correct answer in the array of possible answers.
 */
class Question {
    constructor(question, answers, correctAnswer) {
        this.question = question;
        this.answers = answers;
        this.correctAnswer = correctAnswer;
    }

    /*
     *  Returns the HTML representation of this question.
     *
     *  The HTML returned will be of the format:
     *  <div class="question-div">
     *      <section class="question-section">
     *          <h3 class="question-prompt">this.question</h3>
     *          <button class="answer-button" id="answer-button-0">this.answers[0]</button>
     *          <button class="answer-button" id="answer-button-1">this.answers[1]</button>
     *          <button class="answer-button" id="answer-button-2">this.answers[2]</button>
     *          <button class="answer-button" id="answer-button-3">this.answers[3]</button>
     *      </section>
     *  </div>
     */
    parseHTML() {
        var divToAdd = document.createElement("div");
        divToAdd.className = "question-div";

        var questionSection = document.createElement("section");
        questionSection.className = "question-section";

        divToAdd.appendChild(questionSection);
    
        var questionPrompt = document.createElement("h3");
        questionPrompt.className = "question-prompt";
        questionPrompt.textContent = this.question;

        questionSection.appendChild(questionPrompt);

        for (var i = 0; i < this.answers.length; i++) {
            var buttonToAdd = document.createElement("button");
            buttonToAdd.className = "answer-button";
            buttonToAdd.id = "answer-button-" + i;
            buttonToAdd.textContent = (i + 1) + ". " + this.answers[i];

            questionSection.appendChild(buttonToAdd);
        }

        return divToAdd;
    }
}

/* The list of Questions for our Quiz */
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

const maxTime = 75;

var timeLeft = 0;
var currentQuestion;

/* Clears the area below the header of content, whatever that content is. */
function clearMainContent() {
    mainElement.firstElementChild.remove();
}

/* Loads a question into the content window below the header. */
function loadQuestion(q) {
    mainElement.appendChild(q.parseHTML());
}

/* The logic of proceeding to the next question will go here. */
function nextQuestion() {
    
}

/* Sets the text in the timer box equal to the current value of timeLeft. */
function setTimerText() {
    timerElement.textContent = timeLeft;
}

/* The logic of starting the timer goes here here. */
function startTimer() {
    timeLeft = maxTime;
    setTimerText();

    var timeInterval = setInterval(function () {
        timeLeft--;
        setTimerText();

        /*  If the time remaining is 0, let's stop the timer and stop the quiz. */
        if (timeLeft === 0) {
            clearInterval(timeInterval);
            stopQuiz();
        }
    }, 1000);
}

/* The logic of starting the quiz will go here. */
function startQuiz() {
    currentQuestion = 0;

    clearMainContent();
    loadQuestion(quizQuestions[currentQuestion]);
    startTimer();
}

/* Defines the logic for stopping the quiz. */
function stopQuiz() {

}

startQuizButtonElement.addEventListener("click", function() {
    startQuiz();
});
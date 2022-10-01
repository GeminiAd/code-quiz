/*
 *  This is going to be our object that represents a single question in this quiz.
 *
 *  question:           A string representing the text of the question.
 *  answers:            An array of strings representing possible answers.
 *  correctAnswerIndex: A number representing the index of the correct answer in the array of possible answers.
 */
class Question {
    constructor(question, answers, correctAnswerIndex) {
        this.question = question;
        this.answers = answers;
        this.correctAnswerIndex = correctAnswerIndex;
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
     * 
     *  NOTE: I'm wrapping the question content in a div element only so that I can display the question
     *  prompt such that it's aligned to the left of the content window at 20% width.
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

            buttonToAdd.addEventListener("click", answerButtonOnClick);

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
var currentQuestionElement;

const maxTime = 75;

var timeLeft = 0;
var currentQuestion;

/*
 *  Defines the behaviour of the quiz when an answer button is clicked.
 *  I'm defining it here instead of in the function parseHTML() is parseHTML() is getting too busy.
 *  Also note I need the event to get the button that was clicked.
 */
function answerButtonOnClick(event) {
    var buttonPressed = event.target;

    var correct = checkIfCorrect(buttonPressed.id, quizQuestions[currentQuestion]);
    
    /* If the answer was incorrect, we remove 10 seconds from timeLeft and update it. */
    if (!correct) {
        timeLeft = timeLeft - 10;
        setTimerText();
    }

    displayCorrectness(correct);
    removeAnswerButtonListeners();
    
    /* Wait about a half-second before moving on to the next page */
    var timeInterval = setInterval(function () {
        clearInterval(timeInterval);
        nextQuestion();
    }, 500);
}

/* 
 *  Checks if the answer is correct when given the id of the button that was pressed and the question it is from.
 *  Returns true if it is correct, or false if it is not.
 */
function checkIfCorrect(answerId, question) {
    answerButtonPressedIndex = parseInt(answerId[answerId.length - 1]);
    var correctIndex = question.correctAnswerIndex;

    return (correctIndex === answerButtonPressedIndex);
}

/* Clears the area below the header of content, whatever that content is. */
function clearMainContent() {
    mainElement.firstElementChild.remove();
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

    questionSectionElement = document.querySelector(".question-section");
    questionSectionElement.appendChild(pElementToAdd);
}

/* Loads a question into the content window below the header. */
function loadQuestion(q) {
    currentQuestionElement = q.parseHTML()
    mainElement.appendChild(currentQuestionElement);
}

/* The logic of proceeding to the next question will go here. */
function nextQuestion() {
    console.log("CLEAR PAGE");
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
/*
 *  This is our object representing a highscore.
 *
 *  initials:   A string representing the initials of the user with the highscore.
 *  score:      A number representing the score.
 */
class Highscore {
    constructor(initials, score) {
        this.initials = initials;
        this.score = score;
    }

    /* 
     *  This is the function that we will use to sort each highscore in the highscores array.
     *  NOTE:   This function is static as isn't a property of each individual highscore object, but
     *          still related to how a Highscore operates.
     *
     *  inputs:
     *      1. A Highscore Object a
     *      2. A Highscore Object b
     * 
     *  The compare function supplied to the array function sort must return a value greater than 0 if a is to be placed after b.
     *  We want a to b placed after b if a < b, so this function must return:
     *      1. 0 if the two values are equal.
     *      2. -1 if a > b.
     *      3. 1 if a < b.
     */
    static sort(a, b) {
        if (a.score === b.score) {
            return 0;
        } else if (a.score > b.score) {
            return -1;
        } else {
            return 1;
        }
    }
}

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
     *  <section id="question-section" class="content-section">
     *      <h3 class="question-prompt">this.question</h3>
     *      <button class="answer-button" id="answer-button-0">this.answers[0]</button>
     *      <button class="answer-button" id="answer-button-1">this.answers[1]</button>
     *      <button class="answer-button" id="answer-button-2">this.answers[2]</button>
     *      <button class="answer-button" id="answer-button-3">this.answers[3]</button>
     *  </section>
     */
    createElement() {
        var questionSection = document.createElement("section");
        questionSection.id = "question-section";
        questionSection.className = "content-section";
    
        var questionPrompt = document.createElement("h3");
        questionPrompt.className = "question-prompt";
        questionPrompt.textContent = this.question;

        questionSection.appendChild(questionPrompt);

        for (var i = 0; i < this.answers.length; i++) {
            var buttonToAdd = document.createElement("button");
            buttonToAdd.className = "round answer-button";
            buttonToAdd.id = "answer-button-" + i;

            if (i === this.correctAnswerIndex) {
                buttonToAdd.setAttribute("correct", true);
            } else {
                buttonToAdd.setAttribute("correct", false);
            }

            buttonToAdd.textContent = (i + 1) + ". " + this.answers[i];

            //buttonToAdd.addEventListener("click", answerButtonOnClick);

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
        3),
    new Question(
        "JavaScript is an example of a ________-typed programming language.",
        ["objectively", "dynamically", "relatively", "statically"],
        1)
];

const maxTime = 75;

var bodyElement;
var mainElement;
var splashPageElement;
var startQuizButtonElement;
var timerElement;
var donePageElement;
var headerElement, highscoresLinkElement, timeLeftElement;
var currentQuestionIndex;
var finalScore;
var timeLeft = 0;
var timeInterval; // I need to define the timeInterval here so I can stop it when the user answers all the Questions

/*
 *  The highscores will be stored as an array of Highscore Objects.
 *  Note: This will have to be sorted every time a Highscore Object is added to it.
 */
var highscores;

/* 
 *  Adds answer button clicks to all the answer buttons on the Question page.
 *  This is only necessary because I remove the click events after the user clicks an answer button:
 *  Otherwise, I would just add the click events when the done page is created.
 */
function addAnswerButtonClickEvents() {
    answerButtonElements = document.querySelectorAll(".answer-button");

    for (var i = 0; i < answerButtonElements.length; i++) {
        answerButtonElements[i].addEventListener("click", answerButtonOnClick);
    }
}

/*
 *  Adds a highscore to our list of highscores
 *
 *  When we add a new highscore we need to:
 *      1. Add it to our list of highscores.
 *      2. Sort the list of highscores, so the highest score is at the top.
 *      3. Write the list of highscores to local storage
 */
function addHighscore(highscore) {
    /* 1. Add it to our list of highscores. */
    highscores.push(highscore);

    /* 2. Sort the list of highscores, so the highest score is at the top. */
    if (highscores.length > 1) {
        highscores.sort(Highscore.sort);
    }

    /* 3. Write the list of highscores to local storage */
    writeHighscores();
}

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
     *  Specifically, we wait about a half a second.
     */
    var timeInterval = setInterval(function () {
        clearInterval(timeInterval);

        /* 6. Then go to the next Question, if there is one. */
        nextQuestion();
    }, 500);
}

/* 
 *  Checks if the answer is correct when given the answer button HTML Element.
 *  Returns true if it is correct, or false if it is not.
 */
function checkIfCorrect(answerButtonElement) {
    var correct = answerButtonElement.getAttribute("correct");

    return correct === "true";
}

/* 
 *  Checks the given string input, and make sure it is a valid initials submission.
 *  Specifically, the initials input should be of length two, and each character should either be a capital letter or lowercase letter.
 *  Returns true if this is valid input, false otherwise.
 */
function checkInitialsInput(input) {
    var upperCaseCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var lowerCaseCharacters = "abcdefghijklmnopqrstuvwxyz";
    var validCharacters = upperCaseCharacters + lowerCaseCharacters;

    if (input.length !== 2) {
        return false;
    } else {
        for (var i = 0; i < input.length; i++) {
            if (!validCharacters.charAt(input[i])) {
                return false;
            }
        }

        return true;
    }
}

/* Clears the area below the header of content, whatever that content is. */
function clearMainContent() {
    mainElement.firstElementChild.remove();
}

/* Clears the error text below the initials submission form. */
function clearErrorText() {
    var errorTextElement = document.querySelector(".submission-error-text");
    errorTextElement.textContent = "";
}

/* 
 *  Creates and sets the done page HTML element.
 *  Since this page is fairly static, I'm creating it once, when the application starts.
 *
 *  The following steps must be taken to create the done page:
 *      1. Create a section element representing the content of the section.
 *      2. Create a header element saying "All done!", add it as a child of the section element.
 *      3. Create a text element displaying the users score.
 *      4. Create a span element where we can alter the users score, add it as a child to the text element.
 *      5. Add the text element as child of the section element.
 *      6. Create a form element, create and add child label, input, and submit button elements to it.
 *      7. Add the form element as a child of the section element.
 *      8. Set our global reference to the done page equal to the section element.
 */
function createDonePage() {
    
    /* 1. Create a section element representing the content of the section. */
    var sectionToCreate = document.createElement("section");
    sectionToCreate.id = "done-section";
    sectionToCreate.className = "content-section";

    /* 2. Create a header element saying "All done!", add it as a child of the section element. */
    var headerToAdd = document.createElement("h3");
    headerToAdd.className = "done-section-header";
    headerToAdd.textContent = "All done!";
    sectionToCreate.appendChild(headerToAdd);

    /* 3. Create a text element displaying the users score. */
    var textToAdd = document.createElement("p");
    textToAdd.className = "score-text";
    textToAdd.textContent = "Your final score is: ";

    /* 4. Create a span element where we can alter the users score, add it as a child to the text element. */
    var spanToAdd = document.createElement("span");
    spanToAdd.id = "score";
    textToAdd.appendChild(spanToAdd);

    /* 5. Add the text element as child of the section element. */
    sectionToCreate.appendChild(textToAdd);

    /* 6. Create a form element, create and add child label, input, and submit button elements to it. */
    var formElementToAdd = document.createElement("form");
    formElementToAdd.className = "submit-initials-form";

    var labelToAdd = document.createElement("label");
    labelToAdd.className = "submit-initials-label";
    labelToAdd.textContent = "Enter your initials: ";
    labelToAdd.setAttribute("for", "initials");

    formElementToAdd.appendChild(labelToAdd);

    var inputToAdd = document.createElement("input");
    inputToAdd.setAttribute("type", "text");
    inputToAdd.id = "initials";
    inputToAdd.setAttribute("name", "initials");
    inputToAdd.setAttribute("minlength", "2");
    inputToAdd.setAttribute("maxlength", "2");
    inputToAdd.setAttribute("size", "10");
    inputToAdd.required = true;

    formElementToAdd.appendChild(inputToAdd);

    var buttonToAdd = document.createElement("input");
    buttonToAdd.id = "submit-initials-button";
    buttonToAdd.className = "round";
    buttonToAdd.setAttribute("type", "submit");
    buttonToAdd.setAttribute("value", "Submit");
    buttonToAdd.addEventListener("click", submitInitialsButtonClick);

    formElementToAdd.appendChild(buttonToAdd);

    /* 7. Add the form element as a child of the section element. */
    sectionToCreate.appendChild(formElementToAdd);

    /* Create a little section for text to display if there is an error with the initials submission and add as child to the section. */
    var errorTextToAdd = document.createElement("p");
    errorTextToAdd.className = "submission-error-text";

    sectionToCreate.appendChild(errorTextToAdd);

    /* 8. Set our global reference to the done page equal to the section element. */
    donePageElement = sectionToCreate;
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

    var questionSectionElement = document.getElementById("question-section");
    questionSectionElement.appendChild(pElementToAdd);
}

/* Displays a some text below the input box indicating there was an error with the initials submission. */
function displaySubmissionErrorText() {
    var errorTextElement = document.querySelector(".submission-error-text");
    errorTextElement.textContent = "Error: initials must be two characters chosen from uppercase or lowercase characters.";
}

/*
 *  Displays our list of Highscores for this Quiz.
 *  
 *  To display the Highscores Page we need to:
 *      1. Remove the elements from the header.
 *      2. Clear the main content window.
 *      3. Generate the HTML element for the Highscores page.
 *      4. Load the highscores page element into the content window.
 */
function displayHighscoresPage() {
    /* 1. Remove the elements from the header. */
    removeHeaderElements();

    /* 2. Clear the main content window. */
    clearMainContent();

    /* 3. Generate the HTML element for the Highscores page. */
    var highscoresContentElement = generateHighscoresPage();

    /* 4. Load the highscores page element into the content window. */
    loadContent(highscoresContentElement);
}

/*
 *  Generates and returns the Highscores Page.
 *  Since we will be adding to the Highscores page when the user submits a new Highscore, the Highscores page will be generated each time the
 *  user goes to it.
 * 
 *  Steps to generate the Highscores Page:
 *      1. Create the Highscores section element to be added to the page.
 *      2. Create the Highscores header element, add it as a child of the section element.
 *      3. Create an ordered list element.
 *      4. For each entry in our highscores list
 *          4. a. Create an li element, add it as a child of the ordered list element.
 *      5. Add the ordered list element as a child to the section element.
 *      6. Create a button to go back, add it as a child element of the section element.
 *      7. Create a button to clear the highscores, add it as a child element of the section element.
 *      8. Return the section element.
 */
function generateHighscoresPage() {
    var highscoresSectionElement = document.createElement("section");
    highscoresSectionElement.id = "highscores-section";
    highscoresSectionElement.className = "content-section";

    /* 2. Create the Highscores header element, add it as a child of the section element. */
    var headerElementToAdd = document.createElement("h2");
    headerElementToAdd.className = "highscores-header";
    headerElementToAdd.textContent = "Highscores";

    highscoresSectionElement.appendChild(headerElementToAdd);

    /* 3. Create an ordered list element. */
    var listToAdd = document.createElement("ol");
    listToAdd.className = "highscores-list";

    /* 4. For each entry in our highscores list. */
    for (var i = 0; i < highscores.length; i++) {
        /*  4. a. Create an li element, add it as a child of the ordered list element. */
        var listItemToAdd = document.createElement("li");
        listItemToAdd.className = "highscore";
        listItemToAdd.textContent = (i + 1) + ". " + highscores[i].initials + " - " + highscores[i].score;

        listToAdd.appendChild(listItemToAdd);
    }

    /* 5. Add the ordered list element as a child to the section element. */
    highscoresSectionElement.appendChild(listToAdd);

    /* 6. Create a button to go back, add it as a child element of the section element. */
    var goBackButtonToAdd = document.createElement("button");
    goBackButtonToAdd.className = "round go-back-button";
    goBackButtonToAdd.textContent = "Go Back";
    goBackButtonToAdd.addEventListener("click", restoreSplashPage);

    highscoresSectionElement.appendChild(goBackButtonToAdd);

    /* 7. Create a button to clear the highscores, add it as a child element of the section element. */
    clearHighscoresButtonToAdd = document.createElement("button");
    clearHighscoresButtonToAdd.className = "round clear-highscores";
    clearHighscoresButtonToAdd.textContent = "Clear Highscores"
    clearHighscoresButtonToAdd.addEventListener("click", resetHighscores);

    highscoresSectionElement.appendChild(clearHighscoresButtonToAdd);

    /* 8. Return the section element. */
    return highscoresSectionElement;
}

/*
 *  Initializes some content before the game is played.
 *  Specifically, I'm going to create all of the code quiz screen HTML elements before the game starts so it's quick and easy to load.
 *  Additionally, I need to load any highscores, if they exist.
 *  Finally, I need to set the headerElement, highscoresLink and timeLeft elements so I can easily remove the highScoresLink and timeLeft elements
 *  from the headerElement later.
 */
function initializeContent() {
    bodyElement = document.querySelector("body");
    mainElement = document.querySelector("main");
    splashPageElement = document.getElementById("splash-page");
    startQuizButtonElement = document.getElementById("start-quiz-button");
    timerElement = document.getElementById("timer");
    headerElement = document.querySelector("header");
    highscoresLinkElement = document.getElementById("highscores-button");
    timeLeftElement = document.getElementById("time-left");
    var highscoresButton = document.getElementById("highscores-button");

    createDonePage();

    loadHighscores();

    startQuizButtonElement.addEventListener("click", startQuiz);
    highscoresButton.addEventListener("click", displayHighscoresPage);
}

/* Loads the given HTML element into the main content window below the header. */
function loadContent(element) {
    mainElement.appendChild(element);
}

function loadHighscores() {
    var stringifiedHighscores = localStorage.getItem("highscores");

    /* If localStorage.getItem("highscores") returns null means there is no entry and we have to create it. */
    if (!stringifiedHighscores) {
        highscores = [];
        writeHighscores();
    } else {
        highscores = JSON.parse(stringifiedHighscores);
    }
}

/* Loads the given question object into the main content window. */
function loadQuestion(question) {
    currentQuestionElement = question.element;
    loadContent(currentQuestionElement);

    addAnswerButtonClickEvents();
}

/* 
 *  The logic of proceeding to the next question will go here.
 *  The steps we need to take to proceed to the next question:
 *      1. Check if we are at the end of the quiz. If so end the quiz and proceed to the display score screen.
 *      2. Otherwise, clear the main content window and load the next question.
 */
function nextQuestion() {
    /* 1. Check if we are at the end of the quiz. If so, end the quiz and proceed to the done page. */
    currentQuestionIndex++;

    removeCorrectness();

    if (currentQuestionIndex === quizQuestions.length) {
        stopQuiz();
    } 
    /* 2. Otherwise, clear the main content window and load the next question. */
    else {
        clearMainContent();
        loadQuestion(quizQuestions[currentQuestionIndex]);
    }
}

/* Does the same thing as displayHighscores, except it doesn't remove the header. 
function refreshHighscoresContent() {
    clearMainContent();

    var highscoresContentElement = generateHighscoresPage();

    loadContent(highscoresContentElement);
} */

/* 
 *  Removes all the eventListeners from the answer buttons on the page. This is necessary so that the user doesn't click an answer in the seconds after
 *  the application displays whether they were correct or not and before the page displays the next question.
 */
function removeAnswerButtonListeners() {
    answerButtonElements = document.querySelectorAll(".answer-button");

    for (var i = 0; i < answerButtonElements.length; i++) {
        answerButtonElements[i].removeEventListener("click", answerButtonOnClick);
    }
}

/* 
 *  Removes the correctness display from the current question. This is needed so that the next time the quiz is started, it doesnt show
 *  Correct! or Wrong! from the previous attempt.
 */
function removeCorrectness() {
    var correctnessElement = document.querySelector(".correctness");
    correctnessElement.remove();
}

/* Removes the link to the highscores page and the timer element from the header */
function removeHeaderElements() {
    highscoresLinkElement.remove();
    timeLeftElement.remove();
}

/* 
 *  Resets the list of highscores.
 *  In order to reset the highscores list we have to:
 *      1. Set our list of highscores equal to an empty array.
 *      2. Reload the highscores page so the page reflects the reset.
 *      3. Write the new highscores list.
 */
function resetHighscores() {
    /* To save us some work, we'll only do this if there is information to reset. */
    if (highscores.length > 0) {
        /* 1. Set our list of highscores equal to an empty array. */
        highscores = [];

        /* 2. Reload the highscores page so the page reflects the reset. */
        displayHighscoresPage();

        /* 3. Write the new highscores list. */
        writeHighscores();
    }
}

/* Restores the elements in the header. */
function restoreHeader() {
    headerElement.appendChild(highscoresLinkElement);
    headerElement.appendChild(timeLeftElement);
}


/* 
 *  Goes back to the main page from the highscores screen.
 *  To restore the splash page we must:
 *      1. Clear the main content window.
 *      2. Restore the header.
 *      3. Load the splash page into the main content window.
 */
function restoreSplashPage() {
    /* 1. Clear the main content window. */
    clearMainContent();

    /* 2. Restore the header. */
    restoreHeader();

    /* 3. Load the splash page into the main content window. */
    loadContent(splashPageElement);
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
 *  2. Clear the main content window.
 *  3. Load the done page.
 *  4. Set the final score equal to time left, as all displaying of the final score will be done with this variable.
 *  5. Update the user score on the done page.
 */
function stopQuiz() {
    /* 1. Stop the timer. */
    clearInterval(timeInterval);

    /* 2. Clear the main content window. */
    clearMainContent();

    /* 3. Load the done page. */
    loadContent(donePageElement);

    /* 4. Set the final score equal to time left, as all displaying of the final score will be done with this variable. */
    finalScore = timeLeft;

    /* 5. Update the user score on the done page. */
    updateScore();
}

/* 
 *  When the submit initials button is clicked, we need to:
 *      1. Grab the input initials from the text input
 *      2. Add a new Highscores Object to our highscores list with the input initials and final score.
 *      3. Display the Highscores Page.
 */
function submitInitialsButtonClick(event) {
    event.preventDefault(); // Stops page refresh on click

    /* 1. Grab the input initials from the text input */
    var textInputElement = document.getElementById("initials");
    var initialsToAdd = textInputElement.value;

    var valid = checkInitialsInput(initialsToAdd);

    if (valid) {
        clearErrorText();

        /* 2. Add a new Highscores Object to our highscores list with the input initials and final score. */
        addHighscore(new Highscore(initialsToAdd, finalScore));

        /* 3. Display the Highscores Page. */
        displayHighscoresPage();
    } else {
        displaySubmissionErrorText();
    }
}

/* Updates the user score in the done page when the user finishes the game. */
function updateScore() {
    var scoreTextElement = document.getElementById("score");
    scoreTextElement.textContent = finalScore;
}

/* Writes our list of highscores to local storage. */
function writeHighscores() {
    var stringifiedHighscores = JSON.stringify(highscores);
    localStorage.setItem("highscores", stringifiedHighscores);
}

initializeContent();
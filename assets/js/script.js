/*
 *  This is going to be our object that represents a single question in this quiz.
 *
 *  question:       A string representing the text of the question
 *  answers:        An array of strings representing possible answers
 *  correctAnswer:  A number representing the index of the correct answer in the array of possible answers
 */
class Question {
    constructor(question, answers, correctAnswer) {
        this.question = question;
        this.answers = answers;
        this.correctAnswer = correctAnswer;
    }

    /*
     *  Returns the HTML representation of this question
     */
    parseHTML() {
        var divToAdd = document.createElement("div");

        var questionSection = document.createElement("section");
        questionSection.className = "question-section";
        //console.log(questionSection);

        divToAdd.appendChild(questionSection);
    
        var questionPrompt = document.createElement("h3");
        questionPrompt.className = "question-prompt";
        questionPrompt.textContent = this.question;
        //console.log(questionPrompt);

        questionSection.appendChild(questionPrompt);
        //console.log(questionSection);

        for (var i = 0; i < this.answers.length; i++) {
            var buttonToAdd = document.createElement("button");
            buttonToAdd.className = "answer-button";
            buttonToAdd.id = "answer-button-" + i;
            buttonToAdd.textContent = (i + 1) + ". " + this.answers[i];
            //console.log(buttonToAdd);

            questionSection.appendChild(buttonToAdd);
        }

        console.log(divToAdd);

        return divToAdd;
    }
}

/* The logic of starting the quiz will go here. */
function startQuiz() {
    main.remove();

    var toAdd = q1.parseHTML();
    body.appendChild(toAdd);
}

/* The logic of proceeding to the next question will go here. */
function nextQuestion() {
    
}

const q1 = new Question(
    "Which of the following IS NOT a primitive data type in JavaScript?",
    ["string", "boolean", "class", "number"],
    2
)

console.log(q1);

var main = document.querySelector("main");
var body = document.querySelector("body");
var startQuizButton = document.getElementById("start-quiz-button");

console.log(main);
console.log(body);
console.log(startQuizButton);

startQuizButton.addEventListener("click", function() {
    startQuiz();
});
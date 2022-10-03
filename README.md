# Code Quiz

<https://geminiad.github.io/code-quiz>

------------------------------------------------------

![Code Quiz Demo](./assets/images/code-quiz-demo.gif)

<a href="#description">Description</a> •
<a href="#key-features">Key Features</a> •
<a href="#usage">Usage</a> •
<a href="#languages-used">Languages Used</a> •
<a href="#concepts-demonstrated">Concepts Demonstrated</a> •
<a href="#credits">Credits</a> •
<a href="#author">Author</a>

## Description

This is just a code quiz application that I wrote using JavaScript, HTML, and CSS. See <a href="#usage">Usage</a> for a description of how the quiz works. I decided that a 10 Questions for this quiz is sufficient: it's a nice round number, long enough that its a substantial quiz, but short enough that the gif demo isn't going to take too long. In this application, each question is displayed separately, one for each page. I had to use JavaScript to implement adding, editing, and removing HTML elements dynamically using the DOM. I had to use JavaScript events for all of the user interactivity, I had to use the JavaScript function setInterval() to implement the timer, and I had to use the JavaScript interface localStorage to implement reading and writing to the user's local storage. The application was styled - that is, all of the text sizes and indenting and color - using CSS. I also used CSS media queries to make the site look good on mobile phones.

## Key Features

- Test your JavaScript coding knowledge.
- Boasts a responsive design: this quiz looks good on a desktop, tablet, or mobile device. I encourage you to view this site on a desktop, tablet, and mobile phone. The desktop and tablet displays aren't that much different, but the mobile display is different. Check it out on your mobile phone!

## Usage

Navigate to: <https://geminiad.github.io/code-quiz>

Click the start button to start the timed quiz. You have 75 seconds and each question is multiple choice. There are 10 questions total. Click each answer button to submit your answer, but be aware that wrong answers subtract 10 seconds from your time. Once you reach the end, your score is the amount of time that you have left. At that point, you submit your initials, and you are taken to a page that displays all of the highscores recorded on your device. Note that the initials submitted must be two characters that are selected from uppercase or lowercase letters; if anything else is submitted, the application will complain and not submit the information. Once you reach the highscores page, you have an option to go back to the front page or reset the highscores. You can also reach the highscores page at any time by clicking the "View Highscores" button in the top left corner of the page.

## Languages Used

- HTML
- CSS
- JavaScript

## Concepts Demonstrated

- General HTML/CSS/JavaScript syntax and purpose.
- Setting and stopping JavaScript timers using setInterval().
- Handling JavaScript events.
- Adding and removing HTML elements on demand using the DOM.
- Storing and retrieving data on local storage for persistence between sessions.

## Credits

Manuel Nunes for a mockup of the site and some good quiz question examples that I used.

W3 Schools, for a list of JS Quiz Questions, some of which I repurposed:
https://www.w3schools.com/quiztest/quiztest.asp?qtest=JS

## Author

Adam Ferro
- [Github](https://github.com/GeminiAd)
- [Linked-In](https://www.linkedin.com/in/adam-ferro)
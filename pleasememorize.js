window.addEventListener('DOMContentLoaded', initMemorizer);

testInput = `Na:23
Mg:24
Al:27
K:39
Ca:40
Cu:63.5`

function initMemorizer() {
  //loadQuestions(testInput, ':')

  loadQuestions(localStorage['editfield'], localStorage['textseperator'])
  questionEl = document.getElementById('question');
  answerEl = document.getElementById('answer');
  answerField = document.getElementById('answerfield');
  answerField.addEventListener('keyup', checkAnswer);
}

function checkAnswer(event) {
  //correct answer
  var currentQuestion = questionEl.innerHTML.trim()
  var userAnswer = answerField.value.trim().toLowerCase()
  var correctAnswer = answerEl.innerHTML.trim().toLowerCase()
  answerEl.style.visibility = 'hidden';
  

  //console.log(answerField.style.outline)
  if (userAnswer == correctAnswer) {
    answerField.style.outline = 'solid 2px #35a854';
    console.log(`${currentQuestion}: ${userAnswer} is correct!`)
    nextQuestion();
  }
  
  //request answer
  else if (event.keyCode == 13 && !answerField.style.outline.includes('gold')) {
    answerField.style.outline = 'solid 2px Gold';
    console.log('Answer requested :/')
    answerEl.style.visibility = 'visible';
  }
  
  //skip question
  else if (event.keyCode == 13) { 
    console.log('Skip requested :/')
    answerField.style.outline = '';
    nextQuestion();
  }

  //wrong answer
  else if (userAnswer.length >= correctAnswer.length && userAnswer != correctAnswer) {
    answerField.style.outline = 'solid 2px Tomato';
    console.log(`${currentQuestion}: ${userAnswer}. This seems wrong.`)
  }
  else {
    answerField.style.outline = '';
    console.log("clearing outline")
    
  }

}

function nextQuestion() {
  questionIndex += 1
  if (questionIndex >= questionList.length) {
    questionIndex = 0;
  }
  questionEl.innerHTML = questionList[questionIndex][0];
  answerEl.innerHTML = questionList[questionIndex][1];
  answerField.value = '';
}

function loadQuestions(userInput, kvDelimiter, entryDelimiter = '\n') {
  if (!(userInput || kvDelimiter)){
    userInput = `What does youtu.be/dQw4w9WgXcQ lead to? - The Rickroll
How long does the rickroll last in seconds? - 213
If you're reading this, please press edit and change the questions already! - OK`
    kvDelimiter = '-'
  }
  questionList = [];
  questionIndex = -1;
  for (item of userInput.split(entryDelimiter)) {
    if (item.split(kvDelimiter).length != 2) {
      throw new Error('Invalid input');
    }
    questionList.push(item.split(kvDelimiter))
  }
  console.log(questionList)
}


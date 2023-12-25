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

    var alreadyInIncorrectList = arrayIncludes(incorrectList, [currentQuestion, correctAnswer])
    if (!alreadyInIncorrectList) {
      incorrectList.push([currentQuestion, correctAnswer])
      console.log(`${currentQuestion}: ${userAnswer}. This seems wrong.\nIncorrect List: ${incorrectList.length}`)
    }
  }
    
  else {
    answerField.style.outline = '';
    console.log("clearing outline")
    
  }

}

function nextQuestion() {
  var reviewIncorrectQuestion = ((incorrectList.length != 0) && (Math.random() < (1/3)))
  
  if (reviewIncorrectQuestion) {
    questionEl.innerHTML = `<i>${incorrectList[0][0]}</i>`;
    answerEl.innerHTML = incorrectList[0][1];
    incorrectList.shift() //removes first element
    console.log(`Incorrect List: ${incorrectList.length}`)
  }

  else {
    questionIndex += 1
    //After completing all questions, shuffle and start again
    if (questionIndex >= questionList.length) {
      shuffleQuestions()
      questionIndex = 0;
    }
    questionEl.innerHTML = questionList[questionIndex][0];
    answerEl.innerHTML = questionList[questionIndex][1];
  }

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
  incorrectList = [];
  console.log("Delimiter is " + kvDelimiter)

  //Iterate through each line
  for (item of userInput.split(entryDelimiter)) {

    item = item.trim()

    //skip if its blank or commented
    if (!item || item.startsWith('#')) {
      continue
    }

    //split the items using the delimiter
    var splittedStuff = item.split(kvDelimiter)

    //add it to the list if its splited properly
    if (splittedStuff.length == 2) {
      questionList.push(splittedStuff)
    }
    else {
      //show a warning mesage if not.
      var emsg = `Invalid Input. Unable to split Q/A properly. Some questions may be missing.`
      document.getElementById('errorContent').innerHTML = emsg;
      console.warn(emsg, splittedStuff);
    }
    
  }
  console.log(questionList)
}

function shuffleQuestions() {
  arrayShuffle(questionList)
  console.log("Iteration Complete. Questions shuffled.")
}


function arrayIncludes(arr, target) {
  return arr.some(itemOfArr => 
    Array.isArray(itemOfArr) && 
    Array.isArray(target) && 
    itemOfArr.length === target.length && 
    itemOfArr.every((val, index) => val === target[index])
  );
}

function arrayShuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

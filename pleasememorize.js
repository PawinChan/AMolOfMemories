path  = window.location.pathname.toLowerCase()
if (['', '/', '/index.html'].includes(path)) {
  window.addEventListener('DOMContentLoaded', initMemorizer);
}

else if (['/edit', '/edit/', '/edit/index.html'].includes(path)) {
  window.addEventListener('DOMContentLoaded', initSaver);
}

function initMemorizer() {
  //loadQuestions(testInput, ':')

  loadQuestions(localStorage['editfield'], localStorage['textseperator'])

  if (localStorage['swapByDefault'] == "true") {
    doSwapQA()
    console.log("Swapping Q/A since its enabled by this set.")
  }
  questionEl = document.getElementById('question');
  answerEl = document.getElementById('answer');
  answerField = document.getElementById('answerfield');
  answerField.addEventListener('keyup', checkAnswer);
}


function addToIncorrect(currentQuestion, correctAnswer) {
  var userAnswer = answerField.value.trim().toLowerCase()
  //var alreadyInIncorrectList = arrayIncludes(incorrectList, [currentQuestion, correctAnswer])
  var previouslyIncorrect = (incorrectList.length != 0) && (incorrectList[incorrectList.length - 1][0] == currentQuestion)
  if (/*!alreadyInIncorrectList*/ !previouslyIncorrect) {
    incorrectList.push([currentQuestion, correctAnswer])
    incorrectList.push([currentQuestion, correctAnswer])
    console.log(`${currentQuestion}: ${userAnswer}. This seems to be incorrect`)
  }
}

function prepareChoices() {
  var choices = [answerEl.innerHTML]

  while (choices.length < 4) {
    //get random answer

    let potentialChoice = questionList[randInt(0, questionList.length - 1)][1];

    if (!choices.includes(potentialChoice)) {
      choices.push(potentialChoice)
    }
  }
  arrayShuffle(choices)
  document.getElementById('hint').innerHTML = `<ol>${choices.map(choice => `<li>${choice}</li>`).join('')}</ol>`
  console.log("Choices Prepared.")
}

function checkAnswer(event) {
  //correct answer
  var currentQuestion = questionEl.innerHTML.trim()
  var userAnswer = answerField.value.trim().replaceAll(' ', '').toLowerCase()
  var correctAnswer = answerEl.innerHTML.trim().replaceAll(' ', '').toLowerCase()

  answerEl.style.visibility = 'hidden';
  

  //console.log(answerField.style.outline)
  if (userAnswer == correctAnswer) {
    answerField.style.outline = 'solid 2px #35a854';
    console.log(`${currentQuestion}: ${answerField.value.trim()} is correct!`)
    nextQuestion();
  }
  
  //request answer (ENTER)
  else if (event.keyCode == 13 && !answerField.style.outline.includes('gold')) {
    answerField.style.outline = 'solid 2px Gold';
    console.log('Answer requested :/')
    answerEl.style.visibility = 'visible';
    addToIncorrect(currentQuestion, correctAnswer,);
  }
  
  //skip question
  else if (event.keyCode == 13) { 
    console.log('Skip requested :/')
    answerField.style.outline = '';
    nextQuestion();
  }

  //Get hint (?)
  else if (event.keyCode == 191) {
    console.log('Hint Requested...')
    showChoices();
    setTimeout(() => {answerField.value = '';})
  }
  //wrong answer
  else if (userAnswer.length >= correctAnswer.length && userAnswer != correctAnswer) {
    answerField.style.outline = 'solid 2px Tomato';
    addToIncorrect(currentQuestion, correctAnswer);
  }
    
  else {
    answerField.style.outline = '';
    console.log("clearing outline")
    
  }

}

function nextQuestion() {
  let randomNum = Math.random()
  console.log(randomNum)
  var reviewIncorrectQuestion = ((incorrectList.length != 0) && (randomNum < (1 / 3)))
  
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
  prepareChoices();
  if (localStorage['choicesByDefault'] == "true") {
    showChoices();
  }
  updateProgress(questionIndex, questionList.length)
}

function updateProgress(current, total) { 
  //<progress id="totalProgress" max="100" value="0"></progress>
  document.getElementById('totalProgress').value = (current / total * 100) || 100; 
  
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
      var emsg = `Invalid Input or Seperator: Unable to split Q/A properly. Some questions may be missing.`
      document.getElementById('errorContent').innerHTML = emsg;
      console.warn(emsg, splittedStuff);
    }
    
  }
  console.log(questionList)
  return questionList
}

function loadLsQuestions() {
  return loadQuestions(localStorage['editfield'], localStorage['textseperator'])
}

function shuffleQuestions() {
  console.log("Before shuffle: ", questionList)
  arrayShuffle(questionList)
  console.log("Iteration Complete. Questions shuffled.")
  console.log("After shuffle: ", questionList)
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
  for (let rounds = 0; rounds < array.length * 2; rounds++) {

    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    
  }
}

// edit page

function initSaver() {
  editFieldEl = document.getElementById('editField');
  textSeperatorEl = document.getElementById('textSeperator');
  questionSwapCheckbox = document.getElementById('questionSwapCheckbox');
  showChoicesCheckbox = document.getElementById('showChoicesCheckbox');


  editFieldEl.addEventListener('keyup', saveData);
  textSeperatorEl.addEventListener('change', saveData);
  questionSwapCheckbox.addEventListener('change', saveData);
  showChoicesCheckbox.addEventListener('change', saveData);
  console.log("Autosave Ready.")

  loadData();
}

function saveData() {
  localStorage['editfield'] = editFieldEl.value;
  localStorage['textseperator'] = textSeperatorEl.value;
  localStorage['swapByDefault'] = questionSwapCheckbox.checked;
  localStorage['choicesByDefault'] = showChoicesCheckbox.checked;
  console.debug("Saved.")
  document.getElementById('lastSaved').innerHTML = `Last Saved: ${new Date().toLocaleString('en-UK')}`
}

function loadData() {
  var editFieldValue = localStorage['editfield'];
  var textSeperatorValue = localStorage['textseperator'];
  
  if (!editFieldValue) {
    editFieldValue = `What does youtu.be/dQw4w9WgXcQ lead to? - The Rickroll
How long does the rickroll last in seconds? - 213`
  }

  if (!textSeperatorValue) {
    textSeperatorValue = '-'
  }

  editFieldEl.value = editFieldValue
  textSeperatorEl.value = textSeperatorValue
  questionSwapCheckbox.checked = localStorage['swapByDefault'] == "true";
  showChoicesCheckbox.checked = localStorage['choicesByDefault'] == "true";

  editField.removeAttribute('disabled');
  textSeperatorEl.removeAttribute('disabled');
  questionSwapCheckbox.removeAttribute('disabled');
  showChoicesCheckbox.removeAttribute('disabled');

  console.log("Data Loaded.")
}

function exportQuestions() {
  var dataStr = JSON.stringify(loadLsQuestions(), null, 2);
  var data = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
  var downloadLink = document.createElement('a');
  downloadLink.setAttribute('href', data);
  downloadLink.setAttribute('download', 'memorize.json');
  downloadLink.click();
}

function changeSwapMode() {
  let askQ = document.getElementById('askQ').checked;
  let askA = document.getElementById('askA').checked;

  if (askQ && askA) {
    //TODO, swap periodically
  }
  else if (askQ) {
    loadLsQuestions();
  }
  else if (askA) {
    loadLsQuestions();
    doSwapQA()
  }
  else {
    //TODO, show both
  }

}

function doSwapQA() {
  for (let item of questionList) {
    [item[0], item[1]] = [item[1], item[0]]
  }
  console.log("QA Swapped.")
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function notify(msg, sec = 1) {
  document.getElementById('tempNotice').innerHTML = msg
  setTimeout(() => {document.getElementById('tempNotice').innerHTML = ''}, 1000 * sec)
}

function showChoices() {
  document.getElementById('hint').style.visibility = 'visible';
}
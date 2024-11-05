
// When going through questions, choose some from the ones you answered incorrectly
REVIEW_PROBABILITY = 2 / 3

// You'll need to review the question twice after getting it wrong.
INCORRECT_REPEATS = 2


path = window.location.pathname.toLowerCase()
if (['', '/', '/index.html'].includes(path)) {
  window.addEventListener('DOMContentLoaded', initMemorizer);
}

else if (['/edit', '/edit/', '/edit/index.html'].includes(path)) {
  window.addEventListener('DOMContentLoaded', initSaver);
}


function readLs(key) {
  let string = localStorage[key];
  if (string) {
    try {
      return JSON.parse(string)
    } catch (e) {
      console.warn("JSON Parse Error in readLS", e)
    }
  } else {
    return null
  }
}


function writeLs(key, data) {
  try {
    localStorage[key] = JSON.stringify(data)
  } catch (e) {
    console.warn(`writeLs failed: ` , e)
  }
}

// function getSetData(setName, key) {
function getSetData(key) {
  var setData
  try {
    setData = JSON.parse(localStorage[`setData_default`]) || {}  
  } catch (e) {
    setData =  {}
  }
  return setData[key]
}

function initMemorizer() {
  //loadQuestions(testInput, ':')

  loadQuestionsAuto()
  if (getSetData('questionSwapCheckbox') == true) {
    doSwapQA()
    console.log("Swapping Q/A since its enabled by this set.")
  }
  questionEl = document.getElementById('question');
  answerEl = document.getElementById('answer');
  answerField = document.getElementById('answerfield');
  answerField.addEventListener('keyup', checkAnswer);
}


function addToIncorrect(currentQuestion, correctAnswer) {
  // console.log(currentQuestion, correctAnswer)
  if (currentQuestion == "Welcome! Are you ready?" && correctAnswer == "Yes") {
    console.log("Not adding welcome qustion to incorrect list.")
    return
  }
  var userAnswer = answerField.value.trim().toLowerCase()
  //var alreadyInIncorrectList = arrayIncludes(incorrectList, [currentQuestion, correctAnswer])
  var previouslyIncorrect = (incorrectList.length != 0) && (incorrectList[incorrectList.length - 1][0] == currentQuestion)
  if (/*!alreadyInIncorrectList*/ !previouslyIncorrect) {
    for (let i = 0; i < INCORRECT_REPEATS; i++) {
      incorrectList.push([currentQuestion, correctAnswer])
    }
    console.log(`${currentQuestion}: ${userAnswer}. This seems to be incorrect`)
  }
}

function prepareChoices() {
  var choices = [answerEl.innerHTML]
  var numChoices = Math.min(4, questionList.length)

  while (choices.length < numChoices) {
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
  var currentQuestion = questionEl.textContent.trim()
  //NOTE: .innerTEXT returns '' since the element is hidden and not visible.
  var userAnswer = answerField.value.trim().replaceAll(' ', '').toLowerCase()
  var correctAnswerRaw = answerEl.textContent.trim()
  var correctAnswer = correctAnswerRaw.replaceAll(' ', '').toLowerCase()

  answerEl.style.visibility = 'hidden';
  

  //console.log(answerField.style.outline)
  if (userAnswer == correctAnswer) {
    //console.log(userAnswer, correctAnswer)
    answerField.style.outline = 'solid 2px #35a854';
    console.log(`${currentQuestion}: ${answerField.value.trim()} is correct!`)
    nextQuestion();
  }
  
  //Probably Correct Answer
  //TODO: deal with the*, *s, *es, *y, *ies, 
  
  //request answer (ENTER)
  else if (event.keyCode == 13 && !answerField.style.outline.includes('gold')) {
    answerField.style.outline = 'solid 2px Gold';
    console.log('Answer requested :/')
    answerEl.style.visibility = 'visible';
    addToIncorrect(currentQuestion, correctAnswerRaw);
  }
  
  //skip question
  else if (event.keyCode == 13) { 
    console.log('Skip requested :/')
    answerField.style.outline = '';
    nextQuestion();
  }

  //Get hint (?)
  else if (event.key == '?') {
    console.log('Hint Requested...')
    showChoices();
    setTimeout(() => {answerField.value = '';})
  }
  //Show first letter (_)
  else if (event.key == '_') {

    notify("<b>" + correctAnswer[0] + "</b>" + "_".repeat(correctAnswerRaw.length -1), 2)
    setTimeout(() => {answerField.value = '';})
  }
  // //answer with choice (!)
  // else if (event.keyCode = 49) {

  // }
  //wrong answer
  else if (userAnswer.length >= correctAnswer.length && userAnswer != correctAnswer) {
    answerField.style.outline = 'solid 2px Tomato';
    addToIncorrect(currentQuestion, correctAnswerRaw);
  }
    
  else {
    answerField.style.outline = '';
    console.log("clearing outline")
    
  }

}

function nextQuestion() {
  let randomNum = Math.random()
  console.log(randomNum)
  var reviewIncorrectQuestion = ((incorrectList.length != 0) && (randomNum < REVIEW_PROBABILITY))
  
  setTimeout(() => {answerField.value = '';})
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
  if (getSetData('showChoicesCheckbox') == true) {
    showChoices();
  }
  else {
    document.getElementById('hint').style.visibility = 'hidden';
  }
  updateProgress(questionIndex, questionList.length)
}

function updateProgress(current, total) { 
  //<progress id="totalProgress" max="100" value="0"></progress>
  var progressPercent = (current / total * 100) || 100
  progressEl = document.getElementById('totalProgress')

  progressEl.value = progressPercent; 
  if (progressPercent = 100) {
    // progressEl.
  }
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

function loadQuestionsAuto() {
  urlDataObj = importFromURL()
  if (urlDataObj) {
    return loadQuestions(urlDataObj.editfield, urlDataObj.textseperator)
  }
  return loadQuestions(getSetData('editField'), getSetData('textSeperator'))
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
  elementsToSave = ['setTitle', 'editField', 'textSeperator', 'questionSwapCheckbox', 'showChoicesCheckbox']
  inputEls = {}
  for (let elementId of elementsToSave) {
    let el = document.getElementById(elementId)
    el.addEventListener('change', saveData)
    el.addEventListener('keyup', saveData)
    inputEls[elementId] = el
  }  
  console.log("Autosave Ready.")
  loadData();
}

function saveData() {
  let setData = {}
  for (let el of Object.values(inputEls)) {
    if (el.type == 'checkbox') {
      setData[el.id] = el.checked;
    } else if (el.type == 'text' || el.type == 'textarea' || el.type == 'select-one') {
      setData[el.id] = el.value;
    } else {
      console.error("Unsuppored input type, not text or checkbox: ", el)
    }
  }
  setTitle = setData['setTitle']
  // localStorage[`setData_${setTitle}`] = JSON.stringify(setData)
  localStorage[`setData_default`] = JSON.stringify(setData)
  
  console.debug("Saved.")
  document.getElementById('lastSaved').innerHTML = `Last Saved: ${new Date().toLocaleString('en-UK')}`
}

function loadData() {
  // setData = JSON.parse(localStorage[`setData_${setTitle}`]) || {}
  var setData
  try {
    setData = JSON.parse(localStorage[`setData_default`]) || {}  
  } catch (e) {
    setData =  {}
  }
  for (let el of Object.values(inputEls)) {
    console.log(`Restoring element value for`, el)
    if (el.type == 'checkbox') {
      el.checked = (setData[el.id] == true);
    } else if (el.type == 'text' || el.type == 'textarea' || el.type == 'select-one') {
      el.value = setData[el.id];
    } else {
      console.error("Unsuppored input type, not text or checkbox: ", el)
    }
    el.removeAttribute('disabled');
  }

  console.log("Data Loaded.")
}

/**
 * Retrieves data to be exported in JSON format.
 *
 * This function gathers various pieces of data from localStorage and other sources,
 * compiles them into an object, and then converts that object to a JSON string.
 *
 * @returns {string} A JSON string representation of the data to be exported.
 */
function getDataToExport(minimal=true) { 
  saveData();
  // let dataToExport =  {
  //   'textseperator': localStorage['textseperator'],
  //   'swapByDefault': localStorage['swapByDefault'],
  //   'choicesByDefault': localStorage['choicesByDefault'],
  //   'editfield': localStorage['editfield'],
  // }
  
  if (minimal) {
    return localStorage['setData_default']
  } else {
    let setData = JSON.parse(localStorage['setData_default']);
    setData['aboutThis'] = { 'website': 'https://memorize.pawin.me', 'github': 'https://github.com/PawinChan/AMolOfMemories' }
    return JSON.stringify(setData, null, 2);
  }

  
}


function exportQuestions() {
  var dataStr = getDataToExport(minimal=false)
  var data = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
  // var studySetName = prompt("Enter a name for this set:", "memorize") || "memorize";
  var studySetName = inputEls['setTitle'].value
  var downloadLink = document.createElement('a');
  downloadLink.setAttribute('href', data);
  downloadLink.setAttribute('download', `${studySetName}.memorize.json`);
  downloadLink.click();
}


function getRequestArgs(queryName) {
  var urlParams = new URLSearchParams(window.location.search);
  var result = urlParams.get(queryName);
  return result
}

function importFromURL() {
  var data = getRequestArgs('data');
  var dataType = getRequestArgs('as') || 'lz-string';
  if (!data) {
    console.debug("Data not present in URL. Will assume it's in localStorage.")
    return false;
  }
  try {
    if (dataType == "lz-string") {
      var dataStr = decompressText(data);
      console.log("Assuming URL data is encoded as lz-string")
    }
    else {
      var dataStr = atob(data)
      console.log("Treating URL data as b64")
    }
    var dataObj = JSON.parse(dataStr);
    console.log("Data detected and imported from URL.")
    console.log(dataObj)
    notify("Data detected and imported from URL!", 5)
    return dataObj

  } catch (error) {
    console.warn("Data detected in URL, but unable to import.", error)
    notify(`Data detected in URL, but unable to import: <br> ${error}<br>`, 10)
    return false;
  }
}


function exportToURL() {
  var dataStr = getDataToExport(minimal=true) //Not indenting since it wastes URL space
  console.log(dataStr)
  var data = compressText(dataStr)
  // var studySetName = prompt("Enter a name for this set:", "memorize") || "memorize";
  var studySetName = inputEls['setTitle'].value
  var url = `${window.location.origin}/?name=${studySetName}&data=${data}`
  if (url.length >= 2048) { 
    alert("URL is too long. Please export to files instead.")
    return
  }
  setTimeout(() => {
    try {
      navigator.clipboard.writeText(url)
      setTimeout(() => { alert('URL Copied to Clipboard') })
    } catch (error) {
      console.error("Unable to copy URL to clipboard. ", error)
    }
  })
}

function importQuestions() { 
  var confirmation = confirm("This will overwrite the current questions. Are you sure you want to continue?")
  if (!confirmation) {
    return
  }

  var fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.json';
  fileInput.onchange = function() {
    var file = fileInput.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
      var data = JSON.parse(e.target.result);
      // localStorage['editfield'] = data.editfield;
      // localStorage['textseperator'] = data.textseperator;
      // localStorage['swapByDefault'] = data.swapByDefault;
      // localStorage['choicesByDefault'] = data.choicesByDefault;
      localStorage['setData_default'] = data;
      console.log('Questions Imported.')
      loadData();
    }
    reader.readAsText(file);
  }
  fileInput.click();
}

// function changeSwapMode() {
//   let askQ = document.getElementById('askQ').checked;
//   let askA = document.getElementById('askA').checked;

//   if (askQ && askA) {
//     //TODO, swap periodically
//   }
//   else if (askQ) {
//     loadQuestionsAuto();
//   }
//   else if (askA) {
//     loadQuestionsAuto();
//     doSwapQA()
//   }
//   else {
//     //TODO, show both
//   }

// }

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


// var string = "This is my compression test.";
// alert("Size of sample is: " + string.length);
// var compressed = LZString.compress(string);
// alert("Size of compressed sample is: " + compressed.length);
// string = LZString.decompress(compressed);
// alert("Sample is: " + string);

function compressText(text) {
  console.log("Compressing text...");
  let startTime = performance.now();
  let result = LZString.compressToEncodedURIComponent(text);
  let endTime = performance.now();
  console.log(`Compression Stats: ${text.length} -> ${result.length} (${(result.length/text.length*100).toFixed(2)}% compressed in ${endTime-startTime}ms.)`)
  return result;
}
function decompressText(text) {
  return LZString.decompressFromEncodedURIComponent(text);
}
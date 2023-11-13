window.addEventListener('DOMContentLoaded', initSaver);

function initSaver() {
  editFieldEl = document.getElementById('editField');
  textSeperatorEl = document.getElementById('textSeperator');
  editFieldEl.addEventListener('keyup', saveData);
  textSeperatorEl.addEventListener('change', saveData);
  console.log("Autosave Ready.")

  loadData();
}

function saveData() {
  localStorage['editfield'] = editFieldEl.value;
  localStorage['textseperator'] = textSeperatorEl.value;

  console.debug("Saved.")
}

function loadData() {
  editFieldValue = localStorage['editfield'];
  textSeperatorValue = localStorage['textseperator'];

  if (!editFieldValue) {
    editFieldValue = `What does youtu.be/dQw4w9WgXcQ lead to? - The Rickroll
How long does the rickroll last in seconds? - 213`
  }

  if (!textSeperatorValue) {
    textSeperator = '-'
  }

  editFieldEl.value = editFieldValue
  textSeperatorEl.value = textSeperatorValue

  editField.removeAttribute('disabled');
  textSeperator.removeAttribute('disabled');

  console.log("Data Loaded.")
}
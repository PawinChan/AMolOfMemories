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
  editFieldEl.value = localStorage['editfield'];
  textSeperatorEl.value = localStorage['textseperator'];

  editField.removeAttribute('disabled');
  textSeperator.removeAttribute('disabled');

  console.log("Data Loaded.")
}
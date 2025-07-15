const titleInput = document.getElementById('titleInput');
const textInput = document.getElementById('textInput');
const addBtn = document.getElementById('addNote');
const notesContainer = document.getElementById('notesContainer');

// Load notes from localStorage or use empty array
let notes = JSON.parse(localStorage.getItem('notes')) || [];

// Save notes to localStorage
function saveNotes() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

// Render all notes
function renderNotes() {
  notesContainer.innerHTML = '';

  notes.forEach((note, index) => {
    const noteEl = document.createElement('div');
    noteEl.className = 'note';

    if (note.title) {
      const titleEl = document.createElement('h3');
      titleEl.textContent = note.title;
      noteEl.appendChild(titleEl);
    }

    const textEl = document.createElement('p');
    textEl.textContent = note.text;
    noteEl.appendChild(textEl);

    const timestamp = document.createElement('div');
    timestamp.className = 'timestamp';

    const createdTime = new Date(note.created).toLocaleString();
    const editedTime = note.updated
      ? new Date(note.updated).toLocaleString()
      : null;

    timestamp.textContent = editedTime
      ? `Edited: ${editedTime}`
      : `Created: ${createdTime}`;

    noteEl.appendChild(timestamp);

    // Edit Button
    const editBtn = document.createElement('button');
    editBtn.className = 'icon-btn edit-btn';
    editBtn.innerHTML = '<img src="images/edit.png" alt="Edit">';
    editBtn.onclick = () => editNote(index);
    noteEl.appendChild(editBtn);

    // Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'icon-btn delete-btn';
    deleteBtn.innerHTML = '<img src="images/delete.png" alt="Delete">';
    deleteBtn.onclick = () => {
      notes.splice(index, 1);
      saveNotes();
      renderNotes();
    };
    noteEl.appendChild(deleteBtn);

    notesContainer.appendChild(noteEl);
  });
}

// Add New Note
addBtn.addEventListener('click', () => {
  const title = titleInput.value.trim();
  const text = textInput.value.trim();

  if (!text) {
    alert('Please enter some note text!');
    return;
  }

  const newNote = {
    title,
    text,
    created: new Date().toISOString(),
    updated: null
  };

  notes.push(newNote);
  saveNotes();
  renderNotes();

  titleInput.value = '';
  textInput.value = '';
});

// Edit Existing Note
function editNote(index) {
  const note = notes[index];

  const newTitle = prompt('Edit note title (leave blank to remove):', note.title);
  if (newTitle === null) return; // User cancelled

  const newText = prompt('Edit note text:', note.text);
  if (newText === null) return;

  notes[index].title = newTitle.trim();
  notes[index].text = newText.trim();
  notes[index].updated = new Date().toISOString();

  saveNotes();
  renderNotes();
}

// Initial load
renderNotes();

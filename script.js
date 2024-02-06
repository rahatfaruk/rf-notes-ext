const addNoteBtn = document.querySelector('.add-note-btn')
const deleteNoteBtn = document.querySelector('.delete-note-btn')
const notesListEl = document.querySelector('.notes-list')
const noteDetailsEl = document.querySelector('.note-details')

const initNotes = [
  {id: '1', title: 'note 1', details: 'details1 lorem asdf aksf asdf'},
  {id: '2', title: 'note 2', details: 'details2 lorem asdf aksf asdf'},
]
let notes = []
let currNoteId = null;

// ## Functions:
// ### localStorage
function getNotesLS() {
  return localStorage.getItem('rf:notes') ? JSON.parse(localStorage.getItem('rf:notes')) : []
}
function setNotesLS() {
  localStorage.setItem('rf:notes' ,JSON.stringify(notes))
}

// ### select a note
function selectNote(noteId) {
  // select note UI: remove prev active; activate current one
  for(const noteEl of notesListEl.children) {
    noteEl.classList.remove('active')
  }
  document.querySelector(`[data-id='${noteId}']`).classList.add('active')

  // ## show note details in UI
  const selectedNote = notes.find(note => note.id === noteId)
  noteDetailsEl.title.value = selectedNote.title
  noteDetailsEl.details.value = selectedNote.details

  currNoteId = noteId
}

// ### render note
function renderNote(note) {
  notesListEl.innerHTML += `
    <li data-id='${note.id}'>
      <h3>${note.title}</h3>
    </li>
  `
}

function selectNoteOrHideDetails() {
  if (notes.length > 0) {
    selectNote(notes[0].id)
  } else {
    noteDetailsEl.classList.add('hidden')
  }
}

// ## init app
window.addEventListener('DOMContentLoaded', () => {
  notes = getNotesLS()
  notes.forEach(note => renderNote(note))
  selectNoteOrHideDetails()
})

// ## add new note
addNoteBtn.addEventListener('click', () => {
  const newNote = {id: Date.now().toString(), title: 'untitled', details: ''}

  notes.push(newNote)
  renderNote(newNote)
  selectNote(newNote.id)
  setNotesLS()
  noteDetailsEl.classList.remove('hidden')
})

// ## select note
notesListEl.addEventListener('click', e => {
  const selectedListEl = e.target.closest(`li`)
  if (selectedListEl) {
    const selectedListId = selectedListEl.dataset.id
    selectNote(selectedListId)
  }
})

// ## delete note
deleteNoteBtn.addEventListener('click', () => {
  document.querySelector(`[data-id='${currNoteId}']`).remove()
  notes.splice(notes.findIndex(note => note.id === currNoteId), 1)
  noteDetailsEl.reset()
  setNotesLS()
  // hide noteDetailsEl if there is no notes
  selectNoteOrHideDetails()
})

// ## edit note
noteDetailsEl.addEventListener('input', () => {
  const selectedNote = notes.find(note => note.id === currNoteId)
  selectedNote.title = noteDetailsEl.title.value
  selectedNote.details = noteDetailsEl.details.value
  setNotesLS()
  // UI: update active note inside note-list
  notesListEl.querySelector(`.active`).innerHTML = `
    <h3>${selectedNote.title}</h3>
  `
})
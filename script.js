let notes=[]
let trash=[]
const noteInputContainer=document.getElementById('noteInputContainer')
const titleIp=document.getElementsByTagName('input')[1]
const descriptionIp=document.getElementById('descriptionIp')
//this to be shown while entering title
const ipTextAreaAddbtn=document.getElementById('ipTextAreaAddbtn')

const searchBtn=document.getElementById('searchBtn')
const searchNote=document.getElementById('searchNote')
const notesAddButton=document.getElementById('addBtn')

const addedNotesDiv=document.getElementsByClassName('added-notes')[0]
const trashedNotesDiv=document.getElementsByClassName('trash-notes')[0]

const myNoteBtn=document.getElementById('notesIcon')
const trashBtn=document.getElementById('trashIcon')

function initialization(){
  onLoading()
  addEventListeners()
}

function addEventListeners(){
  window.addEventListener('load',initialization)
  myNoteBtn.addEventListener('click',showSavedNotes)
  trashBtn.addEventListener('click',showTrashNotes)
  
  
  titleIp.addEventListener('focus',()=>{
    ipTextAreaAddbtn.classList.remove('hidden')
  })

  
  titleIp.addEventListener('keydown',(e)=>{
      if (e.key === 'Enter') {
          e.preventDefault(); // Prevent the default Enter behavior (form submission)
          // Move focus to the textarea
          descriptionIp.focus();
      }
  });
  
  document.addEventListener("click", (event) => {
      if (!noteInputContainer.contains(event.target)) {
        ipTextAreaAddbtn.classList.add("hidden"); // Hide the div when clicking outside noteInputContainer
      }
    })
  
  notesAddButton.addEventListener('click',()=>{
      if (titleIp.value.trim() !== '') {
          addNote();
        }
  })
  const trashBtns=document.querySelectorAll('.fa-trash')
  trashBtns.forEach((btn)=>{
    btn.addEventListener('click',()=>{
      deleteNote(btn)
    })
  })
 
}
function showSavedNotes(){
    renderSavedNotes()
    addedNotesDiv.classList.remove('hidden')
    trashedNotesDiv.classList.add('hidden')
    
}
function showTrashNotes(){
    renderTrashNotes()
    addedNotesDiv.classList.add('hidden')
    trashedNotesDiv.classList.remove('hidden')
}
function onLoading(){
  fetchNotes()
  fetchTrash()
  renderSavedNotes()
}

function fetchNotes(){
  const savedNotes=localStorage.getItem('notes')
  if(savedNotes){notes=JSON.parse(savedNotes)}
}
function fetchTrash(){
 const deletedNotes=localStorage.getItem('trash')
 if(deletedNotes) {trash=JSON.parse(deletedNotes)}
}
function renderSavedNotes(){
  fetchNotes()
  addedNotesDiv.innerHTML=`<header class="col-span-3 text-start text-2xl font-bold"><span>Saved Notes</span>
  </header>`
  if(notes!=null)
    notes.forEach(element => {
      const titleValue=element.titleValue
      const descriptionValue=element.descriptionValue
   
      const noteTemplate=savedNoteTemplate(titleValue,descriptionValue)
      addedNotesDiv.innerHTML+=noteTemplate
})
}
function renderTrashNotes(){
  fetchTrash()
  trashedNotesDiv.innerHTML= `<header class="col-span-3 text-start text-2xl font-bold"><span>Trash</span>
  </header>`
    if(trash!=null){
        trash.forEach(element => {
        const titleValue=element.title
        const descriptionValue=element.description
        
        const noteTemplate=trashNoteTemplate(titleValue,descriptionValue)
        trashedNotesDiv.innerHTML+=noteTemplate
    });
  }
}


function addNote(){
 const titleValue=titleIp.value.trim()
 const descriptionValue=descriptionIp.value.trim()
 noteTemplate=savedNoteTemplate(titleValue,descriptionValue)
 addedNotesDiv.innerHTML+=noteTemplate

 notes.push({titleValue,descriptionValue})
 updateLocalStorage('notes',notes);
 titleIp.value=''
 descriptionIp.value=''
 addEventListeners()
}

function deleteNote(btn){
  const title=btn.parentElement.parentElement.nextElementSibling.innerHTML.trim()
  const description=btn.parentElement.parentElement.parentElement.nextElementSibling.innerHTML.trim()
  trash.push({title,description})
  updateLocalStorage('trash',trash)
  notes=notes.filter((element)=>{
      if(!(element.titleValue==title && element.descriptionValue==description)){
        return element
      }
  })
  updateLocalStorage('notes',notes)
  renderSavedNotes()
}

function updateLocalStorage(key,data){
  localStorage.setItem(key,JSON.stringify(data))
}

function savedNoteTemplate(titleValue,descriptionValue){
  return `<div class="addedNotes h-72 overflow-auto p-4 border-2 border-gray-400 rounded-md relative">
 <div class="title-utilicons">
     <div class="utilicons absolute right-1 top-1">
         <div class="flex space-x-3">
         <i id="" class="fa-solid fa-thumbtack "></i><i class="fa-solid fa-trash cursor-pointer"></i>
         </div>
     </div>
     <h1 class="text-xl font-medium">${titleValue}</h1>
 </div>
 <p class="mt-2">${descriptionValue}</p>
 </div>`

}
function trashNoteTemplate(titleValue,descriptionValue){
 return `<div class="addedNotes h-72 overflow-auto p-4 border-2 border-gray-400 rounded-md relative">
  <div class="title-utilicons">
      <div class="utilicons absolute right-1 top-1">
          <span class="flex  space-x-3"><i class=" restore fa-solid fa-trash-arrow-up"></i></span>
      </div>
      <h1 class="text-xl font-medium">${titleValue}</h1>
  </div>
  <p class="mt-2">${descriptionValue}</p>
</div>`
}

initialization()
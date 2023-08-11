let notes=[]
let trash=[]
let filtered=[]
const noteInputContainer=document.getElementById('noteInputContainer')
const titleIp=document.getElementsByTagName('input')[1]
const descriptionIp=document.getElementById('descriptionIp')
//this to be shown while entering title
const ipTextAreaAddbtn=document.getElementById('ipTextAreaAddbtn')

const searchBtn=document.getElementById('searchBtn')
const searchNote=document.getElementsByTagName('input')[0]
const notesAddButton=document.getElementById('addBtn')

const addedNotesDiv=document.getElementsByClassName('added-notes')[0]
const trashedNotesDiv=document.getElementsByClassName('trash-notes')[0]

const myNoteBtn=document.getElementById('notesIcon')
const trashBtn=document.getElementById('trashIcon')

const allAddedNotes=document.querySelectorAll('.addedNotes')

function initialization(){
  Load()
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
  const restoreBtns=document.querySelectorAll('.restore')
  restoreBtns.forEach((btn)=>{
    btn.addEventListener('click',()=>{
      restoreNote(btn)
    })
  })
  searchNote.addEventListener('input',filterNotes)
  searchNote.addEventListener('keyup',(e)=>{
    if(e.target.value==''){
      showSavedNotes()
    }
  })
  const pinBtns=document.querySelectorAll('.fa-thumbtack')
  pinBtns.forEach((btn)=>{
    btn.addEventListener('click',()=>{
      console.log('hello') 
      pinUnpin(btn)
      showSavedNotes()
    })
  })
  
}
function pinUnpin(btn){
    let IsPinned=0
    if(!btn.classList.contains('rotate-45')){
      IsPinned=1 //pin it
    }
    const titleValue=btn.parentElement.parentElement.nextElementSibling.innerHTML.trim()

    notes.forEach(element=>{
      if(titleValue==element.titleValue){
        element.IsPinned=IsPinned
      }
    })
    updateLocalStorage('notes',notes)
}

function filterNotes(){
  addedNotesDiv.innerHTML=`<header class="col-span-3 text-start text-2xl font-bold"><span>Search Results '${searchNote.value}'</span>
  </header>`
  if (notes!=null){
  filtered=notes.filter((element)=>{
    if(element.titleValue.toLowerCase().includes(searchNote.value.toLowerCase())){
      return element
    }
  })
  filtered.forEach((element)=>{
    const titleValue=element.titleValue
    const descriptionValue=element.descriptionValue
    addedNotesDiv.innerHTML+=savedNoteTemplate(titleValue,descriptionValue)
  })
  addEventListeners()
}
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
function Load(){
  fetchNotes()
  fetchTrash()
  renderSavedNotes()
}

function fetchNotes(){
  const savedNotes=localStorage.getItem('notes')
  if(savedNotes){notes=JSON.parse(savedNotes).sort((a,b)=>{
    return b.IsPinned-a.IsPinned 
  })}
}
function fetchTrash(){
 const deletedNotes=localStorage.getItem('trash')
 if(deletedNotes) {trash=JSON.parse(deletedNotes)}
}
function updateLocalStorage(key,data){
  localStorage.setItem(key,JSON.stringify(data))
}
function renderSavedNotes(){
  fetchNotes()
  addedNotesDiv.innerHTML=`<header class="col-span-3 text-start text-2xl font-bold"><span>Saved Notes</span>
  </header>`
  if(notes!=null)
    notes.forEach(element => {
      const titleValue=element.titleValue
      const descriptionValue=element.descriptionValue
      const IsPinned=element.IsPinned
      let noteTemplate=''
      if(IsPinned){
         noteTemplate=savedNoteTemplate(titleValue,descriptionValue).replace('fa-thumbtack','fa-thumbtack text-green-400 rotate-45')
      }
      else{
         noteTemplate=savedNoteTemplate(titleValue,descriptionValue)
      }
      addedNotesDiv.innerHTML+=noteTemplate
})
addEventListeners()
}
function renderTrashNotes(){
  fetchTrash()
  trashedNotesDiv.innerHTML= `<header class="col-span-3 text-start text-2xl font-bold"><span>Trash</span>
  </header>`
    if(trash!=null){
        trash.forEach(element => {
        const titleValue=element.titleValue
        const descriptionValue=element.descriptionValue
        
        const noteTemplate=trashNoteTemplate(titleValue,descriptionValue)
        trashedNotesDiv.innerHTML+=noteTemplate
    });
  }
  addEventListeners()
}


function addNote(){
 const titleValue=titleIp.value.trim()
 const descriptionValue=descriptionIp.value.trim()
 const IsPinned=0
 notes.push({titleValue,descriptionValue,IsPinned})
 updateLocalStorage('notes',notes);
 titleIp.value=''
 descriptionIp.value=''
 renderSavedNotes()
}

function deleteNote(btn){
  const titleValue=btn.parentElement.parentElement.nextElementSibling.innerHTML.trim()
  const descriptionValue=btn.parentElement.parentElement.parentElement.nextElementSibling.innerHTML.trim()
  trash.push({titleValue,descriptionValue})
  updateLocalStorage('trash',trash)
  notes=notes.filter((element)=>{
      if(!(element.titleValue==titleValue && element.descriptionValue==descriptionValue)){
        return element
      }
  })
  updateLocalStorage('notes',notes)
  renderSavedNotes()
}
function restoreNote(btn){
  const titleValue=btn.parentElement.parentElement.nextElementSibling.innerHTML.trim()
  const descriptionValue=btn.parentElement.parentElement.parentElement.nextElementSibling.innerHTML.trim()
  const IsPinned=0
  notes.push({titleValue,descriptionValue,IsPinned})
  updateLocalStorage('notes',notes)
  trash=trash.filter((element)=>{
      if(!(element.titleValue==titleValue && element.descriptionValue==descriptionValue)){
        return element
      }
  })
  updateLocalStorage('trash',trash)
  renderTrashNotes()
}



function trashNoteTemplate(titleValue,descriptionValue){
 return `<div class='trashNotesFrame p-4'>
 <div class="trashNotes h-72 overflow-auto py-4 border-2 border-gray-400 rounded-md relative">
 <div class='content py-2 px-3 '>
  <div class="title-utilicons">
  <div class="utilicons absolute right-1 top-1">
          <div class="flex  space-x-3">
          <i class=" restore text-green-400 fa-solid fa-trash-arrow-up cursor-pointer"></i>
          </div>
      </div>
      <h1 class="text-xl font-medium underline underline-offset-4">${titleValue}</h1>
  </div>
  <p class="mt-1">${descriptionValue}</p>
</div></div></div>`


}
function savedNoteTemplate(titleValue,descriptionValue){
  return `<div class='addedNotesFrame p-4'>
  <div class="addedNotes h-72 overflow-auto py-4 border-2 border-gray-400 rounded-md relative">
  <div class='content py-2 px-3'>
  <div class="title-utilicons">
     <div class="utilicons absolute right-1 top-1">
         <div class="flex space-x-3">
         <i id="" class="fa-solid fa-thumbtack"></i><i class="  fa-solid fa-trash cursor-pointer"></i>
         </div>
     </div>
     <h1 class="text-xl font-medium underline underline-offset-4">${titleValue}</h1>
 </div>
 <p class="mt-1">${descriptionValue}</p>
 </div>
 </div>
 </div>`

}

initialization()
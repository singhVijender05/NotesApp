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
let notes=[]
let trash=[]


function deleteNote(btn){
  const title=btn.parentElement.parentElement.nextElementSibling.innerHTML.trim()
  const description=btn.parentElement.parentElement.parentElement.nextElementSibling.innerHTML.trim()
  trash.push({title,description})
  updateLocalStorageWithTrash()
  notes=notes.filter((element)=>{
      if(!(element.titleValue==title && element.descriptionValue==description)){
        return element
      }
  })
  updateLocalStorage()
  location.reload()

}
function addTrashOnEvent(){
  const trashNotes=localStorage.getItem('trash')
  if(trashNotes!=null){
    trash=JSON.parse(trashNotes)
  }
  const allTrashButtons=Array.from(document.getElementsByClassName('fa-trash'))
  allTrashButtons.forEach((btn)=>{
    btn.addEventListener('click',()=>
          deleteNote(btn)
      )
  })
}


window.addEventListener('load',()=>{
  onLoading()
})
myNoteBtn.addEventListener('click',()=>{
  addedNotesDiv.classList.remove('hidden')
  trashedNotesDiv.classList.add('hidden')
})
trashBtn.addEventListener('click',()=>{
  addTrashNotes()
  addedNotesDiv.classList.add('hidden')
  trashedNotesDiv.classList.remove('hidden')
})
function addTrashNotes(){
  const storedTrashNotes=localStorage.getItem('trash')
  trashedNotesDiv.innerHTML= `<header class="col-span-3 text-start text-2xl font-bold"><span>Trash</span>
  </header>`
    if(storedTrashNotes!=null){
      const trash_notes=Array.from(JSON.parse(localStorage.getItem('trash')))
      trash_notes.forEach(element => {
        const titleValue=element.title
        const descriptionValue=element.description
        
        const noteTemplate=`<div class="addedNotes h-72 overflow-auto p-4 border-2 border-gray-400 rounded-md relative">
        <div class="title-utilicons">
            <div class="utilicons absolute right-1 top-1">
                <span class="flex  space-x-3"><i class=" restore fa-solid fa-trash-arrow-up"></i></span>
            </div>
            <h1 class="text-xl font-medium">${titleValue}</h1>
        </div>
        <p class="mt-2">${descriptionValue}</p>
    </div>`
        trashedNotesDiv.innerHTML+=noteTemplate
    });
  }
}

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

  function addNote(){
   const titleValue=titleIp.value.trim()
   const descriptionValue=descriptionIp.value.trim()

   const noteTemplate=`<div class="addedNotes h-72 overflow-auto p-4 border-2 border-gray-400 rounded-md relative">
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


   addedNotesDiv.innerHTML+=noteTemplate

   notes.push({titleValue,descriptionValue})
   updateLocalStorage();
   titleIp.value=''
   descriptionIp.value=''
   addTrashOnEvent()
  }
  function updateLocalStorage(){
    localStorage.setItem('notes',JSON.stringify(notes))
  }
  function updateLocalStorageWithTrash(){
    localStorage.setItem('trash',JSON.stringify(trash))
  }

  function onLoading(){
    const storedNotes=localStorage.getItem('notes')
    addedNotesDiv.innerHTML=`<header class="col-span-3 text-start text-2xl font-bold"><span>Saved Notes</span>
    </header>`
    if(storedNotes!=null){
      notes=Array.from(JSON.parse(localStorage.getItem('notes')))
      notes.forEach(element => {
        const titleValue=element.titleValue
        const descriptionValue=element.descriptionValue
     
        const noteTemplate=`<div class="addedNotes h-72 overflow-auto p-4 border-2 border-gray-400 rounded-md relative">
        <div class="title-utilicons">
            <div class="utilicons absolute right-1 top-1">
            <div class="flex space-x-3">
            <i id="" class="fa-solid fa-thumbtack "></i><i class="fa-solid fa-trash cursor-pointer"></i></div>
            </div>
            <h1 class="text-xl font-medium">${titleValue}</h1>
        </div>
        <p class="mt-2">${descriptionValue}</p>
        </div>`
        addedNotesDiv.innerHTML+=noteTemplate
    });
  }
  addTrashOnEvent()
}
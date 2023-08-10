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

const noteBtn=document.getElementById('notesIcon')
const trashBtn=document.getElementById('trashIcon')

let notes=[]

window.onLoad(onLoad())

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
           <span class="flex  space-x-3"><i id="" class="fa-solid fa-thumbtack "></i><i class="fa-solid fa-trash"></i></span>
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
  }
  function updateLocalStorage(){
    localStorage.setItem('notes',JSON.stringify(notes))
  }

  function onLoad(){
    const storedNotes=localStorage.getItem('notes')
    addedNotesDiv.innerHTML=''
    if(storedNotes!=null){
      notes=Array.from(JSON.parse(localStorage.getItem('notes')))
      notes.forEach(element => {
        const titleValue=element.titleValue
        const descriptionValue=element.descriptionValue
     
        const noteTemplate=`<div class="addedNotes h-72 overflow-auto p-4 border-2 border-gray-400 rounded-md relative">
        <div class="title-utilicons">
            <div class="utilicons absolute right-1 top-1">
                <span class="flex  space-x-3"><i id="" class="fa-solid fa-thumbtack "></i><i class="fa-solid fa-trash"></i></span>
            </div>
            <h1 class="text-xl font-medium">${titleValue}</h1>
        </div>
        <p class="mt-2">${descriptionValue}</p>
        </div>`
        addedNotesDiv.innerHTML+=noteTemplate
    });
  }
}
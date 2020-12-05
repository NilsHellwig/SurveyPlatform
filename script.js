// init subpages
let intro = document.querySelector(".intro");
let preQuestionaire = document.querySelector(".pre-questionaire")

// init localStorage
myStorage = localStorage;



let start_button = document.querySelector("#start_button");
start_button.addEventListener("click",function() {
   document.querySelector(".intro").remove(); 
   preQuestionaire.hidden = false;
});


$("#prequestionaire_button").click( function()
   {
      formInput = $("form").serializeArray();
      let counter = 0;
      formInput.forEach(element => {
         if (element.value !== ""){
            counter+=1;
         } else {
            document.querySelector("#hinweisText").hidden = false;
         }
      });
      if (counter === formInput.length){
         addDataToLocalStorage(formInput);
         preQuestionaire.hidden = true;
      }
   }
);

function addDataToLocalStorage(data) {
   data.forEach(element => {
      myStorage.setItem(element.name, element.value);
   });
   console.log("Neue Daten hinzugefügt: ", getAllElementsFromLocalStorage());
}

function getAllElementsFromLocalStorage() {

   var archive = {}, // Notice change here
       keys = Object.keys(myStorage),
       i = keys.length;

   while ( i-- ) {
       archive[ keys[i] ] = myStorage.getItem( keys[i] );
   }

   return archive;
}
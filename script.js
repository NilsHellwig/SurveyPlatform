import Countdown from "./countdown.js"
var countdown = new Countdown();

// init firebase
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
   apiKey: "AIzaSyDL3nsHilW-tCcOWDWdbmTsGti-Jrbozys",
   authDomain: "online-survey-time-pressure.firebaseapp.com",
   databaseURL: "https://online-survey-time-pressure-default-rtdb.firebaseio.com",
   projectId: "online-survey-time-pressure",
   storageBucket: "online-survey-time-pressure.appspot.com",
   messagingSenderId: "342158347548",
   appId: "1:342158347548:web:aeaf5a8526c22f2d5ffed9",
   measurementId: "G-VZ58RSCBN4"
 };
 // Initialize Firebase
 firebase.initializeApp(firebaseConfig);
 var database = firebase.database();
 var conditions_database = database.ref('/condition');
 var participants_database = database.ref('/participants');

// init subpages
let intro = document.querySelector(".intro");
let preQuestionaire = document.querySelector(".pre-questionaire")

// init localStorage
var myStorage = localStorage;

// init seconds variable
var seconds;


let start_button = document.querySelector("#start_button");
start_button.addEventListener("click",function() {
   document.querySelector(".intro").remove(); 
   preQuestionaire.hidden = false;
});


$("#prequestionaire_button").click( function()
   {
      let formInput = $("#pre-questionaire_form").serializeArray();
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
         hideAllClasses()
         start_study();
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

function start_study(){
   conditions_database.once("value").then(function(snapshot){
      let condition_count = snapshot.val();
      let c1 = condition_count["30"];
      let c2 = condition_count["60"];
      let c3 = condition_count["no_limit"];
      let users_condition;
      if (c1 <= c2 && c1 <= c3){
         users_condition = "30"
      }
      if (c1 > c2 && c3 >= c2){
         users_condition = "60"
      }
      if (c3 < c1 && c3 < c2){
         users_condition = "no_limit"
      }
      myStorage.setItem("user_condition", users_condition);
      myStorage.setItem("task", 1);
      create_web_pages_pool();
      start_condition();
   });
}

function create_web_pages_pool() {
   let file_names = ["sample1","sample2","sample3","sample4","sample5","sample6","sample7"]
   let selected_conditions = getRandom(file_names,5)
   myStorage.setItem("condition",JSON.stringify(selected_conditions))
   console.log(myStorage.getItem("condition"));
}
// create_web_pages_pool2();
function create_web_pages_pool2(){
   let y1 = Math.floor(Math.random() * 4);
   let y2 = y1;
   while(y1==y2){
      y2 = Math.floor(Math.random() * 4);
   }
   let indezies = []
   for (let i = 0; i < 4; i++) {
      indezies[i] = Math.floor(Math.random() * 4) + 1;
   }
   let links = []
   for (let i=0; i<4; i++){
      let t;
      if (y1==i || y2==i){
         t = "f"
      } else {
         t = "t"
      }
      let link = "doc_"+t+"_"+i+"_"+indezies[i]
      links.push(link)
   }
   console.log(links)
   links = shuffle(links)
   myStorage.setItem("condition",JSON.stringify(links))
   console.log(myStorage.getItem("condition"));
}

// Fisher Yates Shuffle Algorithm
function shuffle(a) {
   var j, x, i;
   for (i = a.length - 1; i > 0; i--) {
       j = Math.floor(Math.random() * (i + 1));
       x = a[i];
       a[i] = a[j];
       a[j] = x;
   }
   return a;
}

function getRandom(arr, n) {
   var result = new Array(n),
       len = arr.length,
       taken = new Array(len);
   if (n > len)
       throw new RangeError("getRandom: more elements taken than available");
   while (n--) {
       var x = Math.floor(Math.random() * len);
       result[n] = arr[x in taken ? taken[x] : x];
       taken[x] = --len in taken ? taken[len] : len;
   }
   return result;
}

function save_study_results(){
   let results = getAllElementsFromLocalStorage();
   for (var key in results){
      if (/([\.])/.test(key)||/([\-])/.test(key)){
         delete results[key];
      }
   }
   participants_database.push(results);
}

function start_condition() {
   hideAllClasses();
   let title = document.querySelector("#experimentTitle");
   let information_text = document.querySelector("#information_text");
   let experimentElement = document.querySelector(".experiment_intro");
   document.querySelector(".experiment").hidden = false;
   experimentElement.hidden = false;
   title.innerHTML = myStorage.getItem("task")+". Szenario"
   information_text.innerHTML = ""
   if (myStorage.getItem("user_condition")==="no_limit"){
      let task_description = "Sie interessiern sich für XY. Sie können sich die Internetseite so lange anschauen, wie Sie möchten!";
      information_text.innerHTML = task_description;
   } else {
      let task_description = "Sie interessiern sich für XY. Sie können sich die Internetseite maximal "+myStorage.getItem("user_condition")+" Sekunden Zeit!";
      information_text.innerHTML = task_description;
   }
}

startExperimentButtonSetup();

function startExperimentButtonSetup() {
   let start_experiment_button = document.querySelector("#start_experiment_button");

   start_experiment_button.addEventListener("click",function() {
      hideAllClassesExperiment();
      let timer_view = document.querySelector(".timer_view");
      timer_view.hidden = false;
      console.log("pool/"+JSON.parse(localStorage.getItem("condition") || "[]")[myStorage.getItem("task")-1]+".png");
      document.querySelector("#website_image").src="pool/"+JSON.parse(localStorage.getItem("condition") || "[]")[myStorage.getItem("task")-1]+".png"
      $("img").on("load", function () {
         $('img').off('load');
         console.log("loaded!");
         if (myStorage.getItem("user_condition")==="no_limit"){
            document.querySelector("#timer").hidden = true;
            countdown.startTimeCounter();
         } else {
            if (myStorage.getItem("user_condition")==="60"){
               document.querySelector('#timer').innerHTML = "60 seconds";
            }
            if (myStorage.getItem("user_condition")==="30"){
               document.querySelector('#timer').innerHTML = "30 seconds"
            }
            console.log("timer started for "+myStorage.getItem("user_condition"));
            countdown.startClock(parseInt(myStorage.getItem("user_condition")));
            countdown.addEventListener("onTimeChange",function(event) {
               let new_time = event.data;
               document.querySelector('#timer').innerHTML = new_time+" seconds"
            });
         }
      })
   });
}

document.querySelector("#timer_done_button").addEventListener("click",function() {
   console.log("timer_done klicked!");
   if (myStorage.getItem("user_condition") === "30" || myStorage.getItem("user_condition") === "60"){
      countdown.stopClock();
   } else {
      saveTime(countdown.getIncrement());
      countdown.destroyIncrement();
   }
});
countdown.addEventListener("timeEnd",function(event) {
   saveTime(event.data);
   console.log("timeEnd event fired!");
   startQuestionsAfterwards();
});

function saveTime(time) {
   console.log("saveTime method fired!");
   // -1, da Array bei 0 beginnt. das local Storage Objekt "task" wird befusst am Anfang auf 1 gesetzt, da der Text entnommen wird für den Titel.
   console.log(JSON.parse(localStorage.getItem("condition") || "[]")[myStorage.getItem("task")-1]);
   myStorage.setItem(JSON.parse(localStorage.getItem("condition") || "[]")[myStorage.getItem("task")-1]+"_time",time);
   console.log("All saved elements: ");
   console.log(getAllElementsFromLocalStorage());
}

function startQuestionsAfterwards() {
   hideAllClassesExperiment();
   document.querySelector(".questions_afterwards").hidden = false;
}

function hideAllClasses() {
   document.querySelectorAll('main > *').forEach(function(el) {
      el.hidden = true;
   });
}

function hideAllClassesExperiment() {
   document.querySelectorAll('.experiment > *').forEach(function(el) {
      el.hidden = true;
   });
}
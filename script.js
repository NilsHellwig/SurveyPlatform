import Countdown from "./countdown.js"
import { document_urls, motivations } from './documents_url.js'
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

firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var conditions_database = database.ref('/condition');
var participants_database = database.ref('/participants');

// init subpages
let intro = document.querySelector(".intro");
let preQuestionaire = document.querySelector(".pre-questionaire")

// init localStorage
var myStorage = localStorage;

// ------> !!!!!!
localStorage.clear();

let start_button = document.querySelector("#start_button");
start_button.addEventListener("click",function() {
   document.querySelector(".intro").remove(); 
   preQuestionaire.hidden = false;
});

$("#prequestionaire_button").click( function()
   {
      let formInput = $("#pre-questionaire_form").serializeArray();
      console.log(formInput);
      let counter = 0;
      formInput.forEach(element => {
         if (element.value !== ""){
            counter+=1;
         } else {
            document.querySelector("#hinweisText").hidden = false;
         }
      });
      if (counter === 11){ // 11 is the amount of questions available
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

function start_study(){
   conditions_database.once("value").then(function(snapshot){
      let condition_count = snapshot.val();
      let c1 = condition_count["3-4"];
      let c2 = condition_count["24"];
      let c3 = condition_count["no_limit"];
      let users_condition;
      if (c1 <= c2 && c1 <= c3){
         users_condition = "3.4"
      } 
      if (c1 > c2 && c3 >= c2){
         users_condition = "24"
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

function create_web_pages_pool(){
   let y1 = Math.floor(Math.random() * 4);
   let y2 = y1;
   while(y1==y2){
      y2 = Math.floor(Math.random() * 4);
   }
   let indezies = []
   for (let i = 0; i < 4; i++) {
      indezies[i] = Math.floor(Math.random() * 2) + 1;
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
   links = shuffle(links)
   myStorage.setItem("condition",JSON.stringify(links))
   console.log(myStorage.getItem("condition"));
}

function start_condition() {
   hideAllClasses();
   let title = document.querySelector("#experimentTitle");
   let information_text = document.querySelector("#information_text");
   let experimentElement = document.querySelector(".experiment_intro");
   document.querySelector(".experiment").hidden = false;
   experimentElement.hidden = false;
   title.innerHTML = myStorage.getItem("task")+". Scenario";
   information_text.innerHTML = "";
   let current_topic = JSON.parse(localStorage.getItem("condition") || "[]")[myStorage.getItem("task")-1][6];
   myStorage.setItem("task1_website",JSON.parse(localStorage.getItem("condition") || "[]")[0])
   myStorage.setItem("task2_website",JSON.parse(localStorage.getItem("condition") || "[]")[1])
   myStorage.setItem("task3_website",JSON.parse(localStorage.getItem("condition") || "[]")[2])
   myStorage.setItem("task4_website",JSON.parse(localStorage.getItem("condition") || "[]")[3])
   let motivation_text;
   if (current_topic === "0") {
      motivation_text = motivations[current_topic]
   }
   if (current_topic === "1") {
      motivation_text = motivations[current_topic]
   }
   if (current_topic === "2") {
      motivation_text = motivations[current_topic]
   }
   if (current_topic === "3") {
      motivation_text = motivations[current_topic]
   }

   let custom =  "Try to judge the credibility of the website.";
   if (myStorage.getItem("user_condition")==="no_limit"){
      let task_description = motivation_text +custom+" You can look at the website for as long as you like! Try to judge the credibility of the website. By clicking the button below, you will see the website.";
      information_text.innerHTML = task_description;
   } else {
      let task_description = motivation_text+custom + " You can view the website at a maximum of "+myStorage.getItem("user_condition")+" seconds! By clicking the button below, you will see the website.";
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
      //document.querySelector("#website_image").src = "pool/sample1.png" // ersetzen!
      document.querySelector("#website_image").src="pool/"+JSON.parse(localStorage.getItem("condition") || "[]")[myStorage.getItem("task")-1]+".png"
      document.querySelector("#url").innerHTML = document_urls[JSON.parse(localStorage.getItem("condition") || "[]")[myStorage.getItem("task")-1]]
      document.querySelector("#website_image").hidden = true; 
      $("img").on("load", function () {
         $('img').off('load');
         console.log("loaded!");
         document.querySelector("#website_image").hidden = false; 
         if (myStorage.getItem("user_condition")==="no_limit"){
            document.querySelector("#timer").hidden = true;
            countdown.startTimeCounter();
         } else {
            if (myStorage.getItem("user_condition")==="24"){
               document.querySelector('#timer').innerHTML = "24 seconds";
            }
            if (myStorage.getItem("user_condition")==="3.4"){
               document.querySelector('#timer').innerHTML = "3.4 seconds"
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
   if (myStorage.getItem("user_condition") === "3.4" || myStorage.getItem("user_condition") === "24"){
      countdown.stopClock();
   } else {
      saveTime(countdown.getIncrement());
      countdown.destroyIncrement();
      startQuestionsAfterwards();
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
   myStorage.setItem(myStorage.getItem("task")+"_time",time);
   console.log("All saved elements: ");
   console.log(getAllElementsFromLocalStorage());
}

function startQuestionsAfterwards() {
   hideAllClassesExperiment();
   document.querySelector(".questions_afterwards").hidden = false;
}

$("#after_questions_button").click( function()
   {
      let formInput = $("#questions_afterwards_form").serializeArray();
      console.log(formInput);
      let counter = 0;
      formInput.forEach(element => {
         if (element.value !== ""){
            counter+=1;
         }
      });
      if(counter <= 19){
         document.querySelector("#hinweisTextAfterQuestionaire").hidden = false;
      }
      console.log("counter: ",counter);
      if (counter === 19 || (counter === 18 && formInput[18].value === "")){ // 11 is the amount of questions available
         console.log("Entered Data: ",formInput);
         formInput.forEach(element => {
            element.name = "task"+myStorage.getItem("task")+"_"+element.name
         });
         console.log("Entered Data: ",formInput);
         addDataToLocalStorage(formInput);
         hideAllClassesExperiment();
         myStorage.setItem("task", 1+parseInt(myStorage.getItem("task")));
         console.log(myStorage.getItem("task"));
         if (myStorage.getItem("task") < 5){
            clearForms();
            start_condition();
         } else {
            console.log("Studie ist vorbei!");
            save_study_results();
            save_condition();
            document.querySelector(".outro").hidden = false;
         }
      }
   }
);


// Hide Classes Methods
function clearForms() {
   let radioButtons = document.querySelectorAll("input[type=radio]");
   console.log(radioButtons);
   radioButtons.forEach(rButton => {
      rButton.checked = false;
   });
   let inputTexts = document.querySelectorAll("input[type=text]");
   inputTexts.forEach(inputT => {
      inputT.value = "";
   });
   document.querySelector("#hinweisTextAfterQuestionaire").hidden = true;

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


// Database

function save_study_results(){
   myStorage.removeItem("condition")
   let results = getAllElementsFromLocalStorage();
   for (var key in results){
      if (/([\.])/.test(key)||/([\-])/.test(key)){
         delete results[key];
      }
   }
   participants_database.push(results);
}

function save_condition() {
   let cond = myStorage.getItem("user_condition");
   if (cond==="3.4"){
      cond = "3-4"
   }
   conditions_database.child(cond).once("value").then(function(snapshot){
      let condition_count = snapshot.val()+1;
      conditions_database.child(cond).set(condition_count);
   });
}

// Algorithms

function getAllElementsFromLocalStorage() {
   var archive = {}, // Notice change here
       keys = Object.keys(myStorage),
       i = keys.length;

   while ( i-- ) {
       archive[ keys[i] ] = myStorage.getItem( keys[i] );
   }
   return archive;
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
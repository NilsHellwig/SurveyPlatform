import {Observable, Event} from "./Observable.js"

var time, myTimer, context, time_init, time_counter_seconds, time_counter;

class Countdown extends Observable {

    startClock(first_time) {
        myTimer = setInterval(this.myClock, 1000);
        time_init = first_time
        time = first_time;
        context = this;
        console.log(time);
    }

    myClock() {
       time = time-1;
       console.log(time);
       let event = new Event("onTimeChange", time);
       context.notifyAll(event);
       if (time == 0) {
        let event = new Event("timeEnd", time_init-time);
        context.notifyAll(event);
        console.log("end");
        clearInterval(myTimer);
       }
    }

    notfiyStop(){
       let event = new Event("timeEnd", time_init-time);
       context.notifyAll(event); 
    }

    stopClock(){
       this.notfiyStop(); 
       clearInterval(myTimer);
    };

    getTime(){
        return time_init-time;
    }
    
    startTimeCounter(){
        time_counter_seconds = 0;
        console.log("enter");
        time_counter = setInterval(this.incrementSeconds, 1000);
    }

    incrementSeconds() {
        time_counter_seconds += 1;
        console.log(time_counter_seconds);
    }

    getIncrement(){
        return(time_counter_seconds)
    }

    destroyIncrement(){
        clearInterval(time_counter);
    }
}

export default Countdown;
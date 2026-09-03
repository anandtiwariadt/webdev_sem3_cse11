import {EventEmitter} from "node:events";

function createDomElements(){
    const emitter=new EventEmitter();
    return{
        addEventListener(eventType,listener){
            emitter.on(eventType,listener);
        },
        removeEventListener(eventType, listener){
            emitter.off(eventType,listener);
        },
        dispatchEvent(event){
            event.target=this;
            event.currentTarget=this;
            emitter.emit(event.eventType,event);
        }
    }
}

const button=createDomElements();
button.addEventListener('Submit',()=>{
    console.log("Data submitted successfully");
})

button.dispatchEvent({
    eventType:"submit",
});
button.dispatchEvent({
    eventType:"click",
    detail:"this is the click dispatcher"
});
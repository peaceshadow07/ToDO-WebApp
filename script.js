var uid = new ShortUniqueId();

const addBtn = document.querySelector(".add-btn");
const modalCont = document.querySelector(".modal-cont");
let colors = ['lightpink', ' lightgreen', 'lightblue', 'black'];
let modalColor = colors[colors.length - 1];
const priorityColors = document.querySelectorAll(".priority-color");
let modalFlag = false;
const textCont = document.querySelector("textarea");
const mainCont = document.querySelector(".main-cont");
let ticketArr = [];
let removeBtn = document.querySelector(".remove-btn");

let toolboxColor = document.querySelectorAll(".color");
let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";


addBtn.addEventListener("click", ()=>{
    if(modalFlag){
        modalCont.style.display = "none";
    }else{
        modalCont.style.display = "flex";
    }
    modalFlag = !modalFlag;
});


priorityColors.forEach((colorEle)=>{
    colorEle.addEventListener("click",()=>{
        priorityColors.forEach((colorE)=>{
            colorE.classList.remove("active");
        });
        colorEle.classList.add("active");
        modalColor = colorEle.classList[0];
        console.log(modalColor);
        console.log(textCont.value);
    });
});

modalCont.addEventListener("keydown",(e)=>{
    let key = e.key;
    if(key=="Shift"){
        console.log(textCont.value);
        createTicket(modalColor, textCont.value);
        modalCont.style.display = "none";
        modalFlag = !modalFlag;
        textCont.value = "";
        priorityColors.forEach((colorEle)=>{
            colorEle.classList.remove("active");
        });
    }
});


function createTicket(ticketColor, text, ticketId){
    let id = ticketId || uid();
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class","ticket-cont");
    ticketCont.innerHTML = `<div class="ticket-color ${ticketColor}"></div>
                            <div class="ticket-id">${id}</div>
                            <div class="task-area ${ticketColor}">${text}</div>
                            <div class="ticket-lock">
                                <i class="fa-solid fa-lock"></i>
                            </div>`;
    mainCont.appendChild(ticketCont);
    handleRemoval(ticketCont, id);
    handleColor(ticketCont, id);
    handleLock(ticketCont, id);

    if(!ticketId){
        ticketArr.push({ticketColor, text, ticketId : id});
        localStorage.setItem("tickets", JSON.stringify(ticketArr));
    }
}


if(localStorage.getItem("tickets")){
    ticketArr = JSON.parse(localStorage.getItem("tickets"));
    ticketArr.forEach((ticketObj)=>{
        createTicket(ticketObj.ticketColor, ticketObj.text, ticketObj.ticketId);
    });
}

for (let i = 0; i < toolboxColor.length; i++) {
    toolboxColor[i].addEventListener("click",()=>{
        let currColor = toolboxColor[i].classList[0];
        
        let filteredTickets = ticketArr.filter((ticketObj)=>{
            return currColor == ticketObj.ticketColor;
        });

        let allTickets = document.querySelectorAll(".ticket-cont");
        allTickets.forEach((ticket)=>{
            ticket.remove();
        });

        filteredTickets.forEach((ticketObj)=>{
            createTicket(ticketObj.ticketColor, ticketObj.text, ticketObj.ticketId);
        });
    });

    toolboxColor[i].addEventListener("dblclick",()=>{
        let allTickets = document.querySelectorAll(".ticket-cont");
        allTickets.forEach((ticket)=>{
            ticket.remove();
        });
        
        ticketArr.forEach((ticketObj)=>{
            createTicket(ticketObj.ticketColor, ticketObj.text, ticketObj.ticketId);
        });
        
    });


}

// Change styling on click of remove btn
let removeFlag = false;
removeBtn.addEventListener("click",()=>{
    if(removeFlag){
        removeBtn.style.color = "white";
    }else{
        removeBtn.style.color= "red";
    }
    removeFlag = !removeFlag;
});


// removes ticket from local storage and UI
function handleRemoval(ticket, id) {
    ticket.addEventListener("click", function () {
        if (!removeFlag) return;
        //local storage remove 
        //->get idx of the ticket to be deleted
        let idx = getTicketIdx(id);
        ticketArr.splice(idx, 1);
        
        //removed from browser storage and set updated arr 
        localStorage.setItem("tickets", JSON.stringify(ticketArr));

        //frontend remove
        ticket.remove();
    });
}

//returns index of the ticket inside Local Storage's array
function getTicketIdx(id) {
    let ticketIdx=ticketArr.findIndex(function (ticketObj) {
        return ticketObj.ticketId == id;
    })
    return ticketIdx;
}

//change priority color of the tickets
function handleColor(ticket, id) {
    let ticketColorStrip = ticket.querySelector(".ticket-color"); 

    ticketColorStrip.addEventListener("click", function () {
        let currTicketColor = ticketColorStrip.classList[1]; //lightpink
        //["lightpink", "lightgreen", "lightblue", "black"];
        let currTicketColorIdx = colors.indexOf(currTicketColor); //0

        let newTicketColorIdx = currTicketColorIdx + 1; //1

        newTicketColorIdx = newTicketColorIdx % colors.length; //1
        let newTicketColor = colors[newTicketColorIdx]; //lightgreen

        ticketColorStrip.classList.remove(currTicketColor); //lightpink [ticket-color, lightpink]-> [ticket-color]
        ticketColorStrip.classList.add(newTicketColor);

        //local storage update 
        let ticketIdx = getTicketIdx(id);
        ticketArr[ticketIdx].ticketColor = newTicketColor;
        localStorage.setItem("tickets", JSON.stringify(ticketsArr));

    });
}

function handleLock(ticket, id){
    let ticketLockEle = ticket.querySelector(".ticket-lock");
    let ticketLock = ticketLockEle.children[0];
    let ticketTaskArea = ticket.querySelector(".task-area");
    console.log(ticketLock.classList);
    ticketLock.addEventListener("click",()=>{
        let ticketIdx = getTicketIdx(id);
        if(ticketLock.classList.contains(lockClass)){
            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unlockClass);
            ticketTaskArea.setAttribute("contenteditable", "true");
        }else{
            ticketLock.classList.remove(unlockClass);
            ticketLock.classList.add(lockClass);
            ticketTaskArea.setAttribute("contenteditable", "false");
        }

        ticketArr[ticketIdx].data = ticketTaskArea.innerText;
        localStorage.setItem("tickets", JSON.stringify(ticketArr));

    });

}

// localStorage.setItem("Name","kartikeya");
// localStorage.setItem("Batch", "Fjp-5");
// localStorage.setItem("categorty","Student");

// console.log(localStorage.getItem("Name"));
// localStorage.removeItem("Name");

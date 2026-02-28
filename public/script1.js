// ======================
// Contacts & Chat History
// ======================
let contacts = [
    {name:"Mom ❤️", chat:["Hi!", "Where are you?"]},
    {name:"Best Friend", chat:["Hey, what's up?", "Want to hang out?"]},
    {name:"Guardian 1", chat:["Remember to check in.", "Stay safe!"]}
];

let selectedContact = null;

// ======================
// Fake Call Elements
// ======================
const callScreen = document.getElementById("callScreen");
const ringtone = document.getElementById("ringtone");
const voice = document.getElementById("voice");
const timerDisplay = document.getElementById("timer");
let seconds = 0, interval;

// ======================
// Populate Contacts Sidebar
// ======================
const contactList = document.getElementById("contactList");
contacts.forEach((c,i)=>{
    const li = document.createElement("li");
    li.innerText = c.name;
    li.onclick = ()=>selectContact(i);
    contactList.appendChild(li);
});

// ======================
// Select Contact
// ======================
function selectContact(index){
    selectedContact = contacts[index];
    document.getElementById("chatHeader").innerText = selectedContact.name;

    Array.from(contactList.children).forEach((li,i)=>li.classList.remove("active"));
    contactList.children[index].classList.add("active");

    const chatBox = document.getElementById("chatBox");
    chatBox.innerHTML = "";
    selectedContact.chat.forEach(msg=>{
        const p = document.createElement("p");
        p.className = "received";
        p.innerText = msg;
        chatBox.appendChild(p);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
}

// ======================
// Send Message
// ======================
function sendMessage(){
    const input = document.getElementById("messageInput");
    const msg = input.value.trim();
    if(!msg || !selectedContact) return;

    // Append sent
    const chatBox = document.getElementById("chatBox");
    const p = document.createElement("p");
    p.className = "sent";
    p.innerText = msg;
    chatBox.appendChild(p);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Save to history
    selectedContact.chat.push(msg);
    input.value="";

    // 🚨 Trigger fake call for ANY contact if message is 911
    if(msg === "911"){
        triggerFakeCall(selectedContact.name);
    }
}

// ======================
// Fake Call Functions
// ======================
function triggerFakeCall(callerName="Mom ❤️"){
    callScreen.classList.remove("hidden");
    document.getElementById("callerName").innerText = callerName;
    ringtone.currentTime=0;
    ringtone.play();
    seconds=0;
    timerDisplay.innerText="00:00";

    // Enable buttons
    callScreen.querySelector(".accept").disabled = false;
    callScreen.querySelector(".decline").disabled = false;
}

// Accept Call
function acceptCall(){
    ringtone.pause();
    ringtone.currentTime = 0;

    // Play voice
    voice.currentTime = 0;
    voice.play();

    // Start call timer
    interval = setInterval(()=>{
        seconds++;
        let mins = Math.floor(seconds/60);
        let secs = seconds % 60;
        timerDisplay.innerText = (mins<10?"0":"")+mins+":"+(secs<10?"0":"")+secs;
    },1000);

    // Disable Accept & Decline during active call
    callScreen.querySelector(".accept").disabled = true;
    
}

// Decline Call – now handles “end call” + SOS/location
function declineCall(){
    // Stop ringtone if ringing
    ringtone.pause();
    ringtone.currentTime = 0;

    // Stop voice if call was accepted
    voice.pause();
    voice.currentTime = 0;

    // Stop call timer if running
    clearInterval(interval);
    seconds = 0;
    timerDisplay.innerText = "00:00";

    // Hide the call screen
    callScreen.classList.add("hidden");

    // Trigger SOS / location sharing
    shareLocationToGuardians();
    console.log("Call declined – call ended, location shared!");
}
// ======================
// Placeholder for location sharing
// ======================
function shareLocationToGuardians(){
    // TODO: implement location sharing logic (Firebase, SMS, etc.)
    console.log("Sharing location to guardians...");
}
const HOSTNAME_RE = new RegExp("^(.*://)?([a-zA-Z0-9\-\.]+\.(com|org|net|mil|edu|COM|ORG|NET|MIL|EDU))");

let url = "INVALID_URL";


function initBlockPrompt(){
    const urlDisplay = document.getElementById("blockWebsiteUrl");
    const hostname = HOSTNAME_RE.exec(url)[2];
    urlDisplay.innerHTML = hostname || "INVALID_URL";
}

function updateText(count){
    const introText = document.getElementById("introMessage");
    introText.innerHTML = `Removed ${count} pieces of BS from this page. Click the button below to add them back.`;
}

function initText(){
    updateText(0);
}

function initBtn(){
    const websiteToggle = document.getElementById("blockWebsiteToggle");
    const match = HOSTNAME_RE.exec(url);
    if(match == undefined || match[2] == undefined){
        console.log("INVALID_URL");
    }else{
        const hostname = match[2]

        websiteToggle.onchange = (e) => {
            let entry = {};
            entry[hostname] = e.target.checked;
            chrome.storage.sync.set(entry);
        }
        chrome.storage.sync.get([hostname], function(result) {
            websiteToggle.checked = result[hostname];
        });
    }
}


document.addEventListener("DOMContentLoaded", () => {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, tabs => {
        url = tabs[0].url;
        initBlockPrompt();
        initText();
        initBtn();
    })


    chrome.runtime.onMessage.addListener((req, sender) => {
        if(req.from === "content"){
            if(req.subject === "finishedRemoving"){
                updateText(req.count);
            }
        }
    })
})
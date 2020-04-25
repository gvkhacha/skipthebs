const VALID_URLS = ["www.thekitchn.com", "damndelicious.net"]
const HOSTNAME_RE = new RegExp("^(.*://)?([a-zA-Z0-9\-\.]+\.(com|org|net|mil|edu|COM|ORG|NET|MIL|EDU))");

let url = "INVALID_URL";


function initBlockPrompt(){
    const urlDisplay = document.getElementById("blockWebsiteUrl");
    const match = HOSTNAME_RE.exec(url);
    const hostname = match ? match[2] : "INVALID_URL";
    urlDisplay.innerHTML = hostname;
}

function updateText(count){
    const introText = document.getElementById("introMessage");
    const match = HOSTNAME_RE.exec(url);
    const hostname = match ? match[2] : "INVALID_URL";
    if(!VALID_URLS.includes(hostname)){
        introText.innerHTML = "Sorry, I haven't added support for this page yet. Use the issue button below to request it.";
    }else{
        // only works when popup is open when the page opens. Which makes sense code-wise.
        introText.innerHTML = `Removed ${count} pieces of BS from this page. Click the button below to add them back.`;
    }
}

function initText(){
    updateText(0);
}

function initBtn(){
    const websiteToggle = document.getElementById("blockWebsiteToggle");
    const refreshBtn = document.getElementById("refreshBtn");
    const issueBtn = document.getElementById("issueBtn");

    const match = HOSTNAME_RE.exec(url);
    if(match == undefined || match[2] == undefined){
        console.log("INVALID_URL");
    }else{
        const hostname = match[2]

        websiteToggle.onchange = (e) => {
            let entry = {};
            entry[hostname] = e.target.checked;
            chrome.storage.sync.set(entry, () => {
                const refreshDiv = document.getElementById("refreshPrompt");
                refreshDiv.style.display = "block";
            });
        }
        chrome.storage.sync.get([hostname], function(result) {
            websiteToggle.checked = result[hostname] == undefined || result[hostname];
        });
    }

    refreshBtn.onclick = () => {
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
        })
    }

    issueBtn.onclick = () => {
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            chrome.tabs.create({url: chrome.extension.getURL(`issue.html?url=${tabs[0].url}`)});
        })
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
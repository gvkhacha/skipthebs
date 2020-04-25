const HOSTNAME_RE = new RegExp("^(.*://)?([a-zA-Z0-9\-\.]+\.(com|org|net|mil|edu|COM|ORG|NET|MIL|EDU))", "g");

let url = "INVALID_URL";


function initBlockPrompt(){
    const urlDisplay = document.getElementById("blockWebsiteUrl");
    urlDisplay.innerHTML = url.match(HOSTNAME_RE) || "INVALID_URL";

    // chrome.tabs.query({
    //     active: true,
    //     currentWindow: true
    // }, tabs => {
    //     let url = tabs[0].url;
    //     urlDisplay.innerHTML = url.match(HOSTNAME_RE) || "INVALID_URL";
    // })
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
    const websiteUrl = url.match(HOSTNAME_RE)[0];
    if(websiteUrl == undefined){
        console.log("INVALID_URL");
    }else{
        console.log(websiteUrl);

        websiteToggle.onchange = (e) => {
            let entry = {};
            entry[websiteUrl] = e.target.checked;
            chrome.storage.sync.set(entry, function() {
                console.log(entry);
            });
        }
        console.log(websiteUrl);
        chrome.storage.sync.get([websiteUrl], function(result) {
            websiteToggle.checked = result[websiteUrl];
        });
        // chrome.storage.local.get(null, (checked) => {
        //     console.log(checked);
        //     console.log(checked.key);
        //     if(checked == undefined){
        //         websiteToggle.checked = true;
        //     }
        //     websiteToggle.checked = checked;
        // })
    }
}


//     const reAddBtn = document.getElementById("reAddBtn");
//     reAddBtn.onclick = () => {
//         chrome.runtime.sendMessage({
//             from: "popup",
//             subject: "reAdd"
//         })
//     }
// }


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
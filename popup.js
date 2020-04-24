
function updateText(count){
    const introText = document.getElementById("introMessage");
    introText.innerHTML = `Removed ${count} pieces of BS from this page. Click the button below to add them back.`;
}

function initText(){
    updateText(0);
}

function initBtn(){
    const reAddBtn = document.getElementById("reAddBtn");
    reAddBtn.onclick = () => {
        chrome.runtime.sendMessage({
            from: "popup",
            subject: "reAdd"
        })
    }
}


document.addEventListener("DOMContentLoaded", () => {
    initText();
    initBtn();

    chrome.runtime.onMessage.addListener((req, sender) => {
        if(req.from === "content"){
            if(req.subject === "finishedRemoving"){
                updateText(req.count);
            }
        }
    })
})
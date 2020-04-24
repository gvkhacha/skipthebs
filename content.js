console.log("starting");
const parentElement = document.querySelector("div#content > article.post");

if(parentElement == undefined){
    chrome.runtime.sendMessage({
        from: "content",
        subject: "parentNotFound"
    })
}

const bodyElements = [...parentElement.children];
const removed = bodyElements.filter(child => !child.className.split(" ").includes("recipe"));

removed.forEach(child => child.remove());

chrome.runtime.sendMessage({
    from: "content",
    subject: "finishedRemoving",
    count: removed.length
})
console.log("done");
chrome.runtime.onMessage.addListener((req, sender) => {
    console.log("received")
    if(req.from === "popup"){
        if(req.subject === "reAdd"){
            console.log("Adding...")
            const allChildren = removed.concat([...parentElement.children]);
            console.log(allChildren);

            parentElement.innerHTML = "";
            allChildren.forEach(ch => parentElement.appendChild(ch));
        }
    }
})



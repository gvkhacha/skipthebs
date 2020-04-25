const url = window.location.hostname;
chrome.storage.sync.get(url, (result) => {
    if(result[url]){
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
    }
})






const url = window.location.hostname;

const parentQuerySelector = {
    "damndelicious.net": "div#content > article.post",
    "www.thekitchn.com": "article.Post--withRecipe"
}

const filterFunctions = {
    "damndelicious.net": (element) => !element.className.split(" ").includes("recipe"),
    "www.thekitchn.com": (element) => !(element.className.split(" ").includes("Post__recipe") || element.className.split(" ").includes("Post__item--first"))
}

chrome.storage.sync.get(url, (result) => {
    if(result[url] == undefined || result[url]){ // only if its explicitly false
        const parentElement = document.querySelector(parentQuerySelector[url]);
        console.log(parentElement);
        if(parentElement == undefined){
            chrome.runtime.sendMessage({
                from: "content",
                subject: "parentNotFound"
            })
        }
        
        const bodyElements = [...parentElement.children];
        const removed = bodyElements.filter(filterFunctions[url]);
        
        removed.forEach(child => child.remove());
        
        chrome.runtime.sendMessage({
            from: "content",
            subject: "finishedRemoving",
            count: removed.length
        })
    }
})

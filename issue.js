//credit to https://davidwalsh.name/query-string-javascript for regex 
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(window.location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

document.addEventListener("DOMContentLoaded", () => {
    const urlSpan = document.getElementById("urlDisplay");
    urlSpan.innerHTML = `You were on website: ${getUrlParameter("url")}`;
})
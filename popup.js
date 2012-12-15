function make() {
//    chrome.tabs.executeScript(null, {file:"jquery.js"});
    chrome.tabs.executeScript(null, {file:"tree.js"});
    window.close();
}
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('tree').blur();
    document.getElementById('tree').addEventListener('click', make);
});

/**
 * User: p36101
 * Date: 07.02.13
 * Time: 12:22
 */

chrome.browserAction.onClicked.addListener(function(tab) {

    var views = chrome.extension.getViews();
    var viewTabUrl = chrome.extension.getURL('options.html');

    chrome.tabs.query({'url': viewTabUrl}, function(tabs_arr){
        if (tabs_arr.length == 1)
            chrome.tabs.update(tabs_arr[0].id, {selected: true});
        else
            chrome.tabs.create({'url': viewTabUrl});
    });


//    for (var i = 0; i < views.length; i++) {
//        var view = views[i];
//
//        // If this view has the right URL and hasn't been used yet...
//        if (view.location.href == viewTabUrl) {
//            chrome.tabs.highlight()
//            view.focus();
//            break; // we're done
//        }
//        else
//        {
//            chrome.tabs.create({'url': viewTabUrl}, function(tab) {});
//        }
//    }
});
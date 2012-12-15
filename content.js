var special_links = '';
chrome.storage.sync.get(
    'special_links',
    function(data){
        if (data.special_links)
            special_links = JSON.stringify(data).replace(/^\{\"(.*)\"\:(.*)\}$/g, 'var $1 = $2;')
        else
            special_links = 'var special_links = [];';
    }
);
jQuery.get(chrome.extension.getURL('/jquery.js'),
    function(data) {
        var script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.innerHTML = data;
        document.getElementsByTagName("head")[0].appendChild(script);

        jQuery.get(chrome.extension.getURL('/injected.js'),
            function(data) {
                var script = document.createElement("script");
                script.setAttribute("type", "text/javascript");
                script.innerHTML = special_links + data;
                document.getElementsByTagName("head")[0].appendChild(script);
            }
        );
    }
);

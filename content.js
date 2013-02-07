chrome.storage.sync.get(
    ['special_links', 'special_options', 'gantt_keywords', 'scope'],
    function(data){

        var special_links = '';
        var special_options_issue_name = '';
        var gantt_keywords = '';
        var scope = '';

        if (data.special_links && data.special_links.length)
            special_links = JSON.stringify(data).replace(/(.*)\"special_links\"\:\[\[(.*?)\]\][\},\,](.*)/g, 'var special_links = [[$2]];');
        else
            special_links = 'var special_links = [];';

        if (data.special_options && data.special_options.length && data.special_options[0])
            special_options_issue_name += 'var special_options_issue_name = 1;';
        else
            special_options_issue_name += 'var special_options_issue_name = 0;';

        if (data.gantt_keywords && data.gantt_keywords.length)
            gantt_keywords = 'var gantt_keywords = ' + JSON.stringify(data.gantt_keywords) + ';';
        else
            gantt_keywords = 'var gantt_keywords = [];';

        if (data.scope && data.scope.length)
            scope = data.scope;
        else
            scope = 'redmine';

        // check scope
        if (location.href.search(scope) != -1)
        {
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
                            script.innerHTML = special_links + special_options_issue_name + gantt_keywords + data;
                            document.getElementsByTagName("head")[0].appendChild(script);
                        }
                    );
                }
            );
        }

    }

);
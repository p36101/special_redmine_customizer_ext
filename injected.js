// вывод ссылок
for (var i = 0; i < special_links.length; i++)
{
    jQuery('#top-menu ul:last').append('<li><a href="' + special_links[i][1] + '">' + special_links[i][0] + '</a></li>');
}

if (jQuery('#main-menu').find('li a.gantt').hasClass('selected'))
{
    // expand tree controls
    jQuery('#content h2:first').after('<fieldset class="collapsible" id="tree"><legend onclick="toggleFieldset(this);">Tree manipulation</legend><div><a id="tree_expand" href="#" class="icon icon-checked">expand</a><a style="margin-left: 20px" href="javascript:location.href=location.href;" class="icon icon-reload">reload</a></div></fieldset>');

    // meta issues highlight
    jQuery('.icon-issue').each(function(){
        for (var i = 0; i < gantt_keywords.length; i++)
        {
            if (jQuery(this).text().search(gantt_keywords[i]) != -1)
                jQuery(this).css('background-color' ,'rgb(208, 243, 236)');
        }
    });
}

if (special_options_issue_name)
{
    // create/update
    jQuery('#issue_tracker_id option').each(function(){
        jQuery(this).text(replace_str(jQuery(this).text()));
    });

    //view
    jQuery('h2').text(replace_word(jQuery('h2').text()));

    jQuery('.list.issues .tracker, .subject .issue, .issue-subject .issue').each(function(){
        jQuery(this).text(replace_word(jQuery(this).text()));
    });

    //title
    jQuery('title').text(replace_word(jQuery('title').text()));
}

function replace_word(str)
{
    var h2_issue = str.split(' ');
    h2_issue[0] = replace_str(h2_issue[0]);
    var rtn = '';

    for (var i = 0; i < h2_issue.length; i++)
    {
        rtn += h2_issue[i] + ' ';
    }

    return  rtn.trim();
}

function replace_str(str)
{
    if (str.toLowerCase() == 'bug')
        return 'Запилить';
    else if (str.toLowerCase() == 'feature')
        return 'Подпидорить';
    else if (str.toLowerCase() == 'inquiry')
        return 'Зашатать';
    else if (str.toLowerCase() == 'schedule')
        return 'Непонятная хрень';
    else if (str.toLowerCase() == 'requirement')
        return 'Другая непонятная хрень';
    else
        return str;
}

function expand_tree()
{
    jQuery('.issue-subject').css({'background-color': '#F7F7F7', 'width': ''});
    jQuery('.gantt_hdr').css({'border': '0px'});
    jQuery('.project-name:first').parents('td').css('width', '100%').children('div:first').css('width', '100%').children('div:first').css('width', '100%');
}

jQuery(document).ready(function(){
    jQuery('#tree_expand').live('click', function(){
        expand_tree();
        return false;
    });
});
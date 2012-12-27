for (var i = 0; i < special_links.length; i++)
{
    jQuery('#top-menu ul:last').append('<li><a href="' + special_links[i][1] + '">' + special_links[i][0] + '</a></li>');
}
//    console.log(jQuery('#loggedas a').text());
if (jQuery('#loggedas a:first').attr('href') == '/users/15')
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

console.log(h2_issue);
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
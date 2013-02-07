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
            if (jQuery(this).text().search(new RegExp(gantt_keywords[i], 'i')) != -1)
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

    if (location.pathname.search('time_entries/report') != -1)
    {
        var names = Array();
        var current_index = 0;
        jQuery('#time-report tbody tr').each(function(table_index,el){
            if (jQuery(this).find('td:first').text())
            {
                names[current_index] = Array(jQuery(this).find('td:first').text(), table_index, 0);
                if (names[current_index - 1] != undefined)
                    names[current_index - 1][2] = table_index;
                current_index++;
            }
        });
        names.pop();

        //console.log(names);
        if (names.length)
        {
            jQuery('#query_form p:last').after('Filter: <select id="report_filter_names"><option value=""></option></select>');
            for (var i = 0; i < names.length; i++)
            {
                jQuery('#report_filter_names').append('<option value="'+i+'">'+names[i][0]+'</option>');
            }
        }

        jQuery('#report_filter_names').live('change', function(){
            //restore
            jQuery('#time-report tbody tr').show();
            // ---

            var arr_index = jQuery(this).val();
            if (arr_index !== '')
            {
                jQuery('#time-report tbody tr').hide();
                for (var i = names[arr_index][1]; i < names[arr_index][2]; i++)
                {
                    jQuery('#time-report tbody tr:eq('+i+')').show();
                }
            }
        });
    }

    if (location.pathname.search('time_entries') != -1)
    {
        var tab_personal_url = jQuery('.tabs ul li:eq(1) a').attr('href');
        if (tab_personal_url.search('\\?') == -1)
            tab_personal_url += '?columns=day&criterias=member#tab_personal';
        else
            tab_personal_url += '&columns=day&criterias=member#tab_personal';

        jQuery('.tabs ul li:eq(1)').after('<li id="tab_personal"><a href="'+tab_personal_url+'">Personal</a></li>')

        if (location.hash == '#tab_personal')
        {

            jQuery('.tabs ul li a').removeClass('selected');
            jQuery('#tab_personal a').addClass('selected');
            jQuery('#query_form p:last').hide();
            jQuery('#query_form').attr('action', jQuery('#query_form').attr('action') + '#tab_personal');

            jQuery('#report_filter_names').live('change', function(){

                // restore data
                jQuery('.last-level').show();
                jQuery('#added').remove();
                // ---
                var filter_user_name = names[jQuery(this).val()][0];

                if (filter_user_name)
                {
                    jQuery('.last-level').each(function(){ if( jQuery(this).children('td:first').text() != filter_user_name ){ jQuery(this).hide() } });

                    var dates_head = new Array();
                    var dates_value = new Array();

                    jQuery('#time-report .period').each(function(i,el){dates_head[i] = jQuery(this).text()});
                    jQuery('.last-level:visible td.hours').each(function(i,el){dates_value[i] = jQuery(this).text()});
                    dates_value.pop();
//                    console.log(dates_value);
                    var first_day_of_week = new Date(dates_head[0]).getDay();
                    // monday first
                    first_day_of_week = (first_day_of_week == 0) ? 6 : first_day_of_week - 1;

                    jQuery('.autoscroll').after('<table id="added" class="cal" border="1"><thead><tr>' +
                        '<th scope="col">Monday</th>' +
                        '<th scope="col">Tuesday</th>' +
                        '<th scope="col">Wednesday</th>' +
                        '<th scope="col">Thursday</th>' +
                        '<th scope="col">Friday</th>' +
                        '<th scope="col">Saturday</th>' +
                        '<th scope="col">Sunday</th></tr>' +
                        '</thead><tr></tr></table>');

                    if (first_day_of_week != 0 && first_day_of_week != 6)
                    {
                        for (var j = 0; j < first_day_of_week; j++)
                        {
                            jQuery('#added tr:last').append('<td class="odd"></td>');
                        }
                    }

                    for (var i = 0; i < dates_value.length; i++)
                    {
                        if ((i + first_day_of_week) % 7 == 0)
                            jQuery('#added').append('<tr></tr>');

                        var current_date = new Date(dates_head[i]);
                        var current_date_is_weekend = (current_date.getDay() == 0 || current_date.getDay() == 6) ? true : false;
                        var today = new Date().getTime();
                        var current_date_sec = current_date.getTime();

                        var background = '';
                        if (current_date_sec <= today && !current_date_is_weekend)
                        {
                            if (dates_value[i] == '')
                                dates_value[i] = 0;

                            if (dates_value[i] < 7)
                                background = '#FDE0E7';
                            else
                                background = '#CFFFC0';
                        }

                        jQuery('#added tr:last').append('<td><p class="day-num">' + dates_head[i] + '</p><div style="text-align: center;padding: 28px 0;font-size: 21px;background-color: '+background+'">' + dates_value[i] + '</div></td>');
                    }
                }
            });
        }
    }
});
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

        names.sort(function(a, b){
            if (a[0] > b[0])
                return 1;
            else
                return -1;
        });

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
            tab_personal_url += '?columns=day&criterias=member#tab_personal;';
        else
            tab_personal_url += '&columns=day&criterias=member#tab_personal;';

        jQuery('.tabs ul li:eq(1)').after('<li id="tab_personal"><a href="'+tab_personal_url+'">Personal</a></li>');

        if (location.hash.search('tab_personal') != -1)
        {
            function set_action_hash() {

                var action = jQuery('#query_form').attr('action');
                action = action.replace(/#.*/, '');
                var action_hash = '#tab_personal;';
                var user_arr = location.hash.match(/filter_user=(.+?);/);
                if (user_arr)
                    action_hash += 'filter_user=' + user_arr[1] + ';';

                jQuery('#query_form').attr('action', action + action_hash);
            }

            jQuery('.tabs ul li a').removeClass('selected');
            jQuery('#tab_personal a').addClass('selected');
            jQuery('#query_form p:last').hide();
            set_action_hash();

            jQuery('#report_filter_names').live('change', function(){

                // restore data
                jQuery('.last-level').show();
                jQuery('.month_added').remove();
                // ---

                var filter_user_name = names[jQuery(this).val()][0];

                // save user to hash
                location.hash = location.hash.replace(/filter_user=.+?;/, '');
                location.hash += 'filter_user=' + filter_user_name + ';';
                set_action_hash();
                // ---

                if (filter_user_name)
                {
                    jQuery('.last-level').each(function(){ if( jQuery(this).children('td:first').text() != filter_user_name ){ jQuery(this).hide() } });

                    var dates_head = new Array();
                    var dates_value = new Array();

                    jQuery('#time-report .period').each(function(i,el){dates_head[i] = jQuery(this).text()});
                    jQuery('.last-level:visible td.hours').each(function(i,el){dates_value[i] = jQuery(this).text()});
                    dates_value.pop();

                    var calendar = new SpecialCalendar(dates_head[0], dates_head[dates_head.length - 1]);
                    var calendar_range = calendar.get_range();

                    var el_index = 0;

                    for(var cr_month in calendar_range)
                    {
                        if (calendar_range.hasOwnProperty(cr_month))
                        {
                            jQuery('.other-formats').before('<table class="month_added cal" border="1"><thead><tr>' +
                                '<th scope="col">Monday</th>' +
                                '<th scope="col">Tuesday</th>' +
                                '<th scope="col">Wednesday</th>' +
                                '<th scope="col">Thursday</th>' +
                                '<th scope="col">Friday</th>' +
                                '<th scope="col">Saturday</th>' +
                                '<th scope="col">Sunday</th></tr>' +
                                '</thead><tr></tr></table>'
                            );

                            var current_month = calendar_range[cr_month][0].date.getMonth();
                            var current_year = calendar_range[cr_month][0].date.getFullYear();
                            jQuery('.month_added:last thead').prepend('<tr style="background-color: #EEEEEE;font-size: 19px;"><td colspan="7">'+ calendar.months[current_month] + ', ' + current_year + '</td></tr>');

                            var first_day_of_month = calendar_range[cr_month][0].date.getDay();
                            // monday first
                            first_day_of_month = (first_day_of_month == 0) ? 6 : first_day_of_month - 1;
                            if (first_day_of_month != 0 && first_day_of_month != 6)
                            {
                                for (var j = 0; j < first_day_of_month; j++)
                                {
                                    jQuery('.month_added:last tr:last').append('<td style="border: none; background-color: #ffffff"></td>');
                                }
                            }

                            for(var cr_day in calendar_range[cr_month])
                            {
                                if (calendar_range[cr_month].hasOwnProperty(cr_day))
                                {
                                    var current_date = calendar_range[cr_month][cr_day].date;

                                    if (current_date.getDay() == 1)
                                    {
                                        jQuery('.month_added:last').append('<tr></tr>');
                                    }

                                    var current_date_is_weekend = !!(current_date.getDay() == 0 || current_date.getDay() == 6);
//                                    var today = new Date().getTime();
                                    var current_date_sec = current_date.getTime();

                                    var background = '#CCCCCC';
                                    var current_value = '';
                                    if (calendar_range[cr_month][cr_day].is_active)
                                    {
                                        current_value = dates_value[el_index];
                                        if (current_value == '' && !current_date_is_weekend)
                                            current_value = 0;

                                        if (current_value == 0 && current_date_is_weekend)
                                            background = '#CCCCCC';
                                        else if (current_value < 7)
                                            background = '#FDE0E7';
                                        else
                                            background = '#CFFFC0';
                                    }

                                    jQuery('.month_added:last tr:last').append(
                                        '<td style="background-color: '+background+'">' +
                                            '<p class="day-num">' + current_date.getDate() + '</p>' +
                                            '<div style="text-align: center;padding: 28px 0;font-size: 21px">' + current_value + '</div>' +
                                        '</td>'
                                    );

                                    if (calendar_range[cr_month][cr_day].is_active)
                                        el_index++;
                                }
                            }
                        }
                    }
                }
            });

            var user_arr = location.hash.match(/filter_user=(.+?);/);
            if (user_arr)
            {
                var user_index = jQuery('#report_filter_names option:contains('+user_arr[1]+')').val();
                if (user_index)
                    jQuery('#report_filter_names').val(user_index).change();
            }
        }
    }
});

// build full month object for specific range
function SpecialCalendar(date_from, date_to)
{
    this.months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    // 2013-01-23
    // 2013-02-24 23:59
    this.date_from = new Date(date_from + ' 00:00:00');
    this.date_to = new Date(date_to + ' 23:59:59');

    this.first_day = new Date(this.date_from.getFullYear(), this.date_from.getMonth(), 1);
    this.last_day = new Date(this.date_to.getFullYear(), this.date_to.getMonth() + 1, 0);

    var today = new Date();

    this.get_range = function()
    {
        var dates_obj = {};
        for (var i = this.first_day.getTime(); i <= this.last_day.getTime(); i += 24*60*60*1000)
        {
            var i_date = new Date(i);
            var month_str = this.months[i_date.getMonth()];

            if (dates_obj[month_str] == undefined)
                dates_obj[month_str] = [];

            var active_date = false;
            if (i >= this.date_from.getTime() && i <= this.date_to.getTime() && i <= today.getTime())
                active_date = true;
            dates_obj[month_str].push({is_active: active_date,date: i_date});
        }
        return dates_obj;
    }
}
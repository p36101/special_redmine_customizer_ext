/**
 * User: smakarmyzhin
 * Date: 15.12.12
 * Time: 18:24
 */
// Saves options to localStorage.
function save_options() {

    var store_data = [];
    jQuery('.pair').each(function(){
        if (jQuery(this).children('.new_name').val())
            store_data.push([jQuery(this).children('.new_name').val(), jQuery(this).children('.new_link').val()]);
    });

    if (store_data.length)
    {
        chrome.storage.sync.set(
            {'special_links': store_data},
            function() {
                jQuery('#status').text('data saved').fadeIn().fadeOut(1000);
            }
        );
    }
    else
    {
        chrome.storage.sync.remove(
            'special_links',
            function() {
                jQuery('#status').text('data saved').fadeIn().fadeOut(1000);
            }
        );
    }
}

jQuery(document).ready(function(){

    //load saved data
    var $data_container = jQuery('#data_container');
    var $kw_data_container = jQuery('#kw_data_container');
    var options_arr = [];

    chrome.storage.sync.get(
        ['special_links', 'special_options', 'gantt_keywords', 'scope'],
        function(data){
            if (data.special_links && data.special_links.length)
            {
                for (var i = 0; i < data.special_links.length; i++)
                {
                    $data_container.append(
                        '<div class="pair">' +
                            '<input type="text" class="new_name" value="'+ data.special_links[i][0] +'">' +
                            '<input type="text" class="new_link" value="'+ data.special_links[i][1] +'">' +
                        '</div>'
                    );
                }
            }
            else
            {
                $data_container.append('<div class="pair"><input type="text" class="new_name"><input type="text" class="new_link"></div>');
            }

            if (data.special_options && data.special_options.length)
            {
                if (data.special_options[0])
                    jQuery('#spec_ops').attr('checked', 'checked');
            }
            console.log(data);
            if (data.gantt_keywords && data.gantt_keywords.length)
            {
                for (var i = 0; i < data.gantt_keywords.length; i++)
                {
                    $kw_data_container.append(
                        '<div><input type="text" class="new_kw" value="'+data.gantt_keywords[i]+'"></div>'
                    );
                }
            }
            else
                $kw_data_container.append('<div><input type="text" class="new_kw"></div>');

            if (data.scope)
                jQuery('#scope_value').val(data.scope);
        }
    );


    jQuery('#add_link').click(function(){
        jQuery('.pair:last').after('<div class="pair"><input type="text" class="new_name"><input type="text" class="new_link"></div>');
        jQuery('.pair:last .new_name').focus();
    });

    jQuery('#add_kw').click(function(){
        jQuery('#kw_data_container div:last').after('<div><input type="text" class="new_kw"></div>');
        jQuery('.new_kw:last').focus();
    });

    jQuery('#save').submit(function(){
        save_options();
        return false;
    });

    // save Special issue names option
    jQuery('#spec_ops').click(function(){

        if (jQuery(this).is(':checked'))
            options_arr[0] = 1;
        else
            options_arr[0] = 0;

        chrome.storage.sync.set(
            {'special_options': options_arr},
            function() {
               jQuery('#status_0').text('data saved').fadeIn().fadeOut(1000);
            }
        );
    });

    // save scope
    jQuery('#scope_value').keydown(function(event){
        console.log(event.which);
        if (event.which == 13)
        {
            chrome.storage.sync.set(
                {'scope': jQuery(this).val()},
                function() {
                    jQuery('#status_scope').text('data saved').fadeIn().fadeOut(1000);
                }
            );
        }
    });

    jQuery('#keywords').submit(function(){
        var store_data = [];
        jQuery('.new_kw').each(function(){
            if (jQuery(this).val())
                store_data.push(jQuery(this).val());
        });

        chrome.storage.sync.set(
            {'gantt_keywords': store_data},
            function() {
                jQuery('#kw_status').text('data saved').fadeIn().fadeOut(1000);
            }
        );

        return false;
    });

    jQuery('#reset_kw').click(function(){
        jQuery('#kw_data_container')
            .html('')
            .append(
                '<div><input type="text" class="new_kw" value="Управление"></div>' +
                '<div><input type="text" class="new_kw" value="Программирование"></div>' +
                '<div><input type="text" class="new_kw" value="Дизайн"></div>' +
                '<div><input type="text" class="new_kw" value="Верстка"></div>' +
                '<div><input type="text" class="new_kw" value="Администрирование"></div>'
            );
    });
});
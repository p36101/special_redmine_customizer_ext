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

    chrome.storage.sync.set(
        {'special_links': store_data},
        function() {
            jQuery('#status').text('data saved').fadeIn().fadeOut(1000);
        }
    );
}

jQuery(document).ready(function(){

    //load saved data
    var $data_container = jQuery('#data_container');
    chrome.storage.sync.get(
        'special_links',
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
        }
    );


    jQuery('#add_link').click(function(){
        jQuery('.pair:last').after('<div class="pair"><input type="text" class="new_name"><input type="text" class="new_link"></div>');
        jQuery('.pair:last .new_name').focus();
    });

    jQuery('#save').click(function(){
        save_options();
    });
})


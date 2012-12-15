for (var i = 0; i < special_links.length; i++)
{
    jQuery('#top-menu ul:last').append('<li><a href="' + special_links[i][1] + '">' + special_links[i][0] + '</a></li>');
}

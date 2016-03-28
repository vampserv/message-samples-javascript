var featureContainer;
var featureTitle;
var featureList;
var allFeatureItems;
var noAuthFeatureItems;
var resultContainer;
var userInfoContainer;
var loginFeatureItem;

$(document).ready(function() {
    featureContainer = $('#feature-container');
    featureTitle = $('#feature-title');
    featureList = $('#feature-list a');
    allFeatureItems = $('.list-group-item');
    noAuthFeatureItems = $('.list-group-item[class~="no-auth-required"]');
    userInfoContainer = $('#user-info-container');
    loginFeatureItem = $('.list-group-item.no-auth-required').first();

    featureList.click(function(e) {
        e.preventDefault();
        featureList.removeClass('active');
        $(this).addClass('active');
    });

    featureContainer.find('a').click(function(e) {
        e.preventDefault();
        return false;
    });
});

function renderTmpl(id, extras) {
    featureTitle.html((id ? id.replace(/-/g, ' ') : '') + (extras ? (' - ' + extras) : ''));
    featureContainer.html(id ? tmpl(id, Max.getCurrentUser()) : '');
}

function handleLogin(enable) {
    if (enable) {
        allFeatureItems.show();
        userInfoContainer.html('logged in as <b>' + (Max.getCurrentUser() || {}).userName + '</b>');
    } else {
        allFeatureItems.hide();
        noAuthFeatureItems.show();
        userInfoContainer.html('');
        renderTmpl();
        loginFeatureItem.addClass('active').next().addClass('in');
    }
}

function collectFormData(containerId) {
    var obj = {};
    $('#' + containerId).find('input, textarea, select').each(function() {
        var val = $.trim($(this).val());
        if (['true', 'false'].indexOf(val) != -1) {
            val = val === 'true';
        }
        obj[$(this).attr('name')] = val
    });
    return obj;
}

function renderResults(output, insertType, target) {
    insertType = (insertType === true || insertType === false) ? 'append' : insertType;
    resultContainer = $(target || '#results');
    resultContainer[insertType ? insertType : 'html'](output);
    resultContainer.css('opacity', 0);
    if (resultContainer.hasClass('panel')) {
        //resultContainer.css('border', 'solid 1px #888');
    }
    resultContainer.animate({
        opacity: 1
    }, 500, function() {
        //if (resultContainer.hasClass('panel')) {
        //    setTimeout(function() {
        //        resultContainer.css('background-color', '#fff');
        //    }, 3000);
        //}
    });
}

function channelDisplayHelper(channelsOrChannels) {
    var html = '';

    if (channelsOrChannels.constructor !== Array) {
        channelsOrChannels = [channelsOrChannels];
    }

    for (var key in channelsOrChannels) {
        var chan = channelsOrChannels[key];
        html += '<a href="#" class="list-group-item" ' +
            'onclick="Channel.goToChannel(event, \'' + chan.name + '\', \''
            + chan.ownerUserID + '\', ' + chan.isPublic + ');">'
            + chan.name + (chan.isPublic ? '' : ' <span class="glyphicon glyphicon-lock"></span>') + '</a>';
    }
    return channelsOrChannels.length ? ('<ul class="list-group">' + html + '</ul>') : '<div class="panel panel-default">no channels found</div>';
}

function userDisplayHelper(userOrUsers) {
    var html = '';

    if (userOrUsers.constructor !== Array) {
        userOrUsers = [userOrUsers];
    }

    for (var key in userOrUsers) {
        html += '<li class="list-group-item"><b>' + userOrUsers[key].userName + '</b> (id: ' + userOrUsers[key].userId + ')' +  '</li>';
    }
    return userOrUsers.length ? ('<ul class="list-group">' + html + '</ul>') : '<div class="panel panel-default">no users found</div>';
}

function messageDisplayHelper(messageOrMessages) {
    var html = '';

    if (messageOrMessages.constructor !== Array) {
        messageOrMessages = [messageOrMessages];
    }

    for (var i=0;i<messageOrMessages.length;++i) {
        html += '<b>' + messageOrMessages[i].sender.userName + '</b>: '
            + messageOrMessages[i].messageContent.message + '<br />';
    }
    return html || 'no messages found';
}
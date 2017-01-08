var Footnotes = {
    footnotetimeout: false,
    setup: function() {
        var footnotelinks = jQuery('.footnoteRef')

        footnotelinks.unbind('mouseover', Footnotes.footnoteover);
        footnotelinks.unbind('mouseout', Footnotes.footnoteoout);

        footnotelinks.bind('mouseover', Footnotes.footnoteover);
        footnotelinks.bind('mouseout', Footnotes.footnoteoout);
    },
    footnoteover: function() {
        clearTimeout(Footnotes.footnotetimeout);
        jQuery('#footnotediv').stop();
        jQuery('#footnotediv').remove();

        var id = jQuery(this).attr('href').substr(1);
        var position = jQuery(this).offset();

        var div = jQuery(document.createElement('div'));
        div.attr('id', 'footnotediv');
        div.bind('mouseover', Footnotes.divover);
        div.bind('mouseout', Footnotes.footnoteoout);

        var el = document.getElementById(id);
        div.html('<div>' + jQuery(el).html() + '</div>');

        jQuery(document.body).append(div);

        var left = position.left;
        if (left + 420 > jQuery(window).width() + jQuery(window).scrollLeft())
            left = jQuery(window).width() - 420 + jQuery(window).scrollLeft();
        var top = position.top + 20;
        if (top + div.height() > jQuery(window).height() + jQuery(window).scrollTop())
            top = position.top - div.height() - 15;
        div.css({
            left: left,
            top: top,
            opacity: 1,
            position: "absolute"
        });
    },
    footnoteoout: function() {
        Footnotes.footnotetimeout = setTimeout(function() {
            jQuery('#footnotediv').animate({
                opacity: 0
            }, 300, function() {
                jQuery('#footnotediv').remove();
            });
        }, 100);
    },
    divover: function() {
        clearTimeout(Footnotes.footnotetimeout);
        jQuery('#footnotediv').stop();
        jQuery('#footnotediv').css({
            opacity: 1
        });
    }
}
var d = document.getElementsByTagName("body");
    d[0].className += " isMobile";
Footnotes.setup();
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
    var d = document.getElementsByTagName("body");
    d[0].className += " isMobile";
}

jQuery(document).ready(function() {
    var ToC = "<h6>Table of Contents</h6>" +
        "<nav role='navigation'>" +
        "<ul>";

    var newLine, el, title, link;

    $("article h4").each(function() {

        el = $(this);
        title = el.text();
        link = "#" + el.attr("id");

        newLine =
            "<li>" +
            "<a href='" + link + "'>" +
            title +
            "</a>" +
            "</li>";

        ToC += newLine;

    });

    ToC +=
        "</ul>" +
        "</nav>";

    $(".table-of-contents").prepend(ToC);
    $(".footnotes").prepend("<h5>References</h5>");

    $.fn.taggin = function() {
        $('<input />').attr({
            type: 'text',
            class: 'tagger',
            name: 'tagger',
            placeholder: 'A tag',
            autocomplete: 'off'
        }).appendTo(this);
        if ($('.tagged').length < 0) {
            $('<div>').attr({
                class: 'tagged'
            }).prependTo(this);
            $('<ul>').appendTo('.tagged', this);
            $('<input>').attr({
                type: 'hidden',
                class: 'tags',
                name: 'tags'
            }).appendTo(this);
        }

        $('.tags input.tagger').keypress(function(event) {
            if (event.which == 13) {
                event.preventDefault();
                var val = $(this).val();
                var j1 = new RegExp(val, 'g');
                $('<li>' + val + '<span class="rm">x</span></li>').appendTo('.tagged ul');
                var current_tags = $('.tags input.tags').val();
                if (current_tags.length === 0) {
                    var updated_tags = current_tags.concat(val);
                } else {
                    var updated_tags = current_tags.concat(', ' + val);
                }
                $('.tags input.tags').val(updated_tags);

                $(this).val('');
            }
        });

        this.on('click', '.tagged ul li span.rm', function() {
            this.closest('li').remove();
            var tag_id = $(this).closest('li').clone().children().remove().end().text();
            if ($('.tags input.tags').val().toLowerCase().indexOf(tag_id) >= 0) {
                if ($('.tags input.tags').val().indexOf(', ' + tag_id) >= 0) {
                    var o1 = new RegExp(', ' + tag_id, 'g');
                    var o2 = new RegExp(tag_id, 'g');
                    var updated_tags = $('.tags input.tags').val().replace(o1, '');
                    var updated_tags = updated_tags.replace(o2, '');
                    if (updated_tags.substring(0, 2) == ", ") {
                        var updated_tags = updated_tags.replace(', ', '');
                    }
                } else {
                    var o = new RegExp(tag_id, 'g');
                    var updated_tags = $('.tags input.tags').val().replace(o, '');
                }
                if (updated_tags.substring(0, 2) == ", ") {
                    var updated_tags = updated_tags.replace(', ', '');
                }
                $('.tags input.tags').val(updated_tags);
            }
        });
    }

    $.fn.slugCreator = function(options) {
        var weburl = 'https://scif.ml/',
            url_viewer = $('.url-viewer');
        if (options.is_page == true) {
            weburl = 'https://scif.ml/';
        }
        $(this).on('keyup', function() {
            if ($(this).val().length > 0) {
                url_viewer.css('display', 'inline-block');
                if (options.is_page == true) {
                    var str = $(this).val().replace(/ /g, '_').replace(/[&\/\\#,+()$~%.'":*?<>{} ]/g, '');
                } else {
                    var str = $(this).val().toLowerCase().replace(/ /g, '-').replace(/[&\/\\#,+()$~%.'":*?<>{} ]/g, '');
                }
                url_viewer.html('URL: <span class="link">' + weburl + str + '</a></span> <span><a href="#" class="modify_slug">Modify</a></span> <span><a href="' + weburl + str + '" target="_blank">View post</a></span>');
                $(this).next().find('input[name="slug"]').val(str);
            } else {
                url_viewer.hide();
            }
        });

        $(this).next().on('click', 'a.modify_slug', function() {
            $(this).closest('.url-viewer').next('.slug-input').attr({
                type: 'text'
            });
        });
    }

    $('article.form form input').attr('autocomplete', 'off');
    $('div.tags').taggin();
    $('.slug-input-gen').slugCreator({
        is_page: false
    });
    $('.slug-input-gen-page').slugCreator({
        is_page: true
    });

    /* TOOLTIP */
    $(".tooltip").hover(function() {
        $('.tooltip-content', this).stop().fadeIn(700);
    }, function() {
        $('.tooltip-content', this).stop().fadeOut(700);
    });
});
$(function(){

    var app = {};

    app.navbar_fix_toggle =     $('#navbar-fixed-toggle');
    app.navbar_fixed_wrap =     $('.navbar-fixed-wrap');
    app.top_right_bar =         $('.top-right-bar');
    app.offcanvas_toggle =      $('[data-toggle = "offcanvas"]');

    app.navbar_fix_toggle.on('click', function(){

        var target = $($(this).data('target'));

        target.toggleClass('in');

    });

    app.offcanvas_toggle.on('click', function(){

        var target = $($(this).data('target'));

        target.toggleClass('active');

    });

    navbarsOnScroll();

    $(window).on('scroll', navbarsOnScroll);

    $(window).on('resize', function(){
        console.log('resize');
    });

    $(document).ready(function(){
        $('.owl-carousel').owlCarousel({
            items: 1,
            loop: true,
            nav: true,
            navText: false,
            dots: true,
            autoplay: true
        });

        $('.colorbox-image').colorbox({
            rel: function(){
                return $(this).data('gallery');
            },
            scrolling: false,
            transition: "none",
            maxWidth: "100%",
            maxHeight: "100%"
        });

        $('.youtube').colorbox({
            iframe:true,
            transition: "none",
            scrolling: false,
            width: "80%",
            height: "80%",
            href: function(){
                var videoId = new RegExp('[\\?&]v=([^&#]*)').exec(this.href);
                if (videoId && videoId[1]) {
                    return 'http://youtube.com/embed/'+videoId[1]+'?rel=0&wmode=transparent&autoplay=1';
                }
            }
        });

    });

    function navbarsOnScroll(){

        var scroll =  window.scrollY || document.documentElement.scrollTop;

        if (scroll === 0){
            app.navbar_fixed_wrap.addClass('sticky');
            app.top_right_bar.addClass('in');
        } else {
            app.navbar_fixed_wrap.removeClass('sticky');
            app.top_right_bar.removeClass('in');
        }
    }


});

+function ($) {
    'use strict';

    // TAB CLASS DEFINITION
    // ====================

    var Tab = function (element) {
        // jscs:disable requireDollarBeforejQueryAssignment
        this.element = $(element)
        // jscs:enable requireDollarBeforejQueryAssignment
    }

    Tab.VERSION = '3.3.7'

    Tab.TRANSITION_DURATION = 150

    Tab.prototype.show = function () {
        var $this    = this.element
        var $ul      = $this.closest('ul:not(.dropdown-menu)')
        var selector = $this.data('target')

        if (!selector) {
            selector = $this.attr('href')
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
        }

        if ($this.parent('li').hasClass('active')) return

        var $previous = $ul.find('.active:last a')
        var hideEvent = $.Event('hide.bs.tab', {
            relatedTarget: $this[0]
        })
        var showEvent = $.Event('show.bs.tab', {
            relatedTarget: $previous[0]
        })

        $previous.trigger(hideEvent)
        $this.trigger(showEvent)

        if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

        var $target = $(selector)

        this.activate($this.closest('li'), $ul)
        this.activate($target, $target.parent(), function () {
            $previous.trigger({
                type: 'hidden.bs.tab',
                relatedTarget: $this[0]
            })
            $this.trigger({
                type: 'shown.bs.tab',
                relatedTarget: $previous[0]
            })
        })
    }

    Tab.prototype.activate = function (element, container, callback) {
        var $active    = container.find('> .active')
        var transition = callback
            && $.support.transition
            && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

        function next() {
            $active
                .removeClass('active')
                .find('> .dropdown-menu > .active')
                .removeClass('active')
                .end()
                .find('[data-toggle="tab"]')
                .attr('aria-expanded', false)

            element
                .addClass('active')
                .find('[data-toggle="tab"]')
                .attr('aria-expanded', true)

            if (transition) {
                element[0].offsetWidth // reflow for transition
                element.addClass('in')
            } else {
                element.removeClass('fade')
            }

            if (element.parent('.dropdown-menu').length) {
                element
                    .closest('li.dropdown')
                    .addClass('active')
                    .end()
                    .find('[data-toggle="tab"]')
                    .attr('aria-expanded', true)
            }

            callback && callback()
        }

        $active.length && transition ?
            $active
                .one('bsTransitionEnd', next)
                .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
            next()

        $active.removeClass('in')
    }


    // TAB PLUGIN DEFINITION
    // =====================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('bs.tab')
            console.log($this);


            if (!data) $this.data('bs.tab', (data = new Tab(this)))
            if (typeof option == 'string') data[option]()
            console.log(data);
        })
    }

    var old = $.fn.tab

    $.fn.tab             = Plugin
    $.fn.tab.Constructor = Tab


    // TAB NO CONFLICT
    // ===============

    $.fn.tab.noConflict = function () {
        $.fn.tab = old
        return this
    }


    // TAB DATA-API
    // ============

    var clickHandler = function (e) {
        e.preventDefault()
        console.log('clickhandler');
        Plugin.call($(this), 'show')
    }

    $(document)
        .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
        .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);
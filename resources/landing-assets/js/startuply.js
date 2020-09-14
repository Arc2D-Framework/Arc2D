/*
*
* Custom js snippets for Startuply v2.0
* by Vivaco
*
*/

var Startuply;

;(function($){

    $(document).on('ready', function () {
        Startuply.init();
    });

})( jQuery );


// Main theme functions start
Startuply = {
    defaults: {
        log: false,
        styleSwitcher: false,
        animations: true,
        onePageNav: true,
        onePageNavHashChange: false,
        alwaysMobileMenuMode: false,
        mobileMenuMaxWidth: 768,
        stickyMenuMode: true,
        stickyMenuOffset: 500,
        smoothScroll: false,
        smoothScrollSpeed: 800,
        ajaxedForm: true,
        ajaxedFormSuccessMsg: 'Success',
        ajaxedFormErrorMsg: 'An error occured. Please try again later.',
        toastrPositionClass: 'toast-top-full-width'
    },

    mobileDevice: false,
    mobileMenuView: false,

    //flexslider for testimonials and gallery
    flexsliderOptions: {
        manualControls: '.flex-manual .switch',
        nextText: '',
        prevText: '',
        startAt: 1,
        slideshow: false,
        direction: 'horizontal',
        animation: 'slide'
    },

    log: function (msg) {
        if ( this.options.log ) console.log('%cStartupLy Log: ' + msg, 'color: #1ac6ff');
    },

    buildStyleSwitcher: function () {
        var template = '<div class="style-switcher"><a href="#" class="style-toggle"><i class="fa fa-cog"></i></a><h6>Color palette</h6><ul class="template-set-color"><li><a data-color="Blue" class="color blue" href="#" title="style"></a></li><li><a data-color="Pink" class="color pink" href="#" title="main-pink"></a></li><li><a data-color="Green" class="color green" href="#" title="main-green"></a></li><li><a data-color="Berry" class="color berry" href="#" title="main-berry"></a></li><li><a data-color="Orange" class="color orange" href="#" title="main-orange"></a></li></ul><div class="template-animations-switch"><h6>Animations</h6><input id="animations_switch" type="checkbox" checked="checked" /><label for="animations_switch"><i></i></label></div></div>'

        $('body').append(template);
    },

    // check if site is laoded from mobile device
    checkMobile: function () {
        if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || $(window).width() < this.options.mobileMenuMaxWidth ) {
            this.mobileDevice = true;

            this.log('Mobile device');
        }else {
            this.log('Desktop')
        }
    },

    // init animations on page
    initAnimations: function () {
        var _this = this;

        if ( this.mobileDevice || !this.options.animations ) {
            $('.animated').css('opacity', 1);

            this.log( 'Remove animations' );

            $('.animated.counter-block .value').each(function () {
                $(this).text($(this).data('to'));
            });

        }else if ( typeof $.fn.appear == 'function' ) {
            this.log( 'Init animations' );

            $('.animated').appear(function() {
                var $el = $(this),
                    animation = $el.data('animation'),
                    animationDelay = $el.data('delay') || 0,
                    animationDuration = $el.data('duration') || 1000;

                if ( _this.options.animations ) {
                    $el.css({
                        '-webkit-animation-delay': animationDelay + 'ms',
                        'animation-delay': animationDelay + 'ms',
                        '-webkit-animation-duration': animationDuration/1000 + 's',
                        'animation-duration': animationDuration/1000 + 's'
                    });

                    $el.addClass(animation);

                    _this.log( 'Play animation ' + animation + ' with delay = ' + animationDelay + 'ms and duration = ' + animationDuration + 'ms');

                    // $el.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                    //     $(this).removeClass(animation);
                    // });

                    $el.one('webkitAnimationStart mozAnimationStart MSAnimationStart oanimationstart animationstart', function() {
                        if ( typeof $.fn.countTo == 'function' ) {
                            if ( $el.hasClass('counter-block') ) $el.find('.value').countTo();
                        } else {
                            _this.log( 'Can\'t find jQuery.countTo function' );
                        }
                    });

                }else {
                    $el.removeClass('animated');

                    if ( typeof $.fn.countTo == 'function' ) {
                        if ( $el.hasClass('counter-block') ) $el.find('.value').countTo();
                    } else {
                        _this.log( 'Can\'t find jQuery.countTo function' );
                    }
                }
            }, {accY: -150});

        }else {
            $('.animated').css('opacity', 1);

            this.log( 'Can\'t find jQuery.appear function' );
            this.log( 'Remove animations' );
        }
    },

    //check mobile view
    mobileMenuStatus: function () {
        if ( window.innerWidth < this.options.mobileMenuMaxWidth || this.options.alwaysMobileMenuMode ) {
            this.mobileMenuView = true;

        }else {
            this.mobileMenuView = false;

        }

        if ( this.options.alwaysMobileMenuMode ) {
            $('body').addClass('always-mobile');

        }

        this.log( 'Mobile menu view ' + ((this.mobileMenuView) ? 'on' : 'off') );

        if ( this.mobileMenuView ) {
            $('.navigation-header .navigation-navbar').css({
                'height': $(window).height(),
                'max-height': $(window).height()
            });

        }else {
            $('.navigation-header .navigation-navbar').css({
                'height': '',
                'max-height': ''
            });

            $('.dropdown').removeClass('opened');
            $('.dropdown-menu').css('display', '');

        }
    },

    //custom, super-fast smooth scrolling
    smoothScrollInit: function () {
        var _this = this;

        !function(){function e(){var e=!1;e&&c("keydown",r),v.keyboardSupport&&!e&&u("keydown",r)}function t(){if(document.body){var t=document.body,o=document.documentElement,n=window.innerHeight,r=t.scrollHeight;if(S=document.compatMode.indexOf("CSS")>=0?o:t,w=t,e(),x=!0,top!=self)y=!0;else if(r>n&&(t.offsetHeight<=n||o.offsetHeight<=n)){var a=!1,i=function(){a||o.scrollHeight==document.height||(a=!0,setTimeout(function(){o.style.height=document.height+"px",a=!1},500))};if(o.style.height="auto",setTimeout(i,10),S.offsetHeight<=n){var l=document.createElement("div");l.style.clear="both",t.appendChild(l)}}v.fixedBackground||b||(t.style.backgroundAttachment="scroll",o.style.backgroundAttachment="scroll")}}function o(e,t,o,n){if(n||(n=1e3),d(t,o),1!=v.accelerationMax){var r=+new Date,a=r-C;if(a<v.accelerationDelta){var i=(1+30/a)/2;i>1&&(i=Math.min(i,v.accelerationMax),t*=i,o*=i)}C=+new Date}if(M.push({x:t,y:o,lastX:0>t?.99:-.99,lastY:0>o?.99:-.99,start:+new Date}),!T){var l=e===document.body,u=function(){for(var r=+new Date,a=0,i=0,c=0;c<M.length;c++){var s=M[c],d=r-s.start,f=d>=v.animationTime,h=f?1:d/v.animationTime;v.pulseAlgorithm&&(h=p(h));var m=s.x*h-s.lastX>>0,w=s.y*h-s.lastY>>0;a+=m,i+=w,s.lastX+=m,s.lastY+=w,f&&(M.splice(c,1),c--)}l?window.scrollBy(a,i):(a&&(e.scrollLeft+=a),i&&(e.scrollTop+=i)),t||o||(M=[]),M.length?E(u,e,n/v.frameRate+1):T=!1};E(u,e,0),T=!0}}function n(e){x||t();var n=e.target,r=l(n);if(!r||e.defaultPrevented||s(w,"embed")||s(n,"embed")&&/\.pdf/i.test(n.src))return!0;var a=e.wheelDeltaX||0,i=e.wheelDeltaY||0;return a||i||(i=e.wheelDelta||0),!v.touchpadSupport&&f(i)?!0:(Math.abs(a)>1.2&&(a*=v.stepSize/120),Math.abs(i)>1.2&&(i*=v.stepSize/120),o(r,-a,-i),e.preventDefault(),void 0)}function r(e){var t=e.target,n=e.ctrlKey||e.altKey||e.metaKey||e.shiftKey&&e.keyCode!==H.spacebar;if(/input|textarea|select|embed/i.test(t.nodeName)||t.isContentEditable||e.defaultPrevented||n)return!0;if(s(t,"button")&&e.keyCode===H.spacebar)return!0;var r,a=0,i=0,u=l(w),c=u.clientHeight;switch(u==document.body&&(c=window.innerHeight),e.keyCode){case H.up:i=-v.arrowScroll;break;case H.down:i=v.arrowScroll;break;case H.spacebar:r=e.shiftKey?1:-1,i=-r*c*.9;break;case H.pageup:i=.9*-c;break;case H.pagedown:i=.9*c;break;case H.home:i=-u.scrollTop;break;case H.end:var d=u.scrollHeight-u.scrollTop-c;i=d>0?d+10:0;break;case H.left:a=-v.arrowScroll;break;case H.right:a=v.arrowScroll;break;default:return!0}o(u,a,i),e.preventDefault()}function a(e){w=e.target}function i(e,t){for(var o=e.length;o--;)z[N(e[o])]=t;return t}function l(e){var t=[],o=S.scrollHeight;do{var n=z[N(e)];if(n)return i(t,n);if(t.push(e),o===e.scrollHeight){if(!y||S.clientHeight+10<o)return i(t,document.body)}else if(e.clientHeight+10<e.scrollHeight&&(overflow=getComputedStyle(e,"").getPropertyValue("overflow-y"),"scroll"===overflow||"auto"===overflow))return i(t,e)}while(e=e.parentNode)}function u(e,t,o){window.addEventListener(e,t,o||!1)}function c(e,t,o){window.removeEventListener(e,t,o||!1)}function s(e,t){return(e.nodeName||"").toLowerCase()===t.toLowerCase()}function d(e,t){e=e>0?1:-1,t=t>0?1:-1,(k.x!==e||k.y!==t)&&(k.x=e,k.y=t,M=[],C=0)}function f(e){if(e){e=Math.abs(e),D.push(e),D.shift(),clearTimeout(A);var t=D[0]==D[1]&&D[1]==D[2],o=h(D[0],120)&&h(D[1],120)&&h(D[2],120);return!(t||o)}}function h(e,t){return Math.floor(e/t)==e/t}function m(e){var t,o,n;return e*=v.pulseScale,1>e?t=e-(1-Math.exp(-e)):(o=Math.exp(-1),e-=1,n=1-Math.exp(-e),t=o+n*(1-o)),t*v.pulseNormalize}function p(e){return e>=1?1:0>=e?0:(1==v.pulseNormalize&&(v.pulseNormalize/=m(1)),m(e))}var w,g={frameRate:150,animationTime:_this.options.smoothScrollSpeed,stepSize:120,pulseAlgorithm:!0,pulseScale:8,pulseNormalize:1,accelerationDelta:20,accelerationMax:1,keyboardSupport:!0,arrowScroll:50,touchpadSupport:!0,fixedBackground:!0,excluded:""},v=g,b=!1,y=!1,k={x:0,y:0},x=!1,S=document.documentElement,D=[120,120,120],H={left:37,up:38,right:39,down:40,spacebar:32,pageup:33,pagedown:34,end:35,home:36},v=g,M=[],T=!1,C=+new Date,z={};setInterval(function(){z={}},1e4);var A,N=function(){var e=0;return function(t){return t.uniqueID||(t.uniqueID=e++)}}(),E=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||function(e,t,o){window.setTimeout(e,o||1e3/60)}}(),K=/chrome/i.test(window.navigator.userAgent),L="onmousewheel"in document;L&&K&&(u("mousedown",a),u("mousewheel",n),u("load",t))}();

        this.log( 'Init smooth scroll (speed = ' + this.smoothScrollSpeed + 'ms)');

    },

    windowHeightBlock: function () {
        var $blocks = $('.window-height'),
            height = window.innerHeight;

        if ( $blocks.length ) {
            $blocks.each(function () {
                $(this).css('min-height', height);
            });
        }

        this.log( 'Init window height blocks');
    },

    centeredBlock: function() {
        var $blocks = $('.centered-block');

        if ( $blocks.length ) {
            $blocks.each( function () {
                var $el = $(this),
                    $parent = $el.parent(),
                    elHeight = $el.outerHeight(),
                    parentHeight = $parent.outerHeight(),
                    padding = (parentHeight - elHeight) / 2;

                if ( padding >= 0 ) {
                    $parent.css({'padding-top': padding, 'padding-bottom': 0 });
                }
            });
        }

        this.log( 'Init centered blocks');
    },

    videoBackgroundInit: function () {
        var _this = this;

        $('.ytp-player-background').each( function() {
            var $el = $(this),
                $player,
                controlsTempalte;

            if ( $el.data('video') && $el.data('video').length ) {
                $el.css('background-image', 'url(https://i.ytimg.com/vi/' + $el.data('video') + '/maxresdefault.jpg)')
            }

            if( !_this.mobileDevice && typeof $.fn.YTPlayer == 'function' ) {
                _this.log( 'Init video background blocks');

                $player = $el.YTPlayer();
                controlsTempalte = '<div class="video-conrols">' +
                                       '<i class="yt-play-btn-big"></i>' +
                                       '<div class="bottom">' +
                                           '<div class="controls-container">' +
                                               '<i class="yt-play-toggle"></i>' +
                                               '<i class="yt-mute-toggle active"></i>' +
                                               '<div class="yt-volume-slider"></div>' +
                                           '</div>' +
                                       '</div>' +
                                   '<div>';

                $el.append(controlsTempalte);

                var $playBtn = $el.find('.yt-play-btn-big'),
                    $playToggle = $el.find('.yt-play-toggle'),
                    $muteToggle = $el.find('.yt-mute-toggle'),
                    $volumeSlider = $el.find('.yt-volume-slider');

                if ( typeof $.fn.slider == 'function' ) {
                    $volumeSlider.slider({
                        range: 'min',
                        min: 0,
                        max: 100,
                        step: 5,
                        value: 50,

                        slide: function ( event, ui ) {
                            $player.setYTPVolume(ui.value);
                        }
                    });
                }else {
                    this.log( 'Can\'t find jQuery.slider function. Volumn slider doesn\'t work.');
                }

                $playBtn.on('click.startuply', function () {
                    $player.getPlayer().playVideo();
                });

                $playToggle.on('click.startuply', function () {
                    if ( $(this).is('.active') ) $player.getPlayer().playVideo();
                    else $player.getPlayer().pauseVideo();
                });

                $muteToggle.on('click.startuply', function () {
                    $player.toggleVolume();
                });

                $player.on('YTPStart.startuply', function () {
                    $playBtn.fadeOut(300);
                    $playToggle.removeClass('active');
                });

                $player.on('YTPPause.startuply', function () {
                    $playBtn.fadeIn(200);
                    $playToggle.addClass('active');
                });

                $player.on('YTPMuted.startuply', function () {
                    $muteToggle.addClass('active');
                });

                $player.on('YTPUnmuted.startuply', function () {
                    $muteToggle.removeClass('active');
                });

            } else {
                $el.addClass('no-video-bg');

                if ( typeof $.fn.YTPlayer != 'function' ) {
                    _this.log( 'Can\'t find jQuery.YTPlayer function. Video background blocks doesn\'t work.' );
                }else {
                    _this.log( 'Can\'t init video background blocks.');
                }
            }
        });
    },

    formInit: function () {
        var _this = this;

        this.log( 'Init ajaxed forms.' );

        if ( typeof toastr != 'undefined' ) {
            toastr.options = {
                positionClass: this.options.toastrPositionClass
            };

        }else {
            this.log( 'Can\'t find toastr. Form messages in alerts.' );
        }

        var validateOptions,
            submitHandler,
            doneHandler,
            failHandler;

        mailchimpHandler = function (event) {
            event.preventDefault();

            var $firstNameField = $(this).find('[name=FNAME]'),
                $lastNameField = $(this).find('[name=LNAME]'),
                $fullnameField = $(this).find('[name=FULLNAME]'),
                $emailField = $(this).find('[name=EMAIL]'),
                $phoneField = $(this).find('[name=PHONE]'),
                $responseBlock = $(this).find('.response'),
                fullname, fname, lname, email, phone, data = {};

            if ( $fullnameField.length && $fullnameField.val().length ) {
                fullname = $fullnameField.val().split(' ');
                fname = fullname[0];

                if ( fullname.length > 1 ) lname = fullname[1];
            }

            if ( $firstNameField.length && $firstNameField.val().length ) fname = $firstNameField.val();
            if ( $lastNameField.length && $lastNameField.val().length ) lname = $lastNameField.val();
            if ( fname ) data.fname = escape(fname);
            if ( lname ) data.lname = escape(lname);

            if ( $emailField.length && $emailField.val().length ) {
                email = $emailField.val();
                data.email = escape(email);
            }

            if ( $phoneField.length && $phoneField.val().length ) {
                phone = $phoneField.val();
                data.phone = escape(phone);
            }

            if ( typeof toastr == 'undefined' ) $responseBlock.html('<span class="notice_message">Adding email address...</span>');

            data.ajax = true;

            $.ajax({
                url: '/assets/mailchimp/inc/store-address.php',
                data: data,

                success: function(msg) {
                    if ( msg.indexOf('Success') != -1 ) {
                        if ( typeof toastr != 'undefined' ) toastr.success('Success! You are now subscribed to our newsletter!');
                        else if ( $responseBlock.length ) $responseBlock.html('<span class="success-message">Success! You are now subscribed to our newsletter!</span>');

                    } else {
                        if ( typeof toastr != 'undefined' ) toastr.error(msg);
                        else if ( $responseBlock.length ) $responseBlock.html('<span class="error-message">' + msg + '</span>');

                    }
                }
            });
        }

        submitHandler = function (event) {
            event.preventDefault();

            var form = this;

            $.ajax({
                url: form.action,
                type: 'POST',
                data: $(form).serialize()
            }).done(function(msg) {
                doneHandler(msg, form);

            }).fail(function() {
                failHandler(form);

            });
        }

        validateOptions = {
            rules: {
                password: {
                    required: true,
                    minlength: 5
                },
                confirmPassword: {
                    required: true,
                    minlength: 5,
                    equalTo: '#password'
                }
            },

            messages: {
                password: {
                    required: 'Please provide a password',
                    minlength: 'Your password must be at least 5 characters long'
                },
                confirmPassword: {
                    required: 'Please provide a password',
                    minlength: 'Your password must be at least 5 characters long',
                    equalTo: 'Please enter the same password as above'
                }
            },

            submitHandler: function (form) {
                $.ajax({
                    url: form.action,
                    type: 'POST',
                    data: $(form).serialize()
                }).done(function(msg) {
                    doneHandler(msg, form);

                }).fail(function() {
                    failHandler(form);

                });
            }
        };

        doneHandler = function (msg, form) {
            if( msg === 'ok' ) {
                form.reset();

                if ( typeof toastr != 'undefined' ) toastr.success('Success');
                else alert('Success');

            } else {
                if ( typeof toastr != 'undefined' ) toastr.error('An error occured. Please try again later.');
                else alert('An error occured. Please try again later.');

                _this.log( 'Form message', msg );
            }
        };

        failHandler = function () {
            if ( typeof toastr != 'undefined' ) toastr.error('An error occured. Please try again later.');
            else alert('An error occured. Please try again later.');
        }

        if ( $('form').length ) {
            $('form').each(function() {
                if ( !$(this).is('.mailchimp-form') ) {
                    if ( typeof $.fn.validate == 'function' ) {
                        $(this).validate(validateOptions);
                    }else {
                        $(this).on('submit', submitHandler);

                        _this.log( 'Can\'t find jQuery.validate function.' );
                    }
                }else {
                    $(this).on('submit.startuply', mailchimpHandler);
                }
            });
        }
    },

    productSliderInit: function () {
        if ( $('.product-image-list').length ) {
            if ( typeof $.fn.bxSlider == 'function' ) {
                this.log( 'Init product slider' );

                var imageSlider,
                    thumbSlider;

                if ( $('.product-image-list li img').length ) {
                    imageSlider = $('.product-image-list').bxSlider({
                        prevText: '<i class="fa fa-angle-left"></i>',
                        nextText: '<i class="fa fa-angle-right"></i>',
                        pager: false,
                        adaptiveHeight: true
                    });

                    if ( $('.product-thumb-list li img').length ) {
                        thumbSlider = $('.product-thumb-list').bxSlider({
                            prevText: '<i class="fa fa-angle-left"></i>',
                            nextText: '<i class="fa fa-angle-right"></i>',
                            pager: false,
                            maxSlides: 5,
                            slideWidth: 125,
                            slideMargin: 9,
                            moveSlides: 4
                        });

                        $('.product-thumb-list').on('click.startuply', '.product-thumb', function () {
                            var $this = $(this),
                                imgId = $this.attr('data-img-id'),
                                $currentSlide = $('.product-image-list').find('[data-img-id=' + imgId + ']');

                            imageSlider.goToSlide($currentSlide.index() - 1);
                        });
                    }
                }

            }else {
                this.log( 'Can\'t find jQuery.bxSlider function' );
            }
        }
    },

    cartCheckoutInit: function () {
        if ( $('.cart-checkout-navigation-list').length ) {
            this.log( 'Init cart checkout navigation' );

            var $nav = $('.cart-checkout-navigation-list'),
                $navControls = $('.cart-checkout-navigation-controls');

            $navControls.on('click.startuply', '.btn', function (event) {
                var next = $(this).is('.next'),
                    $activeLi = $nav.find('> .active'),
                    $next = $activeLi.next().find('.cart-checkout-navigation-list-item-link'),
                    $prev = $activeLi.prev().find('.cart-checkout-navigation-list-item-link');

                event.preventDefault();

                if ( next && $next.length ) {
                    $activeLi.next().find('.cart-checkout-navigation-list-item-link').trigger('click');
                }else if ( $prev.length ) {
                    $activeLi.prev().find('.cart-checkout-navigation-list-item-link').trigger('click');
                }
            });

            $nav.on('shown.bs.tab', '.cart-checkout-navigation-list-item-link', function () {
                var $thisLi = $(this).closest('li'),
                    $prevLi = $thisLi.prev(),
                    $nextLi = $thisLi.next(),
                    $prevBtn = $navControls.find('.prev'),
                    $nextBtn = $navControls.find('.next');

                if ( $nextLi.length ) {
                    $nextBtn.removeClass('hidden');
                }else {
                    $nextBtn.addClass('hidden');
                }

                if ( $prevLi.length ) {
                    $prevBtn.removeClass('hidden');
                }else {
                    $prevBtn.addClass('hidden');
                }
            });
        }
    },

    //testimonials slider init
    flexSliderInit: function () {
        var _this = this;

        if ( $('.testimonials-slider').length ) {
            if ( typeof $.fn.flexslider == 'function' ) {
                $('.testimonials-slider').each(function () {
                    $(this).flexslider(_this.flexsliderOptions);
                });

            }else {
                this.log( 'Can\'t find jQuery.flexslider function' );
            }
        }
    },

    //prettyphoto lightbox init
    prettyPhotoInit: function () {
        var _this = this;

        if ( $('.portfolio[data-pretty^=\'prettyPhoto[port_gal]\']').length ) {
            if ( typeof $.fn.prettyPhoto == 'function' ) {
                $('.portfolio[data-pretty^=\'prettyPhoto[port_gal]\']').each(function () {
                    $(this).prettyPhoto();
                });

            }else {
                this.log( 'Can\'t find jQuery.prettyPhoto function' );
            }
        }
    },

    // count down timer
    countdownInit: function () {
        if ( $('.countdown').length ) {
            if ( typeof $.fn.countdown == 'function' ) {
                var futureDate = new Date();

                // count down 10 days from today
                futureDate.setDate( futureDate.getDate() + 10 );
                // or set specific date in the future
                // futureDate = new Date(2014, 7, 26);

                $('.countdown').countdown({
                    until: futureDate,
                    compact: true,
                    padZeroes: true,
                    layout: $('.countdown').html()
                });
            }else {
                this.log( 'Can\'t find jQuery.coundown function' );
            }
        }
    },

    //sticky menu initialization
    stickMenu: function () {
        var $header = $('header');

        if ( $header.length && !$header.is('.fixed-menu') ) {
            $header.addClass('fixed-menu');

            this.log( 'Stick menu' );
        }
    },

    unstickMenu: function () {
        var $header = $('header');

        if ( $header.length && $header.is('.fixed-menu') ) {
            $header.removeClass('fixed-menu');

            this.log( 'Unstick menu' );
        }
    },

    //show & hide login/forgot password form
    loginShowHide: function () {
        $(window).on('load', function () {
            $('.forgot-link a').on('click.startuply', function (event) {
                event.preventDefault();

                $('#login-form').toggleClass('show hide');
                $('#forgot-form').toggleClass('show hide');
            });
        });
    },

    //one page menu navigation
    onePageNavInit: function () {
        var _this = this;

        if ( $('.navigation-bar a[href*="#"]').not('[href="#"]').length ) {
            if ( typeof $.fn.waypoint != 'undefined' ) {
                var $menuLinks = $('.navigation-bar a[href*="#"]').not('[href="#"]');

                $menuLinks.each(function (index) {
                    var href = $(this).attr('href'),
                        anchorId = href.substring(href.indexOf('#'), href.length),
                        $block = $(anchorId);

                    if ( $block.length ) {
                        $block.waypoint(function () {
                            var id = $(this)[0].element.id,
                                $item = $('.navigation-bar a[href="#' + id + '"]');

                            $('.navigation-bar li.active').removeClass('active');
                            $item.closest('li').addClass('active');

                            // push anchor to browser URL
                            if ( _this.options.onePageNavHashChange ){
                                if ( history.pushState ) {
                                    history.pushState(null, null, '#' + id);
                                }else {
                                    _this.log('Browser don\'t support history API');
                                }
                            }

                        }, { offset: '40%' });
                    }
                });

                $('body').waypoint(function () {
                    var id = 'hero',
                        $item = $('.navigation-bar a[href="#' + id + '"]');

                    $('.navigation-bar li.active').removeClass('active');

                    if ( $item.length ) {
                        $item.closest('li').addClass('active');

                        if ( _this.options.onePageNavHashChange ){
                            if ( history.pushState ) {
                                history.pushState(null, null, '#' + id);
                            }else {
                                _this.log('Browser don\'t support history API');
                            }
                        }
                    }
                }, { offset: -100 });

                $('body').on( 'click.startuply', 'a[href*="#"]', function (event) {
                    var href = $(this).attr('href'),
                        anchorId = href.substring(href.indexOf('#'), href.length);

                    if ( $(this).attr('data-toggle') && $(this).attr('data-toggle').length ) {
                        return;

                    }

                    if ( $(anchorId).length ) {
                        _this.anchorClickHandler(anchorId);

                        return false;
                    }
                });

            }else {
                this.log( 'Can\'t find jQuery.waypoint function' );

            }
        }
    },

    //custom smooth scrolling for all onpage anchors
    anchorClickHandler: function(anchorId) {
        var _this = this,
            offsetTop = $(anchorId).offset().top - $('.navigation-header').height(),
            $nav = $('.navigation-bar'),
            $elems = $nav.find('a[href="' + anchorId + '"]');

        $('body, html').animate({
            scrollTop: offsetTop

        }, 750, function () {
            if ( _this.options.onePageNavHashChange ) {
                if ( history.pushState ) {
                    history.pushState(null, null, anchorId);

                }else {
                    window.location.hash = anchorId;

                }
            }

            $nav.find('li.active').removeClass('active');
            $elems.closest('li').addClass('active');
        });
    },

    //onload handler
    windowLoadHeandler: function (event) {
        this.log('Window load handler');

        if ( window.location.hash.length ) {
            this.anchorClickHandler(window.location.hash);

        }

        if ( this.options.onePageNav ) {
            this.onePageNavInit();

        }

        this.flexSliderInit();

        this.prettyPhotoInit();

        if ( $('.nav-tabs').length ) {
            $('.nav-tabs li:first-child a').trigger('click');

        }
    },

    //on resize handler
    windowResizeHandler: function (event) {
        if ( !this.options.alwaysMobileMenuMode ) {
            this.mobileMenuStatus();

        }

        this.windowHeightBlock();

        this.centeredBlock();

        if ( $('.navigation-navbar').not('.collapsed').length ) {
            $('.navigation-navbar').not('.collapsed').closest('.navigation-header').find('.navigation-toggle').trigger('click');

        }
    },

    //on scroll handler
    windowScrollHandler: function (event) {
        if ( this.mobileMenuView && $('.navigation-navbar').not('.collapsed').length ) {
            $('.navigation-navbar').not('.collapsed').closest('.navigation-header').find('.navigation-toggle').trigger('click');

        }

        if ( this.options.stickyMenuMode ) {
            if ( $(window).scrollTop() > this.options.stickyMenuOffset ) {
                this.stickMenu();

                $('.back-to-top').fadeIn();

            }else {
                this.unstickMenu();

                $('.back-to-top').fadeOut();
            }

        }
    },

    //on navigation click handler
    navigationToggleHandler: function ($el) {
        if ( this.mobileMenuView ) {
            var $btn = $el,
                $menu = $btn.closest('.navigation-header').find('.navigation-navbar');

            if ( $menu.hasClass('collapsing') ) {
                return false;

            }else {
                if ( $menu.hasClass('collapsed') ) {
                    $menu.addClass('collapsing');
                    $menu.removeClass('collapsed');
                    $btn.closest('.navigation-header').addClass(' collapsed');
                    $('body').addClass('collapsed');

                } else {
                    $('.dropdown').removeClass('opened');
                    $('.dropdown-menu').css('display', '');
                    $menu.addClass('collapsing');
                    $menu.addClass('collapsed');
                    $btn.closest('.navigation-header').removeClass('collapsed');
                    $('body').removeClass('collapsed');

                }

                setTimeout(function() {
                    $menu.removeClass('collapsing');

                }, 400);

            }
        }
    },

    //mobile menu scrolling fix
    bodyMouseMoveHandler: function (event) {
        if ( !this.mobileMenuView && $('.dropdown.opened').length ) {
            var elements = $(event.target).parents('.dropdown.opened').find('> .dropdown-menu').get(),
                $dropdownMenu = $('body').find('.dropdown.opened > .dropdown-menu'),
                $secondLevelDropdownMenu = $('body').find('.dropdown-menu .dropdown.opened > .dropdown-menu');

            if ( $(event.target).hasClass('dropdown opened') ) {
                elements.push($(event.target).find('> .dropdown-menu').get(0));

            }

            $dropdownMenu.not(elements).stop(true, true).slideUp(250);
            $secondLevelDropdownMenu.not(elements).stop(true, true).delay(100).fadeOut(200);
            $dropdownMenu.not(elements).closest('.dropdown').removeClass('opened');
            $secondLevelDropdownMenu.not(elements).removeClass('left-side-menu');

        }
    },

    //dropdown menu aninmations nav open/close
    dropdownMouseOverHandler: function ($el) {
        if ( !this.mobileMenuView ) {
            var $dropdownMenu = $el.find('.dropdown-menu').first();

            $el.addClass('opened');

            if ( $el.closest('.dropdown-menu').length ) {
                var elWidth = $el.outerWidth(),
                    elLeft = $el.offset().left,
                    windowWidth = $(window).width(),
                    rightGap = windowWidth - elWidth - elLeft,
                    dropdownMenuWidth = $dropdownMenu.width();

                if ( rightGap < dropdownMenuWidth + 10 ) {
                    $dropdownMenu.addClass('left-side-menu');

                }

                $dropdownMenu.stop(true, true).delay(100).fadeIn(250);

            }else {
                $dropdownMenu.stop(true, true).delay(100).slideDown(250);

            }
        }
    },

    //dropdown click handler
    dropdownClickHandler: function ($el) {
        if ( this.mobileMenuView ) {
            var $item = $el.closest('.dropdown')

            if ( $item.is('.opened') ) {
                $item.removeClass('opened');
                $item.find('.dropdown-menu').first().stop(true, true).slideUp(300);

            } else {
                $item.addClass('opened').siblings('.dropdown').removeClass('opened');
                $item.find('.dropdown-menu').first().stop(true, true).slideDown(300);
                $item.siblings('.dropdown').find('.dropdown-menu').stop(true, true).slideUp(300);

            }
        }
    },

    navScrollHandler: function(event, el) {
        if ( this.mobileMenuView ) {
            var e0 = event.originalEvent,
                delta = e0.wheelDelta || -e0.detail;

            el.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;

            event.preventDefault();
        }
    },

    styleSwitcherHandler: function (event, $el) {
        event.preventDefault();

        var switcher = $('.style-switcher');

        if (switcher.hasClass('style-active')){
            switcher.animate({ marginLeft: '0' }, 200, 'linear');

        } else {
            switcher.animate({ marginLeft: '225' }, 200, 'linear');
        }

        switcher.toggleClass('style-active');
    },

    styleSwitcherColorHandler: function (event, $el) {
        var $this = $el,
            colorName = $this.attr('data-color');

        event.preventDefault();

        $('.style-switcher-css').remove();
        $('head').append('<link class="style-switcher-css" rel="stylesheet" type="text/css" href="assets/css/colors/' + colorName + '.css">');
    },

    styleSwitcherToggleAnimation: function (event, $el) {
        if ( $el.get(0).checked ) {
            $('.animated').css('opacity', '');
            this.options.animations = true;

        }else {
            $('.animated').css('opacity', 1);
            this.options.animations = false;
        }
    },

    //small back-to-top link function
    backToTopHandler: function () {
        $('html, body').animate({
            scrollTop: 0,
            easing: 'swing'
        }, 750);
    },

    //material design animations framework
    waveShowAnimation: function (event, $el) {
        var diag = Math.sqrt($el.outerWidth()*$el.outerWidth() + $el.outerHeight()*$el.outerHeight()),
            radiusIndex = Math.floor(diag/Math.sqrt(20))

        $el.prepend('<div class="inside-wave base-clr-bg" style="top:' + event.offsetY + 'px; left:' + event.offsetX + 'px;"></div>');

        setTimeout( function() {
            $el.find('.inside-wave').css({
                'opacity': '1',
                '-webkit-transform': 'scale(' + radiusIndex + ')',
                '-moz-transform': 'scale(' + radiusIndex + ')',
                '-ms-transform': 'scale(' + radiusIndex + ')',
                '-o-transform': 'scale(' + radiusIndex + ')',
                'transform': 'scale(' + radiusIndex + ')'
            });
        }, 0);
    },

    //material design wave callback animation
    waveHideAnimation: function (event, $el) {
        var $waves = $el.find('.inside-wave');

        $waves.css('opacity', 0);

        setTimeout(function(){
            $waves.remove();

        }, 400);
    },

    setEventHandlers: function () {
        var _this = this;

        $(window).on('load.startuply', function (event) {
            _this.windowLoadHeandler(event);
        });

        $(window).on('resize.startuply', function (event) {
            _this.windowResizeHandler(event);
        });

        $(window).on('scroll.startuply', function (event) {
            _this.windowScrollHandler(event);
        });

        $('.navigation-toggle').on('click.startuply', function () {
            _this.navigationToggleHandler($(this));
        });

        $('body').on('mousemove.startuply', function (event) {
            _this.bodyMouseMoveHandler(event);
        });

        $('header .dropdown').on('mouseover.startuply', function () {
            _this.dropdownMouseOverHandler($(this));
        });

        $('.dropdown > a').on('click.startuply', function (event) {
            event.preventDefault();

            _this.dropdownClickHandler($(this));
        });

        $('.back-to-top').on('click.startuply', function (event) {
            event.preventDefault();

            _this.backToTopHandler();
        });

        $('body').on('mouseover.startuply', '.wave-mouseover', function (event) {
            _this.waveShowAnimation(event, $(this));
        });

        $('body').on('mouseout.startuply', '.wave-mouseover', function (event) {
            _this.waveHideAnimation(event, $(this));
        });

        $('body').on('mousedown.startuply', '.wave-click', function (event) {
            _this.waveShowAnimation(event, $(this));
        });

        $('body').on('mouseup.startuply mouseover.startuply', '.wave-click', function (event) {
            _this.waveHideAnimation(event, $(this));
        });

        $('.navigation-navbar').on( 'mousewheel.startuply DOMMouseScroll.startuply', function (event) {
            _this.navScrollHandler(event, this);
        });

        $('.style-toggle').on('click.startuply', function(event){
            _this.styleSwitcherHandler(event, $(this));
        });

        $('.style-switcher .color').on('click.startuply', function(event) {
            _this.styleSwitcherColorHandler(event, $(this));
        });

        $('#animations_switch').on('change.startuply', function(event){
            _this.styleSwitcherToggleAnimation(event, $(this));
        });

        this.log('Set event hendlers');
    },

    hidePreloader: function (callback) {
        var _this = this;

        $('.preloader-mask').delay(500).fadeOut(600);

        setTimeout(function() {
            _this.initAnimations();

        }, 1000);

        if ( callback ) {
            callback();
        }
    },

    init: function (options) {
        this.options = $.extend(this.defaults, options, $('body').data());

        this.log('Init');

        this.checkMobile();

        this.mobileMenuStatus();

        if ( this.options.styleSwitcher ) this.buildStyleSwitcher();

        if ( this.options.smoothScroll ) this.smoothScrollInit();

        if ( this.options.ajaxedForm ) this.formInit();

        this.windowHeightBlock();

        this.centeredBlock();

        this.videoBackgroundInit();

        this.loginShowHide();

        this.countdownInit();

        this.productSliderInit();

        this.cartCheckoutInit();

        this.setEventHandlers();

        this.hidePreloader();
    }
}

//Color Palette:
//  Primary Red:            rgba(191, 30, 45, 1)
//  Secondary (light) Red:  rgba(203, 72, 85, 1)    #CB4855

//Force window to start at scrollPos=0 on load and reload
window.onload = function() {
    setTimeout (function () {
        scrollTo(0,0);
    }, 100); //100ms for example

    //detect mobile or web
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        $('#web').css('display', 'none');
        $('#mobile').css('display', 'block');
        $('body').css('text-align', 'center');
    } else {
        $('#web').css('display', '');
        $('#web').css('opacity', 1);
        $('#mobile').css('display', 'none');
        $('#startingBackground').fadeIn(2000);
    }
}


//Primary Functionality
$( window ).ready(function() {
    //initiate global variables
    var scrollPos = 0;
    var progressFrac = 0;
    // var hideIntro = true;
    var startGif = generateGifParams();
    var gifDuration = 300;
    var contactClosed = true;
    var scene1Scroll = $('#text1').offset().top;

//Pin Static Scenes
    var scene2Pin = $('#scene2').offset().top;
    $('#parallaxContent').css({'position': 'absolute', 'top': scene2Pin});
    $('#credits').css({'top': $('#content4').offset().top+$('#content4').height()-30});

    runLoadingAnimations(500);

// SCROLL BLOCK
    $(document).scroll(function( e ) {
        //Update scrolling variables on each scroll event
        scrollPos = $(document).scrollTop();
        progressFrac = scrollPos/800;
        // $('#progressFactor').text(progressFrac);

        handleContactBox();
        handleScrollArrows();
        //Intro
        handleIntro(2);
        
        //Scene 1 (Gif scene)
        animateScene1(startGif, gifDuration, 17);

        //Scene 2
        animateParallax('#content2', -30, 50);

        //Scene 3
        animateParallax('#content3', -50, 100);

        //Scene 4
        animateParallax('#content4', -50, 100);
        
    })

//Listener Functions
    $('#cContainer').mouseenter( function() {
        $('#contactClosed').css('box-shadow', '0px 0px 5px black');
    });
    $('#cContainer').mouseleave( function() {
        $('#contactClosed').css('box-shadow', '');
    });

    $('#cContainer').click( function(e) {
        $('#contactClosed').toggle();
        $('#contactOpen').toggle();
        $('#contactUs').slideToggle(600);
    });

    $('.scrollClick').click(function(){
        var dest1 = scene1Scroll-$(window).height()-80;
        var dest2 = scene1Scroll-80;
        var dest3 = scene1Scroll+gifDuration-10;
        var dest4 = $('#text2').offset().top-150;
        var dest5 = $('#text3').offset().top-150;
        var dest6 = $('#text4').offset().top-150;
        var dest7 = $('#startShopping').offset().top-100;
        if (scrollPos<dest1-10){
            scrollNext(dest1);
        } else if (scrollPos<dest2-10){
            scrollNext(dest2);
        } else if (scrollPos<dest3-10){
            scrollNext(dest3);
        } else if (scrollPos<dest4-10){
            scrollNext(dest4);
        } else if (scrollPos<dest5-10){
            scrollNext(dest5);
        } else if (scrollPos<dest6-10){
            scrollNext(dest6);
        } else if (scrollPos<dest7-10){
            scrollNext(dest7);
        }

        function scrollNext(dest){
            $('#scrollDownArrows').css('-webkit-animation', 'bounce 1s 1');
            $('html,body').animate({scrollTop: dest}, 3000, function(){
                $('#scrollDownArrows').css('-webkit-animation', 'bounce 1s infinite');
            });
        }
    });

// Helper functions
    function generateGifParams() {
        var viewHeight = $(window).height();
        var viewWidth = $(window).width();
        var gifHeight = $('#swatch').height();
        var gifOffset = $('#swatch').offset().top;
        var gifCutoff = 0.9;

        var startGif = gifOffset+gifCutoff*gifHeight-viewHeight;
        var altStart = $('#text1').offset().top-0.09*viewWidth;

        return Math.max(startGif, altStart);
    }

    function bound(num, lower, upper, round){
        var ans = Math.min(Math.max(num, lower), upper);
        if (round){
            return Math.round(ans);
        } else {
            return ans;
        }
    }

//Element-level Animation Helpers
    function runLoadingAnimations(speed) {
        $('#introElements').fadeIn(3*speed, function() {
            $('html').css({'overflow-y': 'visible'});
            $('#scrollDown').fadeIn(speed);
        });
    }

    function animateParallax(elementTag, offset, multiplier) {
        //elementTag is the String name of the element
        //offset is the starting offset of the background position
        //multiplier is how fast the element will parallax, default is scrolling direction

        var viewHeight = $(window).height();
        var elementOffset = $(elementTag).offset().top;
        var duration = $(elementTag).height()+viewHeight;

        var startPos = elementOffset-viewHeight;
        var parallaxFactor = (scrollPos-startPos)/duration;
        var pin = Math.max(offset+multiplier*(parallaxFactor), offset);
        $(elementTag).css({'background-position': '0 ' + pin + 'vw'});
    }

//Macro Animation Helpers

    function handleScrollArrows(){
        // bounceArrows();
        if (progressFrac>0.8 && progressFrac<2.03){
            $('#scrollDown').fadeIn();
            var src = $('#scrollDownArrows').attr("src").replace("White", "Red");
            $('#scrollDownArrows').attr("src", src);
        } else if (progressFrac>4){
            $('#scrollDown').fadeOut();
        }
        else{
            $('#scrollDown').fadeIn();
            var src = $('#scrollDownArrows').attr("src").replace("Red", "White");
            $('#scrollDownArrows').attr("src", src);
        }
    }
    function handleContactBox(){
        if (progressFrac>0.76 && progressFrac<2){
            $('#contactUs').css({'border': 'solid 0.4em #BF1E2E', 'right': '0.6em', 'bottom': '3.6em'});
        }
        else{
            $('#contactUs').css({'border': '', 'right': '1em', 'bottom': '4em'});
        }
    }

    function handleIntro(cutoffFactor){
        if (progressFrac<cutoffFactor) {
            //hideIntro = false; //used in checkElements
            animateIntro();
        } //else{
        //     hideIntro = true;
        // }

        animateStartingBackground();
    }

    function animateIntro () {
        $('#scrollDown').fadeIn(0);
        var blurSize = Math.max(20-30*progressFrac, 0);
        $('#startingBackground').css({'-webkit-filter': 'blur(' + blurSize + 'px)'});

        var triHeight = Math.max(38-38*progressFrac, 5);
        $('#triangle').css({'border-top': triHeight + 'vw solid white'});
        $('#triangle').css({'display': ''});

        var offsetHeight = Math.min(30*progressFrac, 24);
        $('#introElements').css({'top': (25-offsetHeight) + 'vw'});
        $('#headerLogo').css('width', Math.max(7, 10-3*progressFrac) + 'vw');
        // $('#headerLogo').css('height', Math.max(0, 8-10*progressFrac) + 'vw'); for height scaling
        $('#whiteHeader').css('opacity', 50*progressFrac-35);
        $('#bar').css({'opacity': (0.7 + 0.5*progressFrac)});
        $('#triangle').css({'opacity': (0.7 + 0.5*progressFrac)});
        $('#introText').css('opacity', 4*progressFrac-2);

        // bounceArrows();
    }

    function animateStartingBackground() {
        var scene1Pos = Math.max(15*(progressFrac-0.7), 0);
        $('#startingBackground').css({'background-position': '0 -' + scene1Pos + 'vw'});
    }

    function animateScene1(startPos, duration, gifLength) {
        //ideal duration is 300;
        var maxPos = 1.2*duration;
        var scene1Frac = (scrollPos-startPos)/duration; //calculates progress factor with startPos as baseline
        var gifSlideNum = bound( scene1Frac*gifLength, 1, gifLength, true ); //calculates the gif number to request
        var scene1Top = Math.min(scrollPos-startPos, maxPos+startPos); //specifies the offset to pin the scene to

        //Fade in as scrolling towards image
        if (scene1Frac>(-1) && scene1Frac<1.5) {
            $('#triangle').css({'display': 'none'});
            $('#introText').css('opacity', 0);

            $( "#swatch" ).css({'opacity': (1.2+5*scene1Frac)})
        }

        //Pause scrolling 
        if(scene1Frac>0 && scene1Frac<1) {
            $('#scene1').css({'top': scene1Top});
        } else if(scene1Frac>=1){
            $('#scene1').css({'top': duration});
        } else{
            $('#scene1').css({'top': ''});
        }

        //$('#progressFactor').text($('#triangle').offset().top);
        //Change gif slide
        $( "#swatch" ).attr("src", "resources/frames/" + gifSlideNum + ".gif");
    }

//Unused (for now)
    function preloadImgs(imgNum) {
        for (i = 1; i < imgNum +1; i++) {
            var url = "resources/frames/" + imgNum +".gif";
            images[imgNum] = new Image();
            images[imgNum].src = url;
        }
    }

    function checkElements() {
        if (hideIntro) {
            animateIntro();
            $('#introElements').css({'display': 'none'});
        }
        else{   
            $('#introElements').css({'display': 'block'});
        }

        if (hideScene1) {
            $('#scene1').css({'display': 'none'});
        }
        else{   
            $('#scene1').css({'display': 'block'});
        }

        if (hideScene2) {
            $('#scene2').css({'display': 'none'});
        }
        else{   
            $('#scene2').css({'display': 'block'});
        }
    }
});



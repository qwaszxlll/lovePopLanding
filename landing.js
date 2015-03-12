//Color Palette:
//  Primary Red:            rgba(191, 30, 45, 1)
//  Secondary (light) Red:  rgba(203, 72, 85, 1)    #CB4855

//Force window to start at scrollPos=0 on load and reload
window.onload = function() {
 setTimeout (function () {
  scrollTo(0,0);
 }, 100); //100ms for example
}


//Primary Functionality
$( window ).load(function() {
    //initiate global variables
    var scrollPos = 0;
    var progressFrac = 0;
    // var hideIntro = true;
    var startGif = generateGifParams();
    var contactClosed = true;

    runLoadingAnimations(1000);

    $(document).scroll(function( e ) {
        //Update scrolling variables on each scroll event
        scrollPos = $(document).scrollTop();
        progressFrac = scrollPos/800;

        //Intro
        handleIntro(2);
        
        //Scene 1 (Gif scene)
        animateScene1(startGif, 300, 17);

        //Scene 2
        animateParallax('#content2', -60, 100);

        //Scene 3
        animateParallax('#content3', -50, 100);

        //Scene 4
        animateParallax('#content4', -50, 100);
        
    })

    $('#contactClosed').click( function(e) {
        $('#contactClosed').fadeOut();
        $('#contactOpen').fadeIn();
    });

     $('#contactOpen').click( function(e) {
        $('#contactOpen').fadeOut();
        $('#contactClosed').fadeIn();
    });

// Helper functions
    function generateGifParams() {
        var viewHeight = $(window).height();
        var viewWidth = $(window).width();
        var gifHeight = $('#swatch').height();
        var gifOffset = $('#swatch').offset().top;
        var gifCutoff = 0.85;

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
            bounceArrows();
        });
        $('#headerButtons').fadeIn(5*speed);
    }

    function bounceArrows() {
        $('.scrollDownArrows').effect('bounce', {times: 1}, 500, function() {
            if (progressFrac < 1) {
                bounceArrows();
            }
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
    function handleIntro(cutoffFactor){
        if (progressFrac<cutoffFactor) {
            //hideIntro = false; //used in checkElements
            animateIntro();
        } //else{
        //     hideIntro = true;
        // }

        if (progressFrac > 0.8 && progressFrac<2.8) {
            animateStartingBackground();
        }
    }

    function animateIntro () {
        var blurSize = Math.max(20-20*progressFrac, 0);
        $('#startingBackground').css({'-webkit-filter': 'blur(' + blurSize + 'px)'});

        var triHeight = Math.max(38-38*progressFrac, 5);
        $('#triangle').css({'border-top': triHeight + 'vw solid white'});

        var offsetHeight = Math.min(62*progressFrac, 54);
        $('#introElements').css({'top': (38-offsetHeight) + 'vh'});
        $('#introElements').css({'opacity': (1 - 1.8*progressFrac)})
        $('#bar').css({'opacity': (0.7 + 0.3*progressFrac)})
        $('#whiteHeader').css('opacity', 10*progressFrac-7.5)
        $('#triangle').css({'opacity': (0.7 + 0.3*progressFrac)})
        $('#headerButtons').css({'top': (58-offsetHeight) + 'vh'});

        bounceArrows();
    }

    function animateStartingBackground() {
        var scene1Pos = Math.max(50+15*(progressFrac-1), 50);
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
            $( "#swatch" ).css({'opacity': (1+scene1Frac)})
        }

        //Pause scrolling 
        if(scene1Frac>0 && scene1Frac<1) {
            $('#scene1').css({'top': scene1Top});
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


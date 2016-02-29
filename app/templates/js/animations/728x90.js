$(function() {
    var lang = $('#border').hasClass('en') ? 'en' : 'fr';

    if (lang == 'en') {
        mainBannerCopy[1] = "Care comes in<br/>all shapes and sizes";
        endFrameCopy = "See our fully<br/>organized French Door Refrigerators";
    } else {
        mainBannerCopy[1] = "Petit ou grand, de toute forme ou taille, chaque geste compte";
        endFrameCopy = "Découvrez nos réfrigérateurs à portes françaises à rangement bien pensé";
    }

    var back01 = $("#back01");
    var back02 = $("#back02");
    var back03 = $("#back03");

    var edcLogo = $("#edc-logo");
    var wpLogo = $("#wp-logo");
    var cta = $("#cta");
    var ctaOver = $("#cta > .ctaDown");

    var copyContainer = $("#copy-container");
    var copyDiv = $("#copy-holder");
    var copyDisplay = $("#copy-holder > p");
    var containerHeight = 65;
    var copyContainerWidth = 400;

    var yellowBar = $("#yellow-bar");
    var copyNum = 0;
    var delayCount = 1;

    cta.mouseenter(function(){
        TweenMax.to(ctaOver,0.5, {opacity:1, ease:Power1.easeOut})
    });

    cta.mouseout(function(){
        TweenMax.to(ctaOver,0.5, {opacity:0, ease:Power1.easeOut})
    });


    function updateCopy(){
        console.log(copyDiv.height())
        copyDisplay.html(mainBannerCopy[copyNum]);
        var newTop = (containerHeight - copyDiv.height())/2;
        copyDiv.css('top', newTop);
    }

    function animateBack(){
        updateCopy();
        TweenMax.to(copyContainer,.8, {left:15, width:copyContainerWidth, ease:Power1.easeInOut, delay:.2})
        TweenMax.to(yellowBar,.8, {left:15, ease:Power1.easeInOut, delay:.2, onComplete:playText})
    }

    function playText(){
        console.log('playtext');
        if((copyNum +1) < mainBannerCopy.length){
            console.log('playtext '+copyNum);
            var aniDelay = delayCount * 1.5;
            // Animation Block 01
            TweenMax.to(copyContainer,.6, {left:copyContainerWidth, width:1, delay:aniDelay});
            TweenMax.to(yellowBar,.6, {left:copyContainerWidth, ease:Power1.easeOut, delay:aniDelay, onComplete:animateBack});
            copyNum++;
            delayCount ++;
        } else {
            console.log('playtext end');
            playEndFrame();
        }
    }

    function showBack(){
        updateCopy();
        TweenMax.to(back01, 1, {opacity:1, ease:Power1.easeInOut});
        TweenMax.to(wpLogo, 1, {opacity:1, ease:Power1.easeInOut, delay:.5});
        TweenMax.to(copyContainer, 1, {opacity:1, ease:Power1.easeInOut});
        TweenMax.to(yellowBar,.6, {opacity:1, ease:Power1.easeIn, delay:.5, onComplete:playText});
        TweenMax.to(back02, 1, {opacity:1, ease:Power1.easeIn, delay:9});
    }

    function showEndCopy(){
        console.log('showend');
        TweenMax.to(edcLogo, 1, {opacity:0, ease:Power1.easeIn, delay:.5});
        copyDisplay.html(endFrameCopy);
        if (lang == 'en') {
            copyDiv.css('top', '1px');
            copyDiv.css('right', '-3px');
        } else {
            copyDiv.css('top', '0px');
            copyDiv.css('right', '-11px');
            copyDiv.css('lineHeight', '16px');
        }

        copyDisplay.css('width', '170px');
        copyDisplay.css('font-size', '14px');
        copyDisplay.css('font-weight', '400');
        TweenMax.to(copyContainer, .8, {opacity:1, ease:Power1.easeOut, delay:1});
        TweenMax.to(cta, .8, {opacity:1, ease:Power1.easeOut, delay:1.5});
    }

    function playEndFrame(){
        console.log('playendframe');
        TweenMax.to(yellowBar,.6, {opacity:0, ease:Power1.easeIn, delay:3.5});
        TweenMax.to(copyContainer,.6, {opacity:0, ease:Power1.easeIn, delay:3});
        //
        TweenMax.to(edcLogo, 1, {opacity:1, ease:Power1.easeIn, delay:4});
        //
        TweenMax.to(back03, 1, {opacity:1, ease:Power1.easeIn, delay:6, onComplete:showEndCopy});
    }
    showBack();
});
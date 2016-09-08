$(function() {
    var lang = $('#border').hasClass('en') ? 'en' : 'fr';

    var back01 = $("#back01");
    var back02 = $("#back02");
    var back03 = $("#back03");

    var wpLogo = $("#wp-logo");
    var cta = $("#cta");
    var ctaOver = $("#cta > .ctaDown");

    var copyContainer = $("#copy-container");
    var copyDiv = $("#copy-holder");
    var copyDisplay = $("#copy-holder > p");
    var containerHeight = 65;
    var copyContainerWidth = 300;
    var copyContainerLeft = 7;

    var yellowBar = $("#yellow-bar");
    var copyNum = 0;
    var delayCount = 1;

    if ("{size}" in mainBannerCopy) {
        mainBannerCopy = mainBannerCopy["{size}"];
    } else {
        mainBannerCopy = mainBannerCopy["global"];
    }

    cta.mouseenter(function(){
        TweenMax.to(ctaOver,0.5, {opacity:1, ease:Power1.easeOut})
    });

    cta.mouseout(function(){
        TweenMax.to(ctaOver,0.5, {opacity:0, ease:Power1.easeOut})
    });


    function updateCopy(){
        console.log('updateCopy');

        copyDisplay.html(mainBannerCopy[copyNum]);
        // var newTop = (containerHeight - copyDiv.height())/2;
        // copyDiv.css('top', newTop);

    }

    function animateBack(){
        console.log('animateback');
        updateCopy();
        TweenMax.to(copyContainer,.8, {left:copyContainerLeft, width:copyContainerWidth, ease:Power1.easeInOut, delay:.2})
        TweenMax.to(yellowBar,.8, {left:copyContainerLeft, ease:Power1.easeInOut, delay:.2, onComplete:playText})
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
        console.log('showback');
        TweenMax.to(back01, 1, {opacity:1, ease:Power1.easeInOut});
        TweenMax.to(wpLogo, 1, {opacity:1, ease:Power1.easeInOut, delay:.5});
        TweenMax.to(copyContainer, 1, {opacity:1, ease:Power1.easeInOut});
        TweenMax.to(copyDiv, 1, {opacity:1, ease:Power1.easeInOut});
        TweenMax.to(copyDisplay, 1, {opacity:1, ease:Power1.easeInOut});
        TweenMax.to(yellowBar,1, {opacity:1, ease:Power1.easeIn, delay:.5, onComplete:playText});
        TweenMax.to(back02, 1, {opacity:1, ease:Power1.easeIn, delay:9});
    }

    function playEndFrame(){
        console.log('playendframe');
        var delay = 3;
        TweenMax.to(yellowBar,1, {top: {height}+{height}*0.3, ease:Elastic.easeOut.config(1, 0.5), delay:delay});
        TweenMax.to(copyContainer,1, {top: {height}+{height}*0.3, ease:Elastic.easeOut.config(1, 0.5), delay:delay});

        back02.css({
            top: -back02.height(),
            opacity: 1
        })
        back03.css({
            top: -back02.height()-back03.height(),
            opacity: 1
        })
        TweenMax.to(back02, 1, {top:0, ease:Elastic.easeOut.config(1, 0.5), delay:delay});
        TweenMax.to(back03, 1, {top:-back03.height(), ease:Elastic.easeOut.config(1, 0.5), delay:delay});
        TweenMax.to(cta, 0.6, {opacity:1, ease:Power1.easeIn, delay:delay+=1.3});
    }
    showBack();
    TweenMax.to(copyContainer,.8, {left:copyContainerLeft})
    TweenMax.to(yellowBar,.8, {left:copyContainerLeft})
});
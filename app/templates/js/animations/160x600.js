$(function() {
    mainBannerCopy[1] = "Care is<br/>organized";
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
    var containerHeight = 95;
    var copyContainerWidth = 144;
    var copyContainerLeft = 10;

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
        console.log(containerHeight, copyDiv.height());
        var newTop = (containerHeight - copyDiv.height())/2;
        copyDiv.css('top', newTop);
    }

    function animateBack(){
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
        TweenMax.to(back01, 1, {opacity:1, ease:Power1.easeInOut});
        TweenMax.to(wpLogo, 1, {opacity:1, ease:Power1.easeInOut, delay:.5});
        TweenMax.to(copyContainer, 1, {opacity:1, ease:Power1.easeInOut});
        TweenMax.to(yellowBar,.6, {opacity:1, ease:Power1.easeIn, delay:.5, onComplete:playText});
        TweenMax.to(back02, 1, {opacity:1, ease:Power1.easeIn, delay:9});
    }

    function showEndCopy(){
        console.log('showend');
        TweenMax.to(edcLogo, 1, {opacity:0, ease:Power1.easeIn, delay:.5});
        copyContainer.css('top', 479);
        copyDisplay.html(endFrameCopy);
        copyDiv.css({'top': 11, 'right': 2, 'width': 144});
        copyDisplay.addClass('centered');
        copyDisplay.css({'font-size': 12, 'width': 170});
        TweenMax.to(copyContainer, .8, {opacity:1, ease:Power1.easeOut, delay:1});
        TweenMax.to(cta, .8, {opacity:1, ease:Power1.easeOut, delay:1.5});
    }

    function playEndFrame(){
        console.log('playendframe');
        TweenMax.to(yellowBar,.6, {opacity:0, ease:Power1.easeIn, delay:3.5});
        TweenMax.to(copyContainer,.6, {opacity:0, ease:Power1.easeIn, delay:3});
        TweenMax.to(edcLogo, 1, {opacity:1, ease:Power1.easeIn, delay:4});
        TweenMax.to(back03, 1, {opacity:1, ease:Power1.easeIn, delay:6, onComplete:showEndCopy});
    }
    showBack();
});
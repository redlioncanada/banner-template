var easeOut = Power1.easeOut;
var timeline = new TimelineLite({onComplete: onComplete});
        timeline.add('frame1').add('start')
            .to('.copy1', 1.7, {opacity:1, ease:easeOut}, 'frame1-=0.4').add('frame1-animate')
            .to('.background1', 1, {left:-301}, 'frame1-animate+=2')
            .to('.copy1', 1, {left: "-=282", ease:easeOut}, 'frame1-animate+=2')
            .to('.bottom-bottom', 1, {width:301, ease:easeOut}, 'frame1-animate+=2')
            .to('.copy2', 0, {opacity:1, left:282}, 'frame1-animate+=2')
            .to('.copy2', 1, {left:0, ease:easeOut}, 'frame1-animate+=2')
            .addDelay(1.5, 'frame2')
        timeline.add('frame2')
        .to('.logo,.cta', 2, {opacity:1, ease:easeOut}, 'frame2+=0.3')
        timeline.add('frame3').add('end')


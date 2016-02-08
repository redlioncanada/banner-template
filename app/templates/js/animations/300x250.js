var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var speed = 1.5;
var timeline = new TimelineLite({onComplete: onComplete});
        timeline.add('frame1').add('start')
        timeline.add('frame2')
            .fromTo('#copy1 .copy-wrapper', speed, {css:{marginLeft: '-=265'}}, {css:{marginLeft: '+=265'}}, 'frame2')
            .addDelay(2, 'frame3');
        timeline.add('frame3')
            .to('#copy1 .copy-wrapper', speed, {css:{marginLeft: '-=265'}}).add('frame3-copy1')
            .fromTo('#copy2 .copy-wrapper', speed, {css:{marginLeft: '-=265'}}, {css:{marginLeft: '+=265'}}, 'frame3-copy1')
            .fromTo('#copy2', speed, {opacity: 1})
            .addDelay(2.5, 'frame4');
        timeline.add('frame4')
            .to('#background1,#copy2', speed, {opacity:0, ease:easeOut},'frame4')
            .to('#copy3,#background2', speed, {opacity:1, ease:easeIn},'frame4')
            .addDelay(3, 'frame5');
        timeline.add('frame5')
            .to('#copy3,#yellowbar', speed, {opacity:0, ease:easeOut})
            .to('#everydaycare', speed, {opacity:1, ease:easeIn})
            .addDelay(2.5, 'frame6');
        timeline.add('frame6')
            .to('#everydaycare,#background2', speed, {opacity:0, ease:easeOut}, 'frame6')
            .to('#copy4,#cta,#background3', speed, {opacity:1, ease:easeIn}, 'frame6')
            .addDelay(2.5, 'frame6');
        timeline.add('frame7').add('end');

timeline.seek('frame4').pause()
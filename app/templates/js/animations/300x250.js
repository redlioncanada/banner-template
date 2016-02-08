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
            .to('#copy2', 0, {opacity:1}, 'frame3-copy1')
            .fromTo('#copy2 .copy-wrapper', speed, {css:{marginLeft: '-=265'}}, {css:{marginLeft: '+=265'}}, 'frame3-copy1')
            .addDelay(2.5, 'frame4');
        timeline.add('frame4')
            .to('#copy2 .copy-wrapper', speed, {css:{marginLeft: '-=265'}},'frame4')
            .to('#background1', speed, {opacity:0, ease:easeOut},'frame4')
            .to('#background2', speed, {opacity:1, ease:easeIn},'frame4').add('frame4-copy3')
            .to('#copy3', 0, {opacity:1}, 'frame4-copy3')
            .fromTo('#copy3 .copy-wrapper', speed, {css:{marginLeft: '-=265'}}, {css:{marginLeft: '+=265'}}, 'frame4-copy3')
            .addDelay(3, 'frame5');
        timeline.add('frame5')
            .to('#copy3 .copy-wrapper', speed, {css:{marginLeft: '-=265'}},'frame5')
            .to('#yellowbar', speed, {opacity:0, ease:easeOut}).add('frame5-yellowbar')
            .to('#everydaycare', speed, {opacity:1, ease:easeIn},'frame5-yellowbar')
            .addDelay(2.5, 'frame6');
        timeline.add('frame6')
            .to('#everydaycare,#background2', speed, {opacity:0, ease:easeOut}, 'frame6')
            .to('#copy4,#cta,#background3', speed, {opacity:1, ease:easeIn}, 'frame6')
            .addDelay(2.5, 'frame6');
        timeline.add('frame7').add('end');

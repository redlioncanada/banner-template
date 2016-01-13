var timeline = new TimelineLite({onStart: function(){console.log('started skyscraper timeline')}});
        timeline.add('frame1').add('start')
            .to('#copy1', 1, {opacity:1});
        timeline.add('frame2')
            .to('#copy1', 1, {opacity:0})
            .to('#copy2', 1, {opacity:1});
        timeline.add('frame3')
            .to('#copy2', 1, {opacity:0})
            .to('#background2', 1, {opacity:1})
            .to('#copy3, #cta', 1, {opacity:1});
        timeline.add('frame4').add('end')
            .stop();
$(function(){


 var lang = $('#border').hasClass('en') ? 'en' : 'fr';

 if (lang == 'en'){
    sRated[0] = "Rated";
    sRated[1] = "4.3/5 Average";
    legaltxt[0] = "See full review on KitchenAid.ca.";
    legaltxt[1] = "Model KRFF302ESS ";
    legaltxt[2] = "Review was submitted as a contest entry. ";
    ctaTxt[0] = "LEARN MORE";
 } else {
    sRated[0] = "Classé";
    sRated[1] = "4,3 sur 5 en moyenne";
    legaltxt[0] = "Consultez l’évaluation complète à KitchenAid.ca.";
    legaltxt[1] = "Modèle KRFF302ESS ";
    legaltxt[2] = "Cette évaluation a été soumise en tant que participation à un concours.";
    ctaTxt[0] = "EN SAVOIR PLUS";

 }

 var copyDisplay1 = $("#s_txt");
 var copyDisplay2 = $("#s_txt2");
 var legalDisplay1 = $("#txt_1");
 var legalDisplay2 = $("#txt_2");
 var legalDisplay3 = $("#txt_3");
 var ctaDisplay = $("#ctaTxt");
 var starStyles = $("#starStyle");
 var legalStyle = $("#legal_txt");
 var legalContainer = $("#legal");
 var test1css = $('#test1');
 var test2css = $('#test2');
 var test3css = $('#test3');
 var test3Img = $('#test3_Img');
 var test1Img = $('#test1_Img');
 var ctaTxtcss = $('#cta_txt');
 var ctaNormalcss = $('#ctaNormal');
 var ctaTriggercss = $('#ctaTrigger');
 var test2Img = $('#test2_Img');

function updateCopy(){
  copyDisplay1.html(sRated[0]);
  copyDisplay2.html(sRated[1]);
  legalDisplay1.html(legaltxt[0]);
  legalDisplay2.html(legaltxt[1]);
  legalDisplay3.html(legaltxt[2]);
  ctaDisplay.html(ctaTxt[0]);
  if (lang == 'fr'){
    // starStyles.css('font-size', '9px');
    // starStyles.css('padding-left', '19px');
    legalStyle.css('width', '304px');
    legalContainer.css('left', '158px');
    legalContainer.css('top', '70px');
    // legalDisplay1.css('width', '134px');
    // legalDisplay3.css('width', '139px');
    test3Img.css({"width": "377px","height": "49px"});
    test3css.css('top', '-5px');
    test1Img.css({"width": "728px","height": "90px"});
    test1css.css('top', '-6px');
    test1css.css('left', '-79px');
    // ctaTriggercss.css({"left": "18px", "width":"121px"});
    // ctaNormalcss.css({"left": "-1px", "width":"121px"});
    ctaTxtcss.css({"left": "7px", "top": "11px", "font-size": "10px"});
    test2Img.css({"top": "9px"});


  };

};

updateCopy();


var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var timeline = new TimelineLite({onComplete: onComplete});
       timeline.add('frame1').add('start')
        .to('.stars', 1.5, {opacity: 1, ease: easeIn})
        .addDelay(2)
        .to('.stars', 1.5, {opacity: 0, ease: easeOut})
        .to('.test1', 1.5, {opacity:1, ease:easeIn})
        .to('.test3,.legal', 3, {opacity:1, ease:easeIn})
        .addDelay(3, 'frame2')
        timeline.add('frame2')
        .to('#backgroundfade,.stars,.test1,.test3,.legal', 2, {opacity:0, ease:easeOut})
        .to('#bg2', 1, {opacity:1, ease:easeIn})
        .to('.logo',.5, {top:19, ease:easeIn})
        .to('.cta,.test2', 1, {opacity:1, ease:easeIn}, '-=.25')
         timeline.add('frame3').add('end');


});
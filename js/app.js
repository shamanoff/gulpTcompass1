/*function switchFunc() {

 var el = document.getElementsByTagName('h1');
 for (var i = 0; i < el.length; i++) {
 el[i].style.color = "#000";
 el[i].style.backgroundColor = "white";
 }

 console.log(el);
 el = document.getElementsByTagName('p');
 for (var i = 0; i < el.length; i++) {
 el[i].style.color = "#000";
 el[i].style.backgroundColor = "white";
 }

 console.log(el);

 el = document.getElementsByTagName('div');
 for (var i = 0; i < el.length; i++) {
 el[i].style.backgroundImage = "none";
 el[i].style.backgroundColor = "white";
 }

 el = document.getElementsByTagName('*');
 for (var i = 0; i < el.length; i++) {
 el[i].style.backgroundImage = "none";
 el[i].style.backgroundColor = "white";
 }
 };*/

(function () {

    var $head = $('head');
    var className = 'resetStyle';
    var classStructure =
        '.' + className +
        '{' +
        'color: black !important;' +
        'background-image: none !important;' +
        'background-color: white !important;' +
        '}';

    var $allElementExcludeImg = $("*").not($('img'));


    $head.append('<style>' + classStructure + '</style>');

    function resetStyles(state) {
        if (state) {
            $allElementExcludeImg.addClass(className);
        } else {
            $allElementExcludeImg.removeClass(className);
        }
    }

    /**
     *  click event - "#togglerBtn"
     */
    var $togglerBtn = $("#togglerBtn");

    $togglerBtn.on('click', function (ev) {
        ev.preventDefault();

        var $this = $(this);

        // check if event target is active
        var is_active = $this.hasClass('active');

        if (!is_active) {
            $this.addClass('active');

            // false  - play the function
            return resetStyles(true);
        }

        $this.removeClass('active');

        // true - stop function
        return resetStyles(false);
    });


}());


$('#_biggify').on('click', function() {
    var fontSize = $('html').css('font-size');
    var newFontSize = parseInt(fontSize)+1;

    $('html').css('font-size', newFontSize+'px')
});

$('#_smallify').on('click', function() {
    var fontSize = $('html').css('font-size');
    var newFontSize = parseInt(fontSize)-1;

    $('html').css('font-size', newFontSize+'px')
});

$('#_reset').on('click', function() {
    $('html').css('font-size', '1rem')
});
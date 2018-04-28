

var badd = $("#b-add");
var bsave = $("#save");
var bload = $("#load");

function addTodo(todotext) {
    var div = $('<div class="todo"></div>');
    var divider = $('<div class="todo-divider"></div>');
    var checkdone = $('<input class="checkdone" type="checkbox"></input>');
    var txt = $('<div class="txt" contenteditable="true" data-placeholder="write your task here"></div>');
    
    if (todotext != undefined) {
        txt.append(String(todotext));
    }

    badd.before(div.append(checkdone).append(txt));
    badd.before(divider);
}

function setTextareaAutoResize() {
    $('textarea').each(function () {
        this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
    }).on('input', function () {
        this.style.height = '10px';
        this.style.height = (this.scrollHeight) + 'px';
    });
}

function save() {
    var alltexts = [];
    $('.txt').each(function (indexInArray, valueOfElement) { 
        alltexts.push($(this).text());
    });
    //alert(alltexts);
    setCookie("todo-list", alltexts, 1);
}

function load() {
    var alltexts = getCookie("todo-list");
    alltexts.split(",").forEach(element => {
        addTodo(element);
    });
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// once document loaded completely 
jQuery(document).ready(function () {
    setTextareaAutoResize();    

    //var iDiv = document.createElement('div');
    badd.click(function () {
        addTodo();
    });


    bsave.click(function () { save(); });
    bload.click(function () { load(); });
});
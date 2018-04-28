
var badd = $("#b-add");
var bsave = $("#save");
var bload = $("#load");
var bfilter = $("#filter");

var filter_flag = 0;

function addTodo(todotext) {
    var div = $('<div class="todo"></div>');
    var divider = $('<div class="todo-divider" tabindex="-1"></div>');
    var checkdone = $('<input class="checkdone" type="checkbox"></input>');
    var txt = $('<div class="txt" tabindex="1" contenteditable="true" data-placeholder="write your task here"></div>');
    
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
    setCookie("todo-list", alltexts, 1);
}

function load() {
    var alltexts = getCookie("todo-list");
    alltexts.split(",").forEach(element => {
        addTodo(element);
    });
}

function filter() {
    var disable_filter = filter_flag == 1 ? true : false;

    $('.todo').each(function (indexInArray, valueOfElement) { 
        setFilterHidden($(this), disable_filter);
    });

    filter_flag = 1 - filter_flag;
}

function setFilterHidden(todo, disable_filter) {
    var checkbox = $(todo.children()[0]);
    if(disable_filter) {
        todo.show();
    } else if(checkbox.is(':checked')) {
        todo.hide();
    }
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
    bfilter.click(function () { filter(); });
});
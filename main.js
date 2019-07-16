
var badd = $("#b-add");
var bsave = $("#save");
var bload = $("#load");
var bfilter = $("#filter");

var inp_expire_days = $("#expiration_days");

var todolist = $("#todolist");

var cookie_expire_days = 1;

var filter_flag = 0;

/**************************** todo ****************************/

function addTodo(todotext) {
    var div = $('<div class="todo"></div>');
    var divider = $('<div class="todo-divider" tabindex="-1"></div>');
    var checkdone = $('<input class="checkdone" type="checkbox"></input>');
    var txt = $('<div class="txt" tabindex="1" contenteditable="true" data-placeholder="write your task here"></div>');
    
    if (todotext != undefined) {
        txt.append(String(todotext));
    }

    todolist.append(div.append(checkdone).append(txt));
    todolist.append(divider);

    //badd.before(div.append(checkdone).append(txt));
    //badd.before(divider);
}

/**************************** UI interact ****************************/

/**
 * originally wanted to do that with only html/css but it proved annoyingly complex.
 * so this script will just modify the text area to resize and fill elegantly with the textual content.
 */
function setTextareaAutoResize() {
    $('textarea').each(function () {
        this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
    }).on('input', function () {
        this.style.height = '10px';
        this.style.height = (this.scrollHeight) + 'px';
    });
}



/**************************** save/load ****************************/

/**
 * V3 - same as V2 but add the default "checked" when we save a checked checkbox, because whats the point of checking a checkbox if saving doesnt checks the checkboxing checkbox.
 * security risk from V2 applies here as well.
 */
function save() {
    // this actually sets an HTML attribute to specifically be checked="checked" because otherwise its hidden for some reason probably versioning
    $(".todo").each(function() {
        var checkbox =  $(this).find('.checkdone');
        if(checkbox.is(':checked')) { // yes this is weird solution but a simple one
            checkbox.attr('checked', true);
        }
    });
    var alltexts = todolist.html();
    // we'll save the expiration days just as a number prepending the actual todo
    var expire_days = inp_expire_days.val();
    alltexts = expire_days + alltexts;
    //console.log("[save] cookie text: " + alltexts);
    
    setCookie("todo-list", alltexts, expire_days);
}

function load() {
    var alltexts = getCookie("todo-list");
    
    if(alltexts === ""){ return; } // no cookie
    arr = alltexts.split(/^[^\d]*(\d+)/); // find the first numeric and split the rest out of it
    inp_expire_days.val(arr[1]);
    alltexts = arr[2];
    var dom_todo = $.parseHTML(alltexts);
    todolist.html(dom_todo); // append or html (=inner replaceWith), can add this to user configuration or make popup to ask "r u sure?"

    // set filter defaulted to show everything when we load
    filter_flag = 1;
    filter();
} 

/**************************** filter ****************************/

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

/**************************** main ****************************/

// once document loaded completely 
jQuery(document).ready(function () {
    setTextareaAutoResize();    

    badd.click(function () {
        addTodo();
    });

    bsave.click(function () { save(); });
    bload.click(function () { load(); });
    bfilter.click(function () { filter(); });

    // callbacks for moving todos around
    /*todolist[0].onmousemove = todolistDrag;
    todolist[0].onmousedown = todolistMousedown;
    todolist[0].onmouseup = todolistMouseup;*/

});
/*
var drag_target = null;
function todolistDrag(e) {
    //console.log(e.target); // target, clientX, clientY
    if(drag_target != null) {
        drag_target.parentNode.style.top = e.clientY + 'px';
        console.log(drag_target.parentNode.style.top); 
    }
}

function todolistMousedown(e) {
    if(e.target.className === 'txt') {
        console.log(e.clientX, e.clientY);
        drag_target = e.target;
        drag_target.parentNode.outerHTML = "";
    }
}
function todolistMouseup(e) {
    drag_target = null;
}*/

/**************************** cookies ****************************/

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    cvalue = escape(cvalue);
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    //console.log("[set cookie] " + document.cookie);
}

function getCookie(cname) {
    var name = cname + "=";
    //var decodedCookie = decodeURIComponent(document.cookie); 
    //console.log("[get cookie] " + document.cookie);
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        ca[i] = unescape(ca[i]);
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

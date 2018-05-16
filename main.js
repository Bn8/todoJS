
var badd = $("#b-add");
var bsave = $("#save");
var bload = $("#load");
var bfilter = $("#filter");

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
    var alltexts = $("#todolist").html();
    setCookie("todo-list", alltexts, cookie_expire_days);
}

function load() {
    var alltexts = getCookie("todo-list");
    if(alltexts === ""){ return; } // no cookie
    var dom_todo = $.parseHTML(alltexts);
    $("#todolist").html(dom_todo); // append or html (=inner replaceWith), can add this to user configuration or make popup to ask "r u sure?"
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

    //var iDiv = document.createElement('div');
    badd.click(function () {
        addTodo();
    });


    bsave.click(function () { save(); });
    bload.click(function () { load(); });
    bfilter.click(function () { filter(); });
});


/**************************** cookies ****************************/

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

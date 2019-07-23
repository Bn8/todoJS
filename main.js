// html buttons
var badd = $("#b-add");
var bsave = $("#save");
var bload = $("#load");
var bfilter = $("#filter");

// html other parts
var inp_expire_days = $("#expiration_days");
var todolist = $("#todolist");

// js variables
var cookie_expire_days = 1;
var filter_flag = 0;

// js consts
const delimeter_todos = "#";
const delimeter_values = ",";

/**************************** todo ****************************/

function addTodo(todotext, check=false) {
    var div = $('<div class="todo"></div>');
    var divider = $('<div class="todo-divider" tabindex="-1"></div>');
    var checkdone = $('<input class="checkdone" type="checkbox"></input>');
    var txt = $('<div class="txt" tabindex="1" contenteditable="true" data-placeholder="write your task here"></div>');
    
    if (todotext != undefined) {
        txt.append(String(todotext));
    }

    todolist.append(div.append(checkdone).append(txt));
    todolist.append(divider);
    
    if(check) {checkdone.prop('checked', true); }
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



/**************************** serialization ****************************/

/*
* saving and loading done via cookie where its value is serialized of the TODO list
* delimeted by "#" for new todo and "," for each value within todos
*/

function serializeTODO() {
   var s="";
    $(".todo").each(function() {
        var checkbox =  $(this).find('.checkdone');
        var txt =  $(this).find('.txt');
        if(s!="") { // for the delimeter but not at the beginning (and wont happen at the end)
            s += delimeter_todos;
        }
        if(checkbox.is(':checked')) {
            s+="X";
        } else {
            s+="O";
        }
        s += delimeter_values;
        s += escape(txt.text());
    });
    console.log(s);

    return s;
    
}

function unserializeTODO(s) {
    todolist.empty();
    s.split(delimeter_todos).forEach(element => {
        vals = element.split(delimeter_values);
        var val_checkbox = vals[0];
        var val_txt = unescape(vals[1]);
        console.log(val_checkbox == "X" ? true : false);
        
        addTodo(val_txt,val_checkbox == "X" ? true : false);
    });
}

/**************************** buttons callback ****************************/

/***** save/load ****************************/


function save() {
    var serialized_todo = serializeTODO();
    // we'll save the expiration days just as a number prepending the actual todo
    var expire_days = inp_expire_days.val();

    setCookie("todo-list", expire_days + serialized_todo, expire_days);

}

function load() {
    var alltexts = getCookie("todo-list");
    
    if(alltexts === ""){ return; } // no cookie
    console.log(alltexts);
    
    // cookie expire days extract
    arr = alltexts.split(/^[^\d]*(\d+)/); // find the first numeric and split the rest out of it
    inp_expire_days.val(arr[1]);

    // rest of cookie
    alltexts = arr[2];
    //var dom_todo = $.parseHTML(alltexts);
    //todolist.html(dom_todo); // append or html (=inner replaceWith), can add this to user configuration or make popup to ask "r u sure?"
    unserializeTODO(arr[2]);

    // set filter defaulted to show everything when we load
    filter_flag = 1;
    filter();
} 

/****** filter ****************************/

function filter() {
    var disable_filter = filter_flag == 1 ? true : false;
    
    if(!disable_filter) bfilter.css('border', '0.8px solid yellow');
    else bfilter.css('border', '0.8px solid black');

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
// (copy pasta in case of future development. could be done more simple)
// note we use escape/unescape to encapsulate the data because we dont want special character ";" inside the cookie. whatever, we're not on 1mb system.

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

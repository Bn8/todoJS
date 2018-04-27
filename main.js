

var badd = $("#b-add");//document.getElementById('b-add');

function addTodo() {
    var div = $('<div class="todo"></div>');
    var divider = $('<div class="todo-divider"></div>');
    var checkdone = $('<input class="checkdone" type="checkbox"></input>');
    var txt = $('<div class="txt" contenteditable="true" data-placeholder="write your task here"></div>');
    
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


// once document loaded completely 
jQuery(document).ready(function () {
    setTextareaAutoResize();    

    //var iDiv = document.createElement('div');
    badd.click(function () {
        addTodo();
    });

});
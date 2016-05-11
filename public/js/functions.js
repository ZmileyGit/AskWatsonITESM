$(document).ready(function() {
    $('#send').click(askWatson);
    $('.option-list.options li').click(toggleMode);
    $('input').keypress(function (event) {
        if (event.which == 13) {
          $('#send').click();
        }
    });
});

function onCanplaythrough() {
    console.log('onCanplaythrough');
    var audio = $('audio')[0];
    audio.removeEventListener('canplaythrough', onCanplaythrough);
    try {
      audio.currentTime = 0;
    }catch(ex) {
    }
    audio.controls = true;
    audio.muted = false;
    audio.play();
}

function readText(event){
    var audio = $("audio")[0];
    var element = $(event.currentTarget);
    var footer = element.parent().parent();
    var text = footer.find("span.original").html();
    var downloadURL = '/read' + '?text=' + encodeURIComponent(text);

    audio.pause();
    audio.src = downloadURL;
    audio.addEventListener('canplaythrough', onCanplaythrough);
    $(audio).parent().css({
        "display" : "block"
    });
    audio.play();
    return true;
}

function toggleMode(event){
    console.log("Toogle");
    $('.option-list.options li').each(function(index,element){
        var li = $(element);
        li.attr("data-selected","0");
        $("#"+li.attr("data-container")).css({
            "display" : "none"
        })
    });
    var element = $(event.currentTarget);
    element.attr("data-selected","1");
    $("#"+element.attr("data-container")).css({
        "display" : ""
    });
}
function askWatson(){
    console.log("Ask");
    var question = $("#question").val();
    var container = $("#answers, #evidence");
    container.html("");
    container.css({
        "text-align" : "center",
        "padding-top" : "50px",
        "position" : "relative",
        "overflow" : "hidden"
    });
    var img = $(document.createElement("img"));
    img.attr("src","images/loading.gif");
    img.css({
        "position" : "relative",
        "width" : "300px",
        "top" : "-100px"
    });
    container.append(img);
    $.post( "/ask", { 'question': question },function(data){
        if(data.question !== undefined){
            console.log(data);
            var tiles = $("#answers");
            tiles.html("");
            tiles.attr("style","");
            var dummy = $(".tile.dummy");
            var answers = data.question.answers;
            for(var cont = 0; cont < answers.length; cont+=1){
                var tile = dummy.clone();
                var text = answers[cont].text;
                var aparts = text.split("-");
                var source = "Me";
                var body = "The question doesn't have an answer.";
                if(aparts[0] !== "${noAnswer}"){
                    var parts = aparts[1].split(":");
                    source = parts[0];
                    body = parts[1];
                }
                var confidence = (answers[cont].confidence*100).toFixed(2);
                tile.find("button.title").click(expandTile);
                if(cont === 0){tile.find("button.title").click();}
                tile.find("button.title > span.name").html("Answer " + (answers[cont].id+1));
                tile.find("button.title > span.background").css({
                    "width" : confidence + "%"
                });
                tile.find("div.body").html(body);
                tile.find("div.footer > span.note").html("Source: " + source);
                tile.find("div.footer span.original").html(body);
                tile.find("div.footer li.translate").click(translateTile);
                tile.find("div.footer li.read").click(readText);
                tiles.append(tile);
                tile.removeClass("dummy");
            }
            tiles = $("#evidence");
            tiles.html("");
            tiles.attr("style","");
            tiles.css({
                "display" : "none"
            });
            var evidence = data.question.evidencelist;
            for(var cont = 0; cont < evidence.length; cont+=1){
                var tile = dummy.clone();
                var text = evidence[cont].text;
                if(text !== undefined){
                    var confidence = (evidence[cont].value*100).toFixed(2);
                    tile.find("button.title").click(expandTile);
                    if(cont === 0){tile.find("button.title").click();}
                    tile.find("button.title > span.name").html(evidence[cont].title);
                    tile.find("button.title > span.background").css({
                        "width" : confidence + "%"
                    });
                    tile.find("div.body").html(evidence[cont].text);
                    tile.find("div.footer > span.note").html("Source: " + evidence[cont].metadataMap.originalfile);
                    tile.find("div.footer span.original").html(evidence[cont].text);
                    tile.find("div.footer li.translate").click(translateTile);
                    tile.find("div.footer li.read").click(readText);
                    tiles.append(tile);
                    tile.removeClass("dummy");
                }
            }
        }else{
            console.log("Error");
        }
    },"json");
}
function expandTile(event){
    console.log("Expand");
    var element = $(event.currentTarget);
    var expanded = parseInt(element.attr("data-expanded"));
    var parent = element.parent();
    var state = "block";
    var exp = "1"
    var symbol= "keyboard_arrow_up";
    if(expanded){
        state = "";
        exp = "0";
        symbol = "keyboard_arrow_down";
    }
    parent.find(".body").css({
        "display" : state
    });
    element.attr("data-expanded",exp);
    element.find("i").html(symbol);
}

function translateTile(event){
    console.log("Translate");
    var element = $(event.currentTarget);
    var parent = element.parent().parent().parent();
    var body = parent.find("div.body");
    var text = body.html();
    var original = element.parent().parent().find("span.original");
    body.html("Translating...");
    if(element.attr("data-lang") === "en"){
        element.attr("data-lang","es");
        var trans = element.parent().parent().find("span.trans");
        if(trans.length === 0){
            $.post( "/translate", { 'text': text },function(data){
                body.html(data.translations[0].translation);
                var span = $(document.createElement("span"));
                span.addClass("trans");
                span.html(data.translations[0].translation);
                element.parent().parent().append(span);
                console.log(data);
            });
        }else{
            body.html(trans.html());
        }
    }else{
        element.attr("data-lang","en");
        body.html(original.html());
    }
}

function closeBar(event){
    var element = $(event.currentTarget);
    console.log(element);
    element.parent().css({
        "display" : ""
    });
}
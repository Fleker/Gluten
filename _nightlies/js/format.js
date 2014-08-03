// Formatting Engine

file.clearMetadata();
window.metadata = [];
format_js_index = 0;

function new_format() {
	format_js_index = -1;
	window.metadata = [{blank: 0}];	
	$('#file_metadata').empty();
	min_word = 0;
	max_word = 0;
	min_char = 0;
	max_char = 0;
}
function new_format_item(type, ops) {
	format_js_index++;
	if(ops === undefined)
		ops = {};
	window.metadata[format_js_index] = {type: type, index: format_js_index, min: 0, max: 0};
	var option_choices = ["label", "max", "min", "mtype", "placeholder", "description", "id"];
	//FUTURE - Default Text
	for(i=0;i<option_choices.length;i++) {
		if(ops[option_choices[i]] !== undefined) {
			window.metadata[format_js_index][option_choices[i]] = ops[option_choices[i]];
		} else {
			window.metadata[format_js_index][option_choices[i]] = "";
		}
	}
}
function new_format_block() {
	new_format_item("block");	
}
function new_format_nl() {
	new_format_item("nl");
}
window.annotated_bib = false;
function set_up_format(name, property) {
	switch(name) {
		case 'word count':
			min_word = property.min;
			max_word = property.max;
		break;
		case 'character count':
			min_char = property.min;
			max_char = property.max;
		break;	
		case 'annotated bibliography':
			window.annotated_bib = true;
		break;
	}
}
function setFormatItemWidth(index) {
    if($('#format_item_'+index).val() === undefined)
        $('#format_item_'+index).css('width', '11em');
	else if($('#format_item_'+index).val().length < 22)
		$('#format_item_'+index).css('width', '11em');
	else if($('#format_item_'+index).val().length > 80)
		$('#format_item_'+index).css('width', '40em');
	else
		$('#format_item_'+index).css('width', 0.5*$('#format_item_'+index).val().length+"em");
}
function post_format() {
	var out = "";
	for(i=0;i<=format_js_index;i++) {
		type = window.metadata[i].type;
		
		if(type == "content") {
			out = out + post_format_content(window.metadata[i]);
		} else if(type == "name") {
			out = out + post_format_text(window.metadata[i]) + "&nbsp;&nbsp;" + post_format_text(window.metadata[i], -1);
		} else if(type == "block") {
			out = out + "<br><br>";
		} else if(type == "nl") {
			out = out + "<br>";
		} else if(type == "mltext") { 
			out += post_format_mltext(window.metadata[i]);
		} else if(type == "label") {
			out += "<div style='font-weight:bold;border-bottom:solid 1px #888;width:90%;margin-left:5%;'>"+window.metadata[i].label+"</div>";
		} else if(type == "date") {
			out += post_format_date(window.metadata[i]);
		} else {
			out = out + post_format_text(window.metadata[i]);
		}		
		out = out + "<br>";
	}
	$('#file_metadata').html(out);
	
	for(i=0;i<=format_js_index;i++) {
		if(window.metadata[i].min.length !== 0 || window.metadata[i].max.length !== 0) {
			/*var e = '#format_item_'+i;
			$(e).on('input', function() {
				format_check_count(i);
			});*/
			setInterval("format_check_count("+i+")", 100);
		} else
		  setInterval("setFormatItemWidth("+i+")", 100);
		/*if($('#format_item_'+i).val() != undefined) {
			if($('#format_item_'+i).val().length < 20)
				$('#format_item_'+i).css('width', '10em');
			else if($('#format_item_'+i).val().length > 80)
				$('#format_item_'+i).css('width', '40em');
			else
				$('#format_item_'+i).css('width', 0.5*$('#format_item_'+i).val().length+"em");
		}*/

       /* setTimeout("setFormatItemWidth("+i+");", 1000);
       		$('#format_item_'+i).on('input', function() {
			     setFormatItemWidth(i);
        	});*/
	}
	onInitToolbar();
	
	//Set up selection parameters
			 document.getElementsByClassName("content_textarea")[0].onmouseup = function() {
				 	if($('.content_textarea').html().length > 1) {				 
//						rangy.getSelection().expand("word", {
//						wordOptions: {
//							includeTrailingSpace: false,
//							wordRegex: /[a-z0-9]+(['\-][a-z0-9]+)*/gi
//						}
//                		});
					}
					//postRange('click and select');
			}
			document.getElementsByClassName("content_textarea")[0].oninput = function() {
				postRange('oninput');
				//saveFile();
			}	
			document.getElementsByClassName("content_textarea")[0].onkeyup = function() {
				postRange('onkeyup');
			}	
	//Theme parameters for content_textarea
	$('.content_textarea').css('background-color', theme.bodyColor).css('color', theme.fontColor);
	console.log('CT colors set');
    
    //Preload data that already exists
    for(j in window.metadata) {
		try {
            if(i == window.metadata[j].id.replace(/ /g, '_') && $('#format_item_'+j).val().length == 0) {
//			   onsole.log("Insert "+d[i]+" for "+window.metadata[j].id);
                //console.log($('#format_item_'+j).val(), i);
			     $('#format_item_'+j).val(decodeURIComponent(d[i]));
			     $('#format_item_'+j).html(decodeURIComponent(d[i]));
            }
        } catch(e) {}
    }
}
function format_check_count(i) {
	content = $('#format_item_'+i).val();
	if(content.length === 0)
		content = $('#format_item_'+i).html();
	if(window.metadata[i] === undefined)
		console.log("md"+i);
	mtype = window.metadata[i].mtype;
	min = window.metadata[i].min;
	max = window.metadata[i].max;
	if(mtype == "c") {
		characters = content.length;
		var e = '#format_count_'+i;
		if(min > characters) {
			$(e).html('<span style="color:'+theme.fontColorAlt+'">'+min+'</span>&emsp;<span class="gluten_red">'+characters+'&nbsp;'+mtype+'</span>&emsp;<span style="color:'+theme.coloralt+'">'+max+'</span>');
		} else if(max < characters) {
			$(e).html('<spanstyle="color:'+theme.fontColorAlt+'">'+min+'</span>&emsp;<span class="gluten_red">'+characters+'&nbsp;'+mtype+'</span>&emsp;<span style="color:'+theme.coloralt+'">'+max+'</span>');
		} else {
			$(e).html('<span class="gluten_gray">'+characters+'&nbsp;'+mtype+'</span>');
		}	
	} else if(mtype == "w") {
		words = content.split(' ').length;
		var e = '#format_count_'+i;
		if(min > words) {
			$(e).html('<span style="color:'+theme.fontColorAlt+'">'+min+'</span>&emsp;<span class="gluten_red">'+words+'&nbsp;'+mtype+'</span>&emsp;<span style="color:'+theme.fontColorAlt+'">'+max+'</span>');
		} else if(max < words) {
			$(e).html('<span style="color:'+theme.fontColorAlt+'">'+min+'</span>&emsp;<span class="gluten_red">'+words+'&nbsp;'+mtype+'</span>&emsp;<span style="color:'+theme.fontColorAlt+'">'+max+'</span>');
		} else {
			$(e).html('<span class="gluten_gray">'+words+'&nbsp;'+mtype+'</span>');
		}
	}	
    setFormatItemWidth(i);
}


function post_format_text(m, inv) {
	var out = "";
	
	var ind = m.index;
	if(inv !== undefined && inv !== 0)
		ind = (m.index-inv)+"_2";
	else {
		out = out + m.label+":&nbsp;";
		if(m.description.length)
			out = out + "<br><span class='format_description'>"+m.description+"</span><br>";
	}
	out = out + "<input type='text' id='format_item_"+m.index+"' placeholder='"+m.placeholder+"' style='width:55%' onmouseenter='hideHovertag()'>";
	if(m.min.length !== 0 || m.max.length !== 0) {
		out = out + "<div class='format_count' id='format_count_"+m.index+"'></div>";	
	}
	return out;
}
function post_format_date(m, inv) {
	var out = "";
	
	var ind = m.index;
	if(inv !== undefined && inv !==0)
		ind = (m.index-inv)+"_2";
	else {
		out = out + m.label+":&nbsp;";
		if(m.description.length)
			out = out + "<br><span class='format_description'>"+m.description+"</span><br>";
	}
	out = out + "<input type='date' id='format_item_"+m.index+"' placeholder='"+m.placeholder+"' onmouseenter='hideHovertag()'>";
	if(m.min.length !== 0 || m.max.length !== 0) {
		out = out + "<br><div class='format_count' id='format_count_"+m.index+"'></div>";	
	}
	return out;
}
function post_format_mltext(m) {
	var out = "";
	out = out + m.label + "<br>";
	if(m.description.length)
		out = out + "<span class='format_description'>"+m.description+"</span><br>";	
	out = out + "<div class='post_format_mltext' contenteditable id='format_item_"+m.index+"' onmouseenter='hideHovertag()'></div>";
	if(m.min.length !==0 || m.max.length !== 0) {
		out = out + "<div class='format_count' id='format_count_"+m.index+"'></div>";	
	}
	return out;
}
function post_format_content(m) {
	var out = "<div class='small-12 column' style='margin-left: -11px;width: calc(100% + 27px);'><div class='content_wrapper row'><div class='content overflow small-12 column'></div>";
	out += "<div class='content toolbar small-12 column'></div>";
	out += "<div contenteditable='true' class='content content_textarea small-12 column'></div></div>";
	out += "<div class='content_wordcount small-12 column' style='display:inline-flex'><div class='content_word'></div>&emsp;<div class='content_character'></div>&emsp;<div class='content_save'>&emsp;</div></div></div>";
	return out;	
}

function Tool(id, name, action) {
    this.id = id || "";
    this.name = name || id;
    this.action = action || function() { console.error("Tool "+id+" has no action."); };                                               
    Tool.prototype.toHtml = function() {
        return "<button class='toolbutton' data-tool='"+this.id+"'>&emsp;"+this.name+"&emsp;</button>|";  
    };
}
function ToolbarManager() {
    this.availableTools = {
        character: new Tool("character", "Character", function() {
            panelManager.run("Main_Character");
        }), 
        heading1: new Tool("heading1", "H1", function() {
            contentAddSpan({node:"span", class:"heading1 heading"});
            hovertagManager.refresh();
        }),
        heading2: new Tool("heading2", "H2", function() {
            contentAddSpan({node:"span", class:"heading2 heading"});
            hovertagManager.refresh();
        }),
        heading3: new Tool("heading3", "H3", function() {
            contentAddSpan({node:"span", class:"heading3 heading"});
            hovertagManager.refresh();
        }),
        heading4: new Tool("heading4", "H4", function() {
            contentAddSpan({node:"span", class:"heading4 heading"});
            hovertagManager.refresh();
        }),
        heading5: new Tool("heading5", "H5", function() {
            contentAddSpan({node:"span", class:"heading5 heading"});
            hovertagManager.refresh();
        }),
        image: new Tool("image", "Image", function() {
            var imid = getObjectSize('img');
            contentAddSpan({node:"div", class:"img inline img"+imid, ce: false});
            imgDetails(imid);
            hovertagManager.refresh();
        }),
        citation: new Tool("citation", "Citation", function() {
            initiateCitationEditor();
        }),
        table: new Tool("table", "Table", function() {
            var tid = getObjectSize('table');
            contentAddSpan({node:"div", class:"table table"+tid+" inline", ce: false});
            tableDetails(tid);
            hovertagManager.refresh();
        }),
        bold: new Tool("bold", "<button class='fontawesome-bold'></button>", function() {
            console.warn("bold");
            toggleBold();	
        }),
        italics: new Tool("italics", "<button class='fontawesome-italics'></button>", function() {
            toggleItalics();
        }),
        reftext: new Tool("reftext", "Ref Text", function() {
            var rtid = getObjectSize('reftext');
            contentAddSpan({node:"span", class:"reftext reftext"+rtid, ce: false});
            refTextDetails(rtid);
            hovertagManager.refresh();
        }),
        LaTeX: new Tool("LaTeX", "LaTeX", function() {
            var lid = getObjectSize('latex');
            console.log("LATEX "+lid);
            contentAddSpan({node:"kbd", class:"latex latex"+lid, ce: false});
            latexDetails(lid);
        }),
        pbreak: new Tool("pbreak", "Page Break", function() {
            contentAddSpan({node:"kbd", class:"pagebreak", ce: false});
            hovertagManager.refresh();
            setTimeout("$('.pagebreak').empty();", 1000);
        }),
        fullscreen: new Tool("fullscreen", "<span class='fa fa-expand'></span>", function() {
            fullscreen();
        })
    };
    this.stockTools = {};
    for(i in this.availableTools) {
        this.stockTools[i] = this.availableTools[i];   
    }
    ToolbarManager.prototype.getAvailableTools = function() {
        return this.availableTools;   
    };
    ToolbarManager.prototype.addTool = function(tool) {
        this.availableTools[tool.id] = tool;
        post_toolbar(window.tools, window.tools_freeform);
    };
}
toolbarManager = new ToolbarManager();

//TODO Allow tools to just appear w/ boolean
function post_toolbar(tools, freeform) {
	window.tools = tools || [];
    window.tools_freeform = freeform || false;
	var overflow = false;
	$('.toolbar').empty();
	$('.overflow').empty();
	$('.toolbar').append("<div class='toolbar_options' style='display:inline'>");
    $('.toolbar').append(toolbarManager.getAvailableTools().fullscreen.toHtml()+toolbarManager.getAvailableTools().character.toHtml());
    $('.toolbutton[data-tool="fullscreen"]').css('margin-left','-15px')
    
    for(i in tools) {
        if(toolbarManager.getAvailableTools()[tools[i]] !== undefined)
            $('.toolbar').append(toolbarManager.getAvailableTools()[tools[i]].toHtml());   
        else if(freeform === true && toolbarManager.stockTools[tools[i]] === undefined) //This is a custom tool
            $('.toolbar').append(toolbarManager.getAvailableTools()[tools[i]].toHtml());  
    }
    //TODO Need to redo overflow and make it more responsive
    $('.overflow').hide();
    $('.toolbutton').on("click", function() {
        toolid = $(this).attr('data-tool');
        toolbarManager.getAvailableTools()[toolid].action();
	});
}
function getObjectSize(classname) {
    if($('.'+classname).length == 0)
        return 0;
    var i = 0;
    $('.'+classname).each(function(N, E) {
        var int = parseInt($(E).attr('class').split(' ')[1].match(/\d+/g)[0])+1;
        if(int > i)
            i = int;
    });
    return i;   
}
window.fullscreenOn = false;
/*$(window).resize(function () {*/
toolbar_width = 0;
sy_save = 0;
function update_toolbar_style() {}
function refreshBodyDesign() {
    if(fullscreenOn === false) {
        var h = (window.innerHeight-100)*0.85;
        $('.content_textarea').css('height', h+'px');
    }
}
function refreshBodyDesign1() {
	toolbar_width = $('.toolbar').width();
	if(window.paneltitle === undefined) {
		console.log("Change without panel");
		if(window.fullscreenOn === false) {
			var h = (window.innerHeight-100)*0.85;
			var w = window.innerWidth-25;
			$('.content_wrapper').css('width', w+'px').css('margin-bottom', '-3px').css('margin-left', '-13px')/*.css('overflow-x', 'hidden')*/;
			$('.content_textarea').css('height', h+'px').css('width', w+'px');	
		}	
		
		//Update Header
		ribbonSwitch(ribbon_index, true);
	} else if(window.paneltitle !== undefined) {
		console.log("Change with panel");
		$('.content_wrapper').css('width', 'calc(100% - 1px)');
        if($('.PanelMaximizeEvent').attr('data-status') === 0)
            sizePanel(panelwidth, false);
            
		$('.content_textarea').css('width', '100%').css('margin-left', '0px');
	}
//    setTimeout(function() { onInitToolbar(); }, 100);
}
$( window ).resize(function() {
  refreshBodyDesign();
  ribbonSwitch(ribbon_index, true);
    //TODO Fix readjust toolbar
	//console.log(1);
});

// Hovertag Class
function Hovertag(classname, textcode, action) {
    this.classname = classname;
    this.textcode = textcode || classname;
    this.action = action || function() { };
    Hovertag.prototype.toString = function() {
        var json = {classname: this.classname, textcode: this.textcode.toString(), action: this.action.toString()};
        return JSON.stringify(json);
    }
}
// HovertagManager Class
function HovertagManager() {
    this.registry = {
        citation: new Hovertag('citation', function(element) {
            return citation[$(element).attr('data-id')].Title;
        }, function(element) {
            initiateCitationEditor(undefined, $(element).attr('data-i'));
        }),
        context: new Hovertag('context', function(element) {
            return window.context[parseInt($(element).attr('data-i'))].type;
        }, function(element) {
            contextPanel($(element).attr('data-i'));
        }),
        latex: new Hovertag('latex', function(element) {
            return $(element).attr('data-cmd');
        }, function(element) {
            latexDetails($(element).attr('data-id'));
        }),
        heading1: new Hovertag('heading1', 'Heading-1'),
        heading2: new Hovertag('heading2', 'Heading-2'),
        heading3: new Hovertag('heading3', 'Heading-3'),
        heading4: new Hovertag('heading4', 'Heading-4'),
        heading5: new Hovertag('heading5', 'Heading-5'),
        img: new Hovertag("img", "Image Details", function(element) {
            imgDetails($(element).attr('data-id'));
        }),
        table: new Hovertag('table', function(element) {
            return $(element).attr('data-title');
        }, function(element) {
            tableDetails($(element).attr('data-id'));
        }),    
        reftext: new Hovertag("reftext", function(el) {
            return "Ref: "+$(el).attr('data-ref')
        }, function(el) {
            refTextDetails($(el).attr('data-id'));
        }),
        pagebreak: new Hovertag("pagebreak", "Page Break")
    };
    HovertagManager.prototype.implement = function(hovertag) {
        this.registry[hovertag.classname] = hovertag;
        this.refresh();
    };
    HovertagManager.prototype.refresh = function() {
        for(var i in this.registry) {
            var htag = this.registry[i];
            var jtag = $('.'+htag.classname);
            jtag.off();
            jtag.attr('data-tooltip', 'true');
//            jtag.attr('data-title', htag.textcode.toString());
            jtag.attr('data-class', htag.classname);
            jtag.attr('data-options', 'disable_for_touch:true');
            jtag.click(function() {
                hovertagManager.registry[$(this).attr('data-class')].action(this);
            });
            
            $('.tooltip[data-selector="'+htag.classname+'"]').remove();
            $('body').append(Foundation.libs.tooltip.settings.tip_template(htag.classname, htag.textcode));
            $('.'+htag.classname).hover(function() {
                var classname = $(this).attr('data-class')];
//                var classname = $(this).attr('class').split(' ')[0];
                console.log(classname);
                var tag = hovertagManager.registry[classname];
                //FIXME there must be a better system for local vars
                Foundation.libs.tooltip.showTip($('.tooltip[data-selector="'+classname+'"]'));
                if(typeof(tag.textcode) == "function") {
                    console.warn("Eval tag");
                    txt = tag.textcode(this);
                } else {
                    console.warn("Text tag");
                    txt = tag.textcode;
                }
                
                $('.tooltip[data-selector="'+classname+'"]').css('top', $(this).offset().top+30).css('left', $(this).offset().left+8).html( $(Foundation.libs.tooltip.settings.tip_template(tag.classname, txt)).html());
            }, function() {
                var classname = $(this).attr('class').split(' ')[0];
                Foundation.libs.tooltip.hide($('.tooltip[data-selector="'+classname+'"]'));
            });
        }
    };
    HovertagManager.prototype.fromString = function(string) {
        //Takes saved list and reads everything   
        var json = JSON.parse(string);
        for(var i in json) {
            if(json[i].textcode.indexOf('function') > -1) {
                json[i].textcode = "("+json[i].textcode+")()";
                json[i].textcode = Function(json[i].textcode);
            }
            json[i].action = Function("("+json[i].action+")()");
            if(this.registry[json[i].classname] !== undefined) 
                 continue;
            var htag = new Hovertag(json[i].classname, json[i].textcode, json[i].action);
            this.implement(htag);
        }
    };
    HovertagManager.prototype.toString = function() {
        var a = "[";
        for(i in this.registry) {
            a += this.registry[i].toString()+",";   
        }
        a = a.substring(0,a.length-1) + "]";
        return a;
    };
}
hovertagManager = new HovertagManager();
function hideHovertag() {
    console.error("Remove me!");
    $('.hovertag').hide();
}
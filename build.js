function startBuild() {
	//initiate the build code, show the progress indicator, and start sending stuff to different functions to do different stuff.
	console.warn('start');
		$('.build').fadeIn(500);
	//$('.page').css('width','8.5in');
	window.section_name = "";
	$('#searching').val('');
	$('.build').html('<button onclick="exitBuild()" class="noprint">Return to Editor</button>');
		//$('.build_progress').css('display', 'block').css('position', 'fixed').css('width', '50%').css('height', '50%').css('top','25%').css('left','25%').css('background-color', 'rgba(0,0,0,0.3)').css('font-size','16pt').css('margin-top','10%');
	initiatePopup({title:"Build Progress",bordercolor:"#8f6",ht:"<div class='build_progress'></div>"});
	updateBuildProgress('Initiating Build...');
	setTimeout('continueBuild()',500);
}

function continueBuild() {
	//To {format}.js
	try {
		onStylePaper();	
	} catch(e) {
		
	}
	updateBuildProgress('Building Text...');
	onBuildFormat();
		updateBuildProgress('Setting Headers...');	
	onGetFormats();
		updateBuildProgress('Formatting Content...');
	if($('.content_textarea > .citation').length) {
		onBuildBibliography();
			updateBuildProgress('Building Bibliography...');
	}
	onSetHeader();
		updateBuildProgress('Setting up display...');
		
	//To stuff
		//$('.body').css('display', 'none');
		$('.body').fadeOut(500);
	finishBuild();
	scrollTo(0,0);
	console.warn('finish');
	//$('.build').css('display', 'block');
}
function updateBuildProgress(text) {
	$('.build_progress').html(text);	
}
function finishBuild() {
	//$('.build_progress').css('display', 'none');
	closePopup();
	$('.header').hide(1000);
		//stopgf;
	//$('.page').css('width','70%');
}
function exitBuild() {
	$('.header').show(1000);
	$('.body').show(500);
	$('.build').hide(350);
}
//Integration into format.js files
function grabMetadata(i) {
	o = window.metadata[i];
	o.value = $('#format_item_'+i).val();
	return o;	
}
function searchMetadata(request) {
	for(i=0;i<window.metadata.length;i++) {
		if(window.metadata[i].id == request || window.metadata[i].label == request)
			return i;	
	}
}
function valMetadata(label) {
	return grabMetadata(searchMetadata(label)).value;	
}
function valAuthor() {
	searchMetadata('Author');	
}
function centerText(text) {
	return '<div style="text-align:center">'+text+'</div>';
}
function boldText(text) {
	return '<span style="font-weight:bold">'+text+'</span>';	
}
function sizeText(text, size) {
	return '<span style="font-size:'+size+'">'+text+'</span>';	
}
function oneColumnText(text) {
	return '<div>'+text+'</div>';	
}
//Set up universal paper style guidelines
column = 0;
function enable_format(setting) {
	switch(setting) {
		case 'double space': 
			$('.build').css('line-height', '2em');
		break;
		case '2 columns':
			column = 2;
		break;
		case '3 columns':
			column = 3;
		break;
	}	
}

//Page generator and manager
function add_new_page(pagename) {
		p = $('.page').length;
		if(window.section_name.length) {
			psec = $('.'+section_name).length;
			secname = window.section_name+psec+" "+window.section_name;
		} else
			secname = ""
		$('.build').append('<div class="page '+pagename+' page'+p+' '+secname+'" data-p="'+p+'"><div class="pageheader page'+p+'header"></div> <div class="pagebody page'+p+'body"></div> <div class="pagefooter"></div></div><hr style="height:2px;width:90%;margin-left:5%;>');
}
function add_new_section(section_name) {
	window.section_name = section_name;
	p = $('.'+section_name).length;
	//add_new_page(section_name+p);
	add_new_page();
}
function newline() {
	return "<br>";	
}
function find_page(pagename) {
	return $('.'+pagename).attr('data-p');
}
function add_to_page(text, i, name, col) {
	//console.error("add_to_page("+text+", "+i+", "+name+", "+column+");");
	if(i != undefined) {
		$('.page'+i+'body').append(text);		
	} else if(name != undefined) {
		$('.'+pagename+'body').append(text);	
	} else {
		p = $('.page').length-1;
		if(col != undefined && col != 0) {
			$('.page'+p+'col'+(col-1)).append(text);
			//console.error("$('.page"+p+"col"+(col-1)+"').append(text);");
		} else {
			$('.page'+p+'body').append(text);		
		}
	}
}	
function paste_content() {
	add_to_page("<div class='pasteContent'></div>");	
}
function push_header(text) {
	i = 1;
	$('.pageheader').each(function() {
		var ptemp = text.replace(/PAGE/g, i);
		i++;
		$(this).html(ptemp);
	});	
}
function customize_this_header(page, text) {
	text = text.replace(/PAGE/g, (parseInt(page)+1));
	$('.page'+page+'header').html(text);	
}
function lcr_split(left, center, right) {
	return "<table style='width:100%'><tr><td>"+left+"</td><td style='text-align:center'>"+center+"</td><td style='text-align:right'>"+right+"</td></tr></table>";	
}

//Content Formatting
function citationFormatted(string, i, id, page) {
	//Insert a citation content_formatted object and return it with properties filled in
	console.log(string, id);
	console.warn(citation[id]);
	string = string.replace(/AUTHOR_FIRST_I/g, citation[id].AuthorFirst.substr(0,1));
	string = string.replace(/AUTHOR_FIRST/g, citation[id].AuthorFirst);
	string = string.replace(/AUTHOR_LAST/g, citation[id].AuthorLast);
	string = string.replace(/EDITION/g, citation[id].Edition);
	string = string.replace(/PUBCITY/g, citation[id].City);
	string = string.replace(/PUBCOMP/g, citation[id].Publisher);
	string = string.replace(/TITLE/g, citation[id].Title);
	string = string.replace(/VOLUME/g, citation[id].Volume);
	string = string.replace(/URL/g, citation[id].Url);
	string = string.replace(/YEAR/g, citation[id].Year);
	string = string.replace(/PAGE/g, page);	
	return string;	
}
function headingFormatted(spec,input,number) {
	console.error(spec);
	var string = spec;
	string = string.replace(/TEXT/g, input);
	string = string.replace(/LISTA/g, numToLetter('A',number));
	string = string.replace(/LISTa/g, numToLetter('a',number));
	string = string.replace(/LIST1/g, number);
	string = string.replace(/LISTI/g, numToRoman('I', number));
	string = string.replace(/LISTi/g, numToRoman('i', number));
	console.error(string);
	return string;
}
function numToLetter(capy, number) {
	var cap = ["A", "B", "C","D","E","F","G"];
	//TODO Complete Letter Set
	if(capy == "A")
		return cap[number-1];
	else
		return cap[number-1].toLowerCase();
}
function numToRoman(capy, number) {
	var cap = ["I", "II", "III","IV","V","VI","VII","VIII","IX","X"];
	//TODO Complete set
	if(capy == "I") 
		return cap[number-1];
	else
		return cap[number-1].toLowerCase();
}
function post_content_formatting(object) {
	//Duplicate paper
	var cont = $('.content_textarea').html();
	$('.draft').html(cont);
	
	//Format Citations
	$('.draft > .citation').each(function() {
		i = $(this).attr('data-i');
		id = $(this).attr('data-id');
		page = $(this).attr('data-page');
		
		//List various types of citations
		if(citation[id].Main == "on" && object.citation_main != undefined) {
			$(this).html($(this).html()+" "+citationFormatted(object.citation_main, i, id, page));
		} else {
			$(this).html($(this).html()+" "+citationFormatted(object.citation, i, id, page));
		}
	});
	
	//Format Headings
	mhead = {} /*Master Heading Obj*/
	var h1 = 1;
	var h2 = 1;
	var h3 = 1;
	$('.draft > .heading').each(function() {
		//$(this).css('display','inline');
		if($(this).attr('class').indexOf('heading1') > -1) {
			$(this).html(headingFormatted(object.heading1,$(this).html(),h1));
			h1++;
			h2 = 1;
			h3 = 1;	
		} else if($(this).attr('class').indexOf('heading2') > -1) {
			$(this).html(headingFormatted(object.heading2,$(this).html(),h2));
			h2++;
			h3 = 1;	
		} else if($(this).attr('class').indexOf('heading3') > -1) {
			$(this).html(headingFormatted(object.heading3,$(this).html(),h3));
			h3++;
		}
	});
	
	//Now all formatting is complete. We shall port the content over to the actual paper
	//Prevent divs from registering a split, replicate for spans so parent is kept
	//console.warn($('.draft').html());
	/*var erray = new Array ('i','b','u','sup','sub');
	for(ele in erray) {
		$('.draft > span > '+erray[ele]).each(function() {
			var s = $(this).attr('style');
			$(this).html($(this).html().replace(/ /g,'</'+erray[ele]+'>&nbsp;<'+erray[ele]+' style="'+s+'">'));
		});
	}*/
	$('.draft > span > div').each(function() {
		$(this).html($(this).html().replace(/ /g,'==='));
	});
	//div joiner
	$('.draft > div').each(function() {
		$(this).html( $(this).html().replace(/ /g, '==='));
	});
	//console.warn($('.draft').html());
	cont = $('.draft').html();
	//cont = cont.replace(/<span[^<]+?>/g, "");
	//cont = cont.replace("</span>", "",'g');
	//NEED TO FIX SPLITTER TO BE MORE LENIENT, NOT HACK HTML INTO IT
	
	//ca =  cont.split(' ');
	cont = cont.replace(/&nbsp;/g, " ");
	
	/*** Replace output function so that it places every item into an array instead of just outputting ***/
function c(s) {
	//console.log(s);	
	//s = s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	//$('body').append(s+"<br>");
}
function output(e, tag, w) {
	var out = "";
	if(e.substr(-1) != ">")
		e = e+">";
	if(w.length) {
		if(tag.length) {
			c("Output: "+tag+w+"</"+e.substr(1)+" ");
			out = tag+w+"</"+e.substr(1)+" ";
			//return tag+w+"</"+e.substr(1)+" ";
		} else {
			c("Output: "+w+" ");
			out = w+" ";
			//return w+" ";
		}
	} else {
		//return "";
	}
	if(out.length)
		d.push(out);
	return out;
	
}


//var a = document.getElementById('a').innerHTML;
var a = cont;
var b = a.split('');
d = new Array();
var e = '';
var w = '';
var tag = '';
var intag = false;
var inend = false;
var ine = false;
var out = "";
var breakk = false;
$('body').append("<hr>");
for(i in b) {
	var b1 = (parseInt(i)+1);
	c(": "+b[i]);
	breakk = false;
    if(b[i] == "<") {
        if(b[b1] == "/") {
			 /***/
			 out = out + output(e, tag, w);
            //$('body').append(tag+",<br>"+e+"; "+w+"<br>");
			c(tag+", "+e+"; "+w);
            w = '';
			
            inend = true;  
			intag = false;
			ine = false;
            tag = "";
			c("End of tag");
        } else {
             /***/
			 out = out + output(e,  tag, w);
            //$('body').append(tag+",<br>"+e+"; "+w+"<br>");
			c(tag+", "+e+"; "+w);
            w = '';
			
			 intag = true;
             ine = true;
			 inend = false;
			 tag = "";
			 e = "";
			
        }
		c("<"+b[b1]+" !");
    }
    if(b[i] == " ") {
        if(ine) {
            ine = false; 
			c("ine "+e);  
        }
        if(!intag) {
            out = out + output(e, tag, w);
            //$('body').append(tag+",<br>"+e+"; "+w+"<br>");
			c("___"+tag+", "+e+"; "+w);
            w = '';
            breakk = true;
        }
    }
	if(!breakk) {
		if(intag) {
			tag = tag + b[i]; 
			c("tag "+tag);
		} else if(!inend) {
			 w = w + b[i];
			 c("w "+w);
		}
		if(ine) {
			e = e + b[i];
			c("E "+e);
		}
		
		if(b[i] == ">") {
			intag = false;
			c("Intag is off");
			c(object.paragraph_indent+", "+inend + ", " + e);
			if((e.indexOf('div') > -1 || e.indexOf('br') > -1) && e.length && inend && object.paragraph_indent != undefined) { /** OR if some other type of break is detected*/
				out = out + output('', '', object.paragraph_indent);
			}
			if(inend) 
				 e = "";
			 inend = false;
			 ine = false;
		}
	}
}
 /***/
	 /*out = out + output(e, tag, w);
		//$('body').append(tag+",<br>"+e+"; "+w+"<br>");
		c(tag+", "+e+"; "+w);
		w = '';
	//div splitter
	out = out.replace(/---/g, ' ');*/

	/*** *** Now implement the project **/
	var maxh = $('.scale').height()*11; //Add 9+2 for body margins just because it works. Don't question it. (It probably has to do with the 1 in padding on the top and bottom, making total height 13 and body 11.
	/* @TODO Improve the column features by allowing it to work with standard CSS (somehow, I don't know how to implement it only for the body), maybe if you set it up as a two column you can add things that bridge? That would definitely ease up the codebase */
	function getColumnOut(p) {
		cout = "<table style='width:100%'><tr>";
		for(i = 0;i<column;i++) {
			cout += "<td style='width:"+(100/column)+"%; vertical-align:top;'><div class='page"+p+"col"+i+"' style='width:100%'></div></td>";		
			////'"	//'"
		}
		cout += "</tr></table>";
		console.warn("getColumnOut("+p+")");
		return cout;
	}
	add_to_page(getColumnOut($('.page').length-1));
	if(column == 0)
		col_count = 0;
	else
		col_count = 1;
	for(j in d) {
		//TODO - Find a way to grab the current page, not necessarily the last one. This will be handy for things that are added after content
		p = $('.page').length-1;
		add_to_page("<span class='hideme'>"+d[j]+" "+"</span>", undefined, undefined, col_count);
		//console.warn($('.page'+p+'body').height(), maxh);
		//console.warn(('.page'+p+'col'+(col_count-1)), $('.page'+p+'col'+(col_count-1)).height(), maxh, $('.page'+p+'col'+(col_count-1)).html().length);
		//console.warn(('.page'+p+'col'+(col_count-1)), $('.page'+p+'col'+(col_count-1)).html().length, $('.page'+p+'col'+(col_count-1)).height());
		if(column == 0) {
			if($('.page'+p+'body').height() > maxh) {
				add_new_page();
				/*hm = $('.hideme').length;
				he = $('.hideme')[hm-1]
				$(he).css('display','none');*/
			} 
		} else {
			//console.log($('.page'+p+'col'+(col_count-1)));
			if($('.page'+p+'col'+(col_count-1)).height() > maxh) {
				col_count++;
				//console.error(column, col_count, (col_count-1), (column <= (col_count-1)));
				if(column <= (col_count-1)) {
					add_new_page();
					add_to_page(getColumnOut($('.page').length-1));
					col_count =  1;
				}
			}
		}
		$('.hideme').remove();
		//$('.pasteContent').append(ca[j]+" ");	
		add_to_page(d[j]+' ', undefined, undefined, col_count);
	}
	$('.build').html($('.build').html().replace(/===/g,' ')/*.replace(/<span[^<]+?>/g, "")*/);
	/*if(column > 0) {
		$('.pagebody').css('column-count', column).css('-webkit-column-count', column).css('-moz-column-count');	
	}*/
}	
function post_bibliography(object) {
	//Get all citations, limit only to those used in the paper
	citationSorted = new Array();
	//for(i in citation) {
		$('.content_textarea > .citation').each(function() {
			if(citationSorted.indexOf(citation[$(this).attr('data-id')]) == -1) {
				citationSorted.push(citation[$(this).attr('data-id')]);	
			}
		});
	//}	
	//Sort by object.sortmethod
	citationSorted = citationSorted.sort(compare);
	//Clear draft
	$('.draft').empty();
	//Send conditional formatting to draft
	for(i in citationSorted) {
		var str = "";
		if(false) {
			//different types of citations are going to be here
		} else if(false) {
			
		} else {
			var f = findCitation(citationSorted[i]);
			console.log("--"+f.id);
			str = citationFormatted(object.def, f.i, f.id, f.page); 
			//(findCitation(citationSorted[i]).id)
		}
				
		$('.draft').append('<div style="'+object.style+'">'+str+'</div>');	
	}
	
	
	//Add part by part by running through citation. If too much, new page in same method as above.	
	ca = $('.draft').html().split('<div');
	var maxh = $('.scale').height()*6.5;
	for(j in ca) {
		//TODO - Find a way to grab the current page, not necessarily the last one. This will be handy for things that are added after content
		p = $('.page').length-1;
		add_to_page("<div class='hideme'>"+ca[j]+" "+"</div>");
		if($('.page'+p+'body').height() > maxh) {
			add_new_page();
			/*hm = $('.hideme').length;
			he = $('.hideme')[hm-1]
			$(he).css('display','none');*/
		} 
		$('.hideme').remove();
		//$('.pasteContent').append(ca[j]+" ");	
		add_to_page("<div"+ca[j]+' ');

	}
}
function findCitation(cite) {
	o = {};
	for(i in citation) {
		if(citation[i] == cite) {
			o.id = i;	
		}
	}
	o.i = $('.citation[data-id="'+i+'"]').attr('data-i');
	o.page = $('.citation[data-id="'+i+'"]').attr('data-page');
	return o;
}
function compare(a,b) {
  if (a.AuthorLast < b.AuthorLast)
     return -1;
  if (a.AuthorLast > b.AuthorLast)
    return 1;
  return 0;
}
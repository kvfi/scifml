function isHTML(a){var b=document.createElement("div");b.innerHTML=a;for(var c=b.childNodes,d=c.length;d--;)if(1==c[d].nodeType)return!0;return!1}var Footnotes={footnotetimeout:!1,setup:function(){var a=jQuery("[rel='footnote']");a.unbind("mouseover",Footnotes.footnoteover),a.unbind("mouseout",Footnotes.footnoteoout),a.bind("mouseover",Footnotes.footnoteover),a.bind("mouseout",Footnotes.footnoteoout)},footnoteover:function(){clearTimeout(Footnotes.footnotetimeout),jQuery("#footnotediv").stop(),jQuery("#footnotediv").remove();var a=jQuery(this).attr("href").substr(1),b=jQuery(this).offset(),c=jQuery(document.createElement("div"));c.attr("id","footnotediv"),c.bind("mouseover",Footnotes.divover),c.bind("mouseout",Footnotes.footnoteoout);var d=document.getElementById(a);c.html("<div>"+jQuery(d).html()+"</div>"),jQuery(document.body).append(c);var e=b.left;e+420>jQuery(window).width()+jQuery(window).scrollLeft()&&(e=jQuery(window).width()-420+jQuery(window).scrollLeft());var f=b.top+20;f+c.height()>jQuery(window).height()+jQuery(window).scrollTop()&&(f=b.top-c.height()-15),c.css({left:e,top:f,opacity:1,position:"absolute"})},footnoteoout:function(){Footnotes.footnotetimeout=setTimeout(function(){jQuery("#footnotediv").animate({opacity:0},300,function(){jQuery("#footnotediv").remove()})},100)},divover:function(){clearTimeout(Footnotes.footnotetimeout),jQuery("#footnotediv").stop(),jQuery("#footnotediv").css({opacity:1})}};jQuery(document).ready(function(){Footnotes.setup();var a,b,c,d,e="<h6>Table of Contents</h6><nav role='navigation'><ul>";$("article h4").each(function(){b=$(this),c=b.text(),d="#"+b.attr("id"),a="<li><a href='"+d+"'>"+c+"</a></li>",e+=a}),e+="</ul></nav>",$(".table-of-contents").prepend(e),$(".footnotes").prepend("<h5>References</h5>"),$("article.form form textarea").change(function(){$(".converted_md_txt").html(myFunc())}),$.fn.taggin=function(){$("<input />").attr({type:"text",class:"tagger",name:"tagger",placeholder:"A tag",autocomplete:"off"}).appendTo(this),$(".tagged").length<0&&($("<div>").attr({class:"tagged"}).prependTo(this),$("<ul>").appendTo(".tagged",this),$("<input>").attr({type:"hidden",class:"tags",name:"tags"}).appendTo(this)),$(".tags input.tagger").keypress(function(a){if(13==a.which){a.preventDefault();var b=$(this).val();new RegExp(b,"g");$("<li>"+b+'<span class="rm">x</span></li>').appendTo(".tagged ul");var c=$(".tags input.tags").val();if(0===c.length)var d=c.concat(b);else var d=c.concat(", "+b);$(".tags input.tags").val(d),$(this).val("")}}),this.on("click",".tagged ul li span.rm",function(){this.closest("li").remove();var a=$(this).closest("li").clone().children().remove().end().text();if($(".tags input.tags").val().toLowerCase().indexOf(a)>=0){if($(".tags input.tags").val().indexOf(", "+a)>=0){var b=new RegExp(", "+a,"g"),c=new RegExp(a,"g"),d=$(".tags input.tags").val().replace(b,""),d=d.replace(c,"");if(", "==d.substring(0,2))var d=d.replace(", ","")}else var e=new RegExp(a,"g"),d=$(".tags input.tags").val().replace(e,"");if(", "==d.substring(0,2))var d=d.replace(", ","");$(".tags input.tags").val(d)}})},$.fn.slugCreator=function(){var a="http://scif.ml/post/",b=$(".url-viewer");$(this).on("keyup",function(){if($(this).val().length>0){b.css("display","inline-block");var c=$(this).val().toLowerCase().replace(/ /g,"-").replace(/[&\/\\#,+()$~%.'":*?<>{} ]/g,"");b.html('URL: <span class="link">'+a+c+'</a></span> <span><a href="#" class="modify_slug">Modify</a></span> <span><a href="'+a+c+'" target="_blank">View post</a></span>'),$(this).next().find('input[name="slug"]').val(c)}else b.hide()}),$(this).next().on("click","a.modify_slug",function(){$(this).closest(".url-viewer").next(".slug-input").attr({type:"text"})})},$("article.form form input").attr("autocomplete","off"),$("div.tags").taggin(),$(".slug-input-gen").slugCreator()});
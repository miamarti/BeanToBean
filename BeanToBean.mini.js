var BeanToBean={form:function(d){this.str=this.id="";this.obj={};this.constructor(d)},set:function(d,a){for(data in a){var c=document.querySelector(d+' [data-bean="'+data+'"]');"[object HTMLSelectElement]"==c.toString()&&c.multiple?"string"==typeof a[data]?c.value=a[data]:[].map.call(a[data],function(b){[].map.call(c.childNodes,function(a){a.value==b&&(a.selected=!0)})}):void 0!=c.type?"string"==typeof a[data]?"checkbox"==c.type?c.checked="true"==a[data]?!0:!1:c.value=a[data]:"checkbox"==c.type?c.checked=
a[data]:c.value=a[data][0]:c.innerHTML="string"==typeof a[data]?a[data]:a[data][0]}}};
BeanToBean.form.prototype={changeListener:!1,map:void 0,constructor:function(d){var a=this,c=document.getElementById(d);"[object HTMLFormElement]"==c.toString()&&(a.changeListener=!0,c.addEventListener("submit",function(b){a.callback();b.preventDefault();return!1},!1));this.id=d},getMap:function(){void 0==this.map&&(this.map=document.querySelectorAll("#"+this.id+" [data-attribute], #"+this.id+" [data-bean], #"+this.id+" [data-attribute] option, #"+this.id+" [data-bean] option"));return this.map},
htmlEntities:function(d){return String(d).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},reload:function(){var d=this,a="",c={};[].map.call(this.getMap(),function(b){if("[object HTMLSelectElement]"!=b.toString()){var e,f;"[object HTMLOptionElement]"==b.toString()?b.selected&&(e=b.parentNode.dataset.bean,f=b.value,a+=e+"="+encodeURIComponent(escape(d.htmlEntities(f)))+"&",b.parentNode.multiple?(void 0==c[e]&&(c[e]=[]),c[e].push(f)):c[e]=f):(e=b.dataset.bean,
f="[object HTMLDivElement]"!=b.toString()&&"[object HTMLSpanElement]"!=b.toString()&&"[object HTMLParagraphElement]"!=b.toString()?"checkbox"==b.type?b.checked?b.value:"":b.value:b.innerHTML,a+=e+"="+encodeURIComponent(escape(d.htmlEntities(f)))+"&",c[e]=f)}d.changeListener||b.addEventListener("change",d.callback,!1)});d.changeListener=!0;this.str=a;this.obj=c},toString:function(){this.reload();return this.str},toObject:function(){this.reload();return this.obj},callback:function(){return this},setCallback:function(d){this.callback=
d;this.reload()},setAutoSubmit:function(d,a){var c=this;this.callback=function(){var b=new XMLHttpRequest;b.open("POST",d,!0);b.responseType="json";b.onload=function(b){if(this.readyState==this.DONE)if(200==this.status)try{a(eval("("+this.response+")"))}catch(c){a(eval(this.response))}else a(this)};b.setRequestHeader("Content-type","application/x-www-form-urlencoded; charset=UTF-8");b.send(c.toString())};this.reload()}};

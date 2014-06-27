var BeanToBean = {
	form : function(domID) {
		this.id = "";
		this.str = "";
		this.obj = {};
		this.constructor(domID);
	},

	set : function(tag, obj) {
		for (data in obj) {
			var elemt = document.querySelector(tag + ' [data-bean="' + data + '"]');
			if (elemt.toString() == "[object HTMLSelectElement]" && elemt.multiple) {
				if (typeof obj[data] == "string") {
					elemt.value = obj[data];
				} else {
					[].map.call(obj[data], function(value) {
						[].map.call(elemt.childNodes, function(opt) {
							if (opt.value == value) {
								opt.selected = true;
							}
						});
					});
				}
			} else {
				if (elemt.type != undefined) {
					if (typeof obj[data] == "string") {
						if (elemt.type == 'checkbox') {
							elemt.checked = (obj[data] == "true" ? true : false);
						} else {
							elemt.value = obj[data];
						}
					} else {
						if (elemt.type == 'checkbox') {
							elemt.checked = obj[data];
						} else {
							elemt.value = obj[data][0];
						}
					}
				} else {
					if (typeof obj[data] == "string") {
						elemt.innerHTML = obj[data];
					} else {
						elemt.innerHTML = obj[data][0];
					}
				}
			}
		}
	}
};

BeanToBean.form.prototype = {
	changeListener : false,
	map : undefined,
	constructor : function(domID) {
		var _this = this;
		var context = document.querySelector(domID);
		if (context.toString() == '[object HTMLFormElement]') {
			_this.changeListener = true;
			context.addEventListener('submit', function(evt) {
				_this.callback();
				evt.preventDefault();
				return false;
			}, false);
		}
		this.id = domID;
	},
	getMap : function() {
		if (this.map == undefined) {
			this.map = document.querySelectorAll(this.id + ' [data-attribute], ' + this.id + ' [data-bean], ' + this.id + ' [data-attribute] option, ' + this.id + ' [data-bean] option');
		}
		return this.map;
	},
	htmlEntities : function(str) {
		return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	},
	reload : function() {
		var _this = this;
		var _str = '';
		var _obj = {};
		[].map.call(this.getMap(), function(obj) {
			if (obj.toString() != '[object HTMLSelectElement]') {
				var nameBean;
				var valueBean;
				if (obj.toString() == '[object HTMLOptionElement]') {
					if (obj.selected) {
						nameBean = obj.parentNode.dataset.bean;
						valueBean = obj.value;
						_str += nameBean + '=' + encodeURIComponent(escape(_this.htmlEntities(valueBean))) + '&';
						if (!obj.parentNode.multiple) {
							_obj[nameBean] = valueBean;
						} else {
							if (_obj[nameBean] == undefined) {
								_obj[nameBean] = [];
							}
							_obj[nameBean].push(valueBean);
						}
					}
				} else {
					nameBean = obj.dataset.bean;
					if (obj.toString() != "[object HTMLDivElement]" && obj.toString() != "[object HTMLSpanElement]" && obj.toString() != "[object HTMLParagraphElement]") {
						valueBean = (obj.type == 'checkbox') ? (obj.checked ? obj.value : '') : obj.value;
					} else {
						valueBean = obj.innerHTML;
					}
					_str += nameBean + '=' + encodeURIComponent(escape(_this.htmlEntities(valueBean))) + '&';
					_obj[nameBean] = valueBean;
				}
			}
			if (!_this.changeListener) {
				obj.addEventListener('change', _this.callback, false);
			}
		});
		_this.changeListener = true;
		this.str = _str;
		this.obj = _obj;
	},
	toString : function() {
		this.reload();
		return this.str;
	},
	toObject : function() {
		this.reload();
		return this.obj;
	},
	callback : function() {
		return this;
	},
	setCallback : function(fn) {
		this.callback = fn;
		this.reload();
	},
	setAutoSubmit : function(serverURI, callback) {
		this.callback = function() {
			var _this = this;
			var xhr = new XMLHttpRequest();
			xhr.open('POST', serverURI, true);
			xhr.responseType = 'json';
			xhr.onload = function(e) {
				if (this.readyState == this.DONE) {
					if (this.status == 200) {
						try {
							callback(eval('(' + this.response + ')'));
						} catch (e) {
							callback(eval(this.response));
						}
					} else {
						callback(this);
					}
				}
			};
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
			xhr.send(_this.toString());
		};
		this.reload();
	}
};

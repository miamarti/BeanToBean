var BeanToBean = {
	form : function(domID) {
		this.id;
		this.str;
		this.obj = {};
		this.constructor(domID);
	}
};

BeanToBean.form.prototype = {
	changeListener : false,
	map : undefined,
	constructor : function(domID) {
		var _this = this;
		var context = document.getElementById(domID);
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
			this.map = document.querySelectorAll('#' + this.id + ' [data-attribute], #' + this.id + ' [data-bean], #' + this.id + ' [data-attribute] option, #' + this.id + ' [data-bean] option');
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
						valueBean = encodeURIComponent(_this.htmlEntities(obj.value));
						_str += nameBean + '=' + valueBean + '&';
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
					valueBean = encodeURIComponent(_this.htmlEntities((obj.type == 'checkbox') ? (obj.checked ? obj.value : '') : obj.value));
					_str += nameBean + '=' + valueBean + '&';
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
	}
};

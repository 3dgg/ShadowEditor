(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Shadow = {})));
}(this, (function (exports) { 'use strict';

	var ID = -1;

	/**
	 * 所有SVG控件基类
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 选项
	 */
	function SvgControl(options = {}) {
	    this.parent = options.parent || document.body;
	    this.id = options.id || this.constructor.name + ID--;
	    this.scope = options.scope || 'global';

	    this.children = options.children || [];

	    this.data = options.data || null; // 自定义数据，例如：{ name: '小米', age: 20 }

	    this.attr = options.attr || null;
	    this.style = options.style || null;
	    this.listeners = options.listeners || null;

	    // 添加引用
	    SVG.add(this.id, this, this.scope);
	}

	/**
	 * 定义控件属性
	 */
	Object.defineProperties(SvgControl.prototype, {
	    /**
	     * 控件id（必须在options中设置，而且设置后无法改变）
	     */
	    id: {
	        get: function () {
	            return this._id;
	        },
	        set: function (id) {
	            if (this._id != null) {
	                console.warn(`SvgControl: It is not allowed to assign new value to id.`);
	            }
	            this._id = id;
	        }
	    },

	    /**
	     * 控件id作用域（必须在options中设置，而且设置后无法改变）
	     */
	    scope: {
	        get: function () {
	            return this._scope;
	        },
	        set: function (scope) {
	            if (this._scope != null) {
	                console.warn(`SvgControl: It is not allowed to assign new value to scope.`);
	            }
	            this._scope = scope;
	        }
	    }
	});

	/**
	 * 添加子元素
	 * @param {*} obj 
	 */
	SvgControl.prototype.add = function (obj) {
	    if (!(obj instanceof SvgControl)) {
	        throw 'SvgControl: obj is not an instance of SvgControl.';
	    }
	    this.children.push(obj);
	};

	/**
	 * 移除子元素
	 * @param {*} obj 
	 */
	SvgControl.prototype.remove = function (obj) {
	    var index = this.children.indexOf(obj);
	    if (index > -1) {
	        this.children.splice(index, 1);
	    }
	};

	/**
	 * 渲染SVG控件
	 */
	SvgControl.prototype.render = function () {
	    this.children.forEach(n => {
	        var obj = SVG.create(n);
	        obj.parent = this.parent;
	        obj.render();
	    });
	};

	/**
	 * 清除该控件内部所有内容。
	 * 该控件仍然可以通过UI.get获取，可以通过render函数重写渲染该控件。
	 */
	SvgControl.prototype.clear = function () {
	    // 移除所有子项引用
	    (function remove(items) {
	        if (items == null || items.length === 0) {
	            return;
	        }

	        items.forEach(n => {
	            if (n.id) {
	                SVG.remove(n.id, n.scope == null ? 'global' : n.scope);
	            }
	            if (n.listeners) { // 移除所有事件
	                Object.keys(n.listeners).forEach(m => {
	                    if (n.dom) {
	                        n.dom[m] = null;
	                    }
	                });
	            }
	            remove(n.children);
	        });
	    })(this.children);

	    this.children.length = 0;

	    // 清空dom
	    if (this.dom) {
	        this.parent.removeChild(this.dom);

	        if (this.listeners) {
	            this.listeners.forEach(n => {
	                this.dom[n] = null;
	            });
	        }

	        this.dom = null;
	    }
	};

	/**
	 * 彻底摧毁该控件，并删除在UI中的引用。
	 */
	SvgControl.prototype.destroy = function () {
	    this.clear();
	    if (this.id) {
	        SVG.remove(this.id, this.scope == null ? 'global' : this.scope);
	    }
	};

	/**
	 * SVG文档
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function SvgDom(options = {}) {
	    SvgControl.call(this, options);
	}

	SvgDom.prototype = Object.create(SvgControl.prototype);
	SvgDom.prototype.constructor = SvgDom;

	SvgDom.prototype.render = function () {
	    this.dom = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

	    if (this.attr) {
	        Object.keys(this.attr).forEach(n => {
	            this.dom.setAttribute(n, this.attr[n]);
	        });
	    }

	    if (this.style) {
	        Object.assign(this.dom.style, this.style);
	    }

	    if (this.listeners) {
	        Object.assign(this.dom, this.listeners);
	    }

	    this.children.forEach(n => {
	        var obj = SVG.create(n);
	        obj.parent = this.dom;
	        obj.render();
	    });

	    this.parent.appendChild(this.dom);
	};

	/**
	 * SVG圆
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function SvgCircle(options = {}) {
	    SvgControl.call(this, options);
	}

	SvgCircle.prototype = Object.create(SvgControl.prototype);
	SvgCircle.prototype.constructor = SvgCircle;

	SvgCircle.prototype.render = function () {
	    this.dom = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

	    if (this.attr) {
	        Object.keys(this.attr).forEach(n => {
	            this.dom.setAttribute(n, this.attr[n]);
	        });
	    }

	    if (this.style) {
	        Object.assign(this.dom.style, this.style);
	    }

	    if (this.listeners) {
	        Object.assign(this.dom, this.listeners);
	    }

	    this.parent.appendChild(this.dom);
	};

	/**
	 * SVG矩形
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function SvgRect(options = {}) {
	    SvgControl.call(this, options);
	}

	SvgRect.prototype = Object.create(SvgControl.prototype);
	SvgRect.prototype.constructor = SvgRect;

	SvgRect.prototype.render = function () {
	    this.dom = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

	    if (this.attr) {
	        Object.keys(this.attr).forEach(n => {
	            this.dom.setAttribute(n, this.attr[n]);
	        });
	    }

	    if (this.style) {
	        Object.assign(this.dom.style, this.style);
	    }

	    if (this.listeners) {
	        Object.assign(this.dom, this.listeners);
	    }

	    this.parent.appendChild(this.dom);
	};

	/**
	 * SVG椭圆
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function SvgEllipse(options = {}) {
	    SvgControl.call(this, options);
	}

	SvgEllipse.prototype = Object.create(SvgControl.prototype);
	SvgEllipse.prototype.constructor = SvgEllipse;

	SvgEllipse.prototype.render = function () {
	    this.dom = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');

	    if (this.attr) {
	        Object.keys(this.attr).forEach(n => {
	            this.dom.setAttribute(n, this.attr[n]);
	        });
	    }

	    if (this.style) {
	        Object.assign(this.dom.style, this.style);
	    }

	    if (this.listeners) {
	        Object.assign(this.dom, this.listeners);
	    }

	    this.parent.appendChild(this.dom);
	};

	/**
	 * SVG线
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function SvgLine(options = {}) {
	    SvgControl.call(this, options);
	}

	SvgLine.prototype = Object.create(SvgControl.prototype);
	SvgLine.prototype.constructor = SvgLine;

	SvgLine.prototype.render = function () {
	    this.dom = document.createElementNS('http://www.w3.org/2000/svg', 'line');

	    if (this.attr) {
	        Object.keys(this.attr).forEach(n => {
	            this.dom.setAttribute(n, this.attr[n]);
	        });
	    }

	    if (this.style) {
	        Object.assign(this.dom.style, this.style);
	    }

	    if (this.listeners) {
	        Object.assign(this.dom, this.listeners);
	    }

	    this.parent.appendChild(this.dom);
	};

	/**
	 * SVG曲线
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function SvgPolyline(options = {}) {
	    SvgControl.call(this, options);
	}

	SvgPolyline.prototype = Object.create(SvgControl.prototype);
	SvgPolyline.prototype.constructor = SvgPolyline;

	SvgPolyline.prototype.render = function () {
	    this.dom = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');

	    if (this.attr) {
	        Object.keys(this.attr).forEach(n => {
	            this.dom.setAttribute(n, this.attr[n]);
	        });
	    }

	    if (this.style) {
	        Object.assign(this.dom.style, this.style);
	    }

	    if (this.listeners) {
	        Object.assign(this.dom, this.listeners);
	    }

	    this.parent.appendChild(this.dom);
	};

	/**
	 * SVG面
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function SvgPolygon(options = {}) {
	    SvgControl.call(this, options);
	}

	SvgPolygon.prototype = Object.create(SvgControl.prototype);
	SvgPolygon.prototype.constructor = SvgPolygon;

	SvgPolygon.prototype.render = function () {
	    this.dom = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');

	    if (this.attr) {
	        Object.keys(this.attr).forEach(n => {
	            this.dom.setAttribute(n, this.attr[n]);
	        });
	    }

	    if (this.style) {
	        Object.assign(this.dom.style, this.style);
	    }

	    if (this.listeners) {
	        Object.assign(this.dom, this.listeners);
	    }

	    this.parent.appendChild(this.dom);
	};

	/**
	 * SVG线
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function SvgPath(options = {}) {
	    SvgControl.call(this, options);
	}

	SvgPath.prototype = Object.create(SvgControl.prototype);
	SvgPath.prototype.constructor = SvgPath;

	SvgPath.prototype.render = function () {
	    this.dom = document.createElementNS('http://www.w3.org/2000/svg', 'path');

	    if (this.attr) { // d: M, L, H, V, C, S, Q, T, A, Z
	        Object.keys(this.attr).forEach(n => {
	            this.dom.setAttribute(n, this.attr[n]);
	        });
	    }

	    if (this.style) {
	        Object.assign(this.dom.style, this.style);
	    }

	    if (this.listeners) {
	        Object.assign(this.dom, this.listeners);
	    }

	    this.parent.appendChild(this.dom);
	};

	/**
	 * SVG文本
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function SvgText(options = {}) {
	    SvgControl.call(this, options);

	    this.text = options.text || null;
	}

	SvgText.prototype = Object.create(SvgControl.prototype);
	SvgText.prototype.constructor = SvgText;

	SvgText.prototype.render = function () {
	    this.dom = document.createElementNS('http://www.w3.org/2000/svg', 'text');

	    if (this.attr) {
	        Object.keys(this.attr).forEach(n => {
	            this.dom.setAttribute(n, this.attr[n]);
	        });
	    }

	    if (this.style) {
	        Object.assign(this.dom.style, this.style);
	    }

	    if (this.listeners) {
	        Object.assign(this.dom, this.listeners);
	    }

	    if (this.text) {
	        this.dom.innerHTML = this.text;
	    }

	    this.parent.appendChild(this.dom);
	};

	/**
	 * SVG链接
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function SvgAnchor(options = {}) {
	    SvgControl.call(this, options);
	}

	SvgAnchor.prototype = Object.create(SvgControl.prototype);
	SvgAnchor.prototype.constructor = SvgAnchor;

	SvgAnchor.prototype.render = function () {
	    this.dom = document.createElementNS('http://www.w3.org/2000/svg', 'a');

	    if (this.attr) {
	        Object.keys(this.attr).forEach(n => {
	            this.dom.setAttribute(n, this.attr[n]);
	        });
	    }

	    if (this.style) {
	        Object.assign(this.dom.style, this.style);
	    }

	    if (this.listeners) {
	        Object.assign(this.dom, this.listeners);
	    }

	    this.children.forEach(n => {
	        var obj = SVG.create(n);
	        obj.parent = this.dom;
	        obj.render();
	    });

	    this.parent.appendChild(this.dom);
	};

	/**
	 * SVG定义
	 * @author tengge / https://github.com/tengge1
	 * @param {*} options 
	 */
	function SvgDefs(options = {}) {
	    SvgControl.call(this, options);
	}

	SvgDefs.prototype = Object.create(SvgControl.prototype);
	SvgDefs.prototype.constructor = SvgDefs;

	SvgDefs.prototype.render = function () {
	    this.dom = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

	    if (this.attr) {
	        Object.keys(this.attr).forEach(n => {
	            this.dom.setAttribute(n, this.attr[n]);
	        });
	    }

	    if (this.style) {
	        Object.assign(this.dom.style, this.style);
	    }

	    if (this.listeners) {
	        Object.assign(this.dom, this.listeners);
	    }

	    this.parent.appendChild(this.dom);
	};

	/**
	 * SVG类
	 * @author tengge / https://github.com/tengge1
	 */
	function SVGCls() {
	    this.xtypes = {};
	    this.objects = {};
	}

	/**
	 * 添加xtype
	 * @param {*} name xtype字符串
	 * @param {*} cls xtype对应类
	 */
	SVGCls.prototype.addXType = function (name, cls) {
	    if (this.xtypes[name] === undefined) {
	        this.xtypes[name] = cls;
	    } else {
	        console.warn(`SVGCls: xtype named ${name} has already been added.`);
	    }
	};

	/**
	 * 删除xtype
	 * @param {*} name xtype字符串
	 */
	SVGCls.prototype.removeXType = function (name) {
	    if (this.xtypes[name] !== undefined) {
	        delete this.xtypes[name];
	    } else {
	        console.warn(`SVGCls: xtype named ${name} is not defined.`);
	    }
	};

	/**
	 * 获取xtype
	 * @param {*} name xtype字符串
	 */
	SVGCls.prototype.getXType = function (name) {
	    if (this.xtypes[name] === undefined) {
	        console.warn(`SVGCls: xtype named ${name} is not defined.`);
	    }
	    return this.xtypes[name];
	};

	/**
	 * 添加一个对象到缓存
	 * @param {*} id 对象id
	 * @param {*} obj 对象
	 * @param {*} scope 对象作用域（默认为global）
	 */
	SVGCls.prototype.add = function (id, obj, scope = "global") {
	    var key = `${scope}:${id}`;
	    if (this.objects[key] !== undefined) {
	        console.warn(`SVGCls: object named ${id} has already been added.`);
	    }
	    this.objects[key] = obj;
	};

	/**
	 * 从缓存中移除一个对象
	 * @param {*} id 对象id
	 * @param {*} scope 对象作用域（默认为global）
	 */
	SVGCls.prototype.remove = function (id, scope = 'global') {
	    var key = `${scope}:${id}`;
	    if (this.objects[key] != undefined) {
	        delete this.objects[key];
	    } else {
	        console.warn(`SVGCls: object named ${id} is not defined.`);
	    }
	};

	/**
	 * 从缓存中获取一个对象
	 * @param {*} id 控件id
	 * @param {*} scope 对象作用域（默认为global）
	 */
	SVGCls.prototype.get = function (id, scope = 'global') {
	    var key = `${scope}:${id}`;
	    // 经常需要通过该方法判断是否已经注册某个元素，所以不能产生警告。
	    // if (this.objects[key] === undefined) {
	    //     console.warn(`SVGCls: object named ${id} is not defined.`);
	    // }
	    return this.objects[key];
	};

	/**
	 * 通过json配置创建UI实例，并自动将包含id的控件添加到缓存
	 * @param {*} config xtype配置
	 */
	SVGCls.prototype.create = function (config) {
	    if (config instanceof SvgControl) { // config是SvgControl实例
	        return config;
	    }

	    // config是json配置
	    if (config == null || config.xtype == null) {
	        throw 'SVGCls: config is undefined.';
	    }

	    if (config.xtype === undefined) {
	        throw 'SVGCls: config.xtype is undefined.';
	    }

	    var cls = this.xtypes[config.xtype];
	    if (cls == null) {
	        throw `SVGCls: xtype named ${config.xtype} is undefined.`;
	    }

	    return new cls(config);
	};

	/**
	 * SVGCls
	 */
	const SVG$1 = new SVGCls();

	// 添加所有SVG控件
	Object.assign(SVG$1, {
	    SvgControl: SvgControl,
	    SvgDom: SvgDom,
	    SvgCircle: SvgCircle,
	    SvgRect: SvgRect,
	    SvgEllipse: SvgEllipse,
	    SvgLine: SvgLine,
	    SvgPolyline: SvgPolyline,
	    SvgPolygon: SvgPolygon,
	    SvgPath: SvgPath,
	    SvgText: SvgText,
	    SvgDefs: SvgDefs,
	    SvgA: SvgAnchor,
	});

	// 添加所有SVG控件的XType
	SVG$1.addXType('svgcontrol', SvgControl);
	SVG$1.addXType('svgdom', SvgDom);
	SVG$1.addXType('svgcircle', SvgCircle);
	SVG$1.addXType('svgrect', SvgRect);
	SVG$1.addXType('svgellipse', SvgEllipse);
	SVG$1.addXType('svgline', SvgLine);
	SVG$1.addXType('svgpolyline', SvgPolyline);
	SVG$1.addXType('svgpolygon', SvgPolygon);
	SVG$1.addXType('svgpath', SvgPath);
	SVG$1.addXType('svgtext', SvgText);
	SVG$1.addXType('svgdefs', SvgDefs);
	SVG$1.addXType('svga', SvgAnchor);

	window.SVG = SVG$1;

	exports.SVG = SVG$1;

	Object.defineProperty(exports, '__esModule', { value: true });

})));

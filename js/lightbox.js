function Lightbox () {
	this.opt = false;
	this.box = false;
	this.wrapper = false;
	var that = this,
		body = document.getElementsByTagName('body')[0],
		template = '<span class="jslghtbx-close" id="jslghtbx-close">X</span><div class="jslghtbx-contentwrapper" id="jslghtbx-contentwrapper" ></div>';
	/* Helpers */
	var getHeight = function(){
		return window.innerHeight || document.documentElement.offsetHeight;
	}
	var addEvent  = function(el,e,callback,val){
	    if (el.addEventListener) {
	        el.addEventListener(e,callback, false);
	    } else if (el.attachEvent) {
	        el.attachEvent("on" + e, callback);
	    }
	};
	var hasClass  = function(el,className) {
		if(!el || !className){return;}
	    return (new RegExp("(^|\\s)" + className + "(\\s|$)").test(el.className));
	};
	var removeClass = function(el,className) {
		if(!el || !className){return;}
	    el.className = el.className.replace(new RegExp('(?:^|\\s)'+className+'(?!\\S)'),'' );
	    return el;
	};
	var addClass = function(el,className) {
		if(!el || !className){return;}
	    if(!hasClass(el,className)) { el.className += ' '+className; }
	    return el;
	};
	var isset = function(obj) {
		if(typeof obj != 'undefined'){return true;}
		return false;
	};
	var getAttr = function(obj,attr) {
		if(!obj || typeof obj == undefined){return false;}
		var ret;
		if(obj.getAttribute){ret=obj.getAttribute(attr);}
		else if(obj.getAttributeNode){ret=obj.getAttributeNode(attr).value;}
		if(typeof ret != undefined && ret != ''){return ret;}
		return false;
	};
	var hasAttr = function(obj,attr) {
		if(!obj || typeof obj == undefined){return false;}
		var ret;
		if(obj.getAttribute){ret=obj.getAttribute(attr);}
		else if(obj.getAttributeNode){ret=obj.getAttributeNode(attr).value;}
		if(typeof ret != undefined){return true;}
		return false;
	};
	var exists = function(id){
		if(document.getElementById(id)) {
			return true;
		}
		return false;
	};
	/* Methods */
	this.load = function(opt) {
		if(opt){this.opt = opt;}
		if(opt && opt.boxId) {
			// init lightbox on given element
			this.box = document.getElementById(opt.boxId);
			this.box.innerHTML = template;
		}
		else if(!this.box && !exists('jslghtbx')) {
			// create lightbox if no ID is given
			var newEl = document.createElement('div');
			newEl.setAttribute('id','jslghtbx');
			newEl.setAttribute('class','jslghtbx');
			this.box = newEl;
			this.box.innerHTML = template;
			body.appendChild(this.box);
			this.wrapper = document.getElementById('jslghtbx-contentwrapper');
		}
		else {
			this.box = document.getElementById('jslghtbx');
		}
		if(opt && opt.closeId) {
			// close lightbox on click on given element
			addEvent(document.getElementById(opt.closeId),'click',function(){
				that.close();
			});
		}
		if(opt && opt.closeOnClick || !opt) {
			addEvent(this.box,'click',function(e){
				that.close();
			});
		}
		if(opt && (opt.responsive || !isset(opt.responsive)) ) {
			addEvent(window,'resize',function(e){
				that.resize();
			});
		}
		/* Find all thumbnails & add clickhandlers */
		var images = document.getElementsByTagName('img');
		var clckHlpr = function(i) {
			addEvent(i,'click',function(e) {
				if(getAttr(i,'data-jslghtbx')) {
					// image-source given
					that.open(getAttr(i,'data-jslghtbx'));
				}
				else {
					// no image-source given
					that.open(getAttr(i,'src'));
				}
			});
		};
		for(var i = 0; i < images.length; i++)
		{
			if(hasAttr(images[i],'data-jslghtbx')) {
				clckHlpr(images[i]);
			}
		}
	};
	this.close = function() {
		removeClass(that.box,'active');
		removeClass(that.wrapper,'active');
		body.setAttribute('style','overflow = auto');
	};
	this.resize = function() {
		that.box.setAttribute('style','padding-top:'+((getHeight() - that.wrapper.offsetHeight) /2)+'px');
	}
	this.refresh = function(opt) {
		if(opt) {
			this.opt = opt;
		}
		this.load(this.opt);
	}
	this.open = function(src) {
		if(!src){return false;}
		var img = document.createElement('img');
		img.setAttribute('src',src);
		body.setAttribute('style','overflow = hidden');
		this.box.setAttribute('style','padding-top: 0');
		this.wrapper.innerHTML = '';
		this.wrapper.appendChild(img);
		addClass(this.box,'active');
		var checkClassInt = setInterval(function(){
			if(hasClass(that.box,'active'))
			{
				that.resize();
				// prevent 'popup'-effect of image
				setTimeout(function(){
					addClass(that.wrapper,'active');
				},1);
				clearInterval(checkClassInt);
			}
		},10);
	};
};



function Lightbox () {
	this.opt;
	this.box;
	this.wrapper
	var that = this,
		template = '<span class="lightbox-close" id="lightbox-close">X</span><div class="lightbox-contentwrapper" id="lightbox-contentwrapper" ></div>';
	/* Helpers */
	var addEvent  = function(el,e,callback,val){
		callback.bind(this,val);
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

	this.load = function(opt) {
		if(opt){this.opt = opt;}
		if(opt && opt.boxId) {
			// init lightbox on given element
			this.box = document.getElementById(opt.boxId);
			this.box.innerHTML = template;
		}
		else {
			// create lightbox if no ID is given
			var newEl = document.createElement('div');
			newEl.setAttribute('class','lightbox');
			this.box = newEl;
			this.box.innerHTML = template;
			document.getElementsByTagName('body')[0].appendChild(this.box);
			this.wrapper = document.getElementById('lightbox-contentwrapper');
		}
		if(opt && opt.closeId) {
			// close lightbox on click on given element
			addEvent(document.getElementById(opt.closeId),'click',function(){
				that.closeLightbox();
			});
		}
		if(!opt.closeOnClick) {
			addEvent(this.box,'click',function(e){
				that.closeLightbox();
			});
		}
		if(opt.responsive) {
			addEvent(window,'resize',function(e){
				that.resize();
			});
		}
		/* Find all thumbnails & add clickhandlers */
		var images = document.getElementsByTagName('img');
		var clckHlpr = function(i) {
			addEvent(i,'click',function(e) {
				if(this.getAttribute('data-lightbox') !== '') {
					that.openLightbox(this.getAttribute('data-lightbox'));
				}
				else {
					that.openLightbox(this);
				}
			});
		};
		for(var i = 0; i < images.length; i++)
		{
			if(images[i].getAttribute('data-lightbox') !== null) {
				clckHlpr(images[i]);
			}
		}
	};
	this.closeLightbox = function() {
		removeClass(that.box,'active');
		removeClass(that.wrapper,'active');
		document.getElementsByTagName('body')[0].setAttribute('style','overflow = auto');
	};
	this.resize = function() {
		that.box.setAttribute('style','padding-top: '+Math.floor(((window.innerHeight - that.wrapper.offsetHeight) /2))+'px');
	}
	this.refresh = function(opt) {
		if(opt) {
			this.opt = opt;
		}
		this.load(this.opt);
	}
	this.openLightbox = function(img) {
		if(!img){return false;}
		if(typeof img === 'object') {
			img = img;
		}
		else if (typeof img === 'string') {
			var el = document.createElement('img');
			el.setAttribute('src',img);
			img = el;
		}
		else {
			return false;
		}
		document.getElementsByTagName('body')[0].setAttribute('style','overflow = hidden');
		this.box.setAttribute('style','padding-top: 0');
		this.wrapper.innerHTML = '';
		img = img.cloneNode(true);
		img.setAttribute('class',' ');
		this.wrapper.appendChild(img.cloneNode(true));
		addClass(this.box,'active');
		var checkClassInt = setInterval(function(){
			if(hasClass(that.box,'active'))
			{
				setTimeout(function(){
					that.resize();
					// prevent 'popup'-effect of image
					setTimeout(function(){
						addClass(that.wrapper,'active');
					},1);
				},1);
				clearInterval(checkClassInt);
			}
		},10);
	};
};


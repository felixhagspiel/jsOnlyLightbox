'use strict';

/**
 * jsOnlyLightbox 0.5.6
 * Copyright © 2014 Felix Hagspiel - http://jslightbox.felixhagspiel.de
 *
 * @license MIT
 * - Free for use in both personal and commercial projects
 */
/* exported Lightbox */
function Lightbox() {
  
  /**
   * Constants
   */
  var _const_name = 'jslghtbx';
  var _const_class_prefix = _const_name;
  var _const_id_prefix = _const_name;
  var _const_dataattr = 'data-' + _const_name;
  /**
   * Private vars
   */
  var CTX = this,
    isIE8 = false,
    isIE9 = false,
    body = document.getElementsByTagName('body')[0],
    template = '<div class="' + _const_name + '-contentwrapper" id="' + _const_name + '-contentwrapper" ></div>',
    imgRatio = false, // ratio of current image
    currGroup = false, // current group
    currThumbnail = false, // first clicked thumbnail
    currImage = {}, // currently shown image
    currImages = [], // images belonging to current group
    isOpen = false, // check if box is open
    animationEl, // reference to animation-element
    animationInt, // animation-interval
    animationChildren = [], // childs to animate
    animationTimeout, // timeout until animation starts
    // controls
    nextBtn = false,
    prevBtn = false,
    // resize-vars
    maxWidth,
    maxHeight,
    newImgWidth,
    newImgHeight;
  
  /*
   *   Public attributes
   */
  CTX.opt = {};
  CTX.box = false;
  CTX.wrapper = false;
  CTX.thumbnails = [];
  
  /**
   * Extends thumbnails.push to add click handlers to dynamically loaded thumbs
   */
  CTX.thumbnails.push = function () {
    for (var i = 0, l = arguments.length; i < l; i++) {
      clckHlpr(arguments[i]);
    }
    return Array.prototype.push.apply(this, arguments);
  };
  
  /**
   * Private methods
   */
  
  /**
   * Get correct height in IE8
   * @return {number}
   */
  function getHeight() {
    return window.innerHeight || document.documentElement.offsetHeight;
  }
  
  /**
   * Get correct width in IE8
   * @return {number}
   */
  function getWidth() {
    return window.innerWidth || document.documentElement.offsetWidth;
  }
  
  /**
   * Adds eventlisteners cross browser
   * @param {Object}   el       The element which gets the listener
   * @param {String}   e        The event type
   * @param {Function} callback The action to execute on event
   * @param {Boolean}  capture      The capture mode
   */
  function addEvent(el, e, callback, capture) {
    if (el.addEventListener) {
      el.addEventListener(e, callback, capture || false);
    }
    else
      if (el.attachEvent) {
        el.attachEvent('on' + e, callback);
      }
  }
  
  /**
   * Checks if element has a specific class
   * @param  {Object}  el        [description]
   * @param  {String}  className [description]
   * @return {Boolean}           [description]
   */
  function hasClass(el, className) {
    if (!el || !className) {
      return;
    }
    return (new RegExp('(^|\\s)' + className + '(\\s|$)').test(el.className));
  }
  
  /**
   * Removes class from element
   * @param  {Object} el
   * @param  {String} className
   * @return {Object}
   */
  function removeClass(el, className) {
    if (!el || !className) {
      return;
    }
    el.className = el.className.replace(new RegExp('(?:^|\\s)' + className + '(?!\\S)'), '');
    return el;
  }
  
  /**
   * Adds class to element
   * @param  {Object} el
   * @param  {String} className
   * @return {Object}
   */
  function addClass(el, className) {
    if (!el || !className) {
      return;
    }
    if (!hasClass(el, className)) {
      el.className += ' ' + className;
    }
    return el;
  }
  
  /**
   * Checks if obj is set
   * @param  {Object} obj
   * @return {Boolean}
   */
  function isset(obj) {
    return typeof obj !== 'undefined';
    
  }
  
  /**
   * Get attribute value cross-browser. Returns the attribute as string if found,
   * otherwise returns false
   * @param  {Object} obj
   * @param  {String} attr
   * @return {boolean || string}
   */
  function getAttr(obj, attr) {
    if (!obj || !isset(obj)) {
      return false;
    }
    var ret;
    if (obj.getAttribute) {
      ret = obj.getAttribute(attr);
    }
    else
      if (obj.getAttributeNode) {
        ret = obj.getAttributeNode(attr).value;
      }
    if (isset(ret) && ret !== '') {
      return ret;
    }
    return false;
  }
  
  /**
   * Checks if element has attribute cross-browser
   * @param  {Object}  obj
   * @param  {String}  attr
   * @return {Boolean}
   */
  function hasAttr(obj, attr) {
    if (!obj || !isset(obj)) {
      return false;
    }
    var ret;
    if (obj.getAttribute) {
      ret = obj.getAttribute(attr);
    }
    else
      if (obj.getAttributeNode) {
        ret = obj.getAttributeNode(attr).value;
      }
    return typeof ret === 'string';
    
  }
  
  /**
   * Adds clickhandlers to thumbnails
   * @param  {Object} i
   */
  function clckHlpr(i) {
    addEvent(i, 'click', function (e) {
      stopPropagation(e);
      preventDefault(e);
      currGroup = getAttr(i, _const_dataattr + '-group') || false;
      currThumbnail = i;
      openBox(i, false, false, false);
    }, false);
  }
  
  /**
   * Stop event propagation cross browser
   * @param  {Object} e
   */
  function stopPropagation(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    else {
      e.returnValue = false;
    }
  }
  
  /**
   * Prevent default cross browser
   * @param  {Object} e
   */
  function preventDefault(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    else {
      e.returnValue = false;
    }
  }
  
  
  /**
   * Get thumbnails by group
   * @param  {String} group
   * @return {Object}       Array containing the thumbnails
   */
  function getByGroup(group) {
    var arr = [];
    for (var i = 0; i < CTX.thumbnails.length; i++) {
      if (getAttr(CTX.thumbnails[i], _const_dataattr + '-group') === group) {
        arr.push(CTX.thumbnails[i]);
      }
    }
    return arr;
  }
  
  /**
   * Get the position of thumbnail in group-array
   * @param  {Object} thumbnail
   * @param  {String} group
   * @return {number}
   */
  function getPos(thumbnail, group) {
    var arr = getByGroup(group);
    for (var i = 0; i < arr.length; i++) {
      // compare elements
      if (getAttr(thumbnail, 'src') === getAttr(arr[i], 'src') &&
        getAttr(thumbnail, _const_dataattr + '-index') === getAttr(arr[i], _const_dataattr + '-index') &&
        getAttr(thumbnail, _const_dataattr) === getAttr(arr[i], _const_dataattr)) {
        
        return i;
      }
    }
  }
  
  /**
   * Preloads next and prev images
   */
  function preload() {
    if (!currGroup) {
      return;
    }
    var prev = new Image();
    var next = new Image();
    var pos = getPos(currThumbnail, currGroup);
    if (pos === (currImages.length - 1)) {
      // last image in group, preload first image and the one before
      prev.src = getAttr(currImages[currImages.length - 1], _const_dataattr) || currImages[currImages.length - 1].src;
      next.src = getAttr(currImages[0].src, _const_dataattr) || currImages[0].src;
    }
    else
      if (pos === 0) {
        // first image in group, preload last image and the next one
        prev.src = getAttr(currImages[currImages.length - 1], _const_dataattr) || currImages[currImages.length - 1].src;
        next.src = getAttr(currImages[1], _const_dataattr) || currImages[1].src;
      }
      else {
        // in between, preload prev & next image
        prev.src = getAttr(currImages[pos - 1], _const_dataattr) || currImages[pos - 1].src;
        next.src = getAttr(currImages[pos + 1], _const_dataattr) || currImages[pos + 1].src;
      }
  }
  
  /**
   * Starts the loading animation
   */
  function startAnimation() {
    if (isIE8) {
      return;
    }
    // stop any already running animations
    stopAnimation();
    var fnc = function () {
      addClass(CTX.box, _const_class_prefix + '-loading');
      if (!isIE9 && typeof CTX.opt.loadingAnimation === 'number') {
        var index = 0;
        animationInt = setInterval(function () {
          addClass(animationChildren[index], _const_class_prefix + '-active');
          setTimeout(function () {
            removeClass(animationChildren[index], _const_class_prefix + '-active');
          }, CTX.opt.loadingAnimation);
          index = index >= animationChildren.length ? 0 : index += 1;
        }, CTX.opt.loadingAnimation);
      }
    };
    // set timeout to not show loading animation on fast connections
    animationTimeout = setTimeout(fnc, 500);
  }
  
  /**
   * Stops the animation
   */
  function stopAnimation() {
    if (isIE8) {
      return;
    }
    // hide animation-element
    removeClass(CTX.box, _const_class_prefix + '-loading');
    // stop animation
    if (!isIE9 && typeof CTX.opt.loadingAnimation !== 'string' && CTX.opt.loadingAnimation) {
      clearInterval(animationInt);
      // do not use animationChildren.length here due to IE8/9 bugs
      for (var i = 0; i < animationChildren.length; i++) {
        removeClass(animationChildren[i], _const_class_prefix + '-active');
      }
    }
  }
  
  /**
   * Initializes the control arrows
   */
  function initControls() {
    if (!nextBtn) {
      // create & append next-btn
      nextBtn = document.createElement('span');
      addClass(nextBtn, _const_class_prefix + '-next');
      
      // add custom images
      if (CTX.opt.nextImg) {
        var nextBtnImg = document.createElement('img');
        nextBtnImg.setAttribute('src', CTX.opt.nextImg);
        nextBtn.appendChild(nextBtnImg);
      }
      else {
        addClass(nextBtn, _const_class_prefix + '-no-img');
      }
      addEvent(nextBtn, 'click', function (e) {
        stopPropagation(e); // prevent closing of lightbox
        CTX.next();
      }, false);
      CTX.box.appendChild(nextBtn);
    }
    addClass(nextBtn, _const_class_prefix + '-active');
    if (!prevBtn) {
      // create & append next-btn
      prevBtn = document.createElement('span');
      addClass(prevBtn, _const_class_prefix + '-prev');
      
      // add custom images
      if (CTX.opt.prevImg) {
        var prevBtnImg = document.createElement('img');
        prevBtnImg.setAttribute('src', CTX.opt.prevImg);
        prevBtn.appendChild(prevBtnImg);
      }
      else {
        addClass(prevBtn, _const_class_prefix + '-no-img');
      }
      addEvent(prevBtn, 'click', function (e) {
        stopPropagation(e); // prevent closing of lightbox
        CTX.prev();
      }, false);
      CTX.box.appendChild(prevBtn);
    }
    addClass(prevBtn, _const_class_prefix + '-active');
  }
  
  /**
   * Moves controls to correct position
   */
  function repositionControls() {
    if (CTX.opt.responsive && nextBtn && prevBtn) {
      var btnTop = (getHeight() / 2) - (nextBtn.offsetHeight / 2);
      nextBtn.style.top = btnTop + 'px';
      prevBtn.style.top = btnTop + 'px';
    }
  }
  
  /**
   * Sets options and defaults
   * @param {Object} opt
   */
  function setOpt(opt) {
    // set options
    if (!opt) {
      opt = {};
    }
    
    /**
     * Sets the passed value per default to true if not given
     * @param {Object || String || Number || Boolean || ...} val
     * @returns {Boolean}
     */
    function setTrueDef(val) {
      return typeof val === 'boolean' ? val : true;
    }
    
    CTX.opt = {
      // options
      boxId: opt.boxId || false,
      controls: setTrueDef(opt.controls),
      dimensions: setTrueDef(opt.dimensions),
      captions: setTrueDef(opt.captions),
      prevImg: typeof opt.prevImg === 'string' ? opt.prevImg : false,
      nextImg: typeof opt.nextImg === 'string' ? opt.nextImg : false,
      hideCloseBtn: opt.hideCloseBtn || false,
      closeOnClick: typeof opt.closeOnClick === 'boolean' ? opt.closeOnClick : true,
      nextOnClick: setTrueDef(opt.nextOnClick),
      loadingAnimation: opt.loadingAnimation === undefined ? true : opt.loadingAnimation,
      animElCount: opt.animElCount || 4,
      preload: setTrueDef(opt.preload),
      carousel: setTrueDef(opt.carousel),
      animation: typeof opt.animation === 'number' || opt.animation === false ? opt.animation : 400,
      responsive: setTrueDef(opt.responsive),
      maxImgSize: opt.maxImgSize || 0.8,
      keyControls: setTrueDef(opt.keyControls),
      hideOverflow: opt.hideOverflow || true,
      // callbacks
      onopen: opt.onopen || false,
      onclose: opt.onclose || false,
      onload: opt.onload || false,
      onresize: opt.onresize || false,
      onloaderror: opt.onloaderror || false,
      onimageclick: typeof opt.onimageclick === 'function' ? opt.onimageclick : false
    };
    
    // load box in custom element
    if (CTX.opt.boxId) {
      CTX.box = document.getElementById(CTX.opt.boxId);
      // set class if missing
      var classes = CTX.box.getAttribute('class');
      if (classes.search(_const_class_prefix + ' ') < 0) {
        CTX.box.setAttribute('class', classes + ' ' + _const_class_prefix);
      }
    }
    // create box element if no ID is given and element is not there
    else
      if (!CTX.box) {
        // check if there already exists a jslghtbx-div
        var newEl = document.getElementById(_const_id_prefix);
        if (!newEl) {
          newEl = document.createElement('div');
        }
        newEl.setAttribute('id', _const_id_prefix);
        newEl.setAttribute('class', _const_class_prefix);
        CTX.box = newEl;
        body.appendChild(CTX.box);
      }
    CTX.box.innerHTML = template;
    if (isIE8) {
      addClass(CTX.box, _const_class_prefix + '-ie8');
    }
    CTX.wrapper = document.getElementById(_const_id_prefix + '-contentwrapper');
    
    // init regular closebutton
    if (!CTX.opt.hideCloseBtn) {
      var closeBtn = document.createElement('span');
      closeBtn.setAttribute('id', _const_id_prefix + '-close');
      closeBtn.setAttribute('class', _const_class_prefix + '-close');
      closeBtn.innerHTML = 'X';
      CTX.box.appendChild(closeBtn);
      addEvent(closeBtn, 'click', function (e) {
        stopPropagation(e);
        CTX.close();
      }, false);
    }
    
    // close lightbox on background-click by default / if true
    if (!isIE8 && CTX.opt.closeOnClick) {
      addEvent(CTX.box, 'click', function (e) {
        stopPropagation(e);
        CTX.close();
      }, false);
    }
    
    // set loading animation
    if (typeof CTX.opt.loadingAnimation === 'string') {
      // set loading GIF
      animationEl = document.createElement('img');
      animationEl.setAttribute('src', CTX.opt.loadingAnimation);
      addClass(animationEl, _const_class_prefix + '-loading-animation');
      CTX.box.appendChild(animationEl);
    }
    else
      if (CTX.opt.loadingAnimation) {
        // set default animation time
        CTX.opt.loadingAnimation = typeof CTX.opt.loadingAnimation === 'number' ? CTX.opt.loadingAnimation : 200;
        // create animation elements
        animationEl = document.createElement('div');
        addClass(animationEl, _const_class_prefix + '-loading-animation');
        var i = 0;
        while (i < CTX.opt.animElCount) {
          animationChildren.push(animationEl.appendChild(document.createElement('span')));
          i++;
        }
        CTX.box.appendChild(animationEl);
      }
    
    // add resize-eventhandlers
    if (CTX.opt.responsive) {
      addEvent(window, 'resize', function () {
        CTX.resize();
      }, false);
      addClass(CTX.box, _const_class_prefix + '-nooverflow'); // hide scrollbars on prev/next
    }
    else {
      removeClass(CTX.box, _const_class_prefix + '-nooverflow');
    }
    
    // add keyboard event handlers
    if (CTX.opt.keyControls) {
      addEvent(document, 'keydown', function (e) {
        if (isOpen) {
          stopPropagation(e); // prevent closing of lightbox
          if (e.keyCode === 39) {
            // show next img on right cursor
            CTX.next();
          }
          else
            if (e.keyCode === 37) {
              // show prev img on left cursor
              CTX.prev();
            }
            else
              if (e.keyCode === 27) {
                // close lightbox on ESC
                CTX.close();
              }
        }
      }, false);
    }
  }
  
  /**
   * Opens the lightbox. Either @param el and @param group must be given,
   * but not both together!
   * @param  {Object || String}   el      an image element or a link to an image
   * @param  {String}   group       the name of an image group
   * @param  {Function} cb          A private callback
   * @param  {Object} event
   */
  function openBox(el, group, cb, event) {
    if (!el && !group) {
      return false;
    }
    // save images from group
    currGroup = group || currGroup || getAttr(el, _const_dataattr + '-group');
    if (currGroup) {
      currImages = getByGroup(currGroup);
      if (typeof el === 'boolean' && !el) {
        // el is set to false, load first image of group
        el = currImages[0];
      }
    }
    
    // create new img-element
    currImage.img = new Image();
    
    // set el as current thumbnail
    currThumbnail = el;
    
    // get correct image-source
    var src;
    if (typeof el === 'string') {
      // string with img-src given
      src = el;
    }
    else
      if (getAttr(el, _const_dataattr)) {
        // image-source given
        src = getAttr(el, _const_dataattr);
      }
      else {
        // no image-source given
        src = getAttr(el, 'src');
      }
    // clear old image ratio for proper resize-values
    imgRatio = false;
    
    // add init-class on opening, but not at prev/next
    if (!isOpen) {
      if (typeof CTX.opt.animation === 'number') {
        addClass(currImage.img, _const_class_prefix + '-animate-transition ' + _const_class_prefix + '-animate-init');
      }
      isOpen = true;
      
      // execute open callback
      if (CTX.opt.onopen) {
        CTX.opt.onopen(currImage);
      }
    }
    
    // hide overflow by default / if set
    if (!CTX.opt || !isset(CTX.opt.hideOverflow) || CTX.opt.hideOverflow) {
      body.style['overflow'] = 'hidden';
    }
    
    CTX.box.style['padding-top'] = '0';
    CTX.wrapper.innerHTML = '';
    CTX.wrapper.appendChild(currImage.img);
    // set animation class
    if (CTX.opt.animation) {
      addClass(CTX.wrapper, _const_class_prefix + '-animate');
    }
    // set caption
    var captionText = getAttr(el, _const_dataattr + '-caption');
    if (captionText && CTX.opt.captions) {
      var caption = document.createElement('p');
      caption.setAttribute('class', _const_class_prefix + '-caption');
      caption.innerHTML = captionText;
      CTX.wrapper.appendChild(caption);
    }
    
    addClass(CTX.box, _const_class_prefix + '-active');
    
    // show wrapper early to avoid bug where dimensions are not
    // correct in IE8
    if (isIE8) {
      addClass(CTX.wrapper, _const_class_prefix + '-active');
    }
    if (CTX.opt.controls && currImages.length > 1) {
      initControls();
      repositionControls();
    }
    
    /**
     * Onerror-handler for the image
     */
    currImage.img.onerror = function (imageErrorEvent) {
      if (CTX.opt.onloaderror) {
        // if `event` is false, error happened on opening the box
        imageErrorEvent._happenedWhile = event ? event : false;
        CTX.opt.onloaderror(imageErrorEvent);
      }
    };
    /**
     * Onload-handler for the image
     */
    currImage.img.onload = function () {
      // store original width here
      currImage.originalWidth = this.naturalWidth || this.width;
      currImage.originalHeight = this.naturalHeight || this.height;
      // use dummyimage for correct dimension calculating in older IE
      if (isIE8 || isIE9) {
        var dummyImg = new Image();
        dummyImg.setAttribute('src', src);
        currImage.originalWidth = dummyImg.width;
        currImage.originalHeight = dummyImg.height;
      }
      // interval to check if image is ready to show
      var checkClassInt = setInterval(function () {
        if (hasClass(CTX.box, _const_class_prefix + '-active')) {
          addClass(CTX.wrapper, _const_class_prefix + '-wrapper-active');
          // set animation
          if (typeof CTX.opt.animation === 'number') {
            addClass(currImage.img, _const_class_prefix + '-animate-transition');
          }
          if (cb) {
            cb();
          }
          // stop Animation
          stopAnimation();
          // clear animation timeout
          clearTimeout(animationTimeout);
          // preload previous and next image
          if (CTX.opt.preload) {
            preload();
          }
          // set clickhandler on image to show next image
          if (CTX.opt.nextOnClick) {
            // add cursor pointer
            addClass(currImage.img, _const_class_prefix + '-next-on-click');
            addEvent(currImage.img, 'click', function (e) {
              stopPropagation(e);
              CTX.next();
            }, false);
          }
          // set custom clickhandler on image
          if (CTX.opt.onimageclick) {
            addEvent(currImage.img, 'click', function (e) {
              stopPropagation(e);
              CTX.opt.onimageclick(currImage);
            }, false);
          }
          // execute onload callback
          if (CTX.opt.onload) {
            CTX.opt.onload(event);
          }
          // stop current interval
          clearInterval(checkClassInt);
          // resize the image
          CTX.resize();
        }
      }, 10);
    };
    
    // set src
    currImage.img.setAttribute('src', src);
    
    // start loading animation
    startAnimation();
  }
  
  /*
   *   Public methods
   */
  
  /**
   * Init-function, must be called once
   * @param  {Object} opt Custom options
   */
  CTX.load = function (opt) {
    // check for IE8
    if (navigator.appVersion.indexOf('MSIE 8') > 0) {
      isIE8 = true;
    }
    
    // check for IE9
    if (navigator.appVersion.indexOf('MSIE 9') > 0) {
      isIE9 = true;
    }
    
    // set options
    setOpt(opt);
    
    // Find all elements with `data-jslghtbx` attribute & add clickhandlers
    var arr = document.querySelectorAll('[' + _const_dataattr + ']');
    for (var i = 0; i < arr.length; i++) {
      if (hasAttr(arr[i], _const_dataattr)) {
        // set index to get proper position in getPos()
        arr[i].setAttribute(_const_dataattr + '-index', i);
        CTX.thumbnails.push(arr[i]);
      }
    }
    
  };
  
  /**
   * Public caller for openBox()
   * @param  {Object || string} el  Image element or a link
   * @param  {String} group
   */
  CTX.open = function (el, group) {
    // if image and group are given, set group to false
    // to prevent errors
    if (el && group) {
      group = false;
    }
    openBox(el, group, false, false);
  };
  
  /**
   * Calculates the new image size and resizes it
   */
  CTX.resize = function () {
    if (!currImage.img) {
      return;
    }
    maxWidth = getWidth();
    maxHeight = getHeight();
    var boxWidth = CTX.box.offsetWidth;
    var boxHeight = CTX.box.offsetHeight;
    if (!imgRatio && currImage.img && currImage.img.offsetWidth && currImage.img.offsetHeight) {
      imgRatio = currImage.img.offsetWidth / currImage.img.offsetHeight;
    }
    
    // Height of image is too big to fit in viewport
    if (Math.floor(boxWidth / imgRatio) > boxHeight) {
      newImgWidth = boxHeight * imgRatio;
      newImgHeight = boxHeight;
    }
    // Width of image is too big to fit in viewport
    else {
      newImgWidth = boxWidth;
      newImgHeight = boxWidth / imgRatio;
    }
    // decrease size with modifier
    newImgWidth = Math.floor(newImgWidth * CTX.opt.maxImgSize);
    newImgHeight = Math.floor(newImgHeight * CTX.opt.maxImgSize);
    
    // check if image exceeds maximum size
    if (CTX.opt.dimensions && newImgHeight > currImage.originalHeight ||
      CTX.opt.dimensions && newImgWidth > currImage.originalWidth) {
      newImgHeight = currImage.originalHeight;
      newImgWidth = currImage.originalWidth;
    }
    currImage.img.setAttribute('width', newImgWidth);
    currImage.img.setAttribute('height', newImgHeight);
    currImage.img.style['margin-top'] = ((getHeight() - newImgHeight) / 2) + 'px';
    
    // reposition controls after timeout
    setTimeout(repositionControls, 200);
    
    // execute resize callback
    if (CTX.opt.onresize) {
      CTX.opt.onresize(currImage);
    }
  };
  
  /**
   * Loads the next image
   */
  CTX.next = function () {
    if (!currGroup) {
      return;
    }
    // get position of next image
    var pos = getPos(currThumbnail, currGroup) + 1;
    if (currImages[pos]) {
      currThumbnail = currImages[pos];
    }
    else
      if (CTX.opt.carousel) {
        currThumbnail = currImages[0];
      }
      else {
        return;
      }
    if (typeof CTX.opt.animation === 'number') {
      removeClass(currImage.img, _const_class_prefix + '-animating-next');
      setTimeout(function () {
        var cb = function () {
          setTimeout(function () {
            addClass(currImage.img, _const_class_prefix + '-animating-next');
          }, CTX.opt.animation / 2);
        };
        openBox(currThumbnail, false, cb, 'next');
      }, CTX.opt.animation / 2);
    }
    else {
      openBox(currThumbnail, false, false, 'next');
    }
  };
  
  /**
   * Loads the prev image
   */
  CTX.prev = function () {
    if (!currGroup) {
      return;
    }
    // get position of prev image
    var pos = getPos(currThumbnail, currGroup) - 1;
    if (currImages[pos]) {
      currThumbnail = currImages[pos];
    }
    else
      if (CTX.opt.carousel) {
        currThumbnail = currImages[currImages.length - 1];
      }
      else {
        return;
      }
    // animation stuff
    if (typeof CTX.opt.animation === 'number') {
      removeClass(currImage.img, _const_class_prefix + '-animating-prev');
      setTimeout(function () {
        var cb = function () {
          setTimeout(function () {
            addClass(currImage.img, _const_class_prefix + '-animating-next');
          }, CTX.opt.animation / 2);
        };
        openBox(currThumbnail, false, cb, 'prev');
      }, CTX.opt.animation / 2);
    }
    else {
      openBox(currThumbnail, false, false, 'prev');
    }
  };
  
  /**
   * Closes the box
   */
  CTX.close = function () {
    // restore Defaults
    currGroup = false;
    currThumbnail = false;
    var _currImage = currImage;
    currImage = {};
    currImages = [];
    isOpen = false;
    removeClass(CTX.box, _const_class_prefix + '-active');
    removeClass(CTX.wrapper, _const_class_prefix + '-wrapper-active');
    removeClass(nextBtn, _const_class_prefix + '-active');
    removeClass(prevBtn, _const_class_prefix + '-active');
    CTX.box.style['padding-top'] = '0';

    // stop animtation
    stopAnimation();
    
    // Hide Lightbox if iE8
    if (isIE8) {
      CTX.box.style['display'] = 'none';
    }
    
    // show overflow by default / if set
    if (!CTX.opt || !isset(CTX.opt.hideOverflow) || CTX.opt.hideOverflow) {
      body.style['overflow'] = 'auto';
    }
    
    // execute close callback
    if (CTX.opt.onclose) {
      CTX.opt.onclose(_currImage);
    }
  };
}


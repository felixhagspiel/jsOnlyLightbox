# Responsive Lightbox written in  plain JavaScript

## Features

- no jQuery needed
- Fully responsive
- Customizable Theme
- Small in Size (< 5Kb)
- IE8+ Support
- Licensed under MIT, free for commercial &amp; personal use

## Download

Fork or [download at jslightbox.felixhagspiel.de](http://jslightbox.felixhagspiel.de/). The lightbox is still in development mode, so please post any issues and bugs here.

## Demo

You can watch it live at [jslightbox.felixhagspiel.de](http://jslightbox.felixhagspiel.de/) or on [felixhagspiel.de](http://felixhagspiel.de/)

## Usage

Add the CSS-File to the head of your html-file:

	<link rel="stylesheet" href="css/lightbox.css">

Add this before the closing body tag:

	<script src="jslightbox.js" type="text/javascript"></script>
	<script>
		var lightbox = new Lightbox();
	 	lightbox.load();
	</script>

You just need to add the attribute `data-jslghtbx` to all the images you want to show in the lightbox:

	<img class="jslghtbx-thmb" src="img/lightbox/1.jpg" alt="" data-jslghtbx>

You can also pass an link to another image:

	<img class="jslghtbx-thmb" src="img/lightbox/1.jpg" alt="" data-jslghtbx="img/1-big.jpg">

Note: The CSS-class `jslghtbx-thmb` is optional. You can use your own styling if you want.

If you want to use multiple images, set the `data-jslghtbx-group`-attribute:

	<img class="jslghtbx-thmb" src="img/lightbox/1.jpg" alt="" data-jslghtbx data-jslghtbx-group="group1">
	<img class="jslghtbx-thmb" src="img/lightbox/2.jpg" alt="" data-jslghtbx data-jslghtbx-group="group1">

You can use different groups on one website. The default control-arrows will be loaded when using groups. You can also use your own control-buttons by providing an ID via the options (see options-reference).

## Options

###	`{responsive: bool}`
Default: true
If set to true, the image will be resized according to the viewport on resize-events.

###	`{carousel: bool}`
Default: true
If set to true, you can infinitely loop through all the images by clicking the next/prev button or calling the `next()` / `prev()`-functions.  

###	`{closeOnClick: bool}`
Default: true
If set to true, the lightbox will close on click anywhere inside the viewport, not just by clicking on the close-button.

###	`{hideOverflow: bool}`
Default: true
Hides overflow when lightbox is opened.

###	`{hideCloseBtn: bool}`
Default: false
Hides the closebutton inside the lightbox.

###	`{closeId: 'elementId'}`
Here you can pass your own closebutton-ID if you want to use your own element for closing the box. The regular close-button won't be displayed then.

###	`{nextId: 'elementId'}`
Here you can pass your own next-button-ID if you want to use your own element for showing the next image. If you want to hide the default controls set the controls-option to `false`.

###	`{prevId: 'elementId'}`
Here you can pass your own prev-button-ID if you want to use your own element for showing the previous image. If you want to hide the default controls set the controls-option to `false`.

###	`{controls: bool}`
Default: true
Show or hide the default next- & prev-buttons.

###	`{boxId: 'elementId'}`
Here you can pass an ID if you want to use your own box-element. Images will be appended to that element then. The element will receive a class "jslghtbx-active" when opened, so style this class properly (you need at least to remove visibility by default and add it on active). If you want it to look like the default-box, just add the class "jslghtbx" to the box-element.

## Methods

### `lightbox.load(options)`

The init-function. Here you can pass your option-object. Has to be called once on the box-object.

Example:

	/* Default options */
	var options = {
		responsive: true, 		// add handlers for resize-event
		closeOnClick: true, 	// close lightbox on background-click
		hideOverflow: true,		// hide scrolling-bar when lightbox is open
		hideCloseBtn: false,	// hide the close-button inside the lightbox
		closeId: false, 		// use your own close-button
		boxId: false 			// use own box-element
	};
	var lightbox = new Lightbox();
	lightbox.load(options);

### `lightbox.open('src-link')`
If you want you can open the box by click on any element on your page.
Example:

	document.getElementById('open-lightbox').addEventListener('click',function(){
		lightbox.open('../img/lightbox/1.jpg');
	});

You can also just pass a reference to an image rather than a src-URL.
Example:

	var myImg = document.getElementById('myImg');
	document.getElementById('open-lightbox').addEventListener('click',function(){
		lightbox.open(myImg);
	});

### `lightbox.next()`
Shows the next image of current group

### `lightbox.prev()`
Shows the previous image of current group

### `lightbox.close()`
Closes the lightbox.

### `lightbox.resize()`
Repositions the image in the lightbox. Is called on every resize-event unless you set the `responsive`-option to false.
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

## Usage

Add the CSS-File to the head of your html-file:

	<link rel="stylesheet" href="css/lightbox.css">

Add this before the closing body tag:

	<script src="jslightbox.js" type="text/javascript"></script>
	<script>
		var lightbox = new Lightbox();
	 	lightbox.load();
	</script>

You just need to add the attribute `data-lightbox` to all the images you want to show in the lightbox:

	<img class="jslghtbx-thmb" src="img/lightbox/1.jpg" alt="" data-lightbox>

You can also pass an link to another image:

	<img class="jslghtbx-thmb" src="img/lightbox/1.jpg" alt="" data-lightbox="img/1-big.jpg">

Note: The CSS-class `jslghtbx-thmb` is optional. You can use your own styling if you want.

## Options

###	`{responsive: bool}`
Default: true
If set to true, the image will be resized according to the viewport on resize-events.

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
If you want you can open the box by any element on your page.
Example:

	document.getElementById('open-lightbox').addEventListener('click',function(){
		lightbox.open('../img/lightbox/1.jpg');
	});

### `lightbox.close()`
Closes the lightbox.

### `lightbox.resize()`
Repositions the image in the lightbox. Is called on every resize-event unless you set the `responsive`-option to false.

### `lightbox.refresh(options)`
Here you can update the the (already initialized) lightbox with new options.
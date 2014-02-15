# Responsive Lightbox written in  plain JavaScript

## Features

- no jQuery needed
- Fully responsive
- Customizable Theme
- Small in Size (< 5Kb)
- IE8+ Support

## Usage

Add this before the closing body tag ( `</body>` ):

	<script src="jslightbox.js" type="text/javascript"></script>
	<script>
		/* Default options */
		var options = {
			responsive: true, 		// add handlers for resize-event
			closeOnClick: true, 	// close lightbox on background-click
			closeId: false, 		// use your own close-button
			boxId: false 			// use own box-element
		};
		var lightbox = new Lightbox(options);
	 	lightbox.load();
	</script>

### Load the images of the thumbnails in Lightbox:

	<img class="lightbox-thmb" src="img/lightbox/1.jpg" alt="" data-lightbox>
	<img class="lightbox-thmb" src="img/lightbox/2.jpg" alt="" data-lightbox>
	<img class="lightbox-thmb" src="img/lightbox/3.jpg" alt="" data-lightbox>
	<img class="lightbox-thmb" src="img/lightbox/4.jpg" alt="" data-lightbox>
	<img class="lightbox-thmb" src="img/lightbox/5.jpg" alt="" data-lightbox>

### Load specified images in Lightbox:

	<img class="lightbox-thmb" src="img/lightbox/1.jpg" alt="" data-lightbox="img/1-big.jpg">
	<img class="lightbox-thmb" src="img/lightbox/2.jpg" alt="" data-lightbox="img/2-big.jpg">
	<img class="lightbox-thmb" src="img/lightbox/3.jpg" alt="" data-lightbox="img/3-big.jpg">
	<img class="lightbox-thmb" src="img/lightbox/4.jpg" alt="" data-lightbox="img/4-big.jpg">
	<img class="lightbox-thmb" src="img/lightbox/5.jpg" alt="" data-lightbox="img/5-big.jpg">

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

###	`{closeId: 'elementId'}`

Here you can pass your own closebutton-ID if you want to use your own element for closing the box. The regular close-button won't be displayed then.

###	`{boxId: 'elementId'}`

Here you can pass an ID if you want to use your own box-element. Images will be appended to that element then. The element will receive a class "jslghtbx-active" when opened, so style this class properly (you need at least to remove visibility by default and add it on active). If you want it to look like the default-box, just add the class "jslghtbx" to the box-element.

## Methods

### `lightbox.load(options)`

The init-function. Here you can pass your option-object. Has to be called once on the box-object.

### `lightbox.open('src-link')`

If you want you can open the box by any element on your page.
Example:

	document.getElementById('open-lightbox').addEventListener('click',function(){
		lightbox.open('../img/lightbox/1.jpg');
	});

### `lightbox.close()`

Closes the lightbox.

### `lightbox.resize`

Repositions the image in the lightbox.

### `lightbox.refresh(options)`

Here you can update the the (already initialized) lightbox with new options.
import 'lite-youtube-embed';
import BasePage from './base-page';
import Fslightbox from 'fslightbox';
window.fslightbox = Fslightbox;
import { zoom } from './partials/image-zoom';

class Product extends BasePage {
    onReady() {
        this.catblock()
        app.watchElements({
            totalPrice: '.total-price',
            beforePrice: '.before-price',
            startingPriceTitle: '.starting-price-title',

        });
        

        if(imageZoom){
            // call the function when the page is ready
            this.initImagesZooming();
            // listen to screen resizing
            window.addEventListener('resize', () => this.initImagesZooming());
        }
       
    }

	initImagesZooming() {
		// skip if the screen is not desktop or if glass magnifier
		// is already crated for the image before
		const imageZoom = document.querySelector('.image-slider .swiper-slide-active .img-magnifier-glass');
		if (window.innerWidth  < 1024 || imageZoom) return;
		setTimeout(() => {
			// set delay after the resizing is done, start creating the glass
			// to create the glass in the proper position
			const image = document.querySelector('.image-slider .swiper-slide-active img');
			zoom(image.id, 2);
		}, 200);
		

		document.querySelector('salla-slider.details-slider').addEventListener('slideChange', (e) => {
			// set delay till the active class is ready
			setTimeout(() => {
				const imageZoom = document.querySelector('.image-slider .swiper-slide-active .img-magnifier-glass');
			
				// if the zoom glass is already created skip
				if (imageZoom) return;
				const image = document.querySelector('.image-slider .swiper-slide-active img');
				zoom(image.id, 2);
			}, 200)
		})
	}
    



    async catblock()
    {
// Assume salla.api.request('component/list', {params: {paths:['home.main-links']}}) returns a Promise
salla.api.request('component/list', {params: {paths:['home.main-links']}})
.then((res) => {
    // Assuming res contains a data array with at least one item
    const dataArray = res.data;

    // Access the div element by its id for string_1
    const outputString1Div = document.getElementById('outputString1');

    // Get the current URL
    const currentURL = window.location.href;

    // Filter the array based on the condition
    const filteredArray = dataArray.filter((item) =>
        item &&
        item.item_collection &&
        item.item_collection.length > 0 &&
        item.component &&
        item.component.ar &&
        item.component.ar.title === currentURL
    );

    // If filteredArray is not empty and the first item in item_collection has the string_1 property, display it
    if (filteredArray.length > 0 && filteredArray[0].item_collection[0] && filteredArray[0].item_collection[0].string_1) {
        const string1Value = filteredArray[0].item_collection[0].string_1;

        // Set the text content of the outputString1 div
        outputString1Div.textContent = string1Value;
    } else {
        // If filteredArray is empty or the structure is different, you might want to hide the corresponding div or handle it in a way that fits your design.
        outputString1Div.style.display = 'none';
    }
})
.catch((error) => {
    console.error('Error fetching data:', error);
});
    
    }
    

    









    registerEvents() {
        salla.product.event.onPriceUpdated((res) => {
            app.startingPriceTitle?.classList.add('hidden');

            app.totalPrice.forEach(el => el.innerText = salla.money(res.data.price));
            // app.totalPrice.innerText = salla.money(res.data.price);

            app.anime('.total-price', { scale: [0.88, 1] });

            if (res.data.has_sale_price) {
                app.beforePrice.forEach(el => {
                    el.style.display = 'inline'
                    el.innerText = salla.money(res.data.regular_price)
                });
                // app.beforePrice.style.display = 'inline';
                // app.beforePrice.innerText = salla.money(res.data.regular_price);
                return;
            }
            app.beforePrice.length && app.beforePrice.forEach(el => el.style.display = 'none');
            // app.beforePrice && (app.beforePrice.style.display = 'none')
        });

        app.onClick('#btn-show-more', e => app.all('#more-content', div => {
            e.target.classList.add('is-expanded');
            div.style = `max-height:${div.scrollHeight}px`;
        }) || e.target.remove());
    }
}
Product.initiateWhenReady(['product.single']);




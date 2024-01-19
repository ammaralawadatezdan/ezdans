import 'lite-youtube-embed';
import BasePage from './base-page';
import Fslightbox from 'fslightbox';
window.fslightbox = Fslightbox;
import { zoom } from './partials/image-zoom';

class Product extends BasePage {
    onReady() {
        app.watchElements({
            totalPrice: '.total-price',
            beforePrice: '.before-price',
            startingPriceTitle: '.starting-price-title',

        });
        catblock()

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

    // Access the div elements by their ids
    const outputStringezdanDiv = document.getElementById('outputStringezdan');
    const outputStringDiv = document.getElementById('outputString');
    const outputImageDiv = document.getElementById('outputImage');
    const outputTextWithIconDiv = document.getElementById('outputTextWithIcon');
    const outputEndTextDiv = document.getElementById('outputEndText');

    // Get the current URL
    const currentURL = window.location.href;

    // Filter the array based on the condition
    const filteredArray = dataArray.filter((item) =>
        item &&
        item.component &&
        item.component.collectionEzdan &&
        item.component.collectionEzdan.length > 0 &&
        item.component.ar &&
        item.component.ar.title === currentURL &&
        item.component.collectionEzdan[0].string_1 // Check if string_1 property exists
    );

    // If filteredArray is empty, hide the outputImageDiv
    if (filteredArray.length === 0) {
        outputImageDiv.style.display = 'none';
    } else {
        // Iterate through the filtered array and print string_1
        filteredArray.forEach((item) => {
            const stringComponent = item.component.collectionEzdan[0].string_1;

            // Create div elements for string_1
            const divString = document.createElement('div');

            // Set the text content of the div
            divString.textContent = `${stringComponent}`;

            // Append the div elements to their respective output div containers
            outputStringDiv.appendChild(divString);
        });
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




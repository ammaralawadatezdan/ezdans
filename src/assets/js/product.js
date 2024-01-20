import 'lite-youtube-embed';
import BasePage from './base-page';
import Fslightbox from 'fslightbox';
window.fslightbox = Fslightbox;
import { zoom } from './partials/image-zoom';

class Product extends BasePage {
    onReady() {
        this.fetchData();

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
    



    async  fetchData() {
        try {
            // Get the productId from the HTML element with the ID 'product-container'
            const productId = document.getElementById('product-container').dataset.productId;

            // Make the API request
            const response = await salla.api.request('component/list', { params: { paths: ['home.main-links'] } });

            // Access the data array from the response
            const dataArray = response.data;

            // Find the item where itemcode matches productId
            const matchedItem = dataArray.find((item) => item.component.item_collection[0]?.itemcode === productId);

            // Access the section container to hide/show the entire section
            const aboutCoffeeSection = document.getElementById('About-coffee');

            // Access the div elements to display the String_1 value, AboutCoffeeicon image, AboutCoffeeTitle, and AboutCoffeeDis
            const string1DisplayDiv = document.getElementById('string1Display');
            const aboutCoffeeIconDisplayDiv = document.getElementById('aboutCoffeeIconDisplay');
            const aboutCoffeeTitleDisplayDiv = document.getElementById('aboutCoffeeTitleDisplay');
            const aboutCoffeeDisDisplayDiv = document.getElementById('aboutCoffeeDisDisplay');

            // Check if the elements and properties exist before updating content
            if (aboutCoffeeSection && string1DisplayDiv && aboutCoffeeIconDisplayDiv && aboutCoffeeTitleDisplayDiv && aboutCoffeeDisDisplayDiv && matchedItem && matchedItem.component.item_collection[0]) {
                // Display the String_1 value in the div
                const string1Value = matchedItem.component.item_collection[0].string_1 || "N/A";
                string1DisplayDiv.textContent = `String_1: ${string1Value}`;

                // Display the AboutCoffeeicon image in the div
                const aboutCoffeeIconURL = matchedItem.component.item_collection[0].AboutCoffeeicon || "";
                aboutCoffeeIconDisplayDiv.innerHTML = `<img src="${aboutCoffeeIconURL}" alt="About Coffee Icon" style="max-width: 100%;">`;

                // Display the AboutCoffeeTitle text in the div
                const aboutCoffeeTitle = matchedItem.component.item_collection[0].aboutcoffeTitle || "N/A";
                aboutCoffeeTitleDisplayDiv.textContent = `About Coffee Title: ${aboutCoffeeTitle}`;

                // Display the AboutCoffeeDis text in the div
                const aboutCoffeeDis = matchedItem.component.item_collection[0].aboutcoffedis || "N/A";
                aboutCoffeeDisDisplayDiv.textContent = `About Coffee Description: ${aboutCoffeeDis}`;

                // Show the entire section
                aboutCoffeeSection.style.display = 'block';

                // Access the div elements for additional sections
                const aboutCoffeeContainer1 = document.getElementById('aboutCoffeeContainer1');
                const aboutCoffeeContainer2 = document.getElementById('aboutCoffeeContainer2');
                const aboutCoffeeContainer3 = document.getElementById('aboutCoffeeContainer3');
                const aboutCoffeeContainer4 = document.getElementById('aboutCoffeeContainer4');

                // Display the content for additional sections
                displayAdditionalSection(matchedItem, 1, aboutCoffeeContainer1);
                displayAdditionalSection(matchedItem, 2, aboutCoffeeContainer2);
                displayAdditionalSection(matchedItem, 3, aboutCoffeeContainer3);
                displayAdditionalSection(matchedItem, 4, aboutCoffeeContainer4);
            } else {
                // Hide the entire section if there is no match
                aboutCoffeeSection.style.display = 'none';
                console.error('Data structure does not match expectations or item code does not match product ID.');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Function to display content for additional sections
    async displayAdditionalSection(matchedItem, sectionNumber, containerElement) {
        // Check if the container element exists
        if (containerElement) {
            // Access the additional items for the section
            const aboutCoffeeIcon = matchedItem.component[`AboutCoffeeicon${sectionNumber}`] || "";
            const aboutCoffeeTitle = matchedItem.component[`aboutcoffeTitle${sectionNumber}`] || "N/A";
            const aboutCoffeeDis = matchedItem.component[`aboutcoffedis${sectionNumber}`] || "N/A";

            // Display the content for the additional section
            containerElement.innerHTML = `
                <div class="ezdan-about-coffee-card position-relative">
                    <div class="ezdan-about-coffee-card-icon">
                        <img src="${aboutCoffeeIcon}" alt="About Coffee Icon" style="max-width: 100%;">
                    </div>
                    <div class="ezdan-about-coffee-card-content">
                        <h4>About Coffee Title ${sectionNumber}: ${aboutCoffeeTitle}</h4>
                        <p>About Coffee Description ${sectionNumber}: ${aboutCoffeeDis}</p>
                    </div>
                </div>`;
        }
    }

    // Call the fetchData function
    








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




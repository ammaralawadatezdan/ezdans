import BasePage from './base-page';
import MobileMenu from 'mmenu-light';
class Products extends BasePage {
    onReady() {
        let productsList = app.element('salla-products-list'),
            urlParams = new URLSearchParams(window.location.search)


        // Set Sort
        if (urlParams.has('sort')) {
            app.element('#product-filter').value = urlParams.get('sort');
        }


        // Sort Products
        app.on('change', '#product-filter', async event => {
            window.history.replaceState(null, null, salla.helpers.addParamToUrl('sort', event.currentTarget.value));
            productsList.sortBy = event.currentTarget.value;
            await productsList.reload();
            productsList.setAttribute('filters', `{"sort": "${event.currentTarget.value}"}`)
        });

        salla.event.once('salla-products-list::products.fetched', res=>{
            res.title && (app.element('#page-main-title').innerHTML = res.title);
        });

       this.catblock()
        this.initiateMobileMenu()
    }

    /*

async catblock()
{
    await  salla.api.request('component/list', {params: {paths:['home.sectionText']}}).then((res) => {

        console.log(res.data[0].component)
    })

}*/



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
            item.component.collectionEzdan[0].image // Add this condition to check if the image property exists
        );

        // If filteredArray is empty, hide the outputImageDiv
        if (filteredArray.length === 0) {
            outputImageDiv.style.display = 'none';
        } else {
            // Iterate through the filtered array and print Stringezdan, string, set image as background for outputImageDiv,
            // and handle TextWithIcon and EndText
            filteredArray.forEach((item) => {
                const collectionStringezdan = item.component.collectionEzdan[0].stringezdan;
                const stringComponent = item.component.collectionEzdan[0].string;
                const imageURL = item.component.collectionEzdan[0].image;
                const textWithIcon = item.component.collectionEzdan[0].textwithicon;
                const endText = item.component.collectionEzdan[0].endtext;
                const iconURL = item.component.collectionEzdan[0].icon; // Separate field for the icon

                // Create div elements for Stringezdan, string, icon, TextWithIcon, and EndText
                const divStringezdan = document.createElement('div');
                const divString = document.createElement('div');
                const divIcon = document.createElement('img'); // Create an img element for the icon
                const divTextWithIcon = document.createElement('div');
                const divEndText = document.createElement('div');

                // Set the text content and attributes of the divs
                divStringezdan.textContent = `${collectionStringezdan}`;
                divString.textContent = `${stringComponent}`;
                divIcon.src = iconURL; // Set the src attribute for the icon
                divTextWithIcon.innerHTML = `${textWithIcon}`;
                divEndText.textContent = `${endText}`;

                // Set the background image of the outputImage div
                outputImageDiv.style.background = `url(${imageURL}) center/cover no-repeat`;
                outputImageDiv.style.minHeight = '1070px';
                outputImageDiv.style.height = '100%';
                outputImageDiv.style.marginTop = '-185px';

                // Append the div elements to their respective output div containers
                outputStringezdanDiv.appendChild(divStringezdan);
                outputStringDiv.appendChild(divString);
                outputTextWithIconDiv.appendChild(divIcon); // Append the icon to the TextWithIcon container
                outputTextWithIconDiv.appendChild(divTextWithIcon);
                outputEndTextDiv.appendChild(divEndText);
            });
        }
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
    });
    




}





    initiateMobileMenu() {
        let filters = app.element("#filters-menu"),
            trigger = app.element("a[href='#filters-menu']"),
            close = app.element("button.close-filters");

        if (!filters) {
            return;
        }
        filters = new MobileMenu(filters, "(max-width: 1024px)", "( slidingSubmenus: false)");
        const drawer = filters.offcanvas({ position: salla.config.get('theme.is_rtl') ? "right" : 'left' });
        trigger.addEventListener('click', event => {
            document.body.classList.add('filters-opened');
            event.preventDefault() || drawer.close() || drawer.open()
        });
        close.addEventListener('click', event => {
            document.body.classList.remove('filters-opened');
            event.preventDefault() || drawer.close()
        });
        salla.event.on('salla-filters::changed', filters => {
            if (!Object.entries(filters).length) {
                return
            }
            document.body.classList.remove('filters-opened');
            drawer.close()
        })
    }
}

Products.initiateWhenReady([
    'product.index',
    'product.index.latest',
    'product.index.offers', 'product.index.search',
    'product.index.tag',
]);

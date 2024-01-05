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
     // Assume salla.api.request('component/list', {params: {paths:['home.sectionText']}}) returns a Promise
  salla.api.request('component/list', {params: {paths:['home.main-links']}})
  .then((res) => {
    // Assuming res contains a data array with at least one item
    const dataArray = res.data;

    // Access the div element by its id
    const outputDiv = document.getElementById('output');

    // Create a new ul element
    const ulElement = document.createElement('ul');
    const currentURL = window.location.href;
    // Iterate through the array and create li elements for each item
    dataArray.forEach((item) => {
      if (item && item.component && item.component.ar && item.component.ar.title) {
        // Check if the title is equal to "1"
        if (item.component.ar.title === currentURL) {
          const liElement = document.createElement('li');
          liElement.textContent = item.component.ar.title;

          // Append the li element to the ul
          ulElement.appendChild(liElement);
        } else {
          console.warn('Title is not equal to "1" for:', item);
        }
      } else {
        console.warn('Title property not found for:', item);
      }
    });

    // Append the ul to the output div
    outputDiv.appendChild(ulElement);
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

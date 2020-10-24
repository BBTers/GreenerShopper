
let key = 'F70004700D954219BBBFFFE3DC174815';
let amazonURL = "https://api.rainforestapi.com/request?api_key=" + key + '&type=product&amazon_domain=';
let productID = '';

 chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
     let link = document.createElement('a');
     link = tabs[0].url;
     console.log('product link: ', link);
     if (!link.includes('amazon.ca') && !link.includes('amazon.com')) {
        console.log('Chrome extension only supports Amazon.com and Amazon.ca');
        return;
     }

     if (link.includes('amazon.ca')) {
         amazonURL += 'amazon.ca';
     } else if (link.includes('amazon.com')) {
         amazonURL += 'amazon.com';
     }
     amazonURL += '&asin='

     let product = '/dp/';
     if (!link.includes(product) && link.includes('/product/')) {
        product = '/product/';
     }
     let index = link.indexOf(product);
     index += product.length;
     if (product == '/dp/') {
          productID = link.substring(index, );
          index = productID.indexOf('/');
          if (index == -1) {
            index = productID.indexOf('?');
          }
          productID = productID.substring(0, index);
     } else {
           // url contains /product/ and not /dp/
          productID = link.substring(index, );
     }
     console.log('product id: ', productID);
     amazonURL += productID;
     console.log('api request to: ', amazonURL);

     let request = new XMLHttpRequest();
     request.open('GET', amazonURL);
     request.onload = function () {
        let data = JSON.parse(this.response);
        data = data.product;
        let product = data.title;
        productTypes = [];
        let categories = data.categories;
        for (let type of categories) {
            productTypes.push(type.name);
        }

        console.log('data: ', [product, productTypes]);
     }
     request.send();
 });



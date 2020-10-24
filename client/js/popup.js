
let key = 'F70004700D954219BBBFFFE3DC174815';
let amazonAPI = "https://api.rainforestapi.com/request?api_key=" + key + '&type=product&amazon_domain=';
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
         amazonAPI += 'amazon.ca';
     } else if (link.includes('amazon.com')) {
         amazonAPI += 'amazon.com';
     }
     amazonAPI += '&asin='

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
     amazonAPI += productID;
     console.log('api request to: ', amazonAPI);
 });



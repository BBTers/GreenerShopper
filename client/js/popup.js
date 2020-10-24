let key = 'F70004700D954219BBBFFFE3DC174815';
let amazonURL = "https://api.rainforestapi.com/request?api_key=" + key + '&type=product&amazon_domain=';
let amazonData = {};

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
     amazonURL += productID;
     console.log('api request to: ', amazonURL);

     let request = new XMLHttpRequest();
     let productInfo = [];
     request.open('GET', amazonURL);
     request.onload = function () {
        let data = JSON.parse(this.response);
        data = data.product;
        let product = data.title;
        productTypes = [];
        let categories = data.categories;
        if (categories != []) {
            for (let type of categories) {
                productTypes.push(type.name);
            }
        }
        let specifications = data.specifications;
        let productDetails = {};
        for (let specific of specifications) {
            productDetails[specific.name] = specific.value;
        }

        let weight = "";
        if ("Item Weight" in productDetails) {
            weight = productDetails["Item Weight"];
        } else if ("Product Dimensions" in productDetails) {
            weight = productDetails["Product Dimensions"];
            index = weight.indexOf(";") + 1;
            if (index != -1){
                weight = weight.substring(index, ).trim();
            }
        } else if ("Parcel Dimensions" in productDetails) {
            weight = productDetails["Parcel Dimensions"];
            index = weight.indexOf(";") + 1;
            if (index != -1){
                weight = weight.substring(index, ).trim();
            }
        }
        if (weight == "") {
            weight = "0 kilogram";
        }
        weight = weight.toLowerCase();
        if (weight.includes("g") || weight.includes("gram") || weight.includes("grams")) {
            index = weight.indexOf("g");
            weight = parseFloat(weight.substring(0, index).trim());
            weight = weight / 1000;
            weight = weight.toString() + " kilogram";
        } else if (weight.includes("ounce") || weight.includes("ounces")) {
            index = weight.indexOf("o");
            weight = parseFloat(weight.substring(0, index).trim());
            weight = weight * 0.02834952;
            weight = weight.toString() + " kilogram";
        } else if (weight.includes("pounds") || weight.includes("pound") || weight.includes("lbs") || weight.includes("lb")){
            if (weight.includes("pound")) {
                index = weight.indexOf("p");
            } else {
                index = weight.indexOf("l");
            }
            weight = parseFloat(weight.substring(0, index).trim());
            weight = weight * 0.45359237;
            weight = weight.toString() + " kilogram";
        }
        productInfo = [product, productTypes, weight];
        console.log(productInfo);
        // send?
     }
     request.send();
 });

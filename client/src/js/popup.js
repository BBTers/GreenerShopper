let key = 'F70004700D954219BBBFFFE3DC174815';
let amazonURL = "https://api.rainforestapi.com/request?api_key=" + key + '&type=product&amazon_domain=';

chrome.tabs.query({ currentWindow: true, active: true }, async function (tabs) {
    let link = document.createElement('a');
    link = tabs[0].url;
    if (!link.includes('amazon.ca') && !link.includes('amazon.com')) {
        console.log('Chrome extension only supports Amazon.com and Amazon.ca');
        return [];
    }

    let product = []
    await getProductInfo(link).then((res) => {
        product = res;
    });
    console.log(product);
    return product;
});


function getAPIUrl(url) {
    let apiUrl = amazonURL;
    if (url.includes('amazon.ca')) {
        apiUrl += 'amazon.ca';
    } else if (url.includes('amazon.com')) {
        apiUrl += 'amazon.com';
    }
    apiUrl += '&asin='

    let product = '/dp/';
    if (!url.includes(product) && url.includes('/product/')) {
        product = '/product/';
    }
    let index = url.indexOf(product);
    index += product.length;
    if (product == '/dp/') {
        productID = url.substring(index, );
        index = productID.indexOf('/');
    if (index == -1) {
        index = productID.indexOf('?');
    }
        productID = productID.substring(0, index);
    } else {
    // url contains /product/ and not /dp/
        productID = url.substring(index, );
    }

    if (productID == "ps:") {
        // no product selected
        apiUrl = "";
    } else {
        apiUrl += productID;
    }
    return apiUrl;
}

function parseData(data) {
    let product = data.title;
    productTypes = [];

    // get product categories
    if (data.categories && data.categories.length != 0) {
        for (let type of data.categories) {
            productTypes.push(type.name);
        }
    }

    // get product weight
    let weight = "";
    if (data.specifications && data.specifications.length != 0) {
        let specifications = data.specifications;
        let productDetails = {};
        for (let specific of specifications) {
            productDetails[specific.name] = specific.value;
        }

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
        }
        if (weight != "") {
            weight = weight.toString() + " kilogram";
        }
    }
    productInfo = [product, productTypes, weight];  // weight == "" if cant be found in info
    return productInfo;
}


async function getProductInfo(url) {
     let apiUrl = await getAPIUrl(url);
     if (apiUrl != "") {
        console.log('api request to: ', apiUrl);
     } else {
        console.log("No product has been selected.");
     }

    let data = await fetch(apiUrl);
    data = await data.json();

    // process data
    let productData = []
    productData = await parseData(data.product);
    return productData;
}
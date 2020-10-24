//import * as ecoData from './eco.json'
let key = '9A7B6F9DA1A940FEBC0412DE7FCAEF22';
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
    let kiloCo2 = await ecoDataParser(product); 
    console.log(kiloCo2); //get number co2/kilo
    product = calEcoEmission(product, kiloCo2);
    return product; // product = [ 'eggs', [ 'Video eggs', 'eggs' ], '0.3kilogram' ]
});

function calEcoEmission(product, kiloCo2){
    let shipping = 0.77221235; //shipping emission per kilogram
    let weight = product[2].split('k')[0];
    let total = shipping * weight + kiloCo2 * weight;
    product[3] = total+"_co2";
    return product; // [ 'eggs', [ 'Video eggs', 'eggs' ], '0.3kilogram', '0.831663705_co2' ]
}

function ecoDataParser(product) { //product = ["Nintento", [Video games, games], 0.3kilo]
    let ecoStat = fetch('./eco.json');
    ecoStat.then((resp) => {
        return resp.json();
    }).then((eco) => {
        console.log(eco);
    let findtitle = eco.ecoData[0].find(( { category:any } ) => product[1].includes(category)).kilosOfCo2;
    if (findtitle == undefined) {
        return eco.ecoData[0].find(( { category:any } ) => product[0].includes(category)).kilosOfCo2;
    }
 }); //3 or undefined in 

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
        } else if ("Package Dimensions" in productDetails) {
            weight = productDetails["Package Dimensions"];
            index = weight.indexOf(";") + 1;
            if (index != -1){
              weight = weight.substring(index, ).trim();
            }
        }

        weight = weight.toLowerCase();
        if (weight.includes("kilogram") || weight.includes("kg")) {
            // leave as is
            weight = weight.replace("kg", "kilogram");
            weight = weight.replace("kilograms", "kilogram");
        } else if (weight.includes("g") || weight.includes("gram")) {
            index = weight.indexOf("g");
            weight = parseFloat(weight.substring(0, index).trim());
            weight = weight / 1000;
        } else if (weight.includes("ounce")) {
            index = weight.indexOf("o");
            weight = parseFloat(weight.substring(0, index).trim());
            weight = weight * 0.02834952;
        } else if (weight.includes("pound") || weight.includes("lb")){
            if (weight.includes("pound")) {
                index = weight.indexOf("p");
            } else {
                index = weight.indexOf("l");
            }
            weight = parseFloat(weight.substring(0, index).trim());
            weight = weight * 0.45359237;
        }

        weight = weight.toString();
        if (weight != "" && !weight.includes("kilogram")) {
            weight += " kilogram";
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
export function main() {
    document.addEventListener('mouseover', function(e) {
        if (e.target.tagName == 'DIV') {
          let myDiv = e.target.parentElement;
          let id = myDiv.getAttribute('data-asin');
          if (id) {
            getProductInfo(id).then((product) => {
                let instance = tippy(myDiv, {
                    content: product,
                    interactive: true,
                    placement: "top",
                    arrow: true,
                    arrowType: "round",
                    theme: "dark-blue"
                });
            })
          } 
        }
    });
}

async function getProductInfo(id) {
    let key = 'BC11CB3E4B2A4A3A8259E5C3798B619B';
    let amazonURL = "https://api.rainforestapi.com/request?api_key=" + key + '&type=product&amazon_domain=amazon.ca&asin=';

    let apiUrl = amazonURL + id;
    let data = await fetch(apiUrl);
    data = await data.json();
    if (data.request_info.credits_remaining == 0) {
        // api key no longers has enough calls, need to request a new one
        console.log("API key has reached capacity. Request for new key via  https://rainforestapi.com/ and update code.");
        return [];
    }

    // process amazon api data
    let product = [];
    product = await parseData(data.product);

    // compute carbon emissions calculation
    let kiloCo2;
    await ecoDataParser(product).then(res => {
        product = calEcoEmission(product, res);
    });

    console.log(product);
    return product; // product = [ 'eggs', [ 'Video eggs', 'eggs' ], '0.3kilogram', '0.831663705_co2' ]
}

function calEcoEmission(product, kiloCo2) {
    let shipping = 0.77221235; //shipping emission per kilogram
    let weight, total;
    if (product[2] == undefined || product[2] == ""){
        weight = 0.1; // default is minimum 1 package weight
    } else {
        weight = product[2].split('k')[0];
    }
    if (kiloCo2 == undefined) {
        total = shipping * weight; // if no such category or title exist
    } else {
        total = shipping * weight + kiloCo2 * weight;
    }
    product[3] = total+"_co2";
    return product; // [ 'eggs', [ 'Video eggs', 'eggs' ], '0.3kilogram', '0.831663705_co2' ]
}

function ecoDataParser(product) { //product = ["Nintento", [Video games, games], 0.3kilo]
    let kiloCo2 = undefined;
    let url = chrome.runtime.getURL('client/src/js/eco.json');
    return fetch(url).then((resp) => {
        return resp.json();
    }).then((eco) => {
        for (let e of eco.ecoData) {
            if (e.category != undefined) {
                e.category.toLowerCase();
                if (product[1] != undefined) {
                    kiloCo2 = e.kilosOfCo2;
                } else if (product[0] != undefined){
                    kiloCo2 = e.kilosOfCo2;
                }
            }
        }
        return kiloCo2;
    });
}

function parseData(data) {
    let product = data.title;
    let productTypes = [];
    let index = 0;
    let productInfo = [];

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




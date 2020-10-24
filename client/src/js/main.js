import PopupBuilder from './popupBuilder.js';
// import JSONLoader from './jsonLoader.js';
import ProductInfo from './ProductInfo.js';

export function main() {
    // let carbonFootprintData = new JSONLoader();
    // carbonFootprintData.loadJSON().then(function(data) {
       
    //     let popup = new PopupBuilder(data);
    //     popup.buildPopup();
    // }).catch(function(error){
    //     console.log(error);
    // });

    let productData = ProductInfo.displayProductInfo();
    let popup = new PopBuilder(productData);
    popup.buildPopup();

    // chrome.tabs.query({ currentWindow: true, active: true }, () => {
    // });

}
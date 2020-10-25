import PopupBuilder from './popupBuilder.js';
import JSONLoader from './jsonLoader.js';

export function main() {
    let carbonFootprintData = new JSONLoader();
    carbonFootprintData.loadJSON().then(function(data) {
       
        let popup = new PopupBuilder(data);
        popup.buildPopup();
    }).catch(function(error){
        console.log(error);
    });
}
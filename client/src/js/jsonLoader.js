class JSONLoader {
    constructor() {
        this.ecodata = {};
    }


    loadJSON() {
        return new Promise (function(resolve, reject) {
            fetch(chrome.extension.getURL("client/src/json/eco.json"))
            .then(function(data) {
                data.json().then(function(jsonObject) {
                    //ecodata = jsonObject;
                    resolve(jsonObject);
                });
            }).catch (function (error) {
                reject(error);
            });
        });
    }
}

export default JSONLoader
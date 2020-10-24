class PopupBuilder {
    constructor(data) {
        this.data = data;
    }

    buildPopup() {
        tippy('.a-size-medium', {
            content: "hello shoppers!",
            interactive: true,
            placement: "top",
            arrow: true,
            arrowType: "round",
            theme: "dark-blue"
        });
    }
}
export default PopupBuilder
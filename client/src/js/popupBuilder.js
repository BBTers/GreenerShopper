class PopupBuilder {
    constructor(data) {
        this.data = data;
    }

    buildPopup() {
        tippy('.a-link-normal.a-link-text', {
            content: "hello shoppers!",
            interactive: true,
            placement: "right",
            arrow: true,
            arrowType: "round",
            theme: "dark-blue"
        });
    }
}
export default PopupBuilder
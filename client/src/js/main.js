export function main() {

    document.addEventListener('mouseover', function(e) {
        if (e.target.tagName == 'DIV') {
          let myDiv = e.target.parentElement;
          let id = myDiv.getAttribute('data-asin');
          if (id) {
            let instance = tippy(myDiv, {
                content: id,
                interactive: true,
                placement: "top",
                arrow: true,
                arrowType: "round",
                theme: "dark-blue"
            });
          } 
        }
    });

}
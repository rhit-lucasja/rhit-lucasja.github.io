function toggleHidden(element) {
    if (element.classList.contains("hidden")) {
        element.classList.remove("hidden");
    } else {
        element.classList.add("hidden");
    }
}

function toggleArrow(element) {
    if (element.classList.contains("collapsed-arrow")) {
        element.classList.remove("collapsed-arrow");
        element.classList.add("expanded-arrow");
    } else if (element.classList.contains("expanded-arrow")) {
        element.classList.remove("expanded-arrow");
        element.classList.add("collapsed-arrow");
    }
}

let dropdownHeaders = document.getElementsByClassName("dropdown-control");
for (let i = 0; i < dropdownHeaders.length; i++) {
    let el = dropdownHeaders[i];
    el.addEventListener("click", () => {
        // rotate the arrow next to menu header
        let arrow = el.getElementsByTagName("img")[0];
        toggleArrow(arrow);

        // hide / display the dropdown list contents
        let content = el.parentElement.getElementsByClassName("dropdown-content")[0];
        toggleHidden(content);
    })
}
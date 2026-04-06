// var x = 5;
// var y = 7;
// var z = x + y;
// console.log(z);
//
// var A = "Hello ";
// var B = "world!";
// var C = A + B;
// console.log(C);
//
// function sumPrint(x1, x2) {
//     console.log(x1 + x2);
// }
//
// sumPrint(x, y);
// sumPrint(A, B);
//
// if (C.length > z) {
//     console.log(C);
// } else if (C.length < z) {
//     console.log(z);
// } else {
//     console.log("good job!");
// }
//
// L1 = ["Watermelon", "Pineapple", "Pear", "Banana"];
// L2 = ["Apple", "Banana", "Kiwi", "Orange"];
//
// function findTheBanana(arr) {
//     arr.forEach((item) => {
//         item === "Banana" ? alert("Banana") : null;
//     })
// }
//
// findTheBanana(L1);
// findTheBanana(L2);

var now = new Date();
var hour = now.getHours();
function greeting(x) {
    var str;
    if (x < 5) {
        str = "Good Night";
    } else if (x < 12) {
        str = "Good Morning";
    } else if (x < 18) {
        str = "Good Afternoon";
    } else if (x < 20) {
        str = "Good Evening";
    } else {
        str = "Good Night";
    }
    document.getElementById("greeting").innerHTML = str + document.getElementById("greeting").innerHTML;
}
if (document.getElementById("greeting")) greeting(hour);

function addYear() {
    document.getElementById("copyYear").innerHTML = "&copy; " + now.getFullYear() + document.getElementById("copyYear").innerHTML;
}

function activeNavigation() {
    const navLinks = document.querySelectorAll('header a');

    navLinks.forEach(link => {
        if (window.location.href === link.href) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });
}

activeNavigation();


var lastFocusedButton = null;

function openForm(date) {
    lastFocusedButton = document.activeElement;
    document.getElementById("selected-date").textContent = date;
    var formSection = document.getElementById("purchase-form-section");
    formSection.classList.remove("hidden");
    formSection.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(function() {
        var heading = formSection.querySelector(".form-heading");
        if (heading) {
            heading.setAttribute("tabindex", "-1");
            heading.focus();
        }
    }, 300);
}

function closeForm() {
    document.getElementById("purchase-form-section").classList.add("hidden");
    if (lastFocusedButton) {
        lastFocusedButton.focus();
        lastFocusedButton = null;
    }
}

function handleSubmit(event) {
    event.preventDefault();
    alert("Redirecting to payment system.");
}

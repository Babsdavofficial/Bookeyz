import { watchAuthState, logoutUser } from "./auth.js";


const loginLink = document.getElementById("loginLink");
const userArea = document.getElementById("userArea");
const logoutButton = document.getElementById("logoutButton");


watchAuthState((user) => {

    if (user) {

        if (loginLink) {
            loginLink.style.display = "none";
        }

        if (userArea) {
            userArea.style.display = "flex";
        }

    } else {

        if (loginLink) {
            loginLink.style.display = "inline-block";
        }

        if (userArea) {
            userArea.style.display = "none";
        }

    }

});


if (logoutButton) {

    logoutButton.addEventListener("click", async () => {

        const result = await logoutUser();

        if (result.success) {

            window.location.href = "index.html";

        } else {

            console.error(result.error);

        }

    });

}
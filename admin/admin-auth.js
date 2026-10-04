import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import {
    auth,
    db
} from "./firebase-config.js";


onAuthStateChanged(auth, async (user) => {

    // Not logged in
    if (!user) {

        window.location.href =
            "../pages/login.html";

        return;
    }


    try {

        const adminRef =
            doc(
                db,
                "admins",
                user.uid
            );


        const adminSnapshot =
            await getDoc(adminRef);


        // Logged in but not an admin
        if (
            !adminSnapshot.exists() ||
            adminSnapshot.data().role !== "admin"
        ) {

            alert(
                "You do not have permission to access the admin area."
            );

            window.location.href =
                "../index.html";

            return;

        }


        console.log(
            "Admin access verified."
        );


    } catch (error) {

        console.error(error);

        alert(
            "Unable to verify admin access."
        );

        window.location.href =
            "../index.html";

    }

});
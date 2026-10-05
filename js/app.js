import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import {
    auth,
    db
} from "./firebase-config.js";


import { watchAuthState, logoutUser } from "./auth.js";


const loginLink = document.getElementById("loginLink");
const userArea = document.getElementById("userArea");
const logoutButton = document.getElementById("logoutButton");


watchAuthState(async (user) => {

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


    await loadContinueReading(user);

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


/* =========================
   CONTINUE READING
========================= */

async function loadContinueReading(user) {

    const continueReading =
        document.getElementById(
            "continueReading"
        );

    const continueSection =
        document.getElementById(
            "continueReadingSection"
        );


    if (
        !continueReading ||
        !continueSection
    ) {
        return;
    }


    if (!user) {

        continueSection.style.display =
            "none";

        return;

    }


    try {

        const progressQuery =
            query(
                collection(
                    db,
                    "readingProgress"
                ),

                where(
                    "userId",
                    "==",
                    user.uid
                )
            );


        const snapshot =
            await getDocs(
                progressQuery
            );


        if (snapshot.empty) {

            continueSection.style.display =
                "none";

            return;

        }


        /*
           Use the most recently updated
           reading progress.
        */

        const progressDocuments =
            snapshot.docs
                .map(
                    document => ({
                        id: document.id,
                        ...document.data()
                    })
                )
                .sort(
                    (a, b) => {

                        const dateA =
                            a.updatedAt?.toDate
                                ? a.updatedAt.toDate()
                                : new Date(a.updatedAt || 0);

                        const dateB =
                            b.updatedAt?.toDate
                                ? b.updatedAt.toDate()
                                : new Date(b.updatedAt || 0);

                        return dateB - dateA;

                    }
                );


        const progress =
            progressDocuments[0];


        if (!progress) {

            continueSection.style.display =
                "none";

            return;

        }


        continueReading.innerHTML = "";


        const bookReference =
            (
                await import(
                    "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js"
                )
            ).doc(
                db,
                "books",
                progress.bookId
            );


        const bookSnapshot =
            await (
                await import(
                    "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js"
                )
            ).getDoc(
                bookReference
            );


        if (!bookSnapshot.exists()) {

            continueSection.style.display =
                "none";

            return;

        }


        const book =
            bookSnapshot.data();


        if (
            book.status !== "published"
        ) {

            continueSection.style.display =
                "none";

            return;

        }


        const language =
            progress.language ||
            "en";


        continueReading.innerHTML = `

            <a
                href="pages/reader.html?book=${progress.bookId}&chapter=${progress.chapterNumber}&lang=${language}"
                class="continue-reading-card"
            >

                <div class="continue-reading-cover">

                    ${
                        book.coverImage
                        ?
                        `<img
                            src="${book.coverImage}"
                            alt="${book.title}"
                        >`
                        :
                        `<div class="book-cover-placeholder">
                            Bookeyz
                        </div>`
                    }

                </div>


                <div class="continue-reading-info">

                    <p class="section-label">
                        CONTINUE READING
                    </p>

                    <h3>
                        ${book.title || "Untitled Book"}
                    </h3>

                    <p>
                        Chapter ${progress.chapterNumber}
                    </p>

                    <div class="continue-reading-progress">

                        <div
                            class="continue-reading-progress-bar"
                            style="width: ${progress.progress || 0}%"
                        ></div>

                    </div>

                    <span>
                        ${progress.progress || 0}% read
                    </span>

                </div>

            </a>

        `;

    } catch (error) {

        console.error(
            "CONTINUE READING ERROR:",
            error
        );

        continueSection.style.display =
            "none";

    }

}
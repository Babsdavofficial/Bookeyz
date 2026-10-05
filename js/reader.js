import {
    doc,
    getDoc,
    collection,
    getDocs,
    query,
    where,
    orderBy,
    addDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
    auth,
    db
} from "./firebase-config.js";


/* =========================
   GET URL PARAMETERS
========================= */

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const bookId =
    urlParams.get("book");

let chapterNumber =
    parseInt(
        urlParams.get("chapter")
    ) || 1;


/* =========================
   PAGE ELEMENTS
========================= */

const readerBookTitle =
    document.getElementById(
        "readerBookTitle"
    );

const readerAuthor =
    document.getElementById(
        "readerAuthor"
    );

const readerCategory =
    document.getElementById(
        "readerCategory"
    );

const chapterNumberElement =
    document.getElementById(
        "chapterNumber"
    );

const chapterTitleElement =
    document.getElementById(
        "chapterTitle"
    );

const currentChapterNumber =
    document.getElementById(
        "currentChapterNumber"
    );

const storyContent =
    document.getElementById(
        "storyContent"
    );

const previousChapter =
    document.getElementById(
        "previousChapter"
    );

const nextChapter =
    document.getElementById(
        "nextChapter"
    );

const readingProgress =
    document.getElementById(
        "readingProgress"
    );

const artworkPlaceholder =
    document.querySelector(
        ".artwork-placeholder"
    );
    const readerBack = document.getElementById("readerBack");


/* =========================
   STORAGE
========================= */

let book = null;

let chapters = [];

let currentChapter = null;

let currentUser = null;

let readingProgressDocumentId = null;

let lastSavedProgress = -1;


/* =========================
   CHECK LOGIN
========================= */
onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            const currentUrl =
                window.location.pathname +
                window.location.search;

            window.location.href =
                `login.html?redirect=${encodeURIComponent(currentUrl)}`;

            return;

        }

        currentUser = user;

        await loadReader();

    }
);


/* =========================
   LOAD READER
========================= */

async function loadReader() {

    if (!bookId) {

        showError(
            "No book was selected."
        );

        return;

    }

    try {

        await loadBook();

        await loadChapters();

        findCurrentChapter();

        if (!currentChapter) {

            showError(
                "This chapter could not be found."
            );

            return;

        }

        renderReader();

    } catch (error) {

        console.error(
            "READER ERROR:",
            error
        );

        showError(
            "Unable to load this chapter."
        );

    }

}


/* =========================
   LOAD BOOK
========================= */

async function loadBook() {

    const bookReference =
        doc(
            db,
            "books",
            bookId
        );

    const bookSnapshot =
        await getDoc(
            bookReference
        );

    if (!bookSnapshot.exists()) {

        throw new Error(
            "Book not found."
        );

    }

    book =
        bookSnapshot.data();


    /* =========================
       BOOK INFORMATION
    ========================= */

    document.title =
        `Reading ${book.title || "Book"} — Bookeyz`;

    readerBookTitle.textContent =
        book.title ||
        "Untitled Book";

    readerAuthor.textContent =
        `By ${book.author || "Unknown Author"}`;

    readerCategory.textContent =
        book.category ||
        "Uncategorized";
    if (readerBack) {
    readerBack.href = `book.html?id=${bookId}`;
}


    /* =========================
       READER BACKGROUND
    ========================= */

    if (book.backgroundImage) {

        document.body.style.backgroundImage =
            `
            linear-gradient(
                rgba(15, 20, 30, 0.78),
                rgba(15, 20, 30, 0.88)
            ),
            url("${book.backgroundImage}")
            `;

    }

}


/* =========================
   LOAD CHAPTERS
========================= */
async function loadChapters() {
    const chaptersQuery = query(
        collection(db, "chapters"),
        where("bookId", "==", bookId),
        where("status", "==", "published"),
        orderBy("number", "asc")
    );

    const chaptersSnapshot = await getDocs(chaptersQuery);

    chapters = [];

    chaptersSnapshot.forEach((chapterSnapshot) => {
        chapters.push({
            id: chapterSnapshot.id,
            ...chapterSnapshot.data()
        });
    });

    setupLanguageSelector();
}

function setupLanguageSelector() {
    const languageSelect = document.getElementById("languageSelect");

    if (!languageSelect || chapters.length === 0) {
        return;
    }

    const languages = [];

    chapters.forEach((chapter) => {
        if (
            chapter.language &&
            !languages.includes(chapter.language)
        ) {
            languages.push(chapter.language);
        }
    });

    languageSelect.innerHTML = "";

    languages.forEach((language) => {
        const option = document.createElement("option");

        option.value = language;
        option.textContent = getLanguageName(language);

        languageSelect.appendChild(option);
    });

    const requestedLanguage = urlParams.get("lang");

    if (requestedLanguage && languages.includes(requestedLanguage)) {
        languageSelect.value = requestedLanguage;
    } else {
        languageSelect.value = languages[0];
    }

    languageSelect.addEventListener("change", () => {
        const selectedLanguage = languageSelect.value;

        window.location.href =
            `reader.html?book=${bookId}&chapter=${chapterNumber}&lang=${selectedLanguage}`;
    });
}

function getLanguageName(language) {
    const languageNames = {
        en: "English",
        fr: "French",
        es: "Spanish",
        ar: "Arabic",
        pt: "Portuguese"
    };

    return languageNames[language] || language;
}


/* =========================
   FIND CURRENT CHAPTER
========================= */

function findCurrentChapter() {
    const selectedLanguage =
        urlParams.get("lang") || chapters[0]?.language;

    currentChapter = chapters.find(
        (chapter) =>
            Number(chapter.number) === chapterNumber &&
            chapter.language === selectedLanguage
    );
}


/* =========================
   RENDER READER
========================= */

function renderReader() {

    /* =========================
       CHAPTER INFORMATION
    ========================= */

    chapterNumberElement.textContent =
        `CHAPTER ${currentChapter.number}`;

    chapterTitleElement.textContent =
        currentChapter.title ||
        `Chapter ${currentChapter.number}`;

    currentChapterNumber.textContent =
        currentChapter.number;


    /* =========================
       STORY CONTENT
    ========================= */

    storyContent.innerHTML = "";

    const content =
        currentChapter.content ||
        "";


    const paragraphs =
        content
            .split(/\r?\n/)
            .map(
                paragraph =>
                    paragraph.trim()
            )
            .filter(
                paragraph =>
                    paragraph.length > 0
            );


    paragraphs.forEach(
        (paragraph) => {

            const p =
                document.createElement(
                    "p"
                );

            p.textContent =
                paragraph;

            storyContent.appendChild(
                p
            );

        }
    );




 

    /* =========================
       ARTWORK
    ========================= */

    renderArtwork();


    /* =========================
       CHAPTER NAVIGATION
    ========================= */

    setupNavigation();


    /* =========================
       RESET SCROLL
    ========================= */

    window.scrollTo(
        0,
        0
    );

    updateReadingProgress();

loadReadingProgress();

}




/* =========================
   LOAD READING PROGRESS
========================= */

async function loadReadingProgress() {

    if (!currentUser || !bookId || !currentChapter) {
        return;
    }

    try {

        const progressQuery =
            query(
                collection(db, "readingProgress"),

                where(
                    "userId",
                    "==",
                    currentUser.uid
                ),

                where(
                    "bookId",
                    "==",
                    bookId
                )
            );

        const snapshot =
            await getDocs(progressQuery);


        if (!snapshot.empty) {

            const progressDocument =
                snapshot.docs[0];

            readingProgressDocumentId =
                progressDocument.id;

        } else {

            readingProgressDocumentId = null;

        }

    } catch (error) {

        console.error(
            "LOAD READING PROGRESS ERROR:",
            error
        );

    }
}


/* =========================
   SAVE READING PROGRESS
========================= */

async function saveReadingProgress() {

    if (
        !currentUser ||
        !bookId ||
        !currentChapter
    ) {
        return;
    }


    const scrollTop =
        window.scrollY;


    const documentHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;


    let progress = 0;


    if (documentHeight > 0) {

        progress =
            Math.round(
                (
                    scrollTop /
                    documentHeight
                ) * 100
            );

    }


    if (
        progress === lastSavedProgress
    ) {
        return;
    }


    lastSavedProgress = progress;


    try {

        const progressData = {

            userId:
                currentUser.uid,

            bookId:
                bookId,

            chapterId:
                currentChapter.id,

            chapterNumber:
                Number(currentChapter.number),

            language:
                currentChapter.language || "en",

            progress:
                progress,

            updatedAt:
                new Date()

        };


        if (
            readingProgressDocumentId
        ) {

            await updateDoc(
                doc(
                    db,
                    "readingProgress",
                    readingProgressDocumentId
                ),
                progressData
            );

        } else {

            const progressDocument =
                await addDoc(
                    collection(
                        db,
                        "readingProgress"
                    ),
                    progressData
                );


            readingProgressDocumentId =
                progressDocument.id;

        }

    } catch (error) {

        console.error(
            "SAVE READING PROGRESS ERROR:",
            error
        );

    }

}


/* =========================
   RENDER ARTWORK
========================= */

function renderArtwork() {

    if (!artworkPlaceholder) {
        return;
    }


    artworkPlaceholder.innerHTML = "";


    if (
        currentChapter.artwork
    ) {

        const image =
            document.createElement(
                "img"
            );

        image.src =
            currentChapter.artwork;

        image.alt =
            currentChapter.title ||
            "Chapter artwork";

        image.style.width =
            "100%";

        image.style.height =
            "100%";

        image.style.minHeight =
            "280px";

        image.style.objectFit =
            "cover";

        image.style.borderRadius =
            "12px";

        artworkPlaceholder.appendChild(
            image
        );

    } else {

        const text =
            document.createElement(
                "span"
            );

        text.textContent =
            "Chapter Artwork";

        artworkPlaceholder.appendChild(
            text
        );

    }

}



/* =========================
   CHAPTER NAVIGATION
========================= */

function setupNavigation() {

    const selectedLanguage =
        currentChapter.language ||
        urlParams.get("lang") ||
        "en";

    // Only navigate through chapters
    // belonging to the current language.
    const languageChapters =
        chapters
            .filter(
                (chapter) =>
                    chapter.language === selectedLanguage
            )
            .sort(
                (a, b) =>
                    Number(a.number) -
                    Number(b.number)
            );

    const currentIndex =
        languageChapters.findIndex(
            (chapter) =>
                chapter.id === currentChapter.id
        );


    /* =========================
       PREVIOUS
    ========================= */

    if (currentIndex > 0) {

        const previous =
            languageChapters[
                currentIndex - 1
            ];

        previousChapter.href =
            `reader.html?book=${bookId}&chapter=${previous.number}&lang=${selectedLanguage}`;

        previousChapter.classList.remove(
            "disabled"
        );

    } else {

        previousChapter.removeAttribute(
            "href"
        );

        previousChapter.classList.add(
            "disabled"
        );

    }


    /* =========================
       NEXT
    ========================= */

    if (
        currentIndex >= 0 &&
        currentIndex <
            languageChapters.length - 1
    ) {

        const next =
            languageChapters[
                currentIndex + 1
            ];

        nextChapter.href =
            `reader.html?book=${bookId}&chapter=${next.number}&lang=${selectedLanguage}`;

        nextChapter.classList.remove(
            "disabled"
        );

    } else {

        nextChapter.removeAttribute(
            "href"
        );

        nextChapter.classList.add(
            "disabled"
        );

    }

}


/* =========================
   READING PROGRESS
========================= */

function updateReadingProgress() {

    if (!readingProgress) {
        return;
    }


    const scrollTop =
        window.scrollY;


    const documentHeight =
        document.documentElement
            .scrollHeight -
        document.documentElement
            .clientHeight;


    if (
        documentHeight <= 0
    ) {

        readingProgress.style.width =
            "100%";

        return;

    }


    const progress =
        (
            scrollTop /
            documentHeight
        ) * 100;


    readingProgress.style.width =
        `${progress}%`;

}


window.addEventListener(
    "scroll",
    () => {

        updateReadingProgress();

        saveReadingProgress();

    }
);


/* =========================
   ERROR
========================= */

function showError(
    message
) {

    chapterNumberElement.textContent =
        "";

    chapterTitleElement.textContent =
        "Unable to load chapter";

    storyContent.innerHTML = "";


    const paragraph =
        document.createElement(
            "p"
        );

    paragraph.textContent =
        message;

    storyContent.appendChild(
        paragraph
    );


    previousChapter.classList.add(
        "disabled"
    );

    nextChapter.classList.add(
        "disabled"
    );

}


/* =========================
   COPY PROTECTION
========================= */

document.addEventListener(
    "contextmenu",
    (event) => {

        event.preventDefault();

    }
);


document.addEventListener(
    "keydown",
    (event) => {

        const modifier =
            event.ctrlKey ||
            event.metaKey;

        if (!modifier) {
            return;
        }

        const key =
            event.key.toLowerCase();


        if (
            key === "c" ||
            key === "x" ||
            key === "s" ||
            key === "u"
        ) {

            event.preventDefault();

        }

    }
);


document.addEventListener(
    "selectstart",
    (event) => {

        if (
            event.target.closest(
                ".story-content"
            )
        ) {

            event.preventDefault();

        }

    }
);
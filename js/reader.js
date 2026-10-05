import {
    doc,
    getDoc,
    collection,
    getDocs,
    query,
    where,
    orderBy
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


/* =========================
   STORAGE
========================= */

let book = null;

let chapters = [];

let currentChapter = null;


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

    const chaptersQuery =
        query(
            collection(
                db,
                "chapters"
            ),

            where(
                "bookId",
                "==",
                bookId
            ),

            where(
                "status",
                "==",
                "published"
            ),

            orderBy(
                "number",
                "asc"
            )
        );


    const chaptersSnapshot =
        await getDocs(
            chaptersQuery
        );


    chapters = [];


    chaptersSnapshot.forEach(
        (chapterSnapshot) => {

            chapters.push({
                id:
                    chapterSnapshot.id,

                ...chapterSnapshot.data()

            });

        }
    );

}


/* =========================
   FIND CURRENT CHAPTER
========================= */

function findCurrentChapter() {

    currentChapter =
        chapters.find(
            (chapter) =>
                Number(
                    chapter.number
                ) === chapterNumber
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

    const currentIndex =
        chapters.findIndex(
            (chapter) =>
                chapter.id ===
                currentChapter.id
        );


    /* =========================
       PREVIOUS
    ========================= */

    if (
        currentIndex > 0
    ) {

        const previous =
            chapters[
                currentIndex - 1
            ];

        previousChapter.href =
            `reader.html?book=${bookId}&chapter=${previous.number}`;

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
        currentIndex <
        chapters.length - 1
    ) {

        const next =
            chapters[
                currentIndex + 1
            ];

        nextChapter.href =
            `reader.html?book=${bookId}&chapter=${next.number}`;

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
    updateReadingProgress
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
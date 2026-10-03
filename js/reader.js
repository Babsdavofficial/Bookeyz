/* =========================
   BOOKEY Z READER
   DYNAMIC CHAPTER SYSTEM
========================= */


/* =========================
   BOOK DATA
========================= */

const book = {

    id: "beast-world",

    title: "Beast World: The Fire Dragon Quest",

    author: "Bookeyz",

    category: "Fantasy"

};


/* =========================
   CHAPTER DATA
========================= */

const chapters = [

    {
        number: 1,

        title: "The Festival Before the Storm",

        content: [
            "The kingdom of Ember was alive with celebration.",

            "Bright banners stretched between the ancient stone towers, while musicians filled the streets with songs and drums. Merchants shouted from their stalls, children ran through the crowded streets, and warriors gathered around the great festival grounds.",

            "It was the annual Festival of Flames, a celebration held to honor the strength and history of the kingdom.",

            "From the highest tower of the royal palace, Princess Sofia watched the celebration below.",

            "Everything appeared peaceful.",

            "But something about the sky troubled her.",

            "Dark clouds were slowly gathering beyond the mountains.",

            "Sofia turned toward the horizon.",

            "Somewhere beyond those mountains, something was coming.",

            "And before the night was over, the kingdom of Ember would never be the same again."
        ]

    },


    {
        number: 2,

        title: "The First Flames",

        content: [
            "The celebration continued long into the evening.",

            "The people of Ember gathered around enormous fires as the musicians played their final songs.",

            "Princess Sofia remained near the palace balcony, watching the distant mountains.",

            "The clouds had grown darker.",

            "Then she saw it.",

            "A faint orange glow appeared beyond the mountains.",

            "At first, she thought it was lightning.",

            "But the glow grew brighter.",

            "The ground suddenly trembled beneath the palace.",

            "The festival came to a complete silence.",

            "Far beyond the kingdom, something enormous had awakened."
        ]

    },


    {
        number: 3,

        title: "The Fire Dragon's Warning",

        content: [
            "The strange glow spread across the night sky.",

            "Warriors rushed toward the outer walls of Ember while the citizens were ordered to remain inside the city.",

            "King Valoron stood at the highest watchtower.",

            "He stared toward the mountains in silence.",

            "Then a roar echoed across the kingdom.",

            "The sound was so powerful that windows shook throughout the city.",

            "A massive shadow moved across the clouds.",

            "The ancient legends were no longer legends.",

            "The Fire Dragon had returned.",

            "But the dragon did not attack.",

            "Instead, it delivered a warning."
        ]

    },


    {
        number: 4,

        title: "Shadow Over Ember Kingdom",

        content: [
            "The morning after the festival was unlike anything Ember had ever seen.",

            "The streets were almost empty.",

            "Soldiers stood at every major entrance while the royal council gathered inside the palace.",

            "King Valoron listened carefully as the Five Wise Men discussed the dragon's warning.",

            "Armun believed the kingdom was facing an ancient enemy.",

            "Miria warned that the other kingdoms might soon become involved.",

            "Dren argued that Ember needed to prepare its army.",

            "The danger was no longer somewhere beyond the mountains.",

            "It was moving closer."
        ]

    },


    {
        number: 5,

        title: "The March Into Ashes",

        content: [
            "The army of Ember began its journey before sunrise.",

            "Thousands of warriors marched through the mountain pass while the kingdom prepared for what might come next.",

            "David and Shawn followed the main army, determined to discover what had happened beyond the mountains.",

            "Smoke filled the distant sky.",

            "The farther they traveled, the darker the land became.",

            "Trees stood burned and silent along the road.",

            "Then the soldiers reached the edge of the Ashlands.",

            "Something had happened there.",

            "Something powerful."
        ]

    },


    {
        number: 6,

        title: "The Secret Beneath the Mountain",

        content: [
            "The warriors discovered an ancient passage hidden beneath the mountain.",

            "The entrance was covered with symbols that none of the soldiers recognized.",

            "David stepped closer and noticed a strange mark carved into the stone.",

            "The same symbol had appeared in the dragon's warning.",

            "Shawn looked deeper into the darkness.",

            "A faint light could be seen at the end of the passage.",

            "Whatever was waiting below had been hidden for centuries.",

            "And now it had been discovered."
        ]

    },


    {
        number: 7,

        title: "The Return and the Flame Within",

        content: [
            "The journey back to Ember was filled with uncertainty.",

            "The warriors carried knowledge that could change the future of every kingdom.",

            "Princess Sofia stood at the gates when the army finally returned.",

            "She could see the exhaustion on their faces.",

            "But she could also see something else.",

            "Hope.",

            "The dragon's warning had revealed a danger, but it had also revealed a path forward.",

            "The battle ahead would not be won by strength alone.",

            "It would require courage, trust, and the flame within every warrior."
        ]

    },


    {
        number: 8,

        title: "Shadows of the Past",

        content: [
            "That night, the royal council gathered once again.",

            "Ancient records were brought from the deepest chambers of the palace.",

            "The Five Wise Men searched through forgotten histories.",

            "They discovered that the Fire Dragon had appeared before.",

            "Hundreds of years ago, the same warning had been delivered.",

            "But the people of Ember had forgotten the meaning of the message.",

            "Now the past had returned.",

            "And the answers to the kingdom's future were hidden inside the oldest stories."
        ]

    },


    {
        number: 9,

        title: "The Lock and the Worthy Blade",

        content: [
            "Deep beneath the royal palace stood an ancient chamber.",

            "At its center was a massive stone door.",

            "A single sword rested before it.",

            "The weapon had been sealed there for generations.",

            "According to the ancient records, only someone worthy could awaken its power.",

            "Princess Sofia approached the sword.",

            "The chamber became completely silent.",

            "Then the sword began to glow.",

            "The ancient lock opened.",

            "And somewhere beyond the kingdom, something answered."
        ]

    }

];


/* =========================
   GET CHAPTER FROM URL
========================= */

const urlParams = new URLSearchParams(window.location.search);

let chapterNumber =
    parseInt(urlParams.get("chapter")) || 1;


/* =========================
   FIND CHAPTER
========================= */

let currentChapter =
    chapters.find(
        chapter => chapter.number === chapterNumber
    );


/* =========================
   FALLBACK
========================= */

if (!currentChapter) {

    chapterNumber = 1;

    currentChapter =
        chapters.find(
            chapter => chapter.number === 1
        );

}


/* =========================
   PAGE ELEMENTS
========================= */

const readerBookTitle =
    document.getElementById("readerBookTitle");

const readerAuthor =
    document.getElementById("readerAuthor");

const readerCategory =
    document.getElementById("readerCategory");

const chapterNumberElement =
    document.getElementById("chapterNumber");

const chapterTitleElement =
    document.getElementById("chapterTitle");

const currentChapterNumber =
    document.getElementById("currentChapterNumber");

const storyContent =
    document.getElementById("storyContent");

const previousChapter =
    document.getElementById("previousChapter");

const nextChapter =
    document.getElementById("nextChapter");

const readingProgress =
    document.getElementById("readingProgress");


/* =========================
   LOAD BOOK INFORMATION
========================= */

readerBookTitle.textContent =
    book.title;

readerAuthor.textContent =
    "By " + book.author;

readerCategory.textContent =
    book.category;


/* =========================
   LOAD CHAPTER INFORMATION
========================= */

chapterNumberElement.textContent =
    "CHAPTER " + currentChapter.number;

chapterTitleElement.textContent =
    currentChapter.title;

currentChapterNumber.textContent =
    currentChapter.number;


/* =========================
   LOAD STORY
========================= */

storyContent.innerHTML = "";


currentChapter.content.forEach(
    paragraph => {

        const p =
            document.createElement("p");

        p.textContent =
            paragraph;

        storyContent.appendChild(p);

    }
);


/* =========================
   PREVIOUS CHAPTER
========================= */

if (currentChapter.number > 1) {

    previousChapter.href =
        `reader.html?book=${book.id}&chapter=${currentChapter.number - 1}`;

} else {

    previousChapter.classList.add("disabled");

    previousChapter.removeAttribute("href");

}


/* =========================
   NEXT CHAPTER
========================= */

if (
    currentChapter.number <
    chapters.length
) {

    nextChapter.href =
        `reader.html?book=${book.id}&chapter=${currentChapter.number + 1}`;

} else {

    nextChapter.classList.add("disabled");

    nextChapter.removeAttribute("href");

}


/* =========================
   RESET SCROLL POSITION
========================= */

window.scrollTo(0, 0);


/* =========================
   READING PROGRESS
========================= */

function updateReadingProgress() {

    const scrollTop =
        window.scrollY;

    const documentHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    if (documentHeight <= 0) {

        readingProgress.style.width = "100%";

        return;

    }

    const progress =
        (scrollTop / documentHeight) * 100;

    readingProgress.style.width =
        progress + "%";

}


window.addEventListener(
    "scroll",
    updateReadingProgress
);


updateReadingProgress();



/* =========================
   BASIC COPY PROTECTION
========================= */

// Disable right-click
document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
});


// Disable common keyboard shortcuts
document.addEventListener("keydown", (event) => {

    // Ctrl / Command key
    const modifier = event.ctrlKey || event.metaKey;

    if (!modifier) {
        return;
    }

    const key = event.key.toLowerCase();


    // Copy
    if (key === "c") {
        event.preventDefault();
    }


    // Cut
    if (key === "x") {
        event.preventDefault();
    }


    // Save page
    if (key === "s") {
        event.preventDefault();
    }


    // View source
    if (key === "u") {
        event.preventDefault();
    }

});


// Disable selecting story text
document.addEventListener("selectstart", (event) => {

    if (
        event.target.closest(".story-content")
    ) {
        event.preventDefault();
    }

});
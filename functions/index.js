const { setGlobalOptions } = require("firebase-functions");
const {
    onDocumentWritten
} = require("firebase-functions/v2/firestore");

const {
    initializeApp
} = require("firebase-admin/app");

const {
    getFirestore
} = require("firebase-admin/firestore");


setGlobalOptions({
    maxInstances: 10,
    region: "us-east4"
});


initializeApp();

const db = getFirestore();


exports.syncBookRating = onDocumentWritten(
    "ratings/{ratingId}",
    async (event) => {

        const before = event.data?.before?.data();
        const after = event.data?.after?.data();

        const affectedBookIds = new Set();

        if (before?.bookId) {
            affectedBookIds.add(before.bookId);
        }

        if (after?.bookId) {
            affectedBookIds.add(after.bookId);
        }


        for (const bookId of affectedBookIds) {

            const ratingsSnapshot = await db
                .collection("ratings")
                .where("bookId", "==", bookId)
                .get();


            let total = 0;

            ratingsSnapshot.forEach((ratingDoc) => {

                const ratingData = ratingDoc.data();

                total += Number(
                    ratingData.rating || 0
                );

            });


            const ratingCount =
                ratingsSnapshot.size;


            const ratingAverage =
                ratingCount > 0
                    ? Number(
                        (total / ratingCount).toFixed(1)
                    )
                    : 0;


            await db
                .collection("books")
                .doc(bookId)
                .update({
                    ratingAverage,
                    ratingCount
                });

        }

    }
);
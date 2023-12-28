import admin from "firebase-admin";

import serviceAccount from "../../next-ecommerce-403923-firebase-adminsdk-8o0lg-10d606a744.json" assert { type: "json" };

admin.initializeApp({
   credential: admin.credential.cert(serviceAccount),
   storageBucket: process.env.STORAGE_BUCKET,
});

const storage = admin.storage();

export default storage;

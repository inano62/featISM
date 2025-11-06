
import admin from 'firebase-admin';
const projecetId = process.env.GOOGLE_CLOUD_PROJECT ||'demo-auth';
if (!admin.apps.length){
    admin.initializeApp({
        projectId: projecetId,
        // credential: admin.credential.applicationDefault(),
    });
}
const db = admin.firestore();
const host = process.env.Firestore_HOST || 'firebase:8000';
process.env.FIRESTORE_EMULATOR_HOST = host;

db.settings({ host, ssl: false })
export { db,host };

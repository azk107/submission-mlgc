const { Firestore } = require('@google-cloud/firestore');


async function getAllData() {
    const db = new Firestore();
    const predictionsCollection = db.collection('predictions');
    return await predictionsCollection.get();
    
}

module.exports = getAllData;
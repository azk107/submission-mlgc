const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const { storeData, predictionsCollection } = require('../services/storeData');
const getAllData = require('../services/getAllData')

async function postPredictHandler(request, h) {
    const { image } = request.payload;
    const { model } = request.server.app;

    const { confidenceScore, label, explanation, suggestion } = await predictClassification(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
        id: id,
        result: label,
        suggestion: suggestion,
        createdAt: createdAt,
    };

    await storeData(id, data);

    const response = h.response({
        status: 'success',
        message: 'Model is predicted successfully',
        data,
    })
    response.code(201);
    return response;
}

async function getPredictHistories(request, h) {
    const histories = await getAllData();
    const data = [];
    histories.forEach(doc => {
        const history = doc.data();
        data.push({
            id: doc.id,
            result: history.result,
            suggestion: history.suggestion,
            createdAt: history.createdAt,
        })
    })

    return h.response({ status: 'success', data }).code(200);
}

module.exports = { postPredictHandler, getPredictHistories };
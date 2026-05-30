const db = require('../persistence');
const { v4: uuid } = require('uuid');
const { normalizePlanningFields } = require('./itemValidation');

module.exports = async (req, res) => {
    let planningFields;
    try {
        planningFields = normalizePlanningFields(req.body);
    } catch (err) {
        res.status(400).send({ error: err.message });
        return;
    }

    const item = {
        id: uuid(),
        name: req.body.name,
        completed: false,
        ...planningFields,
    };

    await db.storeItem(item);
    res.send(item);
};

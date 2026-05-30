const db = require('../persistence');
const { normalizePlanningFields } = require('./itemValidation');

module.exports = async (req, res) => {
    const existingItem = await db.getItem(req.params.id);
    let planningFields;
    try {
        planningFields = normalizePlanningFields(req.body, existingItem);
    } catch (err) {
        res.status(400).send({ error: err.message });
        return;
    }

    await db.updateItem(req.params.id, {
        name: req.body.name,
        completed: req.body.completed,
        ...planningFields,
    });
    const item = await db.getItem(req.params.id);
    res.send(item);
};

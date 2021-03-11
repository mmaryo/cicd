// generate error or succes for API

export function generateError(statusCode, message, res) {
    res.status(statusCode);
    res.json({ error : message });
}

export function generateSuccess(statusCode, data, res) {
    res.status(statusCode);
    res.json(data);
}


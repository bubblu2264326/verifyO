export function validateRequest(schemas) {
    return (req, _res, next) => {
        try {
            if (schemas.body) {
                req.body = schemas.body.parse(req.body);
            }
            if (schemas.query) {
                schemas.query.parse(req.query);
            }
            if (schemas.params) {
                schemas.params.parse(req.params);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
}

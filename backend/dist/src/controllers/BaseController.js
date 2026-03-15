export class BaseController {
    ok(res, data, statusCode = 200) {
        res.status(statusCode).json(data);
    }
    created(res, data) {
        this.ok(res, data, 201);
    }
    fail(next, error) {
        next(error);
    }
}

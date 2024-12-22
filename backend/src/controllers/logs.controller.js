import LogsModel from "../models/logs.model.js";


class LogsController {
    constructor() {
        this.logsModel = new LogsModel();
    }

    // Please use arrow function to bind 'this' to the class

    getAll = async (req, res) => {
        const logs = await this.logsModel.getAll(req.pool, req.businessId);
        res.json(logs);
    }

}

export default LogsController;
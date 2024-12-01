import EmployeeModel from "../models/employee.model.js";


class EmployeeController {

    async getAll(req, res) {
        const emps = await EmployeeModel.getAll(req.pool);
        res.json(emps);
    }
}


export default new EmployeeController();
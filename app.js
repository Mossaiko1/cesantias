const express = require('express');
const app = express();
const port = 3000;

const Employee = require("./schema/employee");

// Middleware para parsear JSON
app.use(express.json());
require("./DataBase/connect")

app.get('/api/employee', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/api/employee', async (req, res) => {
    try {
        const dateEntry = new Date(req.body.dateEntry);
        const dateEnd = new Date(req.body.dateEnd);
        const dayWorked = (dateEnd - dateEntry) / (1000 * 60 * 60 * 24);
        req.body.dayWorked = dayWorked;
        const severancePay = (req.body.salary * dayWorked) / 360;
        req.body.severancePay = severancePay;

        const employee = new Employee(req.body);
        await employee.save();
        res.json(employee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// PUT: Actualizar un empleado por su ID
app.put('/api/employee/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Calcula nuevamente los días trabajados y la liquidación si se envían las fechas
        if (req.body.dateEntry && req.body.dateEnd) {
            const dateEntry = new Date(req.body.dateEntry);
            const dateEnd = new Date(req.body.dateEnd);
            const dayWorked = (dateEnd - dateEntry) / (1000 * 60 * 60 * 24);
            req.body.dayWorked = dayWorked;
            req.body.severancePay = (req.body.salary * dayWorked) / 360;
        }

        const employee = await Employee.findByIdAndUpdate(id, req.body, { new: true });
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }
        res.json(employee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// DELETE: Eliminar un empleado por su ID
app.delete('/api/employee/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findByIdAndDelete(id);
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }
        res.json({ message: "Employee deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
});
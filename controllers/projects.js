import sqlite3 from "sqlite3";

export const getAll = (req, res) => {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');

    var sql = 'SELECT * FROM projects ORDER BY id';

    var db = new sqlite3.Database("./data/main.db"); // Abre o banco
    db.all(sql, [], (err, rows) => {
        if (err) {
        throw err;
        }
        res.json(rows);
    });
    db.close(); //fecha o banco
}

export const createProject = (req, res) => {
    res.statusCode = 200;
    res.setHeader("Access-Control-Allow-Origin", "*");

    var sql = "INSERT INTO projects (project_name, owner, begin_date, finish_date, id_employees, employees_allocated_hours, local, timeDistribution, monthlyAlloc, isActive) VALUES ('" + req.body.project_name + "', '" + req.body.owner + "', '" + req.body.begin_date + "', '" + req.body.finish_date + "', '" + req.body.id_employees + "',  '" + req.body.employees_allocated_hours + "', '" + req.body.local + "', '" + req.body.timeDistribution + "', '" + req.body.monthlyAlloc + "', '" + req.body.isActive + "')";

    var db = new sqlite3.Database("./data/main.db"); // Abre o banco
    db.run(sql, [], err => {
        if (err) {
            throw err;
        }
    });
    db.close(); //fecha o banco
    res.send("O projeto foi adicionado ao banco de dados.");
    res.end();
}

export const getProject = (req, res) => {
    res.statusCode = 200;
    res.setHeader("Access-Control-Allow-Origin", "*");

    const { id } = req.params;

    var sql = `SELECT * FROM projects WHERE id=${id}`;

    var db = new sqlite3.Database("./data/main.db"); // Abre o banco
    db.all(sql, [], (err, rows) => {
        if (err) {
        throw err;
        }
        res.json(rows);
    });
    db.close(); //fecha o banco
}

export const deleteProject = (req, res) => {
    res.statusCode = 200;
    res.setHeader("Access-Control-Allow-Origin", "*");

    const { id } = req.params;

    var sql = `DELETE FROM projects WHERE id=${id}`;

    var db = new sqlite3.Database("./data/main.db"); // Abre o banco
    db.run(sql, [], err => {
        if (err) {
            throw err;
        }
    });
    db.close(); //fecha o banco
    res.send("Projeto foi removido do banco de dados.");
    res.end();
}

export const patchProject = (req, res) => {
    res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');

    var params = req.params;
    var body = req.body;
    var sql;
	
    sql = `UPDATE projects SET project_name="${body.project_name}", owner="${body.owner}", local="${body.local}" WHERE id=${params.id}`;

    var db = new sqlite3.Database("./data/main.db"); // Abre o banco
	db.run(sql, [],  err => {
		if (err) {
		    throw err;
		}
        res.send("Projeto foi atualizado");
		res.end();
	});
	db.close(); // Fecha o banco
}
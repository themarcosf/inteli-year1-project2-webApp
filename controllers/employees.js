import sqlite3 from "sqlite3"; //importação para ter acesso ao banco de dados dos funcionários 


export const getAll = (req, res) => {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');

    var sql = 'SELECT * FROM employees ORDER BY id';

    var db = new sqlite3.Database("./data/main.db"); //abre o banco
    db.all(sql, [], (err, rows) => {
        if (err) {
        throw err;
        }
        res.json(rows);
    });
    db.close(); //fecha o banco
}

export const createEmployee = (req, res) => {
    res.statusCode = 200;
    res.setHeader("Access-Control-Allow-Origin", "*");

    var sql = "INSERT INTO employees (full_name, position, legal_hours, total_hours, allocated_hours, outsourced, local, isActive) VALUES ('" + req.body.full_name + "', '" + req.body.position + "', '" + req.body.legal_hours + "', '" + req.body.total_hours + "', '" + req.body.allocated_hours + "',  '" + req.body.outsourced + "', '" + req.body.local + "', '" + req.body.isActive + "')";

    var db = new sqlite3.Database("./data/main.db"); // Abre o banco
    db.run(sql, [], err => {
        if (err) {
            throw err;
        }
    });
    db.close(); //fecha o banco
    res.send("Funcionário foi adicionado ao banco de dados.");
    res.end();
}

export const getEmployee = (req, res) => {
    res.statusCode = 200;
    res.setHeader("Access-Control-Allow-Origin", "*");

    const { id } = req.params;

    var sql = `SELECT * FROM employees WHERE id=${id}`;

    var db = new sqlite3.Database("./data/main.db"); // Abre o banco
    db.all(sql, [], (err, rows) => {
        if (err) {
        throw err;
        }
        res.json(rows);
    });
    db.close(); //fecha o banco
}

export const deleteEmployee = (req, res) => {
    res.statusCode = 200;
    res.setHeader("Access-Control-Allow-Origin", "*");

    const { id } = req.params;

    var sql = `DELETE FROM employees WHERE id=${id}`;

    var db = new sqlite3.Database("./data/main.db"); // Abre o banco
    db.run(sql, [], err => {
        if (err) {
            throw err;
        }
    });
    db.close(); //fecha o banco
    res.send("Funcionário foi removido do banco de dados.");
    res.end();
}

export const patchEmployee = (req, res) => {
    res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');

    var params = req.params;
    var body = req.body;
    var sql;

    sql = `UPDATE employees SET full_name="${body.full_name}", position="${body.position}", legal_hours="${body.legal_hours}", total_hours="${body.total_hours}", allocated_hours="${body.allocated_hours}", outsourced="${body.outsourced}", local="${body.local}", isActive="${body.isActive}" WHERE id=${params.id}`
	
    var db = new sqlite3.Database("./data/main.db"); // Abre o banco
	db.run(sql, [],  err => {
		if (err) {
		    throw err;
		}
        res.send("Funcionário foi atualizado");
		res.end();
	});
	db.close(); // Fecha o banco
}
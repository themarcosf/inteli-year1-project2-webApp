import sqlite3 from "sqlite3";


//BEGIN OF API REQUEST
export const getDashboard = (req, res) => {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');

    var projects = 'SELECT * FROM projects ORDER BY id';
    var employees = 'SELECT * FROM employees ORDER BY id';

    var db = new sqlite3.Database("./data/main.db"); // Abre o banco
    
    db.all(projects, [], (err, projs) => {
        if (err) {
        throw err;
        }
        
        db.all(employees, [], (err, emps) => {
            if (err) {
                throw err;
            }
            res.json([projCapacity(projs), empCapacity(emps)]);
        })
    });
    db.close(); //fecha o banco
}
//END OF API REQUEST


//BEGIN OF PROJECTS-RELATED LOGIC
//calculate how many MONTHS the project is expected to take
function projectDuration(projectData) {
    let start = projectData["begin_date"];
    let end = projectData["finish_date"];

    let startDate = start.split("-");
    let endDate = end.split("-");

    var d0 = new Date();
    d0.setFullYear(startDate[1], startDate[0]-1, 1);

    var dn = new Date();
    dn.setFullYear(endDate[1], endDate[0]-1, 1)

    return monthDiff(d0, dn)
}


//calculate difference in MONTHS between two dates
function monthDiff(start, end) {
    return 1 + end.getMonth() - start.getMonth() + (12 * (end.getFullYear() - start.getFullYear()));
   }


//calculate length in HOURS of a given project
function projectLength(projectData) {
    var projLength = projectData["employees_allocated_hours"];
    projLength = projLength.replace("(", "").replace(")", "").replace(" ", "");
    projLength = Array.from(projLength.split(","));

    let totalLength = 0;
    for (let i=0; i<projLength.length; i++) {
        totalLength += parseInt(projLength[i]);
    }

    return totalLength;
}


//calculate the distribution of hours per month according to DURATION and LENGTH
function projLinearDistr(projectData) {
    let start = projectData["begin_date"];
    let startDate = start.split("-");
    var d = new Date();
    d.setFullYear(startDate[1], startDate[0]-1, 1);
    
    let monthsUsed = projectDuration(projectData);
    let monthlyAlloc = projectLength(projectData) / monthsUsed;

    let projDistrDict = {};

    projDistrDict[d] = monthlyAlloc;
    for (let i=1; i<monthsUsed; i++) {
        projDistrDict[new Date(d.setMonth(d.getMonth()+1))] = monthlyAlloc;
    }
        
    return projDistrDict;
}


//calculate the distribution of hours per month according to non-linear duration
function projSkewedDistr(projectData) {
    let start = projectData["begin_date"];
    let startDate = start.split("-");
    var d = new Date();
    d.setFullYear(startDate[1], startDate[0]-1, 1);
    
    let monthlyDistr;
    let monthsUsed = projectDuration(projectData);
    let hoursUsed = projectLength(projectData);

    if (monthsUsed == 1) {monthlyDistr = [1];}
    if (monthsUsed == 2) {monthlyDistr = [0.4, 0.6];}
    if (monthsUsed == 3) {monthlyDistr = [0.2, 0.35, 0.45];}
    if (monthsUsed == 4) {monthlyDistr = [0.1, 0.25, 0.35, 0.3];}
    if (monthsUsed == 5) {monthlyDistr = [0.1, 0.2, 0.25, 0.25, 0.2];}
    if (monthsUsed == 6) {monthlyDistr = [0.1, 0.15, 0.15, 0.2, 0.225, 0.175];}
    if (monthsUsed == 7) {monthlyDistr = [0.05, 0.1, 0.1, 0.15, 0.25, 0.2, 0.15];}
    if (monthsUsed == 8) {monthlyDistr = [0.05, 0.1, 0.1, 0.15, 0.15, 0.2, 0.15, 0.1];}
    if (monthsUsed == 9) {monthlyDistr = [0.05, 0.075, 0.1, 0.1, 0.125, 0.125, 0.15, 0.15, 0.125];}
    if (monthsUsed == 10) {monthlyDistr = [0.05, 0.05, 0.075, 0.075, 0.1, 0.125, 0.125, 0.15, 0.15, 0.1];}
    if (monthsUsed == 11) {monthlyDistr = [0.05, 0.05, 0.075, 0.075, 0.1, 0.1, 0.125, 0.125, 0.125, 0.1, 0.075];}
    if (monthsUsed == 12) {monthlyDistr = [0.05, 0.05, 0.05, 0.05, 0.1, 0.1, 0.125, 0.125, 0.1, 0.1, 0.075, 0.075];}

    let projDistrDict = {};

    projDistrDict[d] = hoursUsed * monthlyDistr[0];
    for (let i=1; i<monthsUsed; i++) {

        if (i < 13) {
            projDistrDict[new Date(d.setMonth(d.getMonth()+1))] = hoursUsed * monthlyDistr[i];
        } else {
            projDistrDict[new Date(d.setMonth(d.getMonth()+1))] = hoursUsed / monthsUsed;
        }   
    }
    return projDistrDict;
}


//allocate distribution of hours per month according to manager inputs
function projMngmtDistr(projectData) {
    let start = projectData["begin_date"];
    let startDate = start.split("-");
    var d = new Date();
    d.setFullYear(startDate[1], startDate[0]-1, 1);
    
    let monthsUsed = projectDuration(projectData);

    let projDistrDict = {};

    let tempArray = mngmtDistrArray(projectData);

    projDistrDict[d] = tempArray[0];
    for (let i=1; i<monthsUsed; i++) {
        projDistrDict[new Date(d.setMonth(d.getMonth()+1))] = tempArray[i];
    }
        
    return projDistrDict;
}


function mngmtDistrArray(projectData) {
    var c = JSON.parse(projectData["monthlyAlloc"]);

    var d = Object.keys(c).length;

    for (let i=0; i< d-1; i++) {
        if (i===0) {
            var m = sumArrays(c[0], c[1]);
        } else {
        m = sumArrays(m, c[i+1]);
        }
    }
    return m;
}


function sumArrays(array1, array2) {
    return array1.map((num, idx) => num + array2[idx]);
}


//add demanded hours of two projects, allocating monthly schedule
function projGrandTtl(currentProj, nextProj) {
    let projGrandTtl = {};
    for (let i in currentProj) {
        if (i in nextProj) {
            projGrandTtl[i] = currentProj[i] + nextProj[i];
        } else {
            projGrandTtl[i] = currentProj[i];
        }
    }

    for (let i in nextProj) {
        if (!(i in currentProj)) {
            projGrandTtl[i] = nextProj[i];
        }
    }

    return projGrandTtl;
}


//calculate FULL PIPELINE of projects, considering monthly allocations
function projCapacity(projects) {
    var requiredCapacity;

    for (let i=0; i<projects.length-1; i++) {
        if (i===0) {

            let proj1 = projects[i]["timeDistribution"];
            if (proj1 === 1) {
                proj1 = projLinearDistr(projects[i]);
            } else if (proj1 === 2) {
                proj1 = projSkewedDistr(projects[i]);
            } else {
                proj1 = projMngmtDistr(projects[i]);
            }

            let proj2 = projects[i+1]["timeDistribution"];
            if (proj2 === 1) {
                proj2 = projLinearDistr(projects[i+1]);
            } else if (proj2 === 2) {
                proj2 = projSkewedDistr(projects[i+1]);
            } else {
                proj2 = projMngmtDistr(projects[i+1]);
            }
    
            requiredCapacity = projGrandTtl(proj1, proj2);
        } else {

            let proj = projects[i+1]["timeDistribution"];
            if (proj === 1) {
                proj = projLinearDistr(projects[i+1]);
            } else if (proj === 2) {
                proj = projSkewedDistr(projects[i+1]);
            } else {
                proj = projMngmtDistr(projects[i+1]);
            }

            requiredCapacity = projGrandTtl(requiredCapacity, proj);
        }
    }

    return requiredCapacity;
}
//END OF PROJECTS-RELATED LOGIC


//BEGIN OF EMPLOYEES-RELATED LOGIC
function ttlLegalHours(employees) {
    let ttlLegalHours = 0;

    for (let i=0; i < employees.length; i++) {
        ttlLegalHours += employees[i]["legal_hours"]
    }

    return ttlLegalHours;
}

function ttlStdHours(employees) {
    let ttlStdHours = 0;

    for (let i=0; i < employees.length; i++) {
        ttlStdHours += employees[i]["total_hours"]
    }

    return ttlStdHours;
}

function ttlProjHours(employees) {
    let ttlProjHours = 0;

    for (let i=0; i < employees.length; i++) {
        ttlProjHours += employees[i]["allocated_hours"]
    }

    return ttlProjHours;
}

function empCapacity(employees) {

    var dict = {
        "legal_hours": ttlLegalHours(employees),
        "total_hours": ttlStdHours(employees),
        "allocated_hours": ttlProjHours(employees)
    };

    return dict;
}
//END OF EMPLOYEES-RELATED LOGIC

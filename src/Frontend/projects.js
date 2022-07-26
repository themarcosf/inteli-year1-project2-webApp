var employeeCount = 1;

document.addEventListener('DOMContentLoaded', () => {
    getProjectList();
 }, false);


 $('#postModal').on('shown.bs.modal', function (e) {
    var url = "http://127.0.0.1:3000/employees/";
    var res;

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, false);
    xhttp.send();//A execução do script pára aqui até a requisição retornar do servidor

    res = JSON.parse(xhttp.responseText);
    
    var selectElem = document.getElementById("employees_form_1");
    
    for (i=0; i < res.length; i++) {
        let opt = document.createElement("option");
        opt.value = res[i].id;
        opt.innerHTML = res[i].full_name;
        selectElem.appendChild(opt);
    }
  })


function getHome() {
    window.location.href = "http://localhost:3000/home.html";
}

function getEmployees() {
    window.location.href = "http://localhost:3000/employees.html";
}

function getProjects() {
    window.location.href = "http://localhost:3000/projects.html";
}

function logOut() {
    window.location.href = "http://localhost:3000/index.html";
}

function getProjectList() {
    var url = "http://127.0.0.1:3000/projects/";
    var res;

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, false);
    xhttp.send();//A execução do script pára aqui até a requisição retornar do servidor

    res = JSON.parse(xhttp.responseText);
    
    for (i=0; i < res.length; i++) {
        $("#projDiv").append(
            `<div class="grid-container-2-1-1" onclick=updateForm(${res[i].id})>
                <div class="grid-container-2-1-1-1">
                    ID:<span>${res[i].id}</span>
                </div>
                <div class="grid-container-2-1-1-2">
                    Nome:<span>${res[i].project_name}</span>
                </div>
                <div class="grid-container-2-1-1-3">
                    Início:<span>${res[i].begin_date}</span>
                </div>
                <div class="grid-container-2-1-1-4">
                    Fim:<span>${res[i].finish_date}</span>
                </div>
                <div class="edit-btn">
                    <button onclick=patchProject(${res[i].id})>
                        <span class="icon">
                            <ion-icon name="create-outline"></ion-icon>
                        </span>
                    </button>
                </div>
                <div class="del-btn">
                    <button onclick=delProject(${res[i].id})>
                        <span class="icon">
                            <ion-icon name="trash-outline"></ion-icon>
                        </span>
                    </button>
                </div>`
        );
        document.getElementById('total').innerHTML = res.length;

    }

    document.getElementById("id").innerHTML = res[0].id;
    document.getElementById("project_name").innerHTML = res[0].project_name;
    document.getElementById("begin_date").innerHTML = res[0].begin_date;
    document.getElementById("finish_date").innerHTML = res[0].finish_date;

    let empls_id = ``;
    let empls_time = ``;
    let idAlloc = res[0].id_employees.replace("(", "").replace(")", "").split(",");
    let timeAlloc = res[0].employees_allocated_hours.replace("(", "").replace(")", "").split(",");
    let count = idAlloc.length;
    for (i=0; i < count; i++) {
        empls_id += `<div>${getEmployee(parseInt(idAlloc[i]))}</div>`
        empls_time += `<div>${timeAlloc[i]}h</div>`
    }
    document.getElementById("id_employees").innerHTML = empls_id;
    document.getElementById("employees_allocated_hours").innerHTML = empls_time;

    if (res[0].timeDistribution === 1)  {
        document.getElementById("btnLinear").classList.add("buttonActive");
    }
    if (res[0].timeDistribution === 2)  {
        document.getElementById("btnLogistic").classList.add("buttonActive");
    }
    if (res[0].timeDistribution === 3)  {
        document.getElementById("btnManual").classList.add("buttonActive");
    }

    document.getElementById("owner").innerHTML = res[0].owner;
    document.getElementById("local").innerHTML = res[0].local.replace("(", "").replace(")", "");
}

function getEmployee(id) {
    var url = `http://127.0.0.1:3000/employees/${id}`;
    var res;

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, false);
    xhttp.send();//A execução do script pára aqui até a requisição retornar do servidor

    res = JSON.parse(xhttp.responseText);

    return res[0].full_name;
}

function monthDiff(start, end) {
    return 1 + end.getMonth() - start.getMonth() + (12 * (end.getFullYear() - start.getFullYear()));
}


function getAllocationBoxes() {
    var end = document.getElementById("finish_date_form").value;
    var start = document.getElementById("begin_date_form").value;
    var id = document.getElementById(`id_employees_form_${employeeCount}`)

    let startDate = start.split("-");
    let endDate = end.split("-");

    var d0 = new Date();
    d0.setFullYear(startDate[1], startDate[0]-1, 1);

    var dn = new Date();
    dn.setFullYear(endDate[1], endDate[0]-1, 1);

    var months = monthDiff(d0, dn);

    $("employeeSelection").append(`
        <div class="input-box" id="manualDistrAlloc_${employeeCount}">`
    );

    for (i=0; i < months; i++) {
        $("#employeeSelection").append(
            `<span>Mês ${i+1}:</span>
            <br>
            <input name="id_${employeeCount}_employees_form_${i}" id="id_${employeeCount}_employees_form_${i}" type="text" required style="width: 400px;
            border: 1px solid var(--dark-main-color);
            height: 35px;
            border-radius: 5px;
            margin-top: 6px;">
            <br>`
        );
    }

    $("#employeeSelection").append(
        `<button class="new-item" type="button" onclick="includeNew()">Incluir Novo Funcionário +</button>
        </div>`
    );
}


function distrMethod(event) {
    var method = document.getElementById("timeDistribution").value;
    if (method != 3) {
        document.getElementById("modalBtn").setAttribute( "onclick", "includeNewRegr()")
    }
}


function includeNew() {
    employeeCount++;
    $("#employeeSelection").append(
        `
        <div class="input-box-projects" >
        <span>Nome do funcionário:</span>
        <select name="employees_form_${employeeCount}" id="employees_form_${employeeCount}" type="text" required style="width: 400px;
        border: 1px solid var(--dark-main-color);
        height: 35px;
        border-radius: 5px;
        margin-top: 6px;">
            <option value="">Selecione</option>
        </select>
        <span>Horas alocadas por funcionários:</span>

        <div style="display: flex;">
        <input name="employees_allocated_hours_form_${employeeCount}" id="employees_allocated_hours_form_${employeeCount}" type="text" required>
        <button style="margin-left: -29px;
        width: 30px;
        border-radius: 0 5px 5px 0;
        border: none;
        background-color: var(--dark-main-color);
        color: #fff;
        transition: .3s;
        height: 35px;
        float: right;" onclick="getAllocationBoxes()">></button>
        </div>
        </div>`
    );

    var url = "http://127.0.0.1:3000/employees/";
    var res;

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, false);
    xhttp.send();//A execução do script pára aqui até a requisição retornar do servidor

    res = JSON.parse(xhttp.responseText);
    
    var selectElem = document.getElementById(`employees_form_${employeeCount}`);
    
    for (i=0; i < res.length; i++) {
        let opt = document.createElement("option");
        opt.value = res[i].id;
        opt.innerHTML = res[i].full_name;
        selectElem.appendChild(opt);
    }
}


function includeNewRegr() {
    employeeCount++;
    $("#employeeSelection").append(
        `
        <div class="input-box-projects" >
        <span>Nome do funcionário:</span>
        <select name="employees_form_${employeeCount}" id="employees_form_${employeeCount}" type="text" style="width: 400px;
        border: 1px solid var(--dark-main-color);
        height: 35px;
        border-radius: 5px;
        margin-top: 6px;" required>
            <option value="">Selecione</option>
        </select>
        
        
        <span>Horas alocadas por funcionários:</span>

        
        <input name="employees_allocated_hours_form_${employeeCount}" id="employees_allocated_hours_form_${employeeCount}" type="text" style=" width: 400px;
        border: 1px solid var(--dark-main-color);
        height: 35px;
        border-radius: 5px;" required>
        

        <button class="new-item" type="button" onclick="includeNewRegr()">Incluir Novo Funcionário +</button>
        </div>
        `
    );

    var url = "http://127.0.0.1:3000/employees/";
    var res;

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, false);
    xhttp.send();//A execução do script pára aqui até a requisição retornar do servidor

    res = JSON.parse(xhttp.responseText);
    
    var selectElem = document.getElementById(`employees_form_${employeeCount}`);
    
    for (i=0; i < res.length; i++) {
        let opt = document.createElement("option");
        opt.value = res[i].id;
        opt.innerHTML = res[i].full_name;
        selectElem.appendChild(opt);
    }
}


function getIdEmployees() {
    var tmp = "(";
    for (i=0; i < employeeCount-1; i++) {
        let id = document.getElementById(`employees_form_${i+1}`).value;
        tmp += `${id}, `;
    }
    let id = document.getElementById(`employees_form_${employeeCount}`).value;
        tmp += `${id})`;

    return tmp;
}

function getAllocatedHours() {
    var tmp = "(";
    for (i=0; i < employeeCount-1; i++) {
        let allocHours = document.getElementById(`employees_allocated_hours_form_${i+1}`).value;
        tmp += `${allocHours}, `;
    }
    let allocHours = document.getElementById(`employees_allocated_hours_form_${employeeCount}`).value;
        tmp += `${allocHours})`;
    
    return tmp;
}

function getMonthlyAlloc() {

    var end = document.getElementById("finish_date_form").value;
    var start = document.getElementById("begin_date_form").value;

    let startDate = start.split("-");
    let endDate = end.split("-");

    var d0 = new Date();
    d0.setFullYear(startDate[1], startDate[0]-1, 1);

    var dn = new Date();
    dn.setFullYear(endDate[1], endDate[0]-1, 1);

    var months = monthDiff(d0, dn);


    var tmp = "[[";
    for (i=1; i <= employeeCount; i++) {
        for (j=0; j < months; j++) {
            var aux = document.getElementById(`id_${i}_employees_form_${j}`).value;
            tmp += `${aux}, `;            
        }
        var aux1 = document.getElementById(`id_${i}_employees_form_${months-1}`).value;
        tmp += `${aux1}`;            
        tmp += `], [`;
    }
    tmp = tmp.substring(0, tmp.length-4);
    tmp += "]]";
    return tmp;
}


function postProject() {
    var project_name = document.getElementById("project_name_form").value;
    console.log(project_name);
    var owner = document.getElementById("owner_form").value;
    console.log(owner);
    var begin_date = document.getElementById("begin_date_form").value;
    console.log(begin_date);
    var finish_date = document.getElementById("finish_date_form").value;
    console.log(finish_date);
    var timeDistribution = document.getElementById("timeDistribution").value;
    console.log(timeDistribution);
    var id_employees = getIdEmployees();
    console.log(id_employees);
    var employees_allocated_hours = getAllocatedHours();
    console.log(employees_allocated_hours);
    var local = document.getElementById("local_form").value;
    console.log(local);
    var monthlyAlloc;
    if (timeDistribution == 3) {
        monthlyAlloc = getMonthlyAlloc();
    } else {
        monthlyAlloc = 0;
    }
    console.log(monthlyAlloc);
    
    var url = "http://127.0.0.1:3000/projects/";

    $.ajax({
        type: "POST",
        url: url,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(
            {
                "project_name": project_name,
                "owner": owner,
                "begin_date": begin_date,
                "finish_date": finish_date,
                "id_employees": id_employees,
                "employees_allocated_hours": employees_allocated_hours,
                "local": local,
                "timeDistribution": timeDistribution,
                "monthlyAlloc": monthlyAlloc,
                "isActive": 1
            }
        )
    });

    employeeCount = 1;
}

$( function() {
    $( "#begin_date_form" ).datepicker();
    $( "#begin_date_form" ).on( "change", function() {
      $( "#begin_date_form" ).datepicker( "option", "dateFormat", "mm-yy" );
    });
  } );
$( function() {
    $( "#finish_date_form" ).datepicker();
    $( "#finish_date_form" ).on( "change", function() {
      $( "#finish_date_form" ).datepicker( "option", "dateFormat", "mm-yy" );
    });
  } );


function delProject(id) {
    var url = `http://127.0.0.1:3000/projects/${id}`;

    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", url, false);
    xhttp.send();//A execução do script pára aqui até a requisição retornar do servidor

    window.location.href = window.location.href;
}


function patchProject(id) {
    var url = `http://127.0.0.1:3000/projects/${id}`;
    var res;
  
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, false);
    xhttp.send(); //A execução do script pára aqui até a requisição retornar do servidor
  
    res = JSON.parse(xhttp.responseText);
  
    document.getElementById("project_name_form_2").value = res[0].project_name;
    document.getElementById("owner_form_2").value = res[0].owner;
    document.getElementById("local_form_2").value = res[0].local;
  
    document
      .getElementById("patchButton")
      .setAttribute("onClick", `javascript: patchProjectII(${id})`);
  
    var patchModal = new bootstrap.Modal(document.getElementById("patchModal"), {
      keyboard: false,
    });
    patchModal.show();
  }
  
  function patchProjectII(id) {
    var project_name = document.getElementById("project_name_form_2").value;
    var owner = document.getElementById("owner_form_2").value;
    var local = document.getElementById("local_form_2").value;
  
    var url = "http://127.0.0.1:3000/projects/" + id;
  
    $.ajax({
      type: "PATCH",
      url: url,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify({
        project_name: project_name,
        owner: owner,
        local: local,
      }),
      success: function (res) {
        console.log(res);
      },
    });
  }


function updateForm(id) {
    var url = `http://127.0.0.1:3000/projects/${id}`;
    var res;

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, false);
    xhttp.send();//A execução do script pára aqui até a requisição retornar do servidor

    res = JSON.parse(xhttp.responseText);

    document.getElementById("id").innerHTML = res[0].id;
    document.getElementById("project_name").innerHTML = res[0].project_name;
    document.getElementById("begin_date").innerHTML = res[0].begin_date;
    document.getElementById("finish_date").innerHTML = res[0].finish_date;

    let empls_id = ``;
    let empls_time = ``;
    let idAlloc = res[0].id_employees.replace("(", "").replace(")", "").split(",");
    let timeAlloc = res[0].employees_allocated_hours.replace("(", "").replace(")", "").split(",");
    let count = idAlloc.length;
    for (i=0; i < count; i++) {
        empls_id += `<div>${getEmployee(parseInt(idAlloc[i]))}</div>`
        empls_time += `<div>${timeAlloc[i]}h</div>`
    }
    document.getElementById("id_employees").innerHTML = empls_id;
    document.getElementById("employees_allocated_hours").innerHTML = empls_time;

    document.getElementById("btnLinear").classList.remove("buttonActive");
    document.getElementById("btnLogistic").classList.remove("buttonActive");
    document.getElementById("btnManual").classList.remove("buttonActive");

    if (res[0].timeDistribution === 1)  {
        document.getElementById("btnLinear").classList.add("buttonActive");
    }
    if (res[0].timeDistribution === 2)  {
        document.getElementById("btnLogistic").classList.add("buttonActive");
    }
    if (res[0].timeDistribution === 3)  {
        document.getElementById("btnManual").classList.add("buttonActive");
    }

    document.getElementById("owner").innerHTML = res[0].owner;
    document.getElementById("local").innerHTML = res[0].local.replace("(", "").replace(")", "");
}
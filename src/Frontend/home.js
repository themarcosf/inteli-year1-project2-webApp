document.addEventListener(
    "DOMContentLoaded",
    () => {
      getDashboard();
    },
    false
  );


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

  
var json = getDashboard();
function getDashboard() {
    var url = "http://127.0.0.1:3000/dashboard/";
    var res;
  
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, false);
    xhttp.send(); //A execução do script pára aqui até a requisição retornar do servidor
  
    res = JSON.parse(xhttp.responseText);

    return res;
}


function changeGetHttp(res) {
    var keys = [];
    var values = [];

    for (let i in res[0]) {
      keys.push(i);
    }
    keys.unshift(keys.pop());
    
    Object.entries(res[0]).forEach(([key, value]) => {
    values.push(`${value}`);
    });
    values.unshift(values.pop());
    
    return [keys, values];
}
    
    
function calculate_months(res) {
    for (let i=0; i < res.length; i++) {
        res[i] = `${res[i].substring(4, 7)}-${res[i].substring(11, 15)}`;
    }
    return res;
}


function calculate_hours(hours, res) {
    var tmp = [];
    var labels = calculate_months(changeGetHttp(res)[0]);
    var array = '[';

    for (let i=0; i <= labels.length; i++) {
        tmp.push(res[1][hours]);
        if (i == labels.length) {
            array += res[1][hours] + ']'
        } else {
            array += res[1][hours] + ','
        }
    }
    return tmp;
}

function monthConverter(res) {
    var tmp = changeGetHttp(res)[1];
    for (let i=0; i < tmp.length; i++) {
        tmp[i] = parseInt(tmp[i]);
    }
    return tmp;
  }

const ctx = document.getElementById('myChart').getContext('2d');
const ctx2 = document.getElementById('myChart2').getContext('2d');

console.log(ctx)
console.log(ctx2)
let delayed;

// begin of EXHAUSTION CHART
let gradient = ctx.createLinearGradient(0, 0, 0, 400);
gradient.addColorStop(0, "rgb(1, 1, 1) ");
gradient.addColorStop(1, "rgba(0, 100, 255, .3)")

const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        type: 'line',
        labels: calculate_months(changeGetHttp(json)[0]),
        
        datasets: [{
        label: 'Limite Legal',
            type: 'line',
            data: calculate_hours("legal_hours", json),
            backgroundColor: "#D30417",
            fill: false,
            borderColor: '#D30417',
            pointBackgroundColor: "rgba(0,0,0,0)",
            pointBorderColor: "rgba(0,0,0,0)",

        },
        {
            label: 'Limite Total',
                type: 'line',
                data: calculate_hours("total_hours", json),
                backgroundColor: "#000",
                fill: false,
                borderColor: '#000',
                pointBackgroundColor: "rgba(0,0,0,0)",
                pointBorderColor: "rgba(0,0,0,0)"
               
        },
        {
            label: 'Limite funcional',
                type: 'line',
                data: calculate_hours("allocated_hours", json),
                backgroundColor: '#003e9f',
                fill: false,
                borderColor: '#003e9f',
                pointBackgroundColor: "rgba(0,0,0,0)",
                pointBorderColor: "rgba(0,0,0,0)"
               
        },
        {
        label: 'Horas Alocadas',
            data: monthConverter(json),
            backgroundColor: [
                '#fff',
            ],
            borderColor: "#fff",
            fill: true,
            hitRadius: 30,
            hoverRadius: 5,
            backgroundColor: gradient,
            pointBackgroundColor: "rgb(255,255,255)",
            pointBorderColor: "rgb(200,200,200)"
        }]
    },
    options: {
       responsive: true,
       animation: {
        onComplete: () => {
            delayed = true;
        },
        delay: (context) => {
            let delay = 0;
            if (context.type === "data" && context.mode === "default" && !delayed){
                delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
        },
       },
       scales: {
        y:{
            ticks:{
                callback: function (value) {
                    return  value + "h";
                },
            },
        },
       },
    },
    
});
//end of EXHAUSTION CHART

//begin of SECOND CHART
const myChart2 = new Chart(ctx2, {
    type: 'bar',
    data: {
        labels: calculate_months(changeGetHttp(json)[0]),
        datasets: [{
            label: 'Horas Necessárias Por Projetos',
            data: monthConverter(json),
            backgroundColor: [
                'rgba(54,120,230,1)',
            ],
            backgroundColor: gradient,
        }]
        
    },
    options: {
       responsive: true,
       animation: {
        onComplete: () => {
            delayed = true;
        },
        delay: (context) => {
            let delay = 0;
            if (context.type === "data" && context.mode === "default" && !delayed){
                delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
        },
       },
    },          
});
//end of SECOND CHART
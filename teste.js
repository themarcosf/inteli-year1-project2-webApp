var a = [
  {
      "Fri Jul 01 2022 19:56:53 GMT-0300 (Brasilia Standard Time)": 273,
      "Mon Aug 01 2022 19:56:53 GMT-0300 (Brasilia Standard Time)": 228.5,
      "Thu Sep 01 2022 19:56:53 GMT-0300 (Brasilia Standard Time)": 156.75,
      "Sat Oct 01 2022 19:56:53 GMT-0300 (Brasilia Standard Time)": 159.5,
      "Tue Nov 01 2022 19:56:53 GMT-0300 (Brasilia Standard Time)": 127,
      "Thu Dec 01 2022 19:56:53 GMT-0300 (Brasilia Standard Time)": 180.75,
      "Sun Jan 01 2023 19:56:53 GMT-0300 (Brasilia Standard Time)": 140.25,
      "Wed Feb 01 2023 19:56:53 GMT-0300 (Brasilia Standard Time)": 117.5,
      "Wed Mar 01 2023 19:56:53 GMT-0300 (Brasilia Standard Time)": 8.25,
      "Sat Apr 01 2023 19:56:53 GMT-0300 (Brasilia Standard Time)": 5.5,
      "Wed Jun 01 2022 19:56:53 GMT-0300 (Brasilia Standard Time)": 218
  },
  {
      "legal_hours": 704,
      "total_hours": 550,
      "allocated_hours": 365
  }
];

function changeGetHttp(a) {
  
var arry = []
for (let i in a[0]) {
  arry.push(i);
}

arry.unshift(arry.pop());

var tmp = [];
Object.entries(a[0]).forEach(([key, value]) => {
tmp.push(`${value}`);
});

tmp.unshift(tmp.pop());


var final = [arry, tmp];


return final;
}




function calculate_months(a) {
  
  for (let i=0; i < a.length; i++) {
    a[i] = `${a[i].substring(4, 7)}-${a[i].substring(11, 15)}`;
  }

  return a;
}


function calculate_capacity(a) {
  
  for (let i=0; i < a.length; i++) {
    a[i] = `${a[i].substring(4, 7)}-${a[i].substring(11, 15)}`;
  }

  return a;
}
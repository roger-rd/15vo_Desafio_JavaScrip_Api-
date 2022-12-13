const formulario = document.querySelector('#formulario')
const inputNumber = document.querySelector('#inputNumber')
const selectCurrency = document.querySelector('#selectCurrency');
const btnBuscar = document.querySelector('#btnBuscar');
const resultCurrency = document.querySelector('#resultCurrency');
const apiURL = "https://mindicador.cl/api";
const ctx = document.querySelector('#myChart');

const getMindicador = async () => {
    try {
        const res = await fetch(apiURL);
        const data = await res.json();   
        resultCurrency.innerHTML =`Resultado: $ ${Number(( inputNumber.value / data[selectCurrency.value].valor).toFixed(2))} `
    } catch (error) {
        alert(error);
    }
};

formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    if (inputNumber.value <= 0  || selectCurrency.value =="") {
        resultCurrency.innerHTML=`<h4>Ingrese un monto o moneda a convertir</h4>`;
        return ; 
    }else{
        getMindicador();
        renderChart(selectCurrency.value); 
    }
    
});

let grafico;
const renderChart = async (selectCurrency )  =>{
    const respuesta = await fetch(`https://mindicador.cl/api/${selectCurrency}`);
    const data = await respuesta.json();
    const arrayResultados = data.serie.slice(0,10).reverse();
    const labels = arrayResultados.map(item => item.fecha.split("T")[0].split("-").reverse().join("-"));
    const dataCurrency = arrayResultados.map(item => item.valor);

    if(grafico){
        grafico.destroy();
    }

    grafico = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
            label: [`Historial ultimos 10 dias de ${selectCurrency.toUpperCase()}`],
            data: dataCurrency,
            borderWidth: 1
            }]
        },
        });
}


const formulario = document.querySelector('#formulario');
const moneda = document.querySelector('#moneda');
const criptomonedaSelect = document.querySelector('#criptomonedas')
const resultado = document.querySelector('#resultado')

const cargarMonedas = async () => {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=15&tsym=USD'
    
    try {
        const respuesta = await fetch(url)
        const criptomoneda = await respuesta.json()
        const selectCript = selectCriptomonedas(criptomoneda.Data)
        selectCriptomonedas(selectCript)
    } catch (error) {
        console.log(error)
    }
}

const selectCriptomonedas = (criptomoneda) => {
    criptomoneda.forEach(cripto => {
        const {FullName,Name} = cripto.CoinInfo
        
        const option = document.createElement('option')
        option.value = Name;
        option.textContent = FullName;
        criptomonedaSelect.appendChild(option)
    })
}

const validarForm = (e) => {
    e.preventDefault()

    if (moneda.value === '' || criptomonedaSelect.value === '') {
        return mostrarAlerta('Ambos campos son obligatorios')
    }
    
    consultarResultado(moneda.value, criptomonedaSelect.value)
}

const consultarResultado = async(moneda,criptomoneda) => {
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${moneda}&tsyms=${criptomoneda}`;
    spinner()
    /*
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(cotizacion =>{ 
            mostrarHtml(cotizacion.DISPLAY[moneda][criptomoneda])
        })
*/
    try {
        const respuesta = await fetch(url)
        const cotizacion = await respuesta.json()
        mostrarHtml(cotizacion.DISPLAY[moneda][criptomoneda])
    } catch (error) {
        console.log(error)
    }
        
}

const mostrarHtml = (cotizacion) => {
    limpiarHtml()
    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `Precio mas alto del dia: <span>${HIGHDAY}</span>`

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `Precio mas bajo del dia: <span>${LOWDAY}</span>`

    const ultimaHora = document.createElement('p');
    ultimaHora.innerHTML = `Variacion ultimas 24 horas: <span>${CHANGEPCT24HOUR}</span>`

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `Ultima actualizacion: <span>${LASTUPDATE}</span>`

    resultado.appendChild(precio)
    resultado.appendChild(precioAlto)
    resultado.appendChild(precioBajo)
    resultado.appendChild(ultimaHora)
    resultado.appendChild(ultimaActualizacion)
}

const mostrarAlerta = (mensaje) => {
    const existeError = document.querySelector('.error');
    
    if (!existeError) {
        limpiarHtml()
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('error')

        divMensaje.textContent = mensaje
        formulario.appendChild(divMensaje)

        setTimeout(()=>{
            divMensaje.remove()
        },2500)
    }
}

const spinner = () => {
    limpiarHtml()

    const divSpinner = document.createElement('div');
    divSpinner.classList.add('spinner');

    divSpinner.innerHTML = `
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
    `
    resultado.appendChild(divSpinner)
}


const limpiarHtml= () => {
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}
formulario.addEventListener('submit', validarForm)
document.addEventListener('DOMContentLoaded', cargarMonedas)

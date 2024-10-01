// Clases de Vehículo, Terrestre y Aéreo
class Vehiculo {
    constructor(id, modelo, anoFab, velMax) {
        this.id = id;
        this.modelo = modelo;
        this.anoFab = anoFab;
        this.velMax = velMax;
    }
}

class Terrestre extends Vehiculo {
    constructor(id, modelo, anoFab, velMax, cantPue, cantRue) {
        super(id, modelo, anoFab, velMax);
        this.cantPue = cantPue;
        this.cantRue = cantRue;
    }
}

class Aereo extends Vehiculo {
    constructor(id, modelo, anoFab, velMax, altMax, autonomia) {
        super(id, modelo, anoFab, velMax);
        this.altMax = altMax;
        this.autonomia = autonomia;
    }
}

// Cadena JSON 
const data = '[{"id":14, "modelo":"Ferrari F100", "anoFab":1998, "velMax":400, "cantPue":2, "cantRue":4},{"id":51, "modelo":"Dodge Viper", "anoFab":1991, "velMax":266, "cantPue":2, "cantRue":4},{"id":67, "modelo":"Boeing CH-47 Chinook", "anoFab":1962, "velMax":302, "altMax":6, "autonomia":1200},{"id":666, "modelo":"Aprilia RSV 1000 R", "anoFab":2004, "velMax":280, "cantPue":0, "cantRue":2},{"id":872, "modelo":"Boeing 747-400", "anoFab":1989, "velMax":988, "altMax":13, "autonomia":13450},{"id":742, "modelo":"Cessna CH-1 Skyhook", "anoFab":1953, "velMax":174, "altMax":3, "autonomia":870}]';

// Parsear JSON 
const objetos = JSON.parse(data);

// Convertir los objetos JSON
const vehiculos = objetos.map(obj => {
    if (obj.altMax !== undefined) {
        return new Aereo(obj.id, obj.modelo, obj.anoFab, obj.velMax, obj.altMax, obj.autonomia);
    } else {
        return new Terrestre(obj.id, obj.modelo, obj.anoFab, obj.velMax, obj.cantPue, obj.cantRue);
    }
});

// Mostrar datos en la tabla
function mostrarDatos(vehiculos) {
    const tableBody = document.querySelector('#tabla-datos tbody');
    tableBody.innerHTML = ''; // Limpiar la tabla

    vehiculos.forEach(vehiculo => {
        const row = document.createElement('tr'); // Crear una fila

        row.innerHTML = `
            <td>${vehiculo.id}</td>
            <td>${vehiculo.modelo}</td>
            <td>${vehiculo.anoFab}</td>
            <td>${vehiculo.velMax}</td>
            <td>${vehiculo instanceof Terrestre ? 
                 `Puertas: ${vehiculo.cantPue}, Ruedas: ${vehiculo.cantRue}` : 
                 `Altitud Máxima: ${vehiculo.altMax}, Autonomía: ${vehiculo.autonomia}`}</td>
        `;

        tableBody.appendChild(row);
    });
}

// Calcular velocidad promedio
function calcularVelocidadPromedio(vehiculos) {
    const velocidades = vehiculos.map(vehiculo => vehiculo.velMax); // Obtener las velocidades máximas
    const totalVelocidad = velocidades.reduce((acc, vel) => acc + vel, 0); // Sumar las velocidades
    return (totalVelocidad / velocidades.length).toFixed(2); // Calcular el promedio y limitar a dos decimales
}

// Evento Calcular
document.querySelector('#calcular').addEventListener('click', () => {
    const filtro = document.querySelector('#filtro').value; // Obtener el valor del filtro seleccionado

    let vehiculosFiltrados;
    if (filtro === 'terrestre') {
        vehiculosFiltrados = vehiculos.filter(vehiculo => vehiculo instanceof Terrestre);
    } else if (filtro === 'aereo') {
        vehiculosFiltrados = vehiculos.filter(vehiculo => vehiculo instanceof Aereo);
    } else {
        vehiculosFiltrados = vehiculos;
    }

    // Promedio y mostrarlo
    const promedio = calcularVelocidadPromedio(vehiculosFiltrados);
    document.getElementById('resultado').innerText = `Velocidad Máxima Promedio: ${promedio} km/h`;
});

// Mostrar los datos al cargar la página
mostrarDatos(vehiculos);

// Filtrar los vehículos según el tipo seleccionado en el filtro
document.querySelector('#filtro').addEventListener('change', (event) => {
    const filtro = event.target.value; // Obtener el valor del filtro seleccionado

    let vehiculosFiltrados;
    if (filtro === 'terrestre') {
        vehiculosFiltrados = vehiculos.filter(vehiculo => vehiculo instanceof Terrestre);
    } else if (filtro === 'aereo') {
        vehiculosFiltrados = vehiculos.filter(vehiculo => vehiculo instanceof Aereo);
    } else {
        vehiculosFiltrados = vehiculos;
    }

    mostrarDatos(vehiculosFiltrados); // Mostrar los vehículos filtrados en la tabla
});

// Referencias a elementos del DOM
const formABM = document.getElementById('formulario-abm');
const formDatos = document.getElementById('tabla-datos'); // La tabla que contiene los datos

// Función para mostrar el formulario y ocultar la tabla
function mostrarFormulario(vehiculo) {
    formABM.style.display = 'block'; // Mostrar el formulario
    formDatos.style.display = 'none'; // Ocultar la tabla

    // Rellenar los campos del formulario si es un vehículo existente
    if (vehiculo) {
        document.getElementById('id').value = vehiculo.id;
        document.getElementById('modelo').value = vehiculo.modelo;
        document.getElementById('anoFab').value = vehiculo.anoFab;
        document.getElementById('velMax').value = vehiculo.velMax;

        // Mostrar los campos correspondientes según el tipo de vehículo
        if (vehiculo instanceof Terrestre) {
            document.getElementById('terrestre-fields').style.display = 'block';
            document.getElementById('aereo-fields').style.display = 'none';
            document.getElementById('cantPue').value = vehiculo.cantPue;
            document.getElementById('cantRue').value = vehiculo.cantRue;
        } else if (vehiculo instanceof Aereo) {
            document.getElementById('terrestre-fields').style.display = 'none';
            document.getElementById('aereo-fields').style.display = 'block';
            document.getElementById('altMax').value = vehiculo.altMax;
            document.getElementById('autonomia').value = vehiculo.autonomia;
        }
    } else {
        // Si es un nuevo vehículo, limpiar los campos
        document.getElementById('vehiculo-form').reset();
        document.getElementById('id').value = ''; // ID vacío para un nuevo vehículo
        document.getElementById('terrestre-fields').style.display = 'none';
        document.getElementById('aereo-fields').style.display = 'none';
    }
}

// Mostrar el formulario al hacer clic en "Agregar Nuevo Vehículo"
document.getElementById('nuevo-vehiculo').addEventListener('click', () => {
    mostrarFormulario(null); // Llamar a la función para mostrar el formulario vacío
});

// Cancelar el formulario
document.getElementById('cancelar').addEventListener('click', () => {
    formABM.style.display = 'none'; // Ocultar el formulario
    formDatos.style.display = 'block'; // Mostrar la tabla
});

// Guardar el vehículo al enviar el formulario
document.getElementById('vehiculo-form').addEventListener('submit', (event) => {
    event.preventDefault(); 

    const id = document.getElementById('id').value || Date.now(); // Generar un ID único si es nuevo
    const modelo = document.getElementById('modelo').value;
    const anoFab = document.getElementById('anoFab').value;
    const velMax = document.getElementById('velMax').value;
    const tipoVehiculo = document.getElementById('tipoVehiculo').value;

    let nuevoVehiculo;

    // Crear un nuevo objeto Vehículo según el tipo seleccionado
    if (tipoVehiculo === 'terrestre') {
        const cantPue = document.getElementById('cantPue').value;
        const cantRue = document.getElementById('cantRue').value;
        nuevoVehiculo = new Terrestre(id, modelo, anoFab, velMax, cantPue, cantRue);
    } else {
        const altMax = document.getElementById('altMax').value;
        const autonomia = document.getElementById('autonomia').value;
        nuevoVehiculo = new Aereo(id, modelo, anoFab, velMax, altMax, autonomia);
    }

    // Agregar el nuevo vehículo al array y mostrarlo en la tabla
    vehiculos.push(nuevoVehiculo);
    mostrarDatos(vehiculos); 
    formABM.style.display = 'none'; 
        formDatos.style.display = 'block'; 
});


document.getElementById('tipoVehiculo').addEventListener('change', (event) => {
    const tipo = event.target.value;
    document.getElementById('terrestre-fields').style.display = tipo === 'terrestre' ? 'block' : 'none';
    document.getElementById('aereo-fields').style.display = tipo === 'aereo' ? 'block' : 'none';
});

const API_URL = 'https://vehiculos-backend.onrender.com'; // Cambia esto a la URL real de tu backend

// Función para cargar vehículos
async function cargarVehiculos() {
    try {
        console.log('Intentando cargar vehículos desde:', API_URL);
        
        const response = await fetch(`${API_URL}/api/vehiculos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Respuesta del servidor:', response);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error en la respuesta:', errorText);
            throw new Error(`HTTP error! status: ${response.status}. ${errorText}`);
        }

        const vehiculos = await response.json();
        console.log('Vehículos recibidos:', vehiculos);

        const tableBody = document.getElementById('vehicleTableBody');
        
        // Limpiar tabla antes de cargar
        tableBody.innerHTML = '';

        if (vehiculos.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="4">No hay vehículos registrados</td>`;
            tableBody.appendChild(row);
            return;
        }

        vehiculos.forEach(vehiculo => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${vehiculo.patente}</td>
                <td>${vehiculo.marca}</td>
                <td>${vehiculo.modelo}</td>
                <td>
                    <button onclick="eliminarVehiculo('${vehiculo.patente}')" class="btn btn-primary">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error detallado al cargar vehículos:', error);
        
        const tableBody = document.getElementById('vehicleTableBody');
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="4">Error al cargar vehículos: ${error.message}</td>`;
        tableBody.innerHTML = '';
        tableBody.appendChild(row);
    }
}

// Función para eliminar vehículo
async function eliminarVehiculo(patente) {
    try {
        const response = await fetch(`${API_URL}/api/vehiculos/${patente}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.mensaje || 'Error al eliminar vehículo');
        }

        alert('Vehículo eliminado exitosamente');
        cargarVehiculos(); // Recargar tabla
    } catch (error) {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    }
}

// Event listener para el formulario de ingreso
document.getElementById('vehicleForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const patente = document.getElementById('patente').value;
    const marca = document.getElementById('marca').value;
    const modelo = document.getElementById('modelo').value;

    // Validación básica
    if (!patente || !marca || !modelo) {
        alert('Por favor, complete todos los campos');
        return;
    }

    const vehicleData = { patente, marca, modelo };

    try {
        const response = await fetch(`${API_URL}/api/vehiculos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(vehicleData)
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.mensaje || 'Error al guardar el vehículo');
        }

        alert('Vehículo guardado exitosamente!');
        this.reset(); // Resetea el formulario
        cargarVehiculos(); // Recargar tabla
    } catch (error) {
        alert('Error: ' + error.message);
        console.error('Error:', error);
    }
});

// Cargar vehículos al inicio
document.addEventListener('DOMContentLoaded', cargarVehiculos);
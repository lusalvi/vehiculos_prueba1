const API_URL = 'https://vehiculos-backend.onrender.com'; // Ajusta según tu despliegue

// Función para cargar vehículos
async function cargarVehiculos() {
    try {
        const response = await fetch(`${API_URL}/api/vehiculos`);
        const vehiculos = await response.json();
        const tableBody = document.getElementById('vehicleTableBody');
        
        // Limpiar tabla antes de cargar
        tableBody.innerHTML = '';

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
        console.error('Error al cargar vehículos:', error);
        alert('Error al cargar vehículos');
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
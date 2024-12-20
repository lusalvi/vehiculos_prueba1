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
                    <button onclick="iniciarEdicionVehiculo('${vehiculo.patente}', '${vehiculo.marca}', '${vehiculo.modelo}')" class="btn btn-primary">Editar</button>
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

// Función para iniciar la edición de un vehículo
function iniciarEdicionVehiculo(patente, marca, modelo) {
    // Llenar el formulario con los datos del vehículo
    document.getElementById('patente').value = patente;
    document.getElementById('marca').value = marca;
    document.getElementById('modelo').value = modelo;

    // Cambiar el texto del botón de guardar
    const submitButton = document.querySelector('#vehicleForm .btn');
    submitButton.textContent = 'Actualizar';
    submitButton.classList.add('editing');
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

    // Verificar si estamos en modo edición
    const isEditing = this.querySelector('.btn').classList.contains('editing');

    try {
        let response;
        if (isEditing) {
            // Lógica para actualizar vehículo
            response = await fetch(`${API_URL}/api/vehiculos/${patente}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ patente, marca, modelo })
            });
        } else {
            // Lógica para crear nuevo vehículo
            response = await fetch(`${API_URL}/api/vehiculos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ patente, marca, modelo })
            });
        }

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.mensaje || 'Error al guardar el vehículo');
        }

        alert(isEditing ? 'Vehículo actualizado exitosamente!' : 'Vehículo guardado exitosamente!');
        this.reset(); // Resetea el formulario
        
        // Restaurar botón de guardar
        const submitButton = this.querySelector('.btn');
        submitButton.textContent = 'Guardar';
        submitButton.classList.remove('editing');

        cargarVehiculos(); // Recargar tabla
    } catch (error) {
        alert('Error: ' + error.message);
        console.error('Error:', error);
    }
});

// Cargar vehículos al inicio
document.addEventListener('DOMContentLoaded', cargarVehiculos);
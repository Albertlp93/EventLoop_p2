import * as almacenaje from '../../shared/js/almacenaje.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Inicialización
    actualizarNavbar();
    pintarTablaUsuarios();

    const userForm = document.getElementById('userForm');
    const logoutBtn = document.getElementById('logoutButton');

    // 2. Evento de Alta de Usuario
    userForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Captura de datos
        const nuevoUsuario = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('emailUser').value,
            password: document.getElementById('passUser').value
        };

        try {
            // Llamada asíncrona (Requisito nota máxima)
            await almacenaje.guardarUsuario(nuevoUsuario);
            alert("Usuario registrado con éxito");
            userForm.reset();
            pintarTablaUsuarios(); // Actualización dinámica
        } catch (error) {
            alert("Error: " + error);
        }
    });

    // 3. Evento Cerrar Sesión
    logoutBtn.addEventListener('click', () => {
        almacenaje.cerrarSesion();
        window.location.href = '../login/index.html';
    });
});

/**
 * Función para renderizar la tabla de usuarios desde IndexedDB
 */
async function pintarTablaUsuarios() {
    const tbody = document.getElementById('tablaUsuariosBody');
    tbody.innerHTML = ''; // Limpiar antes de pintar

    try {
        const usuarios = await almacenaje.obtenerUsuarios();
        
        usuarios.forEach(u => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${u.nombre}</td>
                <td>${u.email}</td>
                <td>••••••</td>
                <td>
                    <button class="btn btn-danger btn-sm btn-borrar" data-email="${u.email}">
                        Borrar
                    </button>
                </td>
            `;
            tbody.appendChild(fila);
        });

        // Asignar eventos a los botones de borrar creados
        document.querySelectorAll('.btn-borrar').forEach(boton => {
            boton.addEventListener('click', async (e) => {
                const emailABorrar = e.target.getAttribute('data-email');
                if (confirm(`¿Seguro que quieres borrar a ${emailABorrar}?`)) {
                    await almacenaje.borrarUsuario(emailABorrar);
                    pintarTablaUsuarios(); // Refrescar tabla
                }
            });
        });

    } catch (error) {
        console.error(error);
    }
}

function actualizarNavbar() {
    const display = document.getElementById('usuarioActivo');
    const logoutBtn = document.getElementById('logoutButton');
    const user = almacenaje.obtenerUsuarioActivo();

    if (user) {
        display.textContent = user;
        // QUITAMOS el gris y PONEMOS el verde (igual que en login)
        display.classList.remove('bg-secondary');
        display.classList.add('bg-success');
        
        logoutBtn.classList.remove('d-none');
    } else {
        display.textContent = "-no login-";
        // VOLVEMOS al gris si no hay nadie
        display.classList.remove('bg-success');
        display.classList.add('bg-secondary');
        
        logoutBtn.classList.add('d-none');
    }
}
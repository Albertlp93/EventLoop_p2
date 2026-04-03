import * as almacenaje from '../../shared/js/almacenaje.js';

document.addEventListener('DOMContentLoaded', async () => {
    actualizarNavbar();
    await cargarTarjetas();

    const origen = document.getElementById('contenedorOrigen');
    const destino = document.getElementById('contenedorDestino');

    // Configurar zonas de drop
    [origen, destino].forEach(zona => {
        zona.addEventListener('dragover', (e) => {
            e.preventDefault(); // Necesario para permitir el drop
            zona.classList.add('dragover');
        });

        zona.addEventListener('dragleave', () => {
            zona.classList.remove('dragover');
        });

        zona.addEventListener('drop', (e) => {
            e.preventDefault();
            zona.classList.remove('dragover');
            const idTarjeta = e.dataTransfer.getData('text/plain');
            const tarjeta = document.getElementById(idTarjeta);
            if (tarjeta) {
                zona.appendChild(tarjeta);
                console.log(`Tarjeta ${idTarjeta} movida a ${zona.id}`);
            }
        });
    });
});

async function cargarTarjetas() {
    const contenedor = document.getElementById('contenedorOrigen');
    const datos = await almacenaje.obtenerVoluntariados();
    
    contenedor.innerHTML = '';
    
    datos.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card card-draggable mb-3 shadow-sm';
        card.id = `card-${item.id}`;
        card.draggable = true; // Requisito API Drag & Drop
        
        card.innerHTML = `
            <div class="card-body">
                <h6 class="card-title">${item.titulo}</h6>
                <p class="small text-muted mb-0">${item.tipo} - ${item.email}</p>
            </div>
        `;

        // Evento cuando empezamos a arrastrar
        card.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', card.id);
            card.style.opacity = '0.5';
        });

        card.addEventListener('dragend', () => {
            card.style.opacity = '1';
        });

        contenedor.appendChild(card);
    });
}

function actualizarNavbar() {
    const display = document.getElementById('usuarioActivo');
    const user = almacenaje.obtenerUsuarioActivo();
    if (user) {
        display.textContent = user;
        display.className = 'badge bg-success me-3';
        document.getElementById('logoutButton').classList.remove('d-none');
    }
}
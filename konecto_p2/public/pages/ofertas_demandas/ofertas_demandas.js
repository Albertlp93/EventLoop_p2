import * as almacenaje from '../../shared/js/almacenaje.js';

document.addEventListener('DOMContentLoaded', async () => {
    actualizarNavbar();
    await refrescarVista();

    const form = document.getElementById('formEmpleo');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const datos = {
            titulo: document.getElementById('titulo').value,
            email: document.getElementById('emailE').value,
            fecha: document.getElementById('fecha').value,
            descripcion: document.getElementById('desc').value,
            tipo: document.getElementById('tipo').value
        };
        await almacenaje.guardarVoluntariado(datos);
        form.reset();
        await refrescarVista();
    });
});

async function refrescarVista() {
    const empleos = await almacenaje.obtenerVoluntariados();
    pintarTabla(empleos);
    generarGraficoNativo(empleos);
}

function pintarTabla(lista) {
    const body = document.getElementById('tablaEmpleosBody');
    body.innerHTML = '';
    lista.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.titulo}</td>
            <td>${item.email}</td>
            <td><span class="badge ${item.tipo === 'Oferta' ? 'bg-primary' : 'bg-warning'}">${item.tipo}</span></td>
            <td><button class="btn btn-danger btn-sm" onclick="borrar(${item.id})">Borrar</button></td>
        `;
        // Nota: El botón borrar necesita que la función sea global o añadir eventListener
        tr.querySelector('button').addEventListener('click', async () => {
            await almacenaje.borrarVoluntariado(item.id);
            await refrescarVista();
        });
        body.appendChild(tr);
    });
}

/**
 * Función que dibuja en el Canvas de forma nativa
 */
function generarGraficoNativo(lista) {
    const canvas = document.getElementById('graficoEmpleos');
    const ctx = canvas.getContext('2d');
    
    const ofertas = lista.filter(i => i.tipo === 'Oferta').length;
    const demandas = lista.filter(i => i.tipo === 'Demanda').length;
    const total = ofertas + demandas || 1; // Evitar división por cero

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar barra de Ofertas
    ctx.fillStyle = '#0d6efd';
    const hOfe = (ofertas / total) * 150;
    ctx.fillRect(50, 180 - hOfe, 40, hOfe);
    ctx.fillText("Ofert.", 50, 195);

    // Dibujar barra de Demandas
    ctx.fillStyle = '#ffc107';
    const hDem = (demandas / total) * 150;
    ctx.fillRect(150, 180 - hDem, 40, hDem);
    ctx.fillText("Demand.", 150, 195);
    
    ctx.fillStyle = '#000';
    ctx.fillText(`Total: ${lista.length}`, 100, 20);
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
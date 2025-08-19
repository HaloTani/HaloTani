// URL Web App Google Apps Script Anda (GANTI dengan URL Anda sendiri)
const SHEET_SCRIPT_URL = 'https://script.google.com/macros/s/XXXXXXXXXX/exec';

// Elemen DOM
const totalPplElement = document.getElementById('total-ppl');
const totalKegiatanElement = document.getElementById('total-kegiatan');
const totalDesaElement = document.getElementById('total-desa');
const tabelKegiatanBody = document.querySelector('#tabel-kegiatan tbody');

// Fungsi untuk memuat data dari Google Sheets
async function loadDashboardData() {
    try {
        const response = await fetch(SHEET_SCRIPT_URL);
        const data = await response.json();
        
        // Update ringkasan
        updateSummary(data.summary);
        
        // Update tabel kegiatan
        updateActivitiesTable(data.activities);
        
        // Buat grafik
        createChart(data.chartData);
        
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Gagal memuat data dashboard. Silakan coba lagi.');
    }
}

// Update ringkasan dashboard
function updateSummary(summary) {
    totalPplElement.textContent = summary.totalPpl;
    totalKegiatanElement.textContent = summary.totalKegiatan;
    totalDesaElement.textContent = summary.totalDesa;
}

// Update tabel kegiatan
function updateActivitiesTable(activities) {
    tabelKegiatanBody.innerHTML = '';
    
    activities.forEach(activity => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${activity.namaPpl}</td>
            <td>${activity.desa}</td>
            <td>${activity.tanggal}</td>
            <td>${activity.jenisKegiatan}</td>
            <td>${activity.status}</td>
        `;
        
        tabelKegiatanBody.appendChild(row);
    });
}

// Buat grafik dengan Chart.js
function createChart(chartData) {
    const ctx = document.getElementById('kegiatanChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Jumlah Kegiatan per Desa',
                data: chartData.data,
                backgroundColor: [
                    '#3498db',
                    '#2ecc71',
                    '#e74c3c',
                    '#f39c12',
                    '#9b59b6'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Fungsi untuk format tanggal
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Memuat data saat halaman siap
document.addEventListener('DOMContentLoaded', loadDashboardData);

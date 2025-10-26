// Global variables
let userName, projectName, volume, materialCost, printTime, electricityCost, totalCost, requestID;

// Handle form submission
document.getElementById('uploadForm')?.addEventListener('submit', function(e){
    e.preventDefault();
    const file = document.getElementById('stlFile').files[0];
    if (!file) return alert('Please upload an STL file.');

    userName = document.getElementById('userName').value;
    projectName = document.getElementById('projectName').value;

    const reader = new FileReader();
    reader.onload = function(e){
        const contents = e.target.result;
        const loader = new THREE.STLLoader();
        const geometry = loader.parse(contents);
        volume = (geometry.computeBoundingBox().getSize(new THREE.Vector3()).x *
                  geometry.computeBoundingBox().getSize(new THREE.Vector3()).y *
                  geometry.computeBoundingBox().getSize(new THREE.Vector3()).z).toFixed(2);

        // Calculate costs
        materialCost = (volume * 2.5).toFixed(2);
        printTime = (volume * 0.3).toFixed(2);
        electricityCost = (printTime * 0.5).toFixed(2);
        totalCost = (parseFloat(materialCost) + parseFloat(electricityCost)).toFixed(2);

        requestID = 'REQ' + Math.floor(Math.random() * 1000000);

        // Save to session storage to pass to request.html
        sessionStorage.setItem('userName', userName);
        sessionStorage.setItem('projectName', projectName);
        sessionStorage.setItem('volume', volume);
        sessionStorage.setItem('materialCost', materialCost);
        sessionStorage.setItem('printTime', printTime);
        sessionStorage.setItem('electricityCost', electricityCost);
        sessionStorage.setItem('totalCost', totalCost);
        sessionStorage.setItem('requestID', requestID);

        window.location.href = 'request.html';
    };
    reader.readAsArrayBuffer(file);
});

// Display summary in request.html
if (document.getElementById('displayUser')) {
    document.getElementById('displayUser').innerText = sessionStorage.getItem('userName');
    document.getElementById('displayProject').innerText = sessionStorage.getItem('projectName');
    document.getElementById('displayVolume').innerText = sessionStorage.getItem('volume');
    document.getElementById('displayMaterial').innerText = sessionStorage.getItem('materialCost');
    document.getElementById('displayTime').innerText = sessionStorage.getItem('printTime');
    document.getElementById('displayElectricity').innerText = sessionStorage.getItem('electricityCost');
    document.getElementById('displayTotal').innerText = sessionStorage.getItem('totalCost');
    document.getElementById('displayID').innerText = sessionStorage.getItem('requestID');
}

// PDF Export
document.getElementById('exportPDF')?.addEventListener('click', function(){
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("3D Print Hub Receipt", 20, 20);
    doc.text(`User Name: ${sessionStorage.getItem('userName')}`, 20, 40);
    doc.text(`Project Name: ${sessionStorage.getItem('projectName')}`, 20, 50);
    doc.text(`Volume: ${sessionStorage.getItem('volume')} cm³`, 20, 60);
    doc.text(`Material Cost: ₹${sessionStorage.getItem('materialCost')}`, 20, 70);
    doc.text(`Print Time: ${sessionStorage.getItem('printTime')} min`, 20, 80);
    doc.text(`Electricity Cost: ₹${sessionStorage.getItem('electricityCost')}`, 20, 90);
    doc.text(`Total Cost: ₹${sessionStorage.getItem('totalCost')}`, 20, 100);
    doc.text(`Request ID: ${sessionStorage.getItem('requestID')}`, 20, 110);
    doc.save(`${sessionStorage.getItem('projectName')}_Receipt.pdf`);
});

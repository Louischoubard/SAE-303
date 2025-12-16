const fileInput = document.getElementById('xls');

fileInput.addEventListener('change', function(e) {
    // Quand le fichier change dans l'input
    const file = e.target.files[0] // => fichier selectionner
    lireFichier(file);
})


function lireFichier(file){
    // Lire le fichier en utilisant FileReader
    const reader = new FileReader();
    reader.onload = function (e) {
        var data = e.target.result;

        // récupération du classeur sous forme de tableau
        var workbook = XLSX.read(data, {type: 'array'});
        
        // récupération de la première feuille du classeur
        var firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        
        // header: 1 instructs xlsx to create an 'array of arrays'
        result = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        
        // data preview
        var output = document.getElementById('result');
        output.innerHTML = JSON.stringify(result, null, 2);
  };
  reader.readAsArrayBuffer(file);

    reader.readAsArrayBuffer(file);
}

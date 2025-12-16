const fileInput = document.getElementById('xls');
const ageSelect = document.getElementById('selectAge');
const colAge = 1;
var minAge = 1;
var maxAge = 13;
var data;
fileInput.addEventListener('change', function(e) {
    // Quand le fichier change dans l'input
    const file = e.target.files[0] // => fichier selectionner
    lireFichier(file);
    
})

ageSelect.addEventListener('change', () => {
    var valueAge = ageSelect.value;
    valueAge = valueAge.split("-");
    minAge = valueAge[0];
    maxAge = valueAge[1];
    exploiterDonnee(data);
})

function exploiterDonnee(data){
    var output = document.getElementById('result');
    output.innerHTML ="";
    nombreLigne = data.length
    for(i=0; i<nombreLigne; i++){
        var tr = document.createElement('tr');

        // Ne pas affiche si age < minAge et age > maxAge
        if(parseInt(data[i][colAge]) < minAge || parseInt(data[i][colAge]) > maxAge){
            continue;
        }

        var nbCol = data[i].length;
        for(j=0; j<nbCol; j++){
            var td = document.createElement('td');
            td.innerHTML = data[i][j]
            tr.appendChild(td)
        }
        output.appendChild(tr)
    }
}


function lireFichier(file){
    // Lire le fichier en utilisant FileReader
    const reader = new FileReader();
    reader.onload = function (e) {
        var dataBrut = e.target.result;

        // récupération du classeur sous forme de tableau
        var workbook = XLSX.read(dataBrut, {type: 'array'});
        
        // récupération de la première feuille du classeur
        var firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        
        // header: 1 instructs xlsx to create an 'array of arrays'
        result = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        
        // data preview
        data = result;
        exploiterDonnee(result);
  };
  reader.readAsArrayBuffer(file);
}

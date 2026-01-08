const fileInput = document.getElementById('xls');
const ctx = document.getElementById('myChart');
var chartTSA = null

const ageSelect = document.getElementById('selectAge');
const selectVisage = document.getElementById('selectVisage');
const selectZone = document.getElementById('selectZone');
const selectParam = document.getElementById('selectParam');
var data;
fileInput.addEventListener('change', function(e) {
    // Quand le fichier change dans l'input
    const file = e.target.files[0] // => fichier selectionner
    lireFichier(file);
    
})

ageSelect.addEventListener('change', () => {
    exploiterDonnee(data);
})
selectVisage.addEventListener('change', () => {
    exploiterDonnee(data);
})
selectZone.addEventListener('change', () => {
    exploiterDonnee(data);
})
selectParam.addEventListener('change', () => {
    exploiterDonnee(data);
})

function changeAge(){
    var valueAge = ageSelect.value;
    valueAge = valueAge.split("-");
    return valueAge;
}

function changeVisage(){
    var valueVisage = selectVisage.value;
    return valueVisage;
}

function changeZone(){
    var valueZone = selectZone.value;
    return valueZone;
}

function changeParam(){
    var valueParam = selectParam.value;
    return valueParam;
}

function exploiterDonnee(data){
    var output = document.getElementById('result');
    output.innerHTML ="";

    var valueAge = changeAge();
    var valueVisage = changeVisage();
    var valueZone = changeZone();
    var valueParam = changeParam();

    var recherche = valueParam.toUpperCase() + "_" + valueZone + "_Visage" + valueVisage;

    var dataUpdate = data.filter((x, index) => index > 0 && x[1]>=valueAge[0] && x[1]<=valueAge[1]);

    var entetes = data[1];

    var indexRecherche = entetes.indexOf(recherche);
    console.log(indexRecherche, recherche)

    var resultat = dataUpdate.map(ligne => ({
        "Sujet": ligne[0],
        "Age (ans)": ligne[1],
        "Case": ligne[3],
        [recherche]: ligne[indexRecherche]
    }));

    var tabTSA = resultat.filter((x) => x["Case"]=="TSA");
    var tabDT = resultat.filter((x) => x["Case"]=="DT");

    var valeurTSA = [];
    var ageTSA = [];
    tabTSA.forEach(element => {
        if(element[recherche] != 1000){
            valeurTSA.push(element[recherche])
            ageTSA.push(Math.round(element["Age (ans)"]*100)/100);
        }
    });


    if(chartTSA !== null){
        chartTSA.destroy();
    }

    chartTSA = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ageTSA,
            datasets: [{
                label: valueParam + ' (s) sur ' + valueZone + ' pour l\'age',
                data: valeurTSA,
                borderWidth: 1
            }]
        },
        options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
        }
    });

    
    // for(i=1; i<nombreLigne; i++){
    //     var tr = document.createElement('tr');

    //     // Ne pas affiche si age < minAge et age > maxAge
    //     if(parseInt(data[i][colAge]) < minAge || parseInt(data[i][colAge]) > maxAge){
    //         continue;
    //     }

    //     if(i == 1){
    //         var entete = data[1];
    //         var entete = entete.filter((x)=>x!="")
    //         console.log(entete);
    //     }

    //     var nbCol = data[i].length;
    //     for(j=0; j<nbCol; j++){
    //         var td = document.createElement('td');
    //         // if(data[i][j] == "undefined" || data[i][j] == null){
    //         //     continue;
    //         // }
    //         td.innerHTML = data[i][j]
    //         tr.appendChild(td)
    //     }
    //     output.appendChild(tr)
    // }
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

        result = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        
        // data preview
        data = result;
        exploiterDonnee(result);
  };
  reader.readAsArrayBuffer(file);
}

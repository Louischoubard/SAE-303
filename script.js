const fileInput = document.getElementById('xls');
const canvaChartTSA = document.getElementById('canvaChartTSA');
const canvaChartDT = document.getElementById('canvaChartDT');
var chartTSA = null;
var chartDT = null;
var chartBoxplot = null;

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

function getAge(){
    var valueAge = ageSelect.value;
    valueAge = valueAge.split("-");
    return [valueAge, ageSelect.options[ageSelect.selectedIndex].text];
}

function getVisage(){
    var valueVisage = selectVisage.value;
    return [valueVisage, selectVisage.options[selectVisage.selectedIndex].text];
}

function getZone(){
    var valueZone = selectZone.value;
    return [valueZone, selectZone.options[selectZone.selectedIndex].text];
}

function getParam(){
    var valueParam = selectParam.value;
    return [valueParam, selectParam.options[selectParam.selectedIndex].text];
}

function getRecherche(){
    var valueVisage = getVisage()[0];
    var valueZone = getZone()[0];
    var valueParam = getParam()[0];
    if(valueParam == "TTT"){
        return valueParam + "_Visage" + valueVisage
    }
    if(valueZone == "E"){
        return valueParam + valueZone + "_Visage" + valueVisage
    }
    if(valueParam == "Lat"){
        return valueParam + "_" + valueZone + "_Visage" + valueVisage;
    }
    return valueParam.toUpperCase() + "_" + valueZone + "_Visage" + valueVisage;
}

function getTitle(){
    var valueVisage = getVisage()[0];
    var valueZone = getZone()[0];
    var valueParam = getParam()[0];
    if(valueParam == "TTT"){
        return getParam()[1] + " du " + getVisage()[1] + " pour les " + getAge()[1] + " ans";
    }
    // if(valueZone == "E"){
    //     return valueParam + valueZone + "_Visage" + valueVisage
    // }
    // if(valueParam == "Lat"){
    //     return valueParam + "_" + valueZone + "_Visage" + valueVisage;
    // }
    return getParam()[1] + " sur la zone " + getZone()[1] + " du " + getVisage()[1] + " pour les " + getAge()[1] + " ans";
}

function createChart(titre, cle, valeur, nameChart, canva){
    if(nameChart !== null){
        nameChart.destroy();
    }
    return new Chart(canva, {
        type: 'line',
        data: {
            labels: cle,
            datasets: [{
                // label: valueParam + ' (s) sur ' + valueZone + ' pour l\'age',
                label: "Test",
                data: valeur,
                borderWidth: 1,
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: getTitle() + " - " + titre
                }
            }
        }
    });
}

function createBoxPlot(tabTSA, tabDT){
    if(chartBoxplot !== null){
        chartBoxplot.destroy();
    }
    const ctx = document.getElementById('boxplotChart');

    chartBoxplot = new Chart(ctx, {
        type: 'boxplot',
        data: {
            labels: [''],
            datasets: [{
                label: 'DT',
                data: [
                    tabDT.filter(e => e[getRecherche()] != 1000).map(e => e[getRecherche()]),
                ],
                backgroundColor: 'orange'
            },
            {
                label: 'TSA',
                data: [
                    tabTSA.filter(e => e[getRecherche()] != 1000).map(e => e[getRecherche()])
                ],
                backgroundColor: 'blue'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "Boxplot du " + getTitle()
                }
            }
        }
    });

}

function getDonneeChart(tableau){
    var valeur = [];
    var age = [];
    tableau.filter(e => e[getRecherche()] != 1000)
    .sort((a, b) => a["Age (ans)"] - b["Age (ans)"])
    .forEach(e => {
        age.push(Math.round(e["Age (ans)"] * 100) / 100);
        valeur.push(e[getRecherche()]);
    });
    return[age, valeur];
}

function exploiterDonnee(data){
    var valueAge = getAge()[0];

    var recherche = getRecherche();
    // console.log(recherche);

    var dataUpdate = data.filter((x, index) => index > 0 && x[1]>=valueAge[0] && x[1]<=valueAge[1]);

    var entetes = data[1];

    var indexRecherche = entetes.indexOf(recherche);
    // console.log(indexRecherche, recherche)

    var resultat = dataUpdate.map(ligne => ({
        "Sujet": ligne[0],
        "Age (ans)": ligne[1],
        "Case": ligne[3],
        [recherche]: ligne[indexRecherche]
    }));

    var tabTSA = resultat.filter((x) => x["Case"]=="TSA");
    var tabDT = resultat.filter((x) => x["Case"]=="DT");

    var donneTSA = getDonneeChart(tabTSA);
    var donneDT = getDonneeChart(tabDT);

    chartTSA = createChart('TSA', donneTSA[0], donneTSA[1], chartTSA, canvaChartTSA);
    chartDT = createChart('DT', donneDT[0], donneDT[1], chartDT, canvaChartDT);

    boxPlot = createBoxPlot(tabTSA, tabDT);

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

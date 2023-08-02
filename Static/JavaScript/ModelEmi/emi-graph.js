function drawEmiGraph() {
    const loanAmount = parseInt(document.querySelector(".js-principal-amount").dataset.value, 10);
    const interestAmount = parseInt(document.querySelector(".js-interest-amount").dataset.value, 10);
    const data = google.visualization.arrayToDataTable([
                    ['EMI Graph', 'Amount'],
                    ['Principal Amount',   loanAmount ],
                    ['Interest',     interestAmount ],
                ]);    
    const options = {
        pieHole: 0.7,
        pieSliceTextStyle: {
        color: '#ffffff',
        },
        tooltip: {isHtml: true}, 
        slices: {0: {color: '#e16363'}, 1:{color: '#56586a'}},
        legend: 'none'
    };    
    const chart = new google.visualization.PieChart(document.getElementById('emi-graph'));   
    
    selectHandler = () => {
        const selectedItem = chart.getSelection()[0];
        if (selectedItem){
            const topping = data.getValue(selectedItem.row, 0);
            if(topping === "Principal Amount"){
                document.querySelector(".google-visualization-tooltip").classList.add("principle");
                document.querySelector(".google-visualization-tooltip").classList.remove("interest");
            }else{
                document.querySelector(".google-visualization-tooltip").classList.add("interest");
                document.querySelector(".google-visualization-tooltip").classList.remove("principle");
            }
        }
    }
    
    setTooltipContent = (row) => {        
        if (row != null) {
            if(row === 0){
                document.querySelector(".google-visualization-tooltip").classList.add("principle");
                document.querySelector(".google-visualization-tooltip").classList.remove("interest");
            }else{
                document.querySelector(".google-visualization-tooltip").classList.add("interest");
                document.querySelector(".google-visualization-tooltip").classList.remove("principle");
            } 
        }       
    }

    google.visualization.events.addListener(chart, 'onmouseover', function(e) {
        setTooltipContent(e.row);
    }); 
           
    google.visualization.events.addListener(chart, 'select', selectHandler);    
  
    chart.draw(data, options);
}

function updateEmiGraph(emi, principalAmount) {
    if(principalAmount <= 0 || emi <= 0) {
        document.querySelector(".js-loan-emi-widget").classList.add("display-none");
        return ;
    }
    document.querySelector(".js-loan-emi-widget").classList.remove("display-none");
    let tenure= parseFloat(document.querySelector(".loan-tenure-text").textContent)*12;
    if(tenure < 36) {
        tenure = 36;
    }
    let interestAmount = parseInt((emi * tenure) - principalAmount, 10);
    let totalAmount = parseInt(principalAmount + interestAmount, 10);
    let interestPercent = (interestAmount*100)/totalAmount;
    let principalPercent =  100 - interestPercent;

    document.querySelector(".js-principal-amount").dataset.value = principalAmount; 
    document.querySelector(".js-interest-amount").dataset.value = interestAmount;
    document.querySelector(".js-principal-amount").textContent = `${commaSeperatedPrice(principalAmount)}`; 
    document.querySelector(".js-interest-amount").textContent = `${commaSeperatedPrice(interestAmount)}`;
    
    document.querySelector(".js-total-loan-amount").textContent = `${commaSeperatedPrice(totalAmount)}`;

    document.querySelector(".js-interest-percentage").textContent = `(${interestPercent.toFixed(1)}%)`; 
    document.querySelector(".js-principle-percentage").textContent = `(${principalPercent.toFixed(1)}%)`;
    document.querySelector(".js-loan-tenure-in-years").textContent = (tenure/12).toFixed(1);
    google.charts.setOnLoadCallback(drawEmiGraph);
}
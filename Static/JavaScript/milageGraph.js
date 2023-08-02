var slected_car1;
var slected_car2;

function chart1(obj){
    city_milage[1] = parseInt(obj.dataset.citymileage);
    highway_milage[1] = parseInt(obj.dataset.highwaymileage);
    graph(city_milage, highway_milage);

}
function chart2(obj){
    city_milage[2] = parseInt(obj.dataset.citymileage);
    highway_milage[2] = parseInt(obj.dataset.highwaymileage);
    graph(city_milage, highway_milage);

}

$(".smake_model1").on("click",function(){							
    $(".slctmake_model1").slideToggle(260);	
        setTimeout(function(){ $(".slctmake_model1").hide(260); }, 45000);																						
});

// when Model is selected from first dropdown
$(".slctmake_model1 [data-optionm]").on("click",function(){
    slected_car1 = $("#chart1").val($(this).attr("data-optionm"));
    $(".smake_model1").text($(this).text());
    $(".slctmake_model1").slideToggle(260);	
    chart1(this);
});


$(".smake_model2").on("click",function(){							
    $(".slctmake_model2").slideToggle(260);	
        setTimeout(function(){ $(".slctmake_model2").hide(260); }, 45000);																						
});

// when Model is selected from second dropdown
$(".slctmake_model2 [data-optionm]").on("click",function(){
    slected_car2 = $("#chart2").val($(this).attr("data-optionm"));
    $(".smake_model2").text($(this).text());
    $(".slctmake_model2").slideToggle(260);	
    chart2(this);
});	

// Bar Graph Function 
function graph(ct_m,hw_m) {
    CanvasJS.addColorSet("greenShades",["#e16363","#56586a"]);
    var chart = new CanvasJS.Chart("chartContainer", {
        
        colorSet: "greenShades",
        exportEnabled: true,
        interactivityEnabled: false,
        backgroundColor:"#fafafa",	 
        width:720, 
        axisY: {
            interval: 5,
            title: "Mileage in Kmpl",
            tickThickness: 0,
            lineThickness:0,
            gridThickness: '0.5', 
            minimum: 0,
            titleFontSize:12,
            titleFontColor:'#272a41',
            titleFontFamily:'Arial'
        },
        axisX: {
            title: "Mileage in Kmpl",
            valueFormatString  : " ",
            tickThickness: 0,
            gridThickness: 0,
            minimum: -0.4,
            maximum: 2.5,
        },
        legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries
        },
        dataPointMaxWidth: 49,
        data: [
            {
    type: "column",	
                name: "City Milage",
                showInLegend: true,
                indexLabel: "{y}",
                dataPoints: [   
                    {  y: ct_m[0] },
                    { y: ct_m[1] },
                    { y: ct_m[2] },
                ]
            },
            {
    type: "column",	
                name: "Highway Milage",
                showInLegend: true,
                indexLabel: "{y}",
                dataPoints: [   
                    { y: hw_m[0] },
                    { y: hw_m[1] },
                    { y: hw_m[2] },
                ]
        }]
    });
    chart.render();

    function toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        e.chart.render();
    }
}


var selected_car_cityMileage = parseInt($("#selected_car").attr("data-cityMileage"));
var selected_car_highwayMileage = parseInt($("#selected_car").attr("data-highwayMileage"));
var first_car_cityMileage = parseInt($(".slctmake_model1 .option")[0].dataset.citymileage);
var first_car_highwayMileage = parseInt($(".slctmake_model1 .option")[0].dataset.highwaymileage);
var second_car_cityMileage = parseInt($(".slctmake_model1 .option")[1].dataset.citymileage);
var second_car_highwayMileage = parseInt($(".slctmake_model1 .option")[1].dataset.highwaymileage);

var city_milage = [selected_car_cityMileage, first_car_cityMileage, second_car_cityMileage] 
var highway_milage = [selected_car_highwayMileage, first_car_highwayMileage, second_car_highwayMileage];

graph(city_milage, highway_milage);

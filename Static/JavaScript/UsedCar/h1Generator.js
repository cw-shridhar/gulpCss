function makeTitleClient(selectedFilters){
    var header = "";
    var selectCityText = "Select City";
    var cityName = selectedFilters["fltr_city_name"];
    var cityNameText = cityName;
    if(!cityName || cityName.toLowerCase() === selectCityText.toLowerCase()){
        cityName = "";
        cityNameText = "India";
    }
    
    if(selectedFilters["certification"]){
        header = "Used Certified Cars in "+cityNameText;
        return header;
    }
    if(selectedFilters["trans"] && cityName){
        var transLength = selectedFilters["trans"].split("+").length;
        if(transLength === 1){
            header = "Used "+selectedFilters["trans"]+" Cars in "+cityNameText;
            return header;
        }
    }
    if(selectedFilters["bodytype"]){
        var bodytypeLength = selectedFilters["bodytype"].split("+").length;
        if(bodytypeLength === 1){
            header = "Used "+selectedFilters["bodytype"]+ " Cars in "+cityNameText;
            return header;
        }
    }
    if(selectedFilters["fuel"]){
        var fuelLength = selectedFilters["fuel"].split("+").length;
        if(fuelLength === 1){
            header = "Used "+selectedFilters["fuel"]+ " Cars in "+cityNameText;
            return header;
        }
    }
    if(selectedFilters["budget"]){
        var budgets = selectedFilters["budget"].split("-");
        if(!budgets[1]){
            header = "Used Cars in "+cityNameText+" above "+budgets[0]+" lakh";
        }
        else if(budgets[1] && budgets[0] === "0"){
            header = "Used Cars in "+cityNameText+" under "+budgets[1]+" lakhs";
        }
        else{
            header =  "Used Cars in "+cityNameText+" between "+budgets[0]+" and "+budgets[1]+" lakhs";
        }
        return header;
    }
    if(selectedFilters["makes"] && selectedFilters["models"]){
        var makesLength = selectedFilters["makes"].split("+").length;
        var modelsLength = selectedFilters["models"].split("+").length;
        if(makesLength === 1 && modelsLength === 1){
            header = "Used "+selectedFilters["makes"]+" "+selectedFilters["models"]+" Cars in "+cityNameText;
            return header;
        }
    }
    if(selectedFilters["makes"]){
        makesLength = selectedFilters["makes"].split("+").length;
        if(makesLength === 1){
            header = "Used "+selectedFilters["makes"]+" Cars in "+cityNameText;
            return header;
        }
    }
    header =  "Used Cars in "+cityNameText;
    return header;
}
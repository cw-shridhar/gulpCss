/* EMI range slider related code starts here*/
var amount = 0;
var mnth = 0;
var rtin = 0;
var low_l = 0;
var upper_l = 0;
var totalamount = 0;
var ini_mnth = "60";
var ini_rtin = "8";

function numtoinr(vl){
		vl = parseInt(vl);
		num = vl.toString();
		part1 ="";
		part2 ="";
		part3 ="";
		if( num.length>3 ){ part1 = num.substr( num.length-3, 3 ); num = num.substr( 0 , num.length-3); }else{part1 = num; num = "";}
		if( num.length>2 ){ part2 = num.substr( num.length-2, 2 ); num = num.substr( 0 , num.length-2); }
		if( num.length>2 ){ part3 = num.substr( num.length-2, 2 ); num = num.substr( 0 , num.length-2); }
		vstr = "";
		if( num != "" ){
				vstr = vstr + num + ",";
		}
		if( part3 != "" ){
				vstr = vstr + part3 + ",";
		}
		if( part2 != "" ){
				vstr = vstr + part2 + ",";
		}
		vstr = vstr + part1;
		return vstr;
}
function cal_emi(low_l, upper_l, totalamount, amount, flg){
		$("#main_amt").html(numtoinr(totalamount));
		loan_amount = parseInt(totalamount) - parseInt(amount);
		$("#loan_amount").html(numtoinr(loan_amount));
		ripm = rtin/12;
		num = loan_amount * (ripm/100) * Math.pow((1+(ripm/100)),mnth);
		den = Math.pow((1+(ripm/100)),mnth)-1;
		emi = num/den;
		$("#emi").html("<strong>"+numtoinr(Math.round(emi))+"</strong>");
		if(typeof toBeShown !== "undefined" && toBeShown)
		{
			$("#payable_emi").html(numtoinr(Math.round(emi)));
		}
}
function loadEmi(low_l, upper_l, totalamount, amount, flg){
		mnth = ini_mnth;
		rtin = ini_rtin;
		$( "#slider-range-min1" ).slider({
				animate: true,
				range: "min",
				value:amount,
				min:low_l,
				max: upper_l,
				slide: function( event, ui ) {
						$( "#down_per" ).html(numtoinr(ui.value) );
						amount = ui.value;
						cal_emi(low_l, upper_l, totalamount, amount, flg);
				}
		});
		$( "#down_per" ).html( numtoinr($( "#slider-range-min1" ).slider( "value" )) );
		$( "#slider-range-min2" ).slider({
				animate: true,
				range: "min",
				value: mnth,
				min: 24,
				max: 84,
				slide: function( event, ui ) { 
						$( "#loan_ten" ).html( ui.value ); 
						mnth = ui.value; 
						cal_emi(low_l, upper_l, totalamount, amount, flg); 
				} 
		}); 
		$( "#loan_ten" ).html( $( "#slider-range-min2" ).slider( "value" ) ); 
		$( "#slider-range-min3" ).slider({ 
				animate: true,
				range: "min", 
				value: rtin, 
				min: 5, 
				max: 15, 
				step: 0.1, 
				slide: function( event, ui ) { 
						$( "#rate_intr" ).html( ui.value ); 
						rtin = ui.value; 
						cal_emi(low_l, upper_l, totalamount, amount, flg); 
				} 
		}); 
		$( "#rate_intr" ).html( $( "#slider-range-min3" ).slider( "value" ) ); 
}         
$( document ).ready(function() { 
		low_l= 1001292; 
		upper_l = 7859192;  
		totalamount = upper_l; 
		amount = 1571800; 
		mnth = "60"; 
		rtin = "8"; 
		loadEmi(parseInt(low_l), parseInt(upper_l), parseInt(totalamount), parseInt(amount), 0); 
		cal_emi(parseInt(low_l), parseInt(upper_l), parseInt(totalamount), parseInt(amount), 0);     
}); 
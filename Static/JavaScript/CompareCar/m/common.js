$.fn.addBack = function (selector) {
    return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
}

function toggle_bg_pop(type){
	if(type == "enable"){
		//console.log("enabling....");
		//$("#wrapper, #footer").show();
		
		var userAgent = navigator.userAgent;
		if (userAgent.match(/iPad|iPhone|iPod/i) !== null) {
			$("html").removeClass("ver-hidden");
		}
				
		$("#idbybody").css("overflow-y","visible");
		$("#overlay").removeClass("dark-overlay");
	}
	if(type == "disable"){
		//console.log("disabling....");		
		//$("#wrapper, #footer").hide();
		
		var userAgent = navigator.userAgent;
		if (userAgent.match(/iPad|iPhone|iPod/i) !== null) {
			$("html").addClass("ver-hidden");
		}
		$("#overlay").addClass("dark-overlay");
		$("#idbybody").css("overflow-y","hidden");		
	}
}

function toggleFullScreen(type) {
    if (!/(iPhone|iPod|iPad)/i.test(navigator.userAgent)) {
    	try{
                var doc = window.document;
            	var docEl = doc.documentElement;
            	var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
            	var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
                try{
                    	if((!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement && type == 'open') || type == 'open') {
                            //alert(type+document.fullscreenElement);
                    		try{    //if(document.fullscreenElement != null){
                                                requestFullScreen.call(docEl);
                                       // }
                                }catch(e){}
                    	}else {
                            if(document.fullscreenElement != null){
                                //alert(type+document.fullscreenElement);
                                cancelFullScreen.call(doc);
                            }
                    	}
                }catch(e){}
        }catch(e){}
    }
}
/* Customise emi related code starts here*/
function cust_emi(flag, low_l, upper_l, totalamount, amount, modelId, variantId, isCampaignAvailable, showPayableEmi = ''){
    //emi_clicked = 1;
    try{
        if(!get_param){
            get_param = "";
        }
    }catch(e){get_param = "";}
    if(true){ // City exist (Show emi form directly and show the bottom button based on campaign existance)
        //console.log("City exist");
        toggle_bg_pop("disable");
        if(true){
            loadEmi(parseInt(low_l), parseInt(upper_l), parseInt(totalamount), parseInt(amount));
            cal_emi(parseInt(low_l), parseInt(upper_l), parseInt(totalamount), parseInt(amount), toBeShown = showPayableEmi == 'true');
            $(".emi_blk_cust").hide();
            $(".emiOffersBlk_"+flag).show();
            $("#emi-offers-btn").attr("data-variantId", variantId);
            if(isCampaignAvailable.toLowerCase() === "true"){
                $("#emi-offers-btn").show();
            }else{
                $("#emi-offers-btn").hide();
            }
        }else{
        }
        document.getElementById("cust_emi_popup").style.display = "block";
    }else{
        //City does not exist
    }
}

function showLeadFormPopup(toBeShown = '', propertyType) {
    var variantId = $("#emi-offers-btn").attr("data-variantId");
    if(toBeShown === 'true')
    {
        document.getElementById("new_popup_heading").style.display = "block";
        document.getElementById("popup_heading").style.display = "none";
        document.getElementById("payable_container").style.display = "block";
        document.getElementById("chan_dealer").style.display = "block";
        leadFormPopup.click_camp_call(variantId, propertyType);
    }
    else
    {
        hide_cusemi(1);
        leadFormPopup.click_camp_call(variantId, propertyType);
    }
}

function hide_cusemi(from){
    if(!from){
        from = 0;
    }
    document.getElementById("cust_emi_popup").style.display = "none";
    //$(".cust_emi_overlay").hide();
    if(from){ //close button
        toggle_bg_pop("enable");
        $("#chk_emi_click").val(0);
        if($("#reload").val() == "yes"){
            location.reload();
        }
    }else{
        $("#chk_emi_click").val(1);
    }
}
// background adjust for mobile site
function toggle_bg_pop(type) {
    if (type == "enable") {
        var userAgent = navigator.userAgent;
        if (userAgent.match(/iPad|iPhone|iPod/i) !== null) { }
        $("#idbybody").css("overflow-y", "visible");
        $("#overlay").removeClass("dark-overlay");
    }
    if (type == "disable") {
        var userAgent = navigator.userAgent;
        if (userAgent.match(/iPad|iPhone|iPod/i) !== null) { }
        $("#overlay").addClass("dark-overlay");
        $("#idbybody").css("overflow-y", "hidden");
    }
}

// remove all validations
function clear_validations() {
    //alert("entered");
    $("#exp_lead_name_er").removeClass("disp_block");
    $("#exp_lead_name_er").addClass("disp_none");
    $("#exp_lead_name_er .er_msg_ri").html("");

    $("#exp_lead_mob_er").removeClass("disp_block");
    $("#exp_lead_mob_er").addClass("disp_none");
    $("#exp_lead_mob_er .er_msg_ri").html("");

    $("#exp_lead_email_er").removeClass("disp_block");
    $("#exp_lead_email_er").addClass("disp_none");
    $("#exp_lead_email_er .er_msg_ri").html("");

    $("#exp_lead_city_er").removeClass("disp_block");
    $("#exp_lead_city_er").addClass("disp_none");
    $("#exp_lead_city_er .er_msg_ri").html("");

    $("#exp_lead_dealer_er").removeClass("disp_block");
    $("#exp_lead_dealer_er").addClass("disp_none");
    $("#exp_lead_dealer_er .er_msg_ri").html("");

    $("#exp_lead_email_updated_er").removeClass("disp_block");
    $("#exp_lead_email_updated_er").addClass("disp_none");
    $("#exp_lead_email_updated_er .er_msg_ri").html("");
    //$(".auth_er_msg").removeClass("uncheck");
}

// Name Validation starts
function check_lead_name(n) {
    var letters = /^[A-Za-z\.\ \'\/]+$/;
    let nameValue = $("#name").val().trim(); 
    if (nameValue.length === 0 && n === 1) {
        $("#exp_lead_name_er").addClass("disp_block");
        $("#exp_lead_name_er").removeClass("disp_none");
        $("#exp_lead_name_er .er_msg_ri").html("Name should not be empty");
        return "Name should not be empty\n";
    } else if (!nameValue.match(letters) && n === 1) {
        $("#exp_lead_name_er").addClass("disp_block");
        $("#exp_lead_name_er").removeClass("disp_none");
        $("#exp_lead_name_er .er_msg_ri").html("Name must contain alphabets only");
        return "Name must contain alphabets only\n";
    } else if (nameValue.length < 2 && n === 1) {
        $("#exp_lead_name_er").addClass("disp_block");
        $("#exp_lead_name_er").removeClass("disp_none");
        $("#exp_lead_name_er .er_msg_ri").html("Name length should be more than 1 character");
        return "Name length should be more than 1 character\n";
    } else {
        $("#exp_lead_name_er").addClass("disp_none");
        $("#exp_lead_name_er").removeClass("disp_block");
        $("#exp_lead_name_er .er_msg_ri").html("");
        return "";
    }
}
function namevalidation() {
    var regex = new RegExp("^[a-zA-Z .]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
}
// Name Validation Ends

// Mobile Number Validation starts
function check_lead_mobile(n) {
    var txtMobile = document.getElementById('mobile').value;
    var num = document.getElementById('mobile').value.length;
    if (num == 0 && n == 1) {
        $("#exp_lead_mob_er").addClass("disp_block");
        $("#exp_lead_mob_er").removeClass("disp_none");
        $("#exp_lead_mob_er .er_msg_ri").html("Mobile should not be empty");
        return "Mobile number should not be empty\n";
    } else if (num != 10 && n == 1) {
        $("#exp_lead_mob_er").addClass("disp_block");
        $("#exp_lead_mob_er").removeClass("disp_none");
        $("#exp_lead_mob_er .er_msg_ri").html("Mobile number should be of 10 digits");
        return "Mobile number should be of 10 digits\n";
    } else {
        var re = /^[6789]\d{9}$/;
        if (!txtMobile.match(re) && n == 1) {
            $("#exp_lead_mob_er").addClass("disp_block");
            $("#exp_lead_mob_er").removeClass("disp_none");
            $("#exp_lead_mob_er .er_msg_ri").html("Enter valid 10 digit mobile number");
            return "Enter valid 10 digit mobile number\n";
        } else {
            $("#exp_lead_mob_er").addClass("disp_none");
            $("#exp_lead_mob_er").removeClass("disp_block");
            $("#exp_lead_mob_er .er_msg_ri").html("");
            return "";
        }
    }
}

function startNum(txt) {
    var RegExp = /^[9|8|7|6]$/
    flag = false;
    if (RegExp.test(txt))
        flag = true;
    return flag;
}

function NewisNum(txt, vmin, vmax) {
    var RegExp = /^(([9|8|7|6][0-9]+)+)$/
    if (RegExp.test(txt)) {
        if (txt.length >= vmin && txt.length <= vmax) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
// Mobile Number vaildation Ends



// Email Validation starts
function check_lead_email(n) {
    var txtEmail = document.getElementById("email").value;
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    txtEmail = txtEmail.trim();
    if (txtEmail.length >= 1 && n == 1) {
        if (txtEmail.match(re)) {
            $("#exp_lead_email_er").addClass("disp_none");
            $("#exp_lead_email_er").removeClass("disp_block");
            $("#exp_lead_email_er .er_msg_ri").html("");
            return "";
        }
        else {
            $("#exp_lead_email_er").addClass("disp_block");
            $("#exp_lead_email_er").removeClass("disp_none");
            $("#exp_lead_email_er .er_msg_ri").html("Enter proper E-Mail ID");
            return "Enter proper E-Mail ID\n";
        }
    }
    else if (n == 1) {
        $("#exp_lead_email_er").addClass("disp_block");
        $("#exp_lead_email_er").removeClass("disp_none");
        $("#exp_lead_email_er .er_msg_ri").html("Email Id should not be empty");
        return "Email Id should not be empty\n";
    }
    else {
        $("#exp_lead_email_er").addClass("disp_none");
        $("#exp_lead_email_er").removeClass("disp_block");
        $("#exp_lead_email_er .er_msg_ri").html("");
        return "";
    }
}

// Email Validation Ends

//Validtion for open lead-form
function check_lead_nameV2(n) {
    var letters = /^[A-Za-z\.\ \'\/]+$/;
    let nameValue = $("#name1").val().trim(); 
    if (nameValue.length === 0 && n === 1) {
        $("#exp_lead_name_er").addClass("disp_block");
        $("#exp_lead_name_er").removeClass("disp_none");
        $("#exp_lead_name_er .er_msg_ri").html("Name should not be empty");
        return "Name should not be empty\n";
    } else if (!nameValue.match(letters) && n === 1) {
        $("#exp_lead_name_er").addClass("disp_block");
        $("#exp_lead_name_er").removeClass("disp_none");
        $("#exp_lead_name_er .er_msg_ri").html("Name must contain alphabets only");
        return "Name must contain alphabets only\n";
    } else if (nameValue.length < 2 && n === 1) {
        $("#exp_lead_name_er").addClass("disp_block");
        $("#exp_lead_name_er").removeClass("disp_none");
        $("#exp_lead_name_er .er_msg_ri").html("Name length should be more than 1 character");
        return "Name length should be more than 1 character\n";
    } else {
        $("#exp_lead_name_er").addClass("disp_none");
        $("#exp_lead_name_er").removeClass("disp_block");
        $("#exp_lead_name_er .er_msg_ri").html("");
        return "";
    }
}
function check_lead_mobileV2(n) {
    var txtMobile = document.getElementById('mobile1').value;
    var num = document.getElementById('mobile1').value.length;
    if (num == 0 && n == 1) {
        $("#exp_lead_mob_er").addClass("disp_block");
        $("#exp_lead_mob_er").removeClass("disp_none");
        $("#exp_lead_mob_er .er_msg_ri").html("Mobile number should not be empty");
        return "Mobile number should not be empty\n";
    } else if (num != 10 && n == 1) {
        $("#exp_lead_mob_er").addClass("disp_block");
        $("#exp_lead_mob_er").removeClass("disp_none");
        $("#exp_lead_mob_er .er_msg_ri").html("Mobile number should be of 10 digits");
        return "Mobile number should be of 10 digits\n";
    } else {
        var re = /^[6789]\d{9}$/;
        if (!txtMobile.match(re) && n == 1) {
            $("#exp_lead_mob_er").addClass("disp_block");
            $("#exp_lead_mob_er").removeClass("disp_none");
            $("#exp_lead_mob_er .er_msg_ri").html("Enter valid 10 digit mobile number");
            return "Enter valid 10 digit mobile number\n";
        } else {
            $("#exp_lead_mob_er").addClass("disp_none");
            $("#exp_lead_mob_er").removeClass("disp_block");
            $("#exp_lead_mob_er .er_msg_ri").html("");
            return "";
        }
    }
}

//Validtion for open lead-form ends
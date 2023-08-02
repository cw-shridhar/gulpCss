var callinterval = setInterval(function () {
	__image_lazy_load = true;  
	if (document.readyState == "interactive" || document.readyState == "complete") {
		if (typeof jQuery != "undefined") {   	
			lazy_load_listing_images();		
                        $(window).scroll(function () {
                                scrollTop = $(window).scrollTop();                                 
                                if ($("img[data-lazyload-src]:first").length > 0) {
                                	__lazy_load = $("img[data-lazyload-src]:first").offset().top - 1000;
                                	if (scrollTop > __lazy_load) {
                                		lazy_load_listing_images();
                                	}
                                }
                             
                        });
			clearInterval(callinterval);
		}
	}
}, 200);
i=0;
function lazy_load_listing_images() {
	if (!__image_lazy_load)
		return true;     
	var all_lazy_count = 0;	    
	$("img[data-lazyload-src]").each(function () {
                img_ele = $(this);    
		var chekv = false;
                checkv = img_ele.offset().top - $(window).scrollTop() < parseInt(img_ele.height()) + 1000;                
                //console.log(img_ele.offset().top - $(window).scrollTop() +  " " + parseInt(img_ele.height()) +400  + " " + all_lazy_count); 
                if(!checkv)  
                return false;
		$(img_ele).attr("src", $(img_ele).attr("data-lazyload-src"));
		$(img_ele).removeAttr("data-lazyload-src");  
		all_lazy_count++;
	});
}
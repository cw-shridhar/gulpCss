function getPopularStock() {
    // to do after list page
    $.ajax({
        type: "GET",
        url: "/buy-used-cars/api/used-popular-model/",
        success: function (response) {
            $("#inquiry").html("<span class=margin-left10><strong>This listing has been deleted successfully.</strong><span>");
            $("#inquiry").css("background-color", "#ecf4e8");
            // <div class="footercolm b_topbrds">
            //     <div class="line">
            //         <strong>Popular Cars</strong>
            //         <ul>
            //             <li><a title="Used Jaguar XJ L cars in Satara" href="/buy-used-cars/satara/jaguar/xj-l/cmm">XJ L</a><span></span></li>
            //             <li><a title="Used Jaguar XF cars in Satara" href="/buy-used-cars/satara/jaguar/xf/cmm">XF</a><span></span></li>
            //             <li><a title="Used Renault Kwid cars in Satara" href="/buy-used-cars/satara/renault/kwid/cmm">Kwid</a><span></span></li>
            //             <li><a title="Used Hyundai Grand i10 cars in Satara" href="/buy-used-cars/satara/hyundai/grand-i10/cmm">Grand i10</a><span></span></li>
            //             <li><a title="Used Land Rover Range Rover Sport cars in Satara" href="/buy-used-cars/satara/land-rover/range-rover-sport/cmm">Range Rover Sport</a><span></span></li>
            //             <li><a title="Used Maruti Suzuki Ertiga cars in Satara" href="/buy-used-cars/satara/maruti-suzuki/ertiga/cmm">Ertiga</a><span></span></li>
            //             <li><a title="Used Hyundai i20 cars in Satara" href="/buy-used-cars/satara/hyundai/i20/cmm">i20</a><span class="no_bar"></span></li>
            //         </ul>
            //     </div>
            // </div>
        }
    });
};
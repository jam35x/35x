var mypoolid = "3c6b71eb0ee0152b8b2ded843539c3f39c9fcaa74df987e968cf2388f2392bea";
let LoadData = function() {
    const start = Date.now();
    var currentepoch = 0;
    $.getJSON( "https://pooltool.s3-us-west-2.amazonaws.com/stats/stats.json?now="+String(start), function( data ) {
        // var formattedheight = numeral(data['majoritymax']).format('0');
        $("#ptepoch").html(data["currentepoch"]);
        currentepoch = data["currentepoch"];
        $("#ptslot").html(data["currentslot"]);
        $("#ptheight").html(data["majoritymax"]);
    });

    $.getJSON( "https://pooltool.s3-us-west-2.amazonaws.com/8e4d2a3/pools/"+mypoolid+"/livestats.json?now="+String(start), function( data ) {
        var formattedstake = numeral(data["livestake"]/1000000).format('0.00a');

            $("#ptstake").html(formattedstake);
            if (
                typeof(data["lastBlockEpoch"])=="undefined" ||
                parseInt(currentepoch) != parseInt(data["lastBlockEpoch"]) &&
                ! parseInt(currentepoch) == (parseInt(data["lastBlockEpoch"]) + 1)
            )  {
                data["epochblocks"]="?"
                data["lifetimeblocks"]="?"
            } else if (parseInt(currentepoch) == (parseInt(data["lastBlockEpoch"]) + 1)) {
                data["epochblocks"]="0"
            };
            $("#pteblocks").html(data["epochblocks"]);
            $("#ptlblocks").html(data["lifetimeblocks"]);
    });
    
    let progress_bar = function () {
        clearInterval(progess);
        var width = 0;
        var progress_s = $(".progress-stats");
        progress_s.removeAttr("style");
        function frame() {
            if (width < 100) {
                width++;
                width_i = "width: " + width + "%";
                progress_s.removeAttr("style");
                progress_s.attr("style", width_i); 
            } else {
                clearInterval(progess);
            };
        };
        var progess = setInterval(frame, 600);
    };
    progress_bar();
};

let StakeData = function() {
    $.getJSON( "https://pooltool.s3-us-west-2.amazonaws.com/8e4d2a3/pools/"+mypoolid+"/epochstats.json", function( data ) {
        $.each(data, function(index, jsonObject){
            if (index == "updatedAt") {
                return false;
            };
            var txt = $("<option></option>").attr("value", index).text(index);
            $("#sel1").append(txt);
        });

        var drevese = $('#sel1'),
            reversed = drevese.children().toArray().reverse();

        drevese.append(reversed); 
        $("select#sel1").prop('selectedIndex', 0);

        let dataLoad = function(epoch) {
            //console.log(data);
            var x = 0, y = 0, z = 0, xx = 0;
            for(var key in data) {
                if (key == "updatedAt" || key == "2") {
                    continue;
                };
                x = x + Number(data[key]["blockstake"]);
                y = y + Number(data[key]["value_for_stakers"]);
                z = z + Number(data[key]["value_taxed"]);
                xx = xx + Number((data[key]["value_for_stakers"]*10000)/data[key]["blockstake"]);
                //console.log(z);
            };

            var blockStake = numeral(data[epoch]["blockstake"]/1000000).format('0.00a'); 
            var blockReward = numeral(data[epoch]["value_for_stakers"]/1000000).format('0.00a');
            var epochFee = numeral(data[epoch]["value_taxed"]/1000000).format('0.00a');
            var epochRos = numeral((data[epoch]["value_for_stakers"]*365)/data[epoch]["blockstake"]).format('0.00%');
            var avgRos = numeral((y*365)/x).format('0.00%');
            var per1000s = numeral((data[epoch]["value_for_stakers"]*10000)/data[epoch]["blockstake"]).format('0.00a');
            var lavg1000s = numeral(xx).format('0.00a');
            var ltimeFee = numeral(z/1000000).format('0.00a');
            var ltimeReward = numeral(y/1000000).format('0.00a');
            var ltimeStake = numeral(x/1000000).format('0.00a');
            //console.log(avgRos);

            $("#srstake").html(blockStake);
            $("#srblocks").html(data[epoch]["blocks"]);
            $("#srreward").html(blockReward);
            $("#srefee").html(epochFee);
            $("#sreros").html(epochRos);
            $("#sraros").html(avgRos);
            $("#sr10000").html(per1000s);
            $("#srav10000").html(lavg1000s);
            $("#srltfee").html(ltimeFee);
            $("#srltreward").html(ltimeReward);
            $("#srltstake").html(ltimeStake);


        };

        var selectedEpoch = $('#sel1').val();
        dataLoad(selectedEpoch);
        $("#sel1").change(function(){
            var selectEpoch = $('#sel1').val();
            dataLoad(selectEpoch);
        });


    });

};

let scroll_point = function () {
    $(window).scroll(function() {
        var wind_scroll = $(window).scrollTop();
        if( $(window).height() + wind_scroll >= $(document).height() ) {
            $('.scroll_active').removeClass('active');
            $('[href="#bottom"]').addClass('active');
        } else {
            $('.anchor').each(function(i) {
                if ($(this).position().top <= wind_scroll + 150) {
                    $('.scroll_active').removeClass('active');
                    $('.scroll_active').eq(i).addClass('active');
                }
            });
        }

    }).scroll();
};

$(document).ready(function() {
    LoadData();
    setInterval(LoadData, 60000); // this will update every 60 seconds
    StakeData();
    $(document).on('click','.navbar-collapse',function(e) {
        if( $(e.target).is('a:not(".dropdown-toggle")') ) {
            $(this).collapse('hide');
        }
    });
    $(".navbar-nav .nav-link").click(function(){
        $(".navbar-nav .nav-link").removeClass('active');
        $(this).addClass('active');
    });
    scroll_point();
});

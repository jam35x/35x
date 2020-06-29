let StakeData = function() {
    $.getJSON( "epochstats.json", function( data ) {
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
                xx = xx + (((Number(data[key]["value_for_stakers"]))*10000)/Number(data[key]["blockstake"]));
                //console.log(xx);
            };


            var blockStake = numeral(data[epoch]["blockstake"]/1000000).format('0.00a'); 
            var blockReward = numeral(data[epoch]["value_for_stakers"]/1000000).format('0.00a');
            var epochFee = numeral(data[epoch]["value_taxed"]/1000000).format('0.00a');
            var epochRos = numeral((data[epoch]["value_for_stakers"]*365)/data[epoch]["blockstake"]).format('0.00%');
            var avgRos = numeral((y*365)/x).format('0.00%');
            var ltimeStake = numeral(x/1000000).format('0.00a');
            var ltimeReward = numeral(y/1000000).format('0.00a');
            var ltimeFee = numeral(z/1000000).format('0.00a');
            var per1000s = numeral((data[epoch]["value_for_stakers"]*10000)/data[epoch]["blockstake"]).format('0.00a');
            var lavg1000s = numeral(xx).format('0.00a');
            //console.log(selectedEpoch);

            $("#srstake").html(blockStake);
            $("#srblocks").html(data[epoch]["blocks"]);
            $("#srreward").html(blockReward);
            $("#srefee").html(epochFee);
            $("#sreros").html(epochRos);
            $("#sraros").html(avgRos);
            $("#srltstake").html(ltimeStake);
            $("#srltreward").html(ltimeReward);
            $("#srltfee").html(ltimeFee);
            $("#sr10000").html(per1000s);
            $("#srav10000").html(lavg1000s);


        };

        var selectedEpoch = $('#sel1').val();
        dataLoad(selectedEpoch);
        $("#sel1").change(function(){
            var selectEpoch = $('#sel1').val();
            dataLoad(selectEpoch);
        });


    });

};

let epoch_counter = function() {
    //const epoch_m_sec = 86400 * 1000;
    const start = Date.UTC(2020, 6, 29);
    
    var now = Date.now();
    //var current_epoch = Math.floor((now - start) / epoch_m_sec) 
    //var remainder = (now - start) % epoch_m_sec;
    var distance = start - now;//epoch_m_sec - remainder;

   //$("#current-epoch").html(current_epoch) 

    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    function two_digit(num) {
        if (num < 10) {
            return "0" + num;
        }
        else {
            return num;
        };
    };

    if (days == 0 && hours == 0 && minutes == 0) {
        $("#counter").removeAttr("style");
        $("#counter").attr("style", "font-size:165%;");
        $("#counter").html(two_digit(seconds) + "<span>s</span>");
        $("#counter span").attr("style", "font-size:55%;");
    } else if (days == 0 && hours == 0) {
        $("#counter").removeAttr("style");
        $("#counter").attr("style", "font-size:165%;");
        $("#counter").html(two_digit(minutes) + "<span>min</span> " + two_digit(seconds) + "<span>sec</span>");
        $("#counter span").attr("style", "font-size:55%;");
    } else if (days == 0) {
        $("#counter").removeAttr("style");
        $("#counter").attr("style", "font-size:165%;"); 
        $("#counter").html(two_digit(hours) + "<span>hr</span> " + two_digit(minutes) + "<span>min</span> " + two_digit(seconds) + "<span>sec</span>");
        $("#counter span").attr("style", "font-size:55%;");
    } else {
        $("#counter").removeAttr("style");
        $("#counter").attr("style", "font-size:150%;");
        $("#counter").html(two_digit(days) + "<span>days</span> " + two_digit(hours) + "<span>hr</span> " + two_digit(minutes) + "<span>min</span> " + two_digit(seconds) + "<span>sec</span>");
        $("#counter span").attr("style", "font-size:50%;");
    };

    //var progress = Math.ceil((remainder * 100) / epoch_m_sec);

    //$(".progress-epoch").removeAttr("style");
    //$(".progress-epoch").attr("style", "width: " + progress + "%");
};

$(document).ready(function() {
    StakeData();
    $(document).on('click','.navbar-collapse',function(e) {
        if( $(e.target).is('a:not(".dropdown-toggle")') ) {
            $(this).collapse('hide');
        }
    });
    epoch_counter();
    setInterval(epoch_counter, 1000);
});

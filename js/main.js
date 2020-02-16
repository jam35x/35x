var mypoolid = "3c6b71eb0ee0152b8b2ded843539c3f39c9fcaa74df987e968cf2388f2392bea"
let LoadData = function() {
    const start = Date.now()
    $.getJSON( "https://pooltool.s3-us-west-2.amazonaws.com/8e4d2a3/pools/"+mypoolid+"/livestats.json?now="+String(start), function( data ) {
        var formattedstake = numeral(data["livestake"]/1000000).format('0.00a');

        $("#ptstake").html(formattedstake);
        $("#pteblocks").html(data["epochblocks"]);
    });

    $.getJSON( "https://pooltool.s3-us-west-2.amazonaws.com/stats/stats.json?now="+String(start), function( data ) {
        // var formattedheight = numeral(data['majoritymax']).format('0');
        $("#ptepoch").html(data["currentepoch"]);
        $("#ptslot").html(data["currentslot"]);
        $("#ptheight").html(data["majoritymax"]);
    });
}

let StakeData = function() {
    $.getJSON( "https://pooltool.s3-us-west-2.amazonaws.com/8e4d2a3/pools/3c6b71eb0ee0152b8b2ded843539c3f39c9fcaa74df987e968cf2388f2392bea/epochstats.json", function( data ) {
        $.each(data, function(index, jsonObject){
            if (index == "updatedAt") {
                return false;
            };
            var txt = $("<option></option>").attr("value", index).text(index);
            $("#sel1").append(txt);
        });

        var $drevese = $('#sel1'),
            $reversed = $drevese.children().toArray().reverse();

        $drevese.append($reversed); 
        $("select#sel1").prop('selectedIndex', 0);

        let dataLoad = function(epoch) {
            //console.log(data);
            var x = 0, y = 0, z = 0;
            for(var key in data) {
                if (key == "updatedAt") {
                    continue;
                };
                x = x + Number(data[key]["blockstake"]);
                y = y + Number(data[key]["value_for_stakers"]);
                z = z + Number(data[key]["value_taxed"]);
                //console.log(z);
            };

            var blockStake = numeral(data[epoch]["blockstake"]/1000000).format('0.00a'); 
            var blockReward = numeral(data[epoch]["value_for_stakers"]/1000000).format('0.00a');
            var epochFee = numeral(data[epoch]["value_taxed"]/1000000).format('0.00a');
            var epochRos = numeral(((data[epoch]["value_for_stakers"]-data[epoch]["value_taxed"])*365)/data[epoch]["blockstake"]).format('0.00%');
            var avgRos = numeral(((y-z)*365)/x).format('0.00%');
            var ltimeFee = numeral(z/1000000).format('0.00a');
            //console.log(avgRos);

            $("#srstake").html(blockStake);
            $("#srblocks").html(data[epoch]["blocks"]);
            $("#srreward").html(blockReward);
            $("#srefee").html(epochFee);
            $("#sreros").html(epochRos);
            $("#sraros").html(avgRos);
            $("#srltfee").html(ltimeFee);


        }

        var selectEpoch = $('#sel1').val()
        dataLoad(selectEpoch)
        $("#sel1").change(function(){
            var selectEpoch = $('#sel1').val()
            dataLoad(selectEpoch)
        });


    });

}


$(document).ready(function() {
    LoadData()
    setInterval(LoadData, 60000); // this will update every 60 seconds
    StakeData()
});

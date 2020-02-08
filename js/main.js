var mypoolid = "3c6b71eb0ee0152b8b2ded843539c3f39c9fcaa74df987e968cf2388f2392bea"
    let LoadData = function() {
        const start = Date.now()
        $.getJSON( "https://pooltool.s3-us-west-2.amazonaws.com/8e4d2a3/pools/"+mypoolid+"/livestats.json?now="+String(start), function( data ) {
            var formattedstake = numeral(data['livestake']/1000000).format('0.00 a');

            $("#ptstake").html(formattedstake)
            $("#pteblocks").html(data['epochblocks'])
        })

        $.getJSON( "https://pooltool.s3-us-west-2.amazonaws.com/stats/stats.json?now="+String(start), function( data ) {
            var formattedheight = numeral(data['majoritymax']).format('0,');
            $("#ptepoch").html(data['currentepoch'])
            $("#ptslot").html(data['currentslot'])
            $("#ptheight").html(formattedheight)
        })
    }

    $(document).ready(function() {
        LoadData()
        setInterval(LoadData, 60000); // this will update every 30 seconds
    })

function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

$(document).ready(onDeviceReady);

// device APIs are available
//
function onDeviceReady() {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
    // first();
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
    document.addEventListener("menubutton", onMenuKeyDown, false);
    // Add similar listeners for other events
}

function onPause() {
    // Handle the pause event
}

function onResume() {
    // Handle the resume event
}

function onMenuKeyDown() {
    // Handle the menubutton event
}
if (sukses_login == 1 && usergroup == "pembeli") {
    window.location.href = "../pembeli/index.html";
} else if (sukses_login == 1 && usergroup == "penjual") {
    window.location.href = "../penjual/index.html";
}
var semuaidusaha = [], semuadistance;

var firstLt, firstLg;

var onSuccess = function (position) {
    var element = document.getElementById('map');
    var marker;
    var posisilat;
    var posisilng;
    firstLt = position.coords.latitude;
    firstLg = position.coords.longitude;
    ambil_data();
};

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}

$.ajax({
    url: base_url + "produk/get_image_slider",
    type: 'post',
    // dataType: 'json',
    success: function (img) {

        var n = 1;
        var stat = '';
        var slide = ''; var indicate = '';
        $.each(img.data, function (key, val) {
            if (val.foto_produk != "") {
                if (n == 1) {
                    stat = 'active';
                } else {
                    stat = '';
                }
                var slideto = n - 1;

                slide += '<center><div class="carousel-item white" href="#"><img src="' + base_url + 'foto_usaha/produk/' + val.foto_produk + '" style="width: 80%" alt="' + val.nama_produk + '"></center></div>';
                // indicate += '<li data-target="#demo" data-slide-to="'+slideto+'" class="'+stat+'"></li>';
                // $("#carousel-indicators").append();
                n++;
            }
            $('.carousel').html(slide);
            // $(".carousel-indicators").html(indicate);
        });
        $('.carousel').carousel({
            fullWidth: true,
            indicators: true
        });
    }
});
function viewCategory(id_kategori) {
    window.localStorage.setItem('viewID_kategori', id_kategori);
    window.location.href = 'view_kategori_umum.html';
}

function ambil_data() {
    // $.ajax({
    //     url: base_url + 'penjual/ambil_data_lokasi_penjual',
    //     type: 'POST',
    //     dataType: 'JSON',
    //     success: function (res) {
    //         initDistance(res);
    //     }
    // });
    $.get(API_PENJUAL_LOKASI).then(onSuccessLoadDataPenjual);
}

var onSuccessLoadDataPenjual = (res) => { initDistance(res); }

function initDistance(res) {
    var t;
    var tujuan = [];
    var titik_saat_ini = new google.maps.LatLng(firstLt, firstLg);
    var map = new google.maps.Map(document.getElementById('map'), {
        center: titik_saat_ini,
        zoom: 13
    });
    var infoWindow = new google.maps.InfoWindow;

    Array.prototype.forEach.call(res, function (row, idx) {
        t = { lat: parseFloat(row.latitude), lng: parseFloat(row.longitude) };
        tujuan.push(t);
    });
    console.log('res');
    console.log(res);
    console.log('tujuan');
    console.log(tujuan);

    var origin1 = { lat: firstLt, lng: firstLg };
    // des -7.567492, 110.832670 des  -7.566248, 110.833485 des  -7.569072, 110.831500

    var destinationA = t;
    var service = new google.maps.DistanceMatrixService;
    var idx_terdekat;
    var distance_to_this_bf;

    service.getDistanceMatrix({
        origins: [origin1],
        destinations: tujuan,
        travelMode: 'DRIVING',
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
    }, function (response, status) {
        if (status !== 'OK') {
            alert('Error was: ' + status);
        } else {
            var originList = response.originAddresses;
            // var outputDiv = document.getElementById('dataProduct');
            // outputDiv.innerHTML = '';
            var value_of = [];
            for (var i = 0; i < originList.length; i++) {
                var results = response.rows[i].elements;
                /*var distRes = results.distance.value;
                distRes.sort(function(a, b){return a-b});*/
                console.log(response);
                console.log(results);
                results.sort(function (a, b) { return a.distance.value - b.distance.value; });

                var theElement = [];
                // results.length untuk total data jarak
                semuadistance = theElement;
                for (var j = 0; j < results.length; j++) {

                    theElement.push(results[j].distance, res[j].id_usaha);
                    semuadistance[res[j].id_usaha] = results[j].distance;
                    value_of.push(results[j].distance.value);
                    console.log(theElement[j]);
                    // outputDiv.innerHTML += results[j].distance.text + '<br>';
                }
                console.log(theElement);
                for (var i = 0; i < results.length; i++) {
                    console.log("id usaha:" + res[i].id_usaha);
                    semuaidusaha.push(res[i].id_usaha);
                    var ajaxx = 0;


                    if (i == 0) {
                        idx_terdekat = 0;
                        distance_to_this_bf = results[i].distance.value;
                        // outputDiv.innerHTML += res[j].nama_usaha + ' titik pertama. idx_terdekat ' + idx_terdekat + '<br>';
                    } else {
                        // outputDiv.innerHTML += '<br>' + res[j].nama_usaha + '<br>' + distance_to_this_bf + '>' + results[j].distance.value + ' maka <br>';
                        if (distance_to_this_bf > results[i].distance.value) {
                            distance_to_this_bf = results[i].distance.value;
                            idx_terdekat = i;
                        }
                        // outputDiv.innerHTML += 'idx_terdekat = ' + idx_terdekat + '<br>';
                    }
                }
                // console.log(value_of);
                // value_of.sort(function(a, b){return a-b});

                //  console.log(value_of);
            }

            console.log(semuaidusaha);
            var produks = '';
            let data_ajax = { id_usaha: semuaidusaha, distance_text: semuadistance };

            console.log("data ajax: ", data_ajax);
            $.ajax({
                url: API_GET_PRODUK_DASHBOARD,
                type: 'GET',
                data: data_ajax,
                dataType: 'JSON',
                success: function (response, status) {
                    // console.log("id_usaha : " + v);
                    console.log(response);
                    //console.log(JSON.stringify(ea,null, 2   ));
                    let usaha_id = response;
                    console.log(usaha_id);
                    $.each(usaha_id, function (k, v) {
                        // console.log("k usaha id", k);
                        $.each(v, function (key, val) {
                            const distance_text = val.distance;
                            // console.log("distance", distance_text);
                            var harga_display = (val.minprice != val.maxprice) ? 'Rp' + formatNumber(val.minprice) + ' - Rp' + formatNumber(val.maxprice) : 'Rp' + formatNumber(val.minprice);
                            produks += `<li class="collection-item avatar" onclick="viewProduk(${val.id_produk}, ${k})">
                                            <img class="circle"  src="${base_url}/foto_usaha/produk/${val.foto_produk}" alt="${val.nama_produk}">
                                            <span class="title black-text">${val.nama_produk}</span>
                                            <p class="orange-text">${harga_display}</p>
                                            <hr>
                                            <div class="row grey-text" style="margin-top:-8px; margin-bottom: 0px; padding-top:0px">
                                                <div class="col s8" style="padding-left: 0px; padding-right: 0px">${val.nama_usaha}</div>
                                                <div class="col s4"><p class="right" data-distance="${distance_text}">${distance_text}</p></div>
                                            </div>
                                        </li>`;
                        });
                    });
                    // console.log(produks);
                    console.log("success load produk with distance matrix");
                    $(".progress").remove();
                    $("#dataProduct").html(produks);
                    
                },
                always: function () {
                    ajaxx = 1;
                }
            });
            // outputDiv.innerHTML += 'jarak terdekat yaitu ke titik ke ' + idx_terdekat + '<br>yaitu ' + res[idx_terdekat].nama_usaha;
            var start = titik_saat_ini;
            var end = new google.maps.LatLng(res[idx_terdekat].latitude, res[idx_terdekat].longitude);

            var directionsService = new google.maps.DirectionsService();
            var directionsDisplay = new google.maps.DirectionsRenderer();
            directionsDisplay.setOptions({ suppressMarkers: true });


            var bounds = new google.maps.LatLngBounds();
            bounds.extend(start);
            bounds.extend(end);
            map.fitBounds(bounds);
            var request = {
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode.DRIVING
            };
            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                    directionsDisplay.setMap(map);
                } else {
                    alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
                }
            });
        }
    });
}

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

function viewProduk(id_produk, id_usaha) {
    storage.setItem('id_produk', id_produk);
    storage.setItem('id_usaha', id_usaha);
    window.location.href = "detail_produk_shop.html";
}
// $('.materialboxed').materialbox();
// $(document).on('load', function(){
//     $("nav").after('<div class="progress">'+
//         '<div class="indeterminate"></div>'+
//         '</div>');
// });

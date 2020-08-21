$(document).ready(function () {
    current_location();
    $('.datepicker').datepicker({
        format: 'yyyy-mm-dd'
    });
});
var firstLt, firstLg;
var onSuccess = function (position) {
    var element = document.getElementById('map');
    var marker;
    var posisilat;
    var posisilng;
    firstLt = position.coords.latitude;
    firstLg = position.coords.longitude;
    initMap(firstLt, firstLg);
    /*if(function_exists('initMap')){
      initMap(position.coords.latitude, position.coords.longitude);  
    }*/

};

function current_location() {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}

function taruhMarker(peta, posisiTitik) {
    if (marker) {
        // pindahkan marker
        marker.setPosition(posisiTitik);
    } else {
        // buat marker baru
        marker = new google.maps.Marker({
            position: posisiTitik,
            map: peta
        });
    }
    posisilat = posisiTitik.lat();
    posisilng = posisiTitik.lng();
    console.log("Posisi marker: " + posisilat + "," + posisilng);
    $("body").find("input[name='latitude_pb']").val(posisilat);
    //$("#latitude_pb").val(posisilat);
    //$("#longitude_pb").val(posisilng);
    $("body").find("input[name='longitude_pb']").val(posisilng);
}


function initMap(lat, lng) {
    $("body").find("input[name='latitude']").val(lat);
    $("body").find("input[name='longitude']").val(lng);
    var propertiPeta = {
        center: new google.maps.LatLng(lat, lng), //nentuin titik pusat nya dimana (awal map kebuka, bukan posisi marker)
        zoom: 17, //semakin banyak semakin dekat min 1 maksimal
        mapTypeId: google.maps.MapTypeId.ROADMAP //roadmap, satelite, hybrid, terrain
    };
    var point = new google.maps.LatLng(lat, lng);
    var peta = new google.maps.Map(document.getElementById("map"), propertiPeta); //utama bikin map
    marker = new google.maps.Marker({
        position: point,
        map: peta
        //icon
    });
    google.maps.event.addListener(peta, 'click', function (event) {
        taruhMarker(this, event.latLng);
    });
}
function Daftar() {
    var username = $("#username").val();
    var password = $("#password").val();
    var nama_pb = $("#nama_pb").val();
    var formData = new FormData($("form")[0]);
    $.ajax({
        url: API_SIGN_UP_PEMBELI,
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        async: false,
        success: function (response) {
            if (response.status == 'berhasil') {
                M.toast({ html: response.message });
                // setTimeout(location.assign('index.html'), 2000);
            } else {
                M.toast({ html: response.message });
            }
        },
        error: function (error) {
            M.toast({ html: error.message });
        },
    })
}
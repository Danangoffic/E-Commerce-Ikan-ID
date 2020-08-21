var lacak = {
    init: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function () {
        document.addEventListener("pause", lacak.onPause, false);
        document.addEventListener("resume", lacak.onResume, false);
        document.addEventListener("menubutton", lacak.onMenuKeyDown, false);
        document.addEventListener("backbutton", lacak.onBackKeyDown, false);
        lacak.onLoadPengiriman();
    },
    onPause: function () {

    },
    onResume: function () {

    },
    onMenuKeyDown: function () {

    },
    onBackKeyDown: function () {
        document.location.replace("transaksi.html");
    },
    onLoadPengiriman: function () {
        $.getJSON(base_url + "Pengiriman/get_pengiriman/" + localStorage.id_pengiriman + `/${localStorage.id_akun}`).then()
    },
    onSuccessLoadPengiriman: function(response, status){
        if(status=="success"){
            console.log("response : ", response);
        }
    }
}
lacak.init();
// function onLoad() {
//     lacak.init();
// }

$(document).ready(lacak.onDeviceReady);

var firstLt, firstLg;
// first();
function first() {

    navigator.geolocation.watchPosition(onSuccess, onError);
    // navigator.geolocation.getCurrentPosition(onSuccess, onError);
}
var onSuccess = function (position) {
    var element = document.getElementById('map');
    var marker;
    let latitude = parseFloat(position.coords.latitude);
    let longitude = parseFloat(position.coords.longitude);
    // firstLt = position.coords.latitude;
    // firstLg = position.coords.longitude;
    initMap(latitude, longitude);
    /*if(function_exists('initMap')){
      initMap(position.coords.latitude, position.coords.longitude);  
    }*/

};
// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
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
}
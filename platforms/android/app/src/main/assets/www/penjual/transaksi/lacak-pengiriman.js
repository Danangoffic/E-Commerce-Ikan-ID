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
        $.getJSON(API_LACAK_PENGIRIMAN +`/${localStorage.id_pengiriman}/${localStorage.id_akun}`).then(this.onSuccessLoadPengiriman);
    },
    onSuccessLoadPengiriman: function(response, status){
        if(status=="success"){
            console.log("response : ", response);
        }
    },
    simpan_pengiriman: function(id_pengiriman){
        let nama_penerima = $("#nama_penerima").val().toString();
        let data_update = {
            id_pengiriman: id_pengiriman,
            nama_penerima: nama_penerima
        }
        $.post(API_LACAK_PENGIRIMAN, data_update).then(success_update_pengiriman).fail().done()
    },
    success_update_pengiriman: (response, status)=>{
        if(status=="success"){

        }
    },
    fail_update_pengiriman: error=>{
        
    },
    done_update_pengiriman: function(){
        lacak.onLoadPengiriman();
    }
}
lacak.init();
$(document).ready(lacak.onDeviceReady);
function onBackKeyDown() {
    return lacak.onBackKeyDown;
}
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

function pengiriman() {
    return localStorage.pengiriman;
}
function simpan_pengiriman(id_pengiriman) {
    lacak.simpan_pengiriman(id_pengiriman);
}
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
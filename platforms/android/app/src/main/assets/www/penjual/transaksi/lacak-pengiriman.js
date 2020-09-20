var lacak = {
    id_pengiriman: localStorage.id_pengiriman,
    id_akun: localStorage.id_akun,
    id_kurir: 0,
    init: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function () {
        document.addEventListener("pause", lacak.onPause, false);
        document.addEventListener("resume", lacak.onResume, false);
        document.addEventListener("menubutton", lacak.onMenuKeyDown, false);
        document.addEventListener("backbutton", lacak.onBackKeyDown, false);
        lacak.load_pengiriman();
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
    load_pengiriman: function () {
        let data = {id_pengiriman: lacak.id_pengiriman, lacak: this.id_akun};
        GET_API(API_PENGIRIMAN, data).then(lacak.onSuccessLoadPengiriman).catch();
        // $.getJSON(API_LACAK_PENGIRIMAN +`/${localStorage.id_pengiriman}/${localStorage.id_akun}`).then(this.onSuccessLoadPengiriman);
    },
    onSuccessLoadPengiriman: function(data){
        lacak.id_kurir = data.id_kurir;
        lacak.watch_pos();
    },
    config_nav_geo_catch: {
        maximumAge: 3000, 
        timeout: 5000, 
        enableHighAccuracy: true
    },
    watch_pos: ()=>navigator.geolocation.watchPosition(lacak.success_watch_pos, lacak.fail_watch_pos, config_watch),
    success_watch_pos: function(position){
        let latitude = parseFloat(position.coords.latitude);
        let longitude = parseFloat(position.coords.longitude);
        const data_post = {id_kurir: lacak.id_kurir, latitude, longitude};
        const posting = POST_API(API_TRACK, data_post).then(lacak.success_post_watch).catch(this.fail_post_watch);
        // var element = document.getElementById('geolocation');
        // element.innerHTML = 'Latitude: '  + position.coords.latitude      + '<br />' +
        //                     'Longitude: ' + position.coords.longitude     + '<br />' +
        //                     '<hr />'      + element.innerHTML;
    },
    success_post_watch: function(data){

    },
    fail_post_watch: function(error){

    },
    fail_watch_pos: function(error){
        console.error('code: '    + error.code    + '\n' +
        'message: ' + error.message + '\n');
    },
    cancel_watch: function(){
        navigator.geolocation.clearWatch(lacak.watch_pos);
    },
    simpan_pengiriman: function(id_pengiriman, id_pemesanan){
        let nama_penerima = $("#nama_penerima").val().toString();
        const data_update = {
            id_pengiriman,
            nama_penerima,
            id_pemesanan
        };
        POST_API(API_END_TRACK, data_update).then(lacak.success_update_pengiriman).catch();
        // $.post(API_LACAK_PENGIRIMAN, data_update).then(success_update_pengiriman).fail().done()
    },
    success_update_pengiriman: response=>{
        let code_received = response.code;
        // CODE == 1 => Melanjutkan pengiriman selanjutnya //// CODE == 2 => Pengiriman telah selesai
        lacak.cancel_watch();
        if(code==1){
            lacak.load_pengiriman();
        }else if(code==2){
            
        }
    },
    fail_update_pengiriman: error=>{
        
    },
    done_update_pengiriman: function(){
        lacak.load_pengiriman();
    }
}
lacak.init();
$(document).ready(lacak.onDeviceReady);
function onBackKeyDown() {
    return lacak.onBackKeyDown;
}

function cancel_pos() {
    return lacak.cancel_watch();
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
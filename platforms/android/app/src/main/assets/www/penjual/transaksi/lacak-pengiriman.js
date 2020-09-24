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
        // let data = {id_pengiriman: lacak.id_pengiriman, lacak: this.id_akun};
        let config_api = `?id_pengiriman=${lacak.id_pengiriman}&akun=${lacak.id_akun}`;
        GET_API(API_PENGIRIMAN, config_api).then(lacak.onSuccessLoadPengiriman).catch();
        // $.getJSON(API_LACAK_PENGIRIMAN +`/${localStorage.id_pengiriman}/${localStorage.id_akun}`).then(this.onSuccessLoadPengiriman);
    },
    onSuccessLoadPengiriman: function (data) {
        lacak.parse_detail(data);
        lacak.id_kurir = data.id_kurir;
        lacak.watch_pos();
    },
    config_nav_geo_catch: {
        maximumAge: 3000,
        timeout: 5000,
        enableHighAccuracy: true
    },
    parse_detail: function (data) {
        let kurir = data.detail_kurir;
        let kendaraan = data.detail_kendaraan;
        let detail_pengiriman = data.detail_pengiriman;
        let detail_usaha = data.detail_usaha;
        let element_foto = document.getElementById("foto_kurir");
        let element_nk = document.getElementById("nama_kurir");
        let element_jk = document.getElementById("jenis_kendaraan");
        let element_plat = document.getElementById("plat_kendaraan");
        element_foto.setAttribute("src", kurir.foto_kurir);
        element_nk.innerHTML = kurir.nama_kurir;
        element_jk.innerHTML = kendaraan.jenis_kendaraan;
        element_plat.innerHTML = kendaraan.plat;
        let origin = data.asal;
        let lat1 = origin.latitude, long1 = origin.longitude;
        console.log("data usaha: ", detail_usaha);
        lacak.parse_progression(detail_usaha, detail_pengiriman);
        initMap(lat1, long1);
    },
    parse_progression: function (usaha, pengiriman) {
        let html_progress_usaha = `<li><time datetime="" class="teal-text waktu-pengiriman">(08.30)</time>
                <span>
                    <b id="nama-usaha">${usaha.nama_usaha}</b><br>
                    <p id="alamat-usaha" class="teal-text">${usaha.alamat_usaha}</p>
                </span>
            </li>`;
        let html_progress_pengiriman = ``;
        Array.prototype.forEach.call(pengiriman, el => {
            let status = el.status;
            let alt_status = "";
            if(status=="pengantaran"){
                alt_status = "Pesanan Dikirim";
            }else if(status=="selesai"){
                alt_status = "Pesanan Diterima";
            }
            html_progress_pengiriman += `<li><time datetime="" class="teal-text" style="margin-left: 42px"></time>
            <div style="margin-left: 24px">
                <b id="nama_pembeli${el.urutan}">${el.detail_pembeli.nama}</b><br>
                <p id="alamat_pembeli${el.urutan}" class="teal-text">${el.detail_pembeli.alamat_pembeli}</p>
                <p id="status_pengiriman${el.urutan}" class="black-text">${alt_status}</p>
            </div>
        </li>`;
        });
        html_progress_usaha += html_progress_pengiriman;
        let element_progress = document.getElementById("progression");
        element_progress.innerHTML = html_progress_usaha;
    },
    destination: [{}],
    watch_pos: () => navigator.geolocation.watchPosition(lacak.success_watch_pos, lacak.fail_watch_pos, lacak.config_nav_geo_catch),
    success_watch_pos: function (position) {
        let latitude = parseFloat(position.coords.latitude);
        let longitude = parseFloat(position.coords.longitude);
        const data_post = { id_kurir: lacak.id_kurir, latitude, longitude };
        const posting = POST_API(API_TRACK, data_post).then(lacak.success_post_watch).catch(this.fail_post_watch);
        // var element = document.getElementById('geolocation');
        // element.innerHTML = 'Latitude: '  + position.coords.latitude      + '<br />' +
        //                     'Longitude: ' + position.coords.longitude     + '<br />' +
        //                     '<hr />'      + element.innerHTML;
    },
    success_post_watch: function (data) {

    },
    fail_post_watch: function (error) {

    },
    fail_watch_pos: function (error) {
        console.error('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
    },
    cancel_watch: function () {
        navigator.geolocation.clearWatch(lacak.watch_pos);
    },
    simpan_pengiriman: function (id_pengiriman, id_pemesanan) {
        let nama_penerima = $("#nama_penerima").val().toString();
        const data_update = {
            id_pengiriman,
            nama_penerima,
            id_pemesanan
        };
        POST_API(API_END_TRACK, data_update).then(lacak.success_update_pengiriman).catch();
        // $.post(API_LACAK_PENGIRIMAN, data_update).then(success_update_pengiriman).fail().done()
    },
    success_update_pengiriman: response => {
        let code_received = response.code;
        // CODE == 1 => Melanjutkan pengiriman selanjutnya //// CODE == 2 => Pengiriman telah selesai
        lacak.cancel_watch();
        if (code == 1) {
            lacak.load_pengiriman();
        } else if (code == 2) {

        }
    },
    fail_update_pengiriman: error => {

    },
    done_update_pengiriman: function () {
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
    // $("body").find("input[name='latitude']").val(lat);
    // $("body").find("input[name='longitude']").val(lng);
    var propertiPeta = {
        center: new google.maps.LatLng(lat, lng), //nentuin titik pusat nya dimana (awal map kebuka, bukan posisi marker)
        zoom: 15, //semakin banyak semakin dekat min 1 maksimal
        mapTypeId: google.maps.MapTypeId.ROADMAP //roadmap, satelite, hybrid, terrain
    };
    var point = new google.maps.LatLng(lat, lng);
    var peta = new google.maps.Map(document.getElementById("map"), propertiPeta); //utama bikin map
    marker = new google.maps.Marker({
        // position: point,
        map: peta
        //icon
    });
}
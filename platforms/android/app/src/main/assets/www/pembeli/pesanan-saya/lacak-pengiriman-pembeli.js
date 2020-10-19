var lacak = {
    id_pemesanan: localStorage.id_pemesanan,
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
        let config_api = `?id_pemesanan=${lacak.id_pemesanan}&akun=${lacak.id_akun}`;
        GET_API(API_PENGIRIMAN, config_api).then(lacak.onSuccessLoadPengiriman).catch();
        // $.getJSON(API_LACAK_PENGIRIMAN +`/${localStorage.id_pengiriman}/${localStorage.id_akun}`).then(this.onSuccessLoadPengiriman);
    },
    onSuccessLoadPengiriman: function (data) {
        lacak.parse_detail(data);

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
        let detail_pemesanan = detail_pengiriman.detail_pemesanan;
        lacak.cek_pembayaran(detail_pemesanan);
        let detail_usaha = data.detail_usaha;
        lacak.parse_kurir(kendaraan, kurir);
        let origin = data.asal;
        let lat1 = origin.latitude, long1 = origin.longitude;
        console.log("data usaha: " + JSON.stringify(detail_usaha));
        console.log("detail_pengiriman : " + JSON.stringify(detail_pengiriman));
        lacak.parse_progression(detail_usaha, detail_pengiriman);
        let destinasi_pb = data.detail_pengiriman.destinasi;
        let markPosition = data.detail_pengiriman.destinasi;
        console.log("Mark position: " + JSON.stringify(markPosition));
        console.log("Lat : " + lat1, "Long : " + long1);
        lacak.latlngPembeliNow = { lat: destinasi_pb.latitude, lng: destinasi_pb.longitude };
        initMap(lat1, long1, markPosition);
        lacak.id_kurir = data.id_kurir;
        lacak.watch_pos();
    },
    parse_kurir: function (kendaraan, kurir) {
        console.log("Masuk kurir");
        console.log("data kurir : " + JSON.stringify(kurir));
        console.log("data kendaraan : " + JSON.stringify(kendaraan));
        let foto = kurir.foto_kurir, nama = kurir.nama_kurir;
        let jenis_kendaraan = kendaraan.jenis_kendaraan, plat = kendaraan.plat;
        let html_kurir = `<div class="col s3" style="margin-left: 12px">
        <img src="${foto}" alt="foto kurir ${nama}" class="circle responsive-img" style="width: 56px; height: 56px">
        </div>
        <div class="col s5" style="margin-left: -12px">
            <span id="namaKurir" style="font-weight: bold">${nama}</span><br>
            <span id="jenisKendaraan">${jenis_kendaraan}</span><br>
            <span id="noPlat">${plat}</span>
        </div>`;
        $("#content-kurir").html(html_kurir);
    },
    parse_progression: function(usaha, pengiriman) {
        console.log("Masuk parse progression");
        let html_progress_usaha = `<li><time datetime="" class="teal-text waktu-berangkat">(08.30)</time>
            <span>
                <b id="nama-usaha">${usaha.nama_usaha}</b><br>
                <p id="alamat-usaha" class="teal-text">${usaha.alamat_usaha}</p>
            </span>
        </li>`;
        let html_progress_pengiriman = ``;
        console.log("data pengiriman : ", pengiriman);
        let el = pengiriman;
        console.log("element : " + el);
        let status = el.status;
        let alt_status = "";
        let lokasi = el.destinasi;
        if (status == "pengantaran") {
            alt_status = "Pesanan Dikirim";
            lacak.latlngPembeliNow = { lat: lokasi.latitude, lng: lokasi.longitude };
        } else if (status == "selesai") {
            alt_status = "Pesanan Diterima";
        } else if (status == "menunggu") {
            alt_status = "Pesanan Menunggu Diantar";
        }
        html_progress_pengiriman += `<li><time datetime="" class="teal-text waktu-berangkat">(08.30)</time>
            <span>
                <b id="nama_pembeli${el.urutan}">${el.detail_pembeli.nama}</b><br>
                <p id="alamat_pembeli${el.urutan}" class="teal-text">${el.detail_pembeli.alamat_pembeli}</p>
                <p id="status_pengiriman${el.urutan}" class="black-text">${alt_status}</p>
            </span>
        </li>`;
        
        html_progress_usaha += html_progress_pengiriman;
        // let element_progress = document.getElementById("progression");
        $("#progression").html(html_progress_usaha);
        // element_progress.innerHTML = html_progress_usaha;
    },
    cek_pembayaran: function(detail_pemesanan){
        console.log("detail pemesanan : ", detail_pemesanan);
        let detail_pembayaran = detail_pemesanan.detail_pembayaran;
        let status_pembayaran = detail_pembayaran.status_pembayaran;
        let metode = detail_pembayaran.metode_pembayaran;
        let total_harga = detail_pemesanan.total_harga;
        let html_detail_pembayaran = `<div class="col s6">
            <p class="flow-text teal-text" style="font-size: small; font-weight: bold">Total Pembayaran</p>
        </div>`;
        let dp_status = `<div class="collection-item teal-text" id="status-pembayaran" style="font-weight: bold; font-size: medium"><span class="badge orange white-text">${status_pembayaran}</span>Status Pembayaran :</div>`;
        $("#payment-status").html(dp_status);
        console.log("Metode Pembayaran : " + metode);
        if(metode!="Full Transfer"){
            console.log("Metode : " + metode);
            let sisa_tagihan = total_harga * 0.7;
            html_detail_pembayaran += `
            <div class="col s6">
                <p class="flow-text dp-price-color right" style="font-size: small; font-weight: bold">Sisa Tagihan</p>
            </div>
            <div class="col s6">
                <h5 id="total-pembayaran" class="lunas-price-color">Rp${total_harga}</h5>
            </div>
            <div class="col s6">
                <h5 id="sisa-tagihan" class="dp-price-color right">Rp${sisa_tagihan}</h5>
            </div>`;
            let dp_info = `<p class="flow-text black-text" style="font-size: smaller; text-align: justify; padding: 0px 24px 8px 24px">* Lakukan Pembayaran sebesar <b>Sisa Tagihan</b> kepada Kurir</p>`;
            $("#dp-info").html(dp_info);
        }else{
            html_detail_pembayaran += `
            <div class="col s6">
                &nbsp;
            </div>
            <div class="col s6">
                <h5 id="total-pembayaran" class="lunas-price-color">Rp${total_harga}</h5>
            </div>
            <div class="col s6">
                &nbsp;
            </div>`;
            $("#dp-info").remove();
        }
        $("#payment-content").html(html_detail_pembayaran);
    },
    destination: [{}],
    watch_pos: () => navigator.geolocation.watchPosition(lacak.success_watch_pos, lacak.fail_watch_pos, lacak.config_nav_geo_catch),
    success_watch_pos: function (position) {
        let latitude = parseFloat(position.coords.latitude);
        let longitude = parseFloat(position.coords.longitude);
        let asal = response.origin;
        let tujuan = response.destination;
        console.log("Tujuan : " + JSON.stringify(tujuan));

        lacak.latlngPembeliNow = { lat: tujuan.latitude, lng: tujuan.longitude };
        let latOrigin = asal.latitude, lngOrigin = asal.longitude;
        console.log("latOrigin : " + latOrigin, "lngOrigin : " + lngOrigin);
        initMap(latOrigin, lngOrigin, tujuan);
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
    },
    latlngPembeliNow: {}
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
    initMap(latitude, longitude, { latitude, longitude });
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

function initMap(lat, lng, markPosition = {}) {
    console.log("Masuk init Map");
    console.log("markPosition : " + JSON.stringify(markPosition));
    console.log("Lat : " + lat, "lng : " + lng);
    // $("body").find("input[name='latitude']").val(lat);
    // $("body").find("input[name='longitude']").val(lng);
    var propertiPeta = {
        center: new google.maps.LatLng(lat, lng), //nentuin titik pusat nya dimana (awal map kebuka, bukan posisi marker)
        zoom: 15, //semakin banyak semakin dekat min 1 maksimal
        mapTypeId: google.maps.MapTypeId.ROADMAP //roadmap, satelite, hybrid, terrain
    };
    var point = null;
    if (markPosition != null) {
        point = new google.maps.LatLng(lat, lng);
    }
    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer();
    let destinasi = new google.maps.LatLng(lacak.latlngPembeliNow.lat, lacak.latlngPembeliNow.lng);
    var peta = new google.maps.Map(document.getElementById("map"), propertiPeta); //utama bikin map
    // marker = new google.maps.Marker({
    //     position: point,
    //     map: peta,
    //     zoom: 7
    //     //icon
    // });
    directionsRenderer.setMap(peta);
    calcRoute(point, destinasi, directionsService, directionsRenderer)
}

function calcRoute(start, end, directionsService, directionsRenderer) {
    var request = {
        origin: start,
        destination: end,
        travelMode: 'DRIVING'
    };
    directionsService.route(request, function (result, status) {
        if (status == 'OK') {
            console.log("direction service : " + status);
            directionsRenderer.setDirections(result);
        } else {
            console.log("direction service : " + status);
        }
    });
}
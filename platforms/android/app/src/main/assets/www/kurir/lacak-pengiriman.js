var UNDEFINED = "undefined";
var marker;
function onBackKeyDown() {
    // Handle the back button
    app.onBackKeyDown()
}

var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    id_pengiriman: localStorage.id_pengiriman,
    akun: localStorage.id_akun,
    result_data: null,
    id_pemesanan: null,
    lokasi_pembeli: null,
    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        $('.modal').modal();
        document.addEventListener("pause", app.onPause, false);
        document.addEventListener("resume", app.onResume, false);
        document.addEventListener("menubutton", app.onMenuKeyDown, false);
        document.addEventListener("backbutton", app.onBackKeyDown, false);
        app.load_data();
    },
    onPause: function () {

    },
    onResume: function () {

    },
    onMenuKeyDown: function () {

    },
    onBackKeyDown: () => {
        window.location.replace('../penjual/transaksi/transaksi.html#pengiriman');
    },
    load_data: function () {
        let param_get = `?id_pengiriman=${app.id_pengiriman}&akun=${app.akun}`;
        GET_API(API_PENGIRIMAN, param_get).then(app.success_load).catch(app.failed_data);
    },
    success_load: function(data) {
        console.log("DATA: "+ JSON.stringify(data));
        app.result_data = data;
        let lokasi_kurir = data.lokasi_kurir;
        let detail = data.detail_pengiriman;
        app.done_load_data(detail);
        $.each(detail, (k, v)=>{
            let stat = v.status;
            let destination = {lat: v.destinasi.latitude, lng: v.destinasi.longitude};
            if(stat=="pengantaran"){
                app.lokasi_pembeli = destination;
            }
        });
        console.log("LOKASI KURIR: ", JSON.stringify(lokasi_kurir));
        if (lokasi_kurir == "" || lokasi_kurir == null) {
            app.current_location();
        } else {
            let latitude = lokasi_kurir.latitude, longitude = lokasi_kurir.longitude;
            let currentLoc = { latitude, longitude };
            console.log("Current location: " + JSON.stringify(currentLoc),);
            // app.matrix_location(latitude, longitude);
            initMap(latitude, longitude, currentLoc);
        }
        
        // app.check_before_watch_location(lokasi_kurir);
    },
    failed_data: error => {

    },
    current_location: () => {
        console.log("GET CURRENT LOCATION");
        navigator.geolocation.getCurrentPosition(app.success_location, app.fail_location);
    },
    success_location: position => {
        var marker;
        let firstLt = parseFloat(position.coords.latitude);
        let firstLg = parseFloat(position.coords.longitude);
        console.log('Latitude: ' + position.coords.latitude + '\n' +
            'Longitude: ' + position.coords.longitude + '\n' +
            'Altitude: ' + position.coords.altitude + '\n' +
            'Accuracy: ' + position.coords.accuracy + '\n' +
            'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
            'Heading: ' + position.coords.heading + '\n' +
            'Speed: ' + position.coords.speed + '\n' +
            'Timestamp: ' + position.timestamp + '\n');
        let markPosition = { latitude: firstLt, longitude: firstLg };
        // app.matrix_location(firstLt, firstLg);
        initMap(firstLt, firstLg, markPosition);
    },
    fail_location: error => {

    },
    done_load_data: function(detail_pengiriman){
        console.log("Masuk load data selesai untuk persiapan parsing");
        let counter_track = 0;
        var data_produk, data_pembeli;
        $.each(detail_pengiriman, (idx, row)=>{
            if (row.status == "pengantaran") {
                console.log("status: " + row.status);
                counter_track++;
                app.id_pemesanan = row.id_pemesanan;
                console.log("id pemesanan : " + app.id_pemesanan);
                let dest = row.destinasi;
                // t = { lat: parseFloat(dest.latitude), lng: parseFloat(dest.longitude) };
                // use_destinasi = t;
                // tujuan.push(t);
                let status = row.status;
                let detail_pemesanan = row.detail_pemesanan;
                console.log("detail pemesanan: " + JSON.stringify(detail_pemesanan));
                data_pembeli = row.detail_pembeli;
                let detail_pembayaran = detail_pemesanan.detail_pembayaran;
                let status_pembayaran = detail_pembayaran.status_pembayaran;
                if (status_pembayaran == "DP") {
                    console.log("status pembayaran: " + status_pembayaran);
                    app.jenis_DP(detail_pemesanan);
                } else {
                    console.log("status pembayaran: " + status_pembayaran);
                    app.jenis_LUNAS(detail_pemesanan);
                }
                console.log("status pembayaran : " + status_pembayaran);
                data_produk = detail_pemesanan.detail_produk;
                console.log("data produk : " + JSON.stringify(data_produk));
                // app.parse_produk(detail_pemesanan.data_produk);
                // data_pembeli = detail_pembeli;
            }
        });
        
        if (counter_track == 0) {
            window.location.replace("../penjual/transaksi/transaksi.html");
        }
        app.parse_produk(data_produk);
        app.show_content_pembeli(data_pembeli);
        console.log('detail_pengiriman');
        console.log(JSON.stringify(detail_pengiriman));
    },
    matrix_location: (lat, lng) => {
        let origin_ = app.result_data.asal;
        var t;
        var tujuan = [];
        // var titik_saat_ini = new google.maps.LatLng(lat, lng);
        var titik_saat_ini = new google.maps.LatLng(parseFloat(origin_.latitude), parseFloat(origin_.longitude));
        var map = new google.maps.Map(document.getElementById('map'), {
            center: titik_saat_ini,
            zoom: 13
        });
        var infoWindow = new google.maps.InfoWindow;
        let detail_pengiriman = app.result_data.detail_pengiriman;
        var use_destinasi = {};
        let data_produk;
        let data_pembeli;
        let counter_track = 0;
       
        console.log('tujuan');
        console.log(JSON.stringify(tujuan));


        // var origin1 = [{ lat: parseFloat(origin_.latitude), lng: parseFloat(origin_.longitude) }];
        let mar_point_origin = new google.maps.LatLng(parseFloat(origin_.latitude), parseFloat(origin_.longitude));
        // // des -7.567492, 110.832670 des  -7.566248, 110.833485 des  -7.569072, 110.831500
        marker = new google.maps.Marker({
            position: mar_point_origin,
            map: map,
            zoom: 7
            //icon
        });
        // var destinationA = t;
        // var service = new google.maps.DistanceMatrixService;
        // var idx_terdekat;
        // var distance_to_this_bf;

        // console.log("lat destinasi: " + use_destinasi.lat + "\n" +
        //     "lng destinasi: " + use_destinasi.lng);
        // var start = new google.maps.LatLng(parseFloat(origin1[0].lat), parseFloat(origin1[0].lng));
        // var end = new google.maps.LatLng(parseFloat(tujuan[0].lat), parseFloat(tujuan[0].lng));
        // var directionsService = new google.maps.DirectionsService();
        // var directionsDisplay = new google.maps.DirectionsRenderer();
        // directionsDisplay.setOptions({ suppressMarkers: true });

        // var bounds = new google.maps.LatLngBounds();
        // bounds.extend(start);
        // bounds.extend(end);
        // map.fitBounds(bounds);
        // var request = {
        //     origin: origin1,
        //     destination: end,
        //     travelMode: google.maps.TravelMode.DRIVING
        // };
        // directionsService.route(request, function (response, status) {
        //     if (status == google.maps.DirectionsStatus.OK) {
        //         directionsDisplay.setDirections(response);
        //         directionsDisplay.setMap(map);
        //     } else {
        //         alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
        //     }
        // });
    },
    content_jenis: (content = "", type = "") => {
        let content_type_DP = "";
        if (type == "DP") {
            content_type_DP = `<div class="col s6">
            <p class="flow-text dp-price-color right" style="font-size: small; font-weight: bold">Sisa Tagihan</p>
          </div>${content}`;
        }
        let html_content = `<div class="row">
        <div class="col s6">
          <p class="flow-text teal-text" style="font-weight: bold; font-size: medium">Total Pembayaran</p>${(type == "Lunas") ? content : ""}
        </div>
        ${content_type_DP}
        </div>`;
        document.getElementById("detail-pembayaran-pesanan").innerHTML = html_content;
    },
    jenis_DP: detail_pemesanan => {
        let status = `DP`;
        let calc_dp = 0.3;
        let total_biaya_produk = 0;
        let biaya_dp = 0;
        let sisa_biaya;
        let total_harga = parseInt(detail_pemesanan.total_harga);
        Array.prototype.forEach.call(detail_pemesanan.data_produk, pr => {
            total_biaya_produk += pr.sub_total;
        });
        biaya_dp = parseInt(total_biaya_produk * calc_dp);
        sisa_biaya = total_harga - biaya_dp;
        let content = `<div class="col s6">
        <h5 id="total-pembayaran" class="lunas-price-color">Rp${formatNumber(total_harga)}</h5>
        </div>
        <div class="col s6">
            <h5 id="sisa-tagihan" class="dp-price-color right">Rp${formatNumber(sisa_biaya)}</h5>
        </div>`;
        app.content_jenis(content, status);
        app.show_jenis_pembayaran(status, "orange");
        // document.getElementById("detail-pembayaran-pesanan").innerHTML = parse_biaya;
    },
    jenis_LUNAS: detail_pemesanan => {
        let status = `Lunas`;
        let total_harga = parseInt(detail_pemesanan.total_harga);
        let content = `<h5 id="total-pembayaran" class="lunas-price-color left-align">Rp${formatNumber(total_harga)}</h5>`;
        app.content_jenis(content, status);
        app.show_jenis_pembayaran(status, "teal");
        // document.getElementById("detail-pembayaran-pesanan").innerHTML = parse_biaya;
    },
    show_jenis_pembayaran: (jenis = "DP", color_type = "") => {
        let content_panel_jenis = `<div class="collection-item teal-text" id="status-pembayaran" style="font-weight: bold; font-size: medium"><span class="badge ${color_type} white-text">${jenis}</span>Status Pembayaran :</div>`;
        document.getElementById("content-panel-jenis").innerHTML = content_panel_jenis;
    },
    show_content_important_alert: (jenis = "") => {
        let content_important_alert = "";
        if (jenis == "DP")
            content_important_alert = `<p class="flow-text black-text" style="font-size: smaller; text-align: justify; padding: 0px 24px 8px 24px">* Ingatkan Pembeli/Penerima untuk melakukan pembayaran sebesar <b>Sisa Tagihan</b></p>`;
        document.getElementById("content-important-alert").innerHTML = content_important_alert;
    },
    parse_produk: (data_produk) => {
        console.log("Masuk Parsing Produk");
        console.log("data produk: ", JSON.stringify(data_produk));
        let html_pr = ``;
        $.each(data_produk, (i, el) => {
            console.log(`id_produk: ${el.id_produk}`);
            html_pr += `<div class="card z-depth-0 produk" style="margin-bottom: -12px; margin-top: -8px">
          <div class="collection">
            <ul class="collection-item avatar">
              <img src="${el.foto_produk}" alt="" class="circle fotoProduk">
              <span class="title namaProduk">${el.nama_produk} <small class="grey-text">(${el.nama_variasi})</small></span>
              <p class="orange-text hargaProduk">Rp${formatNumber(el.harga)}<br>
                <span class="secondary-content teal-text totalProduk">${el.qty}&nbsp;Kg</span>
              </p>
            </ul>
          </div>
        </div>`;
        });
        let content_detail_produk = document.getElementById('content_detail_produk');
        content_detail_produk.innerHTML = html_pr;
    },
    show_content_pembeli: (detail_pembeli) => {
        console.log("Data Pembeli: ", JSON.stringify(detail_pembeli));
        let nama_pembeli = detail_pembeli.nama;
        let alamat_pembeli = detail_pembeli.alamat_pembeli;
        let kelurahan = detail_pembeli.kelurahan, kecamatan = detail_pembeli.kecamatan, kabupaten = detail_pembeli.kabupaten;
        let foto = detail_pembeli.foto_pb;
        let content_detail_foto = document.getElementById("detail_foto_pb");
        let content_detail_pembeli = document.getElementById("detail_pembeli");
        let content_nama = `<span id="nama_pembeli" style="font-weight: bold">${nama_pembeli}</span><br>`;
        let content_alamat = `<span id="alamat_pembeli">${alamat_pembeli}</span><br>`;
        let content_foto = `<img src="${foto}" alt="" id="img_pembeli" class="circle responsive-img" style="width: 58px; height: 70px">`;
        content_detail_foto.innerHTML = content_foto;
        content_detail_pembeli.innerHTML = `${content_nama + content_alamat}${kelurahan}, ${kecamatan}, ${kabupaten}`;
    },
    submittin_penerima: () => {
        let nama_penerima = document.getElementById("nama_penerima").value;
        let id_pengiriman = app.id_pengiriman;
        let id_pemesanan = app.id_pemesanan;
        let data = { nama_penerima, id_pengiriman, id_pemesanan };
        console.log("data submit: ", JSON.stringify(data));
        console.log("url submit : " + API_END_TRACK);
        POST_API(API_END_TRACK, data).then(app.success_submitting).catch(app.fail_submitting);
    },
    success_submitting: data => {
        M.toast({ html: "Berhasil submit penerima" });
        let code_res = data.code;
        if (code_res == 1) {
            app.load_data();
        } else if (code_res == 2) {
            window.location.replace("../penjual/transaksi/transaksi.html#selesai");
        }
    },
    fail_submitting: error => {
        M.toast({ html: "Failed submit penerima" });
        console.log(error);
    },
    // Update DOM on a Received Event

};
function submit_penerima() {
    app.submittin_penerima();
}
// app.initialize();
// $(document).ready(app.onDeviceReady);
$(document).ready(app.onDeviceReady);
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}
function onBackKeyDown() {
    return app.onBackKeyDown();
}

function initMap(lat, lng, markPosition = null) {
    console.log("Inisialisasi Map");
    // $("body").find("input[name='latitude']").val(lat);
    // $("body").find("input[name='longitude']").val(lng);
    var propertiPeta = {
        center: new google.maps.LatLng(lat, lng), //nentuin titik pusat nya dimana (awal map kebuka, bukan posisi marker)
        zoom: 15, //semakin banyak semakin dekat min 1 maksimal
        mapTypeId: google.maps.MapTypeId.ROADMAP //roadmap, satelite, hybrid, terrain
    };
    var point = null;
    if (markPosition != null) {
        point = new google.maps.LatLng(markPosition.latitude, markPosition.longitude);
        console.log("POINT: ", point);
    }
    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer();
    let destinasi = new google.maps.LatLng(app.lokasi_pembeli.lat, app.lokasi_pembeli.lng);
    var peta = new google.maps.Map(document.getElementById("map"), propertiPeta); //utama bikin map
    marker = new google.maps.Marker({
        position: point,
        map: peta,
        zoom: 7
        //icon
    });
    console.log("Marker: ", marker);
    directionsRenderer.setMap(peta);
    calcRoute(point, destinasi, directionsService, directionsRenderer)
}

function calcRoute(start, end, directionsService, directionsRenderer) {
    var request = {
        origin: start,
        destination: end,
        travelMode: 'DRIVING'
    };
    console.log("request direction: "+ JSON.stringify(request));
    directionsService.route(request, function (result, status) {
        if (status == 'OK') {
            directionsRenderer.setDirections(result);
        }
    });
}
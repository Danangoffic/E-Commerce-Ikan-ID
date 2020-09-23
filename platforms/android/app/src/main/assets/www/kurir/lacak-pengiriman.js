var UNDEFINED = "undefined";

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
    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        $('.modal').modal();
        document.addEventListener("pause", app.onPause, false);
        document.addEventListener("resume", app.onResume, false);
        document.addEventListener("menubutton", app.onMenuKeyDown, false);
        document.addEventListener("backbutton", onBackKeyDown, false);
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
    success_load: data => {
        console.log("DATA: ", data);
        app.result_data = data;
        let lokasi_kurir = data.lokasi_kurir;
        console.log("LOKASI KURIR: ", lokasi_kurir);
        if (lokasi_kurir == "") {
            app.current_location();
        } else {
            let latitude = lokasi_kurir.latitude, longitude = lokasi_kurir.longitude;
            app.matrix_location(latitude, longitude);
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
        app.matrix_location(firstLt, firstLg);
    },
    fail_location: error => {

    },
    matrix_location: (lat, lng) => {
        var t;
        var tujuan = [];
        var titik_saat_ini = new google.maps.LatLng(lat, lng);
        var map = new google.maps.Map(document.getElementById('map'), {
            center: titik_saat_ini,
            zoom: 13
        });
        var infoWindow = new google.maps.InfoWindow;
        let detail_pengiriman = app.result_data.detail_pengiriman;
        var use_destinasi = {};
        Array.prototype.forEach.call(detail_pengiriman, function (row, idx) {
            if (row.status == "pengantaran") {
                let dest = row.destinasi;
                t = { lat: parseFloat(dest.latitude), lng: parseFloat(dest.longitude) };
                use_destinasi = t;
                tujuan.push(t);
                let status = row.status;
                let detail_pemesanan = row.detail_pemesanan;
                let detail_pembeli = row.detail_pembeli;
                let detail_pembayaran = detail_pemesanan.detail_pembayaran;
                let status_pembayaran = detail_pembayaran.status_pembayaran;
                if (status_pembayaran == "DP") {
                    console.log("status pembayaran: " + status_pembayaran);
                    app.jenis_DP(detail_pemesanan);
                } else {
                    console.log("status pembayaran: " + status_pembayaran);
                    app.jenis_LUNAS(detail_pemesanan);
                }
                app.parse_produk(detail_pemesanan.data_produk);
                app.show_content_pembeli(detail_pembeli);
            }
        });
        console.log('detail_pengiriman');
        console.log(JSON.stringify(detail_pengiriman));
        console.log('tujuan');
        console.log(JSON.stringify(tujuan));

        let origin_ = app.result_data.asal;
        var origin1 = [{ lat: parseFloat(origin_.latitude), lng: parseFloat(origin_.longitude) }];
        // des -7.567492, 110.832670 des  -7.566248, 110.833485 des  -7.569072, 110.831500

        var destinationA = t;
        var service = new google.maps.DistanceMatrixService;
        var idx_terdekat;
        var distance_to_this_bf;

        console.log("lat destinasi: " + use_destinasi.lat + "\n" +
            "lng destinasi: " + use_destinasi.lng);
        var start = new google.maps.LatLng(parseFloat(origin1[0].lat), parseFloat(origin1[0].lng));
        var end = new google.maps.LatLng(parseFloat(tujuan[0].lat), parseFloat(tujuan[0].lng));
        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setOptions({ suppressMarkers: true });

        var bounds = new google.maps.LatLngBounds();
        bounds.extend(start);
        bounds.extend(end);
        map.fitBounds(bounds);
        var request = {
            origin: origin1,
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
    },
    content_jenis: (content = "", type = "") => {
        let content_type_id = "";
        if (type == "DP") {
            content_type_id = `<div class="col s6">
            <p class="flow-text dp-price-color right" style="font-size: small; font-weight: bold">Sisa Tagihan</p>
          </div>`;
        }
        let html_content = `<div class="row">
        <div class="col s6">
          <p class="flow-text teal-text" style="font-size: small; font-weight: bold">Total Pembayaran</p>
        </div>
        ${content_type_id}${content}
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
        <h5 id="total-pembayaran" class="lunas-price-color">Rp${total_harga}</h5>
        </div>
        <div class="col s6">
            <h5 id="sisa-tagihan" class="dp-price-color right">Rp${sisa_biaya}</h5>
        </div>`;
        app.content_jenis(content, status);
        app.show_jenis_pembayaran(status, "orange");
        // document.getElementById("detail-pembayaran-pesanan").innerHTML = parse_biaya;
    },
    jenis_LUNAS: detail_pemesanan => {
        let status = `Lunas`;
        let total_harga = parseInt(detail_pemesanan.total_harga);
        let content = `<div class="col s6">
        <h5 id="total-pembayaran" class="lunas-price-color">Rp${total_harga}</h5>
        </div>`;
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
    parse_produk: (data_produk = []) => {
        console.log("data produk: ", JSON.stringify(data_produk));
        let html_pr = ``;
        Array.prototype.forEach.call(data_produk, el => {
            html_pr += `<div class="card z-depth-0 produk" style="margin-bottom: -12px; margin-top: -8px">
          <div class="collection">
            <ul class="collection-item avatar">
              <img src="${el.foto_produk}" alt="" class="circle fotoProduk">
              <span class="title namaProduk">${el.nama_produk}</span>
              <p class="orange-text hargaProduk">${el.hargak}<br>
                <span class="secondary-content teal-text totalProduk">${el.qty}</span>
              </p>
            </ul>
          </div>
        </div>`;
        });
        let footer_content = `<div class="modal-footer">
                        <a href="#!" class="modal-close waves-effect waves-green btn-flat">Tutup</a>
                    </div>`;
        html_pr += footer_content;
        let content_detail_produk = document.getElementById('content-detail-produk');
        content_detail_produk.innerHTML = html_pr;
    },
    show_content_pembeli: (detail_pembeli = array()) => {
        let nama_pembeli = detail_pembeli.nama_pembeli;
        let alamat = detail_pembeli.alamat_pembeli;
        let foto = detail_pembeli.foto_pb;
        let img_pembeli = document.getElementById("img_pembeli");
        let name = document.getElementById("nama_pembeli");
        let alamat_pembeli = document.getElementById("alamat_pembeli");
        img_pembeli.setAttribute("src", foto);
        name.innerText = nama_pembeli;
        alamat.innerText = alamat_pembeli;
    },

    // Update DOM on a Received Event

};

app.initialize();
// $(document).ready(app.onDeviceReady);
var UNDEFINED = "undefined";
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
        app.load_data();
    },
    onPause: function () {

    },
    onResume: function () {

    },
    onMenuKeyDown: function () {

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
        if (lokasi_kurir == UNDEFINED || typeof (lokasi_kurir) == UNDEFINED || lokasi_kurir.latitude == UNDEFINED) {
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
        firstLt = position.coords.latitude;
        firstLg = position.coords.longitude;
        console.log("coordinate: ", position.coords);
        app.matrix_location(firstLt, firstLg);
    },
    fail_location: error => {

    },
    matrix_location: (lat = 0.0, lng = 0.0) => {
        var t;
        var tujuan = [];
        var titik_saat_ini = new google.maps.LatLng(firstLt, firstLg);
        var map = new google.maps.Map(document.getElementById('map'), {
            center: titik_saat_ini,
            zoom: 13
        });
        var infoWindow = new google.maps.InfoWindow;
        let detail_pengiriman = app.result_data.detail_pengiriman;
        Array.prototype.forEach.call(detail_pengiriman, function (row, idx) {
            let dest = row.destinasi;
            t = { lat: parseFloat(dest.latitude), lng: parseFloat(dest.longitude) };
            tujuan.push(t);
            let status = row.status;
            let detail_pemesanan = row.detail_pemesanan;
            let detail_pembeli = row.detail_pembeli;
            let detail_pembayaran = detail_pemesanan.detail_pembayaran;
            if (status == "pengantaran") {
                let status_pembayaran = detail_pembayaran.status_pembayaran;
                if (status_pembayaran == "DP") {
                    app.jenis_DP(detail_pemesanan);
                } else {
                    app.jenis_LUNAS(detail_pemesanan);
                }
                app.parse_produk(detail_pemesanan.data_produk);
                app.show_content_pembeli(detail_pembeli);
            }
        });
        console.log('detail_pengiriman');
        console.log(detail_pengiriman);
        console.log('tujuan');
        console.log(tujuan);

        let origin_ = detail_pengiriman.asal;
        var origin1 = [{ lat: origin_.latitude, lng: origin_.longitude }];
        // des -7.567492, 110.832670 des  -7.566248, 110.833485 des  -7.569072, 110.831500

        var destinationA = t;
        var service = new google.maps.DistanceMatrixService;
        var idx_terdekat;
        var distance_to_this_bf;

        service.getDistanceMatrix({
            origins: origin1,
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
                    // results.sort(function (a, b) { return a.distance.value - b.distance.value; });

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
    parse_produk: data_produk => {
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
        let footer_content= `<div class="modal-footer">
                        <a href="#!" class="modal-close waves-effect waves-green btn-flat">Tutup</a>
                    </div>`;
        html_pr += footer_content;
        let content_detail_produk = document.getElementById('content-detail-produk');
        content_detail_produk.innerHTML = html_pr;
    },
    show_content_pembeli: (detail_pembeli = array())=>{
        let nama_pembeli = detail_pembeli.nama_pembeli;
        let alamat = detail_pembeli.alamat_pembeli;
        let foto = detail_pembeli.foto_pb;
        let img_pembeli = document.getElementById("img_pembeli");
        let name = document.getElementById("nama_pembeli");
        let alamat_pembeli = document.getElementById("alamat_pembeli");
        img_pembeli.attributes("src", foto);
        name.innerText = nama_pembeli;
        alamat.innerText = alamat;
    },

    // Update DOM on a Received Event

};

app.initialize();
// $(document).ready(app.onDeviceReady);
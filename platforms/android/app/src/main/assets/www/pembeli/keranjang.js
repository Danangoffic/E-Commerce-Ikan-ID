var app = {
    init: function () {
        document.addEventListener("deviceready", this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function () {
        app.load_data_pembeli();
        document.addEventListener("pause", this.onPause, false);
        document.addEventListener("resume", this.onResume, false);
        document.addEventListener("menubutton", this.onMenuKeyDown, false);
        // $.getJSON(API_KERANJANG, {id_akun: localStorage.id_akun}).then(on_success_load_keranjang).fail()
    },
    onPause: function () {

    },
    onResume: function () {

    },
    onMenuKeyDown: function () {

    },
    origin: null,
    destination: null,
    result_distance: [],
    response_map: null,
    data_json_keranjang: JSON.parse(localStorage.keranjang),
    load_data_pembeli: function () {
        $.getJSON(API_PEMBELI, { id_akun: storage.id_akun }).then(app.success_load_data_pembeli);
    },
    success_load_data_pembeli: function (result, status) {
        if (status == "success") {
            let data_pembeli = result[0];
            app.origin = { lat: parseFloat(data_pembeli.latitude), lng: parseFloat(data_pembeli.longitude) };
            app.load_distance_matrix();
        }
    },
    load_distance_matrix: function () {
        var t;
        var tujuan = [];

        Array.prototype.forEach.call(app.data_json_keranjang, function (row, idx) {
            console.log("row", row);
            t = { lat: parseFloat(row.detail_usaha.latitude), lng: parseFloat(row.detail_usaha.longitude) };
            tujuan.push(t);
        });
        console.log('tujuan');
        console.log(tujuan);
        // des -7.567492, 110.832670 des  -7.566248, 110.833485 des  -7.569072, 110.831500
        var service = new google.maps.DistanceMatrixService;

        service.getDistanceMatrix({
            origins: [app.origin],
            destinations: tujuan,
            travelMode: 'DRIVING',
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: true
        }, function (response, status) {
            if (status !== 'OK') {
                alert('Error was: ' + status);
            } else {
                return app.load_keranjang(response);
                // this.result_distance = semuadistance;
                // this.load_keranjang(semuadistance);
            }
        });
    },
    load_keranjang: function (response) {
        let html_keranjang_per_usaha = ``;
        let results = response.rows[0].elements;
        Array.prototype.forEach.call(app.data_json_keranjang, function (i, v) {
            console.log("iiiiiii: ", i);
            const data_produk_keranjang = i.data_produk;
            let data_usaha = i.detail_usaha, harga_total_produk = 0;
            let distance_usaha = results[v].distance.value;
            let fee_ongkir = (distance_usaha > 5500) ? (10000 * (distance_usaha / 1000)) : 5000;
            html_keranjang_per_usaha += `<div class="card z-depth-2" id="keranjang_usaha_${i.id_usaha}" data-distance="${distance_usaha}">
            <div class="card-content">
                <p>
                    <label>
                        <input id="keranjang${v}" name="keranjang" type="radio" value="${i.id_usaha}">
                        <span class="title black-text" id="${i.id_usaha}">${data_usaha.nama_usaha}</span>
                    </label>
                </p>
                <ul class="collection">`;

            Array.prototype.forEach.call(data_produk_keranjang, function (i2, v2) {
                let harga_produk = i2.harga_produk;
                harga_total_produk += harga_produk * i2.jml_produk;
                html_keranjang_per_usaha += `<li class="collection-item avatar" style="min-height: 0px;">
                                        <img src="${base_url + "foto_usaha/produk/" + i2.foto_produk}" alt="${i2.nama_produk}" class="circle">
                                        <span class="title">${i2.nama_produk}
                                            <p class="orange-text">Rp ${formatNumber(harga_produk)}</p>
                                            <span class="secondary-content">${i2.jml_produk} Kg</span></span>
                                    </li>`;
            });

            let total_biaya_per_usaha = harga_total_produk + fee_ongkir;
            html_keranjang_per_usaha += `<li class="collection-item teal-text"><b>Biaya Pengiriman: <span class="secondary-content orange-text">Rp ${formatNumber(fee_ongkir)}</span></b></li>`;
            html_keranjang_per_usaha += `<li class="collection-item teal-text darken-1"><b>Total :<span class="secondary-content orange-text">Rp ${formatNumber(total_biaya_per_usaha)}</span></b></li>`;
            html_keranjang_per_usaha += `</ul>
                </div>
            </div>`;
        });
        $("#card-keranjang").html(html_keranjang_per_usaha);
    },
}
function onLoad() {
    app.init();
    // document.addEventListener("deviceready", onDeviceReady, false);
}

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

function beli_ini() {
    let value_checked = $("[name=keranjang]:checked").val();
    let distance_selected = $("#keranjang_usaha_" + value_checked).data("distance");
    let keranjang_checked = app.data_json_keranjang.find(element => element.id_usaha, value_checked);
    localStorage.setItem("checked_item_checkout", JSON.stringify(keranjang_checked));
    localStorage.setItem("distance_checkout", parseInt(distance_selected));
    if (localStorage.checked_item_checkout) {
        // location.href("../dashboard/detail_pesanan_saya.html");
    }
}
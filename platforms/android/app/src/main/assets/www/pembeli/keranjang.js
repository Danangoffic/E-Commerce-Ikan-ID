var app = {
    init: function () {
        document.addEventListener("deviceready", this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function () {
        $(".modal").modal();
        app.load_data_pembeli();
        document.addEventListener("pause", app.onPause, false);
        document.addEventListener("resume", app.onResume, false);
        document.addEventListener("menubutton", app.onMenuKeyDown, false);
        document.addEventListener("backbutton", app.onBackKeyDown, false);
        document.querySelector("#backmenu").addEventListener("click", app.onBackKeyDown, false);
        // $.getJSON(API_KERANJANG, {id_akun: localStorage.id_akun}).then(app.on_success_load_keranjang).fail()
    },
    onBackKeyDown: function () {
        window.history.back();
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
            app.destination = { lat: parseFloat(data_pembeli.latitude), lng: parseFloat(data_pembeli.longitude) };
            app.load_keranjang();
        }
        console.log("location pembeli: ", app.destination);
    },
    load_distance_matrix: function () {
        var t;
        var orig = [];
        Array.prototype.forEach.call(app.data_json_keranjang, function (row, idx) {
            console.log("row", row);
            t = { lat: parseFloat(row.detail_usaha.latitude), lng: parseFloat(row.detail_usaha.longitude) };
            orig.push(t);
        });
        console.log('orig');
        console.log(orig);
        console.log('destination', app.destination);
        app.origin = orig;
        // des -7.567492, 110.832670 des  -7.566248, 110.833485 des  -7.569072, 110.831500
        var service = new google.maps.DistanceMatrixService;

        service.getDistanceMatrix({
            origins: [app.destination],
            destinations: orig,
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
    load_keranjang: function () {
        let html_keranjang_per_usaha = ``;
        let id_pb = parseInt(localStorage.id_akun);
        var id_usaha = 0;
        // let results = response.rows[0].elements;
        // console.log("RESULT DISTANCE: ", results);
        Array.prototype.forEach.call(app.data_json_keranjang, function (i, v) {
            id_usaha = i.id_usaha;
            console.log("iiiiiii: ", i);
            const data_produk_keranjang = i.data_produk;
            let data_usaha = i.detail_usaha, harga_total_produk = 0;
            // let distance_usaha = results[v].distance.value;
            // let fee_ongkir = (distance_usaha > 5000) ? (10000 * (distance_usaha / 1000)) : 5000;
            var fee_ongkir = parseInt(0);
            html_keranjang_per_usaha += `<div class="card z-depth-2" id="keranjang_usaha_${i.id_usaha}">
            <div class="card-content">
                <p>
                    <label>
                        <input id="keranjang${v}" name="keranjang" type="radio" value="${i.id_usaha}">
                        <span class="title black-text" id="nama_usaha_${i.id_usaha}">${data_usaha.nama_usaha}</span>
                    </label>
                </p>
                <ul class="collection">`;

            Array.prototype.forEach.call(data_produk_keranjang, function (i2, v2) {
                let harga_produk = parseInt(i2.harga_produk);
                let jml_produk = parseInt(i2.jml_produk);
                harga_total_produk += parseInt(harga_produk * jml_produk);
                let id_keranjang = parseInt(i2.id_keranjang);
                console.log("data i2 : ", i2);
                html_keranjang_per_usaha += `<li class="collection-item avatar" style="min-height: 0px;" id="keranjang_${id_keranjang}" data-keranjang="${id_keranjang}">
                                        <img src="${base_url + "foto_usaha/produk/" + i2.foto_produk}" alt="${i2.nama_produk}" class="circle">
                                        <span class="title" id="name_${id_keranjang}">${i2.nama_produk} <small class="grey-text" id="variasi_${id_keranjang}">(${i2.nama_variasi})</small>
                                            <p class="orange-text">Rp ${formatNumber(harga_produk)}</p>
                                            <span class="secondary-content">${i2.jml_produk} Kg</span>
                                            <a href="#!" onclick="remove_item(${id_keranjang})"><i class="tiny material-icons red-text">remove_shopping_cart</i></a>
                                        </span>
                                        <br><medium class="grey-text" id="catatan">${i2.catatan}</medium>
                                    </li>`;
                fee_ongkir = parseInt(i2.estimasi_ongkir);
            });

            let total_biaya_per_usaha = harga_total_produk + fee_ongkir;
            html_keranjang_per_usaha += `<li class="collection-item teal-text" style="padding: 0 12px !important"><b>Subtotal Produk: <span class="secondary-content orange-text">Rp ${formatNumber(harga_total_produk)}</span></b></li>`;
            html_keranjang_per_usaha += `<li class="collection-item teal-text" style="padding: 0 12px !important"><b>Biaya Pengiriman: <span class="secondary-content orange-text">Rp ${formatNumber(fee_ongkir)}</span></b></li>`;
            html_keranjang_per_usaha += `<li class="collection-item teal-text" style="padding: 0 12px !important"><b>Total :<span class="secondary-content orange-text">Rp ${formatNumber(total_biaya_per_usaha)}</span></b></li>`;
            html_keranjang_per_usaha += `</ul>
                </div>
            </div>`;
        });
        $("#card-keranjang").html(html_keranjang_per_usaha);
    },
    remove_item: (id_keranjang=0) => {
        if(isIdEmpty(id_keranjang)){
            $("#modalFailedDelete").modal("open");
        }
        let data_req = {id_keranjang, id_akun: localStorage.id_akun};
        $.post(API_DETAIL_KERANJANG, data_req, (data, status)=>{
            if(status=="success"){
                let result = data.data;
                app.selected_id_keranjang = id_keranjang;
                let nama_produk = result.nama_produk;
                let variasi = result.nama_variasi;
                $("#confirm_delete").data("id", id_keranjang);
                let title_modal = 'Konfirmasi Hapus';
                let text_confirm_delete = `Apakah Anda yakin akan menghapus produk ${nama_produk} ${variasi}?`;
                $("#title_modal").text(title_modal);
                $("#text_confirm_delete").text(text_confirm_delete);
                $("#modalDelete").modal("open");
                $("#confirm_delete").click(confirmRemoveItem);
            }
        });
        
        // fetch(API_HAPUS_PRODUK_KERANJANG, {
        //     method: "POST",
        //     body: JSON.stringify(data_request)
        // }).then(response=>response.json()).then()
    },
    selected_id_keranjang: null
}

function isIdEmpty(id) {
    if(id==0 || id=="" || id=="0" || id=="undefined" || id==null || id=="null" || typeof(id)=="undefined"){
        return true;
    }
}

function confirmRemoveItem() {
    let id = app.selected_id_keranjang;
    console.log("id: " + id);
    let data_query = {id_keranjang: id};
    console.log("data query:", data_query);
    console.log("url: " + API_HAPUS_PRODUK_KERANJANG);
    $.post(API_HAPUS_PRODUK_KERANJANG, data_query, (result, status, xhqr)=>{
        console.log("result: ", result);
        console.log("Status API : " + status);
        console.log("xhqr: ", xhqr);
        if (status=="success") {
            app.selected_id_keranjang=null;
            $("#modalDelete").modal("close");
            console.log("hiding " + "#keranjang_"+id);
            $("#keranjang_"+id).hide();
            M.toast({html: 'Produk di Keranjang Berhasil Dihapus'});
            loadkeranjang();
            $("#card-keranjang").html("");
            app.load_keranjang();
            window.location.reload();
        }
    })
}

function onLoad() {
    loadkeranjang();
    // app.init();
    // document.addEventListener("deviceready", onDeviceReady, false);
}

function remove_item(id_keranjang=0) {
    return app.remove_item(id_keranjang)
}
$(document).ready(app.onDeviceReady);

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

function beli_ini() {
    let value_checked = $("[name=keranjang]:checked").val();
    let distance_selected = $("#keranjang_usaha_" + value_checked).data("distance");
    let keranjang_checked = app.data_json_keranjang.find(element => element.id_usaha, value_checked);
    localStorage.setItem('id_usaha', value_checked);
    localStorage.setItem("checked_item_checkout", JSON.stringify(keranjang_checked));
    localStorage.setItem("distance_checkout", parseInt(distance_selected));
    localStorage.setItem("item_checkout_usaha", parseInt(value_checked));
    if (localStorage.checked_item_checkout) {
        location.assign("../pembeli/pesanan-saya/detail_pesanan_saya.html");
    }
}

async function loadkeranjang() {
    let geting = await $.getJSON(API_KERANJANG, { id_akun: localStorage.id_akun }).then(successKeranjang).fail(onfailkeranjang);
    return geting;
}

function successKeranjang(response, status) {
    if (status == "success") {
        console.log("status: ", status);
        let keranjang = response;
        let str_keranjang = JSON.stringify(keranjang);
        let panjang_keranjang = keranjang.length;
        $("#status_keranjang").html(panjang_keranjang);
        localStorage.setItem("keranjang", str_keranjang);
        localStorage.setItem("total_item_keranjang", panjang_keranjang);
        console.log("keranjang: ", keranjang, "total_item_keranjang: ", panjang_keranjang);
        app.data_json_keranjang = keranjang;
    }
}

function onfailkeranjang(error) {
    console.log("status: ", error);
    let str_keranjang = "[]";
    let panjang_keranjang = 0;
    $("#status_keranjang").html("0");
    localStorage.setItem("keranjang", str_keranjang);
    localStorage.setItem("total_item_keranjang", panjang_keranjang);
    console.log("keranjang: ", keranjang, "total_item_keranjang: ", panjang_keranjang);
}
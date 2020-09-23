$('.modal').modal();
var data_usaha = JSON.parse(localStorage.data_usaha);
var id_usaha = data_usaha.id_usaha;
var total_bobot_pesanan = parseInt(0);

$(document).ready(onDeviceReady);
function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

// device APIs are available
//
function onDeviceReady() {
    loadPesananPriority();
    loadKurir();
    loadKendaraan();
    // loadJamPengiriman();
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
    document.addEventListener("menubutton", onMenuKeyDown, false);
    document.addEventListener("backbutton", onBackKeyDown, false);
    document.querySelector("#lanjutkan-pengiriman").addEventListener("click", lanjut_pengiriman, false);
    // Add similar listeners for other events
}

function onPause() {
    // Handle the pause event
}

function onResume() {
    // Handle the resume event
}

function onMenuKeyDown() {
    // Handle the menubutton event
}

function onBackKeyDown() {
    // Handle the back button
}

function lanjut_pengiriman() {
    var form = $("form").serializeArray();
    form.push({ name: "priority_pesanan", value: localStorage.priority });
    form.push({ name: "id_pj", value: localStorage.id_akun });
    console.log(form);

    // $.ajax({
    //   url: base_url + "Pemesanan/procced_order_to_delivery",
    //   type: "POST",
    //   data: form,
    //   success: onSuccessPengiriman
    // });
    $.post(base_url + "Pemesanan/procced_order_to_delivery", form).then(onSuccessPengiriman);
}

function onSuccessPengiriman(response, status) {
    console.log(response);
    console.log(status);
    let id_pengiriman = response.id_pengiriman;
    let data_pengiriman = JSON.stringify(response.data_pengiriman);
    localStorage.setItem("id_pengiriman", id_pengiriman);
    // localStorage.setItem("data_pengiriman", data_pengiriman);
    window.location.assign("../../kurir/lacak-pengiriman.html");
}

function loadPesananPriority() {
    var priority = JSON.parse(localStorage.priority);
    $.post(API_PESANAN_PRIORITY, { pesanan: priority }).then(onSuccessLoadPesananPriority);
}

function onSuccessLoadPesananPriority(response, status) {
    if (status == "success") {
        // PROSES PESANAN PRIORITY
        var data_pesanan_priority = response.data_pesanan_priority;
        console.log("data_pesanan_priority : ", data_pesanan_priority.length);
        var html_priority = '<p class="center black-text">PRIORITAS</p>';
        $.each(data_pesanan_priority, (k, v) => {
            var detail_pembeli = v.detail_pembeli;
            html_priority += '<div class="card" id="list-pesanan-' + v.id_pemesanan + '"><ul class="collection"><li class="collection-item"><span class="title" id="nama_pb">' + detail_pembeli.nama_pb + '<br><span>' + detail_pembeli.alamat_pb + '</span></span><p class="teal-text" id="jenis-pengiriman-' + v.no_pesanan + '" style="position: relative; text-align: right;">(Pengiriman ' + v.tipe_pengiriman + ')</p></li></ul></div>';
            let detail_pesanan = v.detail_pesanan;
            total_bobot_pesanan += parseInt(detail_pesanan.berat_akhir);
        });
        console.log(html_priority);
        if (data_pesanan_priority.length == 0) {
            empty_priority();
        } else {
            document.getElementById("pesanan-prioritas").innerHTML = html_priority;
        }

        // PROSES PESANAN NON PRIORITY
        var data_pesanan_non_priority = response.data_pesanan_non_priority;
        // console.log(data_pesanan);
        var html_normal = '';
        $.each(data_pesanan_non_priority, (k, v) => {
            var detail_pembeli = v.detail_pembeli;
            html_normal += '<div class="card" id="list-pesanan-' + v.id_pemesanan + '"><ul class="collection"><li class="collection-item"><span class="title" id="nama_pb">' + detail_pembeli.nama_pb + '<br><span>' + detail_pembeli.alamat_pb + '</span></span><p class="teal-text" id="jenis-pengiriman-' + v.no_pesanan + '" style="position: relative; text-align: right;">(Pengiriman ' + v.tipe_pengiriman + ')</p></li></ul></div>';
            let detail_pesanan = v.detail_pesanan;
            total_bobot_pesanan += parseInt(detail_pesanan.berat_akhir);
        });
        if (html_normal == '') {
            empty_pesanan();
        } else {
            document.getElementById("pesanan-normal").innerHTML = html_normal;
        }
    }
}

function empty_priority() {
    var html_priority = '<p class="center black-text">PRIORITAS</p>';
    html_priority += '<div class="card"><ul class="collection"><li class="collection-item"><span class="title" id="prioritas-kosong">Prioritas Kosong<span></li></ul></div>';
    document.getElementById("pesanan-prioritas").innerHTML = html_priority;
}

function loadPesananNonPriority() {
    var priority = JSON.parse(localStorage.priority);
    $.post(API_PRODUK_NON_PRIORITY, { pesanan: priority }).then(onSuccessLoadPesananNonPriority);

}

function onSuccessLoadPesananNonPriority(response, status) {
    console.log(response);
    if (response.statusMessage == "success" && status == "success") {

    }
}

function empty_pesanan() {
    var html_normal = '';
    html_normal += '';
    document.getElementById("pesanan-normal").innerHTML = html_normal;
}

function loadKurir() {
    $.getJSON(API_KURIR, { id_usaha: id_usaha }).then(onSuccessLoadKurir);
}

function onSuccessLoadKurir(response, status) {
    if (status == "success") {
        var html_kurir = '';
        var data_kurir = response.data;
        $.each(data_kurir, (k, v) => {
            html_kurir += '<p style="text-align: left;">' +
                '<label class="btn white black-text" for="kurir-' + v.id_kurir + '" style="width: 100%; text-align: left;">' +
                '<input type="radio" id="kurir-' + v.id_kurir + '" name="kurir" value="' + v.id_kurir + '" />' +
                '<span>' + v.nama_kurir + '</span>' +
                '</label>' +
                '</p>';
        });
        if (html_kurir == '') {
            empty_kurir();
        } else {
            $("#pilih-kurir").append(html_kurir);
        }
    }
}

function empty_kurir(params) {

}

function loadKendaraan() {
    $.getJSON(API_KENDARAAN_PENJUAL, { id_usaha: id_usaha }).then(onSuccessLoadKendaraan);
}

function onSuccessLoadKendaraan(response, status) {
    if (status == "success") {
        var html_kendaraan = '';
        var data_kendaraan = response.data_kendaraan;
        $.each(data_kendaraan, (k, v) => {
            if (parseInt(v.kapasitas_kendaraan) >= total_bobot_pesanan) {
                html_kendaraan += '<p style="text-align: left;">' +
                    '<label class="btn white black-text" for="kendaraan-' + v.id_kendaraan + '" style="width: 100%; text-align: left;">' +
                    '<input type="radio" id="kendaraan-' + v.id_kendaraan + '" name="kendaraan" value="' + v.id_kendaraan + '" />' +
                    '<span>' + v.jenis_kendaraan + ' (' + v.plat_kendaraan + ')</span>' +
                    '</label>' +
                    '</p>';
            }

        });
        if (html_kendaraan == '') {

        } else {
            $("#pilih-kendaraan").append(html_kendaraan);
        }
    }
}

function loadJamPengiriman(params) {
    $.getJSON(API_JAM_PENGIRIMAN, { id_usaha: id_usaha }).then(onSuccessLoadJamPengirman);
}

function onSuccessLoadJamPengirman(response, status) {
    if (status == "success") {
        var html_jam = '';
        var jam_pengiriman = response;
        console.log(jam_pengiriman);
        $.each(jam_pengiriman, (k, v) => {
            html_jam += '<p style="text-align: left;">' +
                '<label class="btn white black-text" for="jam-pengiriman-' + v.id_jampengiriman + '" style="width: 100%; text-align: left;">' +
                '<input type="radio" id="jam-pengiriman-' + v.id_jampengiriman + '" name="jam_pengiriman" value="' + v.id_jampengiriman + '" />' +
                '<span>' + v.jam_pengiriman + '</span>' +
                '</label>' +
                '</p>';
        });
        console.log(html_jam);
        if (html_jam == '') {

        } else {
            $("#pilih-jam-pengiriman").append(html_jam);
        }
    }
}
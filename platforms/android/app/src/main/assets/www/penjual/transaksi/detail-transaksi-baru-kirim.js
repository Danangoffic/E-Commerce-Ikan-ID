$('.modal').modal();
$('.materialboxed').materialbox();
// var local = JSON.parse(localStorage.DetailPesanan);
var data_usaha = JSON.parse(localStorage.data_usaha);
var DetailPesanan = null;
var id_pembayaran;

// $(document).ready(onDeviceReady);

function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}
// device APIs are available
//
function onDeviceReady() {
    loadDetailTransaksi();
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
    document.addEventListener("menubutton", onMenuKeyDown, false);
    // Add similar listeners for other events
    document.addEventListener('backbutton', onBackKeyDown, false);
    document.getElementById("verifikasi_pesanan").addEventListener("click", verifikasiPesanan, false);
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

function loadDetailTransaksi() {

    var idPemesanan = localStorage.id_pesanan, id_usaha = data_usaha.id_usaha, type = localStorage.JenisPengiriman;

    $.getJSON(API_DETAIL_PESANAN_PENJUAL, { type: type, idPemesanan: idPemesanan, id_usaha: id_usaha })
        .then(onSuccessDetail).done(onDoneDetail);
}

function onSuccessDetail(e, status) {
    // STATUS === SERVICE API SUCCESS STATUS SENT DATA
    if (e.responseMessage == "success" && status == "success") {
        $("#display-waktu-pembayaran").hide();
        console.log(status);
        if (DetailPesanan != e.dataPesanan) {
            DetailPesanan = e.dataPesanan;
            var DataPembayaran = DetailPesanan.DataPembayaran;
            id_pembayaran = DataPembayaran.id_pembayaran;
            if (DataPembayaran.waktu_pembayaran != null) {
                var html_lihatstruk = '<div class="card"><ul class="collection"><li onclick= "lihatmodal(\'' + DetailPesanan.idPemesanan + '\')" class="collection-item center">Lihat Struk</li></ul></div>';
                var html_verifikasiPesanan = '<div class="card"><ul class="collection"><li onclick= "return $(\'#modalVerifikasi\').modal(\'open\')" class="collection-item center"><b>Verifikasi Pesanan</b></li></ul></div>';
                // $(".pembayaranDP").before().html(html_lihatstruk);
                $(".status-pemesanan").html("Perlu Konfirmasi");
                $(".status-pemesanan").removeClass("red accent-2").addClass("orange");
                $("#display-waktu-pembayaran").show();
                $("#waktu-pembayaran").html(DataPembayaran.newDatePembayaran);
                $("#additionalPaymenInfo").html(html_lihatstruk + html_verifikasiPesanan);
                // $(".total-pemasukkan").parent().parent().prepend('')
                // $("#verifikasi_pesanan").click(function () {
                //   verifikasiPesanan(id_pembayaran);
                // });
                
            }
            localStorage.setItem("status", DetailPesanan.statusPengiriman);
        }
    }
}

function onDoneDetail() {
    if (storage.status !== "Baru") {
        window.history.back();
    }
    // var StatusPemesanan = storage.getItem("status");
    var IDPESANAN = DetailPesanan.ID;
    var TotalHargaAll = DetailPesanan.TotalHargaAll;
    var MinTransfer = TotalHargaAll * (30 / 100);
    var SisaTagihan = TotalHargaAll - MinTransfer;
    var BiayaPengiriman = DetailPesanan.BiayaPengiriman;
    var AllPurchaseProduk = DetailPesanan.AllPurchaseProduk;
    var waktuPemesanan = DetailPesanan.waktuPemesanan;
    var tglPengiriman = DetailPesanan.tglPengiriman;
    var TotalHargaProduk = DetailPesanan.TotalHargaProduk;
    var DataUsaha = DetailPesanan.DataUsaha;
    var DataPembeli = DetailPesanan.DataPembeli;
    var Alamat = DataPembeli.alamat_pb;
    var nama_usaha = DataUsaha.nama_usaha;
    var IdUsaha = DataUsaha.id_usaha;
    var JenisPengiriman = DetailPesanan.JenisPengiriman;
    var TanggalPengiriman = DetailPesanan.tglPengiriman;
    var TotalProdukPesanan = DetailPesanan.TotalProduk;
    var TotalBeratProduk = DetailPesanan.TotalBeratProduk;
    // var TotalProduk = DetailPesanan.TotalProduk;
    console.log("TotalBeratProduk : " + TotalBeratProduk);
    var BiayaPengiriman = DetailPesanan.BiayaPengiriman;
    var DataPembayaran = DetailPesanan.DataPembayaran;
    var metode_pembayaran = DataPembayaran.metode_pembayaran;
    var jarak = (DetailPesanan.jarak!==null) ? DetailPesanan.jarak + "&nbsp;Km" : "";
    // $(".status-pemesanan").html("<b class='white-text'>"+StatusPemesanan+"</b>");
    $(".NoPesanan").html(IDPESANAN);
    $(".WaktuPemesanan").html(waktuPemesanan);
    var HtmlProduk = '<li class="collection-item"><h6 class="nama-toko"></h6></li>' +
        '<li class="collection-item center"><b>DAFTAR PRODUK</b></li>';
    $.each(AllPurchaseProduk, function (i, isi) {
        var FotoProduk = base_url + '/foto_usaha/produk/' + isi.foto_produk;
        var NamaProduk = isi.nama_produk + ' ' + isi.nama_variasi;
        var HargaProduk = isi.harga;
        var TotalProduk = isi.jml_produk;
        HtmlProduk += '<li class="collection-item avatar"><img src="' + FotoProduk + '" alt="" class="circle">' +
            '<span class="title">' + NamaProduk + '</span>' +
            '<p class="orange-text">Rp' + formatNumber(HargaProduk) + '<br></p>' +
            '<span class="secondary-content teal-text darken-1">' + TotalProduk + '&nbsp Ons</span></li>';
    });
    HtmlProduk += '<li class="collection-item teal-text darken-1"><b>Total Harga Produk :<span class="secondary-content teal-text darken-1 total-harga-produk">Rp</span></b></a>';
    $(".collection-product").html(HtmlProduk);
    $(".nama-toko").html("<a href='#!' onclick='GoToDetailUsaha(" + IdUsaha + ")'>" + nama_usaha + "</a>");
    $(".alamat").html(Alamat);
    $(".tipe-pengiriman").html(JenisPengiriman);
    $(".tanggal-pengiriman").html(TanggalPengiriman);
    $(".total-jarak").html(jarak);
    $(".biaya-pengiriman").html("Rp" + formatNumber(BiayaPengiriman));
    $(".tipe-pembayaran").html(metode_pembayaran);
    $(".total-harga-produk").html("Rp" + formatNumber(TotalHargaProduk));
    $(".total-pemasukkan").html("Rp" + formatNumber(TotalHargaAll));
    $(".pemasukkan1").html("Rp" + formatNumber(MinTransfer));
    $(".pemasukkan2").html("Rp" + formatNumber(SisaTagihan));
    var html_lihatstruk = '<li onclick= "lihatmodal(\'' + DetailPesanan.idPemesanan + '\')" class="collection-item center">Lihat Struk</li>';
    if (storage.getItem("metodePembayaran") == "Full Transfer") {
        $(".metode_pembayaran").html("Bayar Penuh Transfer");
        $(".pembayaranDP").hide();
        $(".jenis-text-payment").html("TOTAL PEMASUKKAN");
        $(".text-payment").html("Total Pemasukkan :");
        $(".text-pemasukkan").html(formatNumber(TotalHargaAll))
    } else if (storage.getItem("metodePembayaran") == "Transfer Cash") {
        $(".metode_pembayaran").html("Transfer dan Tunai");
        $(".pembayaranDP").show();
        $(".jenis-text-payment").html("PEMASUKKAN KE-1");
        $(".text-payment").html("Pemasukkan Ke-1 :");
        $(".text-pemasukkan").html(formatNumber(MinTransfer))
    } else if (storage.getItem("metodePembayaran") == "Full Cash") {
        $(".metode_pembayaran").html("Bayar Penuh Tunai");
    }
    setTimeout(loadDetailTransaksi, 10000);
}

function lihatmodal(idPemesanan) {
    $.getJSON(API_DETAIL_STRUK_PAYMENT, { idPemesanan: idPemesanan }).then(onSuccessLoadStruk).done(onDoneLoadStruk);
}

function onSuccessLoadStruk(e) {
    if (e.response == "success") {
        $("#background-struk").attr({ "src": base_url + "foto_struk/" + e.struk_pembayaran });
    }
}
function onDoneLoadStruk() {
    $("#modalStruk").modal("open");
}

function verifikasiPesanan() {
    $.ajax({
        url: API_VERIFY_PAYMENT,
        data: { id_pembayaran: id_pembayaran, idPemesanan: localStorage.id_pesanan },
        dataType: "json",
        success: function (e, status) {
            if(status=="success"){
                M.toast({html:"Verifikasi Berhasil"});
                setTimeout(function(){window.location.replace("detail-transaksi-terbayar-kirim.html");}, 500);
            }
        }
    })
}

function LanjutkanPembayaran() {
    console.log("Lanjutkan Pembayaran");
}

function BatalkanPesanan() {
    console.log("Batalkan Pesanan");
}

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}
function onBackKeyDown() {
    if (cordova.platformId !== 'windows') {
        // return window.location.href = "transaksi.html";
    }

    if (window.location.href !== "login.html") {
        location.replace("transaksi.html");
    } else {
        throw new Error('Exit'); // This will suspend the app
    }
}
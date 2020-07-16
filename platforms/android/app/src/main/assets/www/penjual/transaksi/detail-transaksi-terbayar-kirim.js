$(".modal").modal();
$('.materialboxed').materialbox();
// var DetailPesanan = JSON.parse(localStorage.DetailPesanan);
var app = {
  DetailPesanan: JSON.parse(localStorage.DetailPesanan),
  init: function () {
    document.addEventListener("deviceready", app.onDeviceReady, false);
  },
  onDeviceReady: () => {
    // if (storage.status !== "Terbayar") {
    //   window.location.href = "transaksi.html";
    // }
    app.loadDetailTransaksi();
    document.addEventListener("pause", app.onPause, false);
    document.addEventListener("resume", app.onResume, false);
    document.addEventListener("menubutton", app.onMenuKeyDown, false);
    document.addEventListener('backbutton', app.onBackKeyDown, false);
    document.getElementById("back").addEventListener("click", app.onBackKeyDown, false);
  },
  loadDetailTransaksi: () => {
    var idPemesanan = localStorage.id_pesanan, id_usaha = app.DetailPesanan.DataUsaha.id_usaha, type = localStorage.JenisPengiriman;
    $.getJSON(API_DETAIL_PESANAN_PENJUAL, { type: type, idPemesanan: idPemesanan, id_usaha: id_usaha }).then(app.onSuccessDetail).always(app.onCompleteDetail);
  },
  onSuccessDetail: (e) => {
    if (e.responseMessage == "success") {
      app.DetailPesanan = (app.DetailPesanan !== e.dataPesanan) ? e.dataPesanan : app.DetailPesanan;
    }
  },
  onCompleteDetail: () => {
    var IDPESANAN = app.DetailPesanan.ID;
    var TotalHargaAll = app.DetailPesanan.TotalHargaAll;
    var MinTransfer = TotalHargaAll * (30 / 100);
    var SisaTagihan = TotalHargaAll - MinTransfer;
    var BiayaPengiriman = app.DetailPesanan.BiayaPengiriman;
    var AllPurchaseProduk = app.DetailPesanan.AllPurchaseProduk;
    var waktuPemesanan = app.DetailPesanan.waktuPemesanan;
    var waktuPembayaran = app.DetailPesanan.DataPembayaran.waktu_pembayaran;
    var tglPengiriman = app.DetailPesanan.tglPengiriman;
    var TotalHargaProduk = app.DetailPesanan.TotalHargaProduk / 10;
    var DataUsaha = app.DetailPesanan.DataUsaha;
    var DataPembeli = app.DetailPesanan.DataPembeli;
    var Alamat = DataPembeli.alamat_pb;
    var nama_usaha = DataUsaha.nama_usaha;
    var IdUsaha = DataUsaha.id_usaha;
    var JenisPengiriman = app.DetailPesanan.JenisPengiriman;
    var TanggalPengiriman = app.DetailPesanan.tglPengiriman;
    var TotalProdukPesanan = app.DetailPesanan.TotalProduk;
    var TotalBeratProduk = app.DetailPesanan.TotalBeratProduk * 10;
    console.log("TotalBeratProduk : " + TotalBeratProduk);
    var BiayaPengiriman = app.DetailPesanan.BiayaPengiriman;
    var DataPembayaran = app.DetailPesanan.DataPembayaran;
    var metode_pembayaran = (DataPembayaran.metode_pembayaran == "Full Transfer") ? "Bayar Penuh Transfer" : DataPembayaran.metode_pembayaran;
    // $(".status-pemesanan").html(StatusPemesanan);
    $(".NoPesanan").html(IDPESANAN);
    $(".WaktuPemesanan").html(waktuPemesanan);
    $("#WaktuPembayaran").html(app.DetailPesanan.DataPembayaran.newDatePembayaran);
    var HtmlProduk = '';
    HtmlProduk = '<li class="collection-item"><h6 class="nama-toko"></h6></li>' +
      '<li class="collection-item"><h5>DAFTAR PRODUK</h5></li>';
    $.each(AllPurchaseProduk, function (i, isi) {
      var FotoProduk = base_url + '/foto_usaha/produk/' + isi.foto_produk;
      var NamaProduk = isi.nama_produk + ' ' + isi.nama_variasi;
      var HargaProduk = isi.harga;
      var TotalProduk = isi.jml_produk;
      HtmlProduk += '<li class="collection-item avatar"><img src="' + FotoProduk + '" alt="" class="circle">' +
        '<span class="title">' + NamaProduk + '</span>' +
        '<p class="orange-text">Rp' + app.formatNumber(HargaProduk) + '<br></p>' +
        '<span class="secondary-content teal-text darken-1">' + TotalProduk + '&nbsp Ons</span></li>';
    });
    HtmlProduk += '<li class="collection-item teal-text darken-1"><b>Total Harga Produk: <span class="secondary-content total-harga-produk"></span></b></li>';
    $(".collection-product").html(HtmlProduk);
    $(".nama-toko").html("<a href='#!' onclick='GoToDetailUsaha(" + IdUsaha + ")'>" + nama_usaha + "</a>");
    $(".alamat").html(Alamat);
    $(".tipe-pengiriman").html(JenisPengiriman);
    $(".tanggal-pengiriman").html(TanggalPengiriman);
    $("#total-jarak").html(app.DetailPesanan.jarak + "&nbsp;Km");
    $(".biaya-pengiriman").html("Rp" + app.formatNumber(BiayaPengiriman));
    $(".tipe-pembayaran").html(metode_pembayaran);
    $(".total-harga-produk").html("Rp" + app.formatNumber(TotalHargaProduk));
    $(".total-pemasukkan").html("Rp" + app.formatNumber(TotalHargaAll));

    $(".minimal-transfer").html("Rp" + app.formatNumber(MinTransfer));
    $(".sisa-tagihan").html("Rp" + app.formatNumber(SisaTagihan));
    if (storage.getItem("metodePembayaran") == "Full Transfer") {
      $(".pembayaranDP").hide();
      $(".jenis-text-payment").html("TOTAL PEMASUKAN");
    } else if (storage.getItem("metodePembayaran") == "Transfer Cash") {
      $(".tipe-pembayaran").html("Transfer dan Tunai");
      $(".pembayaranDP").show();
      $(".jenis-text-payment").html("PEMASUKKAN KE-1");
    }
    setTimeout(app.loadDetailTransaksi, 10000);
  },
  formatNumber: function (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
  },
  onPause: function () {

  },
  onResume: function () {

  },
  onMenuKeyDown: function () {

  },
  onBackKeyDown: function () {
    if (cordova.platformId !== 'windows') {
      return window.location.href = "transaksi.html";
    }

    if (window.location.href !== firstPageUrl) {
      window.history.back();
    } else {
      throw new Error('Exit'); // This will suspend the app
    }
  }
}
// $(document).ready(app.onDeviceReady);

function onLoad() {
  app.init();
}
    // device APIs are available
    //

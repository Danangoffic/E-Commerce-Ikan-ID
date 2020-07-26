$('.modal').modal();
var DetailPesanan = JSON.parse(localStorage.DetailPesanan);
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
    document.getElementById("verifikasi_pesanan").addEventListener("click", verifikasiPesanan, false);
    // Add similar listeners for other events

    document.addEventListener('backbutton', onBackKeyDown, false);
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
    if (cordova.platformId !== 'windows') {
        location.replace("transaksi.html");
        // return window.location.href = "transaksi.html";
    }

    if (window.location.href !== "login.html") {
        location.replace("transaksi.html");
    } else {
        throw new Error('Exit'); // This will suspend the app
    }
}

function selesaiPesanan(idPemesanan) {
    var data = { id: idPemesanan };
    $.post(API_PESANAN_SELESAI, data).then(onSuccessPesananSelesai);
}

function onSuccessPesananSelesai(e) {
    if (e.message == "success") {
        M.toast({ html: 'Sukses' });
        setTimeout(loadDetailTransaksi, 1500);
    }
}

function additionalInfo(DetailPesanan) {
    var pembayaran_pesanan = DetailPesanan.DataPembayaran;
    if (DetailPesanan.DataPembayaran.metode_pembayaran == "Full Transfer") {
        //FULL TRANSFER
        $(".metode_pembayaran").html("Bayar Penuh Transfer");
        $(".pembayaranDP").hide();
        console.log("DetailPesanan.statusPengiriman: " + DetailPesanan.statusPengiriman);
        if (DetailPesanan.statusPengiriman == "Baru") {
            var card_struk="", card_verifikasi="", card_info="";
            if(DetailPesanan.DataPembayaran.status_pembayaran!==""){
                card_struk = '<div class="card"><ul class="collection"><li onclick= "lihatmodal(\'' + DetailPesanan.idPemesanan + '\')" class="collection-item center black-text">Lihat Struk</li></ul></div>';
                card_verifikasi = '<div class="card"><ul class="collection"><li onclick= "return $(\'#modalVerifikasi\').modal(\'open\')" class="collection-item center black-text"><b>Verifikasi Pesanan</b></li></ul></div>';
            }
            card_info = '<p class="flow-text center" style="font-size: small;">Siapkan produk setelah <b>PEMBELI MELAKUKAN PEMBAYARAN</b> sebesar <b><a class="waves-effect waves-light modal-trigger white-text" href="#modal2">TOTAL PEMASUKKAN</a></b></p>';
            // BARU
            $(".status-pemesanan").addClass("red accent-2");
            $(".status-pemesanan").html("BELUM BAYAR");
            $(".additional-information").html(card_struk+card_verifikasi+card_info);
        } else if (DetailPesanan.statusPengiriman == "Terbayar") {
            // TERBAYAR
            // $(".status-pemesanan").removeClass("red accent-2");
            $(".status-pemesanan").addClass("green");
            $(".status-pemesanan").html("SUDAH BAYAR");
            $(".additional-information").html('<p class="flow-text center" style="font-size: small">Siapkan produk di hari <br><a class="waves-effect waves-light modal-trigger white-text" href="#modal1"><b>TANGGAL PENGAMBILAN<b></a></p>');
            var contentFTPaid1 = '<div class="card green" style="margin-bottom: 8px">' +
                '<div class="card-content white-text">' +
                '</div>' +
                '</div>';
            var contentFTPaid2 = '<div class="fixed-action-btn" style="margin-top: 16px;">' +
                '<div class="card-action white" style="padding: 8px">' +
                '</div>' +
                '</div>';
            $("#additionalInformation2").html(contentFTPaid1);
            $("#additionalInformation2").after(contentFTPaid2);
        }
    } else if (DetailPesanan.DataPembayaran.metode_pembayaran == "Transfer Cash") {
        //TRANSFER CASH (DP)
        $(".metode_pembayaran").html("Transfer dan Tunai");
        if (pembayaran_pesanan.status_pembayaran == "DP" || pembayaran_pesanan.status_pembayaran == "Lunas") {
            //TERBAYAR
            $(".status-pemesanan").addClass("orange");
            $(".status-pemesanan").html("TAGIHAN 2 BELUM DIBAYAR");
            var card_struk="", card_verifikasi="", card_info="";
            var btn_struk = "", btn_verifikasi="";
            if(DetailPesanan.DataPembayaran.status_pembayaran!==""){
                btn_struk = '<button type="button" class="btn waves-effect waves-light" onclick= "lihatmodal(\'' + DetailPesanan.idPemesanan + '\')" style="width:100%; border-radius:8px; margin-bottom:12px;">Lihat Struk</button>';
                btn_verifikasi = '<button type="button" class="btn waves-effect waves-light" onclick= "return $(\'#modalVerifikasi\').modal(\'open\')" style="width:100%; border-radius:8px; margin-bottom:12px;">Verifikasi Pesanan</button>';
            }
            var cardAdditional = '<p class="center" style="font-size: small">Siapkan produk di hari <b>' + '<a class="waves-effect waves-light modal-trigger white-text" href="#modal1">TANGGAL PENGAMBILAN</a></b>dan ingatkan Pembeli untuk melakukan pembayaran sebesar<b>' +
                '<a class="waves-effect waves-light modal-trigger white-text" href="#modal2">&nbsp PEMASUKKAN KE-2</a></b></p>';
            
            // cardAdditional += buttonAdditional;
            $(".additional-information").html(cardAdditional);
            $(".additional-information").parent().before(btn_struk+btn_verifikasi);
        } else {
            //BARU
            $(".status-pemesanan").addClass("red accent-2");
            $(".status-pemesanan").html("TAGIHAN 1 BELUM DIBAYAR");
            // $(".collection-detail-pembayaran").append(liCollection);
            var cardAdditional = '<p class="flow-text center" style="font-size: small;">Siapkan produk setelah <b>PEMBELI MELAKUKAN PEMBAYARAN</b> sebesar<b><a class="waves-effect waves-light modal-trigger white-text" href="#modal2">&nbsp PEMASUKKAN KE-1</a></b></p>';
            $(".additional-information").html(cardAdditional);
        }
    } else if (DetailPesanan.DataPembayaran.metode_pembayaran == "Full Cash") {
        // FULL CASH / TUNAI
        $(".metode_pembayaran").html("Bayar Penuh Tunai");
        $(".pembayaranDP").hide();
        if (DetailPesanan.statusPengiriman == "Baru") {
            // BARU (BELUM BAYAR)
            $(".status-pemesanan").addClass("red accent-2");
            $(".status-pemesanan").html("BELUM BAYAR");
            document.getElementsByClassName("status-pemesanan").innerHtml = "Belum Bayar";
            var cardAdditional = '<p class="flow-text center" style="font-size: small;">Siapkan produk di hari <b><a class="waves-effect waves-light modal-trigger white-text" href="#modal1">TANGGAL PENGAMBILAN</a></b> dan ingatkan Pembeli umtuk melakukan pembayaran sebesar <b><a class="waves-effect waves-light modal-trigger white-text" href="#modal2">TOTAL PEMASUKKAN</a></b></p>';
           
            
            $(".additional-information").html(cardAdditional);
        }
    }
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

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

function loadDetailTransaksi() {
    var idPemesanan = localStorage.id_pesanan, id_usaha = DetailPesanan.DataUsaha.id_usaha, type = localStorage.JenisPengiriman;
    $.getJSON(API_DETAIL_PESANAN_PENJUAL, { type: type, idPemesanan: idPemesanan, id_usaha: id_usaha }).then(onSuccess).always(onComplete);
}

function onSuccess(e) {
    if (e.responseMessage == "success") {
        DetailPesanan = e.dataPesanan;
    }
}

function onComplete() {
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
    console.log("TotalBeratProduk : " + TotalBeratProduk);
    var BiayaPengiriman = DetailPesanan.BiayaPengiriman;
    var DataPembayaran = DetailPesanan.DataPembayaran;
    var metode_pembayaran = DataPembayaran.metode_pembayaran;
    console.log(DataPembayaran);
    // $(".status-pemesanan").html(StatusPemesanan);
    $(".NoPesanan").html(IDPESANAN);
    $(".WaktuPemesanan").html(waktuPemesanan);

    var HtmlProduk = '';
    HtmlProduk = '<li class="collection-item"><a href="#!"><h6 class="nama-toko"></h6></a></li>' +
        '<li class="collection-item center"><b>DAFTAR PRODUK</b></li>';
    $.each(AllPurchaseProduk, function (i, isi) {
        var FotoProduk = base_url + '/foto_usaha/produk/' + isi.foto_produk;
        var NamaProduk = isi.nama_produk + ' ' + isi.nama_variasi;
        var HargaProduk = isi.harga;
        var TotalProduk = isi.jml_produk;
        HtmlProduk += '<li class="collection-item avatar"><img src="' + FotoProduk + '" alt="" class="circle">' +
            '<span class="title">' + NamaProduk + '</span>' +
            '<p class="orange-text">Rp ' + HargaProduk + '<br></p>' +
            '<span class="secondary-content">' + TotalProduk * 10 + '&nbsp Ons</span></li>';
    });
    HtmlProduk += '<li class="collection-item teal-text darken-1"><b >Total Harga Produk :<span class="secondary-content total-harga-produk">Rp</span></b></li>';
    $(".collection-product").html(HtmlProduk);
    $(".nama-toko").html("<a href='#!' onclick='GoToDetailUsaha(" + IdUsaha + ")'>" + nama_usaha + "</a>");
    $(".alamat").html(Alamat);
    $(".tipe-pengiriman").html(JenisPengiriman);
    $(".tanggal-pengiriman").html(TanggalPengiriman);
    $(".total-berat").html(TotalBeratProduk + "&nbsp;Ons");
    $(".biaya-pengiriman").html("Rp " + formatNumber(BiayaPengiriman));
    $(".tipe-pembayaran").html(metode_pembayaran);
    $(".total-harga-produk").html("Rp&nbsp;" + formatNumber(TotalHargaProduk));
    $(".total-pemasukkan").html("Rp&nbsp;" + formatNumber(TotalHargaAll));
    $(".pemasukkan1").html("Rp&nbsp;" + formatNumber(MinTransfer));
    $(".pemasukkan2").html("Rp&nbsp;" + formatNumber(SisaTagihan));
    console.log("metode_pembayaran : " + metode_pembayaran);
    additionalInfo(DetailPesanan);
    if (metode_pembayaran == "Full Transfer") {
        $(".jenis-text-payment").html("TOTAL PEMASUKKAN");
        $(".text-payment").html("Total Pemasukkan :");
        $(".total-pemasukkan").html("Rp" + formatNumber(TotalHargaProduk));
        $(".text-pemasukkan").html(formatNumber(TotalHargaProduk));
    } else if (metode_pembayaran == "Transfer Cash") {
        if (DetailPesanan.statusPengiriman == "Terbayar") {
            $(".pembayaranDP").show();
            $(".jenis-text-payment").html("PEMASUKKAN KE-2");
            $(".text-payment").html("Pemasukkan Ke-2 :");
            $(".text-pemasukkan").html(formatNumber(SisaTagihan))
        } else if (DetailPesanan.statusPengiriman == "Baru") {
            $(".pembayaranDP").show();
            $(".jenis-text-payment").html("PEMASUKKAN KE-1");
            $(".text-payment").html("Pemasukkan Ke-1 :");
            $(".text-pemasukkan").html(formatNumber(MinTransfer))
        }
    } else if (metode_pembayaran == "Full Cash") {
        $(".jenis-text-payment").html("TOTAL PEMASUKKAN");
        $(".text-payment").html("Total Pemasukkan :");
        $(".total-pemasukkan").html("Rp&nbsp;" + formatNumber(TotalHargaProduk));
        $(".text-pemasukkan").html("Rp&nbsp;" + formatNumber(TotalHargaProduk));
    }
    $(".selesai-pesanan").click(function () {
        selesaiPesanan(DetailPesanan.idPemesanan);
    });
    
}
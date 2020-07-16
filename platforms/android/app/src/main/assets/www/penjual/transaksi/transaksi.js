// var Pesanan, PesananPaid, PesananSent, PesananTake;
var idUsaha = "";
var app = {
    idUsaha: null,
    id_akun: localStorage.id_akun,
    init: function () {
        document.addEventListener("deviceready", app.onDeviceReady, false);
    },
    onDeviceReady: () => {
        $(".modal").modal();
        document.addEventListener("pause", app.onPause, false);
        document.addEventListener("resume", app.onResume, false);
        document.addEventListener("menubutton", app.onMenuKeyDown, false);
        document.addEventListener('backbutton', app.onBackKeyDown, false);
        app.get_usaha();
        const simpan_berat = document.getElementById("simpan-data-verifikasi-berat-detail-pesanan");
        simpan_berat.addEventListener("click", app.send_simpan_berat_akhir, false);
        document.getElementById("keluar").addEventListener("click", () => { navigator.app.exitApp(); }, false);
        document.getElementById("proses-pesanan-hari-ini").addEventListener("click", function () {
            window.location.href="proses-pesanan-hari-ini.html";
            // $("html").load("proses-pesanan-hari-ini.html");
        });
    },
    get_usaha: () => {
        $.getJSON(API_GET_USAHA_BY_AKUN, { id_akun: app.id_akun }).then(app.onSuccessLoadUsahaByAkun);
    },
    onPause: function () {

    },
    onResume: () => {
        app.get_usaha();
    },
    onMenuKeyDown: () => {

    },
    onBackKeyDown: () => {
        $("#modalExit").modal("open");

    },
    onSuccessLoadUsahaByAkun: (e, status) => {
        if (status == "success") {
            console.log(e);
            app.idUsaha = e.id_usaha;
            console.log(app.idUsaha);
            app.get_pesanan_default();
            app.get_transaksi_pengiriman();
            app.get_transaksi_today();
            // loadPesanan(idUsaha, "Pengiriman");
        }
    },
    get_transaksi_pengiriman: function () {
        $.getJSON(base_url + "Pemesanan/get_transaksi_pengiriman", { id_usaha: app.idUsaha, status: "Pengiriman" }).then(app.onSuccessLoadPesananPengiriman);
    },
    onSuccessLoadPesananPengiriman: function (result, status) {
        // console.log(result);
        var Html = '';
        if (status == "success") {
            var dataPesanan = result.dataPesanan;

            if (dataPesanan.length > 0) {
                $.each(dataPesanan, function (i, isi) {
                    var idPemesanan = isi.idPemesanan;
                    // console.log(idPemesanan);
                    var totalHargaAll = isi.TotalHargaAll;
                    var display = isi.display;
                    var namaProduk = display.namaProduk;
                    var hargaProduk = display.hargaProduk;
                    var totalProduk = display.totalProduk;
                    var fotoProduk = display.fotoProduk;
                    var JenisPengiriman = isi.JenisPengiriman;
                    var metode_pembayaran = isi.DataPembayaran.metode_pembayaran;
                    var StatusPemesanan = isi.statusPengiriman;
                    var DataPembayaran = isi.DataPembayaran;
                    var status_pembayaran, color_status_pembayaran;
                    var collection_item_status_pembayaran;
                    var data_pengiriman = isi.data_pengiriman;
                    if(data_pengiriman.status_pengiriman_pesanan=="pengantaran"){
                        status_pembayaran = "Pesanan Dikirim", color_status_pembayaran = " green green accent-1";
                        collection_item_status_pembayaran = '<li class="collection-item center' + color_status_pembayaran + '" id="status-pembayaran-' + isi.idPemesanan + '">' + status_pembayaran + '</li>';
                    }else if(data_pengiriman.status_pengiriman_pesanan=="menunggu"){
                        status_pembayaran = "Pesanan Menunggu Dikirim", color_status_pembayaran = " green green accent-1";
                        collection_item_status_pembayaran = '<li class="collection-item center' + color_status_pembayaran + '" id="status-pembayaran-' + isi.idPemesanan + '">' + status_pembayaran + '</li>';
                    }
                    Html += '<div class="card z-depth-3">' +
                        '<ul class="collection" onclick="GoToDetail(\'' + isi.idPemesanan + '\', \'' + StatusPemesanan + '\')">' +
                        collection_item_status_pembayaran +
                        '<li class="collection-item avatar">' +
                        '<img src="' + base_url + '/foto_usaha/produk/' + fotoProduk + '" alt="Foto ' + namaProduk + '" class="circle">' +
                        '<span class="title">' + namaProduk + '</span>' +
                        '<p class="orange-text">Rp' + app.formatNumber(hargaProduk) + '<br></p>' +
                        '<span class="secondary-content">' + totalProduk + ' Ons</span>' +
                        '</li>' +
                        '<li class="collection-item teal-text darken-1"><b>Total Pemasukkan :<span class="secondary-content orange-text">Rp' + app.formatNumber(totalHargaAll) + '</span></b></li>';

                    Html += '</ul></div>';

                });
            } else {
                Html = '<div id="baru" class="col s12" style="height: auto; padding: 0px 8px">' +
                    '<div class="row" style="display: relative; margin: 4px">' +
                    '<p class="flow-text center" style="font-size: small; width: 100%">Tidak ada Transaksi</p>' +
                    '</div>' +
                    '</div>';
            }
            console.log("status: " + status);
            $("#pengiriman").html(Html);
        } else {
            Html = "Pesanan Kosong";
            $("#pengiriman").html(Html);
        }
    },
    get_transaksi_today: function () {
        $.getJSON(base_url + "Pemesanan/get_transaksi_today", { id_usaha: app.idUsaha }).then(app.onSuccessLoadTransaksiToday);
    },
    onSuccessLoadTransaksiToday: (result, status) => {
        // console.log(result);
        var Html = '';
        if (status == "success") {
            var dataPesanan = result.dataPesanan;

            if (dataPesanan.length > 0) {
                $.each(dataPesanan, function (i, isi) {
                    var idPemesanan = isi.idPemesanan;
                    // console.log(idPemesanan);
                    var totalHargaAll = isi.TotalHargaAll;
                    var display = isi.display;
                    var namaProduk = display.namaProduk;
                    var hargaProduk = display.hargaProduk;
                    var totalProduk = display.totalProduk;
                    var fotoProduk = display.fotoProduk;
                    var JenisPengiriman = isi.JenisPengiriman;
                    var metode_pembayaran = isi.DataPembayaran.metode_pembayaran;
                    var status_pembayaran, color_status_pembayaran;
                    var collection_item_status_pembayaran;
                    var statusPengiriman = isi.statusPengiriman;
                    //   if (status == "Baru") {
                    //     StatusPemesanan = "Baru";
                    //   } else if (status == "Terbayar") {
                    //     StatusPemesanan = "Terbayar";
                    //   } else if (status == "Terkirim") {
                    //     StatusPemesanan = "Terkirim";
                    //   }
                    if (statusPengiriman == "Terbayar") {
                        status_pembayaran = "Berat Pesanan Perlu di Konfirmasi", color_status_pembayaran = " light-green accent-1";
                        collection_item_status_pembayaran = '<li class="collection-item center' + color_status_pembayaran + '" id="status-pembayaran-' + isi.idPemesanan + '">' + status_pembayaran + '</li>';
                    }
                    // console.log(" totalHargaAll: Rp " + totalHargaAll);
                    // console.log(" Yang perlu ditampilin: ");
                    // console.log(display);
                    Html += '<div class="card z-depth-3">' +
                        '<ul class="collection">' +
                        collection_item_status_pembayaran +
                        '<li class="collection-item avatar modal-trigger" data-target="modalBerat" onclick="app.verifikasi_berat(\'' + idPemesanan + '\')">' +
                        '<img src="' + base_url + '/foto_usaha/produk/' + fotoProduk + '" alt="Foto ' + namaProduk + '" class="circle">' +
                        '<span class="title">' + namaProduk + '</span>' +
                        '<p class="orange-text">Rp ' + app.formatNumber(hargaProduk) + '<br></p>' +
                        '<span class="secondary-content">' + totalProduk + ' Ons</span>' +
                        '</li>' +
                        '<li class="collection-item teal-text darken-1"><b>Total Pemasukkan :<span class="secondary-content orange-text">Rp ' + app.formatNumber(totalHargaAll) + '</span></b></li>';

                    Html += '</ul></div>';
                });
            } else {
                // Html = "Pesanan Kosong";
                Html = '<div id="baru" class="col s12" style="height: auto; padding: 0px 8px">' +
                    '<div class="row" style="display: relative; margin: 4px">' +
                    '<p class="flow-text center" style="font-size: small; width: 100%">Tidak ada Transaksi</p>' +
                    '</div>' +
                    '</div>';
            }
            document.getElementById("pesananhariini").innerHTML = Html;
        } else {
            document.getElementById("pesananhariini").innerHTML = Html;
        }
    },
    verifikasi_berat: (id_pemesanan) => {
        app.preload_table();
        app.ID_PEMESANAN = id_pemesanan;
        $.get(API_PRODUK_TO_VERIFY_WEIGHT_PESANAN, { id_pemesanan: id_pemesanan }).then(app.onSuccessDetilPesananToVerify);
    },
    ID_PEMESANAN: null,
    onSuccessDetilPesananToVerify: (response, status) => {
        if (status == "success") {
            var detail_pemesanan = response.detail_pemesanan;
            var html_table = '';
            $.each(detail_pemesanan, function (k, v) {
                var nama_produk = v.nama_produk + ' ' + v.nama_variasi;
                var berat_produk = v.jml_produk + ' Ons';
                var berat_akhir = (v.berat_akhir == null) ? 0 : v.berat_akhir;
                html_table += '<tr>';
                html_table += '<td style="font-size: medium;">' + nama_produk + '</td>';
                html_table += '<td style="font-size: medium;">' + berat_produk + '</td>';
                html_table += '<td><input form="berat-pesanan" placeholder="Berat Dalam Ons" name="berat[]" id="berat-' + v.id_produk + '" type="number" min="10" max="1000" value="' + berat_akhir + '" class="center" style="font-size: medium"><label for="berat-' + v.id_produk + '"></label></td>';
                html_table += '</tr>';
            });
            if (html_table !== '') {
                document.getElementById("data-verifikasi-berat-detail-pesanan").innerHTML = html_table;
            } else {
                html_table += '<tr>';
                html_table += '<td style="font-size: medium;" colspan="3" class="center">DATA GAGAL TERAMBIL</td>';
                html_table += '</tr>';
                document.getElementById("data-verifikasi-berat-detail-pesanan").innerHTML = html_table;
            }

            $("#modalBerat").modal("open");
        }
    },
    preload_table: () => {
        let HTML_TABLE_PRELOAD = '';
        HTML_TABLE_PRELOAD += '<tr>';
        HTML_TABLE_PRELOAD += '<td style="font-size: medium;" colspan="3" class="center">LOADING</td>';
        HTML_TABLE_PRELOAD += '</tr>';
        document.getElementById("data-verifikasi-berat-detail-pesanan").innerHTML = HTML_TABLE_PRELOAD;
    },
    send_simpan_berat_akhir: () => {
        const form = $("form[name=berat-pesanan]");
        const formData = {};
        $("input").each(function (index, node) {
            formData[node.name] = node.value;
        });
        formData['id_pemesanan'] = app.ID_PEMESANAN;
        console.log(formData);
        $.post(API_VERIFY_PRODUK_PESANAN_PESANAN, formData).then(app.onSuccessSimpan).always(app.onCompletlySimpan);
    },
    onSuccessSimpan: (response, status) => {
        console.log(response);
        if (status == "success") {
            app.ID_PEMESANAN = null;
            document.getElementById("pesananhariini").innerHTML = "";
            app.get_transaksi_today();
            app.get_pesanan_default();
            M.toast({ html: response.message });
            // $("#modalBerat").modal("close");
        } else {
            M.toast({ html: response.message });
        }
    },
    onCompletlySimpan: () => {
        $("#modalBerat").modal("close");
    },
    get_pesanan_default: () => {
        app.loadPesanan(app.idUsaha, "Baru");
        app.loadPesanan(app.idUsaha, "Terbayar");
        app.loadPesanan(app.idUsaha, "Siap Dikirim");
        app.loadPesanan(app.idUsaha, "Siap Diambil");
        app.loadPesanan(idUsaha, "Terkirim");
    },
    loadPesanan: (idUsaha, status) => {
        var data = { 'id_usaha': idUsaha, 'status': status };
        $.getJSON(API_PESANAN_PENJUAL, data).then(app.onSuccessPesananDefault);
    },
    onSuccessPesananDefault: (result, status) => {
        // console.log(result);
        var Html = '';
        if (status == "success") {
            var dataPesanan = result.dataPesanan;
            var status_pesanan = dataPesanan[0].statusPengiriman;

            if (dataPesanan.length > 0) {
                $.each(dataPesanan, function (i, isi) {
                    var idPemesanan = isi.idPemesanan;
                    // console.log(idPemesanan);
                    var totalHargaAll = isi.TotalHargaAll;
                    var display = isi.display;
                    var namaProduk = display.namaProduk;
                    var hargaProduk = display.hargaProduk;
                    var totalProduk = display.totalProduk;
                    var fotoProduk = display.fotoProduk;
                    var JenisPengiriman = isi.JenisPengiriman;
                    var metode_pembayaran = isi.DataPembayaran.metode_pembayaran;
                    var Status_pengiriman = isi.statusPengiriman;
                    var DataPembayaran = isi.DataPembayaran;
                    var status_pembayaran, color_status_pembayaran;
                    var collection_item_status_pembayaran;
                    //   if (status == "Baru") {
                    //     StatusPemesanan = "Baru";
                    //   } else if (status == "Terbayar") {
                    //     StatusPemesanan = "Terbayar";
                    //   } else if (status == "Terkirim") {
                    //     StatusPemesanan = "Terkirim";
                    //   }
                    if (DataPembayaran.status_pembayaran !== null && DataPembayaran.verifikasi == "0") {
                        status_pembayaran = "Perlu di Konfirmasi", color_status_pembayaran = " amber lighten-4";
                        collection_item_status_pembayaran = '<li class="collection-item center' + color_status_pembayaran + '" id="status-pembayaran-' + isi.idPemesanan + '">' + status_pembayaran + '</li>';
                    } else if (DataPembayaran.status_pembayaran !== null) {
                        collection_item_status_pembayaran = "";
                    } else {
                        collection_item_status_pembayaran = "";
                    }
                    if (Status_pengiriman == "Siap Dikirim") {
                        console.log(Status_pengiriman);
                        status_pembayaran = "Perlu Diproses", color_status_pembayaran = " green accent-1";
                        collection_item_status_pembayaran = '<li class="collection-item center' + color_status_pembayaran + '" id="status-pembayaran-' + isi.idPemesanan + '">' + status_pembayaran + '</li>';
                    } else if (Status_pengiriman == "Pengiriman") {
                        status_pembayaran = "Dalam Pengiriman", color_status_pembayaran = " green accent-2";
                        collection_item_status_pembayaran = '<li class="collection-item center' + color_status_pembayaran + '" id="status-pembayaran-' + isi.idPemesanan + '">' + status_pembayaran + '</li>';
                    }
                    Html += '<div class="card z-depth-3">' +
                        '<ul class="collection" onclick="GoToDetail(\'' + isi.idPemesanan + '\', \'' + Status_pengiriman + '\')">' +
                        collection_item_status_pembayaran +
                        '<li class="collection-item avatar">' +
                        '<img src="' + base_url + '/foto_usaha/produk/' + fotoProduk + '" alt="Foto ' + namaProduk + '" class="circle">' +
                        '<span class="title">' + namaProduk + '</span>' +
                        '<p class="orange-text">Rp' + app.formatNumber(hargaProduk) + '<br></p>' +
                        '<span class="secondary-content">' + totalProduk + ' Ons</span>' +
                        '</li>' +
                        '<li class="collection-item teal-text darken-1"><b>Total Pemasukkan :<span class="secondary-content orange-text">Rp' + app.formatNumber(totalHargaAll) + '</span></b></li>';

                    Html += '</ul></div>';

                });
            } else {
                Html = '<div id="baru" class="col s12" style="height: auto; padding: 0px 8px">' +
                    '<div class="row" style="display: relative; margin: 4px">' +
                    '<p class="flow-text center" style="font-size: small; width: 100%">Tidak ada Transaksi</p>' +
                    '</div>' +
                    '</div>';
            }
            console.log("status: " + status_pesanan);
            if (status_pesanan == "Baru") {
                $("#baru").html(Html);
            } else if (status_pesanan == "Terbayar") {
                $("#sudahdibayar").html(Html);
            } else if (status_pesanan == "Siap Dikirim") {
                $("#perludikirim").html(Html);
            } else if (status_pesanan == "Siap Diambil") {
                $("#ambilditoko").html(Html);
            } else if (status_pesanan == "Pengiriman") {
                $("#pengiriman").html(Html);
            } else if (status_pesanan == "Terkirim") {
                $("#selesai").html(Html);
            }
        } else {
            Html = "Pesanan Kosong";
            if (status_pesanan == "Baru") {
                $("#baru").html(Html);
            } else if (status_pesanan == "Terbayar") {
                $("#sudahdibayar").html(Html);
            } else if (status_pesanan == "Siap Dikirim") {
                $("#perludikirim").html(Html);
            } else if (status_pesanan == "Siap Diambil") {
                $("#ambilditoko").html(Html);
            } else if (status_pesanan == "Pengiriman") {
                $("#pengiriman").html(Html);
            } else if (status_pesanan == "Terkirim") {
                $("#selesai").html(Html);
            }
        }
    },
    formatNumber: (num) => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    }
}
function onLoad() {
    $('.tabs').tabs();
    //   $(".carousel").css({"max-height":"100%", "height":"100%"});
    $('.dropdown-trigger').dropdown();
    app.init();
}

function GoToDetail(idPemesanan, statusPemesanan) {
    console.log("Id Pemesanan : " + idPemesanan);
    console.log("status : " + statusPemesanan);
    var LokasiHalaman = "", inEach;
    localStorage.setItem('id_pesanan', idPemesanan);
    localStorage.setItem("status", statusPemesanan);
    var JenisPengiriman, DetailPesanan;
    $.getJSON(API_DETAIL_PESANAN_PENJUAL, { idPemesanan: idPemesanan, id_usaha: app.idUsaha })
        .then(function (response, status) {
            var data_pesanan = response.dataPesanan;
            DetailPesanan = data_pesanan;
            var statusPengiriman = data_pesanan.statusPengiriman;
            JenisPengiriman = data_pesanan.JenisPengiriman;
            localStorage.setItem("JenisPengiriman", data_pesanan.JenisPengiriman);
            localStorage.setItem('idPemesanan', idPemesanan);
            localStorage.setItem("DetailPesanan", JSON.stringify(data_pesanan));
            var detail_pemesanan_selected = data_pesanan;
            var jenis_pengiriman_selected = JenisPengiriman;
            console.log("Jenis Pengiriman : " + jenis_pengiriman_selected);
            if (statusPemesanan == "Baru") {
                if (jenis_pengiriman_selected == "Ambil di Toko") {
                    location.href = "detail-transaksi-baru-ambil.html";
                } else {
                    console.log(JSON.parse(localStorage.DetailPesanan));
                    location.href = "detail-transaksi-baru-kirim.html";
                }
            } else if (statusPemesanan == "Terbayar") {
                if (jenis_pengiriman_selected == "Ambil di Toko") {
                    location.href = "detail-transaksi-ambil-all.html";
                } else {
                    location.href = "detail-transaksi-terbayar-kirim.html";
                }
            } else if (statusPemesanan == "Siap Dikirim") {
                location.href = "detail-transaksi-siap-dikirim.html";
            } else if (statusPemesanan == "Siap Diambli") {
                location.href = "detail-transaksi-siap-diambil.html";
            } else if (statusPemesanan == "Pengiriman") {

            } else if (statusPemesanan == "Terkirim") {

            }
        });

    // if (status == "Baru") {
    //   storage.setItem("statusPemesanan", status);
    //   window.location.href = "detail-transaksi-belumbayar-all-no-pick.html";
    // } else if (status == "Terbayar") {
    //   storage.setItem("statusPemesanan", status);
    //   window.location.href = "detail-transaksi-perludikirim-all-no-pick.html";
    // } else if (status == "Terkirim") {
    //   storage.setItem("statusPemesanan", status);
    //   window.location.href = "detail-transaksi-selesai-all.html";
    //   // inEach = PesananSent;
    // } else if (status == "Today") {
    //   localStorage.setItem("statusPemesanan", status);
    //   location.href = "konfirmasi-berat-produk.html";
    // } else {
    //   storage.setItem("statusPemesanan", "");
    //   storage.setItem("metodePembayaran", metodePembayaran);
    //   window.location.href = "detail-transaksi-ambil-all.html";
    // }
}
// $(document).ready(app.onDeviceReady);
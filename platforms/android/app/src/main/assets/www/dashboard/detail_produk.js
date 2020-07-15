function onLoad() {
    $(".modal").modal();
    document.addEventListener("deviceready", onDeviceReady, false);
}

// $(document).ready(onDeviceReady);

function onDeviceReady() {
    $("[name=variasi]").val("");
    if (localStorage.usergroup == "") {
        $(".button-beli, #manage-produk, #manage-stok-produk").hide();
        loadVariasiProduk("publik");
    } else {
        $(".button-login").hide();
        $('#note').characterCounter();
        loadVariasiProduk("pembeli");
    }
    check_page();
    loadDetailProduk();
    loadDetailUsaha();
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
    document.addEventListener("menubutton", onMenuKeyDown, false);
    document.addEventListener("backbutton", onBackKeyDown, true);
    document.getElementById("openSheet").addEventListener("click", openModelSheet, false);
    document.getElementById("openLogin").addEventListener("click", openLoginSheet, false);
    document.getElementById("setuju").addEventListener("click", beli, false);
    document.getElementById("login").addEventListener("click", kirim_data, false);
    // Add similar listeners for other events
}

function kirim_data() {
    event.preventDefault();
    var username = $('#username').val();
    var password = $('#password').val();
    // alert('button sign in diklik' +username+" pass : " +password);

    const ULR_LOGIN = base_url + 'api/user/login';
    $.ajax({
        url: ULR_LOGIN,
        // data: 'username=' + username + '&password=' + password, 
        data: { username: username, password: password },
        type: 'POST',
        dataType: 'json',
        success: function (resp) {
            console.log('muncul di console');
            console.log(resp.status);
            if (resp.status == 'berhasil') {
                M.toast({ html: 'Anda berhasil masuk!' });
                // alert('Anda berhasil masuk');
                window.localStorage.setItem('sukses_login', '1');
                window.localStorage.setItem('username', username);
                window.localStorage.setItem('usergroup', resp.usergroup);
                window.localStorage.setItem('id_akun', resp.id_akun);
                window.localStorage.setItem('jenis_petani', resp.jenis_petani);
                if (localStorage.usergroup == "penjual") {
                    localStorage.setItem("id_usaha", resp.data_usaha.id_usaha);
                    localStorage.setItem("data_usaha", JSON.stringify(resp.data_usaha));
                }
                var keranjang = JSON.stringify(Array());
                window.localStorage.setItem('keranjang', JSON.parse(keranjang));
                console.log(window.localStorage.getItem(usergroup));
                console.log(window.localStorage.getItem(username));
                document.location.reload();
                // setTimeout(redirectPage, 1000);
            } else {
                M.toast({ html: 'Anda gagal masuk' });
            }
        }
    });
}

function openLoginSheet()
{
    $("#modalLogin").modal("open");
}
function openModelSheet() {
    var variasiNow = $("#variasi").val();
    var qty = $("#qty").val();
    if (variasiNow == "" || variasiNow == null || variasiNow == "null") {
        M.toast({ html: 'Anda belum memilih variasi Produk' });
        return false;
    }

    if (qty == 0 || qty == null) {
        M.toast({ html: 'Anda belum mengisi jumlah item' });
        return false;
    }
    if (qty < 1) {
        M.toast({ html: 'Jumlah item yang Anda pilih tidak sesuai stok yang tersedia' });
        return false;
    }
    if (qty > parseInt(maxStokItem)) {
        M.toast({ html: 'Jumlah item yang Anda pilih melebihi stok yang tersedia' });
        return false;
    }

    if (qty >= 1 && qty <= parseInt(maxStokItem)) {
        $("#title-modal-sheet").html("Konfirmasi Pemilihan " + $(".nama_produk").text() + " " + $("select").find("option:selected").text());
        $("#modal1").modal("open");
    }
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
    // e.preventDefault();
    storage.removeItem('id_produk');
    storage.removeItem('qty');
    storage.removeItem('berat_produk');
    history.back();
}
$('.modal').modal();
$('.variasi').formSelect();
variasi = null;
//read onLoad function first//
var variasiStatus = 0, countQTY = 0;
var id_produk = window.localStorage.getItem('id_produk');
var variasi = window.localStorage.getItem('variasi'), nama_produk, harga_produk, berat, namaVariasi, imgProduk;
function pilihVariasi() {
    var variasi = $("#variasi").val();
    if (variasi != "") {
        var variasi_selected = $("[name=variasi]").find("option:selected").text();
        if(variasi_selected!="Mentah potong"){
            $("#mentah-potong-option").hide();
        }else{
            $("#mentah-potong-option").show();
        }
        $(".pesan-variasi").removeAttr("disabled");
        storage.setItem('variasi', variasi);
        $(".pesan-variasi").removeAttr('disabled');
        $.ajax({
            url: base_url + 'produk/ambil_stok_variasi',
            type: 'post',
            data: { variasi: variasi, id_produk: id_produk },
            dataType: 'JSON',
            success: function (e) {
                maxStokItem = e.stok;
                namaVariasi = e.nama_variasi;
                $(".stok").html(+e.stok/10 + "&nbsp;Kg");
                if (e.stok == 0) {
                    $(".pesan-variasi").attr('disabled');
                } else {
                    variasiStatus = 1;
                    $("#qty").removeAttr('disabled');
                    $(".harga_produk").html('Rp ' + formatNumber(e.harga));
                    $(".fieldQty").html('<input id="qty" name="qty" type="number" class="validate" max="' + e.stok + '" min="1" step="1">' +
                        '<label for="qty">Quantity: </label>' +
                        '<span class="helper-text textQty" data-error="wrong" data-success="right"></span>');
                }
                harga_produk = e.harga;
            },
            error: function () {
                $(".stok").html("Stok: 0");
            }
        });
    } else {
        $(".pesan-variasi").attr("disabled");
    }
}
$(".variasi").change(function () {
    variasi = $(this).val();
});
$(".addQTY").click(function () {
    if (variasiStatus == 1) {
        countQTY += 1;
        $("#qty").val(countQTY);
    }
});
$(".removeQTY").click(function () {
    if (variasiStatus == 1) {
        if (countQTY > 0) {
            countQTY -= 1;
            $("#qty").val(countQTY);
        }
    }
});
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

function beli() {
    var variasiNow = $("#variasi").val();
    var qty = $("#qty").val();
    if (variasiNow == "" || variasiNow == null || variasiNow == "null") {
        M.toast({ html: 'Anda belum memilih variasi Produk' });
        return false;
    }

    if (qty == 0 || qty == null) {
        M.toast({ html: 'Anda belum mengisi jumlah item' });
        return false;
    }
    if (qty < 1) {
        M.toast({ html: 'Jumlah item yang Anda pilih tidak sesuai stok yang tersedia' });
        return false;
    }
    if (qty > parseInt(maxStokItem)) {
        M.toast({ html: 'Jumlah item yang Anda pilih melebihi stok yang tersedia' });
        return false;
    }
    if (qty >= 1 && qty <= parseInt(maxStokItem)) {

        variasi = $("#variasi").val();
        var jml_ikan_per_kg = $("[name=jml_ikan]").val();
        var jml_potong_ikan = $("[name=jml_potong]").val();
        var catatan = (jml_ikan_per_kg.length>0) ? "Jumlah ikan/kg: " + jml_ikan_per_kg + (jml_potong_ikan.length > 0) ? "<br> Jumlah potong/ekor: " + jml_potong_ikan : "" : null;
        var new_prods = {
            id_produk: id_produk,
            nama_produk: nama_produk,
            variasi: variasi,
            harga_produk: harga_produk,
            total_harga: (harga_produk * qty),
            qty: qty,
            namaVariasi: namaVariasi,
            fotoProduk: imgProduk,
            catatan: catatan,
            id_usaha: localStorage.id_usaha
        };
        console.log(new_prods);
        if (storage.getItem('keranjang') == "" || storage.getItem('keranjang') == null) {
            storage.setItem('keranjang', "[]");
        }
        var Keranjang = JSON.parse(storage.keranjang);
        console.log("length keranjang : ");
        if (Keranjang.length == 0) {
            
        } else {
            var data_prod = Array();
            data_prod = JSON.parse(storage.keranjang);
            var updated = 0;
            $.each(data_prod, function (key, val) {
                console.log("val data : " + data_prod[key]['qty']);
                if ((val.id_produk == new_prods.id_produk) && (val.variasi == new_prods.variasi)) {
                    var qtyKeranjang = parseInt(val.qty);
                    var newQty = parseInt(new_prods.qty);
                    var totalQty = qtyKeranjang + newQty;
                    data_prod[key]['qty'] = parseInt(val.qty) + parseInt(new_prods.qty);
                    data_prod[key]['total_harga'] = parseInt(val.total_harga) + parseInt(new_prods.total_harga);
                    updated = 1;
                }
            });
            if (updated == 0) {
                data_prod.push(new_prods);
            }
        }
        storage.setItem('keranjang', JSON.stringify(data_prod));
        //window.location.href="detail_pesanan_saya.html";

        return window.location.href = "../pembeli/pesanan-saya/detail_pesanan_saya.html";
    }
}

function new_keranjang(new_prod) {
    var data_prod = Array();
    data_prod.push(new_prods);
    return data_prod;
}
// Handle the back button
//


function goto_detail_usaha() {
    storage.removeItem('id_produk');
    window.location.href = "../penjual/usaha.html";
}

function batal() {
    $(".modal").modal("close");
}



var check_page = () => {
    storage.removeItem('variasi');

    var maxStokItem;

    if (variasi == "null" || variasi == null || variasi == "") {
        variasi = "";
    }
    if (id_produk == null) {
        window.location.href = '../dashboard/index_pembeli.html';
    }

    if ($(".variasi").val() !== null || $(".variasi").val() !== "") {
        $(".pesan-variasi, .pesan-variasi2").removeAttr('disabled');
    }
}

var loadDetailProduk = () => {
    $.getJSON(API_DETAIL_PRODUK, { id_produk: localStorage.id_produk }).then(onSuccessLoadProduk).fail(onFailLoadProduk);
}

var onSuccessLoadProduk = (e) => {
    var harga_display = (e.minprice!=e.maxprice) ? 'Rp' + formatNumber(e.minprice) + ' ~ Rp' + formatNumber(e.maxprice) : 'Rp' + formatNumber(e.minprice);
    $(".image-produk").html('<img src="' + base_url + 'foto_usaha/produk/' + e.foto_produk + '" class="responsive-img" style="width: 100% !important" alt="' + e.nama_produk + '">');
    $(".nama_produk, .title-produk, .header").html(e.nama_produk);
    $(".harga_produk").html(harga_display);
    $(".berat").html(e.berat_produk + '&nbsp;Ons');
    $(".Kategori_produk").html("Air &nbsp;" + e.kategori);
    $(".min_order").html(e.min_pemesanan + "&nbsp;Ons");
    nama_produk = e.nama_produk;
    harga_produk = e.minprice;
    berat = e.berat_produk;
    imgProduk = base_url + 'foto_usaha/produk/' + e.foto_produk;
}

var onFailLoadProduk = (error) => {
    $(".image-produk").html('<img src="' + base_url + 'foto_usaha/produk/default.png" class="wd-100p" alt="Gambar Kosong">');
}

var loadVariasiProduk = ($user) => {
    if ($user == "pembeli") {
        $.getJSON(API_GET_VARIASI_PRODUK, { id_produk: id_produk }).then(onSuccessVariasiProduk);
    } else {
        $.getJSON(API_GET_VARIASI_PRODUK, { id_produk: id_produk }).then(onSuccessVariasiPublic);
    }
}

var onSuccessVariasiPublic = (e, status) => {
    var html = '<div class="row" style="margin-top:12px; margin-bottom: 0px">' +
        '<div class="col s6">' +
        '<p class="left" style="font-size: small;">Variasi Produk :</p>' +
        '</div>' +
        '<div class="col s6">';
    var panjang_variasi = e.length;   
    console.log("Panjang Variasi : " + panjang_variasi); 
    $.each(e, function (key, val) {
        var nama_variasi = (key < (panjang_variasi-1)) ? val.nama_variasi + ', ' : val.nama_variasi;
        html += '<p class="right-align" style="margin-bottom:8px">' + nama_variasi + '</p>';
    });
    html += '</div></div>';
    $("#content-produk").append(html);
    // console.log(html);
}

var onSuccessVariasiProduk = (e, status) => {
    var selected = '';
    var $html = '';
    $.each(e, function (key, val) {
        if (variasi == val.id_variasiproduk) {
            selected = 'selected="true"';
        } else {
            selected = '';
        }
        $html += '<option value="' + val.id_variasiproduk + '" label="' + val.nama_variasi + '" ' + selected + '>' + val.nama_variasi + '</label>';
    });
    $(".title-modal").html("Pilih Variasi " + nama_produk + ":&nbsp;");
    $(".variasi").append($html);
    $('select').formSelect();
}

var loadDetailUsaha = () => {
    $.getJSON(API_DETAIL_USAHA, { id_usaha: localStorage.id_usaha }).then(onSuccessDetailUsaha);
}

var onSuccessDetailUsaha = (e, status) => {
    console.log(e);
    var data_usaha = e;
    var nama_usaha = data_usaha.nama_usaha, kab = data_usaha.kab, foto_usaha = data_usaha.foto_usaha;
    $("#img-usaha").attr("src", base_url + "foto_usaha/" + foto_usaha);
    $("#nama-usaha").html(nama_usaha);
    $("#kab-usaha").html(kab);
}
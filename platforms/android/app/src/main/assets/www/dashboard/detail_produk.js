function onLoad() {
    $(".modal").modal();
    document.addEventListener("deviceready", onDeviceReady, false);
}
// $(document).ready(onDeviceReady);

function onDeviceReady() {
    $("#variasi").prop('selectedIndex', null);

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
    let username = $('#username').val();
    let password = $('#password').val();
    let data_login = {username, password};
    const ULR_LOGIN = base_url + 'api/user/login';
    $.post(ULR_LOGIN, data_login)
        .then(function (resp, status) {
            console.log('muncul di console');
            console.log(resp.status);
            if (status == 'success') {
                M.toast({ html: 'Anda berhasil masuk!' });
                // alert('Anda berhasil masuk');
                window.localStorage.setItem('sukses_login', '1');
                window.localStorage.setItem('username', username);
                window.localStorage.setItem('usergroup', resp.data.usergroup);
                window.localStorage.setItem('id_akun', resp.data.id_akun);
                window.localStorage.setItem('jenis_petani', resp.data.jenis_petani);
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
        });
    // $.ajax({
    //     url: ULR_LOGIN,
    //     // data: 'username=' + username + '&password=' + password, 
    //     data: { username: username, password: password },
    //     type: 'POST',
    //     dataType: 'json',
    //     success: 
    // });
}

function openLoginSheet() {
    $("#modalLogin").modal("open");
}
function openModelSheet() {
    console.log("OPen Modal Sheet");
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
    
    arr_berat.sort(function(a, b){return a - b});
    let option_allowed_ikan = "";
    let allowed_ikan_per_kg = ekor_kg, potong_per_ekor_ikan = "";
    // $.each(arr_berat, (i,el)=>{
    //     let selected_area = (i == 1) ? 'selected' : '';
    //     option_allowed_ikan += `<option value='${el}' ${selected_area} label='${el}'>${el}</option>`;
    // });
    let min_berat = arr_berat.sort((a, b)=>{return a - b})[0];
    let max_berat = arr_berat.sort((a, b)=>{return b - a})[0];
    for (let index = min_berat; index <= max_berat; index++) {
        let selected_area = (index == min_berat) ? 'selected' : '';
        option_allowed_ikan += `<option value='${index}' ${selected_area} label='${index}'>${index}</option>`;
    }
    console.log("option: ");
    console.log(option_allowed_ikan);
    // let allowed_ikan_per_kg = ekor_kg, potong_per_ekor_ikan = "", option_allowed_ikan = "";
    // for (let index = 1; index <= allowed_ikan_per_kg; index++) {
        
    // }
    $("#jml_ikan").html(option_allowed_ikan);
    if (allowed_ikan_per_kg < 7) {
        for (let index = 2; index < 4; index++) {
            let selected_area = (index == 1) ? 'selected' : '';
            potong_per_ekor_ikan += `<option value='${index}' ${selected_area} label='${index}'>${index}</option>`;
        }
    } else {
        potong_per_ekor_ikan += `<option value='1' label='1' selected>1</option>`;
    }
    $("#jml_potong").html(potong_per_ekor_ikan);

    if (qty >= 1 && qty <= parseInt(maxStokItem)) {
        $("#title-modal-sheet").html("Konfirmasi Pemilihan " + $(".nama_produk").text() + " " + $("#variasi").find("option:selected").text());
        $("#modal1").modal("open");
        $('select').formSelect();
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
variasi = null;
//read onLoad function first//
var variasiStatus = 0, countQTY = 0;
var id_produk = window.localStorage.getItem('id_produk');
var variasi = window.localStorage.getItem('variasi'), nama_produk, harga_produk, berat, w_kg, namaVariasi, fotoProduk;
var ekor_kg = 0, limit_kg=0.5;
var arr_berat = [];
function pilihVariasi() {
    var variasi = $("#variasi").val();
    if (variasi != "") {
        var variasi_selected = $("[name=variasi]").find("option:selected").text();
        if (variasi_selected != "Mentah potong") {
            $("#mentah-potong-option").hide();
        } else {
            $("#mentah-potong-option").show();
        }
        $(".pesan-variasi").removeAttr("disabled");
        storage.setItem('variasi', variasi);
        $(".pesan-variasi").removeAttr('disabled');
        let data_get = {};
        if(localStorage.id_akun){
            data_get = { variasi: variasi, id_produk: id_produk, id_akun: localStorage.id_akun };
        }else{
            data_get = { variasi: variasi, id_produk: id_produk };
        }
        $.getJSON(base_url + 'produk/ambil_stok_variasi', data_get).then(e=>{
            let stok_item = e.stok_item;
            maxStokItem = stok_item.stok;
            namaVariasi = stok_item.nama_variasi;
            $(".stok").html(+stok_item.stok / 10 + "&nbsp;Kg");
            if (e.stok == 0) {
                $(".pesan-variasi").attr('disabled');
            } else {
                variasiStatus = 1;
                $("#qty").removeAttr('disabled');
                $(".harga_produk").html('Rp ' + formatNumber(stok_item.harga));
                $(".fieldQty").html('<input id="qty" name="qty" type="number" class="validate" max="' + stok_item.stok + '" min="1" step="1">' +
                    '<label for="qty">Quantity: </label>' +
                    '<span class="helper-text textQty" data-error="wrong" data-success="right"></span>');
            }
            harga_produk = stok_item.harga;
        });
        
        $("#jml_ikan").prop('selectedIndex', null);
        $("#jml_potong").prop('selectedIndex', null);
        // $.ajax({
        //     url: base_url + 'produk/ambil_stok_variasi',
        //     type: 'post',
        //     data: ,
        //     dataType: 'JSON',
        //     success: function (e) {
                
        //     },
        //     error: function () {
        //         $(".stok").html("Stok: 0");
        //     }
        // });
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
        counter_ekor_kg(countQTY);
    }
});
$(".removeQTY").click(function () {
    if (variasiStatus == 1) {
        if (countQTY > 0) {
            countQTY -= 1;
            $("#qty").val(countQTY);
            counter_ekor_kg(countQTY);
        }
    }
});
function counter_ekor_kg(qty=0) {
    let tmp_berat = 0.0;
    arr_berat = [];
    if(w_kg > 0.2){
        // BERAT - 0.1
        tmp_berat = w_kg-0.1;
        get_ekor_kg(tmp_berat);
        // BERAT + 0.1
        tmp_berat = w_kg + 0.1;
        get_ekor_kg(tmp_berat);
        // BERAT ONLY
        get_ekor_kg(w_kg);
    }else{
        // BERAT + 0.1 KARENA BERAT PRODUK ADALAH 0.1
        tmp_berat = w_kg+0.1;
        get_ekor_kg(tmp_berat);
        // BERAT ONLY
        get_ekor_kg(w_kg);
    }
    var uniqueNames = [];
    $.each(arr_berat, function(i, el){
        if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
    });
    arr_berat = uniqueNames;
}
function get_ekor_kg(w) {
    let ekor_kg = parseInt(1.5 / w);
    console.log("ekor / kg : " + ekor_kg);
    arr_berat.push(ekor_kg);
}
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

function beli() {
    var variasiNow = $("#variasi").val();
    var variasi_text = $("#variasi").find("option:selected").text().toString();
    let jml_potong_val_selected = $("[name=jml_potong]").find("option:selected").val();
    const MENTAH_POTONG = "Mentah potong";
    var product_text = $(".nama_produk").text();
    var full_product_name = product_text + " " + variasi_text;
    let nama_usaha = $("#nama-usaha").text();
    var qty = $("#qty").val();
    let potong_per_ekor = 2
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
        console.log("Variasi : " + variasi_text);
        console.log("is variasi \"Mentah Potong\" : ");
        if(variasi_text == MENTAH_POTONG){
            console.log(true);
            potong_per_ekor = parseInt(jml_potong_val_selected);
        }else{
            console.log(false);
            potong_per_ekor = null;
        }
        variasi = $("#variasi").val();
        var ikan_per_kg = parseInt($("[name=jml_ikan]").val());
        var variasi_selected_init = $("[name=variasi]").find("option:selected").text();
        let id_usaha = parseInt(localStorage.id_usaha);
        let id_akun = parseInt(localStorage.id_akun);
        var new_prods = {};
        let estimasi_ongkir = rel.fee_kirim;
        let distance = rel.jarakPengiriman;
        let total_harga = parseInt((harga_produk * qty));
        let nama_produk = full_product_name;
        let id_produk = parseInt(localStorage.id_produk);
        new_prods = {
            id_produk,
            variasi,
            harga_produk,
            total_harga,
            qty,
            namaVariasi,
            fotoProduk,
            id_usaha,
            id_akun,
            nama_produk,
            ikan_per_kg,
            potong_per_ekor,
            nama_usaha,
            distance,
            estimasi_ongkir
        };
        console.log(new_prods);
        // SIMPAN KE KERANJANG
        simpan_keranjang(new_prods);
    }
}

function simpan_keranjang(data_prod) {
    $.post(API_KERANJANG, data_prod).then(on_success_simpan_keranjang).fail(on_fail_simpan_keranjang)
}

function on_success_simpan_keranjang(data, status) {
    if (status == "success") {
        var data_keranjang_usaha = data;
        let data_produk = 0;
        $.each(data_keranjang_usaha, function (i, v) {
            data_produk += v.data_produk.length;
        });
        console.log("Total Keranjang : ", data_produk);
        total_item_keranjang = data_produk;
        localStorage.setItem("total_item_keranjang", total_item_keranjang);
        $("#totalBasket").text(localStorage.total_item_keranjang);
        localStorage.setItem("keranjang", JSON.stringify(data_keranjang_usaha));
        // return window.location.href = "../pembeli/pesanan-saya/keranjang.html";
    }
}

function on_fail_simpan_keranjang(error) {

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

function check_page() {
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

var onSuccessLoadProduk = (e, status) => {
    var harga_display = (e.minprice != e.maxprice) ? 'Rp' + formatNumber(e.minprice) + ' ~ Rp' + formatNumber(e.maxprice) : 'Rp' + formatNumber(e.minprice);
    $(".image-produk").html('<img src="' + base_url + 'foto_usaha/produk/' + e.foto_produk + '" class="responsive-img" style="width: 100% !important" alt="' + e.nama_produk + '">');
    $(".nama_produk, .title-produk, .header").html(e.nama_produk);
    $(".harga_produk").html(harga_display);
    $(".berat").html(e.berat_produk + '&nbsp;Ons');
    $(".Kategori_produk").html("Air &nbsp;" + e.kategori);
    $(".min_order").html(e.min_pemesanan + "&nbsp;Ons");
    nama_produk = e.nama_produk;
    harga_produk = e.minprice;
    berat = parseFloat(e.berat_produk);
    w_kg = parseFloat(berat/10);
    fotoProduk = base_url + 'foto_usaha/produk/' + e.foto_produk;
    if (localStorage.usergroup == "") {
        $(".button-beli, #manage-produk, #manage-stok-produk").hide();
        loadVariasiProduk("publik");
    } else {
        $(".button-login").hide();
        loadVariasiProduk("pembeli");
    }
    
}

var onFailLoadProduk = (error) => {
    $(".image-produk").html('<img src="' + base_url + 'foto_usaha/produk/default.png" class="wd-100p" alt="Gambar Kosong">');
}

var loadVariasiProduk = ($user) => {
    if ($user == "pembeli") {
        $.getJSON(API_GET_VARIASI_PRODUK, { id_produk: id_produk, id_akun }).then(onSuccessVariasiProduk);
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
        var nama_variasi = (key < (panjang_variasi - 1)) ? val.nama_variasi + ', ' : val.nama_variasi;
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
    rel.data_usaha = data_usaha;
    rel.load_data_pembeli();
}

var rel = {
    fee_kirim: 0,
    temp_fee_kirim: 0,
    origin: {},
    jarakPengiriman: 0,
    data_usaha: {},
    load_data_pembeli: function () {
        $.getJSON(API_PEMBELI, { id_akun: storage.id_akun }).then(rel.success_load_data_pembeli);
    },
    success_load_data_pembeli: function (result, status) {
        if (status == "success") {
            let data_pembeli = result[0];
            rel.origin = { lat: parseFloat(data_pembeli.latitude), lng: parseFloat(data_pembeli.longitude) };
            console.log("Origin: ", rel.origin);
            console.log(JSON.stringify(rel.origin));
            rel.load_distance_matrix();
        }
    },
    load_distance_matrix: function () {
        var t;
        var tujuan = [];
        t = { lat: parseFloat(rel.data_usaha.latitude), lng: parseFloat(rel.data_usaha.longitude) };
        tujuan.push(t);
        console.log('tujuan');
        console.log(tujuan);
        console.log(JSON.stringify(tujuan));
        // des -7.567492, 110.832670 des  -7.566248, 110.833485 des  -7.569072, 110.831500
        var service = new google.maps.DistanceMatrixService;

        service.getDistanceMatrix({
            origins: tujuan,
            destinations: [rel.origin],
            travelMode: 'DRIVING',
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: true,
            avoidTolls: true
        }, function (response, status) {
            if (status !== 'OK') {
                alert('Error was: ' + status);
            } else {
                console.log("Matrix Success");
                // let results = response.rows[0].elements;
                var originList = response.originAddresses;
                // var outputDiv = document.getElementById('output');
                // outputDiv.innerHTML = '';
                console.log(response);
                rel.set_origin_list(originList, response);
                // return app.load_keranjang(response);
                // this.result_distance = semuadistance;
                // this.load_keranjang(semuadistance);
            }
        });
    },
    set_origin_list: (originList, response) => {
        for (var i = 0; i < originList.length; i++) {
            var results = response.rows[i].elements;
            results.sort(function (a, b) { return a.distance.value - b.distance.value; });
            console.log("result element : ", results);
            for (var j = 0; j < results.length; j++) {
                // KONDISI BIAYA PENGIRIMAN
                rel.fee_kirim = 5000;
                // jarakPengiriman = (results[j].distance.value / 1000).toFixed(1);
                let distance_val = parseFloat(results[j].distance.value / 1000);
                rel.jarakPengiriman = distance_val.toFixed(1);
                console.log("jarakPengiriman: ",rel.jarakPengiriman);
                if (results[j].distance.value > 5000) {
                    rel.fee_kirim += parseInt(1000 * (distance_val - 5)); //1000/km
                }
                var slicedString = rel.fee_kirim.toString().slice(-3);
                if (parseInt(slicedString) > 500) {
                    rel.fee_kirim = rel.fee_kirim + 1000 - parseInt(slicedString);
                } else if (parseInt(slicedString) < 500) {
                    rel.fee_kirim = rel.fee_kirim - parseInt(slicedString);
                }
                rel.temp_fee_kirim = rel.fee_kirim;
                console.log("FEEKIRIM: " + rel.fee_kirim);
                if (j == 0) {
                    idx_terdekat = 0;
                    distance_to_this_bf = results[j].distance.value; //nilai untuk dibandingkan
                    // outputDiv.innerHTML += res[j].nama_tempat + ' titik pertama. idx_terdekat ' + idx_terdekat + '<br>';
                } else {
                    // outputDiv.innerHTML += '<br>' + res[j].nama_tempat + '<br>' + distance_to_this_bf + '>' + results[j].distance.value + ' maka <br>';
                    if (distance_to_this_bf > results[j].distance.value) {
                        distance_to_this_bf = results[j].distance.value;
                        idx_terdekat = j;
                    }
                    // outputDiv.innerHTML += 'idx_terdekat = ' + idx_terdekat + '<br>';
                }
                // outputDiv.innerHTML += 'Jarak: ' + results[j].distance.text + '<br>'; //km
            }
        }
    }
}
$(document).ready(function () {

//    var sudah_login = window.localStorage.getItem('sudah_login');
//    if(sudah_login == 1){
//        window.location.href='content.html';
//    }

    $(".aksitambah").click(function (e) {
        e.preventDefault();
        var noktp = $("body").find("input[name='noktp']").val();
        var namawarga = $("body").find("input[name='namawarga']").val();
        var alamat = $("body").find("textarea[name='alamat']").val();
        var telp = $("body").find("input[name='telp']").val();
        var idtelegram = $("body").find("input[name='idtelegram']").val();
        var username = $("body").find("input[name='username']").val();
        var password = $("body").find("input[name='password']").val();

        var formData = new FormData($('form')[0]);
        formData.append("noktp", noktp);
        formData.append("namawarga", namawarga);
        formData.append("alamat", alamat);
        formData.append("telp", telp);
        formData.append("idtelegram", idtelegram);
        formData.append("username", username);
        formData.append("password", password);
        
        console.log($('#signup-pasfoto').val());
        console.log(formData);
//        if (noktp != '' && namawarga != '' && alamat != '' && telp != '' && idtelegram != '' && username != '' && password != '' && $('#signup-pasfoto').val()!='' && $('#signup-fotoktp').val()!='' && $('#signup-fotosim').val()!='') {
//            $.ajax({
//                dataType: 'json',
//                type: 'POST',
//                url: url + "app/mobile/create.php",
//                // data:{noktp:noktp, namawarga:namawarga, alamat:alamat, telp:telp, idtelegram:idtelegram, username:username, password:password}
//                data: formData,
//                contentType: false,
//                cache: false,
//                processData: false
//            }).done(function (data) {
//                //$('#tablecontent').DataTable().ajax.reload();
////                $(".modal").modal('hide');
//                alert('Selamat anda Berhasil Mendaftar!!');
//                window.location.href = 'index.html';
//            });
//        } else {
//            alert('Ada data yang kosong');
//        }


    });

    $(".laporkankasus").click(function (e) {
        e.preventDefault();
        var dataidwarga = $("body").find("input[name='id']").val();
        var lat = $("body").find("input[name='lat']").val();
        var long = $("body").find("input[name='long']").val();
        var pidana = $("body").find("input[name='pidana']").val();
        var korban = $("body").find("input[name='korban']").val();
        var terlapor = $("body").find("input[name='terlapor']").val();
        var kronologi = $("body").find("textarea[name='kronologi']").val();
        var barang_bukti = $("body").find("input[name='barang_bukti']").val();
        var nama_saksi = $("body").find("input[name='nama_saksi']").val();
        var alamat_saksi = $("body").find("textarea[name='alamat_saksi']").val();

        if (lat != '') {
            $.ajax({
                dataType: 'json',
                type: 'POST',
                url: url + "app/mobile/createlaporankhusus.php",
                data: {idwarga: dataidwarga, lat: lat, long: long, pidana: pidana, korban: korban, terlapor: terlapor, kronologi: kronologi, barang_bukti: barang_bukti, nama_saksi: nama_saksi, alamat_saksi: alamat_saksi}
            }).done(function (data) {
                //$('#tablecontent').DataTable().ajax.reload();
                //$(".modal").modal('hide');
                alert('Selamat anda Berhasil Mengirimkan Laporan!!');
                window.location = 'content.html';
            });
        } else {
            alert('Ada data yang kosong');
        }


    });




    $(".aksilogin").click(function (e) {
        e.preventDefault();
        var username = $("body").find("input[name='username']").val();
        var password = $("body").find("input[name='password']").val();

        if (username != '' && password != '') {
            $.ajax({
                dataType: 'json',
                type: 'POST',
                url: url + "app/mobile/read.php",
                data: {username: username, password: password},
                success: function (resp) {
                    if(resp.status == 'OK'){
                    alert('Selamat Datang!!');
                    window.localStorage.setItem("idwarga", resp.data.id_profile);
                    window.localStorage.setItem("namawarga", resp.data.nama_warga);
                    window.localStorage.setItem("noktp", resp.data.no_ktp);
                    window.localStorage.setItem("telp", resp.data.telp);
                    window.localStorage.setItem("alamat", resp.data.alamat);
                    window.localStorage.setItem("idtelegram", resp.data.id_telegram);
                    window.localStorage.setItem("fotoktp", resp.data.foto_ktp);
                    window.localStorage.setItem("fotosim", resp.data.foto_sim);
                    window.localStorage.setItem("pasfoto", resp.data.pas_foto);
                    window.localStorage.setItem("username", resp.data.username);
                    window.localStorage.setItem("password", resp.data.password);
                    window.localStorage.setItem("sudah_login", 1);
                    window.location = 'content.html';
                    console.log(resp.data.id_profile);
                    }else{
                        $("body").find("input[name='password']").val('');
                        alert('Username dan Password anda kurang tepat.');
                    }
                }
//            }).done(function (data) {
            });
        } else {
            alert('Ada data yang kosong');
        }


    });






    /* Update user */
    $(".aksiedit").click(function () {

        var idwarga = $("#edit").find("input[name='idwarga']").val();
        var noktp = $("#edit").find("input[name='noktp']").val();
        var namawarga = $("#edit").find("input[name='namawarga']").val();
        var alamat = $("#edit").find("textarea[name='alamat']").val();
        var telp = $("#edit").find("input[name='telp']").val();
        var idtelegram = $("#edit").find("input[name='idtelegram']").val();

        if (idwarga != '') {
            $.ajax({
                dataType: 'json',
                type: 'POST',
                url: url + "app/warga/update.php",
                data: {idwarga: idwarga, noktp: noktp, namawarga: namawarga, alamat: alamat, telp: telp, idtelegram: idtelegram}
            }).done(function (data) {
                $('#tablecontent').DataTable().ajax.reload();
                $(".modal").modal('hide');
                alert('Data berhasil diedit');
            });
        } else {
            alert('Ada data yang kosong')
        }

    });
});
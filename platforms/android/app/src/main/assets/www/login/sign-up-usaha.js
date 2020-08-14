var firstLt, firstLg;
        // var lat, lng;
        // $(document).ready(onDeviceReady);
        function onBackKeyDown() {
            $("#modal1").modal("open");
        }
        function onLoad() {
            // $('.timepicker').timepicker({

            // });
            $("#jamBuka").timepicker({
                defaultTime: '06:00',
                twelveHour: false
            });
            $("#jamTutup").timepicker({
                defaultTime: '16:00',
                twelveHour: false
            });
            get_detail_penjual();
            // loadUsaha();
            $(".modal").modal();
            document.addEventListener("deviceready", onDeviceReady, false);
        }
        // device APIs are available
        //
        function onDeviceReady() {
            getCurrentLocation();
            document.addEventListener("pause", onPause, false);
            document.addEventListener("resume", onResume, false);
            document.addEventListener("menubutton", onMenuKeyDown, false);
            document.getElementById("rollback").addEventListener("click", rollback, false);
            document.getElementById("simpan").addEventListener("click", simpan, false);
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

        function rollback() {
            $.post(API_ROLLBACK_SIGN_UP_PENJUAL, { id_akun: id_akun }, (response) => {
                if (response.status == "berhasil") {
                    document.location.replace("index.html");
                } else {
                    M.toast({ html: response.message });
                }
            }).fail(function () { M.toast({ html: "Error" }) });
        }

        function get_detail_penjual() {
            if (localStorage.id_akun == "" || localStorage.id_akun == "undefined" || localStorage.id_akun == null) {
                document.location.replace("../dashboard/index_publik.html");
            }
            const URL_DETAIL_PEMBELI = base_url + "api/user/penjual/detail";
            $.get(URL_DETAIL_PEMBELI, { id_akun: localStorage.id_akun }, (response) => {
                $("#kategori-tawar").show();
            }).fail(() => {

            });
        }

        function success(position) {
            var element = document.getElementById("map");
            var marker;
            var posisilat, posisilng;
            posisilat = position.coords.latitude;
            posisilng = position.coords.longitude;
            initMap(posisilat, posisilng);
        };

        function getCurrentLocation() {
            navigator.geolocation.getCurrentPosition(success, error);
        }

        function error(error) {
            var x = document.getElementById("map");
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    x.innerHTML = "Anda belum menmberi akses lokasi"
                    break;
                case error.POSITION_UNAVAILABLE:
                    x.innerHTML = "Informasi lokasi tidak ada."
                    break;
                case error.TIMEOUT:
                    x.innerHTML = "The request to get user location timed out."
                    break;
                case error.UNKNOWN_ERROR:
                    x.innerHTML = "An unknown error occurred."
                    break;
            }
        }

        // onError Callback receives a PositionError object
        //
        function onError(error) {
            alert('code: ' + error.code + '\n' +
                'message: ' + error.message + '\n');
        }

        function taruhMarker(peta, posisiTitik) {
            if (marker) {
                // pindahkan marker
                marker.setPosition(posisiTitik);
            } else {
                // buat marker baru
                marker = new google.maps.Marker({
                    position: posisiTitik,
                    map: peta
                });
            }
            posisilat = posisiTitik.lat();
            posisilng = posisiTitik.lng();
            console.log("Posisi marker: " + posisilat + "," + posisilng);
            $("body").find("input[name='latitude']").val(posisilat);
            $("body").find("input[name='longitude']").val(posisilng);
        }
        function initMap(lat, lng) {
            $("body").find("input[name='latitude']").val(lat);
            $("body").find("input[name='longitude']").val(lng);
            var propertiPeta = {
                center: new google.maps.LatLng(lat, lng), //nentuin titik pusat nya dimana (awal map kebuka, bukan posisi marker)
                zoom: 14, //semakin banyak semakin dekat min 1 maksimal
                mapTypeId: google.maps.MapTypeId.ROADMAP //roadmap, satelite, hybrid, terrain
            };
            var point = new google.maps.LatLng(lat, lng);
            var peta = new google.maps.Map(document.getElementById("map"), propertiPeta); //utama bikin map
            marker = new google.maps.Marker({
                position: point,
                map: peta
                //icon
            });
            google.maps.event.addListener(peta, 'click', function (event) {
                taruhMarker(this, event.latLng);
            });
        }

        function simpan() {
            var nama_usaha = $("[name=nama_usaha]").val();
            var jamBuka = $("[name=jamBuka]").val();
            var jamTutup = $("[name=jamTutup]").val();
            var jml_kolam = $("[name=jml_kolam]").val();
            var alamat_usaha = $("[name=alamat_usaha]").val();
            var kab = $("[name=kab_pb]").val();
            var kec = $("[name=kec_pb]").val();
            var kel = $("[name=kel_pb]").val();
            var formData = new FormData($("form")[0]);
            formData.append("id_pj", localStorage.id_akun);
            $.ajax({
                url: API_SIGN_UP_USAHA,
                data: formData,
                contentType: false,
                cache: false,
                processData: false,
                type: 'POST',
                dataType: 'json',
                success: function (resp) {
                    if (resp.status == 'success') {
                        M.toast({ html: resp.message });
                        setTimeout(() => { document.location.replace('index.html') }, 1500);
                    } else {
                        alert('Data gagal disimpan');
                        M.toast({ html: resp.message });
                    }
                }
            });
        }
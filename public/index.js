(function () {

    /**
    * Obtains parameters from the hash of the URL
    * @return Object
    */
    function getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while (e = r.exec(q)) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }


    function getTracks(playlist_id) {
        //shubh.js
        $.ajax({
            url: `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            async: false,
            success: function (response) {
                response.items.forEach(track => {
                    let n = track.track.name.toLowerCase();
                    if (
                        n.includes('krishna') ||
                        n.includes('krsna') ||
                        n.includes('radha') ||
                        n.includes('radhe') ||
                        n.includes('hanuman') ||
                        n.includes('shiv') ||
                        n.includes('govinda')
                    ) {
                        // console.log(n);
                        return true;
                    }
                });

            },
        });
        return false;
    }

    var params = getHashParams();

    var access_token = params.access_token,
        refresh_token = params.refresh_token,
        error = params.error;

    if (error) {
        alert('There was an error during the authentication');
    } else {
        if (access_token) {
            console.log(`access_token: ${access_token}, refresh_token: ${refresh_token}`)
            $('#login').hide();
            $('#loggedin').show();
            $.ajax({
                url: 'https://api.spotify.com/v1/me/playlists?limit=50',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (response) {
                    response.items.forEach(playlist => {
                        setTimeout(() => {

                            $.ajax({
                                url: playlist.tracks.href,
                                headers: {
                                    'Authorization': 'Bearer ' + access_token
                                },
                                async: true,
                                success: function (response) {
                                    const arrAvg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
                                    function getRandom(arr, n) {
                                        var result = new Array(n),
                                            len = arr.length,
                                            taken = new Array(len);
                                        if (n > len)
                                            throw new RangeError("getRandom: more elements taken than available");
                                        while (n--) {
                                            var x = Math.floor(Math.random() * len);
                                            result[n] = arr[x in taken ? taken[x] : x];
                                            taken[x] = --len in taken ? taken[len] : len;
                                        }
                                        return result;
                                    }
                                    let energies = [], dancabilities = [], vibes = [], ids = [];
                                    response.items.forEach(item => {
                                        try {
                                            ids.push(item.track.id);
                                        } catch {

                                        }
                                    });
                                    if (response.items.length > 100) {
                                        ids = getRandom(ids, 100);
                                    }
                                    $.ajax({
                                        url: `https://api.spotify.com/v1/audio-features?ids=${ids.join()}`,
                                        headers: {
                                            'Authorization': 'Bearer ' + access_token
                                        },
                                        async: false,
                                        success: function (response) {
                                            response.audio_features.forEach(features => {
                                                try {
                                                    energies.push(features.energy);
                                                    dancabilities.push(features.danceability);
                                                    vibes.push(features.valence);
                                                } catch {

                                                }
                                            });
                                        },
                                    });
                                    let a = arrAvg(energies); a = a * 100; a = a.toFixed(2); energies = [];
                                    let b = arrAvg(dancabilities); b = b * 100; b = b.toFixed(2); dancabilities = [];
                                    let c = arrAvg(vibes); c = c * 100; c = c.toFixed(2); vibes = [];
                                    if (c < 10) {
                                        c = "0" + c;
                                    }
                                    if (c < 50) {
                                        d = `${c}%<br>big sad%`;
                                    } else {
                                        d = `${c}%<br>big happy`;
                                    }
                                    let n = playlist.name.toLowerCase();
                                    if (
                                        n.includes('krishna') ||
                                        n.includes('krsna') ||
                                        n.includes('radha') ||
                                        n.includes('radhe') ||
                                        n.includes('hanuman') ||
                                        n.includes('shiv') ||
                                        n.includes('govinda') ||
                                        n.includes('bhaj') ||
                                        n.includes('bhaj') ||
                                        n.includes('kcsoc') ||
                                        n.includes('shubh')
                                    ) {
                                        d = `${c}%<br>big Haribol!`;
                                    }

                                    // if ( getTracks(playlist.id)==true ){
                                    //     d = `Hare Krsna<br>(${c}%)`;
                                    // }
                                    try {
                                        $('table').append(
                                            `<tr class="animate bounceInDown">
                                            <td><img src=${playlist.images[2].url}></td>
                                            <td>${playlist.name}</td>
                                            <td>${a}%</td>
                                            <td>${b}%</td>
                                            <td>${d}</td>
                                            </tr>`
                                        );
                                    } catch (error) {
                                        $('table').append(
                                            `<tr class="animate bounceInDown">
                                                <td><img width=60 src=${playlist.images[0].url}></td>
                                                <td>${playlist.name}</td>
                                                <td>${a}%</td>
                                                <td>${b}%</td>
                                                <td>${d}</td>
                                                </tr>`
                                        );
                                    }
                                    $('table').css("max-width", "100%");
                                }
                            });
                        }, 1000);
                    });
                }
            });
        } else {
            // render initial screen
            $('#login').show();
            $('#loggedin').hide();
        }
    }

    document.getElementById('obtain-new-token').addEventListener('click', function () {
        $.ajax({
            url: '/refresh_token',
            data: {
                'refresh_token': refresh_token
            }
        }).done(function (data) {
            access_token = data.access_token;
        });
    }, false);

    document.getElementById('tanban').addEventListener('click', function () {
        window.location.pathname = "tanban";
    }, false);

})();

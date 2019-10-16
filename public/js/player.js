$( document ).ready(function() {
    var playBtn = document.getElementById('playBtn')
    var pauseBtn = document.getElementById('pauseBtn')


    var albumBucketName = 'jeff-music';

// Initialize the Amazon Cognito credentials provider
    AWS.config.region = 'us-east-2'; // Region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-2:097ae679-e588-4190-93c3-ef0a2587e9e6',
    });

// Create a new service object
    var s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        params: {Bucket: albumBucketName}
    });

    var audio = []

    function getMusic() {
        s3.listObjects({}, function (err, data) {
            if (err) {
                return alert('There was an error viewing your album: ' + err.message);
            }
            // 'this' references the AWS.Response instance that represents the response
            var href = this.request.httpRequest.endpoint.href;
            var bucketUrl = href + albumBucketName + '/';

            var photos = data.Contents.map(function (photo) {
                var photoKey = photo.Key;
                var photoUrl = bucketUrl + encodeURIComponent(photoKey);
                audio.push(photoUrl)
            });
        });
    }

    getMusic()

    $(pauseBtn).hide();
    $(nextBtn).hide();

    var Player = function () {

    }

    var getRandom = function (scale) {
        return scale * (1 - Math.sqrt(1 - Math.random()))
    }

    var getRandomFile = function (audio) {
        rand = Math.random();
        length = audio.length;
        randIndex = Math.floor(rand * length);
        randFile = audio[randIndex]
        return randFile
    }

    Player.prototype = {
        play: function () {
            var self = this;
            if (self.sound) {
                self.sound.stop();
            }

            var song = getRandomFile(audio)

            self.sound = new Howl({
                src: song,
                html5: false,
                volume: 0.5,
            })

            self.sound.play();
            console.log(self)

            self.sound.on('end', function () {
                randNumber = getRandom(13)
                console.log('done', randNumber)

                setTimeout(function () {
                    player.play();
                }, randNumber * 1000)
            })
        },

        pause: function () {
            var self = this;
            self.sound.pause();

            console.log("pause")
        }
    }

    var player = new Player()

    playBtn.addEventListener('click', function () {
        player.play();
        $(playBtn).hide();
        $(pauseBtn).show();
        $(nextBtn).show();
    });

    nextBtn.addEventListener('click', function () {
        player.play();
        $(playBtn).hide();
        $(pauseBtn).show();
    });

    pauseBtn.addEventListener('click', function () {
        player.pause();
        $(playBtn).show();
        $(pauseBtn).hide();
    });
})


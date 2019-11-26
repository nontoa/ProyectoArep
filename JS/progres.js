var fileChooser = document.getElementById('file-chooser');
var button = document.getElementById('upload-button');
var results = document.getElementById('results');

button.addEventListener('click', function() {
    $(".progreso").empty()
    $("#results").empty()
    $(".progreso").append('<br><center><svg class="progress-circle indefinite" width="100" height="100">' + '<g transform="rotate(-90,50,50)">' + '<circle class="bg" r="15" cx="50" cy="50" fill="none"></circle>' + '<circle class="bg" r="15" cx="50" cy="50" fill="none"></circle>' + '<circle class="progress" r="15" cx="50" cy="50" fill="none"></circle>' + '</g>' + '</svg></center>')
    var file = fileChooser.files[0];
    if (file) {
        AWS.config.update({
            "accessKeyId": "AKIAY4DJ4PSCMLPEDGPD",
            "secretAccessKey": "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",
            "region": "us-east-2"
        });
        var s3 = new AWS.S3();
        var params = {
            Bucket: 'uploadshop',
            Key: file.name,
            ContentType: file.type,
            Body: file,
            ACL: 'public-read'
        };
        s3.upload(params, function(err, res) {
            if (err) {
                $(".progreso").empty()
                $(".progreso").append('<br><center><img src="/images/bad.png" style="width:30px;height:30px"></center>')

                results.innerHTML = ("<center><h4>Error uploading data: </h4></center>", err);
            } else {
                $(".progreso").empty()
                app.publishNotify();
                $(".progreso").append('<br><center><img src="/images/cc.png" style="width:30px;height:30px"></center>')
                results.innerHTML = ('<center><h4>Success Uploaded File</h4></center>');


            }
        });
    } else {
        results.innerHTML = '<center><h4>Nothing Upload</h4></center>';
    }
}, true);




//ID_CLAVE_ACCESO=AKIAY4DJ4PSCMLPEDGPD
//ID_CLAVE_SECRETA=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
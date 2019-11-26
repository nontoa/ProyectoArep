
$('.filepond').on('FilePond:removefile', function(e) {
    var intro3 = e.detail.file.file.name.replace(/ /g, '');
    var intro3 = intro3.replace(".", '');
    var intro3 = intro3.replace("(", '');
    var intro3 = intro3.replace(")", '');
    var intro3 = intro3.replace(/[.*+?^${}()|[\]\\]/g, "");
    $('#' + intro3).empty()
    $('#' + intro3).remove()
});
browser.contextMenus.create({
    id: "download-9gag-media",
    title: "Download 9gag",
    contexts: ["image", "video"],
});

browser.contextMenus.onClicked.addListener((info, tab) => {

    if (info.menuItemId === "download-9gag-media") {
        console.log(info);
        var url = info.srcUrl;
        var ext = getUrlExtension(url);
        console.log(fileName,url, ext);
        if(ext == "mp4" || ext == "jpg"){
            mainUrl = url;
        }else if(ext == "webp" || ext == "webm"){
            if(ext == "webp"){
                mainUrl = url.substr(0, url.lastIndexOf('.')) + ".jpg";
            }else{
                mainUrl = url.substr(0, url.lastIndexOf('.')) + ".mp4";
            }
        }
        console.log(mainUrl);

        function onStartedDownload(id) {
            console.log(`Started downloading: ${id}`);
          }
          
          function onFailed(error) {
            console.log(`Download failed: ${error}`);
          }
          
          var downloadUrl = mainUrl;
          
         var fileName = getFileName(mainUrl) + "." + getUrlExtension(mainUrl);
          var downloading = browser.downloads.download({
            saveAs: true,
            filename : fileName,
            url : downloadUrl,
            conflictAction : 'uniquify'
          });
          
          downloading.then(onStartedDownload, onFailed);
    }
});

function getUrlExtension(url){
    return url.substr(url.lastIndexOf('.')+1);
}
function getFileName(url){
    return url.substr(url.lastIndexOf('/')+1, url.lastIndexOf('.')-1-url.lastIndexOf('/'));
}
// https://gist.github.com/Rob--W/ec23b9d6db9e56b7e4563f1544e0d546
function escapeHTML(str) {
    // Note: string cast using String; may throw if `str` is non-serializable, e.g. a Symbol.
    // Most often this is not the case though.
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;")
        .replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

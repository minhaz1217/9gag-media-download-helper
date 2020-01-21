
browser.contextMenus.create({
    id: "download-9gag-media",
    title: "Download 9gag",
    contexts: ["image", "video"],
    documentUrlPatterns  : ["*://*.9gag.com/*"]
});

browser.contextMenus.onClicked.addListener((info, tab) => {

    // console.log("Info\n");
    // console.log(info);
    // console.log("TAB\n");
    // console.log(tab);
    // console.log(info.pageUrl);
    // console.log(document.location);
    // console.log(window.location);
    if (info.menuItemId === "download-9gag-media") {
        // console.log(info);
        var url = info.srcUrl;
        var ext = getUrlExtension(url);
        var mainUrl = "";
        // console.log(fileName, url, ext);
        if (ext == "mp4" || ext == "jpg") {
            mainUrl = url;
        } else if (ext == "webp" || ext == "webm") {
            if (ext == "webp") {
                mainUrl = url.substr(0, url.lastIndexOf('.')) + ".jpg";
            } else {
                mainUrl = url.substr(0, url.lastIndexOf('.')) + ".mp4";
            }
        }
        if(mainUrl != ""){
            var downloadUrl = mainUrl;
            var fileName = getFileName(mainUrl) + "." + getUrlExtension(mainUrl);
            var downloading = browser.downloads.download({
                saveAs: true,
                filename: fileName,
                url: downloadUrl
            });
            //downloading.then(onStartedDownload, onFailed);
        }else{
            console.log("Invalid File");
        }
    }
});

function getUrlExtension(url) {
    return url.substr(url.lastIndexOf('.') + 1);
}

function getFileName(url) {
    return url.substr(url.lastIndexOf('/') + 1, url.lastIndexOf('.') - 1 - url.lastIndexOf('/'));
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
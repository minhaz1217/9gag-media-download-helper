
browser.contextMenus.create({
    id: "download-9gag-media",
    title: "Download 9gag",
    contexts: ["image", "video"],
    documentUrlPatterns  : ["*://*.9gag.com/*"]
});

browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "download-9gag-media") {
        var url = info.srcUrl;
        var ext = getUrlExtension(url);
        var mainUrl = "";
        var fileName = "";
        var title = tab.title;
        var regex = /(9gag.com\/gag)/g;
        if(tab.url.match(regex)){
            var title = tab.title;
            fileName = title.substr(0, title.lastIndexOf('-')-1 );
        }
        // console.log(fileName, url, ext);
        if (ext == "mp4" || ext == "jpg") {
            mainUrl = url;
            if(ext == 'jpg' && fileName == ""){
                fileName = info.linkText;
            }
        } else if (ext == "webp" || ext == "webm") {
            var urlWithoutExt = getUrlWithoutExtension(url);
            var codecSuffix = "";
            var outputExt = "";
            if (ext == "webp") {
                codecSuffix = "wp";
                outputExt = "jpg";
                if(fileName == ""){
                    fileName = info.linkText;
                }
            } else {
                codecSuffix = "vp9";
                outputExt = "mp4";
            }
            if (hasCodecSuffix(urlWithoutExt, codecSuffix))
                mainUrl = getUrlWithoutCodecSuffix(urlWithoutExt, codecSuffix) + '.' + outputExt;
            else
                mainUrl = urlWithoutExt + '.' + outputExt;
        }
        if(mainUrl != ""){
            var downloadUrl = mainUrl;
            if(fileName == ""){
                fileName = getFileName(mainUrl) + "." + getUrlExtension(mainUrl);
            }else{
                fileName +="." + getUrlExtension(mainUrl);
            }
            console.log(fileName);

            var downloading = browser.downloads.download({
                saveAs: true,
                filename: reverseEscapeHTML(fileName),
                url: downloadUrl
            });
            // downloading.then(onStartedDownload, onFailed);
        }else{
            console.log("Invalid File");
        }
    }
});

function getUrlExtension(url) {
    return url.substr(url.lastIndexOf('.') + 1);
}
function getUrlWithoutExtension(fileUrl) {
    return fileUrl.substr(0, fileUrl.lastIndexOf('.'))
}

function getFileName(url) {
    return url.substr(url.lastIndexOf('/') + 1, url.lastIndexOf('.') - 1 - url.lastIndexOf('/'));
}

function hasCodecSuffix(fileUrlWithoutExt, codecStr) {
    var possibleSuffix = fileUrlWithoutExt.substr(fileUrlWithoutExt.length - codecStr.length, codecStr.length)
    if (possibleSuffix == codecStr)
        return true;
    return false;
}
function getUrlWithoutCodecSuffix(fileUrlWithoutExt, codecStr){
    return fileUrlWithoutExt.substr(0, fileUrlWithoutExt.length - codecStr.length)
}
// https://gist.github.com/Rob--W/ec23b9d6db9e56b7e4563f1544e0d546
function escapeHTML(str) {
    // Note: string cast using String; may throw if `str` is non-serializable, e.g. a Symbol.
    // Most often this is not the case though.
    return String(str)
        .replaceAll(/&/g, "&amp;")
        .replaceAll(/"/g, "&quot;").replace(/'/g, "&#39;")
        .replaceAll(/</g, "&lt;").replace(/>/g, "&gt;");
}
function reverseEscapeHTML(str){
    return String(str).replace("&#039;", "'")
        .replaceAll("&#amp;","&")
        .replaceAll("&rsquo;", "'")
        .replaceAll("&quot;", "'")
        .replaceAll("?", "")
        .replaceAll("|", "")
        .replaceAll("\"", "'")
        .replaceAll(":", "_")
        .replaceAll("<", "")
        .replaceAll(">", "")
        .replaceAll("*", "");
}
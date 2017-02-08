chrome.runtime.onConnect.addListener(function(devToolsConnection) {
    // assign the listener function to a variable so we can remove it later
    var devToolsListener = function(message, sender, sendResponse) {
        chrome.downloads.download({
            // url: 'http://www.index.hu',
            url: '' + message.image,
            filename: "mydownload.jpg"
        }, function( downloadId ) {
            console.log('downloadid:' + downloadId );
            chrome.downloads.show(downloadId);
        });
    }
    // add the listener
    devToolsConnection.onMessage.addListener(devToolsListener);

    devToolsConnection.onDisconnect.addListener(function() {
         devToolsConnection.onMessage.removeListener(devToolsListener);
    });
});
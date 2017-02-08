chrome.devtools.panels.create("My Panel", "MyPanelIcon.png", "Panel.html",
    function (panel) { // code invoked on panel creation
        chrome.devtools.inspectedWindow.eval('console.log("xxx");');

        var content = null;
        var window = null;


        function sendMessageToDownload(data) {
            // Create a connection to the background page
            var backgroundPageConnection = chrome.runtime.connect({
                name: "devtools-page"
            });

            backgroundPageConnection.postMessage({
                name: 'init',
                tabId: chrome.devtools.inspectedWindow.tabId,
                // image: this.content.firstChild.src
                image: data
            });
        }

        panel.onShown.addListener(function (w) {
            this.content = w.document.getElementById('content');
            this.window = w;

            var clearButton = w.document.getElementById('clearButton');
            clearButton.addEventListener('click', function () {
                while (this.content.hasChildNodes()) {
                    this.content.removeChild(this.content.lastChild);
                }
            }.bind(this));

            var downloadButton = w.document.getElementById('downloadButton');
            downloadButton.addEventListener('click', function () {
                // sendMessageToDownload();
                var http = new XMLHttpRequest();
                var url = "http://www.index.hu";
                var params = "";
                // var params = "lorem=ipsum&name=binny";
                // http.open("POST", url, true);
                http.open("GET", url, true);

                //Send the proper header information along with the request
                http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                http.onreadystatechange = function () {//Call a function when the state changes.
                    if (http.readyState == 4 && http.status == 200) {
                        alert(http.responseText);
                    }
                }
                http.send(params);
            }.bind(this));
        });

        panel.onHidden.addListener(function (w) {
            this.content = null;
            this.window = null;
        });

        chrome.devtools.network.onRequestFinished.addListener(
            function (request) {
                //  if (request.response.bodySize > 4*1024) {
                //   this.largeItems.push( 'x');
                //   chrome.devtools.inspectedWindow.eval(
                //       'console.log("Large image: " + unescape("' +
                //       escape(request.request.url) + '"))');
                // // }
                // addUrl(request.request.url);
                var contentType = '';
                request.response.headers.forEach(function (element) {
                    if (element.name.toLowerCase() == 'content-type'
                        && element.value.toLowerCase() == 'image/jpeg'
                    ) {
                        // var image = addImage(request.request.url);
                        //this is how we van read the response body:
                        request.getContent(function (content, encoding) {
                            var image = this.window.document.createElement("img");
                            image.src = 'data:image/jpeg;base64,' + content;
                            image.addEventListener('click', function () {
                                sendMessageToDownload(image.src);
                            }.bind(this));
                            this.content.appendChild(image);

                            var caption = this.window.document.createElement("div");
                            caption.innerHTML = request.request.url;
                            this.content.appendChild(caption);
                        });
                        console.log('adding image');
                        return;
                    }
                }, this);
            });



    });

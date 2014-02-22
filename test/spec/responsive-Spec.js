phantom.casperTest = true;
var casper = require("casper").create(),
    viewportSizes = [
        [320, 480],
        [320, 568],
        [600, 1024],
        [1024, 768],
        [1280, 800],
        [1440, 900]
    ],
    url = "http://127.0.0.1:9000/app/", // replace this with your app url
    saveDir = url.replace(/[^a-zA-Z0-9]/gi, '-').replace(/^https?-+/, '');

casper.start();

casper.test.begin('Check for menu', viewportSizes.length, function suite(test) {
    casper.each(viewportSizes, function (self, viewportSize, i) {
        var width = viewportSize[0],
            height = viewportSize[1];
        
        casper.wait(5000, function () {
			
            this.viewport(width, height);
            this.echo("width : " + width +" Height: "+height);

            casper.thenOpen(url, function () {	
                var aTags =  casper.evaluate(function(){
                    // In here, the context of execution (global) is the same
                    // as if you were at the console for the loaded page
                    return $('a');
                });				
                console.log("a tags "+ aTags.length);

				if (width < 768)
                    test.assertVisible('.navbar-toggle');
                else
                    test.assertNotVisible('.navbar-toggle');

                var FPfilename = saveDir + '/fullpage-' + width + ".png";
                this.captureSelector(FPfilename, 'body', true);
            }).run();
        });
    });
    test.done();
});


casper.run(function () {
    this.echo('Finished captures for ' + url).exit();
});
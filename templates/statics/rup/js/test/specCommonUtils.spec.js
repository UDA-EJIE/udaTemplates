const DIST = "/x21aStatics/3x/rup";
const DEMO = "/demo";

function testTrace(title, toTrace) {
    console.info("\n\n*****************************************************\n\n" +
        title +
        "\n--------------------------------\n\n" +
        toTrace +
        "\n\n*****************************************************\n\n");
}

function loadCss(callback) {
    $('head > style').remove();
    $('head').append('<style></style>');
    return $.when($.ajax(DIST + '/css/externals/tether/tether.min.css'))
        .then((data, textStatus, jqXHR) => {
            $('head > style').append(data);
            $.when($.ajax(DIST + '/css/externals/bootstrap/bootstrap.min.css'))
                .then((data, textStatus, jqXHR) => {
                    $('head > style').append(data);
                        $.when($.ajax(DIST + '/css/rup-base.css'))
                            .then((data, textStatus, jqXHR) => {
                                $('head > style').append(data);
                                $.when($.ajax(DIST + '/css/rup-theme.css'))
                                    .then((data, textStatus, jqXHR) => {
                                        $('head > style').append(data);
                                        $.when($.ajax(DIST + '/css/rup-jqueryui-theme.css'))
                                            .then((data, textStatus, jqXHR) => {
                                                $('head > style').append(data);
                                                $.when($.ajax('/x21aStatics/3x' + '/x21a/styles/main.css'))
                                                .then((data, textStatus, jqXHR) => {
                                                    $('head > style').append(data);
                                                    if($('#content').length === 0) {
                                                        $('body').append('<div id="content" class="container"></div>');
                                                    }
                                                    callback();
                                                });
                                            });
                                    });
                            });
                });
        });
}
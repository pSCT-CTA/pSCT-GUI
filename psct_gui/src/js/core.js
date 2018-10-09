import * as $ from 'jquery';

// Function to enable switching between tabs
export function enableTabs() {

    $(".nav.flex-column a").click(
        function() {
            $(this).tab('show');
        }
    );
}

// Function to switch between tabs
export function showLoginAlert(login_attempt) {
    var $this = $("#login_alert");
    $this.removeClass();
    $this.addClass("alert alert-dismissible fade");

    if (login_attempt == 'fail') {
        $this.children('.alert-text').text('Login failed. Incorrect username or password.');
        $this.addClass("alert-danger");
    }
    else if (login_attempt == 'redirect') {
        $this.children('.alert-text').text('Sorry, please log in first.');
        $this.addClass("alert-warning");
    }
    else if (login_attempt == 'logout') {
        $this.children('.alert-text').text('Successfully logged out.');
        $this.addClass("alert-success");
    }
    $this.show();
}

// Function to resize card on click
export function enableResizeCards() {

    $(".card-fullscreen-button").click(
        function() {
            var $this = $(this);

            if ($this.children('i').hasClass('fa-expand-arrows-alt'))
            {
                $this.children('i').removeClass('fa-expand-arrows-alt');
                $this.children('i').addClass('fa-compress');
            }
            else if ($this.children('i').hasClass('fa-compress'))
            {
                $this.children('i').removeClass('fa-compress');
                $this.children('i').addClass('fa-expand-arrows-alt');
            }

            $(this).closest('.card').toggleClass('card-fullscreen');
        }
    );

}

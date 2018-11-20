<<<<<<< Updated upstream
import * as $ from 'jquery';

import cta_logo from '../img/cta_logo.png';
import psct_logo from '../img/cta_psct_logo.png';

// Function to enable switching between tabs
export function enableTabs() {

    $(".nav.flex-column a").click(
        function() {
            $(this).tab('show');
        }
    );
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
=======
import * as $ from 'jquery';

import cta_logo from '../img/cta_logo.png';
import psct_logo from '../img/cta_psct_logo.png';

// Function to enable switching between tabs
export function enableTabs() {

    $(".nav.flex-column a").click(
        function() {
            $(this).tab('show');
        }
    );
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
>>>>>>> Stashed changes

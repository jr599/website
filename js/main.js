$(document).ready(function() {
    // Helper Function: Set Initial Opacity for Sections
    const setInitialOpacity = (selectors) => {
        selectors.forEach(selector => {
            $(selector).css('opacity', '0');
        });
    };

    // Helper Function: Initialize Animations
    const fading = 0.75;
    const initializeAnimations = () => {
        const animationSections = [
            '#introduction',
            '#works',
            '#projects',
            '#education'
        ];

        return animationSections.map(selector => {
            const offset = $(selector).offset().top;
            return {
                threshold: offset - window.innerHeight * fading,
                selector,
                animationClass: `${selector.slice(1)}animation`
            };
        });
    };

    // Set initial opacity for relevant sections
    setInitialOpacity(['#introduction', '#works', '#projects', '#education']);

    // Initialize animation settings
    const animations = initializeAnimations();

    // Page Scroll & Header Scroll
    var sections = $('section'),
        nav = $('nav[role="navigation"]'),
        hr = $('.newhr');

    // Handle scroll events
    $(window).on('scroll', function() {
        const scroll = $(this).scrollTop();
        $('#header').toggleClass('fixed', scroll >= 50);

        animations.forEach(({ threshold, selector, animationClass }) => {
            if (scroll >= threshold) {
                $(selector).css('opacity', '1');
                $(selector).addClass(animationClass);
            }
        });

        sections.each(function() {
            const top = $(this).offset().top - 76,
                  bottom = top + $(this).outerHeight();
            if (scroll >= top && scroll <= bottom) {
                nav.find('a').removeClass('active');
                nav.find('a[href="#' + $(this).attr('id') + '"]').addClass('active');
            }
        });
    });

    // Page Scroll Navigation
    nav.find('a').on('click', function() {
        const $el = $(this),
              id = $el.attr('href');
        $('html, body').animate({
            scrollTop: $(id).offset().top - 75
        }, 500);
        return false;
    });

    // Mobile Navigation
    $('.nav-toggle').on('click', function() {
        $(this).toggleClass('close-nav');
        nav.toggleClass('open');
        return false;
    });
    nav.find('a').on('click', function() {
        $('.nav-toggle').toggleClass('close-nav');
        nav.toggleClass('open');
    });

    // Modal Handling
    const handleModal = (btnId, modalId, closeClass) => {
        const modal = document.getElementById(modalId);
        const btn = document.getElementById(btnId);
        const span = document.getElementsByClassName(closeClass)[0];

        btn.onclick = function() {
            modal.style.display = "block";
        };
        span.onclick = function() {
            modal.style.display = "none";
        };
        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        };
    };

    // Initialize Modals
    handleModal("mortgageBtn", "mortgageModal", "mortgageClose");
    handleModal("recipeBtn", "recipeModal", "recipeClose");
});




// Added socket details

const socket = io.connect('http://localhost:4000');

let priceData = [];
const ctx = document.getElementById('priceChart').getContext('2d');
const priceChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: Array.from({ length: 10 }, (_, i) => i),
    datasets: [
      {
        label: 'Bitcoin Price (USD)',
        data: priceData,
        borderColor: 'blue',
      },
    ],
  },
});

socket.on('updatePrice', (price) => {
  priceData.push(price);

  // Keep only the last 10 data points
  if (priceData.length > 10) priceData.shift();

  priceChart.update();
});
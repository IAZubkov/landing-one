$(document).ready(function () {
    const $header = $('.header');
    const $menu = $('.menu');
    const $burger = $('.menu-burger');

    function getHeaderHeight() {
        return $header.outerHeight();
    }

    function updateHeaderOffset() {
        document.documentElement.style.setProperty('--header-height', getHeaderHeight() + 'px');
    }

    function scrollToTarget(selector) {
        const $target = $(selector);
        if (!$target.length) {
            return;
        }

        $('html, body').animate({
            scrollTop: $target.offset().top - getHeaderHeight()
        }, 600);
    }

    function closeMenu() {
        $menu.removeClass('is-open');
        $burger.removeClass('is-open').attr('aria-expanded', 'false');
    }

    $('a[href^="#"]').on('click', function (event) {
        const href = $(this).attr('href');

        if (!href || href === '#') {
            return;
        }

        const $target = $(href);

        if (!$target.length) {
            return;
        }

        event.preventDefault();
        scrollToTarget(href);
        closeMenu();
    });

    $('[data-scroll]').on('click', function () {
        scrollToTarget($(this).data('scroll'));
        closeMenu();
    });

    $burger.on('click', function () {
        const isOpen = $menu.toggleClass('is-open').hasClass('is-open');
        $(this).toggleClass('is-open').attr('aria-expanded', isOpen);
        window.setTimeout(updateHeaderOffset, 0);
    });

    updateHeaderOffset();
    $(window).on('resize load', updateHeaderOffset);

    function initHeroAnimation() {
        const hero = document.querySelector('.hero');
        const track = document.querySelector('.hero-image-track');

        if (!hero || !track) {
            return;
        }

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        let ticking = false;

        function updateHeroParallax() {
            const scrollTop = window.scrollY || window.pageYOffset;
            const heroTop = hero.offsetTop;
            const heroHeight = hero.offsetHeight;
            const offset = scrollTop - heroTop;

            if (offset < 0) {
                track.style.setProperty('--hero-shift', '0px');
            } else if (offset <= heroHeight) {
                track.style.setProperty('--hero-shift', `${offset * 0.25}px`);
            }

            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(updateHeroParallax);
                ticking = true;
            }
        }, { passive: true });

        window.addEventListener('resize', updateHeroParallax);
        updateHeroParallax();
    }

    initHeroAnimation();

    function initScrollFadeIn(selector) {
        document.querySelectorAll(selector).forEach(function (element) {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                element.classList.add('is-visible');
                return;
            }

            const observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

            observer.observe(element);
        });
    }

    function initGalleryMainFadeIn(selector) {
        document.querySelectorAll(selector).forEach(function (main) {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                main.classList.add('is-visible');
                return;
            }

            const observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });

            observer.observe(main);
        });
    }

    function initGallerySlider($slider, $counter, prevButton, nextButton) {
        if (!$slider.length) {
            return;
        }

        function updateSliderCounter(slick, index) {
            const current = String(index + 1).padStart(2, '0');
            const total = String(slick.slideCount).padStart(2, '0');
            $counter.text(current + '/' + total);
        }

        $slider.on('init reInit afterChange', function (event, slick, currentSlide) {
            const index = typeof currentSlide === 'number' ? currentSlide : slick.currentSlide;
            updateSliderCounter(slick, index);
        });

        $slider.slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            fade: true,
            speed: 600,
            arrows: false,
            dots: false,
            autoplay: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            autoplaySpeed: 4500,
            pauseOnHover: true
        });

        $(window).on('resize', function () {
            $slider.slick('setPosition');
        });

        $(prevButton).on('click', function () {
            $slider.slick('slickPrev');
        });

        $(nextButton).on('click', function () {
            $slider.slick('slickNext');
        });
    }

    initScrollFadeIn('section[id]');

    initGallerySlider(
        $('.about-gallery-slider'),
        $('.about-counter'),
        '.about-prev',
        '.about-next'
    );

    initGalleryMainFadeIn('.about-gallery-main');

    const $architectureSlider = $('.architecture-slides');
    const $architectureCounter = $('.architecture-counter');

    function updateArchitectureCounter(slick, index) {
        const current = String(index + 1).padStart(2, '0');
        const total = String(slick.slideCount).padStart(2, '0');
        $architectureCounter.text(current + '/' + total);
    }

    if ($architectureSlider.length) {
        $architectureSlider.on('init reInit afterChange', function (event, slick, currentSlide) {
            const index = typeof currentSlide === 'number' ? currentSlide : slick.currentSlide;
            updateArchitectureCounter(slick, index);
        });

        $architectureSlider.slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            centerMode: true,
            centerPadding: '100px',
            infinite: true,
            arrows: false,
            dots: false,
            initialSlide: 1,
            responsive: [
                {
                    breakpoint: 1199,
                    settings: {
                        centerPadding: '40px'
                    }
                },
                {
                    breakpoint: 767,
                    settings: {
                        centerMode: false,
                        centerPadding: '0px'
                    }
                }
            ]
        });

        $('.architecture-prev').on('click', function () {
            $architectureSlider.slick('slickPrev');
        });

        $('.architecture-next').on('click', function () {
            $architectureSlider.slick('slickNext');
        });
    }

    function initAdvantagesTabs() {
        const $tabs = $('.advantages-tabs a');
        const $image = $('#advantages-image');

        if (!$tabs.length || !$image.length) {
            return;
        }

        $tabs.on('click', function (event) {
            event.preventDefault();

            const $link = $(this);
            const $item = $link.parent();

            if ($item.hasClass('active')) {
                return;
            }

            const nextSrc = $link.data('image');
            const nextAlt = $link.data('alt');

            if (!nextSrc) {
                return;
            }

            $item.addClass('active').siblings().removeClass('active');

            $image.addClass('is-fading');

            window.setTimeout(function () {
                $image.attr('src', nextSrc);

                if (nextAlt) {
                    $image.attr('alt', nextAlt);
                }

                $image.removeClass('is-fading');
            }, 350);
        });
    }

    initAdvantagesTabs();

    function initLocationForm() {
        const $form = $('#location-form');
        const $name = $('#location-name');
        const $phone = $('#location-phone');
        const $consent = $('#location-consent');
        const $modal = $('#form-modal');

        if (!$form.length) {
            return;
        }

        function clearFormErrors() {
            $form.find('.location-field, .location-checkbox').removeClass('is-invalid');
            $form.find('.location-error').removeClass('is-visible').text('');
        }

        function showFieldError($field, $error, message) {
            $field.addClass('is-invalid');
            $error.addClass('is-visible').text(message);
        }

        function isValidPhone(value) {
            const digits = value.replace(/\D/g, '');
            return digits.length >= 10 && digits.length <= 15;
        }

        function openModal() {
            $modal.addClass('is-open').attr('aria-hidden', 'false');
        }

        function closeModal() {
            $modal.removeClass('is-open').attr('aria-hidden', 'true');
        }

        function validateLocationForm() {
            clearFormErrors();

            let isValid = true;
            const name = $name.val().trim();
            const phone = $phone.val().trim();

            if (!name) {
                showFieldError($name.closest('.location-field'), $('#location-name-error'), 'Введите имя');
                isValid = false;
            }

            if (!phone) {
                showFieldError($phone.closest('.location-field'), $('#location-phone-error'), 'Введите телефон');
                isValid = false;
            } else if (!isValidPhone(phone)) {
                showFieldError(
                    $phone.closest('.location-field'),
                    $('#location-phone-error'),
                    'Введите телефон в формате +7 (999) 999-99-99'
                );
                isValid = false;
            }

            if (!$consent.is(':checked')) {
                $consent.closest('.location-checkbox').addClass('is-invalid');
                $('#location-consent-error')
                    .addClass('is-visible')
                    .text('Необходимо дать согласие на обработку персональных данных');
                isValid = false;
            }

            return isValid;
        }

        function handleCheckoutResponse(response) {
            if (response && Number(response.success) === 1) {
                $form[0].reset();
                clearFormErrors();
                openModal();
                return;
            }

            if (response && Number(response.success) === 0) {
                alert(response.message || 'Ошибка при отправке заявки');
                return;
            }

            alert('Ошибка при отправке заявки');
        }

        function parseCheckoutResponse(raw) {
            if (!raw) {
                return null;
            }

            if (typeof raw === 'object') {
                return raw;
            }

            try {
                return JSON.parse(raw);
            } catch (error) {
                return null;
            }
        }

        function submitCheckout(payload) {
            const deferred = $.Deferred();

            $.ajax({
                url: 'https://testologia.ru/checkout',
                type: 'POST',
                crossDomain: true,
                cache: false,
                dataType: 'json',
                data: payload,
                success: function (response) {
                    deferred.resolve(response);
                },
                error: function (xhr) {
                    const parsedResponse = parseCheckoutResponse(xhr.responseText);

                    if (parsedResponse) {
                        deferred.resolve(parsedResponse);
                        return;
                    }

                    if (xhr.status !== 0 || !window.fetch) {
                        deferred.reject(xhr);
                        return;
                    }

                    fetch('https://testologia.ru/checkout', {
                        method: 'POST',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                        },
                        body: $.param(payload)
                    })
                        .then(function (response) {
                            return response.text();
                        })
                        .then(function (text) {
                            deferred.resolve(parseCheckoutResponse(text));
                        })
                        .catch(function () {
                            deferred.reject(xhr);
                        });
                }
            });

            return deferred.promise();
        }

        $form.on('submit', function (event) {
            event.preventDefault();

            if (!validateLocationForm()) {
                return;
            }

            if (window.location.protocol === 'file:') {
                alert('Откройте сайт через локальный сервер WebStorm (http://localhost), а не как файл.');
                return;
            }

            const payload = {
                product: 'Запись на показ',
                name: $name.val().trim(),
                phone: $phone.val().trim()
            };

            submitCheckout(payload)
                .done(function (response) {
                    handleCheckoutResponse(response);
                })
                .fail(function () {
                    alert(
                        'Запрос к testologia.ru заблокирован браузером.\n\n' +
                        '1. Откройте chrome://extensions и отключите все расширения\n' +
                        '2. Или нажмите Ctrl+Shift+N (режим инкогнито)\n' +
                        '3. Обновите страницу и отправьте снова'
                    );
                });
        });

        $('.form-modal__close').on('click', closeModal);

        $modal.on('click', function (event) {
            if ($(event.target).is('.form-modal')) {
                closeModal();
            }
        });
    }

    initLocationForm();
});
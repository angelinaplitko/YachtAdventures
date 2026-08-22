const slider = document.querySelector('.team__list');
const cards = document.querySelectorAll('.team__item');
const dots = document.querySelectorAll('.team__dot');
const nextButton = document.querySelector('.team__next');

let currentSlide = 0;

function updateSlider() {
    const cardWidth = cards[0].offsetWidth + 16;

    slider.scrollTo({
        left: currentSlide * cardWidth,
        behavior: 'smooth'
    });

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

nextButton.addEventListener('click', () => {
    currentSlide++;

    if (currentSlide >= cards.length) {
        currentSlide = 0;
    }

    updateSlider();
});

slider.addEventListener('scroll', () => {
    const cardWidth = cards[0].offsetWidth + 16;

    currentSlide = Math.round(slider.scrollLeft / cardWidth);

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
});
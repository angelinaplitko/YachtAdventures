document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const items = Array.from(track.children);
    const nextBtn = document.querySelector('.btn-next');
    const prevBtn = document.querySelector('.btn-prev');
    const dotsContainer = document.querySelector('.carousel-dots');

    const originalLength = items.length;
    let currentIndex = 0; // Индекс текущего центрального/фокусного элемента (0 до originalLength - 1)
    let isTransitioning = false;

    // Функция для определения, сколько элементов сейчас видно на экране
    const getVisibleItemsCount = () => {
        const width = window.innerWidth;
        if (width >= 1200) return 3;
        if (width >= 768) return 2;
        return 1;
    };

    let visibleItems = getVisibleItemsCount();

    // 1. Клонирование элементов для бесшовного зацикливания.
    // Клонируем запас с запасом (равный максимальному числу видимых элементов)
    const cloneCount = 3;

    for (let i = 0; i < cloneCount; i++) {
        const startClone = items[i].cloneNode(true);
        startClone.classList.add('clone');
        track.appendChild(startClone);

        const endClone = items[originalLength - 1 - i].cloneNode(true);
        endClone.classList.add('clone');
        track.insertBefore(endClone, track.firstChild);
    }

    // 2. Создание индикаторов (точек)
//     for (let i = 0; i < originalLength; i++) {
//         const dot = document.createElement('button');
//         dot.classList.add('dot');
// if (i === 0) dot.classList.add('active');
// dotsContainer.appendChild(dot);
//   }
// const dots = Array.from(dotsContainer.children);

// 3. Функция позиционирования трека
const moveToIndex = (index, withAnimation = true) => {
    if (!withAnimation) {
        track.style.transition = 'none';
    } else {
        track.style.transition = 'transform 0.4s ease-in-out';
    }

    // Вычисляем ширину одного элемента + gap динамически
    const itemEl = track.querySelector('.carousel-item');
    const itemWidth = itemEl.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gap')) || 0;
    const stepWidth = itemWidth + gap;

    // Расчет смещения, чтобы активный (currentIndex) элемент был в фокусе (по центру окна)
    // cloneCount компенсирует смещение из-за левых клонов
    const centerOffset = (track.parentElement.getBoundingClientRect().width - itemWidth) / 2;
    const targetTranslate = -(cloneCount * stepWidth + index * stepWidth) + centerOffset;

    track.style.transform = translateX(${targetTranslate}px);

    // Обновляем активную точку
    dots.forEach((dot, i) => {
        // Приводим индекс к диапазону [0, originalLength - 1] на случай вылетов перед прыжком
        const normalizedIndex = (index + originalLength) % originalLength;
        dot.classList.toggle('active', i === normalizedIndex);
    });
};

// 4. Обработка кликов по кнопкам
const handleNext = () => {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex++;
    moveToIndex(currentIndex);
};

const handlePrev = () => {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex--;
    moveToIndex(currentIndex);
};

nextBtn.addEventListener('click', handleNext);
prevBtn.addEventListener('click', handlePrev);

// 5. Клик по точкам
dotsContainer.addEventListener('click', (e) => {
    const targetDot = e.target.closest('.dot');
    if (!targetDot || isTransitioning) return;
    currentIndex = dots.indexOf(targetDot);
    moveToIndex(currentIndex);
});

// 6. Следим за окончанием анимации для незаметного "прыжка" с клона на оригинал
track.addEventListener('transitionend', () => {
    isTransitioning = false;

    if (currentIndex >= originalLength) {
        // Если ушли вправо за пределы оригиналов — прыгаем в начало списка оригиналов
        currentIndex = 0;
        moveToIndex(currentIndex, false);
    } else if (currentIndex < 0) {
        // Если ушли влево — прыгаем в конец списка оригиналов
        currentIndex = originalLength - 1;
        moveToIndex(currentIndex, false);
    }
});

// 7. Корректный пересчет при ресайзе экрана (смена мобилка/планшет/десктоп)
window.addEventListener('resize', () => {
    visibleItems = getVisibleItemsCount();
    moveToIndex(currentIndex, false);
});

// Инициализация стартовой позиции
// Используем setTimeout, чтобы браузер успел отрисовать элементы и корректно посчитал их ширину
setTimeout(() => {
    moveToIndex(currentIndex, false);
}, 50);
});
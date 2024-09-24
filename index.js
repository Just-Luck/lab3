function animaster() {
    function fadeIn(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    function scale(element, duration, ratio) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    function moveAndHide(element, totalDuration) {
        let moveTimeout;
        let hideTimeout;

        const moveDuration = (2 / 5) * totalDuration;
        const hideDuration = (3 / 5) * totalDuration;

        move(element, moveDuration, { x: 100, y: 20 });

        moveTimeout = setTimeout(() => {
            fadeOut(element, hideDuration);
        }, moveDuration);

        return {
            reset: () => {
                clearTimeout(moveTimeout);
                clearTimeout(hideTimeout);
                fadeOut(element, 0); // мгновенно скрыть элемент
                resetMoveAndScale(element); // сбросить трансформации
            }
        };
    }

    function showAndHide(element, totalDuration) {
        fadeIn(element, totalDuration / 3);
        setTimeout(() => {
            fadeOut(element, totalDuration / 3);
        }, totalDuration / 3);
    }

    function heartBeating(element) {
        let intervalId;

        const beat = () => {
            scale(element, 500, 1.4);
            setTimeout(() => {
                scale(element, 500, 1);
            }, 500);
        };

        beat();
        intervalId = setInterval(beat, 1000);

        return {
            stop: () => clearInterval(intervalId)
        };
    }

    // Служебные функции сброса
    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function resetMoveAndScale(element) {
        element.style.transform = null;
        resetFadeOut(element)
    }

    return {
        fadeIn,
        fadeOut,
        move,
        scale,

        moveAndHide,
        showAndHide,
        heartBeating,

        resetFadeIn,
        resetFadeOut,
        resetMoveAndScale
    };
}

addListeners();

function addListeners() {
    let heartBeatController;
    let moveAndHideController;

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().resetFadeIn(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, { x: 100, y: 10 });
        });

    document.getElementById('moveReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().resetMoveAndScale(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('scaleReset')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().resetMoveAndScale(block);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHideController = animaster().moveAndHide(block, 3000);
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            if (moveAndHideController) {
                moveAndHideController.reset();
                moveAndHideController = null;
            }
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 3000);
        });

    document.getElementById('showAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().resetFadeIn(block);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartBeatController = animaster().heartBeating(block);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            if (heartBeatController) {
                heartBeatController.stop();
                heartBeatController = null; 
            }
        });
}

function getTransform(translation, ratio) {
    const result = [];
    if (translation) result.push(`translate(${translation.x}px,${translation.y}px)`);
    if (ratio) result.push(`scale(${ratio})`);
    return result.join(' ');
}
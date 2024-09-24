function animaster() {
    const _steps = [];

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
        return this.addMove(totalDuration * 2 / 5, { x: 100, y: 20 })
                   .addFadeOut(totalDuration * 3 / 5)
                   .play(element);
    }

    function showAndHide(element, totalDuration) {
        return this.addFadeIn(totalDuration / 3)
                   .addFadeOut(totalDuration / 3)
                   .play(element);
    }

    function heartBeating(element) {
        let intervalId;

        const beat = () => {
            this.addScale(500, 1.4)
                .addScale(500, 1)
                .play(element);
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
        resetFadeOut(element);
    }

    // Методы добавления шагов анимации
    function addMove(duration, translation) {
        _steps.push({
            operation: 'move',
            duration: duration,
            parameters: translation
        });
        return this;
    }

    function addFadeIn(duration) {
        _steps.push({
            operation: 'fadeIn',
            duration: duration
        });
        return this;
    }

    function addFadeOut(duration) {
        _steps.push({
            operation: 'fadeOut',
            duration: duration
        });
        return this;
    }

    function addScale(duration, ratio) {
        _steps.push({
            operation: 'scale',
            duration: duration,
            parameters: ratio
        });
        return this;
    }

    // Метод выполнения всех шагов анимации
    function play(element) {
        let totalDuration = 0;

        _steps.forEach((step) => {
            setTimeout(() => {
                switch (step.operation) {
                    case 'move':
                        move(element, step.duration, step.parameters);
                        break;
                    case 'fadeIn':
                        fadeIn(element, step.duration);
                        break;
                    case 'fadeOut':
                        fadeOut(element, step.duration);
                        break;
                    case 'scale':
                        scale(element, step.duration, step.parameters);
                        break;
                }
            }, totalDuration);
            totalDuration += step.duration;
        });
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
        resetMoveAndScale,

        addMove,
        addFadeIn,
        addFadeOut,
        addScale,

        play
    };
}

addListeners();

function addListeners() {
    let heartBeatController;

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
            const block = document.getElementById('moveAndHideBlock');
            animaster().resetMoveAndScale(block);
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
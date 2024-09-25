let initialStyles = {};

function animaster() {
    const _steps = [];

    function setInitStyle(element, visible = 'show') {
        if (!initialStyles[element.id]) initialStyles[element.id] = { visible };
    }

    function fadeIn(element, duration) {
        setInitStyle(element, 'hide');
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function fadeOut(element, duration) {
        setInitStyle(element);
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function move(element, duration, translation) {
        setInitStyle(element);
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    function scale(element, duration, ratio) {
        setInitStyle(element);
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    function resetStyles(element) {
        const style = initialStyles[element.id];
        element.removeAttribute('style');
        if(style.visible === 'hide') element.classList = 'block hide'
        else element.classList = 'block';
    }

    function addDelay(duration) {
        _steps.push({ operation: 'delay', duration: duration });
        return this;
    }

    function moveAndHide(element, totalDuration) {
        const anim = animaster();
        return {
            play: () => {
                anim.addMove(totalDuration * 2 / 5, { x: 100, y: 20 })
                    .addFadeOut(totalDuration * 3 / 5)
                    .play(element);
            },
            reset: () => {
                resetStyles(element);
            }
        };
    }

    function showAndHide(element, totalDuration) {
        return {
            play: () => {
                this.addFadeIn(totalDuration / 3)
                    .addDelay(totalDuration / 3)
                    .addFadeOut(totalDuration / 3)
                    .play(element);
            },
            reset: () => {
                resetStyles(element);
            }
        };
    }

    function heartBeating(element) {
        let intervalId;
        const anim = animaster();

        const beat = () => {
            anim.addScale(500, 1.4)
                .addScale(500, 1)
                .play(element);
        };

        beat();
        intervalId = setInterval(beat, 1000);

        return {
            stop: () => clearInterval(intervalId),
            reset: () => resetStyles(element)
        };
    }

    function addMove(duration, translation) {
        _steps.push({ operation: 'move', duration: duration, parameters: translation });
        return this;
    }

    function addFadeIn(duration) {
        _steps.push({ operation: 'fadeIn', duration: duration });
        return this;
    }

    function addFadeOut(duration) {
        _steps.push({ operation: 'fadeOut', duration: duration });
        return this;
    }

    function addScale(duration, ratio) {
        _steps.push({ operation: 'scale', duration: duration, parameters: ratio });
        return this;
    }

    function play(element, cycled = false) {
        let totalDuration = 0;
        let intervalId;

        const executeSteps = () => {
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
                        case 'delay':
                            break;
                    }
                }, totalDuration);
                totalDuration += step.duration;
            });
        };

        executeSteps();

        if (cycled) {
            intervalId = setInterval(executeSteps, totalDuration);
        }

        return {
            stop: () => clearInterval(intervalId),
            reset: () => resetStyles(element)
        };
    }

    return {
        setInitStyle,
        fadeIn,
        fadeOut,
        move,
        scale,
        moveAndHide,
        showAndHide,
        heartBeating,
        addMove,
        addFadeIn,
        addFadeOut,
        addScale,
        addDelay,
        play,
        resetStyles
    };
}

addListeners();

function addListeners() {
    let heartBeatController;
    let moveAndHideController;
    let showAndHideController;

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().resetStyles(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, { x: 100, y: 10 });
        });

    document.getElementById('moveReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().resetStyles(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('scaleReset')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().resetStyles(block);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHideController = animaster().moveAndHide(block, 3000);
            moveAndHideController.play();
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            if (moveAndHideController) moveAndHideController.reset();
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            showAndHideController = animaster().showAndHide(block, 3000);
            showAndHideController.play();
        });

    document.getElementById('showAndHideReset')
        .addEventListener('click', function () {
            if (showAndHideController) showAndHideController.reset();
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
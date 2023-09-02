(function () {
  const cardsList = document.querySelector('.cards');
  const refreshBtn = document.querySelector('.modal__btn');
  const modal = document.querySelector('.modal');
  const modalMessage = document.querySelector('.modal__message');
  const closeBtn = document.querySelector('.modal__close');
  const timerBox = document.querySelector('.timer');
  const timeDisplay = timerBox.querySelector('.time');

  let cardsArr = [];
  let flippedCards = [];
  let matchedCards = [];
  let gameStarted = false;
  let gameOver = false;
  let defaultColor = '#c5c2c2';
  let timeLeft = 60;
  let timerInterval;
  let rows = 4;
  let columns = 4;

  const startBtn = document.querySelector('.start-btn');
  startBtn.addEventListener('click', startGame);

  refreshBtn.addEventListener('click', resetGame);
  closeBtn.addEventListener('click', returnToSettings);

  function numArray() {
    for (let i = 1; i <= rows * columns / 2; i++) {
      cardsArr.push(`img/image${i}.jpg`, `img/image${i}.jpg`);
    }
    return cardsArr;
  }


  function startGame() {
    const settingsContainer = document.querySelector('.settings');
    const gameContainer = document.querySelector('.game-container');
    const timerBox = document.querySelector('.timer');

    const rowsInput = document.getElementById('rows');
    const columnsInput = document.getElementById('columns');

    rows = parseInt(rowsInput.value);
    columns = parseInt(columnsInput.value);

    if (isNaN(rows) || rows < 2 || rows > 10 || rows % 2 !== 0) {
      rows = 4;
      rowsInput.value = 4;
    }

    if (isNaN(columns) || columns < 2 || columns > 10 || columns % 2 !== 0) {
      columns = 4;
      columnsInput.value = 4;
    }

    settingsContainer.style.display = 'none';
    gameContainer.style.display = 'block';
    timerBox.style.display = 'block';

    createGameBoard(rows, columns);
  }

  function createGameBoard(rows, columns) {
    cardsArr = [];
    flippedCards = [];
    matchedCards = [];
    cardsList.innerHTML = '';
    gameStarted = false;
    timeLeft = 60;
    timeDisplay.textContent = formatTime(timeLeft);

    cardsList.style.setProperty('--rows', rows);
    cardsList.style.setProperty('--columns', columns);

    numArray();
    shuffleCards(cardsArr);
    game();
  }

  function shuffleCards(arr) {
    for (let i = arr.length - 1; i > 1; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function flipCard(e) {
    if (gameOver) {
      return;
    }

    let clickedCard = e.currentTarget;

    if (!gameStarted) {
      gameStarted = true;
      timerInterval = setInterval(updateTimer, 1000);
    }

    if (flippedCards.length < 2 && !clickedCard.classList.contains('flipped')) {
      flippedCards.push(clickedCard);
      clickedCard.classList.add('flipped');

      if (flippedCards.length === 2) {
        const [card1, card2] = flippedCards;
        const img1 = card1.querySelector('.card__back').getAttribute('src');
        const img2 = card2.querySelector('.card__back').getAttribute('src');

        if (img1 === img2) {
          matchedCards.push(card1, card2);
          flippedCards = [];
          checkWin();
        } else {
          setTimeout(function () {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
          }, 500);
        }
      }
    }
  }

  function game() {
    cardsArr.forEach((imgPath) => {
      const card = document.createElement('li');
      card.classList.add('card');
      card.innerHTML = `<div class="card__inner">
                <div class="card__front"></div>
                <img class="card__back" src="${imgPath}" alt="Card Image">
            </div>`;
      cardsList.appendChild(card);

      card.addEventListener('click', flipCard);
    });
  }

  function resetGame() {
    closeModal();
    gameOver = false;
    clearInterval(timerInterval);

    const rowsInput = document.getElementById('rows');
    const columnsInput = document.getElementById('columns');

    let rows = parseInt(rowsInput.value);
    let columns = parseInt(columnsInput.value);

    if (isNaN(rows) || rows < 2 || rows > 10 || rows % 2 !== 0) {
      rows = 4;
      rowsInput.value = 4;
    }

    if (isNaN(columns) || columns < 2 || columns > 10 || columns % 2 !== 0) {
      columns = 4;
      columnsInput.value = 4;
    }

    createGameBoard(rows, columns);
  }

  function returnToSettings() {
    const settingsContainer = document.querySelector('.settings');
    const gameContainer = document.querySelector('.game-container');
    const timerBox = document.querySelector('.timer');

    settingsContainer.style.display = 'flex';
    gameContainer.style.display = 'none';
    timerBox.style.display = 'none';

    resetGame();
  }

  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  function checkWin() {
    if (matchedCards.length === cardsArr.length) {
      gameOver = true;
      clearInterval(timerInterval);
      showModal('Вы выиграли!');
    }
  }

  function showModal(message) {
    modalMessage.textContent = message;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function updateTimer() {
    timeLeft--;
    timeDisplay.textContent = formatTime(timeLeft);

    if (timeLeft === 0) {
      gameOver = true;
      clearInterval(timerInterval);
      showModal('Время вышло! Вы проиграли.');
    }
  }

  function formatTime(time) {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }
})();

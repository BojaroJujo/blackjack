function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function initialise(){
    console.log("INITIALISING GAME");
    document.getElementById('hitButton').disabled = false;
    document.getElementById('standButton').disabled = false;
    document.getElementById('resetButton').innerHTML = "RESET";
    document.getElementById('gameOutcome').innerHTML = "";
    document.getElementById('gameOutcome').style.color = 'red';
    
    [playerHand, dealerHand] = [Array.from({length: 2}, drawCard), Array.from({length: 2}, drawCard)];
    playerValue = handValue(playerHand);
    document.getElementById('dealerScore').innerHTML  = `${dealerHand[0].value}+`;
    displayUpdate(true);
    displayDealerHand(dealerHand, true);
    
}
function animateDisplayChange(elementId, newValue) {
  const el = document.getElementById(elementId);
  el.style.transform = 'scale(1.2)';
  el.style.color = 'orange'; // highlight color

  setTimeout(() => {
    el.textContent = newValue;
    el.style.transform = 'scale(1)';
    el.style.color = '';
  }, 150);
}
function displayUpdate(player = false, dealer = false){
    if (player) {
        animateDisplayChange('playerScore', playerValue);
        displayHand(playerHand, 'playerHand');
    }
    if (dealer) {
        animateDisplayChange('dealerScore', dealerValue);
        displayDealerHand(dealerHand, false);
    }
}
function drawCard(){
    return  cards[Math.floor(Math.random()*13)];
}
function handValue(hand){
    let totalValue = 0;
    let aceCount = 0;
    hand.forEach(card =>{
        totalValue += card.value;
        if (card.rank === 'A') aceCount++;
    });
    while (totalValue > 21 && aceCount > 0) {
        totalValue -= 10;
        aceCount--;
    }
    return totalValue;
}
function hit(){
    playerHand.push(drawCard());
    playerValue = handValue(playerHand);
    console.log(playerHand);
    console.log(playerValue);
    displayUpdate(true);
    scoreCheck();
}
async function stand(){
    document.getElementById('hitButton').disabled = true;
    document.getElementById('standButton').disabled = true;
    document.getElementById('resetButton').disabled = true;
    await sleep(500);
    dealerValue = handValue(dealerHand);
    displayUpdate(false, true);
    while (dealerValue < 17) {
        dealerHand.push(drawCard());
        dealerValue = handValue(dealerHand);
        displayUpdate(false, true);
        await sleep (500);
    }
    document.getElementById('resetButton').disabled = false;

    if (dealerValue === playerValue){
        gameMessage = "It's a Tie!";
        document.getElementById('gameOutcome').style.color = 'orange';
    } else if (dealerValue > playerValue && dealerValue <= 21){
        gameMessage = "You Lose!";
    } else if (dealerValue < playerValue || dealerValue > 21){
        gameMessage  = "You Win!";
        document.getElementById('gameOutcome').style.color = 'green';
    } else {
        gameMessage = "ERROR!"
    }
    document.getElementById('gameOutcome').innerHTML = gameMessage;
    document.getElementById('resetButton').innerHTML = "PLAY AGAIN?";
}
function reset(){
    if (document.getElementById('resetButton').innerHTML === "PLAY AGAIN?"){
        initialise();
    } else{
        let resetConfirm = confirm("Are you sure you want to RESET the game? \nPress OK to confirm.");
        if (resetConfirm) initialise(); 
    }
    
}
function displayHand(hand, id){
    let displayText = "";
    hand.forEach((card, index) => {
        (index === hand.length - 1) ? displayText += card.rank : displayText += `${card.rank}, `;
    });
    animateDisplayChange(id, displayText)
}
function displayDealerHand(hand, firstCardOnly){
    if (firstCardOnly){
        document.getElementById('dealerHand').innerHTML = `${hand[0].rank}, ? `;
    } else{
        displayHand(hand, 'dealerHand');
    }
}
function scoreCheck(){
    if (playerValue > 21){
        document.getElementById('hitButton').disabled = true;
        document.getElementById('standButton').disabled = true;
        document.getElementById('resetButton').innerHTML = "PLAY AGAIN?";
        document.getElementById('gameOutcome').innerHTML = "BUST!";
        animateDisplayChange('dealerScore', handValue(dealerHand));
        displayDealerHand(dealerHand, false);
    }
}

let playerHand, dealerHand, playerValue, dealerValue, winner, gameMessage;

initialise();

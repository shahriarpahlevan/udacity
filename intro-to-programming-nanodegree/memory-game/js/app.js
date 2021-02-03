/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

//  declaration of all variables, assigning jquery variables, setting scores!
let symbols = ['bomb', 'bomb', 'eye-slash', 'eye-slash', 'eyedropper', 'eyedropper', 'fighter-jet', 'fighter-jet', 'american-sign-language-interpreting', 'american-sign-language-interpreting', 'sign-language', 'sign-language', 'thumb-tack', 'thumb-tack', 'crosshairs', 'crosshairs'],
    opened = [],
    match = 0,
    Clicks = 0,
    $Playground = $('.Playground'),
    $scorePanel = $('#score-panel'),
    $moveNum = $('.Clicks'),
    $ratingStars = $('.fa-blind'),
    $PlayAgain = $('.PlayAgain'),
    delay = 400,
    currentseconds,
    second = 0,
    $seconds = $('.seconds'),
    totalbox = symbols.length / 2,
    rank4blind = 8,
    rank3blind = 10,
    rank2blind = 15,
    rank1blind = 20;

// shuffles all the cards!
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Initialise the Game
function initGame() {
    var boxes = shuffle(symbols);
    $Playground.empty();
    match = 0;
    Clicks = 0;
    $moveNum.text('0');
    $ratingStars.removeClass('fa-hand-lizard-o').addClass('fa-blind');
    for (var i = 0; i < boxes.length; i++) {
        $Playground.append($('<li class="box"><i class="fa fa-' + boxes[i] + '"></i></li>'))
    }
    addboxListener();

    resetseconds(currentseconds);
    second = 0;
    $seconds.text(`${second}`)
    initTime();
};

// Set the ratings and scoring system, under following conditions, removing blind men, adding hand-lizard
function setRating(moves) {
    var rating = 5;
    if (moves > rank4blind && moves < rank3blind) {
        $ratingStars.eq(4).removeClass('fa-blind').addClass('fa-hand-lizard-o');
        rating = 4;
    } else if (moves > rank3blind && moves < rank2blind) {
        $ratingStars.eq(3).removeClass('fa-blind').addClass('fa-hand-lizard-o');
        rating = 3;
    } else if (moves > rank2blind && moves < rank1blind) {
        $ratingStars.eq(2).removeClass('fa-blind').addClass('fa-hand-lizard-o');
        rating = 2;
    } else if (moves > rank1blind) {
        $ratingStars.eq(1).removeClass('fa-blind').addClass('fa-hand-lizard-o');
        rating = 1;
    }
    return { score: rating };
};


// ending the game, using SweetAlert (swal) for a pop up on the screen!
// two different endings, depending on if score>0
function endGame(Clicks, score) {
    if (score > 1) {
        swal({
            allowEscapeKey: false,
            allowOutsideClick: false,
            title: 'Well done! You WIN!',
            text: 'With ' + Clicks + ' Clicks, and ' + score + ' Blind Survivors! In ' + second + ' Seconds.\n Woooooo!',
            type: 'success',
            confirmButtonColor: '#02ccba',
            confirmButtonText: 'Play again!'
        }).then(function (isConfirm) {
            if (isConfirm) {
                initGame();
            }
        })
    } else {
        swal({
            allowEscapeKey: false,
            allowOutsideClick: false,
            title: 'AWwhhh what a disaster! Well at least you saved one!',
            text: 'With ' + Clicks + ' Clicks, and ' + score + ' Blind Survivors! In ' + second + ' Seconds.\n Oh well, try again!',
            type: 'success',
            confirmButtonColor: '#02ccba',
            confirmButtonText: 'Play again!'
        }).then(function (isConfirm) {
            if (isConfirm) {
                initGame();
            }
        })
    }

}

// playing again, resetting the game option, using SweetAlert (swal) for an awesome pop up!
// customised button colors and texts, to engage user!
$PlayAgain.on('click', function () {
    swal({
        allowEscapeKey: false,
        allowOutsideClick: false,
        title: 'Yea let\'s start over',
        text: "Surrender now, try again!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#02ccba',
        cancelButtonColor: '#f95c3c',
        cancelButtonText: 'Nah mate!',
        confirmButtonText: 'Yeah cheers mate!',
    }).then(function (isConfirm) {
        if (isConfirm) {
            initGame();
        }
    })
});

// box listener, this is the interactive function, defining what clicks will do!
var addboxListener = function () {

    // this flips the cards around, when they are clicked!
    $Playground.find('.box').on('click', function () {
        var $this = $(this)

        if ($this.hasClass('show') || $this.hasClass('match')) { return true; }

        var box = $this.context.innerHTML;
        $this.addClass('open show');
        opened.push(box);

        // comparison between open cards, and either matching or not matching!
        // animation for match and not matching
        if (opened.length > 1) {
            if (box === opened[0]) {
                $Playground.find('.open').addClass('match animated infinite rubberBand');
                setTimeout(function () {
                    $Playground.find('.match').removeClass('open show animated infinite rubberBand');
                }, delay);
                match++;
            } else {
                $Playground.find('.open').addClass('notmatch animated infinite wobble');
                setTimeout(function () {
                    $Playground.find('.open').removeClass('animated infinite wobble');
                }, delay / 1.5);
                setTimeout(function () {
                    $Playground.find('.open').removeClass('open show notmatch animated infinite wobble');
                }, delay);
            }
            opened = [];
            Clicks++;
            setRating(Clicks);
            $moveNum.html(Clicks);
        }

        // finish the game once all matches are completed! 
        if (totalbox === match) {
            setRating(Clicks);
            var score = setRating(Clicks).score;
            setTimeout(function () {
                endGame(Clicks, score);
            }, 500);
        }
    });
};

// timer, +1 for every 1000 ms (each second)
function initTime() {
    currentseconds = setInterval(function () {
        $seconds.text(`${second}`)
        second = second + 1
    }, 1000);
}

// rest timer back to 0s! 
function resetseconds(seconds) {
    if (seconds) {
        clearInterval(seconds);
    }
}

initGame();
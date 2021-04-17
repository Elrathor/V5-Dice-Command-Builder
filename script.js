let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
});


let app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        stat1: 0,
        stat2: 0,
        stat3: 0,
        hunger: 1,
        hungerActivated: true,
        successNeeded: 0,
        successNeededActivated: false,
        rollComment: "",
        ctaButton: "Copy!"
    },
    computed: {
        rollCommand: function () {

            //Sum possible stats
            let pool = parseInt(this.stat1) + parseInt(this.stat2) + parseInt(this.stat3)

            //Make sure the pool isn't negative
            pool = pool < 0? 0 : pool;

            //If hunger is active, use it or set it zero otherwise
            let hunger = this.hungerActivated ? parseInt(this.hunger) : 0;


            //Use only hunger dice, when the pool is larger than the hunger. Otherwise subtract hunger from pool to replace it
            if(hunger >= pool) {
                hunger = pool;
                pool = 0;
            } else {
                pool = pool - hunger;
            }

            //If the number of needed successes is active, use it or set it zero otherwise
            let succNeeded = this.successNeededActivated ? parseInt(this.successNeeded) : 0;

            return "m.r5 " + pool + " " + hunger + " " + succNeeded + " " + this.rollComment;
        },
        hasError: function () {
            let pool = parseInt(this.stat1) + parseInt(this.stat2) + parseInt(this.stat3);

            //Make sure, the pool isn't negative
            if (pool < 0)
                return true;

            let hunger = this.hungerActivated ? parseInt(this.hunger) : 0;

            return parseInt(this.stat1) < 0 || parseInt(this.stat2) < 0 || hunger < 0 || isNaN(pool);
        }
    },
    methods : {
        copy: function (){
            copyTextToClipboard(this.rollCommand);
        }
    }
});

function fallbackCopyTextToClipboard(text) {
    let textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        let successful = document.execCommand('copy');
        let msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function() {

    }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });
}
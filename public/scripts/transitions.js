// Displays a button to the user, inviting them to transition to the reduction
// phase
export function showReduceButton() {
    // <form action="getTopEight.html">
    //     <input type="submit" value="Continue" />
    // </form>

    // let form = document.createElement("form");
    // form.action = "getTopEight.html";
    // let input = document.createElement("input");
    // input.type = "submit";
    // input.value = "Continue";
    // form.appendChild(input);

    // const cardQueue = document.getElementById("card-queue");
    // cardQueue.appendChild(form);

    let cardQueue = document.getElementById("card-queue-bar");
    let toReduction = document.getElementById("to-reduction");
    cardQueue.style.display = "none";
    toReduction.style.display = "flex";
}
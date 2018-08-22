document.addEventListener("submit", submitListener);

function submitListener(e) {
    let checkbox = e.target[0];
    let input = e.target[1];
    let xhr = new XMLHttpRequest();

    xhr.open("GET", "/change?amount=" + input.value + (checkbox.checked ? "&limited=true" : ""));
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState !== 4) return;

        if (xhr.status !== 200) {
            let message = JSON.parse(xhr.response).message;

            alert(xhr.status + ": " + xhr.statusText + "\n" + message);
        } else {
            responseHandler(xhr);
        }
    };
    e.preventDefault();
}

function responseHandler(xhr) {
    let data = JSON.parse(xhr.responseText);
    let out = document.getElementById("output");
    let buffer = "";
    let prefix = "<table border=1><tr><th>Nominal</th><th>Count of coin</th></tr>";
    let postfix = "</table>";

    Object.keys(data).forEach(key => {
        buffer += "<tr><td>" + key + "</td><td>" + data[key] + "</td></tr>";
    });

    if (buffer !== "") {
        buffer = prefix + buffer + postfix;
    }

    out.innerHTML = buffer;
}

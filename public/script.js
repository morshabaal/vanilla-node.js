document.addEventListener("DOMContentLoaded", () => {
    LoginFormHandler();
});

function LoginFormHandler() {
    const form = document.loginForm;
    const statusBox = document.getElementById("status");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Get the form data and convert it into JSON
        const formData = new FormData(form);
        const jsonData = JSON.stringify(Object.fromEntries(formData));

        // Prepare a POST request
        const request = new Request("/login", {
            method: "POST",
            body: jsonData,
            headers: { "Content-Type": "application/json" }
        });

        // Send the request
        fetch(request).then(response => {
            if (!response.ok) throw new Error("Failed to send form.");
            return response.json();
        }).then(data => {
            // Handle the response
            if (data.success) {
                const fragment = document.createRange().createContextualFragment(data.fragment);
                document.getElementById("loginSection").innerHTML = "";
                document.getElementById("loginSection").appendChild(fragment);
            } else {
                statusBox.textContent = data.message;
            }
        }).catch(console.warn);
    });
}

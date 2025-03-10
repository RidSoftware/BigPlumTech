//async function get24hrs(email) {
    let user = JSON.parse(localStorage.getItem("user"));
    let emailSent = user.Email;
    try {
        const response = await fetch("/api/pull24hr", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({Email})
        });

        let data = await response.json();

        if (!data.success) {
            errorMessage.textContent = data.message;
            errorMessage.style.display = "block";
            return;
        }
        localStorage.setItem("last24hrshome", JSON.stringify(data.lastDay));
        let last24hrsHome = JSON.parse(localStorage.getItem("last24hrsHome"))


    } catch(error){
        console.error(`get24hrs failed: `, error);

    }
//}
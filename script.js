// Navbar toggle functionality
function toggleNavbar() {
  const navbar = document.querySelector(".navbar");
  navbar.classList.toggle("show");
}

emailjs.init("U0Lv9KjyilgJYAo1Y"); // Replace with your actual User ID

document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.querySelector("input[name='name']").value;
  const email = document.querySelector("input[name='email']").value;
  const message = document.querySelector("textarea[name='message']").value;

  emailjs
    .send("service_aalogh4", "template_tfwbzqu", {
      name: name,
      email: email,
      message: message,
    })
    .then(
      (response) => {
        alert("Message sent successfully!");
        console.log("SUCCESS!", response.status, response.text);
        document.getElementById("contactForm").reset();
      },
      (error) => {
        alert("Failed to send the message. Please try again.");
        console.error("Error details:", error);
      }
    );
});

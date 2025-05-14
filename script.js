document.addEventListener("DOMContentLoaded", () => {
  // Cache DOM elements
  const domElements = {
    navbar: document.querySelector(".navbar"),
    hamburger: document.querySelector(".navbar__hamburger"),
    menu: document.querySelector("#navbar-menu"),
    skillCards: document.querySelectorAll(".skill-card"),
    contactForm: document.getElementById("contactForm"),
    nameInput: document.querySelector("input[name='name']"),
    emailInput: document.querySelector("input[name='email']"),
    messageInput: document.querySelector("textarea[name='message']"),
  };

  // EmailJS initialization
  emailjs.init("U0Lv9KjyilgJYAo1Y");

  // Navbar functions
  const toggleNavbar = () => {
    const isOpen = domElements.navbar.classList.toggle("show");
    domElements.hamburger.setAttribute("aria-expanded", isOpen);
    document[isOpen ? "addEventListener" : "removeEventListener"](
      "keydown",
      handleEscape
    );
  };

  const handleEscape = (e) => {
    if (e.key === "Escape") toggleNavbar();
  };

  // Smooth scroll functionality
  const smoothScroll = (target) => {
    const navbarHeight = domElements.navbar.offsetHeight;
    const targetPosition = target.offsetTop - navbarHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });

    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  };

  // Event handlers
  document.addEventListener("click", (e) => {
    // Navbar toggle
    if (e.target.closest(".navbar__hamburger")) {
      toggleNavbar();
    }

    // Smooth scroll handling
    const anchor = e.target.closest('a[href^="#"]');
    if (anchor) {
      e.preventDefault();
      const targetId = anchor.getAttribute("href");
      const target = document.querySelector(targetId);

      if (target) {
        // Close navbar if open
        if (domElements.hamburger.getAttribute("aria-expanded") === "true") {
          toggleNavbar();
        }

        // Handle reduced motion preference
        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;
        prefersReducedMotion
          ? target.scrollIntoView({ block: "start" })
          : smoothScroll(target);
      }
    }
  });

  // Skill cards initialization
  domElements.skillCards.forEach((card) => {
    try {
      const circle = card.querySelector(".skill-progress-circle");
      if (circle) {
        const percent = circle.querySelector(".percentage")?.textContent;
        if (percent) circle.style.setProperty("--progress", parseInt(percent));
      }

      // Mobile toggle
      card.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          const content = card.querySelector(".skill-content");
          if (content) content.classList.toggle("active");
        }
      });
    } catch (error) {
      console.error("Skill card initialization error:", error);
    }
  });

  // Form submission handler
  domElements.contactForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !domElements.nameInput.value.trim() ||
      !domElements.emailInput.value.trim() ||
      !domElements.messageInput.value.trim()
    ) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    try {
      const response = await emailjs.send(
        "service_aalogh4",
        "template_tfwbzqu",
        {
          from_name: domElements.nameInput.value.trim(),
          from_email: domElements.emailInput.value.trim(),
          message: domElements.messageInput.value.trim(),
        }
      );

      showNotification("Message sent successfully!", "success");
      domElements.contactForm.reset();
      console.log("EmailJS success:", response);
    } catch (error) {
      showNotification("Failed to send message. Please try again.", "error");
      console.error("EmailJS error:", error);
    }
  });

  // Notification system
  const showNotification = (message, type = "info") => {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("show");
    }, 10);

    setTimeout(() => {
      notification.remove();
    }, 5000);
  };
});

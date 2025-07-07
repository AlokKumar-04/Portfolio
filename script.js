document.addEventListener("DOMContentLoaded", () => {
  // Cache DOM elements
  const domElements = {
    navbar: document.querySelector(".navbar"),
    hamburger: document.querySelector(".hamburger"),
    menu: document.querySelector("#navbar-menu"),
    contactForm: document.getElementById("contactForm"),
    nameInput: document.querySelector("input[name='name']"),
    emailInput: document.querySelector("input[name='email']"),
    messageInput: document.querySelector("textarea[name='message']"),
  };

  // EmailJS initialization (only if EmailJS is loaded)
  if (typeof emailjs !== 'undefined') {
    emailjs.init("U0Lv9KjyilgJYAo1Y");
  }

  // Navbar functions
  const toggleNavbar = () => {
    const isOpen = domElements.navbar.classList.toggle("show");
    domElements.hamburger.setAttribute("aria-expanded", isOpen);

    // Add/remove escape key listener
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    } else {
      document.removeEventListener("keydown", handleEscape);
    }
  };

  const handleEscape = (e) => {
    if (e.key === "Escape") {
      toggleNavbar();
    }
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
    // Hamburger toggle
    if (e.target.closest(".hamburger")) {
      e.preventDefault();
      toggleNavbar();
      return;
    }

    // Close navbar if clicking outside
    if (domElements.navbar.classList.contains("show") &&
      !e.target.closest(".navbar")) {
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
        if (domElements.navbar.classList.contains("show")) {
          toggleNavbar();
        }

        // Handle reduced motion preference
        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) {
          target.scrollIntoView({ block: "start" });
        } else {
          smoothScroll(target);
        }
      }
    }
  });

  // Close navbar on window resize if open
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && domElements.navbar.classList.contains("show")) {
      toggleNavbar();
    }
  });

  // Make toggleNavbar globally accessible (for inline onclick if needed)
  window.toggleNavbar = toggleNavbar;

  // Form submission handler (only if form exists)
  if (domElements.contactForm) {
    domElements.contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Basic validation
      if (
        !domElements.nameInput?.value.trim() ||
        !domElements.emailInput?.value.trim() ||
        !domElements.messageInput?.value.trim()
      ) {
        showNotification("Please fill in all required fields", "error");
        return;
      }

      try {
        if (typeof emailjs === 'undefined') {
          throw new Error('EmailJS is not loaded');
        }

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
  }

  // Notification system
  const showNotification = (message, type = "info") => {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Add notification styles if they don't exist
    if (!document.querySelector('#notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 15px 20px;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          z-index: 9999;
          opacity: 0;
          transform: translateX(100%);
          transition: all 0.3s ease;
        }
        .notification.show {
          opacity: 1;
          transform: translateX(0);
        }
        .notification.success {
          background-color: #4caf50;
        }
        .notification.error {
          background-color: #f44336;
        }
        .notification.info {
          background-color: #2196f3;
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("show");
    }, 10);

    setTimeout(() => {
      notification.remove();
    }, 5000);
  };

  // Skill cards initialization (if they exist)
  const skillCards = document.querySelectorAll(".skill-card");
  skillCards.forEach((card) => {
    try {
      const circle = card.querySelector(".skill-progress-circle");
      if (circle) {
        const percent = circle.querySelector(".percentage")?.textContent;
        if (percent) {
          circle.style.setProperty("--progress", parseInt(percent));
        }
      }

      // Mobile toggle
      card.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          const content = card.querySelector(".skill-content");
          if (content) {
            content.classList.toggle("active");
          }
        }
      });
    } catch (error) {
      console.error("Skill card initialization error:", error);
    }
  });
});
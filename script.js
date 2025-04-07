document.addEventListener("DOMContentLoaded", function () {
    // Show progress items when they come into view
    const progressItems = document.querySelectorAll('.progress-item');
    
    function checkVisibility() {
        const triggerBottom = window.innerHeight / 5 * 4;
        
        progressItems.forEach(item => {
            const itemTop = item.getBoundingClientRect().top;
            if (itemTop < triggerBottom) {
                item.classList.add('show');
            } else {
                item.classList.remove('show');
            }
        });
    }

    // Event listener for scroll
    window.addEventListener('scroll', checkVisibility);
    
    // Initial call to show elements in view
    checkVisibility();

    // Form submit with Formspree API
    const form = document.querySelector('form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const email = form.querySelector('input[type="email"]').value;

        if (email) {
            fetch('https://formspree.io/f/xkgjvpqr', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email: email })
            })
            .then(response => response.json())
            .then(data => {
                form.reset();
                window.location.href = 'thanks.html';
            })
            .catch(error => {
                alert('Error, please try again later.');
            });
        }
    });

    // Enable smooth scrolling via CSS
    document.documentElement.style.scrollBehavior = 'smooth';
});

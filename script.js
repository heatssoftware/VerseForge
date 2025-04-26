const currentAmount = 53;
const targetAmount = 300;

document.addEventListener("DOMContentLoaded", function () {
    // Show progress items when they come into view
    const progressItems = document.querySelectorAll('.Aitem');

    const progress_text = document.querySelector('.progress-text');
    const progress_bar_fill = document.querySelector('.progress_bar_fill');
    progress_bar_fill.style.width = (currentAmount / targetAmount) * 100 + '%';
    progress_text.textContent = "$" + currentAmount + ' / $' + targetAmount + ' raised';
    
    function checkVisibility() {
        const triggerBottom = window.innerHeight / 5 * 4;
        
        progressItems.forEach(item => {
            const itemTop = item.getBoundingClientRect().top;
            if (itemTop < triggerBottom) {
                item.classList.add('show');
                item.classList.remove('hide');
            } else {
                item.classList.remove('show');
                item.classList.add('hide');
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
                window.location.href = 'thanks';
            })
            .catch(error => {
                alert('Error, please try again later.');
            });
        }
    });

    // Enable smooth scrolling via CSS
    document.documentElement.style.scrollBehavior = 'smooth';
});



function resizeIframe() {
    var iframe = document.getElementById('myIframe');
    iframe.height = iframe.contentWindow.document.documentElement.scrollHeight + 100 + "px";
}
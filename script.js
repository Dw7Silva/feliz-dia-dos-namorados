// Global Variables
let currentQuestion = 0;
let correctAnswers = 0;
let clickCount = 0;
let musicPlaying = false;
let typewriterQueue = [];
let isTyping = false;
let swiper = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página carregada com amor! 💙');
    initializeAnimations();
    setupEventListeners();
    setupImageLoading();
    startTypewriterEffect();
    initSwiper();
});

// Initialize Swiper carousel
function initSwiper() {
    swiper = new Swiper('.gallery-carousel', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            }
        }
    });
}

// Smooth scrolling to letter section
function scrollToLetter() {
    document.getElementById('letter').scrollIntoView({
        behavior: 'smooth'
    });
}

// Initialize scroll animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in-up class to elements
    const animatedElements = document.querySelectorAll('.gallery-section, .letter-section, .quiz-section, .gift-section');
    animatedElements.forEach(el => {
        el.classList.add('fade-in-up');
        observer.observe(el);
    });
}

// Setup all event listeners
function setupEventListeners() {
    setupMusicPlayer();
    setupQuiz();
    setupEasterEgg();
    setupModal();
    setupScrollIndicator();
}

// Setup scroll indicator
function setupScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            document.getElementById('gallery').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
}

// Music Player Setup
function setupMusicPlayer() {
    const musicToggle = document.getElementById('musicToggle');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const musicText = musicToggle.querySelector('.music-text');
    const musicIcon = musicToggle.querySelector('.music-icon');

    // Check if music was playing before
    if (localStorage.getItem('musicPlaying') === 'true') {
        backgroundMusic.play().catch(e => {
            console.log('Erro ao reproduzir música:', e);
        });
        musicText.textContent = 'Pausar Música';
        musicIcon.textContent = '⏸️';
        musicPlaying = true;
    }

    musicToggle.addEventListener('click', function() {
        if (musicPlaying) {
            backgroundMusic.pause();
            musicText.textContent = 'Nossa Música';
            musicIcon.textContent = '🎵';
            musicPlaying = false;
        } else {
            backgroundMusic.play().catch(e => {
                console.log('Erro ao reproduzir música:', e);
            });
            musicText.textContent = 'Pausar Música';
            musicIcon.textContent = '⏸️';
            musicPlaying = true;
        }
        localStorage.setItem('musicPlaying', musicPlaying);
    });

    // Auto-play attempt with user interaction
    document.body.addEventListener('click', function firstInteraction() {
        if (!musicPlaying && localStorage.getItem('musicPlaying') !== 'false') {
            backgroundMusic.play().catch(e => {
                console.log('Auto-play bloqueado pelo navegador');
            });
        }
        document.body.removeEventListener('click', firstInteraction);
    }, { once: true });
}

// Typewriter Effect
function startTypewriterEffect() {
    const typewriterElements = document.querySelectorAll('.typewriter');
    
    typewriterElements.forEach((element, index) => {
        const text = element.getAttribute('data-text');
        if (text) {
            typewriterQueue.push({
                element: element,
                text: text,
                delay: index * 2000 // 2 seconds delay between each paragraph
            });
        }
    });
    
    processTypewriterQueue();
}

function processTypewriterQueue() {
    if (typewriterQueue.length === 0 || isTyping) return;
    
    isTyping = true;
    const current = typewriterQueue.shift();
    
    setTimeout(() => {
        typeText(current.element, current.text, () => {
            isTyping = false;
            processTypewriterQueue();
        });
    }, current.delay);
}

function typeText(element, text, callback) {
    element.style.whiteSpace = 'normal';
    element.style.overflow = 'visible';
    element.innerHTML = '<span class="cursor">|</span>';
    
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            element.innerHTML = text.substring(0, i + 1) + '<span class="cursor">|</span>';
            i++;
        } else {
            clearInterval(timer);
            // Remove cursor after typing is complete
            setTimeout(() => {
                element.innerHTML = text;
                callback && callback();
            }, 1000);
        }
    }, 50);
}

// Quiz Setup
function setupQuiz() {
    const questions = document.querySelectorAll('.question');
    const options = document.querySelectorAll('.option');
    
    // Show first question
    if (questions.length > 0) {
        questions[0].classList.add('active');
    }
    
    options.forEach(option => {
        option.addEventListener('click', function() {
            handleQuizAnswer(this);
        });
    });
}

function handleQuizAnswer(selectedOption) {
    const question = selectedOption.closest('.question');
    const options = question.querySelectorAll('.option');
    const isCorrect = selectedOption.getAttribute('data-correct') === 'true';
    
    // Disable all options
    options.forEach(opt => {
        opt.style.pointerEvents = 'none';
        if (opt.getAttribute('data-correct') === 'true') {
            opt.classList.add('correct');
        } else if (opt === selectedOption && !isCorrect) {
            opt.classList.add('incorrect');
        }
    });
    
    if (isCorrect) {
        correctAnswers++;
    }
    
    // Move to next question after delay
    setTimeout(() => {
        question.classList.remove('active');
        currentQuestion++;
        
        const nextQuestion = document.querySelector(`.question[data-question="${currentQuestion + 1}"]`);
        if (nextQuestion) {
            nextQuestion.classList.add('active');
        } else {
            showQuizResult();
        }
    }, 2000);
}

function showQuizResult() {
    const resultDiv = document.getElementById('quizResult');
    let resultMessage = '';
    
    if (correctAnswers >= 3) {
        resultMessage = `
            <h3 style="color: var(--success-color); font-family: 'Dancing Script', cursive; font-size: 2rem; margin-bottom: 1rem;">
                Parabéns! Você acertou ${correctAnswers} de 4! 🎉
            </h3>
            <img src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=200&fit=crop" alt="Case de canetas" style="border-radius: 10px; margin: 1rem 0;" loading="lazy">
            <p style="font-size: 1.1rem; color: var(--primary-color);">
                "Você me conhece tão bem quanto eu te amo! Aqui está um presente para colorirmos mais momentos juntos. Feliz Dia dos Namorados!"
            </p>
        `;
    } else {
        resultMessage = `
            <h3 style="color: var(--primary-color); font-family: 'Dancing Script', cursive; font-size: 2rem; margin-bottom: 1rem;">
                Você acertou ${correctAnswers} de 4! 💙
            </h3>
            <img src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=200&fit=crop" alt="Case de canetas" style="border-radius: 10px; margin: 1rem 0;" loading="lazy">
            <p style="font-size: 1.1rem; color: var(--primary-color);">
                "Tudo bem, amor! O presente é seu de qualquer jeito. A gente ainda vai se conhecer muito mais!"
            </p>
        `;
    }
    
    resultDiv.innerHTML = resultMessage;
    resultDiv.classList.add('show');
    
    // Scroll to gift section after showing result
    setTimeout(() => {
        document.getElementById('gift').scrollIntoView({
            behavior: 'smooth'
        });
    }, 3000);
}

// Easter Egg Setup
function setupEasterEgg() {
    const easterEggHeart = document.getElementById('easterEggHeart');
    
    easterEggHeart.addEventListener('click', function() {
        clickCount++;
        
        // Add click animation
        this.style.transform = 'scale(1.5)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
        
        if (clickCount === 3) {
            showStitchSurprise();
            clickCount = 0; // Reset counter
        }
    });
}

function showStitchSurprise() {
    const modal = document.getElementById('stitchModal');
    modal.classList.add('show');
    
    // Add some confetti effect
    createConfetti();
    
    // Play a sound if possible
    const audio = new Audio();
    audio.src = 'https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3';
    audio.volume = 0.3;
    audio.play().catch(e => console.log('Não foi possível reproduzir o som:', e));
}

function createConfetti() {
    const colors = ['#667eea', '#ff6b9d', '#ffd93d', '#6bcf7f'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.zIndex = '9999';
        confetti.style.pointerEvents = 'none';
        confetti.style.borderRadius = '50%';
        
        document.body.appendChild(confetti);
        
        // Animate confetti
        const duration = Math.random() * 3000 + 2000;
        confetti.animate([
            { transform: 'translateY(-10px) rotate(0deg)', opacity: 1 },
            { transform: `translateY(calc(100vh + 10px)) rotate(720deg)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => {
            confetti.remove();
        };
    }
}

// Modal Setup
function setupModal() {
    const modal = document.getElementById('stitchModal');
    const closeBtn = modal.querySelector('.close');
    
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('show');
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            modal.classList.remove('show');
        }
    });
}

// Image Loading Setup
function setupImageLoading() {
    const images = document.querySelectorAll('img');
    const videos = document.querySelectorAll('video');
    
    images.forEach(img => {
        img.setAttribute('data-loaded', 'false');
        
        img.addEventListener('load', function() {
            this.setAttribute('data-loaded', 'true');
        });
        
        img.addEventListener('error', function() {
            console.log('Erro ao carregar imagem:', this.src);
            // Provide fallback or placeholder
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbSBuw6NvIGVuY29udHJhZGE8L3RleHQ+PC9zdmc+';
        });
    });
    
    videos.forEach(video => {
        video.setAttribute('data-loaded', 'false');
        
        video.addEventListener('loadeddata', function() {
            this.setAttribute('data-loaded', 'true');
        });
        
        video.addEventListener('error', function() {
            console.log('Erro ao carregar vídeo:', this.src);
        });
    });
}

// Utility Functions
function isMobile() {
    return window.innerWidth <= 768;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize
window.addEventListener('resize', debounce(() => {
    if (swiper) {
        swiper.update();
    }
}, 250));

// Add smooth scrolling for all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading state management
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    console.log('Tudo carregado com amor! 💙');
});

// Performance monitoring
let startTime = performance.now();
window.addEventListener('load', function() {
    let loadTime = performance.now() - startTime;
    console.log(`Página carregada em ${loadTime.toFixed(2)}ms`);
});

// Add error handling for audio
document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('backgroundMusic');
    if (audio) {
        audio.addEventListener('error', function(e) {
            console.log('Erro ao carregar áudio:', e);
            // Hide music button if audio fails to load
            const musicPlayer = document.querySelector('.music-player');
            if (musicPlayer) {
                musicPlayer.style.display = 'none';
            }
        });
    }
});

// Console easter egg
console.log(`
    💙💙💙💙💙💙💙💙💙💙💙💙💙💙💙💙💙💙💙💙
    💙                                      💙
    💙        Feito com amor para           💙
    💙           LIVIA 💙 DERICK            💙
    💙                                      💙
    💙    "Te amo mais do que ontem         💙
    💙     e menos do que amanhã"           💙
    💙                                      💙
    💙💙💙💙💙💙💙💙💙💙💙💙💙💙💙💙💙💙💙💙
`);
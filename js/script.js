// ==========================================================================
// 1. DIGITAL MATRIX BACKGROUND ANIMATION (CANVAS - PURE NUMBERS ONLY)
// ==========================================================================
const canvas = document.getElementById('bg-animation');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particlesArray = [];
// KEKAL NOMBOR SAHAJA: Simbol pelik dibuang terus
const cyberSymbols = ['0', '1'];

class Particle {
    constructor() {
        this.x = Math.random() * (canvas ? canvas.width : window.innerWidth);
        this.y = (canvas ? canvas.height : window.innerHeight) + Math.random() * 100; 
        this.size = Math.random() * 4 + 13; 
        
        // Kekalkan kelajuan pergerakan ke atas yang stabil
        this.speedY = Math.random() * 1.2 + 0.8; 
        
        this.symbol = cyberSymbols[Math.floor(Math.random() * cyberSymbols.length)];
        this.type = Math.random() > 0.1 ? 'symbol' : 'dot'; 
        this.opacity = Math.random() * 0.4 + 0.5; 
        
        // PEMASA KELIPAN: Mengawal kelajuan pertukaran nombor rawak secara individu
        this.currentRenderSymbol = this.symbol;
        this.changeInterval = Math.floor(Math.random() * 20) + 20; // Bertukar setiap 20-40 frame
        this.frameCounter = 0;
    }

    update() {
        this.y -= this.speedY; 
        if (this.y < -20) {
            this.y = (canvas ? canvas.height : window.innerHeight) + 20;
            this.x = Math.random() * (canvas ? canvas.width : window.innerWidth);
        }
        
        // Logik perlahankan pertukaran nombor rawak 0-9
        if (this.type === 'symbol') {
            this.frameCounter++;
            if (this.frameCounter >= this.changeInterval) {
                // Tukar ke angka rawak baru 0-9 secara santai
                this.currentRenderSymbol = Math.floor(Math.random() * 10).toString();
                this.frameCounter = 0; // Reset balik pemasa
            }
        }
    }

    draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(0, 140, 255, ${this.opacity})`; 
        
        if (this.type === 'dot') {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.font = `bold ${this.size}px 'Courier New', monospace`;
            ctx.fillText(this.currentRenderSymbol, this.x, this.y);
        }
    }
}

function init() {
    if (!canvas) return;
    // KUANTITI: Dinaikkan ke 60 supaya skrin nampak lebih padat dan sekata
    for (let i = 0; i < 60; i++) {
        particlesArray.push(new Particle());
    }
}
init();

function animate() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animate);
}

if (canvas && ctx) {
    animate();
}

// ==========================================================================
// 2. LIGHTBOX IMAGE GALLERY LOGIC (DYNAMIC MULTI-PAGE FIX)
// ==========================================================================
let currentImgIndex = 0;
let currentPageImages = []; 

const lightbox = document.getElementById('custom-lightbox');
const lightboxImg = document.getElementById('lightbox-img');

function openLightbox(index) {
    if (!lightbox || !lightboxImg) return;
    
    currentPageImages = Array.from(document.querySelectorAll('.gallery-item img, .project-img-box img, .awards-slide-img'));
    
    if (currentPageImages.length === 0 || !currentPageImages[index]) return;
    
    currentImgIndex = index;
    lightboxImg.src = currentPageImages[currentImgIndex].src;
    lightbox.style.display = 'flex'; 
}

function closeLightbox() {
    if (!lightbox) return;
    lightbox.style.display = 'none';
}

function changeImage(direction) {
    if (!lightboxImg || currentPageImages.length === 0) return;
    
    currentImgIndex += direction;
    if (currentImgIndex >= currentPageImages.length) {
        currentImgIndex = 0;
    }
    if (currentImgIndex < 0) {
        currentImgIndex = currentPageImages.length - 1;
    }
    lightboxImg.src = currentPageImages[currentImgIndex].src;
}

window.addEventListener('keydown', function(e) {
    if (lightbox && lightbox.style.display === 'flex') {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') changeImage(1);
        if (e.key === 'ArrowLeft') changeImage(-1);
    }
});

// ==========================================================================
// 3. AUTOMATIC HERO PROFILE IMAGE SLIDER (SAFETY GUARDED)
// ==========================================================================
function initHeroProfileSlider() {
    const slides = document.querySelectorAll('.slider-wrapper .profile-pic');
    if (slides.length === 0) return;

    let currentSlideIndex = 0;
    const slideDuration = 4000; 

    function executeSlideTransition() {
        if (!slides[currentSlideIndex]) return;
        slides[currentSlideIndex].classList.remove('active');
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        slides[currentSlideIndex].classList.add('active');
    }
    setInterval(executeSlideTransition, slideDuration);
}

document.addEventListener('DOMContentLoaded', initHeroProfileSlider);

// ==========================================================================
// 4. AUTOMATIC AWARDS IMAGE SLIDER (PETAK & STATIK)
// ==========================================================================
function initAwardsSlider() {
    const awardSlides = document.querySelectorAll('#awards-slider .awards-slide-img');
    if (awardSlides.length === 0) return;

    let currentAwardIndex = 0;
    const slideDuration = 4000; 

    awardSlides[currentAwardIndex].style.opacity = '1';
    awardSlides[currentAwardIndex].style.transform = 'translateX(0)';

    function nextAwardSlide() {
        awardSlides[currentAwardIndex].style.transform = 'translateX(-100%)';
        awardSlides[currentAwardIndex].style.opacity = '0';

        currentAwardIndex = (currentAwardIndex + 1) % awardSlides.length;

        awardSlides[currentAwardIndex].style.transform = 'translateX(0)';
        awardSlides[currentAwardIndex].style.opacity = '1';
    }

    setInterval(nextAwardSlide, slideDuration);
}

document.addEventListener('DOMContentLoaded', initAwardsSlider);

// ==========================================================================
// PAGE TRANSITION INTERACTION (FADE OUT BEFORE NAVIGATING)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    // Ambil semua pautan dalam navigation bar DAN butang CTA "View My Work"
    const links = document.querySelectorAll("nav .nav-links a, .cta-button");

    links.forEach(link => {
        link.addEventListener("click", function(e) {
            // Dapatkan pautan target href (contoh: about.html)
            const targetUrl = this.getAttribute("href");

            // Pastikan pautan bukan kosong, bukan '#' dan bukan jenis buka tab baharu (target="_blank")
            if (targetUrl && targetUrl !== "#" && !this.getAttribute("target")) {
                
                // Sekat fungsi lompat halaman asal secara mengejut
                e.preventDefault();

                // Tambah kelas fade-out pada body untuk mulakan animasi lesap
                document.body.classList.add("fade-out");

                // Tunggu saiz masa transition CSS (0.4 saat / 400 milisaat) selesai
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 600);
            }
        });
    });
});
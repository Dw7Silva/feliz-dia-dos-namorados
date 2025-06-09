document.addEventListener('DOMContentLoaded', function() {
    // Simular tela de carregamento
    setTimeout(() => {
        document.querySelector('.loading-screen').style.opacity = '0';
        setTimeout(() => {
            document.querySelector('.loading-screen').style.display = 'none';
        }, 1000);
    }, 2000);

    // Configuração da música de fundo
    const bgMusic = document.getElementById('bg-music');
    bgMusic.volume = 0.3;

    // Botão para iniciar a experiência
    const startBtn = document.getElementById('startBtn');
    startBtn.addEventListener('click', () => {
        bgMusic.play();
        startBtn.innerHTML = '<i class="fas fa-music"></i> Música: Nosso Lugar';
        
        // Rolar suavemente para a carta de amor
        document.getElementById('love-letter').scrollIntoView({ behavior: 'smooth' });
        
        // Iniciar animação de digitação da carta
        typeLoveLetter();
    });

    // Conteúdo da carta de amor
    const loveLetterText = `Oi, meu amor\n\nEu podia escrever mil coisas aqui tentando explicar o quanto eu te amo, mas nenhuma palavra no mundo consegue mostrar tudo que eu sinto por você.\n\nLembra da praça onde tudo começou? Aquele lugar que virou cenário das nossas risadas, conversas e também do dia em que eu te pedi em namoro. Eu tava nervoso demais, mas sabia que aquele momento ia mudar minha vida, e mudou, pra melhor.\n\nA gente se desentende às vezes, e nem é pouco, né? Mas mesmo quando as coisas ficam difíceis, é com você que eu quero estar. Amar você é isso: passar pelos altos e baixos e continuar escolhendo ficar, mesmo nas diferenças.\n\nVocê é o meu lugar seguro, meu caos preferido e o motivo de muitos sorrisos meus por aí, do nada.\n\nTe amo mais do que ontem e menos do que amanhã. Sempre.`;

    // Função para animação de digitação
    function typeLoveLetter() {
        const letterElement = document.getElementById('letter-text');
        letterElement.innerHTML = '';
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < loveLetterText.length) {
                // Adicionar caractere por caractere
                if (loveLetterText.charAt(i) === '\n') {
                    letterElement.innerHTML += '<br><br>';
                } else {
                    letterElement.innerHTML += loveLetterText.charAt(i);
                }
                i++;
                
                // Manter a carta rolada para baixo
                letterElement.scrollTop = letterElement.scrollHeight;
            } else {
                clearInterval(typingInterval);
                
                // Mostrar o quiz após a carta terminar
                setTimeout(() => {
                    document.querySelector('.quiz-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 1000);
            }
        }, 30); // Velocidade de digitação
    }

    // Configuração do quiz
    const quizQuestions = [
        {
            question: "Onde foi nosso primeiro beijo?",
            options: [
                "No cinema",
                "Na nossa praça",
                "Na exapit",
                "Na sua casa"
            ],
            correctAnswer: 2
        },
        {
            question: "Qual presente eu mais amei ganhar de você?",
            options: [
                "Aquele hotwheels",
                "A camiseta de aniversario",
                "O creme de cabelo",
                "A caixa que voce me deu nos tres meses de namoro"
            ],
            correctAnswer: 3
        },
        {
            question: "O que eu sempre falo que amo em você?",
            options: [
                "Seu sorriso",
                "Seu jeito de me fazer rir mesmo bravo",
                "Você ser meu 'lugar seguro'",
                "Seu abraço"
            ],
            correctAnswer: 2
        },
        {
            question: "Qual a nossa música?",
            options: [
                "'Nosso Lugar' – MC Kevin",
                "'Die For You' – The Weeknd",
                "'Ciumeira' – Ana Castela",
                "A gente não tem uma"
            ],
            correctAnswer: 0
        }
    ];

    // Variáveis do quiz
    let currentQuestion = 0;
    let score = 0;
    const quizContainer = document.getElementById('quiz');
    const quizResult = document.getElementById('quiz-result');
    const resultContent = document.querySelector('.result-content');

    // Inicializar quiz
    function initQuiz() {
        showQuestion();
    }

    // Mostrar pergunta atual
    function showQuestion() {
        if (currentQuestion >= quizQuestions.length) {
            showResult();
            return;
        }

        const question = quizQuestions[currentQuestion];
        let optionsHtml = '';

        question.options.forEach((option, index) => {
            optionsHtml += `
                <div class="quiz-option" data-index="${index}">
                    ${option}
                </div>
            `;
        });

        quizContainer.innerHTML = `
            <div class="quiz-question">
                <h3>${question.question}</h3>
                <div class="quiz-options">
                    ${optionsHtml}
                </div>
            </div>
        `;

        // Adicionar event listeners às opções
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', selectAnswer);
        });
    }

    // Selecionar resposta
    function selectAnswer(e) {
        const selectedOption = e.currentTarget;
        const selectedIndex = parseInt(selectedOption.getAttribute('data-index'));
        const question = quizQuestions[currentQuestion];

        // Desativar todas as opções
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.style.pointerEvents = 'none';
        });

        // Marcar resposta selecionada
        selectedOption.classList.add('selected');

        // Verificar se a resposta está correta
        if (selectedIndex === question.correctAnswer) {
            selectedOption.classList.add('correct');
            score++;
        } else {
            selectedOption.classList.add('incorrect');
            // Mostrar a resposta correta
            document.querySelector(`.quiz-option[data-index="${question.correctAnswer}"]`).classList.add('correct');
        }

        // Próxima pergunta após um breve delay
        setTimeout(() => {
            currentQuestion++;
            showQuestion();
        }, 1500);
    }

    // Mostrar resultado do quiz
    function showResult() {
        quizContainer.classList.add('hidden');
        quizResult.classList.remove('hidden');

        // Criar elementos de coração para mostrar a pontuação
        let heartsHtml = '';
        for (let i = 0; i < quizQuestions.length; i++) {
            heartsHtml += `
                <div class="heart-icon">
                    ${i < score ? '❤️' : '🤍'}
                </div>
            `;
        }

        // Mensagem baseada na pontuação
        let message = '';
        if (score === quizQuestions.length) {
            message = `
                <h3>Você me conhece como ninguém! 💯</h3>
                <p>Acertou todas as perguntas! Isso prova o quanto nossa conexão é especial.</p>
                <div class="hearts-container">
                    ${heartsHtml}
                </div>
                <p>E pra celebrar, aqui está nosso presente:</p>
            `;
        } else if (score >= quizQuestions.length / 2) {
            message = `
                <h3>Quase perfeito! 😊</h3>
                <p>Acertou ${score} de ${quizQuestions.length} perguntas! A gente ainda tem muito pra aprender um sobre o outro.</p>
                <div class="hearts-container">
                    ${heartsHtml}
                </div>
                <p>Mas o presente tá aqui igual:</p>
            `;
        } else {
            message = `
                <h3>Precisamos nos conhecer melhor! 😉</h3>
                <p>Acertou ${score} de ${quizQuestions.length} perguntas. Acho que precisamos de mais encontros!</p>
                <div class="hearts-container">
                    ${heartsHtml}
                </div>
                <p>Mas o que importa é que eu te amo, e aqui está seu presente:</p>
            `;
        }

        resultContent.innerHTML = message;

        // Adicionar animação ao presente
        setTimeout(() => {
            document.querySelector('.gift-lid').style.transform = 'translateY(-20px) rotate(-10deg)';
            document.querySelector('.gift-section').scrollIntoView({ behavior: 'smooth' });
        }, 1000);
    }

    // Reiniciar quiz
    document.getElementById('restart-quiz').addEventListener('click', () => {
        currentQuestion = 0;
        score = 0;
        quizContainer.classList.remove('hidden');
        quizResult.classList.add('hidden');
        showQuestion();
    });

    // Easter Egg do Stitch
    let clickCount = 0;
    const easterEggTrigger = document.getElementById('easter-egg-trigger');
    const easterEgg = document.getElementById('easter-egg');

    easterEggTrigger.addEventListener('click', () => {
        clickCount++;
        
        if (clickCount >= 3) {
            easterEgg.classList.add('active');
            clickCount = 0;
        }
        
        // Resetar contador após 2 segundos
        setTimeout(() => {
            clickCount = 0;
        }, 2000);
    });

    document.getElementById('close-easter-egg').addEventListener('click', () => {
        easterEgg.classList.remove('active');
    });

    // Iniciar o quiz
    initQuiz();

    // Suavizar rolagem para todas as âncoras
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Efeito parallax simples
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const letterPaper = document.querySelector('.letter-paper');
        
        if (letterPaper) {
            letterPaper.style.transform = `perspective(1000px) rotateY(${scrollPosition / 50}deg)`;
        }
    });
});